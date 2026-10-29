/**
 * Lane A (FUN) numbers: comic timing and the little touches. Re-exported from `tuning.ts`.
 */

/** R0295: how long a Keeper's line stays up, and how far above the feet it floats. */
export const BARK_BUBBLE = { ms: 3200, lift: 2.3 } as const;

/**
 * R0300 (FUN-11): a shaken tree's fruit lands on the head of a Nubbin standing under it
 * (within `reach` of the trunk), at most once per Nubbin every `cooldownMs`. A hungry
 * Nubbin eats it on the spot; a full one looks up at the tree, outraged.
 */
export const FRUIT_BONK = { reach: 2.0, cooldownMs: 30_000, eatMs: 4000 } as const;
