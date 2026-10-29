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

/**
 * R0311 (FUN-22): pet-sheet actions in the Nubbin's own physical voice, three a band, picked
 * in turn so the same one never shows twice running. `{n}` is the name. No parentheses.
 * Lane E's per-personality lines (R0298) take the main band's success toasts once merged;
 * these cover the refusal, the sprout band and the plain fallback.
 */
export const PET_LINES: Record<string, Record<ToastBand, readonly string[]>> = {
  tickle: {
    main: [
      '{n}’s foot thumps like a happy rabbit.',
      '{n} wriggles so hard they nearly roll away.',
      '{n} squeaks, then holds very still in case you do it again.',
    ],
    reader: ['{n} giggles and wriggles.', '{n}’s foot goes thump, thump!', '{n} squeaks with joy.'],
    sprout: ['Hee hee! {n} giggles!', 'Wiggle wiggle! {n} laughs!', '{n} squeaks! Again!'],
  },
  hug: {
    main: [
      '{n} melts into the hug.',
      '{n} hugs back with both stubby arms, which reach about halfway.',
      '{n} goes soft and heavy, like warm bread.',
    ],
    reader: ['{n} melts into the hug.', '{n} hugs you back.', '{n} snuggles in close.'],
    sprout: ['Squish! A big hug!', '{n} hugs you back!', 'Cuddle! {n} is happy!'],
  },
  groom: {
    main: [
      '{n} fluffs up to nearly twice the size.',
      '{n} leans into the brush and closes both eyes.',
      '{n} shakes out every tuft and looks newly invented.',
    ],
    reader: ['{n} fluffs up, all shiny.', '{n} leans into the brush.', '{n} looks very smart now.'],
    sprout: ['Fluff fluff! So soft!', '{n} is all shiny!', 'Brush brush! Fluffy {n}!'],
  },
  tuckIn: {
    main: [
      '{n} turns round three times and settles.',
      '{n} is asleep before you’ve finished.',
      '{n} yawns a yawn bigger than their head.',
    ],
    reader: ['{n} curls up and yawns.', '{n} falls asleep fast.', '{n} snuggles down.'],
    sprout: ['Shh! {n} is sleepy.', 'Yawn! Night night, {n}!', '{n} curls up. Shh!'],
  },
  praise: {
    main: [
      '{n} stands a little taller. The crown helps.',
      '{n} looks round to check everyone heard that.',
      '{n} glows like they’ve swallowed a lantern.',
    ],
    reader: ['{n} stands up tall and proud.', '{n} beams at you.', '{n} looks very pleased.'],
    sprout: ['Good {n}! So proud!', '{n} stands up tall!', 'Yay, {n}!'],
  },
  highFive: {
    main: [
      'The high five lands on {n}’s own forehead. Thrilled anyway.',
      '{n} slaps your palm and inspects their paw for damage.',
      '{n} high-fives the air just beside your hand. Close enough.',
    ],
    reader: [
      'Slap! {n} high-fives you.',
      '{n} misses, then tries again.',
      '{n} gives a tiny high five.',
    ],
    sprout: ['Slap! High five!', '{n} high-fives! Yay!', 'Clap! Tiny paw!'],
  },
  refused: {
    main: [
      '{n} flinches away. Not yet.',
      '{n} edges back and watches your hands.',
      '{n} isn’t ready for that. Sit with them a while.',
    ],
    reader: ['{n} steps back. Not yet.', '{n} needs time first.', '{n} is a bit shy still.'],
    sprout: ['{n} is shy. Not yet.', '{n} needs a little time.', 'Slowly! {n} is shy.'],
  },
};
