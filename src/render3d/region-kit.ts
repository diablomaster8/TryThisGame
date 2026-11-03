import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import type { LayoutChunk, RegionLayout } from '../config/region-layout';
import type { ChunkLRU } from '../render/chunks';
import { terracedPlane } from '../render/region-kit-px';
import {
  groundSize,
  groundTexture,
  paintRegionGround,
  type GroundLook,
  type GroundPaint,
} from '../render/region-ground';
import type { Region3d, Region3dModule } from './region-host';
import type { Vec2, World } from '../sim/types';

/**
 * R11 lane D (d7): the Full 3D half of a region built on the engine, from a style: the Wood's
 * module (`region-wood.ts`) made generic. The draws stay flat whatever the region's size: the
 * painted ground (the pixel view's canvas, so both renderers agree), three instanced fill
 * batches, a tuft batch, a prop batch and one merged mesh of the region's fixed pieces, plus
 * whatever `decorate` adds (the sea, a lake: one mesh each). All share one flat-shaded vertex-
 * coloured standard material, so the host links a handful of programs on the approach.
 */

/** Paint a geometry one colour (as a vertex attribute) and make it non-indexed for merging. */
export function tinted(g: THREE.BufferGeometry, c: THREE.Color | string, jitter = 0) {
  const col3 = typeof c === 'string' ? new THREE.Color(c) : c;
  const out = g.index ? g.toNonIndexed() : g;
  const n = out.attributes.position!.count;
  const col = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) {
    const f = 1 + (jitter ? (((i * 7919) % 13) / 13 - 0.5) * jitter : 0);
    col[i * 3] = col3.r * f;
    col[i * 3 + 1] = col3.g * f;
    col[i * 3 + 2] = col3.b * f;
  }
  out.setAttribute('color', new THREE.BufferAttribute(col, 3));
  out.deleteAttribute('uv');
  return out;
}

export function at(g: THREE.BufferGeometry, x: number, y: number, z: number) {
  g.translate(x, y, z);
  return g;
}

export function merged(parts: THREE.BufferGeometry[]): THREE.BufferGeometry {
  const g = mergeGeometries(parts)!;
  g.computeVertexNormals();
  g.computeBoundingSphere();
  for (const p of parts) p.dispose();
  return g;
}

/** A thin plane of tufts (three blades), like the Wood's, in a colour. */
export function tuftGeo(c: string): THREE.BufferGeometry {
  const g = new THREE.BufferGeometry();
  const p: number[] = [];
  for (let i = 0; i < 3; i++) {
    const a = (i / 3) * Math.PI * 2;
    const cx = Math.cos(a) * 0.12;
    const cz = Math.sin(a) * 0.12;
    const lx = Math.cos(a + 1.6) * 0.09;
    const lz = Math.sin(a + 1.6) * 0.09;
    p.push(cx - lx, 0, cz - lz, cx + lx, 0, cz + lz, cx * 2.2, 0.55, cz * 2.2);
  }
  g.setAttribute('position', new THREE.Float32BufferAttribute(p, 3));
  return merged([tinted(g, c)]);
}

export interface Kit3dDecor {
  tick?(t: number, still: boolean): void;
  sync?(world: World): void;
  dispose(): void;
}

export interface Kit3dStyle {
  name: string;
  look: GroundLook;
  paint?: GroundPaint;
  /** The three fill-tree looks. */
  fill: () => [THREE.BufferGeometry, THREE.BufferGeometry, THREE.BufferGeometry];
  tuft: string;
  prop: () => THREE.BufferGeometry;
  /** The fixed pieces, merged into one mesh (in region coordinates). */
  pieces: (l: RegionLayout) => THREE.BufferGeometry;
  /** The fill's height above the ground (a terraced region), by position. */
  heightAt?: (x: number, z: number) => number;
  /** Extra meshes (sea, lake, lights) added to the group, built with the shared material or their own. */
  decorate?: (group: THREE.Group, l: RegionLayout, mat: THREE.Material) => Kit3dDecor;
  arch: () => THREE.BufferGeometry;
  /** Fold tall fill out of the camera's line to the Keeper (a wood; off for low fill). */
  fold: boolean;
  /** The painting clears ground a seamless neighbour shows through (alpha-tested). */
  cut?: boolean;
}

let sharedMat: THREE.MeshStandardMaterial | null = null;

/** The one material every kit region shares (vertex colours, flat shaded). */
export function kitMaterial(): THREE.MeshStandardMaterial {
  return (sharedMat ??= new THREE.MeshStandardMaterial({
    vertexColors: true,
    roughness: 1,
    metalness: 0,
    flatShading: true,
    side: THREE.DoubleSide,
  }));
}

const BATCHES = 5;
const CLEAR_R = 2.3;
const FOLD = [0, 1, 2, 4, 5, 6, 8, 9, 10];
const tmpM = new THREE.Matrix4();
const tmpQ = new THREE.Quaternion();
const tmpP = new THREE.Vector3();
const tmpS = new THREE.Vector3();
const UP = new THREE.Vector3(0, 1, 0);

class Kit3d implements Region3d {
  readonly group = new THREE.Group();
  private readonly batches: THREE.InstancedMesh[] = [];
  private readonly groundTex: THREE.CanvasTexture;
  private readonly owned: THREE.BufferGeometry[] = [];
  private readonly mats: THREE.Material[] = [];
  private readonly decor: Kit3dDecor | null;
  private readonly orig: Float32Array[] = [];
  private readonly hidden: Uint8Array[] = [];

  constructor(
    private readonly l: RegionLayout,
    private readonly s: Kit3dStyle,
  ) {
    this.group.name = `region-${s.name}`;
    const mat = kitMaterial();
    this.groundTex = groundTexture(paintRegionGround(l, s.look, false, s.paint));
    const gg = terracedPlane(groundSize(l).w, groundSize(l).h, s.heightAt);
    const gm = new THREE.MeshStandardMaterial({
      map: this.groundTex,
      roughness: 1,
      metalness: 0,
      alphaTest: s.cut ? 0.75 : 0,
    });
    const ground = new THREE.Mesh(gg, gm);
    ground.receiveShadow = true;
    ground.name = `${s.name}-ground`;
    ground.userData.pick = { kind: 'ground', id: 'ground' };
    this.group.add(ground);
    this.owned.push(gg);
    this.mats.push(gm);
    const cap = [0, 0, 0];
    for (const t of l.trees) cap[t.kind]!++;
    const geos = [...s.fill(), tuftGeo(s.tuft), s.prop()];
    const caps = [...cap, l.chunks.size * 64, Math.max(1, l.props.length)];
    geos.forEach((geo, i) => {
      const m = new THREE.InstancedMesh(geo, mat, Math.max(1, caps[i]!));
      m.count = 0;
      m.castShadow = i < 3;
      m.receiveShadow = i >= 3;
      m.frustumCulled = false;
      m.name = `${s.name}-batch-${i}`;
      this.batches.push(m);
      this.group.add(m);
      this.owned.push(geo);
    });
    const lm = new THREE.Mesh(s.pieces(l), mat);
    lm.castShadow = true;
    lm.receiveShadow = true;
    lm.name = `${s.name}-pieces`;
    this.group.add(lm);
    this.owned.push(lm.geometry);
    this.decor = s.decorate ? s.decorate(this.group, l, mat) : null;
  }

  private build(c: LayoutChunk, clip: boolean): Float32Array[] {
    const lists: number[][] = Array.from({ length: BATCHES }, () => []);
    const hw = this.l.spec.size.w / 2;
    const hh = this.l.spec.size.h / 2;
    const h = this.s.heightAt;
    const put = (b: number, x: number, z: number, s: number, yaw: number) => {
      if (clip && (Math.abs(x) > hw || Math.abs(z) > hh)) return;
      tmpP.set(x, h ? h(x, z) : 0, z);
      tmpQ.setFromAxisAngle(UP, yaw);
      tmpS.setScalar(s);
      tmpM.compose(tmpP, tmpQ, tmpS);
      lists[b]!.push(...tmpM.elements);
    };
    for (const i of c.trees) {
      const t = this.l.trees[i]!;
      put(t.kind, t.x, t.z, t.s, (i * 2.399) % (Math.PI * 2));
    }
    for (let i = 0; i < c.tufts.length; i += 3)
      put(3, c.tufts[i]!, c.tufts[i + 1]!, c.tufts[i + 2]!, i);
    for (const i of c.props) {
      const p = this.l.props[i]!;
      put(4, p.x, p.z, 0.8 + (p.kind % 3) * 0.2, i);
    }
    return lists.map((l) => new Float32Array(l));
  }

  setChunks(chunks: readonly LayoutChunk[], cache: ChunkLRU<Float32Array[]>, clip: boolean): void {
    const counts = new Array<number>(BATCHES).fill(0);
    for (const c of chunks) {
      const key = `${c.cx},${c.cz}${clip ? 'c' : ''}`;
      let data = cache.get(key);
      if (!data) {
        data = this.build(c, clip);
        cache.set(
          key,
          data,
          data.reduce((n, a) => n + a.byteLength, 0),
        );
      }
      data.forEach((arr, b) => {
        const m = this.batches[b]!;
        const n = arr.length / 16;
        if (counts[b]! + n > m.instanceMatrix.count) return;
        (m.instanceMatrix.array as Float32Array).set(arr, counts[b]! * 16);
        counts[b]! += n;
      });
    }
    this.batches.forEach((m, b) => {
      m.count = counts[b]!;
      m.instanceMatrix.clearUpdateRanges();
      m.instanceMatrix.addUpdateRange(0, counts[b]! * 16);
      m.instanceMatrix.needsUpdate = true;
      if (b < 3 && this.s.fold) {
        const a = m.instanceMatrix.array as Float32Array;
        this.orig[b] = a.slice(0, counts[b]! * 16);
        this.hidden[b] = new Uint8Array(counts[b]!);
      }
    });
  }

  tick(t: number, still: boolean, cam: THREE.Vector3, keeper: Vec2): void {
    if (this.s.fold) this.clearView(cam, keeper);
    this.decor?.tick?.(t, still);
  }

  sync(world: World): void {
    this.decor?.sync?.(world);
  }

  /** As the Wood: a fill tree between the camera and the Keeper folds away until the view clears. */
  private clearView(cam: THREE.Vector3, k: Vec2): void {
    const dx = k.x - cam.x;
    const dz = k.z - cam.z;
    const l2 = dx * dx + dz * dz;
    if (l2 < 1e-6) return;
    for (let b = 0; b < 3; b++) {
      const orig = this.orig[b];
      const hid = this.hidden[b];
      if (!orig || !hid) continue;
      const arr = this.batches[b]!.instanceMatrix.array as Float32Array;
      let lo = Infinity;
      let hi = -1;
      for (let i = 0; i < hid.length; i++) {
        const px = orig[i * 16 + 12]! - cam.x;
        const pz = orig[i * 16 + 14]! - cam.z;
        const t = (px * dx + pz * dz) / l2;
        let block = false;
        if (t > 0.02 && t < 0.94) {
          const ex = px - dx * t;
          const ez = pz - dz * t;
          block = ex * ex + ez * ez < CLEAR_R * CLEAR_R * orig[i * 16 + 5]! ** 2;
        }
        if (+block === hid[i]) continue;
        hid[i] = +block;
        const o = i * 16;
        if (block) for (const j of FOLD) arr[o + j] = 0;
        else for (const j of FOLD) arr[o + j] = orig[o + j]!;
        lo = Math.min(lo, o);
        hi = Math.max(hi, o + 16);
      }
      if (hi > lo) {
        const im = this.batches[b]!.instanceMatrix;
        im.clearUpdateRanges();
        im.addUpdateRange(lo, hi - lo);
        im.needsUpdate = true;
      }
    }
  }

  dispose(): void {
    this.decor?.dispose();
    for (const g of this.owned) g.dispose();
    for (const m of this.mats) m.dispose();
    for (const b of this.batches) b.dispose();
    this.groundTex.dispose();
  }
}

/** A region's 3D module from its style (what `REGION_3D` loads). */
export function kit3dModule(s: Kit3dStyle): Region3dModule {
  let arch: THREE.Mesh | null = null;
  return {
    createRegion3d: (l) => new Kit3d(l, s),
    entrance() {
      if (!arch) {
        arch = new THREE.Mesh(s.arch(), kitMaterial());
        arch.castShadow = true;
        arch.name = `${s.name}-arch`;
      }
      return arch;
    },
  };
}
