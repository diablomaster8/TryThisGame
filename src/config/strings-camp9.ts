/**
 * Lane C round 9, agent Q (re-exported from strings.ts): the words for line rewards, offer
 * windows and the bring-home choice at a line's end.
 */
export const LINE_REWARD_TEXT = {
  /** The keepsake each finished line leaves, by keepsake id. */
  keepsake: {
    'line-hundred': 'A pressed clover from the Fold',
    'line-logged': 'A warm little server key',
    'line-beetle': 'A beetle’s road map, folded small',
    'line-dawn': 'A ribbon the colour of first light',
    'line-dusk': 'A ribbon the colour of last light',
  } as Readonly<Record<string, string>>,
  /** The Grove change each finished line leaves, by id. */
  grove: {
    'grove-fold-habitat': 'The Fold is open to visit, and its Nubbin waits there.',
    'grove-server-glow': 'The old server on Pixel’s bench glows softly now.',
    'grove-beetle-shrine': 'A small beetle shrine sits by the Hollow stairs.',
    'grove-sundial': 'A sundial stands in the Grove, its face reading your ending.',
  } as Readonly<Record<string, string>>,
  toast: (title: string, shells: number) => `${title} leaves you ${shells} Shells and a keepsake.`,
} as const;

/** R0652: how long an offer lasts, on the offer card. */
export const OFFER_WINDOW_TEXT = {
  dawn: 'Until dawn',
  dusk: 'Until dusk',
  minutes: (n: number) => `For about ${n} minutes`,
  expired: 'That chance has passed.',
} as const;

/** R0594: the bring-home choice at a line's end. */
export const BRING_HOME_TEXT = {
  ask: (name: string) => `${name} looks at the Grove, then back the way you came.`,
  home: 'Bring home',
  stay: 'Let them stay',
  full: 'The Grove is full. Make room to bring them home.',
} as const;
