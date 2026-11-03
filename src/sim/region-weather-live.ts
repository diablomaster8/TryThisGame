import { REGION_WEATHER, type RegionWeatherKind } from '../config/region-weather';
import { REGION_WEATHER_LIVE } from '../config/tuning-r11d8';
import type { RegionId } from '../config/regions';
import { regionOf } from './regions';
import { regionSpell, regionSeason } from './region-weather';
import { hashSeed } from './rng';
import type { Season, WeatherKind, World } from './types';

/**
 * R0094 (WORLD-31), the live half: the weather a drawn region shows right now. Spells chain
 * from `regionSpell` (seeded per region and spell number), counted from the sim clock, so the
 * same save sees the same sky in the same region and the Grove's own stream is never touched.
 * Closed-form: the walk from spell 0 is memoised, so a week away costs one cheap loop.
 */
export interface RegionSky {
  kind: RegionWeatherKind;
  /** What the renderers' rain and snow layers draw (fog, wind and clear draw none). */
  draw: WeatherKind;
  /** 0..1 for the drawn layer, already lowered under a canopy. */
  intensity: number;
  /** 0..1 ground haze the renderers lay over the picture. */
  fog: number;
  season: Season;
}

/** Debug and checks: a spell kind held in place of the rolled one (null rolls as usual). */
export const skyForce: { kind: RegionWeatherKind | null; season: Season | null } = {
  kind: null,
  season: null,
};
if (import.meta.env?.DEV) (globalThis as { __skyForce?: object }).__skyForce = skyForce;

const memo = new Map<string, { n: number; startMs: number; end: number }>();

/** The sky of the region the Keeper is in; null in the Grove and in any region without a table. */
export function regionSky(world: World, hour: number): RegionSky | null {
  const region = regionOf(world.location) as RegionId;
  return regionSkyAt(world.seed, region, world.timeMs, hour, world.debugSeason ?? world.season);
}

export function regionSkyAt(
  seed: number,
  region: RegionId,
  timeMs: number,
  hour: number,
  groveSeason: Season,
): RegionSky | null {
  const def = REGION_WEATHER[region];
  if (!def || region === 'grove') return null;
  const key = `${seed}:${region}`;
  let m = memo.get(key);
  if (!m || timeMs < m.startMs) m = { n: 0, startMs: 0, end: -1 };
  // The hour a spell began at, from the hour now (the clock runs 1:1 with real time).
  const hourAt = (ms: number) => (((hour - (timeMs - ms) / 3_600_000) % 24) + 24) % 24;
  let spell = regionSpell(seed, region, m.n, hourAt(m.startMs))!;
  while (m.startMs + spell.ms <= timeMs) {
    m.startMs += spell.ms;
    m.n++;
    spell = regionSpell(seed, region, m.n, hourAt(m.startMs))!;
  }
  memo.set(key, { ...m, end: m.startMs + spell.ms });
  const kind = skyForce.kind ?? spell.kind;
  const roll = (hashSeed(`${seed}:${region}:i:${m.n}`) % 1000) / 1000;
  let draw: WeatherKind = 'clear';
  let intensity = 0;
  if (kind === 'rain' || kind === 'snow') {
    draw = kind;
    intensity = 0.5 + roll * 0.5;
  } else if (kind === 'sunshower') {
    draw = 'rain';
    intensity = REGION_WEATHER_LIVE.sunshowerIntensity;
  }
  if (draw === 'rain' && def.sheltered) intensity *= REGION_WEATHER_LIVE.canopyShare;
  const fog = kind === 'fog' ? REGION_WEATHER_LIVE.fog * (0.7 + roll * 0.3) : 0;
  return { kind, draw, intensity, fog, season: skyForce.season ?? regionSeason(region, groveSeason) };
}
