import type { DecorKind } from '../sim/types';
import type { RegionId } from './regions';

/**
 * Round 12, helper d2: tunables for the open world's content tables.
 *
 * - `SET_REWARDS` (R0091, WORLD-27): what a finished set of petals or postcards gives in each
 *   drawn region, once. The Grove's own reward stays in `COLLECT.rewards`.
 * - `KEEPSAKE_SPOTS`: how far apart a region's seeded collectibles stand.
 */
export const SET_REWARDS: Partial<Record<RegionId, { decor: DecorKind; hat: string }>> = {
  wood: { decor: 'springShroom', hat: 'beanie' },
  shore: { decor: 'rockPile', hat: 'straw' },
  ruins: { decor: 'statue', hat: 'bucket' },
  ridge: { decor: 'lanternSmall', hat: 'beanie' },
  sunlands: { decor: 'flowerbed', hat: 'crown' },
  moonlands: { decor: 'lanternSmall', hat: 'flower' },
};

export const KEEPSAKE_SPOTS = {
  /** Units between two collectibles of a seeded region. */
  gap: 5.5,
  /** Units a collectible keeps from a trace, so the two are not one stop. */
  awayFromTrace: 4,
} as const;

/**
 * R0120 (WORLD-53): the one wild Nubbin of each drawn region, a shy baby that may be befriended
 * with a fruit and then moves into the village square. `types` is the favourite type of the
 * region (the species is a seeded pick of that type), `names` are its possible names.
 */
export const WILD_NUBBIN = {
  /** Stand this close, with a fruit, to offer it. */
  reach: 2.4,
  /** Milliseconds it takes to decide. */
  befriendMs: 2500,
  /** How far it strolls from its home spot, and how long one stroll takes. */
  roam: 1,
  strollMs: 14_000,
  /** Fruit it takes. */
  fruit: 1,
  regions: {
    wood: { types: ['power', 'normal'], names: ['Burl', 'Tansy', 'Moss'] },
    shore: { types: ['swim'], names: ['Skerry', 'Pebble', 'Brine'] },
    ridge: { types: ['fly'], names: ['Gust', 'Fell', 'Pip'] },
    ruins: { types: ['power', 'normal'], names: ['Flint', 'Ember', 'Cairn'] },
    sunlands: { types: ['run', 'fly'], names: ['Marigold', 'Dazzle', 'Noon'] },
    moonlands: { types: ['normal', 'fly'], names: ['Wick', 'Dusk', 'Lull'] },
  } as Record<string, { types: readonly string[]; names: readonly string[] } | undefined>,
} as const;

/**
 * R0110 (WORLD-24): the stat gate each other drawn region holds on optional ground, never the
 * story. Seeded onto open ground well away from the path and every point of interest by
 * `sim/region-gates.ts`; a partner with the matching stat at the gate's level opens it, once.
 */
export const GATE_PLAN = {
  /** World units the gate keeps from the path and from every point of interest. */
  awayFrom: 6,
  /** Its own footprint. */
  r: 1.5,
  regions: {
    shore: { kind: 'deepWater', shells: 100, essence: 'swim' },
    ridge: { kind: 'updraft', shells: 100, essence: 'fly' },
    ruins: { kind: 'longRun', shells: 100, essence: 'run' },
    moonlands: { kind: 'boulder', shells: 100, essence: 'power' },
  } as Record<
    string,
    | {
        kind: 'boulder' | 'deepWater' | 'updraft' | 'longRun';
        shells: number;
        essence: 'swim' | 'fly' | 'run' | 'power';
      }
    | undefined
  >,
} as const;

/** R0136 (WORLD-70): how many pieces a region's build plot holds, and how close two may stand. */
export const PLOT_RULES = { max: 12, spacing: 0.9, half: 4 } as const;
