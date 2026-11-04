/**
 * WORLD-26: looking at a world trace. The first look sets `trace:<id>` on the campaign's
 * flags, which a later chapter may read for an optional payoff; outside the campaign it sets
 * nothing, and nothing ever requires one. The lines themselves are content
 * (`src/content/world-traces.ts`); the tappable props come with each region's drawing.
 */
import { WORLD_TRACES } from '../content/world-traces';
import type { SimEvent, World } from './types';

/** Note a look at trace `id`; true the first time it counts. */
export function examineTrace(world: World, id: string): boolean {
  const c = world.campaign;
  if (!c) return false;
  const key = `trace:${id}`;
  if (c.flags[key]) return false;
  c.flags[key] = true;
  return true;
}

/** How close the Keeper stands to look at a trace (world units). */
export const TRACE_LOOK_RADIUS = 2;

/** R0090: a look is kept once per save in `world.collected` (`trace:<id>`), so it never repeats. */
export function traceSeen(world: Pick<World, 'collected'>, id: string): boolean {
  return (world.collected ?? {})[`trace:${id}`] !== undefined;
}

/** The Grove's traces the Keeper has not looked at yet (where the renderers glint). */
export function openTraces(world: World): Array<{ id: string; x: number; z: number }> {
  if (world.location !== 'grove') return [];
  const out: Array<{ id: string; x: number; z: number }> = [];
  for (const t of WORLD_TRACES) {
    if (t.region === 'grove' && t.at && !traceSeen(world, t.id)) out.push({ id: t.id, ...t.at });
  }
  return out;
}

/** Walking up to a trace looks at it: once, with its flag set where a campaign reads it. */
export function stepTraces(world: World, events: SimEvent[]): void {
  if (world.location !== 'grove') return;
  const k = world.keeper.pos;
  for (const t of openTraces(world)) {
    if (Math.hypot(t.x - k.x, t.z - k.z) > TRACE_LOOK_RADIUS) continue;
    (world.collected ??= {})[`trace:${t.id}`] = world.timeMs;
    examineTrace(world, t.id);
    events.push({ kind: 'traceFound', id: t.id });
  }
}
