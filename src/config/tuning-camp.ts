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

/**
 * Lane C round 8, quest offers (sim/quest-offers.ts): in the Open quest flow, stories and capers
 * wait to be offered where they happen, and the Keeper accepts them or says Not now (R0602).
 */
export const QUEST_OFFERS = {
  /** Side stories and capers active at once; the spine never counts, nor the lines (R0602). */
  activeCap: 5,
  /** Quests pinned to the objective chip, the spine's goal not counted (R0609). */
  trackCap: 3,
  /** The Keeper is "at" a point of interest within this many units of it. */
  areaR: 7,
  /** An offer left unanswered may come again on entry after this much sim time. */
  reofferMs: 600_000,
  /** The offer card collapses to a "!" chip after this long untouched (R0606). */
  offerCardMs: 20_000,
  /** Quests of an unbuilt region are offered here, the Grove's hub (R0101's fallback). */
  hubArea: 'grove/gate',
  /**
   * R0603: what Not now means for a story that changes the campaign. `never`: part of its
   * chapter, auto-accepted, no Not now. `lapse`: may be let go, and follows its own lapse path.
   * Every other quest is `free`. The campaign-changing eight must all be listed (test).
   */
  decline: {
    s5: 'never',
    s9: 'never',
    s10: 'never',
    s27: 'never',
    s28: 'never',
    s2: 'lapse',
    s13: 'lapse',
    s19: 'lapse',
    s23: 'lapse',
    s26: 'lapse',
  } as Readonly<Record<string, 'never' | 'lapse'>>,
  /** Steps per size chip on the offer card (R0606): up to `s` is S, up to `m` is M, else L. */
  size: { s: 3, m: 7 },
} as const;
