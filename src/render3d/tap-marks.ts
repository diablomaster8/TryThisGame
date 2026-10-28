/**
 * The Full 3D tap-to-move preview (MOVE-44): fading footprint dots along the planned path
 * (one instanced disc mesh) and a ring on the ground at the target, at the height of what
 * is there (`render/tap-path.ts` places both, for Pixel too). Two draw calls while shown,
 * none otherwise.
 */
import * as THREE from 'three';
import { TAP_PATH } from '../config/tuning-move';
import type { World } from '../sim/types';
import { TapPath } from '../render/tap-path';

export class TapMarks3D {
  private readonly path = new TapPath();
  private readonly dots: THREE.InstancedMesh;
  private readonly ring: THREE.Mesh;
  private readonly dotMat: THREE.MeshBasicMaterial;
  private readonly ringMat: THREE.MeshBasicMaterial;
  private readonly m = new THREE.Matrix4();

  constructor(group: THREE.Object3D) {
    const flat = (g: THREE.BufferGeometry) => g.rotateX(-Math.PI / 2);
    this.dotMat = new THREE.MeshBasicMaterial({
      color: '#fff6dc',
      transparent: true,
      depthWrite: false,
    });
    this.ringMat = this.dotMat.clone();
    this.dots = new THREE.InstancedMesh(
      flat(new THREE.CircleGeometry(0.09, 10)),
      this.dotMat,
      TAP_PATH.dots,
    );
    this.ring = new THREE.Mesh(flat(new THREE.RingGeometry(0.22, 0.32, 24)), this.ringMat);
    for (const o of [this.dots, this.ring]) {
      o.visible = false;
      o.frustumCulled = false;
      o.renderOrder = 2;
      o.name = 'tap-marks';
      group.add(o);
    }
  }

  update(world: World, nowMs: number, calm: boolean): void {
    if (!this.path.update(world, nowMs)) {
      this.dots.visible = this.ring.visible = false;
      return;
    }
    const da = this.path.dotAlpha(nowMs, calm);
    this.dots.visible = da > 0 && this.path.dots.length > 0;
    if (this.dots.visible) {
      this.dotMat.opacity = 0.7 * da;
      this.path.dots.forEach((d, i) => {
        this.dots.setMatrixAt(i, this.m.makeTranslation(d.x, d.y + 0.03, d.z));
      });
      this.dots.count = this.path.dots.length;
      this.dots.instanceMatrix.needsUpdate = true;
    }
    const ma = this.path.markAlpha(nowMs, calm);
    const mk = this.path.mark;
    this.ring.visible = ma > 0 && !!mk;
    if (mk && this.ring.visible) {
      this.ringMat.opacity = 0.8 * ma;
      this.ring.position.set(mk.x, mk.y + 0.03, mk.z);
    }
  }
}
