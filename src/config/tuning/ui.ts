/**
 * Tuning: the ui domain (TECH-36). Moved out of config/tuning.ts, which still re-exports it.
 * Numbers are unchanged; the review-pass letters in the comments are their provenance.
 */

export const UI = {
  fpsUpdateMs: 1000,
  /** Mood bubble lifetime above a Nubbin, in ms. */
  bubbleMs: 1500,
  /** Hunger at or above this reads as full: the sheet's Feed holds the fruit back. */
  feedFullAt: 0.95,
  /** How long a toast stays, and a longer one for a how-to the player has to act on. */
  toastMs: 2600,
  toastLongMs: 5000,
  /** The Expedition's how-to-jump tip shows this long, or until the first jump. */
  tipMs: 5000,
} as const;

/**
 * The grown-up gate (Mature content, the Learning Grove's grown-up area, erasing a Learning
 * Grove slot): a two-digit by one-digit product, beyond most 7–10 readers, then a held Enter.
 */
export const GROWN_UP_GATE = {
  /** The two-digit factor, never a multiple of ten. */
  bigRange: [13, 49] as const,
  smallRange: [6, 9] as const,
  /** Enter must be held this long, so a mashed key or a quick tap does not get through. */
  holdMs: 1200,
} as const;
