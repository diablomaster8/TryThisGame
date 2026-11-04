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
