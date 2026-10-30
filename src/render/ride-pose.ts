import { RIDE } from '../config/tuning';
import { rider, rideSeat, rideTows } from '../sim/ride';
import type { World } from '../sim/types';

/**
 * How both renderers draw a ride (R0085): the Keeper sits on the carrier's back (scaled down
 * to fit a Chao-sized Nubbin), raised by the seat height, nudged toward the camera so it
 * draws in front of its carrier, swayed sideways during a Mischievous hop and bounced by a
 * Cheerful one. A child towing in a Learning Grove walks beside the Keeper hand in hand
 * instead, so the Keeper keeps walking and only steps aside. Reads the sim; never writes.
 */
export interface RidePose {
  /** The Keeper sits (on a carrier) or walks (towed by the hand). */
  sits: boolean;
  /** World offsets for the Keeper: up, and across the ground. */
  lift: number;
  dx: number;
  dz: number;
  scale: number;
}

export function ridePose(
  world: World,
  yaw: number | null,
  nowMs: number,
  moving: boolean,
  reduceMotion: boolean,
): RidePose | null {
  const seat = rideSeat(world);
  const n = rider(world);
  if (!seat || !n) return null;
  const f = world.keeper.facing;
  // Across the heading (the hop sway, or the hand-hold gap for a tow), then toward the camera.
  const across = rideTows(n) ? 0.45 : seat.sway;
  // Pixel billboards sort by depth, so the Keeper steps a hair toward the camera; 3D has a z-buffer.
  const toCam = rideTows(n) || yaw === null ? 0 : 0.12;
  const cy = yaw ?? 0;
  const bounce =
    n.personality === 'cheerful' && moving && !reduceMotion
      ? Math.abs(Math.sin(nowMs / 140)) * RIDE.bounce
      : 0;
  return {
    sits: !rideTows(n),
    lift: seat.lift + bounce,
    dx: Math.cos(f) * across + Math.sin(cy) * toCam,
    dz: -Math.sin(f) * across + Math.cos(cy) * toCam,
    scale: seat.scale,
  };
}
