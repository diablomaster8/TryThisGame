/**
 * R0122 (WORLD-55): what the map's overlay layers show for a region, read straight from the
 * world: quests from `questsInArea`, keepsakes from `world.collected`, traces from the
 * campaign's `trace:<id>` flags, fast travel from found landmarks. A found keepsake or trace
 * shows its exact spot; one not yet found is only counted, so finding it stays a surprise.
 * The completion ring is everything found over everything there is. Pure, never writes.
 */
import { COLLECTIBLES } from '../config/region-collectibles';
import { LANDMARKS } from '../config/tuning';
import type { RegionId } from '../config/regions';
import { WORLD_TRACES } from '../content/world-traces';
import { questsInArea } from './quest-areas';
import type { World } from './types';

export type MapLayer = 'quests' | 'keepsakes' | 'traces' | 'travel';
export const MAP_LAYERS: readonly MapLayer[] = ['quests', 'keepsakes', 'traces', 'travel'];

export interface MapSpot {
  id: string;
  x: number;
  z: number;
}

export interface MapOverlay {
  quests: { available: string[]; active: string[]; done: string[] };
  keepsakes: { got: number; of: number; spots: MapSpot[] };
  traces: { got: number; of: number; spots: MapSpot[] };
  /** Found landmarks, the fast-travel pins (the Grove's only, today). */
  travel: MapSpot[];
  /** 0..1 over quests, keepsakes and traces. */
  completion: number;
}

export function mapOverlay(world: World, region: RegionId): MapOverlay {
  const quests = questsInArea(world, region);
  const collected = world.collected ?? {};
  const flags = world.campaign?.flags ?? {};
  const keeps = COLLECTIBLES.filter((k) => k.region === region);
  const keepSpots = keeps
    .filter((k) => collected[k.id] !== undefined)
    .map((k) => ({ id: k.id, x: k.x, z: k.z }));
  const traces = WORLD_TRACES.filter((t) => t.region === region);
  const traceGot = traces.filter((t) => flags[`trace:${t.id}`]);
  const traceSpots = traceGot.flatMap((t) => (t.at ? [{ id: t.id, ...t.at }] : []));
  const travel =
    region === 'grove'
      ? LANDMARKS.filter((l) => world.landmarks[l.id] !== undefined).map((l) => ({
          id: l.id,
          x: l.x,
          z: l.z,
        }))
      : [];
  const qAll = quests.available.length + quests.active.length + quests.done.length;
  const of = qAll + keeps.length + traces.length;
  const got = quests.done.length + keepSpots.length + traceGot.length;
  return {
    quests,
    keepsakes: { got: keepSpots.length, of: keeps.length, spots: keepSpots },
    traces: { got: traceGot.length, of: traces.length, spots: traceSpots },
    travel,
    completion: of === 0 ? 0 : got / of,
  };
}
