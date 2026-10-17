import * as THREE from 'three';
import type { Vec2 } from '../sim/types';

/**
 * Leaves drifting off the fruit trees by day, after the pixel view's ambient spawn
 * (`render/particles.ts`): one leaf every 1.2 to 3 s from a random tree's crown, falling
 * at about half a unit a second with a little sway, gone after five seconds; four in five
 * are leaves, the rest petals. One small point cloud, with the rain's kind of material.
 */
const MAX = 8;
const LIFE = 5;

export class FallingLeaves {
  readonly points: THREE.Points;
  private readonly pos = new Float32Array(MAX * 3);
  private readonly col = new Float32Array(MAX * 3);
  private readonly age = new Float32Array(MAX).fill(LIFE);
  private readonly drift = new Float32Array(MAX * 2);
  private timer = 0;
  private seed = 1;

  constructor(parent: THREE.Object3D) {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(this.pos, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(this.col, 3));
    this.points = new THREE.Points(
      geo,
      new THREE.PointsMaterial({
        size: 0.16,
        vertexColors: true,
        transparent: true,
        opacity: 0.95,
        sizeAttenuation: true,
      }),
    );
    this.points.frustumCulled = false;
    this.points.visible = false;
    parent.add(this.points);
  }

  /** A deterministic wobble, so leaves need no Math.random and replay alike. */
  private rnd(): number {
    this.seed = (this.seed * 16807) % 2147483647;
    return this.seed / 2147483647;
  }

  /** Spawn and fall; `rate` scales the spawns (the particle density setting). */
  update(
    trees: Iterable<Vec2>,
    groundAt: (x: number, z: number) => number,
    dt: number,
    rate: number,
  ): void {
    const list = [...trees];
    this.timer -= dt * rate;
    if (this.timer <= 0 && list.length) {
      this.timer = 1.2 + this.rnd() * 1.8;
      const i = this.age.findIndex((a) => a >= LIFE);
      const t = list[Math.floor(this.rnd() * list.length)]!;
      if (i >= 0) {
        this.age[i] = 0;
        const x = t.x + (this.rnd() - 0.5) * 2.4;
        const z = t.z + (this.rnd() - 0.5) * 2.4;
        this.pos.set([x, groundAt(t.x, t.z) + 2.6 + this.rnd() * 1.2, z], i * 3);
        this.drift.set([(this.rnd() - 0.5) * 0.4, (this.rnd() - 0.5) * 0.4], i * 2);
        const petal = this.rnd() >= 0.8;
        this.col.set(petal ? [1, 0.72, 0.8] : [0.42, 0.68, 0.26], i * 3);
      }
    }
    for (let i = 0; i < MAX; i++) {
      const age = this.age[i]!;
      if (age >= LIFE) {
        this.pos[i * 3 + 1] = -100;
        continue;
      }
      this.age[i] = age + dt;
      const sway = Math.sin(age * 3 + i) * 0.3;
      this.pos[i * 3] = this.pos[i * 3]! + (this.drift[i * 2]! + sway) * dt;
      this.pos[i * 3 + 1] = this.pos[i * 3 + 1]! - 0.55 * dt;
      this.pos[i * 3 + 2] = this.pos[i * 3 + 2]! + this.drift[i * 2 + 1]! * dt;
    }
    const geo = this.points.geometry;
    geo.attributes.position!.needsUpdate = true;
    geo.attributes.color!.needsUpdate = true;
  }
}
