/**
 * Lane D, round 8: the tunables for the shake meter and the stats sheet's tabs. Re-exported
 * from `tuning.ts`.
 */

/** TECH-16: the shake meter shown while an egg is held by a drag. */
export const SHAKE_METER = {
  /** After a shake lands, the meter shows full for this long. */
  flashMs: 500,
} as const;
