/**
 * The emote ball's soft tether (LOOK-16, R0385), shared by both renderers. Each Nubbin's ball
 * keeps its own position and velocity and springs toward an anchor over the swept-back point,
 * so a quick turn or a start swings it and it settles within about half a second. A landing
 * squashes it for a beat and a change of shape pops it. Pure maths: no Three.js, no DOM, and
 * render-side only (the sim never sees it).
 */
import { EMOTE_SPRING } from '../config/tuning-look';

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
}

export interface BallPose {
  x: number;
  y: number;
  z: number;
  /** Width and height scale for the ball sprite this frame. */
  sx: number;
  sy: number;
}

/** The pop curve: 0.6 → 1.15 at the midpoint → 1 at the end. */
export function popScale(t: number): number {
  if (t >= 1) return 1;
  if (t < 0.5) return 0.6 + 0.55 * (t / 0.5);
  return 1.15 - 0.15 * ((t - 0.5) / 0.5);
}

export class EmoteSprings {
  private readonly balls = new Map<string, Ball>();
  private readonly out: BallPose = { x: 0, y: 0, z: 0, sx: 1, sy: 1 };

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
  ): BallPose {
    const S = EMOTE_SPRING;
    let b = this.balls.get(id);
    if (!b) {
      b = { x: ax, y: ay, z: az, vx: 0, vy: 0, vz: 0, lastMs: nowMs, shape, popMs: -1e9 };
      this.balls.set(id, b);
    }
    if (shape !== b.shape) {
      // Only a change between two shapes pops; the first ball after none just appears.
      if (b.shape !== 'none' && shape !== 'none') b.popMs = nowMs;
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
    const pop = popScale((nowMs - b.popMs) / S.popMs);
    const landed = landedMs !== null && nowMs - landedMs >= 0 && nowMs - landedMs < S.squashMs;
    o.sx = pop * (landed ? S.squash[0] : 1);
    o.sy = pop * (landed ? S.squash[1] : 1);
    return o;
  }

  /** Forget the balls of Nubbins no longer drawn. */
  keep(live: ReadonlySet<string>): void {
    for (const id of this.balls.keys()) if (!live.has(id)) this.balls.delete(id);
  }
}
