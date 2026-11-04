/**
 * WORLD-26: looking at a world trace. The first look sets `trace:<id>` on the campaign's
 * flags, which a later chapter may read for an optional payoff; outside the campaign it sets
 * nothing, and nothing ever requires one. The lines themselves are content
 * (`src/content/world-traces.ts`); the tappable props come with each region's drawing.
 */
import { WORLD_TRACES, type WorldTrace } from '../content/world-traces';
import type { RegionId } from '../config/regions';
import { drawnRegionOf } from './region-walk';
import { spotNear } from './region-spots';
import { bumpMarks } from './region-marks';
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

/** Where a trace stands: the Grove's as authored, a drawn region's snapped to open reachable ground. */
const placedAt = new Map<string, { x: number; z: number } | null>();
export function traceSpot(t: WorldTrace): { x: number; z: number } | null {
  if (!t.at) return null;
  if (t.region === 'grove') return t.at;
  if (placedAt.has(t.id)) return placedAt.get(t.id)!;
  const p = spotNear(t.region, t.at.x, t.at.z);
  placedAt.set(t.id, p);
  return p;
}

/** The region whose traces are on show: the Grove, or the drawn region the Keeper is in. */
function hereRegion(world: Pick<World, 'location'>): RegionId | null {
  return world.location === 'grove' ? 'grove' : drawnRegionOf(world.location);
}

/** The traces in the Keeper's region the Keeper has not looked at yet (where the renderers glint). */
export function openTraces(world: World): Array<{ id: string; x: number; z: number }> {
  const region = hereRegion(world);
  if (!region) return [];
  const out: Array<{ id: string; x: number; z: number }> = [];
  for (const t of WORLD_TRACES) {
    if (t.region !== region || traceSeen(world, t.id)) continue;
    const at = traceSpot(t);
    if (at) out.push({ id: t.id, ...at });
  }
  return out;
}

/** Walking up to a trace looks at it: once, with its flag set where a campaign reads it. */
export function stepTraces(world: World, events: SimEvent[]): void {
  if (!hereRegion(world)) return;
  const k = world.keeper.pos;
  for (const t of openTraces(world)) {
    if (Math.hypot(t.x - k.x, t.z - k.z) > TRACE_LOOK_RADIUS) continue;
    (world.collected ??= {})[`trace:${t.id}`] = world.timeMs;
    examineTrace(world, t.id);
    bumpMarks();
    events.push({ kind: 'traceFound', id: t.id });
  }
}
