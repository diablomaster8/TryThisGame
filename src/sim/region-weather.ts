import { REGION_WEATHER, type RegionWeatherKind } from '../config/region-weather';
import type { RegionId } from '../config/regions';
import { hashSeed, Rng } from './rng';
import type { Season } from './types';

/**
 * R0094: a region's own weather. Spell `n` of a region is rolled from its own seeded stream
 * (the world seed, the region and the spell's number), so the same save always sees the same
 * sequence there and the Grove's random stream is never touched. The Grove (and any region
 * without a table) returns null: the sim's own weather applies.
 */
export interface RegionSpell {
  kind: RegionWeatherKind;
  ms: number;
}

/** The season a region shows, given the Grove's. */
export function regionSeason(region: RegionId, groveSeason: Season): Season {
  const def = REGION_WEATHER[region];
  return !def || def.season === 'world' ? groveSeason : def.season;
}

/** Spell number `n` in a region (`hour` is the region's hour, for morning fog). */
export function regionSpell(
  seed: number,
  region: RegionId,
  n: number,
  hour = 12,
): RegionSpell | null {
  const def = REGION_WEATHER[region];
  if (!def || region === 'grove') return null;
  const rng = new Rng(hashSeed(`${seed}:weather:${region}:${n}`));
  const weights: Partial<Record<RegionWeatherKind, number>> = { ...def.weights };
  if (def.morningFog && hour < def.morningFog.fogUntilH)
    weights.fog = (weights.fog ?? 0) + def.morningFog.weight;
  const kind = rng.weighted(weights as Record<RegionWeatherKind, number>);
  const [lo, hi] = def.spellMs;
  return { kind, ms: Math.round(lo + rng.next() * (hi - lo)) };
}
