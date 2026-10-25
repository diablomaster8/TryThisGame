/**
 * Tunables for the HUD fixes of 2026-10-25 (the UI agent's own numbers, kept apart from the
 * shared tuning.ts so the merge stays small).
 */
export const TOASTS = {
  /** At most this many toasts on screen at once; the rest wait their turn. */
  maxVisible: 3,
  /** A burst comes in one at a time, this far apart. */
  staggerMs: 450,
  /** The same text again within this long (wall clock) is dropped, so ×100 does not spam. */
  repeatMs: 20_000,
  /** Waiting toasts beyond this are dropped, oldest first. */
  maxQueued: 6,
} as const;

/** The touch controls hint: shown for a while after the Grove opens, then it fades. */
export const TOUCH_HINT = {
  showMs: 12_000,
} as const;
