import { GROVE } from '../config/tuning';
import type { SpriteBatch } from './sprite-batch';
import { frameKey } from './sprites/animations';
import type { SpriteSheet } from './sprites/atlas';
import { buildParticleSheet, PARTICLE_FRAMES, type ParticleKind } from './sprites/particles-art';

interface Particle {
  kind: ParticleKind;
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
  ageMs: number;
  lifeMs: number;
  size: number;
  /** Lies on the ground (ripples) instead of facing the camera. */
  flat: boolean;
  seed: number;
  /** Fade in and out over this many ms at each end. */
  fadeMs: number;
}

export interface ParticleEnvironment {
  fireflies: boolean;
  leaves: boolean;
  /** 0 day … 1 night. */
  darkness: number;
  weather: 'clear' | 'rain' | 'snow';
  /** 0..1 rain or snow strength. */
  weatherIntensity: number;
  /** Settings: how many ambient particles. */
  density: 'full' | 'light' | 'off';
}

const MAX = 220;
const FIREFLY_COUNT = 14;

/**
 * Render-only particles: bursts for sim events (dust on landing, hearts on petting,
 * sparkles for hatching and evolution, leaves off a shaken tree) and ambient life
 * (fireflies at night, drifting leaves by day, spray at the waterfall). Everything is
 * drawn through the one SpriteBatch so it costs no extra draw calls. Reduced motion
 * keeps the event bursts short and drops the ambient layer.
 */
export class Particles {
  private readonly pool: Particle[] = [];
  private sheet: SpriteSheet | null = null;
  private lastMs = 0;
  private leafTimerMs = 0;
  private sprayTimerMs = 0;
  env: ParticleEnvironment = {
    fireflies: false,
    leaves: true,
    darkness: 0,
    weather: 'clear',
    weatherIntensity: 0,
    density: 'full',
  };
  reduceMotion = false;

  get count(): number {
    return this.pool.length;
  }

  private rnd(): number {
    // Render-only randomness: the sim never sees it.
    return Math.random();
  }

  private push(p: Particle): void {
    if (this.pool.length >= MAX) this.pool.shift();
    this.pool.push(p);
  }

  /** A burst of `n` particles from a point. */
  /** R0091: a twinkle over each findable collectible near the Keeper (the Game calls it). */
  glint(points: ReadonlyArray<{ x: number; z: number }>): void {
    for (const p of points)
      this.burst('sparkle', p.x, 0.35, p.z, 2, {
        spread: 0.25,
        speed: 0.2,
        rise: 0.4,
        lifeMs: 900,
      });
  }

  burst(
    kind: ParticleKind,
    x: number,
    y: number,
    z: number,
    n: number,
    opts: {
      spread?: number;
      speed?: number;
      rise?: number;
      lifeMs?: number;
      size?: number;
      flat?: boolean;
      fadeMs?: number;
    } = {},
  ): void {
    const spread = opts.spread ?? 0.3;
    const speed = opts.speed ?? 0.8;
    const rise = opts.rise ?? 0.6;
    const life = opts.lifeMs ?? 700;
    for (let i = 0; i < n; i++) {
      const a = this.rnd() * Math.PI * 2;
      const s = speed * (0.4 + this.rnd() * 0.6);
      this.push({
        kind,
        x: x + (this.rnd() - 0.5) * spread * 2,
        y: y + this.rnd() * 0.1,
        z: z + (this.rnd() - 0.5) * spread * 2,
        vx: Math.cos(a) * s,
        vy: rise * (0.5 + this.rnd()),
        vz: Math.sin(a) * s,
        ageMs: 0,
        lifeMs: life * (0.75 + this.rnd() * 0.5),
        size: opts.size ?? 0.5,
        flat: opts.flat ?? false,
        seed: this.rnd() * 1000,
        fadeMs: opts.fadeMs ?? 120,
      });
    }
  }

  /** One ripple ring on the water under a swimmer. */
  ripple(x: number, z: number): void {
    this.push({
      kind: 'ripple',
      x,
      y: 0.02,
      z,
      vx: 0,
      vy: 0,
      vz: 0,
      ageMs: 0,
      lifeMs: 900,
      size: 0.6,
      flat: true,
      seed: 0,
      fadeMs: 200,
    });
  }

  /** Ambient spawns: fireflies, leaves, waterfall spray. */
  private ambient(dtMs: number): void {
    if (this.reduceMotion || this.env.density === 'off') return;
    const env = this.env;
    const dens = env.density === 'light' ? 0.4 : 1;
    // Rain and snow fall across the whole Grove.
    if (env.weather !== 'clear') {
      const perStep =
        (env.weather === 'rain' ? 2.2 : 0.9) * env.weatherIntensity * dens * (dtMs / 16);
      let n = Math.floor(perStep) + (this.rnd() < perStep % 1 ? 1 : 0);
      while (n-- > 0) {
        const rain = env.weather === 'rain';
        this.push({
          kind: rain ? 'rain' : 'snow',
          x: (this.rnd() - 0.5) * (GROVE.size + 2),
          y: 7 + this.rnd() * 3,
          z: (this.rnd() - 0.5) * (GROVE.size + 2),
          vx: rain ? -0.6 : (this.rnd() - 0.5) * 0.4,
          vy: rain ? -9 : -0.8,
          vz: 0,
          ageMs: 0,
          lifeMs: rain ? 1400 : 12000,
          size: rain ? 0.5 : 0.3,
          flat: false,
          seed: this.rnd() * 1000,
          fadeMs: rain ? 60 : 500,
        });
      }
    }
    // Fireflies hover over the pond and the grass near the lanterns at night.
    if (env.fireflies) {
      const alive = this.pool.filter((p) => p.kind === 'firefly').length;
      if (alive < FIREFLY_COUNT && this.rnd() < 0.08) {
        const nearPond = this.rnd() < 0.5;
        const span = GROVE.size * 0.7;
        const x = nearPond ? GROVE.pond.x + (this.rnd() - 0.5) * 10 : (this.rnd() - 0.5) * span;
        const z = nearPond ? GROVE.pond.z + (this.rnd() - 0.5) * 10 : (this.rnd() - 0.5) * span;
        this.push({
          kind: 'firefly',
          x,
          y: 0.5 + this.rnd() * 1.5,
          z,
          vx: 0,
          vy: 0,
          vz: 0,
          ageMs: 0,
          lifeMs: 6000 + this.rnd() * 6000,
          size: 0.4,
          flat: false,
          seed: this.rnd() * 1000,
          fadeMs: 900,
        });
      }
    }
    // Leaves drift off the fruit trees by day.
    if (env.leaves) {
      this.leafTimerMs -= dtMs;
      if (this.leafTimerMs <= 0) {
        this.leafTimerMs = 1200 + this.rnd() * 1800;
        const t = GROVE.trees[Math.floor(this.rnd() * GROVE.trees.length)]!;
        this.push({
          kind: this.rnd() < 0.8 ? 'leaf' : 'petal',
          x: t.x + (this.rnd() - 0.5) * 2.4,
          y: 2.6 + this.rnd() * 1.2,
          z: t.z + (this.rnd() - 0.5) * 2.4,
          vx: (this.rnd() - 0.5) * 0.4,
          vy: -0.55,
          vz: (this.rnd() - 0.5) * 0.4,
          ageMs: 0,
          lifeMs: 5000,
          size: 0.45,
          flat: false,
          seed: this.rnd() * 1000,
          fadeMs: 300,
        });
      }
    }
    // Spray at the foot of the waterfall.
    this.sprayTimerMs -= dtMs;
    if (this.sprayTimerMs <= 0) {
      this.sprayTimerMs = 160;
      const wf = GROVE.waterfall;
      this.burst('drop', wf.x - 3.6, 0.1, wf.z + 5.6, 1, {
        spread: 0.6,
        speed: 0.9,
        rise: 1.6,
        lifeMs: 500,
        size: 0.35,
        fadeMs: 60,
      });
    }
  }

  /** Advance every particle. `nowMs` is wall time. */
  update(nowMs: number): void {
    const dtMs = this.lastMs === 0 ? 16 : Math.min(100, nowMs - this.lastMs);
    this.lastMs = nowMs;
    this.ambient(dtMs);
    const dt = dtMs / 1000;
    for (let i = this.pool.length - 1; i >= 0; i--) {
      const p = this.pool[i]!;
      p.ageMs += dtMs;
      if (p.ageMs >= p.lifeMs) {
        this.pool.splice(i, 1);
        continue;
      }
      const t = p.ageMs / 1000;
      switch (p.kind) {
        case 'dust':
        case 'crumb':
          p.vx *= 0.9;
          p.vz *= 0.9;
          p.vy *= 0.9;
          break;
        case 'leaf':
        case 'petal':
          p.vx += Math.sin(t * 3 + p.seed) * 0.6 * dt;
          p.vz += Math.cos(t * 2.3 + p.seed) * 0.6 * dt;
          if (p.y <= 0.05) {
            p.vy = 0;
            p.vx = 0;
            p.vz = 0;
            p.y = 0.05;
            // Rest on the grass for a moment, then fade.
            if (p.lifeMs - p.ageMs > 1500) p.lifeMs = p.ageMs + 1500;
          }
          break;
        case 'sparkle':
          p.vy *= 0.96;
          p.vx *= 0.96;
          p.vz *= 0.96;
          break;
        case 'firefly':
          p.vx += (Math.sin(t * 1.3 + p.seed) * 0.5 - p.vx * 0.5) * dt;
          p.vz += (Math.cos(t * 1.7 + p.seed * 0.7) * 0.5 - p.vz * 0.5) * dt;
          p.vy = Math.sin(t * 2 + p.seed) * 0.25;
          break;
        case 'heart':
          p.vx = Math.sin(t * 4 + p.seed) * 0.25;
          p.vy = 0.7;
          p.vz = 0;
          break;
        case 'drop':
          p.vy -= 6 * dt;
          break;
        case 'rain':
          if (p.y <= 0.05) {
            this.pool.splice(i, 1);
            if (this.rnd() < 0.25) {
              this.push({
                kind: 'splash',
                x: p.x,
                y: 0.04,
                z: p.z,
                vx: 0,
                vy: 0,
                vz: 0,
                ageMs: 0,
                lifeMs: 260,
                size: 0.45,
                flat: true,
                seed: 0,
                fadeMs: 80,
              });
            }
            continue;
          }
          break;
        case 'snow':
          p.vx += Math.sin(t * 1.5 + p.seed) * 0.3 * dt;
          if (p.y <= 0.05) {
            p.y = 0.05;
            p.vy = 0;
            p.vx = 0;
            if (p.lifeMs - p.ageMs > 2500) p.lifeMs = p.ageMs + 2500;
          }
          break;
        case 'note':
          p.vx = Math.sin(t * 3 + p.seed) * 0.3;
          p.vy = 0.5;
          break;
        case 'splash':
          break;
        case 'ripple':
          break;
      }
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.z += p.vz * dt;
      if (p.kind === 'drop' && p.y < 0) {
        this.pool.splice(i, 1);
      }
    }
  }

  /** Queue every particle into the batch. */
  draw(batch: SpriteBatch, nowMs: number): void {
    if (this.pool.length === 0) return;
    this.sheet ??= buildParticleSheet();
    const sheet = this.sheet;
    const dark = this.env.darkness;
    for (const p of this.pool) {
      const frames = PARTICLE_FRAMES[p.kind];
      let frame: number;
      let size = p.size;
      const fadeIn = Math.min(1, p.ageMs / p.fadeMs);
      const fadeOut = Math.min(1, (p.lifeMs - p.ageMs) / p.fadeMs);
      let opacity = Math.min(fadeIn, fadeOut);
      switch (p.kind) {
        case 'dust':
        case 'sparkle':
          frame = Math.min(frames - 1, Math.floor((p.ageMs / p.lifeMs) * frames));
          if (p.kind === 'sparkle') frame = frames - 1 - frame;
          break;
        case 'ripple':
          frame = Math.min(frames - 1, Math.floor((p.ageMs / p.lifeMs) * frames));
          size = p.size * (1 + (p.ageMs / p.lifeMs) * 1.6);
          break;
        case 'firefly': {
          const blink = Math.sin(nowMs / 180 + p.seed) > 0.2;
          frame = blink ? 1 : 0;
          opacity *= blink ? 1 : 0.6;
          break;
        }
        default:
          frame = Math.floor((nowMs + p.seed * 100) / 260) % frames;
      }
      const rect = sheet.frames.get(frameKey(p.kind, 'front', frame));
      if (!rect) continue;
      // Light-giving particles stay bright at night; the rest dim with the scene.
      const glows = p.kind === 'firefly' || p.kind === 'sparkle' || p.kind === 'note';
      batch.draw({
        sheet,
        rect,
        flip: false,
        x: p.x,
        y: p.y,
        z: p.z,
        mode: p.flat ? 'flat' : 'billboard',
        w: size,
        h: size,
        opacity,
        tint: glows ? 1 : 1 - dark * 0.35,
      });
    }
  }

  clear(): void {
    this.pool.length = 0;
  }

  dispose(): void {
    this.sheet?.dispose();
    this.sheet = null;
    this.pool.length = 0;
  }
}
