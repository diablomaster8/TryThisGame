/** Lane D r11 helper 4: tunables for the guided first loop. */
const SECOND = 1000;

export const FIRST_LOOP = {
  /** The first egg only: each shake takes this much off, so five shakes hatch it (TECH-06). */
  firstShakeBonusMs: 36 * SECOND,
  /** A child this young (from its first hatch) is still in the guided loop. */
  windowMs: 5 * 60 * SECOND,
  /** A step idle this long gets a pulsing nudge on the chip (never a block). */
  idleNudgeMs: 20 * SECOND,
} as const;

/** R0467 (TECH-25): the first minute stays quiet; at most two toasts show at once. */
export const FIRST_MINUTE = {
  /** Visitor and season toasts wait until this long after the first hatch of a new save. */
  quietMs: 20 * SECOND,
  /** A save older than this (sim time) is never "new", whatever its diary says. */
  newSaveMs: 30 * 60 * SECOND,
  maxVisibleToasts: 2,
} as const;
