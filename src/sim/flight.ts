/**
 * LOOK-24: strong fliers take short flights. Some wander legs of an adult with a high Fly
 * level are flights: the Nubbin rises over `riseMs`, cruises at `speed`× the walk and glides
 * down over `glideMs` before it lands. Which legs fly is seeded by the Nubbin and the leg's
 * start time, and the height is a pure function of sim state, so it costs nothing per step;
 * the sim keeps `y` at 0 (nothing else sees it airborne) and both renderers draw the height.
 */

import { FLIGHT } from '../config/tuning-look';
import { BEHAVIOR } from '../config/tuning';
import { levelOf } from './stats';
import type { Nubbin } from './types';

/** Whether the Nubbin's current wander leg is a flight. */
export function fliesLeg(n: Nubbin): boolean {
  const b = n.behavior;
  if (b.state !== 'wander' || !b.target || n.stage !== 'adult') return false;
  if (levelOf(n.stats.fly.points) < FLIGHT.minLevel) return false;
  // A small integer hash of the seed and the leg's start: stable for the whole leg.
  let h = (n.seed ^ Math.floor(b.sinceMs / 100)) >>> 0;
  h = Math.imul(h ^ (h >>> 16), 0x45d9f3b) >>> 0;
  h = (h ^ (h >>> 16)) >>> 0;
  return h % 1000 < FLIGHT.chance * 1000;
}

export type FlightPhase = 'rise' | 'cruise' | 'glide';

/**
 * How high a flying Nubbin is at sim time `t` (the renderers pass an in-between time) and
 * which part of the flight it is in, or null when it is not flying.
 */
export function flightY(n: Nubbin, t: number): { y: number; phase: FlightPhase } | null {
  if (!fliesLeg(n)) return null;
  const b = n.behavior;
  const target = b.target!;
  const up = Math.min(1, Math.max(0, (t - b.sinceMs) / FLIGHT.riseMs));
  // Time left until it lands: at the target, or when the leg's timer runs out.
  const d = Math.max(0, Math.hypot(target.x - n.pos.x, target.z - n.pos.z) - BEHAVIOR.arriveRadius);
  const left = Math.min((d / (BEHAVIOR.walkSpeed * FLIGHT.speed)) * 1000, b.untilMs - t);
  const down = Math.min(1, Math.max(0, left / FLIGHT.glideMs));
  const k = Math.min(1 - (1 - up) * (1 - up), down);
  return {
    y: FLIGHT.height * k,
    phase: up < 1 && up <= down ? 'rise' : down < 1 ? 'glide' : 'cruise',
  };
}
