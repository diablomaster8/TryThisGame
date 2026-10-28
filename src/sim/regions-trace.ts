/**
 * WORLD-26: looking at a world trace. The first look sets `trace:<id>` on the campaign's
 * flags, which a later chapter may read for an optional payoff; outside the campaign it sets
 * nothing, and nothing ever requires one. The lines themselves are content
 * (`src/content/world-traces.ts`); the tappable props come with each region's drawing.
 */
import type { World } from './types';

/** Note a look at trace `id`; true the first time it counts. */
export function examineTrace(world: World, id: string): boolean {
  const c = world.campaign;
  if (!c) return false;
  const key = `trace:${id}`;
  if (c.flags[key]) return false;
  c.flags[key] = true;
  return true;
}
