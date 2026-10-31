/**
 * Lane D, round 9 (helper d3): the tunables for the egg's shake how-to. Imported directly
 * where used.
 */

/** TECH-62: the looping ghost hand over a selected, unshaken egg. */
export const SHAKE_HINT = {
  /** Height above the egg's foot the hand points at, in world units. */
  lift: 0.35,
  /** Screen pixels the hand sits above that point. */
  raisePx: 8,
} as const;
