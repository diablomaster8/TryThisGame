/**
 * R0001 (MOVE-13): rings on the water round the Keeper's knees while it wades the stream,
 * one swell every `KEEPER_WADE.rippleMs` as the pixel view lays its rings. It reads the
 * sim and never changes it.
 */
import * as THREE from 'three';
import { KEEPER_WADE } from '../config/tuning-sim';
import { WATER_LEVEL } from './terrain';

export class WadeRipple {
  private readonly mesh: THREE.Mesh;
  private readonly mat = new THREE.MeshBasicMaterial({
    color: '#ffffff',
    transparent: true,
    depthWrite: false,
  });
  private startMs = -Infinity;

  constructor(parent: THREE.Object3D) {
    this.mesh = new THREE.Mesh(new THREE.RingGeometry(0.42, 0.5, 32), this.mat);
    this.mesh.rotation.x = -Math.PI / 2;
    this.mesh.visible = false;
    parent.add(this.mesh);
  }

  /** `wading`: the Keeper is moving with its feet under the water this frame. */
  update(wading: boolean, x: number, z: number, nowMs: number, calm: boolean): void {
    const span = KEEPER_WADE.rippleMs * 2;
    if (wading && nowMs - this.startMs > KEEPER_WADE.rippleMs) {
      this.startMs = nowMs;
      this.mesh.position.set(x, WATER_LEVEL + 0.02, z);
    }
    const k = (nowMs - this.startMs) / span;
    if (k >= 1) {
      this.mesh.visible = false;
      return;
    }
    this.mesh.visible = true;
    this.mesh.scale.setScalar(calm ? 1 : 0.7 + k * 1.1);
    this.mat.opacity = 0.45 * (1 - k);
  }

  dispose(): void {
    this.mesh.removeFromParent();
    this.mesh.geometry.dispose();
    this.mat.dispose();
  }
}
