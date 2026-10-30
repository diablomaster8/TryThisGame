import * as THREE from 'three';
import { FERN_STONE } from '../config/tuning';
import { fernStones } from '../sim/fern-stone';
import type { World } from '../sim/types';

/**
 * R0313 (FUN-24): Fern's cairn in Full 3D: a stack of squashed pebbles by the signpost, one a
 * chapter, the top one with two dot eyes. Built once (12 stones, shared geometry), shown up to
 * the cairn's count; a tap on it picks as the `fern-stone` story prop.
 */
export class FernCairn3D {
  private readonly group = new THREE.Group();
  private stones: THREE.Mesh[] = [];
  private eyes: THREE.Group | null = null;
  private shown = -1;

  constructor(parent: THREE.Object3D) {
    this.group.name = 'fern-cairn';
    this.group.visible = false;
    parent.add(this.group);
  }

  private build(): void {
    const geo = new THREE.SphereGeometry(0.16, 10, 7);
    const mats = ['#bdb8ab', '#a9a497', '#cfc9bb'].map(
      (c) => new THREE.MeshStandardMaterial({ color: c, roughness: 0.9, flatShading: true }),
    );
    let y = 0;
    for (let i = 0; i < FERN_STONE.maxStones; i++) {
      const s = 1 - i * 0.035;
      const m = new THREE.Mesh(geo, mats[i % mats.length]);
      m.scale.set(s * (1.25 - (i % 2) * 0.15), 0.55, s);
      m.position.set(((i * 37) % 7) * 0.012 - 0.036, y + 0.08 * s, ((i * 17) % 5) * 0.01 - 0.02);
      m.rotation.y = i * 1.3;
      y += 0.15 * s;
      this.group.add(m);
      this.stones.push(m);
    }
    const eye = new THREE.MeshBasicMaterial({ color: '#2a2030' });
    const eyeGeo = new THREE.SphereGeometry(0.022, 6, 4);
    this.eyes = new THREE.Group();
    for (const dx of [-0.055, 0.055]) {
      const e = new THREE.Mesh(eyeGeo, eye);
      e.position.set(dx, 0.02, 0.15);
      this.eyes.add(e);
    }
    this.group.add(this.eyes);
  }

  update(world: World, ground: (x: number, z: number) => number): void {
    const n = fernStones(world);
    this.group.visible = n > 0;
    if (n === 0) return;
    if (this.stones.length === 0) this.build();
    if (n === this.shown) return;
    this.shown = n;
    this.group.position.set(FERN_STONE.x, ground(FERN_STONE.x, FERN_STONE.z), FERN_STONE.z);
    this.stones.forEach((s, i) => (s.visible = i < n));
    const top = this.stones[n - 1]!;
    // The face goes on the top stone, turned toward the gate path (+z, the camera's usual side).
    this.eyes!.position.copy(top.position);
    this.eyes!.scale.setScalar(top.scale.z);
  }

  /** Distance along `ray` to the cairn, or null when it is not hit. */
  pick(ray: THREE.Ray, hit: THREE.Vector3): number | null {
    if (!this.group.visible) return null;
    const c = this.group.position.clone();
    c.y += 0.3;
    if (!ray.intersectSphere(new THREE.Sphere(c, FERN_STONE.pick), hit)) return null;
    return hit.distanceTo(ray.origin);
  }
}
