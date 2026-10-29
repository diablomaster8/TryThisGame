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

/**
 * R0312 (FUN-23): the hatch card that replaces the stacked toasts. The eggshell stays on the
 * newborn's head as a hat (lane E); the card says so, and offers the first pet.
 */
export const HATCH_CARD_TEXT = {
  hatched: (names: string[]) =>
    names.length === 1
      ? `${names[0]} hatched!`
      : `${names.slice(0, -1).join(', ')} and ${names[names.length - 1]} hatched!`,
  shell: (names: string[]) =>
    names.length === 1
      ? 'There is a bit of shell on their head.'
      : 'They are both wearing a bit of shell.',
  sprout: 'Pop! A baby! It has a shell hat!',
  firstInBook: 'First Nubbin in your book.',
  pet: 'Pet',
  close: 'Close',
} as const;

/** R0313 (FUN-24): what Fern's stone "says" when tapped, in turn. Sprout: short and silly. */
export const FERN_STONE_TEXT = {
  name: 'Fern’s stone',
  main: [
    'A good stone. Fern tried four.',
    'The stone looks back at you. It has two dots for eyes and no opinions.',
    'Fern says this one is the best stone in the valley. She has checked.',
    'The cairn has grown. Fern says the top one is the best. She always says that.',
    'A stone with a face. It has been watching the gate all day.',
    'You straighten the top stone. Fern will straighten it back.',
  ],
  sprout: ['Hello, stone!', 'A stone with a face! Hee hee!', 'Fern’s stones! Count them!'],
  count: (n: number) => (n === 1 ? 'One stone.' : `${n} stones.`),
} as const;

/** R0314 (FUN-25): the race card's footer, with Byte's word at the milestones. */
export const BYTE_WATCH_TEXT = {
  footer: (n: number) => `Byte’s stopwatches: ${n}`,
  retired: 'Byte has retired two stopwatches. They were tired.',
  milestones: {
    5: 'Byte: “Five. One of them is for emergencies.”',
    6: 'Byte: “Six. I time the fifth one with the sixth.”',
    7: 'Byte: “I’ve started naming them.”',
    9: 'Byte: “Nine. Gerald runs fast. I’ve had words with him.”',
    11: 'Byte: “Eleven. I need a bigger coat.”',
  } as Record<number, string>,
  sprout: (n: number) => `Count Byte’s stopwatches! ${'⏱'.repeat(n)}`,
} as const;

/**
 * R0316 (FUN-27): the away screen's diary. Each template reads only counts and the weather;
 * none mentions a departure. `{n}` is a Nubbin's name, `{k}` a count. Sprout lines are six
 * words or fewer. `quiet` replaces the old "Everyone was quiet."
 */
export const AWAY_DIARY: Record<
  'ate' | 'napped' | 'pond' | 'fern' | 'rain' | 'quiet',
  Record<ToastBand, readonly string[]>
> = {
  ate: {
    main: [
      '{n} ate {k} fruit. {n} would like you to know it was {j}.',
      '{n} ate {k} fruit and is now mostly fruit.',
    ],
    reader: ['{n} ate {k} fruit. Yum!', '{n} had {k} fruit and a big burp.'],
    sprout: ['{n} ate lots of fruit! Munch!', 'Munch, munch! {n} ate fruit!'],
  },
  napped: {
    main: [
      '{n} napped {k} times, each one as if for the first time.',
      '{n} had {k} naps and would like a word about the light.',
    ],
    reader: ['{n} had {k} naps. Snore!', '{n} napped {k} times in the shade.'],
    sprout: ['{n} had a nap. Zzz!', 'Shh! {n} napped.'],
  },
  pond: {
    main: [
      '{n} spent an hour watching the pond. The pond did not do anything.',
      '{n} watched a beetle for a long time. The beetle won.',
    ],
    reader: ['{n} watched the pond for an hour.', '{n} watched a beetle. It was a good beetle.'],
    sprout: ['{n} watched the pond. Plop!', '{n} saw a beetle!'],
  },
  fern: {
    main: [
      'Fern says the pear tree is fine. The pear tree has not commented.',
      'Fern came by and straightened her stone. It had not moved.',
    ],
    reader: ['Fern came by to check the pear tree.', 'Fern said hello to her stone.'],
    sprout: ['Fern waved at the trees!', 'Fern said hello, stone!'],
  },
  rain: {
    main: ['It rained. {n} has opinions about it.', 'It rained. The pond is pleased with itself.'],
    reader: ['It rained. Everyone hid under the trees.', 'Drip, drip! It rained all over.'],
    sprout: ['Drip, drip! It rained.', 'Splash! A rainy day.'],
  },
  quiet: {
    main: ['Nothing much happened. {n} supervised.', 'A quiet spell. {n} kept an eye on things.'],
    reader: ['A quiet time. {n} kept watch.', 'Nothing much happened. That was nice.'],
    sprout: ['A quiet, cosy time.', '{n} kept watch. Shh!'],
  },
};

/** R0316 (TECH-76): the away screen stays short: three headlines, then a count. */
export const AWAY_SHORT = {
  headlines: 3,
  more: (n: number) => `+${n} more`,
} as const;
