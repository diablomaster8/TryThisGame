/**
 * Tuning: the life domain (TECH-36). Moved out of config/tuning.ts, which still re-exports it.
 * Numbers are unchanged; the review-pass letters in the comments are their provenance.
 */

const SECOND = 1000;
const MINUTE = 60 * SECOND;
const HOUR = 60 * MINUTE;

export const LIFECYCLE = {
  childMs: 60 * MINUTE,
  cocoonMs: 30 * SECOND,
  /** Maor, 2026-11-02: a full day (was 5 h), so Nubbins rarely leave. */
  adultMs: 24 * HOUR,
  /** How far into adult life the second evolution settles. */
  secondEvolutionMs: 60 * MINUTE,
  /** Lines with a champion stage take their final form this far into adult life (3/5 of it). */
  thirdEvolutionMs: 14.4 * HOUR,
  /** A hatchling with a fixed rule to another baby grows into it after this long. */
  babyGrowthMs: 10 * MINUTE,
  /** Waiting end-of-life checks run this far apart once the Keeper is back, one cocoon at a time. */
  awaitingStaggerMs: 4 * SECOND,
  /** After the away screen closes, the first waiting check runs this much later. */
  awaitingAfterReleaseMs: 1 * SECOND,
} as const;

export const REBIRTH = {
  /** Lifetime average happiness needed to be reborn instead of departing (was 30 and 40 until 2026-11-02). */
  minLifetimeHappiness: 15,
  minAffection: 20,
  /** Fraction of stat points carried into the next life. */
  keepPointsFraction: 0.1,
} as const;

/**
 * The last day (Maor, 2026-11-02): a live end-of-life check that would end in a departure
 * opens a gentle window first. Care in it counts extra; meet the bar by the end and the
 * Nubbin is reborn. An adult this close to the end and under the bar raises a heads-up.
 */
export const GRACE = {
  windowMs: 20 * MINUTE,
  /** A pet or a fruit in the window counts this much more affection than usual. */
  affectionScale: 2,
  /** ...and adds this much sim time at its current happiness to the lifetime average. */
  sampleMsPerCare: 15 * MINUTE,
  /** The heads-up comes this long before the end. */
  noticeMs: 1 * HOUR,
  /** The faint cocoon's flicker: opacity range and period. */
  veilMin: 0.18,
  veilMax: 0.42,
  veilPeriodMs: 2400,
  /** Reduced motion: a steady veil at this opacity. */
  veilStill: 0.3,
  /** The veil is a cocoon this much bigger than a real one; Full 3D draws it in this colour. */
  veilScale: 1.25,
  veilColour: '#f4ecff',
} as const;

export const ETERNAL = {
  minRebirths: 2,
  sunThreshold: 0.8,
  moonThreshold: -0.8,
  /** |alignment| at or under this counts as Eternal Neutral. */
  neutralBand: 0.1,
} as const;

export const CURFEW = {
  nightFrom: 22,
  nightTo: 6,
  energyDrainMultiplier: 1.6,
  napChance: 0.5,
} as const;
