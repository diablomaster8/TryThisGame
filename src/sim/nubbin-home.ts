import { regionOfLine, type StoryRegionId } from '../config/story-regions';
import { LINE_REWARD } from '../config/tuning';
import { isStoryRegion, storyRegionHere } from './story-regions';
import type { Nubbin, World } from './types';

/**
 * Lane C r10 agent D (R0594, CAMP-02): where a Nubbin lives, for the roster and the renderers.
 * A questline's Nubbin the Keeper let stay where its line lives has `home` set (`fold`,
 * `server`, `road`...). The sim steps it like any other, but it is drawn and listed only while
 * the Keeper is in that place, so it never wanders the Grove or fills its roster screen. A
 * Nubbin with no home (or `grove`) is the Grove's, shown everywhere as before.
 */

/** The story region a `home` value names: a region id itself, or the place a line's cast stays. */
export function homeRegion(home: string | undefined): StoryRegionId | null {
  if (!home || home === 'grove') return null;
  if (isStoryRegion(home)) return home;
  for (const [line, r] of Object.entries(LINE_REWARD))
    if (r.home === home || line === home) return regionOfLine(line);
  return null;
}

/** Is Nubbin `n` where the Keeper is: a Grove Nubbin always, a line's one only in its region. */
export function nubbinHere(world: World, n: Nubbin): boolean {
  const r = homeRegion(n.home);
  return r === null || storyRegionHere(world) === r;
}

/** The Nubbins drawn and listed here (`nubbinHere`), in roster order. */
export function nubbinsHere(world: World, list: readonly Nubbin[] = world.nubbins): Nubbin[] {
  return list.filter((n) => nubbinHere(world, n));
}
