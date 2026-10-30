/**
 * Lane C round 7, the campaign engine (CAMP, re-exported from tuning.ts): how questlines
 * run beside Hazel's Grove in one world (sim/story-book.ts).
 */
export const STORY_BOOK = {
  /** Questlines running at once beside Hazel's Grove, which never counts (R0602). */
  lineCap: 2,
  /** Nubbins a line may bring into the Grove past the roster cap (R0594). */
  lineCastMax: 4,
  /** Hazel's chapter before which no line may begin: the spine alone first (R0640). */
  lineFromChapter: 3,
  /** Hazel's quiet chapters: no line begins and running lines hold still (R0612). */
  quietChapters: [9, 10, 11] as readonly number[],
} as const;

/** Lane C round 7 (R0624): the gentle backup prompts that guard against Safari's storage eviction. */
export const BACKUP_NUDGE = {
  /** Hazel's chapter after which an iPhone in the browser hears about the Home Screen, once. */
  homeCardChapter: 2,
  /** At most one "Back up your Grove?" chip per this much wall time. */
  everyMs: 14 * 86_400_000,
  /** Dismissing the chip pauses it this long. */
  pauseMs: 30 * 86_400_000,
  /** How long the chip stays up if it is left alone. */
  showMs: 20_000,
} as const;
