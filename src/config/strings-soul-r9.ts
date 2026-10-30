/**
 * Lane A round 9 (SOUL): player-facing text for traits (R0528), the glutton's full belly
 * (R0546) and the shy one's hide and seek (R0543). Bands follow the toasts: main, reader
 * (7–10) and sprout (3–6).
 */
import type { TraitId } from './tuning-soul-r9';

/** R0528: each trait's icon, word and one-line blurb for the sheet. */
export const TRAIT_LABELS: Record<TraitId, { icon: string; word: string; blurb: string }> = {
  clumsy: { icon: '🌀', word: 'Clumsy', blurb: 'Trips over its own feet. Gets up every time.' },
  glutton: { icon: '🍑', word: 'Glutton', blurb: 'Never too full for one more fruit.' },
  sleepyhead: { icon: '💤', word: 'Sleepyhead', blurb: 'Yawns a lot and naps long.' },
  curious: { icon: '💡', word: 'Curious', blurb: 'Has to go and look at anything new.' },
  brave: { icon: '🛡', word: 'Brave', blurb: 'Rain? It plays in it.' },
  fussy: { icon: '🙅', word: 'Fussy', blurb: 'Holds out for its favourite fruit.' },
  musical: { icon: '♪', word: 'Musical', blurb: 'Hums as it wanders.' },
  showoff: { icon: '🌟', word: 'Show-off', blurb: 'Performs more when you are watching.' },
  neat: { icon: '🧼', word: 'Neat', blurb: 'Tidies itself up after every meal.' },
  nightOwl: { icon: '🦉', word: 'Night owl', blurb: 'Up at night, dozy by day.' },
  earlyBird: { icon: '🌅', word: 'Early bird', blurb: 'Greets every dawn with a big stretch.' },
  copycat: { icon: '👯', word: 'Copycat', blurb: 'Does whatever its neighbour is doing.' },
  ticklish: { icon: '🪶', word: 'Ticklish', blurb: 'One tickle and it rolls about giggling.' },
  sneezy: { icon: '🤧', word: 'Sneezy', blurb: 'Flowers make it sneeze.' },
};

export const TRAIT_SHEET = {
  title: 'Traits',
  earned: 'learned',
  /** What earns the second trait, while a child has none yet. */
  hint: 'A child can pick up one more trait from how you play with it.',
} as const;

/** R0528: a child picked up a trait. `{n}` is the name, `{t}` the trait word. */
export const TRAIT_TOASTS = {
  main: '{n} has picked up a new habit: {t}.',
  reader: '{n} is now {t}! That came from how you play together.',
  sprout: '✨ {n}: {t}!',
} as const;

/** R0546: the burp line. */
export const BELLY_TEXT = {
  main: '{n} lets out a small, satisfied burp.',
  reader: '{n} burped! Too much fruit.',
  sprout: '🍑💨 Burp!',
  full: 'Full belly',
} as const;

/** R0543: finding a shy one behind its tree. */
export const PEEK_TEXT = {
  main: 'Found you! {n} giggles behind the tree.',
  reader: 'Found you, {n}! Hide and seek is how shy friends learn to trust.',
  sprout: '🌳👀 Found you!',
} as const;
