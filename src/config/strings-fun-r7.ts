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
