import * as THREE from 'three';
import type { Vec2 } from '../sim/types';
import { QuadCloud } from './quad-particles';

/**
 * Leaves drifting off the fruit trees by day, after the pixel view's ambient spawn
 * (`render/particles.ts`): one leaf every 1.2 to 3 s from a random tree's crown, falling
 * at about half a unit a second with a little sway, gone after five seconds; four in five
 * are leaves, the rest petals. One small quad cloud: each a leaf shape that tumbles as it
 * falls (art pass 2; they were square points).
 */
const MAX = 8;
const LIFE = 5;

export class FallingLeaves {
  private readonly cloud: QuadCloud;
  private readonly pos = new Float32Array(MAX * 3);
  private readonly col = new Float32Array(MAX * 3);
  private readonly c = new THREE.Color();
  private readonly age = new Float32Array(MAX).fill(LIFE);
  private readonly drift = new Float32Array(MAX * 2);
  private timer = 0;
  private seed = 1;

  constructor(parent: THREE.Object3D) {
    this.cloud = new QuadCloud(parent, MAX);
    this.cloud.mesh.visible = false;
  }

  /** The cloud's mesh, shown only while leaves are wanted. */
  get points(): THREE.Object3D {
    return this.cloud.mesh;
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
    for (let i = 0; i < MAX; i++) {
      const age = this.age[i]!;
      if (age >= LIFE) continue;
      this.c.setRGB(this.col[i * 3]!, this.col[i * 3 + 1]!, this.col[i * 3 + 2]!);
      const fade = Math.min(1, age / 0.3, (LIFE - age) / 0.8);
      const petal = this.col[i * 3]! > 0.9;
      this.cloud.set(
        this.pos[i * 3]!,
        this.pos[i * 3 + 1]!,
        this.pos[i * 3 + 2]!,
        this.c,
        fade,
        petal ? 0.13 : 0.18,
        'leaf',
        { rot: age * (2 + (i % 3)) + i },
      );
    }
    this.cloud.flush();
  }
}
