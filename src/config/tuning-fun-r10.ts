/**
 * Lane E r10, fun helper: tunables for the Keepers' comic micro-scenes (R0367, FUN-78) and
 * Byte's shoelace (R0366, FUN-77). Story-paced times go through `paced()` in the sim.
 */
export const FUN_R10 = {
  /** A micro-scene waits this long after the last scene ended (a quiet stretch, 2 breathers). */
  microQuietMs: 120_000,
  /** And this long after the last micro-scene, so two never play back to back. */
  microGapMs: 300_000,
  /** Byte's lace: Moss ties it on every n-th Grove day from chapter 4; it is undone the rest. */
  laceTieEveryDays: 3,
  /** The share of taps on Byte, from Lantern Night, that mention the lace. */
  laceBarkChance: 0.5,
  /** On a tie day, the share of the day (from dawn) Byte spends beside Moss. */
  laceVisitShare: 1 / 3,
} as const;

/** R0293 (FUN-04): the travelling personality gags (sim/travel-gags.ts). A child plays at half rate. */
export const TRAVEL_GAGS = {
  /** Of a lazy Nubbin's wander walks, per mille, the share it rolls instead of walking. */
  rollPerMille: 300,
  /** Of a lazy Nubbin's walks that reach the stream, per mille, the share it floats. */
  floatPerMille: 600,
  /** How far the stream carries it, world units (about a tile), and how fast. */
  floatTiles: 1.2,
  floatSpeed: 0.6,
  /** Counts as in the stream within this distance of the centre line. */
  streamHalfWidth: 0.9,
  /** Of a mischievous Nubbin's ball games near the pond, per mille, the share it aims in. */
  ballPerMille: 700,
  /** How far beyond the pond's rim the ball may be for the aim to count. */
  ballPondReach: 3,
} as const;

/** R0299 (FUN-10): the running Keeper's little hop past a Nubbin (sim/keeper-dodge.ts). */
export const KEEPER_DODGE = {
  /** A turn this sharp (radians) between two steps counts as hard. */
  turn: 1.0,
  /** The two steps must be this close in time (live play; catch-up never runs it). */
  windowMs: 250,
  /** A Nubbin's centre within this of the Keeper's. */
  reach: 1.3,
  cooldownMs: 1500,
} as const;
