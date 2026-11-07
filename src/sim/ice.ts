/**
 * R0118 (WORLD-51): the frozen pond. In a free-play winter (no campaign running, so the
 * renderers' own `freeIce` rule draws the ice) the pond is a surface the Keeper walks on and
 * slides across: the stick runs at x1.4 with low steering. Nubbins keep off it. Pure; the
 * keeper, nav and behaviour read it.
 */
import { GROVE } from '../config/tuning';
import { ICE } from '../config/tuning-r14d2';
import { WATER_LEVEL } from './terrain';
import type { Vec2, World } from './types';

/** True while the Grove's pond is frozen for walking on: a free-play winter, at home. */
export function pondIsIce(
  world: Pick<World, 'season' | 'debugSeason' | 'location' | 'campaign'>,
): boolean {
  return (
    world.location === 'grove' &&
    !world.campaign &&
    (world.debugSeason ?? world.season) === 'winter'
  );
}

/** Whether a point is over the pond's water (not its shore ring). */
export function overPond(p: Vec2): boolean {
  return Math.hypot(p.x - GROVE.pond.x, p.z - GROVE.pond.z) < GROVE.pond.r;
}

/** Whether the Keeper stands on the ice right now. */
export function keeperOnIce(world: World): boolean {
  return pondIsIce(world) && world.keeper.grounded && overPond(world.keeper.pos);
}

/** The ice surface's height. */
export const ICE_Y = WATER_LEVEL + ICE.surfaceLift;
