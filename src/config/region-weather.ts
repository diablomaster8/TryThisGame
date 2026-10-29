import type { Season } from '../sim/types';
import type { RegionId } from './regions';

/**
 * R0094 (WORLD-31): seasons and weather per region. The Grove keeps the sim's own weather and
 * season (they drive happiness, `sim/weather.ts`); every other region rolls its own spells
 * from a seeded stream while the Keeper is there (`sim/region-weather.ts`), so the peaks snow
 * in July and the beach never does. Weights need not sum to 1.
 */
export type RegionWeatherKind = 'clear' | 'rain' | 'snow' | 'fog' | 'wind' | 'sunshower';

export interface RegionWeatherDef {
  /** `world` follows the Grove's season; a season pins it. */
  season: 'world' | Season;
  weights: Partial<Record<RegionWeatherKind, number>>;
  /** Extra fog weight before `fogUntilH` (morning fog on the shore). */
  morningFog?: { weight: number; fogUntilH: number };
  /** A spell lasts between these, in ms. */
  spellMs: readonly [number, number];
  /** Under a canopy: the Keeper is sheltered and Nubbins do not flee the rain. */
  sheltered?: boolean;
}

const MIN = 60_000;

export const REGION_WEATHER: Partial<Record<RegionId, RegionWeatherDef>> = {
  // Above the snow line it is always winter, and snowing more often than not.
  peaks: {
    season: 'winter',
    weights: { snow: 0.6, clear: 0.3, wind: 0.1 },
    spellMs: [6 * MIN, 14 * MIN],
  },
  shore: {
    season: 'summer',
    weights: { clear: 0.6, sunshower: 0.15, wind: 0.15, rain: 0.1 },
    morningFog: { weight: 0.8, fogUntilH: 10 },
    spellMs: [5 * MIN, 12 * MIN],
  },
  wood: {
    season: 'world',
    weights: { rain: 0.4, clear: 0.4, fog: 0.2 },
    spellMs: [5 * MIN, 10 * MIN],
    sheltered: true,
  },
  ridge: {
    season: 'world',
    weights: { clear: 0.5, wind: 0.35, rain: 0.15 },
    spellMs: [5 * MIN, 12 * MIN],
  },
  village: { season: 'world', weights: { clear: 0.7, rain: 0.3 }, spellMs: [6 * MIN, 14 * MIN] },
  sunlands: {
    season: 'summer',
    weights: { clear: 0.9, sunshower: 0.1 },
    spellMs: [8 * MIN, 16 * MIN],
  },
  moonlands: { season: 'world', weights: { clear: 0.6, fog: 0.4 }, spellMs: [8 * MIN, 16 * MIN] },
};

/** The 3D rain and snow particle cap on a phone (`render3d/weather.ts`). */
export const REGION_WEATHER_PHONE_PARTICLES = 1500;
