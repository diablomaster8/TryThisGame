import * as THREE from 'three';
import { CG_C } from '../config/tuning-c';
import { leafHinge, pennedSpots } from '../render/corvin-layout';
import { NUMBER_CELL, numberAtlasSize, numberCell, paintNumberAtlas } from '../render/number-atlas';
import { C, color } from '../render/sprites/palette';
import { bevelBox } from './building-kit';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';

/**
 * The live parts of Corvin's garden in 3D (campaign graphics C8, H15), which read the
 * story each frame: a gate leaf on each pen's east wall that swings open when chapter 9
 * has set the pens free (three leaves, one instanced mesh), and a painted number on the
 * back of every penned grey Nubbin (thirty cards, one merged mesh, one atlas texture).
 */
export class CorvinDress {
  readonly group = new THREE.Group();
  private readonly leaves: THREE.InstancedMesh;
  private readonly angles = [0, 0, 0];
  private readonly m4 = new THREE.Matrix4();
  private readonly q = new THREE.Quaternion();
  private readonly up = new THREE.Vector3(0, 1, 0);
  private readonly disposables: Array<{ dispose(): void }> = [];

  constructor() {
    const len = CG_C.corvin.leaf.len;
    // A leaf: two rails and an end stile, lying along +z from its hinge.
    const rails = [0.35, 0.8].map((y) => bevelBox(0.1, 0.12, len, 0.02).translate(0, y, len / 2));
    const stile = bevelBox(0.14, 0.95, 0.14, 0.02).translate(0, 0.48, len - 0.07);
    const geo = mergeGeometries([...rails, stile])!;
    const mat = new THREE.MeshStandardMaterial({ color: color(C.pale), roughness: 0.85 });
    this.leaves = new THREE.InstancedMesh(geo, mat, 3);
    this.leaves.castShadow = this.leaves.receiveShadow = true;
    this.leaves.frustumCulled = false;
    this.group.add(this.leaves);
    this.disposables.push(geo, mat);
    this.place();
    this.buildNumbers();
    this.group.visible = false;
  }

  private place(): void {
    for (let p = 0; p < 3; p++) {
      const h = leafHinge(p);
      this.q.setFromAxisAngle(this.up, this.angles[p] ?? 0);
      this.leaves.setMatrixAt(
        p,
        this.m4.compose(new THREE.Vector3(h.x, 0, h.z), this.q, new THREE.Vector3(1, 1, 1)),
      );
    }
    this.leaves.instanceMatrix.needsUpdate = true;
  }

  private buildNumbers(): void {
    const cv = paintNumberAtlas();
    if (!cv) return;
    const tex = new THREE.CanvasTexture(cv);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.magFilter = THREE.NearestFilter;
    tex.minFilter = THREE.NearestFilter;
    tex.generateMipmaps = false;
    const { width, height } = numberAtlasSize();
    const pos: number[] = [];
    const uv: number[] = [];
    const idx: number[] = [];
    const hw = 0.19;
    const hh = 0.125;
    pennedSpots().forEach((s, i) => {
      // On the back (+z, the side the Nubbin turns from the road), a little below the crown.
      const cx = s.x;
      const cy = 0.46;
      const cz = s.z + 0.3;
      pos.push(
        cx - hw,
        cy + hh,
        cz,
        cx + hw,
        cy + hh,
        cz,
        cx - hw,
        cy - hh,
        cz,
        cx + hw,
        cy - hh,
        cz,
      );
      const { col, row } = numberCell(s.n);
      const u0 = (col * NUMBER_CELL.w) / width;
      const u1 = ((col + 1) * NUMBER_CELL.w) / width;
      const v1 = 1 - (row * NUMBER_CELL.h) / height;
      const v0 = 1 - ((row + 1) * NUMBER_CELL.h) / height;
      uv.push(u0, v1, u1, v1, u0, v0, u1, v0);
      const o = i * 4;
      idx.push(o, o + 2, o + 1, o + 1, o + 2, o + 3);
    });
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    geo.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
    geo.setIndex(idx);
    geo.computeVertexNormals();
    const mat = new THREE.MeshLambertMaterial({ map: tex });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.frustumCulled = false;
    this.group.add(mesh);
    this.disposables.push(tex, geo, mat);
  }

  /** Swing each leaf toward its pen's state; `still` snaps (reduced motion). */
  update(open: readonly boolean[], dt: number, still: boolean): void {
    let moved = false;
    for (let p = 0; p < 3; p++) {
      const target = open[p] ? CG_C.corvin.leaf.openRad : 0;
      const a = this.angles[p] ?? 0;
      if (a === target) continue;
      const next = still ? target : a + (target - a) * (1 - Math.exp(-CG_C.corvin.leaf.swing * dt));
      this.angles[p] = Math.abs(next - target) < 0.002 ? target : next;
      moved = true;
    }
    if (moved) this.place();
  }

  dispose(): void {
    this.group.removeFromParent();
    for (const d of this.disposables) d.dispose();
  }
}
