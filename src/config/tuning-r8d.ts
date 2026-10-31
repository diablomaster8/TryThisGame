/**
 * Lane D, round 8: the tunables for the shake meter and the stats sheet's tabs. Re-exported
 * from `tuning.ts`.
 */

/** TECH-16: the shake meter shown while an egg is held by a drag. */
export const SHAKE_METER = {
  /** After a shake lands, the meter shows full for this long. */
  flashMs: 500,
} as const;

/** TECH-07: the stats sheet's tabs and the gentler plays a child discovers over its childhood. */
export const SHEET_TABS = {
  /** Plays under "More ways to play" a newly hatched child already has. */
  playsAtHatch: 2,
  /** One more play arrives per this much of a first-life child's age (a child lasts 60 min). */
  playEveryMs: 10 * 60_000,
  /** A need at or above this (0..1) shows a happy face; at or above `okAt`, a plain one. */
  goodAt: 0.6,
  okAt: 0.3,
} as const;
