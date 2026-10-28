/**
 * Numbers for the race's hurdles section (R0047): a run of little picket fences where each
 * one is a seeded timing roll. A stumble costs a moment and a dizzy emote, never a fall.
 */
export const HURDLES = {
  /** Track units between hurdles; a section holds one hurdle per this much length. */
  spacing: 2,
  /** The section's skill is run x this plus fly x `flyShare` (levels 0..99). */
  runShare: 0.6,
  flyShare: 0.4,
  /** Chance of a clean jump at skill 0, what each skill point adds, and the ceiling. */
  baseClean: 0.515,
  perSkill: 0.0115,
  maxClean: 0.97,
  /** A stumble stalls the racer this long (ms) and shows the dizzy emote this long (ms). */
  stumbleMs: 400,
  dizzyMs: 900,
  /** Pressing Cheer this long (ms) or less before a hurdle makes the jump clean. */
  cheerWindowMs: 300,
} as const;
