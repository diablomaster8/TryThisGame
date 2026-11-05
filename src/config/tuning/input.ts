/**
 * Tuning: the input domain (TECH-36). Moved out of config/tuning.ts, which still re-exports it.
 * Numbers are unchanged; the review-pass letters in the comments are their provenance.
 */

export const INPUT = {
  /** Horizontal two-finger travel (CSS px) that counts as a rotate swipe. */
  swipeThresholdPx: 40,
  /** Pinch distance ratios that count as zoom out / zoom in. */
  pinchOutRatio: 0.8,
  pinchInRatio: 1.25,
  /** Wheel delta (px) that counts as one zoom step. */
  wheelThreshold: 20,
  /** Pointer travel (CSS px) before a press becomes a drag instead of a tap. */
  dragThresholdPx: 10,
  /** Press duration (ms) under which a release counts as a tap. */
  tapMaxMs: 350,
  /** Pointer direction reversals per second that count as shaking a held egg. */
  shakeReversalsPerSecond: 4,
  /** Logo taps within this window open the debug panel. */
  tripleTapMs: 600,
  /**
   * A press this close (CSS px) to a Nubbin still lands on it: a wandering child is a small,
   * moving target, and a near miss would walk the Keeper instead of lifting it.
   */
  nubbinPickSlopPx: 16,
} as const;
