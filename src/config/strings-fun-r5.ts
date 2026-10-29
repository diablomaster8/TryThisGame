/**
 * Lane A round 5 (FUN) player-facing text: the toasts' voice, badges, the away diary, tips.
 * Re-exported through `strings-fun.ts` and `strings.ts`. Bands: `main` is the main game;
 * `sprout` (3–6, read aloud, short) and `reader` (7–10) are the Learning Grove's.
 */

export type ToastBand = 'main' | 'sprout' | 'reader';
type Banded = Record<ToastBand, (name: string) => string>;

/**
 * R0307 (FUN-18): a slip toast says what helps, never "(A slip.)" (that tag lives on the
 * stats sheet). The same nudge shows a minute early in a new save, and when the slip is logged.
 */
export const SLIP_NUDGE: Record<'hungry' | 'sleepy' | 'lonely' | 'wet', Banded> = {
  hungry: {
    main: (n) => `${n} keeps glancing at the fruit trees. A fruit would do it.`,
    sprout: (n) => `${n} is hungry. Can you find a fruit?`,
    reader: (n) => `${n} is hungry. A fruit from a tree helps.`,
  },
  sleepy: {
    main: (n) => `${n} is yawning wide enough to tip over. Let them nap somewhere quiet.`,
    sprout: (n) => `${n} is sleepy. Time for a nap!`,
    reader: (n) => `${n} is very tired. A quiet nap helps.`,
  },
  lonely: {
    main: (n) => `${n} is sitting by themself, looking at you. A pet would do it.`,
    sprout: (n) => `${n} feels lonely. Can you give a hug?`,
    reader: (n) => `${n} is lonely. Pets and hugs help.`,
  },
  wet: {
    main: (n) => `${n} is standing in the rain, slowly taking offence. A tree would help.`,
    sprout: (n) => `${n} is wet! Find a tree to hide under.`,
    reader: (n) => `${n} is getting wet. Shelter under a tree helps.`,
  },
};

/**
 * R0308 (FUN-19): what a 3–6-year-old sees in place of a toast: icon first, eight words at
 * most, never a multiplier. `null` means the toast is not shown in the sprout band.
 */
export const EDU_TOASTS = {
  visitor: (name: string, gift: string) => `🔔 Ding dong! ${name} brought ${gift}!`,
  visitorHello: (name: string) => `🔔 Ding dong! ${name} says hello!`,
  gifts: { shells: 'Shells', fruit: 'fruit', egg: 'an egg' } as Record<string, string>,
  festival: {
    spring: '🥚 Egg time!',
    summer: null,
    autumn: '🍎🍎 Apple time!',
    winter: '🏮 Lanterns and fireflies!',
  } as Record<string, string | null>,
  /** Most words a sprout toast may have; a longer one keeps its first sentence or is dropped. */
  maxWords: 8,
} as const;
