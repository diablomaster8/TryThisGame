import * as THREE from 'three';
import { HOLLOW_PERF } from '../config/tuning-dungeon-tap';
import { FIELD_R10 } from '../config/tuning-r10b2';
import { sectorWindow } from '../render/field-sectors';
import { CELL, type HollowCtx, type HollowModule } from './hollow-ctx';
import type { Floor } from '../sim/dungeon';

/**
 * Sector streaming for a big floor's scattered props in Full 3D (lane B r10, R0147; R0194).
 * The ground and rock are cut into one mesh per sector (`hollow-rock.ts`); the dress's
 * instanced scatters (rubble, stalagmites, roots and vines, ground decals) are made one mesh
 * per sector (`sectorGroups`), tagged with `userData.sectorCol` (and `sectorRow` on a dungeon
 * level), and this module shows only the sectors of the 3×3 window round the Keeper. Each
 * sector mesh keeps its own bounds, so the renderer also drops the window's sectors that are
 * out of the camera's view. A crossing only flips `visible`: nothing is built or uploaded.
 *
 * A field (R0147) is streamed by whole sector columns, as before; a big dungeon level
 * (R0194, DUNG-51) by square sectors, since its phone camera looks a long way up the screen.
 */

/**
 * The sector width (cells) a floor is streamed in, or 0 when it draws whole: a field (R0147),
 * or a big dungeon level (R0194, DUNG-51).
 */
export function sectorSizeOf(f: Floor): number {
  if (!FIELD_R10.stream) return 0;
  if (f.zone === 'field') return FIELD_R10.sector;
  return !f.zone && f.cols * f.rows >= HOLLOW_PERF.minCells ? HOLLOW_PERF.levelSector : 0;
}

/** Whether a streamed floor is cut by square sectors (a level) rather than columns (a field). */
export function sectorRows(f: Floor): boolean {
  return f.zone !== 'field' && sectorSizeOf(f) > 0;
}

/** A sector: its column, and its row (-1 when the floor streams by whole columns). */
export interface SectorKey {
  col: number;
  row: number;
}

/**
 * `list` split by sector (by each item's world x and z, from `at`) on a streamed floor; one
 * group, keyed null, elsewhere.
 */
export function sectorGroups<T>(
  f: Floor,
  list: T[],
  at: (t: T) => { x: number; z: number },
): Array<[SectorKey | null, T[]]> {
  const size = sectorSizeOf(f);
  if (!size || list.length === 0) return list.length ? [[null, list]] : [];
  const nx = Math.ceil(f.cols / size);
  const ny = sectorRows(f) ? Math.ceil(f.rows / size) : 1;
  const out: T[][] = Array.from({ length: nx * ny }, () => []);
  const clamp = (v: number, n: number) => Math.min(n - 1, Math.max(0, v));
  for (const t of list) {
    const p = at(t);
    const sx = clamp(Math.floor((p.x / CELL + f.cols / 2) / size), nx);
    const sy = ny > 1 ? clamp(Math.floor((p.z / CELL + f.rows / 2) / size), ny) : 0;
    out[sx * ny + sy]!.push(t);
  }
  return out
    .map((g, i): [SectorKey, T[]] => [{ col: Math.floor(i / ny), row: ny > 1 ? i % ny : -1 }, g])
    .filter(([, g]) => g.length > 0);
}

/**
 * Tag a sector's mesh for `HollowSectors` (nothing when the floor draws whole). A `prop` is
 * small: on a level it draws only within `HOLLOW_PERF.propReach` of the Keeper.
 */
export function tagSector(o: THREE.Object3D, key: SectorKey | null, prop = false): void {
  if (!key) return;
  o.userData.sectorCol = key.col;
  if (key.row >= 0) o.userData.sectorRow = key.row;
  if (prop) o.userData.sectorProp = true;
}

/**
 * A merged mesh cut by sector (R0194): its index is re-laid sector by sector (each triangle
 * goes to the sector under its middle) and one mesh per sector draws its own run, sharing the
 * buffers, with bounds of its own and `mesh`'s material and flags. `[mesh]` when the floor
 * draws whole. `pad` widens each part's bounds.
 */
export function sectorParts(f: Floor, mesh: THREE.Mesh, pad = 0.5): THREE.Mesh[] {
  const g = mesh.geometry;
  const idx = g.index;
  if (!sectorSizeOf(f) || !idx) return [mesh];
  const pos = g.getAttribute('position') as THREE.BufferAttribute;
  const n = idx.count / 3;
  const cx = new Float32Array(n);
  const cz = new Float32Array(n);
  for (let t = 0; t < n; t++) {
    let x = 0;
    let z = 0;
    for (let k = 0; k < 3; k++) {
      const v = idx.getX(t * 3 + k);
      x += pos.getX(v);
      z += pos.getZ(v);
    }
    cx[t] = x / 3;
    cz[t] = z / 3;
  }
  const tris = Array.from({ length: n }, (_, t) => t);
  const groups = sectorGroups(f, tris, (t) => ({ x: cx[t]!, z: cz[t]! }));
  const out = new Uint32Array(idx.count);
  const parts: THREE.Mesh[] = [];
  const box = new THREE.Box3();
  const v = new THREE.Vector3();
  let at = 0;
  for (const [key, list] of groups) {
    const start = at;
    box.makeEmpty();
    for (const t of list)
      for (let k = 0; k < 3; k++) {
        const i = idx.getX(t * 3 + k);
        out[at++] = i;
        box.expandByPoint(v.fromBufferAttribute(pos, i));
      }
    const part = new THREE.BufferGeometry();
    for (const [name, a] of Object.entries(g.attributes)) part.setAttribute(name, a);
    part.setDrawRange(start, at - start);
    part.boundingSphere = box.getBoundingSphere(new THREE.Sphere());
    part.boundingSphere.radius += pad;
    const m = new THREE.Mesh(part, mesh.material);
    m.name = mesh.name;
    m.castShadow = mesh.castShadow;
    m.receiveShadow = mesh.receiveShadow;
    m.renderOrder = mesh.renderOrder;
    if (mesh.customDepthMaterial) m.customDepthMaterial = mesh.customDepthMaterial;
    tagSector(m, key);
    parts.push(m);
  }
  const index = new THREE.BufferAttribute(out, 1);
  g.setIndex(index);
  for (const m of parts) m.geometry.setIndex(index);
  return parts;
}

export class HollowSectors implements HollowModule {
  private meshes: THREE.Object3D[] = [];
  private floor: Floor | null = null;
  private key = -1;

  build(f: Floor, ctx: HollowCtx): void {
    this.floor = sectorSizeOf(f) ? f : null;
    this.key = -1;
    this.meshes = this.floor
      ? ctx.group.children.filter((o) => typeof o.userData.sectorCol === 'number')
      : [];
  }

  dispose(): void {
    this.meshes = [];
    this.floor = null;
  }

  update(_t: number, keeper: { x: number; z: number }): void {
    const f = this.floor;
    if (!f || this.meshes.length === 0) return;
    const size = sectorSizeOf(f);
    const rows = sectorRows(f);
    const cx = Math.floor(keeper.x / CELL + f.cols / 2);
    const cy = rows ? Math.floor(keeper.z / CELL + f.rows / 2) : 0;
    // The props' reach, in sectors: those overlapping the square round the Keeper's cell.
    const R = HOLLOW_PERF.propReach;
    const near = {
      sx0: Math.floor((cx - R) / size),
      sx1: Math.floor((cx + R) / size),
      sy0: Math.floor((cy - R) / size),
      sy1: Math.floor((cy + R) / size),
    };
    // Re-checked on each cell crossing (a few hundred flags), since the reach moves by cells.
    const key = cx * 4096 + cy;
    if (key === this.key) return;
    this.key = key;
    const w = sectorWindow(f.cols, f.rows, size, cx, cy);
    for (const m of this.meshes) {
      const c = m.userData.sectorCol as number;
      const r = m.userData.sectorRow as number | undefined;
      const b = rows && m.userData.sectorProp ? near : w;
      m.visible = c >= b.sx0 && c <= b.sx1 && (r === undefined || (r >= b.sy0 && r <= b.sy1));
    }
  }
}
