/**
 * Lane D round 13, helper d1: numbers for the drawn regions' content (WORLD-35 shore folk,
 * castles and signpost; WORLD-34 Nubbin gardens; WORLD-37 colonnade; WORLD-25 mill wheel;
 * WORLD-36 snowballs; WORLD-33 lane walk-out; WORLD-69 island and cart). Imported directly.
 */

/** WORLD-35: regions whose quests are given at a signpost (and at their named points), not anywhere. */
export const SIGN_OFFERS: Readonly<Record<string, string>> = {
  shore: 'shore-sign',
};

/** WORLD-35: the sandcastles Power Nubbins knock down, and the Kettleby folk on the shore. */
export const SHORE_PLAY = {
  /** A castle stands again this long after it fell (ms): the beach is never used up. */
  rebuildMs: 10 * 60_000,
  /** How near a Power partner must stand for it to knock a castle down. */
  reach: 2.2,
  /** How long it takes (ms). */
  knockMs: 2500,
  /** Shells for a castle (once per rebuild), and the Keeper's own kick range. */
  shells: 3,
  /** Folk: how far from home they stroll, and a loop's length (ms). */
  strollR: 2.4,
  loopMs: 16_000,
} as const;
