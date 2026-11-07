/**
 * R0321: where a hiding Nubbin is DRAWN. The sim sends a shy one behind its cover on the side
 * away from the Keeper; the camera can be anywhere, so the renderers re-seat the peek on the
 * far side of the cover from the camera, a little off to the side the Keeper is on, so the body
 * is half hidden by the cover and the crown, a hand and the eyes show past its edge. Drawn only:
 * the sim position never moves. Shared by the Pixel and Full 3D renderers.
 */
import { hideCover, type HideCover } from '../sim/hide';
import { resolve } from '../sim/obstacles';
import type { Nubbin, World } from '../sim/types';

/** Sideways offset of the peek from the cover's centre line, in world units. */
export const PEEK_SIDE = 0.45;
/** How long it takes to slip in behind the cover, and out again, in ms. */
export const PEEK_EASE_MS = 600;

export interface PeekPlace {
  x: number;
  z: number;
  /** 0..1, how far it has slipped behind the cover. */
  k: number;
  /** Screen side the Keeper is on: -1 left, 1 right. The eyes glance that way. */
  side: -1 | 1;
}

interface Track {
  k: number;
  at: number;
  cover: HideCover | null;
  side: -1 | 1;
  spot: { x: number; z: number } | null;
}

/** True while the Nubbin sits tucked behind its cover (arrived, not walking). */
export function isPeeking(n: Nubbin): boolean {
  return n.behavior.state === 'hide' && !n.behavior.target;
}

/**
 * Pure placement: behind `cover` seen from `cam` (x, z), shifted `side` along camera-right.
 * The spot is pushed out of any other collider.
 */
export function peekSpot(
  world: World,
  cover: HideCover,
  cam: { x: number; z: number },
  side: -1 | 1,
): { x: number; z: number } {
  const fx = cover.x - cam.x;
  const fz = cover.z - cam.z;
  const fl = Math.hypot(fx, fz) || 1;
  const dx = fx / fl;
  const dz = fz / fl;
  const gap = cover.r * 0.55 + 0.25;
  // Camera-right on the ground, as the 3D renderer works it out for a performer.
  const rx = -dz;
  const rz = dx;
  const p = {
    x: cover.x + dx * gap + rx * side * PEEK_SIDE,
    z: cover.z + dz * gap + rz * side * PEEK_SIDE,
  };
  resolve(p, world, 0.25, 'nubbin');
  return p;
}

/** Which screen side the Keeper is on, from the cover, with a dead zone so it never flickers. */
export function keeperSide(
  cover: HideCover,
  cam: { x: number; z: number },
  keeper: { x: number; z: number },
  prev: -1 | 1,
): -1 | 1 {
  const fx = cover.x - cam.x;
  const fz = cover.z - cam.z;
  const fl = Math.hypot(fx, fz) || 1;
  const s = ((keeper.x - cover.x) * -fz + (keeper.z - cover.z) * fx) / fl;
  if (s > 0.8) return 1;
  if (s < -0.8) return -1;
  return prev;
}

/** Per-Nubbin easing of the slip behind the cover. */
export class HidePeek {
  private readonly tracks = new Map<string, Track>();

  /**
   * The drawn spot for `n` (given its interpolated sim position), or null when it is not
   * hiding and has finished slipping back out. `calm` (reduced motion) snaps in and out.
   */
  place(
    world: World,
    n: Nubbin,
    cam: { x: number; z: number },
    x: number,
    z: number,
    nowMs: number,
    calm: boolean,
  ): PeekPlace | null {
    let t = this.tracks.get(n.id);
    const on = isPeeking(n);
    if (!t) {
      if (!on) return null;
      t = { k: 0, at: nowMs, cover: null, side: 1, spot: null };
      this.tracks.set(n.id, t);
    }
    const dt = Math.max(0, Math.min(100, nowMs - t.at));
    t.at = nowMs;
    if (on) {
      t.cover = hideCover(world, n) ?? t.cover;
      if (t.cover) {
        t.side = keeperSide(t.cover, cam, world.keeper.pos, t.side);
        t.spot = peekSpot(world, t.cover, cam, t.side);
      }
    }
    const goal = on && t.spot ? 1 : 0;
    t.k = calm ? goal : Math.max(0, Math.min(1, t.k + (goal ? dt : -dt) / PEEK_EASE_MS));
    if (t.k <= 0 && !on) {
      this.tracks.delete(n.id);
      return null;
    }
    if (!t.spot) return null;
    const e = t.k * t.k * (3 - 2 * t.k);
    return { x: x + (t.spot.x - x) * e, z: z + (t.spot.z - z) * e, k: t.k, side: t.side };
  }
}
