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

/** R0703 (KIDS-35): the tracing game's forgiveness. */
export const EDU_TRACE = {
  /** How far from a stroke still counts, on the 0–100 board, by who is tracing. */
  radius: { young: 20, older: 16, reader: 14 },
  /** A rejected stroke stays drawn in grey this long, then fades over `fadeMs`. */
  missShowMs: 800,
  fadeMs: 300,
  /** The ghost finger shows the stroke on open and after this many misses on one stroke. */
  demoAfterMisses: 2,
  /** After this many misses the stroke completes itself with the demo (no fail state). */
  completeAfterMisses: 4,
  /** How long the ghost finger takes along a stroke. */
  demoMs: 1200,
  /** A short buzz on an accepted stroke, where the device has one. */
  vibrateMs: 15,
} as const;

/** R0688 (KIDS-20): the Learning Grove's "Fun Run": one short friendly course, no placings. */
export const FUN_RUN = {
  /** Rivals: the child's other Nubbins first, then Fern's, up to this many. */
  rivals: 3,
  /** The course: swim, run, fly, one short stretch each. */
  sections: [
    { kind: 'swim', length: 9 },
    { kind: 'run', length: 11 },
    { kind: 'fly', length: 8 },
  ] as const,
  /** Rivals' stat levels sit within this many levels of the runner's, so the field is close. */
  rivalSpread: 6,
  /** The spoken count at the start, one step each, and the gap between steps (ms). */
  countSteps: 4,
  countGapMs: 900,
  /** The cheer button's side in px (a 📣 big enough for a small hand). */
  cheerPx: 96,
  /** Fern's rivals when the child has too few Nubbins of their own. */
  fernNames: ['Fern’s Moss', 'Fern’s Dot', 'Fern’s Bean'] as const,
} as const;

/** R0690 (KIDS-22): the sprout's "Glow Cave": the Hollow kept short, lit and gentle. */
export const GLOW_CAVE = {
  /** The cave has at most this many floors; the chest is on the last. */
  floors: 3,
  /** Floors are always at least this lit (glowing mushrooms), 0..1. */
  minLight: 0.9,
  /** The red-gem puzzle: how many to tap, and how many decoys sit among them. */
  gems: { red: 4, decoys: 5 },
  /** The door puzzle: the shapes it may ask for, and how many pictures to pick from. */
  shapes: ['circle', 'square', 'triangle', 'star'] as const,
  doorOptions: 3,
  /** A glowbug keeps this far from the Keeper (cells) and drifts up to it slowly. */
  followDistance: 1.6,
} as const;
