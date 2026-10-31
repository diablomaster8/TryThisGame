import * as THREE from 'three';
import { QuadCloud, type QuadShape } from './quad-particles';

/**
 * Little bursts in the 3D Grove, the counterparts of the pixel view's particle bursts:
 * leaves and petals from a shaken tree, dust where a thrown Nubbin lands, crumbs when one
 * eats, hearts for a loving reaction and sparkles for a hatch, an evolution, a rebirth or
 * a cocoon. One quad cloud (`quad-particles.ts`) holds every burst, each particle shaped
 * (leaf, dot, star, heart), turning and fading softly; particles fall with a drag (leaves flutter down slowly,
 * dust settles fast, sparkles hang and hearts float up) and fade before they go.
 */
export type BurstKind =
  | 'leaf'
  | 'petal'
  | 'dust'
  | 'crumb'
  | 'sparkle'
  | 'heart'
  // R0410 (LOOK-44): the signature beats' cheek sparks, sung notes and tail embers.
  | 'spark'
  | 'note'
  | 'ember';

interface Particle {
  p: THREE.Vector3;
  v: THREE.Vector3;
  born: number;
  life: number;
  kind: BurstKind;
  phase: number;
}

const COLORS: Record<BurstKind, string[]> = {
  leaf: ['#5fae3a', '#86c84a', '#3f8a2e', '#a8d860'],
  petal: ['#ffc8dc', '#ffe0ec', '#ffb0c8'],
  dust: ['#c8b08a', '#d8c4a0', '#b89c74'],
  crumb: ['#e8b060', '#c88a40', '#f4d08a'],
  sparkle: ['#fff6c0', '#ffffff', '#ffe08a', '#c8f0ff'],
  heart: ['#ff6f9c', '#ff8fb4', '#f2507e'],
  spark: ['#fff27a', '#ffe040', '#ffffff'],
  note: ['#5a4fd0', '#d04f9a', '#2f8fd0'],
  ember: ['#ff9a30', '#ffcf50', '#ff6020'],
};

/**
 * How each kind moves: gravity (negative floats it), drag, a sideways flutter, and
 * whether it comes to rest on the ground or passes through the air until it fades.
 */
const MOTION: Record<
  BurstKind,
  { gravity: number; drag: number; flutter: number; lands: boolean }
> = {
  leaf: { gravity: 1.2, drag: 2.2, flutter: 0.8, lands: true },
  petal: { gravity: 0.9, drag: 2.6, flutter: 0.8, lands: true },
  dust: { gravity: 2.4, drag: 3.5, flutter: 0, lands: true },
  crumb: { gravity: 3.2, drag: 2.0, flutter: 0, lands: true },
  sparkle: { gravity: 0, drag: 2.4, flutter: 0, lands: false },
  heart: { gravity: -0.6, drag: 1.5, flutter: 1.2, lands: false },
  spark: { gravity: 0, drag: 5, flutter: 0, lands: false },
  note: { gravity: -0.3, drag: 1.2, flutter: 1.4, lands: false },
  ember: { gravity: -0.5, drag: 1.8, flutter: 0.6, lands: false },
};

const MAX = 320;

/** Each kind's quad: its shape, its size in world units, and whether it adds light. */
const LOOK: Record<BurstKind, { shape: QuadShape; size: number; additive: boolean; spin: number }> =
  {
    leaf: { shape: 'leaf', size: 0.2, additive: false, spin: 2.5 },
    petal: { shape: 'leaf', size: 0.15, additive: false, spin: 3 },
    dust: { shape: 'dot', size: 0.22, additive: false, spin: 0 },
    crumb: { shape: 'dot', size: 0.11, additive: false, spin: 0 },
    sparkle: { shape: 'star', size: 0.5, additive: true, spin: 0.6 },
    heart: { shape: 'heart', size: 0.34, additive: false, spin: 0 },
    spark: { shape: 'star', size: 0.3, additive: true, spin: 4 },
    note: { shape: 'note', size: 0.3, additive: false, spin: 0 },
    ember: { shape: 'glow', size: 0.16, additive: true, spin: 0 },
  };

/** Reduced motion: at most this many glints a burst, drawn this close, for this long. */
export const CALM = { count: 3, spread: 0.4, lifeMs: 700 };
/** Under reduced motion a glint neither falls, drifts nor flutters. */
const STILL = { gravity: 0, drag: 0, flutter: 0, lands: false };

export class Bursts {
  /** Every burst in one quad cloud (art pass 2: shaped, turning, soft-edged). */
  private readonly cloud: QuadCloud;
  private readonly list: Particle[] = [];
  private readonly c = new THREE.Color();
  private seed = 1;
  /**
   * Reduced motion (the in-game setting or the system's): a burst becomes a few still
   * glints where it happened, held briefly and faded, with no flight, flutter, spin,
   * twinkle or growth. The feedback stays; the movement goes.
   */
  calm = false;

  constructor(parent: THREE.Object3D) {
    this.cloud = new QuadCloud(parent, MAX);
  }

  /** The cloud's mesh (the scene's warm-up compiles it). */
  get points(): THREE.Object3D {
    return this.cloud.mesh;
  }

  /** A render-side jitter: bursts are decoration, so no sim randomness is spent on them. */
  private rand(): number {
    this.seed = (this.seed * 16807) % 2147483647;
    return this.seed / 2147483647;
  }

  burst(
    kind: BurstKind,
    at: THREE.Vector3,
    count: number,
    o: { spread: number; speed: number; rise: number; lifeMs: number },
    nowMs: number,
  ): void {
    const calm = this.calm;
    const n = calm ? Math.min(count, CALM.count) : count;
    for (let i = 0; i < n && this.list.length < MAX; i++) {
      const a = this.rand() * Math.PI * 2;
      const r = this.rand() * o.spread * (calm ? CALM.spread : 1);
      const s = calm ? 0 : o.speed * (0.5 + this.rand() * 0.5);
      const rise = calm ? 0 : o.rise + this.rand() * 0.6;
      this.list.push({
        p: at.clone().add(new THREE.Vector3(Math.cos(a) * r, this.rand() * 0.3, Math.sin(a) * r)),
        v: new THREE.Vector3(Math.cos(a) * s, rise, Math.sin(a) * s),
        born: nowMs,
        life: Math.min(calm ? CALM.lifeMs : Infinity, o.lifeMs) * (0.7 + this.rand() * 0.3),
        kind,
        phase: this.rand() * 6.28,
      });
    }
  }

  update(nowMs: number, dt: number, ground: (x: number, z: number) => number): void {
    for (let i = this.list.length - 1; i >= 0; i--) {
      const q = this.list[i]!;
      const age = nowMs - q.born;
      if (age > q.life) {
        this.list.splice(i, 1);
        continue;
      }
      const f = this.calm ? STILL : MOTION[q.kind];
      q.v.y -= f.gravity * dt;
      q.v.multiplyScalar(Math.exp(-f.drag * dt));
      if (f.flutter) q.v.x += Math.sin(nowMs / 300 + q.phase) * dt * f.flutter;
      q.p.addScaledVector(q.v, dt);
      if (f.lands) {
        const g = ground(q.p.x, q.p.z) + 0.03;
        if (q.p.y < g) {
          q.p.y = g;
          q.v.set(0, 0, 0);
        }
      }
      const look = LOOK[q.kind];
      const palette = COLORS[q.kind];
      this.c.set(palette[Math.floor(q.phase * 10) % palette.length]!);
      // Fade over the last fifth of a life (dust also thins as it spreads); sparkles twinkle.
      let fade = Math.min(1, (q.life - age) / (q.life * 0.2));
      if (q.kind === 'sparkle' && !this.calm)
        fade *= 0.65 + 0.35 * Math.sin(nowMs / 60 + q.phase * 3);
      if (q.kind === 'dust') fade *= 0.75;
      const grow = this.calm
        ? 1
        : q.kind === 'dust'
          ? 1 + (age / q.life) * 1.2
          : q.kind === 'heart'
            ? Math.min(1, age / 140)
            : 1;
      // Leaves stop turning once they land.
      const still = f.lands && q.v.lengthSq() === 0;
      const rot =
        q.phase + (still || this.calm ? 0 : (age / 1000) * look.spin * (q.phase > 3.14 ? 1 : -1));
      this.cloud.set(q.p.x, q.p.y, q.p.z, this.c, fade, look.size * grow, look.shape, {
        rot,
        additive: look.additive,
      });
    }
    this.cloud.flush();
  }

  /** Free the cloud. */
  dispose(): void {
    this.cloud.dispose();
    this.list.length = 0;
  }
}
