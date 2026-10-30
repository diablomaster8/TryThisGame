/**
 * Lane C round 9, agent R (re-exported from tuning.ts): resting until the story's hour, the
 * Saves panel's backup list, and the spine's "Go there".
 */

/** R0616 (CAMP-24): "Rest until …" runs the live clock fast until the story's hour holds. */
export const REST = {
  /** The time scale while resting: the ordinary live path, so needs, fruit and ages run. */
  restScale: 100,
  /** How far ahead (sim ms) a rest may look for the hour it waits for: two story days. */
  horizonMs: 240_000,
  /** The scan step when looking for that hour (sim ms). */
  scanMs: 1_000,
  /** Fraction of a story day around dawn and dusk that reads as "dawn" or "dusk". */
  edge: 0.06,
} as const;

/** R0659 (CAMP-67): how the Saves panel words sizes and ages. */
export const SAVE_INFO = {
  /** Under this many bytes a size shows in bytes, else in KB (one decimal under 10 KB). */
  kbFrom: 1024,
  /** Ages under this many seconds read "just now". */
  justNowS: 5,
} as const;
