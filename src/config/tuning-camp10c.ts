/** Lane C round 10, agent C (re-exported through tuning-camp10.ts). */

/**
 * R0614 (CAMP-22): the Story pace setting. Brisk (and Story only) shortens the story's waits:
 * the breather after a scene, the gap between side stories, a chapter's goal minimum and the
 * closing's settle, each multiplied by `brisk`.
 */
export const PACE = {
  brisk: 0.25,
} as const;

/** R0615 (CAMP-23): what a skipped goal grants, at most. */
export const SKIP = {
  /** Shells for a skipped Expedition goal. */
  expeditionShells: 30,
  /** The most Shells every skip in a run can add up to (the test's budget). */
  maxShells: 60,
} as const;

/** R0620 (CAMP-28): "The story so far" shows on returning after this many days away. */
export const RECAP = {
  afterDays: 3,
  /** The most recent choices the spine block names. */
  choices: 2,
} as const;
