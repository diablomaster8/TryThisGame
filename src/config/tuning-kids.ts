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

/** R0674 (KIDS-02): the minigames' voice. */
export const EDU_VOICE = {
  /** Hold an option this long to hear it said. */
  holdMs: 400,
  /** Each counted icon lights for this long, one after another. */
  countMs: 550,
  /** R0681: a sprout's game tile bounces this long, saying its name, before it starts. */
  launchMs: 600,
  /** R0686: the results card's stars pop in this far apart, one chime each. */
  starMs: 280,
  /** R0731: hold the sprout band's 🏡 this long to leave a game. */
  leaveHoldMs: 600,
  /** R0725: each break stretch lasts this long. */
  stretchMs: 5000,
} as const;

/** R0695 (KIDS-27): the grown-up's limits. */
export const EDU_LIMITS = {
  /** Allowed minutes a day a grown-up can pick. */
  dailyRange: [10, 180] as const,
  /** A grown-up's unlock lasts this long. */
  unlockMinutes: 30,
} as const;
