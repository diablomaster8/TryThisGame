import * as THREE from 'three';
import { FIRST_RING, firstLoopSpot, firstRingPulse } from '../render-common/first-loop-ring';
import type { World } from '../sim/types';

/** R0448: the Full 3D pulsing ring on the first loop's target, one small mesh. */
export class FirstRing3D {
  private readonly mesh: THREE.Mesh;
  private readonly mat: THREE.MeshBasicMaterial;

  constructor(group: THREE.Object3D) {
    this.mat = new THREE.MeshBasicMaterial({
      color: '#ffd24a',
      transparent: true,
      depthWrite: false,
    });
    const r = FIRST_RING.radius;
    this.mesh = new THREE.Mesh(
      new THREE.RingGeometry(r * 0.72, r, 32).rotateX(-Math.PI / 2),
      this.mat,
    );
    this.mesh.visible = false;
    this.mesh.renderOrder = 2;
    this.mesh.name = 'first-loop-ring';
    group.add(this.mesh);
  }

  update(
    world: World,
    nowMs: number,
    calm: boolean,
    ground: (x: number, z: number) => number,
  ): void {
    const s = firstLoopSpot(world);
    this.mesh.visible = !!s;
    if (!s) return;
    const p = firstRingPulse(nowMs, calm);
    this.mesh.position.set(s.x, ground(s.x, s.z) + FIRST_RING.lift, s.z);
    this.mesh.scale.setScalar(p.scale);
    this.mat.opacity = p.opacity;
  }

  dispose(): void {
    this.mesh.geometry.dispose();
    this.mat.dispose();
  }
}
