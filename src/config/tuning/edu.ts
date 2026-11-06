/**
 * Tuning: the edu domain (TECH-36). Moved out of config/tuning.ts, which still re-exports it.
 * Numbers are unchanged; the review-pass letters in the comments are their provenance.
 */

export const LESSONS = {
  price: 25,
  durationMs: 45_000,
  maxLevel: 3,
  /** Chance per idle choice that a schooled Nubbin performs. */
  performChance: 0.08,
  performMs: 4000,
  happiness: 6,
} as const;

/** The Learning Grove's language courses (sim/lang.ts, CV3). */
export const LANG = {
  /** A course's next quest waits this long after the last one ends, then for a morning. */
  nextQuestAfterMs: 120_000,
  /** A word counts as learned once used, or once heard this many times. */
  learnedAfterHeard: 3,
  /**
   * R0701: Leitner review. A word moves up a box on a right answer and back to box 1 on a
   * wrong one. `intervals[box]` is the play-days until it is due again; a play-day is a
   * calendar day the child reviewed on, so a missed day costs nothing.
   */
  srs: { maxBox: 4, learnedBox: 3, intervals: [0, 1, 2, 4, 8], perSitting: 5, options: 3 },
  /** Nubbins this close to the Keeper react to a learned word, at most this many. */
  reactRadius: 9,
  reactMax: 3,
  /** Tracing (ui/trace.ts), on a 0-100 board: how far from a stroke still counts. */
  traceRadius: 14,
  /** Share of a stroke's points the finger must pass near, and of a letter's ink covered. */
  strokeCover: 0.7,
  inkCover: 0.5,
} as const;
