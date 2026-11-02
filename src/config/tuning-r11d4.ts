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
