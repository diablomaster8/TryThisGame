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

/** TECH-28: where the spoken selection summary changes words. */
export const A11Y_SUMMARY = {
  /** Happiness at or above: happy; at or above 0: content; above `glumAbove`: a little sad. */
  happyFrom: 40,
  glumAbove: -40,
  /** Energy below this reads as sleepy. */
  sleepyBelow: 0.2,
} as const;

/** TECH-29: the erase hold and how long an erased slot is kept. */
export const SLOT_TRASH = {
  holdMs: 1500,
  keepMs: 7 * 24 * 60 * 60 * 1000,
} as const;

/** TECH-30: per-pointer press thresholds and the long press. */
export const POINTER_INPUT = {
  /** Movement (px) that turns a press into a drag, by pointer type; others use INPUT's. */
  dragPx: { mouse: 6, touch: 14, pen: 8 } as Readonly<Record<string, number>>,
  /** A touch or pen press held this long without moving lifts the Nubbin under it. */
  longPressMs: 450,
} as const;
