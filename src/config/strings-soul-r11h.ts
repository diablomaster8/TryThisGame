/** Lane A round 11, helper G5: read-aloud lines for the Learning Grove's sprout band. */
export const SPROUT_TEXT = {
  /** "Pip feels shy today": the personality said once, aloud, instead of a word on the sheet. */
  feels: (name: string, word: string): string => `${name} feels ${word.toLowerCase()} today.`,
  /** The icon-only personality chip's label for a screen reader. */
  chipLabel: (word: string): string => `Feeling: ${word}`,
} as const;

/** R0583: the personality poses at the start line, spoken for a screen reader. */
export const RACE_POSE_TEXT = {
  cheerful: 'waves to the crowd',
  shy: 'hides behind its hands',
  mischievous: 'sticks its tongue out at the others',
  lazy: 'yawns',
} as const;

/** R0583 (round 12): the pre-race count, by seconds left (rounded up). */
export const RACE_COUNT = { 3: '3', 2: '2', 1: '1', go: 'Go!' } as const;

/** R0583: the small voice a cheer draws from each start-line kind. */
export const RACE_VOICE = {
  wave: 'Yay!',
  hide: 'Eep! Okay!',
  tongue: 'Hehe!',
  yawn: 'Mm. Fine.',
} as const;
