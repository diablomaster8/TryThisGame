import { RIDE } from '../config/tuning';
import { rider, rideSeat, rideTows } from '../sim/ride';
import type { World } from '../sim/types';

/**
 * How both renderers draw a ride (R0085): the Keeper sits on the carrier's back, scaled down to
 * fit a Chao-sized Nubbin, raised by the seat height and set a little behind its middle along
 * the heading. That one offset is what makes the piggyback read in Pixel too: facing the
 * camera the carrier draws in front with the Keeper's head and shoulders above it, facing away
 * the Keeper draws in front, over its back. A Mischievous hop sways the pair sideways and a
 * Cheerful carrier bounces. A child towing in a Learning Grove walks hand in hand beside the
 * Keeper instead, so the Keeper keeps walking and only steps aside. Reads the sim; never writes.
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
  nowMs: number,
  moving: boolean,
  reduceMotion: boolean,
): RidePose | null {
  const seat = rideSeat(world);
  const n = rider(world);
  if (!seat || !n) return null;
  const f = world.keeper.facing;
  const tows = rideTows(n);
  // Sideways: the hop sway, or the hand-hold gap for a tow. Back: onto the carrier's back.
  const across = tows ? RIDE.towGap : seat.sway;
  const back = tows ? 0 : RIDE.seatBack;
  const bounce =
    n.personality === 'cheerful' && moving && !reduceMotion
      ? Math.abs(Math.sin(nowMs / 140)) * RIDE.bounce
      : 0;
  return {
    sits: !tows,
    lift: seat.lift + bounce,
    dx: Math.cos(f) * across - Math.sin(f) * back,
    dz: -Math.sin(f) * across - Math.cos(f) * back,
    scale: seat.scale,
  };
}
