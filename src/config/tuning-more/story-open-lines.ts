// was tuning-camp11c; campaign engine, round 11 agent C
/**
 * Lane C round 11 (R0600, R0654, R0613, R0634, R0615): numbers for the open world's lines.
 * Imported straight from here; `tuning.ts` re-exports it.
 */

/** R0654 (CAMP-62): The Hundred Days beside Hazel's Grove reads the prosperity it ADDED. */
export const HUNDRED_PROSPERITY_GAIN = { bright: 40, quiet: 15 } as const;

/** R0600 (CAMP-07): the Valley Fair opens once the spine has ended and this many lines have. */
export const VALLEY_FAIR = {
  minLines: 2,
  /** The one-time Shells gift for the fair (a keepsake, never repeated). */
  keepsake: 'valley-fair',
} as const;

/** R0613 (CAMP-21): the highest spine chapter number a gate may name (12 chapters, 13 = ended). */
export const GATE_MAX_CHAPTER = 13;

/**
 * R0630 (CAMP-38): hats a story world lets the Grove wear, by the finished Atlas page ('A3') or
 * Arcade cartridge ('PA1') that earns them. Derived at load and never written to the Grove save.
 */
export const DERIVED_HATS: Readonly<Record<string, string>> = {
  A3: 'flower',
  A1: 'crown',
  PA1: 'bucket',
};

/** R0629 (CAMP-37): a child profile (the Learning Grove) holds at most this many active quests. */
export const QUESTS_CHILD = { cap: 2, sproutPitchWords: 14, markerPx: 64 } as const;
