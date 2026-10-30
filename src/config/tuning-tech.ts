/**
 * Tunable numbers for the TECH items (lane D, round 7): the first-feed cue, the gentle place,
 * the backup offer. Re-exported from `tuning.ts`.
 */

const SECOND = 1000;
const DAY = 24 * 60 * 60 * SECOND;

/** TECH-01: a new hatchling asks for its first fruit. */
export const FIRST_FEED = {
  /** The 🍎 bubble and the chip line show for this long after a first hatch, until it eats. */
  cueMs: 3 * 60 * SECOND,
} as const;

/** TECH-03: the one-time "Save a backup file" offer. */
export const BACKUP_OFFER = {
  /** Time since first play (wall clock) with no export before the offer shows, once per save. */
  afterPlayMs: 7 * DAY,
} as const;

/** TECH-02: the ring under a held Nubbin and the gentle lowering after a place. */
export const HELD_RING = {
  /** A put-down Nubbin eases from its held height to the ground over this long. */
  lowerMs: 200,
  /** Ring radius (world units) and how far above the ground it lies. */
  radius: 0.45,
  lift: 0.03,
} as const;
