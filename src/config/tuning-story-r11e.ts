/**
 * Lane E r11 tunables for the Learning Grove's read-aloud story: how long a sprout waits
 * after a spoken child prompt, and how long a tap is ignored while a line is being read.
 */
export const KIDS_STORY = {
  /** R0697: after a "your turn" prompt, the next line waits this long (ms). */
  yourTurnWaitMs: 3000,
  /** R0698: advance taps are ignored while a line is spoken, for at most this long (ms). */
  tapLockMs: 1500,
} as const;
