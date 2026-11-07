/**
 * R0118 (WORLD-51): the frozen pond. In a free-play winter (no campaign running, so the
 * renderers' own `freeIce` rule draws the ice) the pond is a surface the Keeper walks on and
 * slides across: the stick runs at x1.4 with low steering. Nubbins keep off it. Pure; the
 * keeper, nav and behaviour read it.
 */
import type { ReadonlyWorld } from './readonly';
import { GROVE } from '../config/tuning';
import { ICE } from '../config/tuning-more/world-edu-trail-ice';
import { WATER_LEVEL } from './terrain';
import type { Vec2, World } from './types';

/**
 * Worlds whose season comes from a real calendar this session (live play steps with a wall
 * clock every step). A world made at wall time 0 reads as winter, and a scripted run that
 * never passes a wall clock must not find its pond frozen, so the ice waits for this or for
 * the debug panel's forced winter. Not saved: the first live step marks the world again.
 */
const calendarWorlds = new WeakSet<object>();

/** Called by the step that sets the season from the wall clock. */
export function noteCalendarSeason(world: World): void {
  calendarWorlds.add(world);
}

/**
 * True while the Grove's pond is frozen for walking on, at home: a free-play winter, or in
 * story mode the chapters the renderers draw the pond frozen (`pondIceWanted` in
 * render/dress-w.ts: Hazel's Grove, chapters 10 to 12). A scene's own stage can hide the ice
 * for its shot; the sim keeps it frozen through the chapter, as the Long Night's cold does.
 */
export function pondIsIce(
  world: Pick<ReadonlyWorld, 'season' | 'debugSeason' | 'location' | 'campaign'>,
): boolean {
  if (world.location !== 'grove') return false;
  const c = world.campaign;
  // As the renderers draw it: Hazel's frozen chapters, or the debug panel's forced winter.
  if (c)
    return (
      ((c.storyline ?? 'hazel') === 'hazel' && c.chapter >= 10 && c.chapter <= 12) ||
      world.debugSeason === 'winter'
    );
  if (world.debugSeason) return world.debugSeason === 'winter';
  return world.season === 'winter' && calendarWorlds.has(world);
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
