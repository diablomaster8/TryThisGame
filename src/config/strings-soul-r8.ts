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
