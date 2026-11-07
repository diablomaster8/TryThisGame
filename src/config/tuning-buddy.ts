/** R0741: tunables for the Nubbin that learns beside the child (`ui/edu-buddy.ts`). */
export const BUDDY_TUNING = {
  /** The pointing hand travels from the Nubbin to the right option this long. */
  pointMs: 1000,
  /** After arriving it stays this long, then fades (under reduced motion it never moves or fades). */
  pointHoldMs: 1600,
  /** The pointing hand and each finger mark are at least this many px (a sprout's thumb). */
  markPx: 44,
  /** Fingers shown: one hand, then a second hand for 6 to 10. */
  perHand: 5,
  maxFingers: 10,
  /** The right-answer hop. */
  hopMs: 450,
  hopPx: 14,
} as const;
