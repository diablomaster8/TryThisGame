/** Tunable numbers for the Learning Grove's kid-facing screens (lane E, round 7: KIDS). */

/** R0676 (KIDS-05): the "Show me" pointing guide. */
export const EDU_GUIDE = {
  /** With no progress toward the goal for this long, a sprout gets the hand by itself. */
  idleMs: 20_000,
  /** How long the hand stays after it is shown, unless the target changes first. */
  showMs: 12_000,
  /** Lift above a target's feet, world units, so the hand points at its middle. */
  lift: { egg: 0.35, nubbin: 0.5, tree: 1.6, fruit: 0.2 },
} as const;
