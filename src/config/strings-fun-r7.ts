/**
 * Lane A round 7 (MOVE, FUN and SOUL): player-facing text added this round, kept beside
 * `strings-fun-r6.ts` so the shared strings file only gains a re-export line.
 */

/** R0003: the placing chip's hint while the mouse is over the ground. */
export const PLACE_TEXT = {
  fits: 'Fits here',
} as const;

/** R0343: the Grove Readers' opt-in read-aloud, in the grown-up area. */
export const READ_TEXT = {
  toMeLabel: 'Read to me (Grove Readers)',
  toMeHelp: 'Off by default. Speaks each story line too, for a reader who likes to listen along.',
} as const;

/**
 * R0350 (FUN-61): a wary Shadow Nubbin's refusals, by how far its trust has come, and the
 * first tickles it allows (a little past wary), which it does not admit to. `{n}` is the name.
 */
export const SHY_LINES = {
  main: {
    far: [
      '{n} takes one step back. Exactly one.',
      '{n} watches your hand as if it might be a bee.',
    ],
    near: [
      '{n} lets you get within a paw. Then remembers.',
      '{n} leans in, then decides against it.',
    ],
    allows: [
      '{n} allows the tickle. {n} does not admit to it.',
      '{n} puts up with that. Barely. Smugly.',
    ],
  },
  reader: {
    far: ['{n} takes one step back. Just one.', '{n} keeps an eye on your hand.'],
    near: ['{n} lets you come close. Then steps away.', '{n} nearly lets you. Not quite.'],
    allows: ['{n} lets you! But pretends not to.', '{n} allows it. Just this once.'],
  },
  sprout: {
    far: ['{n} steps back. One step.', '{n} is shy.'],
    near: ['{n} comes close. Then hops back.', 'Almost! {n} is nearly ready.'],
    allows: ['{n} lets you! Shh, it is a secret.', '{n} likes it. A tiny bit.'],
  },
} as const;

/** R0352 / R0355: rule three, noticed. `{n}` is the Nubbin's name. */
export const SIT_TEXT = {
  main: '{n} comes and sits down beside you. Rule three.',
  reader: '{n} sits down next to you. Rule three: sit and wait.',
  sprout: '{n} sits with you. Shh.',
} as const;

/** R0353 (FUN-64): Moss's dry reactions to slapstick he happens to see. */
export const MOSS_WATCH = {
  name: 'Moss',
  bonk: ['*a slow blink*', 'Hm.', '*one eyebrow, raised*', 'Mm.', '*a long look at the tree*'],
  throw: ['*a stern look*', '*a sterner look*'],
} as const;

/** R0354 (FUN-65): one line per adult type after the evolution card. `{n}` is the name. */
export const EVOLVE_QUIPS = {
  main: {
    normal:
      '{n} looks at its new self, turns round to see the back, and sits down to think about it.',
    swim: '{n} tries a swimming stroke on dry land. The grass is unimpressed.',
    fly: '{n} flaps once and surprises itself.',
    run: '{n} sets off at a sprint, forgets why, and comes back.',
    power: '{n} pats the bench to steady itself and accidentally lifts the bench.',
  },
  reader: {
    normal: '{n} turns round to see its new back, wobbles, and sits down.',
    swim: '{n} does a swimming stroke. On the grass.',
    fly: '{n} flaps once. Whoa! It surprised itself.',
    run: '{n} zooms off, then zooms back.',
    power: '{n} leans on the bench and lifts it by mistake.',
  },
  sprout: {
    normal: '{n} spins round. Wobble! Sit down.',
    swim: '{n} swims on the grass. Silly!',
    fly: 'Flap! {n} is surprised!',
    run: 'Zoom! {n} runs and runs.',
    power: '{n} lifts the bench. Oops!',
  },
} as const;

/**
 * R0357 (FUN-68): the silly-name generator: a title and a name, at most 16 letters in all
 * (the rename limit). The sprout band picks from the picture buttons instead. Every word is
 * checked by `tests/sim/silly-names.test.ts` against a list of words that must never appear.
 */
export const SILLY_NAME_PARTS = {
  titles: [
    'Sir',
    'Lady',
    'Captain',
    'Duke',
    'Little',
    'Major',
    'Aunt',
    'Uncle',
    'Baron',
    'Doctor',
    'Queen',
    'King',
  ],
  names: [
    'Wobbles',
    'Puddle',
    'Crumb',
    'Pickle',
    'Muffin',
    'Button',
    'Noodle',
    'Biscuit',
    'Dumpling',
    'Pebble',
    'Teacup',
    'Sprout',
    'Turnip',
    'Bumble',
    'Waffle',
    'Sock',
    'Parsnip',
    'Jellybean',
    'Mittens',
    'Toffee',
    'Crumpet',
    'Fidget',
    'Pudding',
    'Snorkel',
  ],
  /** The sprout band's picture buttons: an emoji and its word. */
  pictureTitles: [
    ['👑', 'King'],
    ['👸', 'Queen'],
    ['🎩', 'Sir'],
    ['⚓', 'Captain'],
  ],
  pictureNames: [
    ['🧁', 'Muffin'],
    ['🥒', 'Pickle'],
    ['🍪', 'Biscuit'],
    ['💧', 'Puddle'],
    ['🧦', 'Sock'],
    ['🍜', 'Noodle'],
  ],
} as const;

/** R0357: the rename dialog. */
export const RENAME_TEXT = {
  title: 'A new name',
  silly: '🎲 Silly name',
  ok: 'OK',
  cancel: 'Cancel',
  pickTitle: 'Pick a hat:',
  pickName: 'Pick a name:',
} as const;
