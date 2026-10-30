/**
 * Lane A round 8 (SOUL): player-facing text for likes and dislikes, the moody looks, the
 * time of day and the rain. Bands follow the toasts: main, reader (7–10) and sprout (3–6).
 */
import type { Taste } from '../sim/likes';
import type { ToyKind } from '../sim/types';

/** R0536: the fruit by flavour, as the sheet and the toasts name it. */
export const TASTE_NAMES: Record<Taste, string> = {
  swim: 'Swim fruit',
  fly: 'Fly fruit',
  run: 'Run fruit',
  power: 'Power fruit',
  stamina: 'Stamina fruit',
  sun: 'Sun fruit',
  moon: 'Moon fruit',
  plain: 'plain fruit',
};

export const TOY_NAMES_SOUL: Record<ToyKind, string> = {
  ball: 'the ball',
  radio: 'the radio',
  blocks: 'the blocks',
  mirror: 'the mirror',
  tv: 'the little TV',
};

/** R0536: the first time the Keeper sees each reaction. `{n}` is the name, `{f}` the fruit. */
export const TASTE_TOASTS = {
  yum: {
    main: '{n} puffs out both cheeks. {f} is clearly the best fruit.',
    reader: '{n} loves {f}! Look at that happy hop.',
    sprout: '🍎❤️ {n} loves it!',
  },
  bleh: {
    main: '{n} eats the {f}, with a face that says it would rather not.',
    reader: '{n} does not like {f}. It ate it anyway. Brave.',
    sprout: '🍎😖 Not that one!',
  },
} as const;

/** R0532: the moody looks. */
export const MOODY_TEXT = {
  refused: {
    main: '{n} folds its arms. Not today.',
    reader: '{n} is grumpy and says no to a high five.',
    sprout: '😤 Not now.',
  },
  cleared: {
    grumpy: {
      main: '{n} cheered up for good. The scowl has gone wherever scowls go.',
      reader: '{n} cheered up for good!',
      sprout: '😊 {n} is happy now!',
    },
    sleepy: {
      main: '{n} is wide awake these days. Good care does that.',
      reader: '{n} is not sleepy any more!',
      sprout: '😊 {n} is awake!',
    },
  },
} as const;

/** R0532, R0536: the stats sheet's likes row and moody chip. */
export const SOUL_SHEET = {
  likes: 'Likes',
  dislikes: 'Dislikes',
  toy: 'Favourite toy',
  unknown: '?',
  unknownHelp: 'Feed it different fruit and watch its face.',
  moody: { grumpy: 'Grumpy', sleepy: 'Sleepy' },
  moodyHelp: {
    grumpy: 'Turns down high fives now and then. Half an hour of happy days will soften it.',
    sleepy: 'Yawns and nods off. Half an hour of happy days will wake it up.',
  },
} as const;

/** R0549: the Settings toggle for bigger mood bubbles. */
export const BIG_BUBBLES_TEXT = {
  label: 'Big mood bubbles',
  help: 'Draw the ball over each Nubbin larger, easier to read on a small screen.',
} as const;

/** R0593: the Settings select for how lively the Grove is. */
export const LIVELINESS_TEXT = {
  label: 'Liveliness',
  levels: { calm: 'Calm', normal: 'Normal', lively: 'Lively' },
  help: 'How often Nubbins trip, sneeze, prank and potter about. Never changes their needs.',
} as const;

/**
 * R0563: the sheet's "Recently" lines, by diary kind. `{o}` is the other Nubbin's name.
 * `kids` is the Learning Grove's plainer line.
 */
export const DIARY_LINES: Record<import('../sim/diary').DiaryKind, { main: string; kids: string }> =
  {
    yum: { main: 'Found its favourite fruit. Made a noise about it.', kids: 'Ate its best fruit!' },
    bleh: { main: 'Ate a fruit it does not like. Bravely.', kids: 'Ate a fruit it does not like.' },
    trip: {
      main: 'Tripped over nothing. Got up as if it meant to.',
      kids: 'Fell over and got up.',
    },
    sneeze: {
      main: 'Sneezed at the flowers. The flowers did not apologise.',
      kids: 'Sneezed at a flower.',
    },
    hiccup: { main: 'Ate too fast. Hiccupped about it.', kids: 'Had the hiccups.' },
    comforted: { main: 'Patted {o} on the head when {o} was sad.', kids: 'Was kind to {o}.' },
    wasComforted: { main: 'Got a pat from {o} on a bad day.', kids: '{o} was kind to it.' },
    pranked: { main: 'Said "boo" to {o}. Showed no remorse.', kids: 'Played a joke on {o}.' },
    wasPranked: { main: 'Was booed by {o}. Is thinking about it.', kids: '{o} made it jump.' },
    friend: { main: 'Made friends with {o}.', kids: 'Made a friend: {o}.' },
    bonked: { main: 'Walked into a tree. The tree was fine.', kids: 'Bumped into a tree.' },
    cheeredUp: { main: 'Cheered up for good.', kids: 'Feels much better now.' },
  };

export const RECENTLY_TEXT = {
  title: 'Recently',
  none: 'Nothing much yet. Give it time.',
} as const;

/** R0579: the roster's filter row. */
export const ROSTER_FILTER_TEXT = { label: 'Show by personality', all: 'All' } as const;

/** R0539: a buddy back home. `{a}` ran over to `{b}`. */
export const REUNION_TEXT = {
  main: '{b} is back. {a} gets there first, for a long hug.',
  reader: '{b} is back! {a} gives {b} a big hug.',
  sprout: '🤗 {b} is back!',
} as const;
