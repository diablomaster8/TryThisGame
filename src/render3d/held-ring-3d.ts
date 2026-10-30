import * as THREE from 'three';
import { HELD_RING } from '../config/tuning';
import { HeldRing } from '../render/held-ring';
import type { World } from '../sim/types';

/** TECH-02: the Full 3D ring under a held Nubbin (render/held-ring.ts), one small mesh. */
export class HeldRing3D {
  readonly ring = new HeldRing();
  private readonly mesh: THREE.Mesh;
  private readonly mat: THREE.MeshBasicMaterial;

  constructor(group: THREE.Object3D) {
    this.mat = new THREE.MeshBasicMaterial({
      color: '#fff3d6',
      transparent: true,
      depthWrite: false,
    });
    const r = HELD_RING.radius;
    this.mesh = new THREE.Mesh(
      new THREE.RingGeometry(r * 0.78, r, 28).rotateX(-Math.PI / 2),
      this.mat,
    );
    this.mesh.visible = false;
    this.mesh.renderOrder = 2;
    this.mesh.name = 'held-ring';
    group.add(this.mesh);
  }

  update(
    world: World,
    nowMs: number,
    calm: boolean,
    ground: (x: number, z: number) => number,
  ): void {
    this.ring.frame(world, nowMs, calm);
    const s = this.ring.spot;
    this.mesh.visible = !!s;
    if (!s) return;
    this.mesh.position.set(s.x, ground(s.x, s.z) + HELD_RING.lift, s.z);
    this.mat.color.set(s.gentle ? '#8fe0a8' : '#fff3d6');
    this.mat.opacity = s.gentle ? 0.9 : 0.6;
  }

  dispose(): void {
    this.mesh.geometry.dispose();
    this.mat.dispose();
  }
}
