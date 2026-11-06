import * as THREE from 'three';
import type { Floor } from '../sim/dungeon';
import { sectorLods, tagSector, type SectorKey } from './hollow-sectors';

/**
 * Low detail for a big Hollow level's far sectors (R0194 part 2, DUNG-51), and the packs that
 * keep a whole-floor draw to the sectors round the Keeper.
 *
 * The ground's cut, thinned without moving a vertex. `hollow-rock.ts` cuts each ground cell into `S`×`S`
 * sub-quads so a terrace edge is a short ledge; far away, the sub-quads that lie in one plane
 * are drawn as one rectangle over the same vertices (so the baked colour and light are the
 * same), and only the ledge's own slope keeps its fine cut. Every vertex a rectangle passes
 * over sits on it, so a rectangle's edge never opens a crack against its fine neighbours.
 */

/** A rectangle of sub-quads, `[i0, j0, i1, j1]` in sub-steps (i1 and j1 exclusive). */
export type SubRect = [number, number, number, number];

/**
 * Whether every vertex of the sub-grid rectangle lies within `eps` of the two triangles its
 * corners make: (i0,j0)-(i0,j1)-(i1,j0) and (i1,j0)-(i0,j1)-(i1,j1), the ground's split.
 */
export function planarRect(
  h: (i: number, j: number) => number,
  [i0, j0, i1, j1]: SubRect,
  eps: number,
): boolean {
  const a = h(i0, j0);
  const b = h(i1, j0);
  const c = h(i0, j1);
  const d = h(i1, j1);
  for (let j = j0; j <= j1; j++)
    for (let i = i0; i <= i1; i++) {
      const u = (i - i0) / (i1 - i0);
      const v = (j - j0) / (j1 - j0);
      const want =
        u + v <= 1 ? a + u * (b - a) + v * (c - a) : d + (1 - u) * (c - d) + (1 - v) * (b - d);
      if (Math.abs(h(i, j) - want) > eps) return false;
    }
  return true;
}

/**
 * One cell's `S`×`S` sub-quads as few planar rectangles as a greedy pass finds: each
 * rectangle starts at the first sub-quad not yet covered, grows along i, then along j, while
 * it stays planar. A flat cell is one rectangle; a cell with a ledge along one side is two
 * or three. `h(i, j)` is the height at sub-vertex (i, j) of the cell, 0..S each way.
 */
export function cellRects(h: (i: number, j: number) => number, S: number, eps: number): SubRect[] {
  // Most cells are flat: one check settles them.
  if (planarRect(h, [0, 0, S, S], eps)) return [[0, 0, S, S]];
  const done = new Uint8Array(S * S);
  const out: SubRect[] = [];
  const free = (i0: number, j0: number, i1: number, j1: number): boolean => {
    for (let j = j0; j < j1; j++) for (let i = i0; i < i1; i++) if (done[j * S + i]) return false;
    return true;
  };
  for (let j0 = 0; j0 < S; j0++)
    for (let i0 = 0; i0 < S; i0++) {
      if (done[j0 * S + i0]) continue;
      let i1 = i0 + 1;
      while (i1 < S && free(i1, j0, i1 + 1, j0 + 1) && planarRect(h, [i0, j0, i1 + 1, j0 + 1], eps))
        i1++;
      let j1 = j0 + 1;
      while (j1 < S && free(i0, j1, i1, j1 + 1) && planarRect(h, [i0, j0, i1, j1 + 1], eps)) j1++;
      for (let j = j0; j < j1; j++) for (let i = i0; i < i1; i++) done[j * S + i] = 1;
      out.push([i0, j0, i1, j1]);
    }
  return out;
}

/**
 * A low-detail twin of a sector's instanced props: `geo` drawn over the same instances (it
 * shares `im`'s matrices and colours, so a shrink moves both), tagged `lo` and `im` `hi`
 * for `HollowSectors` to swap by distance. Starts hidden. Bounds are `im`'s instances now.
 */
export function lodTwin(
  im: THREE.InstancedMesh,
  geo: THREE.BufferGeometry,
  key: SectorKey,
): THREE.InstancedMesh {
  const lo = new THREE.InstancedMesh(geo, im.material, im.count);
  lo.instanceMatrix = im.instanceMatrix;
  if (im.instanceColor) lo.instanceColor = im.instanceColor;
  lo.castShadow = im.castShadow;
  lo.receiveShadow = im.receiveShadow;
  lo.renderOrder = im.renderOrder;
  lo.computeBoundingSphere();
  im.userData.sectorLod = 'hi';
  tagSector(lo, key, true, 'lo');
  lo.visible = false;
  return lo;
}

/**
 * What `HollowSectors` calls on a big level when the Keeper's 3×3 sector window moves:
 * `inside` says whether a world point lies in the window. Kept on `userData.sectorPack`.
 */
export interface SectorPack {
  pack(inside: (x: number, z: number) => boolean): void;
}

/**
 * A whole-floor instanced mesh (mushrooms, glows) cut to the sector window in one draw: on
 * each window move the instances inside are copied to the front and `count` drawn, so the
 * far ones cost nothing and nothing else changes. Callers keep their own (logical) instance
 * numbers: `slot` maps one to where it is drawn now (-1: outside), and `setColorAt` writes
 * through it. Until the first pack every instance draws where it was built.
 */
export class InstancePack implements SectorPack {
  /** Each logical instance's drawn slot now, or -1. */
  readonly slot: Int32Array;
  /** How many instances the window holds (they are slots 0..shown-1, in logical order). */
  shown: number;
  private readonly mat: Float32Array;
  private readonly col: Float32Array | null;

  constructor(
    readonly mesh: THREE.InstancedMesh,
    private readonly at: ReadonlyArray<{ x: number; z: number }>,
    /** Leave `mesh.count` to the owner (the glows draw their flashes only while lit). */
    private readonly ownCount = false,
  ) {
    const n = at.length;
    this.slot = Int32Array.from({ length: n }, (_, i) => i);
    this.shown = n;
    this.mat = Float32Array.from(mesh.instanceMatrix.array.subarray(0, n * 16));
    this.col = mesh.instanceColor
      ? Float32Array.from(mesh.instanceColor.array.subarray(0, n * 3))
      : null;
    mesh.userData.sectorPack = this;
  }

  /** How many of the logical instances before `n` are drawn now. */
  shownBefore(n: number): number {
    let k = 0;
    for (let i = 0; i < n; i++) if (this.slot[i]! >= 0) k++;
    return k;
  }

  setColorAt(i: number, c: THREE.Color): void {
    if (this.col) c.toArray(this.col, i * 3);
    const s = this.slot[i]!;
    if (s >= 0) this.mesh.setColorAt(s, c);
  }

  pack(inside: (x: number, z: number) => boolean): void {
    const m = this.mesh;
    const mats = m.instanceMatrix.array as Float32Array;
    const cols = m.instanceColor?.array as Float32Array | undefined;
    let k = 0;
    this.at.forEach((p, i) => {
      if (!inside(p.x, p.z)) {
        this.slot[i] = -1;
        return;
      }
      this.slot[i] = k;
      mats.set(this.mat.subarray(i * 16, i * 16 + 16), k * 16);
      if (cols && this.col) cols.set(this.col.subarray(i * 3, i * 3 + 3), k * 3);
      k++;
    });
    this.shown = k;
    if (!this.ownCount) m.count = k;
    m.instanceMatrix.needsUpdate = true;
    if (m.instanceColor) m.instanceColor.needsUpdate = true;
    // Bounds of what is drawn now (an old window's would cull the new one wrongly).
    if (k > 0) m.computeBoundingSphere();
    m.visible = k > 0;
  }
}

/**
 * A whole-floor merged mesh (the still pools) cut to the sector window in one draw: on each
 * window move the triangles inside go to the front of its index and the draw range covers
 * them. Until the first pack it draws whole.
 */
export class IndexPack implements SectorPack {
  private readonly tris: Uint32Array;
  private readonly mid: Float32Array;

  constructor(readonly mesh: THREE.Mesh) {
    const g = mesh.geometry;
    const idx = g.index!;
    const pos = g.getAttribute('position');
    this.tris = Uint32Array.from(idx.array);
    const n = this.tris.length / 3;
    this.mid = new Float32Array(n * 2);
    for (let t = 0; t < n; t++) {
      let x = 0;
      let z = 0;
      for (let k = 0; k < 3; k++) {
        const v = this.tris[t * 3 + k]!;
        x += pos.getX(v) / 3;
        z += pos.getZ(v) / 3;
      }
      this.mid[t * 2] = x;
      this.mid[t * 2 + 1] = z;
    }
    // A 32-bit index we can rewrite in place.
    g.setIndex(new THREE.BufferAttribute(Uint32Array.from(this.tris), 1));
    mesh.userData.sectorPack = this;
  }

  pack(inside: (x: number, z: number) => boolean): void {
    const idx = this.mesh.geometry.index!;
    const out = idx.array as Uint32Array;
    let k = 0;
    for (let t = 0; t < this.mid.length / 2; t++) {
      if (!inside(this.mid[t * 2]!, this.mid[t * 2 + 1]!)) continue;
      out.set(this.tris.subarray(t * 3, t * 3 + 3), k);
      k += 3;
    }
    this.mesh.geometry.setDrawRange(0, k);
    idx.needsUpdate = true;
    this.mesh.visible = k > 0;
  }
}

/** `mesh` cut to the sector window on a big level (an `IndexPack`); whole elsewhere. */
export function windowed<T extends THREE.Mesh>(f: Floor, mesh: T): T {
  if (sectorLods(f)) new IndexPack(mesh);
  return mesh;
}
