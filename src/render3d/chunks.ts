import * as THREE from 'three';
import { WORLD_LOD, WORLD_STREAM } from '../config/tuning-world';
import { TERRAIN_SEGS, TERRAIN_SIZE } from './terrain-shape';

/**
 * WORLD-09: the Full 3D ground drawn chunk by chunk. The terrain is one grid of about 100k
 * triangles, and as one mesh it is drawn whole whenever any of it is on screen, twice on a
 * shadow frame (it casts onto itself). Here it is cut into the `WORLD_STREAM.chunk` squares
 * of `render/chunks.ts`, and its index buffer is rewritten to hold only the chunks whose
 * box, grown by `WORLD_LOD.terrainMargin` for the shadows a hill just off screen throws in,
 * meets the camera's frustum. Still one draw call and one program; the vertices never move,
 * so there is no seam and nothing to pop. The index is rewritten only when the set changes
 * (a chunk edge crossed, the camera turned), and the bounding sphere stays the whole
 * field's. A tap is resolved against the heightfield, not this mesh, so picking is unchanged.
 */
interface Chunk {
  box: THREE.Box3;
  /** First cell column and row, and the run of cells it covers each way. */
  ix: number;
  iy: number;
  w: number;
  h: number;
}

const frustum = new THREE.Frustum();
const projView = new THREE.Matrix4();
const grown = new THREE.Box3();
const pad = new THREE.Vector3();

export class TerrainChunks {
  private geo: THREE.BufferGeometry | null = null;
  private full: Uint16Array | Uint32Array | null = null;
  private chunks: Chunk[] = [];
  private key = '';
  /** Chunks drawn, of all, after the last update (the debug readout). */
  drawn = 0;
  total = 0;
  /** WORLD-46: hold the current set (the debug panel's "Freeze streaming"). */
  frozen = false;

  /** Cut a freshly poured terrain geometry into chunks. */
  private adopt(geo: THREE.BufferGeometry): void {
    this.geo = geo;
    this.key = '';
    const index = geo.index;
    const pos = geo.attributes.position as THREE.BufferAttribute | undefined;
    const segs = TERRAIN_SEGS;
    if (!index || !pos || index.count !== segs * segs * 6) {
      // The one-triangle placeholder, before the worker pours the real grid.
      this.full = null;
      this.chunks = [];
      return;
    }
    this.full = (index.array as Uint16Array | Uint32Array).slice();
    const cell = TERRAIN_SIZE / segs;
    const per = Math.max(1, Math.round(WORLD_STREAM.chunk / cell));
    const half = TERRAIN_SIZE / 2;
    const row = segs + 1;
    this.chunks = [];
    for (let iy = 0; iy < segs; iy += per) {
      for (let ix = 0; ix < segs; ix += per) {
        const w = Math.min(per, segs - ix);
        const h = Math.min(per, segs - iy);
        let lo = Infinity;
        let hi = -Infinity;
        for (let y = iy; y <= iy + h; y++) {
          for (let x = ix; x <= ix + w; x++) {
            const v = pos.getY(y * row + x);
            if (v < lo) lo = v;
            if (v > hi) hi = v;
          }
        }
        const box = new THREE.Box3(
          new THREE.Vector3(-half + ix * cell, lo, -half + iy * cell),
          new THREE.Vector3(-half + (ix + w) * cell, hi, -half + (iy + h) * cell),
        );
        this.chunks.push({ box, ix, iy, w, h });
      }
    }
    this.total = this.chunks.length;
  }

  /** Keep `mesh`'s index to the chunks `camera` can see (or shade); call before drawing. */
  update(mesh: THREE.Mesh, camera: THREE.Camera): void {
    if (mesh.geometry !== this.geo) this.adopt(mesh.geometry);
    const full = this.full;
    const index = mesh.geometry.index;
    if (!full || !index || this.frozen) return;
    projView.multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse);
    frustum.setFromProjectionMatrix(projView);
    const m = WORLD_LOD.terrainMargin;
    pad.set(m, 0, m);
    let key = '';
    for (const c of this.chunks) {
      grown.copy(c.box).expandByVector(pad);
      key += frustum.intersectsBox(grown) ? '1' : '0';
    }
    if (key === this.key) return;
    this.key = key;
    const out = index.array as Uint16Array | Uint32Array;
    const segs = TERRAIN_SEGS;
    let n = 0;
    this.drawn = 0;
    for (let i = 0; i < this.chunks.length; i++) {
      if (key[i] !== '1') continue;
      const c = this.chunks[i]!;
      this.drawn++;
      for (let y = c.iy; y < c.iy + c.h; y++) {
        const from = (y * segs + c.ix) * 6;
        out.set(full.subarray(from, from + c.w * 6), n);
        n += c.w * 6;
      }
    }
    index.clearUpdateRanges();
    index.addUpdateRange(0, n);
    index.needsUpdate = true;
    mesh.geometry.setDrawRange(0, n);
  }
}
