/** Round 11, lane E (kids): tunables for the Learning Grove's Grove-noticing moments. */
export const EDU_NOTICING = {
  /** R0723: at most one spoken noticing moment per this long (ms). */
  gapMs: 180_000,
  /** R0723: counting stops here ("One, two, three, four, five apples!"). */
  maxCount: 5,
} as const;
