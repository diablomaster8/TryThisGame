import * as THREE from 'three';
import { GROVE3D } from '../config/tuning';
import { GROVE_CHUNKS } from '../config/tuning-more/world-region-moves';
import { WORLD_STREAM } from '../config/tuning-world';

/**
 * WORLD-09 (R12 lane D): the 3D Grove's grass by 16 u chunk. The two instanced passes hold
 * ~12 500 tufts each over the whole 88 u meadow and were drawn whole from any spot. Here each
 * tuft is filed under its chunk once it is poured; when the set of chunks the camera can see
 * (and that sit inside the far fade, past which a tuft has shrunk to nothing) changes, the
 * instances of those chunks are packed to the front of the buffers in their poured order and
 * `count` cut to them. Still one draw per pass and one program; the governor's thinning
 * (`budgetGeometry`) keeps taking an even share because the order stays the poured one.
 */
const frustum = new THREE.Frustum();
const projView = new THREE.Matrix4();
const box = new THREE.Box3();

interface Pass {
  mesh: THREE.InstancedMesh;
  matrices: Float32Array;
  colours: Float32Array;
  chunk: Uint16Array;
  total: number;
}

export class GrassChunks {
  private passes: Pass[] = [];
  private boxes: THREE.Box3[] = [];
  private centres: Array<{ x: number; z: number }> = [];
  private on = new Uint8Array(0);
  private next = new Uint8Array(0);
  private first = true;
  /** Chunks drawn and tufts kept on the last change (the debug readout). */
  live = 0;
  kept = 0;
  /** The debug panel's "Freeze streaming" holds the set. */
  frozen = false;

  get ready(): boolean {
    return this.passes.length > 0;
  }

  /** File the poured tufts under their chunks (once, after `pourGrass`). */
  adopt(meshes: readonly THREE.InstancedMesh[]): void {
    const size = WORLD_STREAM.chunk;
    const half = GROVE3D.grassHalf;
    const per = Math.ceil((half * 2) / size);
    this.boxes = [];
    this.centres = [];
    for (let iz = 0; iz < per; iz++) {
      for (let ix = 0; ix < per; ix++) {
        const x0 = -half + ix * size;
        const z0 = -half + iz * size;
        this.boxes.push(
          new THREE.Box3(
            new THREE.Vector3(x0, GROVE_CHUNKS.grassLow, z0),
            new THREE.Vector3(x0 + size, GROVE_CHUNKS.grassHigh, z0 + size),
          ),
        );
        this.centres.push({ x: x0 + size / 2, z: z0 + size / 2 });
      }
    }
    this.on = new Uint8Array(this.boxes.length);
    this.next = new Uint8Array(this.boxes.length);
    this.passes = [];
    for (const mesh of meshes) {
      const colour = mesh.instanceColor;
      if (!colour) continue;
      const total = mesh.count;
      const matrices = (mesh.instanceMatrix.array as Float32Array).slice(0, total * 16);
      const colours = (colour.array as Float32Array).slice(0, total * 3);
      const chunk = new Uint16Array(total);
      for (let i = 0; i < total; i++) {
        const x = matrices[i * 16 + 12]!;
        const z = matrices[i * 16 + 14]!;
        const cx = Math.min(per - 1, Math.max(0, Math.floor((x + half) / size)));
        const cz = Math.min(per - 1, Math.max(0, Math.floor((z + half) / size)));
        chunk[i] = cz * per + cx;
      }
      // Bounds over every tuft, kept: a packed subset must never be culled by a sphere
      // measured round another subset.
      mesh.computeBoundingSphere();
      mesh.computeBoundingBox();
      this.passes.push({ mesh, matrices, colours, chunk, total });
    }
    this.first = true;
  }

  /**
   * Keep the meshes to the chunks `camera` sees; returns true when the instances were
   * repacked (the caller resets the governor's full count).
   */
  update(camera: THREE.Camera, fadeTo: number): boolean {
    if (!this.passes.length || this.frozen) return false;
    projView.multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse);
    frustum.setFromProjectionMatrix(projView);
    const m = GROVE_CHUNKS.grassMargin;
    const camX = camera.position.x;
    const camZ = camera.position.z;
    // A chunk whose nearest point is past the fade's end draws only zero-size tufts.
    const reach = fadeTo + WORLD_STREAM.chunk * 0.71;
    let changed = this.first;
    let live = 0;
    for (let c = 0; c < this.boxes.length; c++) {
      const ctr = this.centres[c]!;
      box.copy(this.boxes[c]!).expandByScalar(m);
      const v = Math.hypot(ctr.x - camX, ctr.z - camZ) <= reach && frustum.intersectsBox(box);
      this.next[c] = v ? 1 : 0;
      if (v) live++;
      if (this.next[c] !== this.on[c]) changed = true;
    }
    if (!changed) return false;
    this.first = false;
    this.on.set(this.next);
    this.live = live;
    this.kept = 0;
    for (const p of this.passes) {
      const outM = p.mesh.instanceMatrix.array as Float32Array;
      const colour = p.mesh.instanceColor!;
      const outC = colour.array as Float32Array;
      let n = 0;
      for (let i = 0; i < p.total; i++) {
        if (this.on[p.chunk[i]!] !== 1) continue;
        if (n !== i) {
          outM.set(p.matrices.subarray(i * 16, i * 16 + 16), n * 16);
          outC.set(p.colours.subarray(i * 3, i * 3 + 3), n * 3);
        }
        n++;
      }
      // Instances before the first skipped one never moved; upload from there on.
      p.mesh.instanceMatrix.clearUpdateRanges();
      p.mesh.instanceMatrix.addUpdateRange(0, n * 16);
      p.mesh.instanceMatrix.needsUpdate = true;
      colour.clearUpdateRanges();
      colour.addUpdateRange(0, n * 3);
      colour.needsUpdate = true;
      p.mesh.count = n;
      this.kept += n;
    }
    return true;
  }
}
