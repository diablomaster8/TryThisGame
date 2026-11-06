import { SEASON_KEEPSAKE, SEASON_PROPS, type SeasonProp } from '../config/tuning-r12d2';
import type { RegionId } from '../config/regions';
import { LEAF_JUMP } from '../config/tuning-r13d2';
import { regionShown } from './region-companion';
import { drawnRegionOf } from './region-walk';
import { regionSeason } from './region-weather';
import { scatterSpots } from './region-spots';
import type { Season, SimEvent, World } from './types';

/**
 * R0118 (WORLD-51): seasons change the places, not just the prices. A drawn region sets out its
 * own small things in each season (`SEASON_PROPS`) on seeded open ground: the same places every
 * year. The first prop of the season is its keepsake, a few Shells for walking up, once per region
 * per season per save (`season:<region>:<season>` in `world.collected`), never a streak.
 */
export interface SeasonSpot {
  kind: SeasonProp;
  x: number;
  z: number;
  /** 0 is the season's keepsake. */
  n: number;
}

const memo = new Map<string, readonly SeasonSpot[]>();

/** The season a region is in: the world's (or debug) season, or the region's own fixed one. */
export function seasonHere(world: World, region: RegionId): Season {
  return regionSeason(region, world.debugSeason ?? world.season);
}

/** The props a region sets out in `season` (empty for a region or season with none). */
export function seasonSpots(region: RegionId, season: Season): readonly SeasonSpot[] {
  const rule = SEASON_PROPS[region]?.[season];
  if (!rule) return [];
  const key = `${region}:${season}`;
  const hit = memo.get(key);
  if (hit) return hit;
  const spots = scatterSpots(region, `season:${season}`, rule.n, SEASON_KEEPSAKE.gap).map(
    (p, n) => ({ kind: rule.kind, x: p.x, z: p.z, n }),
  );
  memo.set(key, spots);
  return spots;
}

const keyOf = (region: string, season: string) => `season:${region}:${season}`;

/** The keepsake of this season in this region has been taken. */
export function seasonKeepsakeTaken(
  world: Pick<World, 'collected'>,
  region: string,
  season: string,
): boolean {
  return (world.collected ?? {})[keyOf(region, season)] !== undefined;
}

const jumped = new WeakMap<World, Map<string, number>>();

/**
 * R13 d2 (R0118): a jump over an autumn leaf pile lands in it: a rustle toast and a little
 * happiness for the Nubbins that came along, at most once a minute per pile.
 */
function leafJump(world: World, region: RegionId, season: Season, events: SimEvent[]): void {
  const k = world.keeper;
  if (season !== 'autumn' || k.y < LEAF_JUMP.minY) return;
  const book = jumped.get(world) ?? new Map<string, number>();
  jumped.set(world, book);
  for (const s of seasonSpots(region, season)) {
    if (s.kind !== 'leafpile') continue;
    if (Math.hypot(s.x - k.pos.x, s.z - k.pos.z) > LEAF_JUMP.radius) continue;
    const key = `${region}:${s.n}`;
    if (world.timeMs - (book.get(key) ?? -Infinity) < LEAF_JUMP.cooldownMs) continue;
    book.set(key, world.timeMs);
    for (const n of regionShown(world))
      n.needs.happiness = Math.min(100, n.needs.happiness + LEAF_JUMP.happiness);
    events.push({ kind: 'regionGag', id: 'leaf-jump', first: true });
  }
}

/** Walking up to the season's first prop takes its keepsake, once. */
export function stepSeasonProps(world: World, events: SimEvent[]): void {
  const region = drawnRegionOf(world.location);
  if (!region) return;
  const season = seasonHere(world, region);
  leafJump(world, region, season, events);
  const first = seasonSpots(region, season)[0];
  if (!first || seasonKeepsakeTaken(world, region, season)) return;
  const k = world.keeper.pos;
  if (Math.hypot(first.x - k.x, first.z - k.z) > SEASON_KEEPSAKE.radius) return;
  (world.collected ??= {})[keyOf(region, season)] = world.timeMs;
  world.inventory.shells += SEASON_KEEPSAKE.shells;
  events.push({ kind: 'regionGag', id: `season-${season}`, first: true });
}
