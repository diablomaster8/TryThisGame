/**
 * The emote ball's soft tether (LOOK-16, R0385), shared by both renderers. Each Nubbin's ball
 * keeps its own position and velocity and springs toward an anchor over the swept-back point,
 * so a quick turn or a start swings it and it settles within about half a second. A landing
 * squashes it for a beat and a change of shape pops it. Pure maths: no Three.js, no DOM, and
 * render-side only (the sim never sees it).
 */
import { EMOTE_SPRING } from '../config/tuning-look';
import { EMOTE_MOOD } from '../config/tuning-soul-r10b';

interface Ball {
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
  lastMs: number;
  shape: string;
  popMs: number;
  /** R0548: the shape it is morphing away from (shown squashing for the first beat). */
  prev: string;
}

export interface BallPose {
  x: number;
  y: number;
  z: number;
  /** Width and height scale for the ball sprite this frame. */
  sx: number;
  sy: number;
  /** R0548: the shape to draw this frame (the old one while it squashes away in a morph). */
  shape: string;
}

/** The pop curve: 0.6 → 1.15 at the midpoint → 1 at the end. */
export function popScale(t: number): number {
  if (t >= 1) return 1;
  if (t < 0.5) return 0.6 + 0.55 * (t / 0.5);
  return 1.15 - 0.15 * ((t - 0.5) / 0.5);
}

/** R0548: the share of a morph spent squashing the old shape away. */
export const MORPH_SPLIT = 0.4;

/** R0548: the morph's scale at `t` 0..1: the old shape flattens, the new one pops past 1. */
export function morphScale(t: number): { sx: number; sy: number } {
  if (t >= 1) return { sx: 1, sy: 1 };
  if (t < MORPH_SPLIT) {
    const u = t / MORPH_SPLIT;
    return { sx: 1 + 0.35 * u, sy: 1 - 0.75 * u };
  }
  const u = (t - MORPH_SPLIT) / (1 - MORPH_SPLIT);
  const s = popScale(u);
  return { sx: s * (1.1 - 0.1 * u), sy: s * (0.9 + 0.1 * u) };
}

export class EmoteSprings {
  private readonly balls = new Map<string, Ball>();
  private readonly out: BallPose = { x: 0, y: 0, z: 0, sx: 1, sy: 1, shape: 'none' };

  /**
   * Advance one Nubbin's ball toward its anchor and return where to draw it. `clamp` caps the
   * lag (world units), `snap` rounds the offset to a grid (Pixel's whole pixels; 0 for none),
   * `landedMs` is when its last hop landed (or null).
   */
  step(
    id: string,
    ax: number,
    ay: number,
    az: number,
    shape: string,
    nowMs: number,
    clamp: number,
    snap: number,
    landedMs: number | null,
    morph = false,
  ): BallPose {
    const S = EMOTE_SPRING;
    let b = this.balls.get(id);
    if (!b) {
      b = {
        x: ax,
        y: ay,
        z: az,
        vx: 0,
        vy: 0,
        vz: 0,
        lastMs: nowMs,
        shape,
        popMs: -1e9,
        prev: shape,
      };
      this.balls.set(id, b);
    }
    if (shape !== b.shape) {
      // Only a change between two shapes pops; the first ball after none just appears.
      if (b.shape !== 'none' && shape !== 'none') b.popMs = nowMs;
      b.prev = b.shape;
      b.shape = shape;
    }
    // Semi-implicit Euler in steps of at most 1/60 s; a long gap (tab away) just snaps.
    let dt = (nowMs - b.lastMs) / 1000;
    b.lastMs = nowMs;
    if (dt > 0.25 || dt < 0) {
      b.x = ax;
      b.y = ay;
      b.z = az;
      b.vx = b.vy = b.vz = 0;
      dt = 0;
    }
    while (dt > 1e-6) {
      const h = Math.min(dt, 1 / 60);
      dt -= h;
      b.vx += (S.stiffness * (ax - b.x) - S.damping * b.vx) * h;
      b.vy += (S.stiffness * (ay - b.y) - S.damping * b.vy) * h;
      b.vz += (S.stiffness * (az - b.z) - S.damping * b.vz) * h;
      b.x += b.vx * h;
      b.y += b.vy * h;
      b.z += b.vz * h;
    }
    let dx = b.x - ax;
    let dy = b.y - ay;
    let dz = b.z - az;
    const d = Math.hypot(dx, dy, dz);
    if (d > clamp) {
      const k = clamp / d;
      dx *= k;
      dy *= k;
      dz *= k;
      b.x = ax + dx;
      b.y = ay + dy;
      b.z = az + dz;
    }
    if (snap > 0) {
      dx = Math.round(dx / snap) * snap;
      dy = Math.round(dy / snap) * snap;
      dz = Math.round(dz / snap) * snap;
    }
    const o = this.out;
    o.x = ax + dx;
    o.y = ay + dy;
    o.z = az + dz;
    const landed = landedMs !== null && nowMs - landedMs >= 0 && nowMs - landedMs < S.squashMs;
    o.shape = b.shape;
    let px: number;
    let py: number;
    const mt = (nowMs - b.popMs) / EMOTE_MOOD.morphMs;
    if (morph && mt >= 0 && mt < 1) {
      // R0548: the Chao ball's morph. The old shape squashes flat and wide, then the new one
      // pops up through an overshoot: squash, flat, pop, settle.
      const k = morphScale(mt);
      if (mt < MORPH_SPLIT) o.shape = b.prev;
      px = k.sx;
      py = k.sy;
    } else {
      px = py = popScale((nowMs - b.popMs) / S.popMs);
    }
    o.sx = px * (landed ? S.squash[0] : 1);
    o.sy = py * (landed ? S.squash[1] : 1);
    return o;
  }

  /** Forget the balls of Nubbins no longer drawn. */
  keep(live: ReadonlySet<string>): void {
    for (const id of this.balls.keys()) if (!live.has(id)) this.balls.delete(id);
  }
}
