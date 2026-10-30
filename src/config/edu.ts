/**
 * Educational mode: the age bands, the six games, which games are recommended for
 * each age (the grown-up can add or remove any of them), and the skills ladder each
 * game climbs. Content follows the review in PROGRESS.md: Head Start domains,
 * kindergarten readiness benchmarks, guided play, no fail state, no timers under 5.
 */
export type EduAge = 3 | 4 | 5 | 6;
export const EDU_AGES: readonly EduAge[] = [3, 4, 5, 6];

export type EduGameId = 'colours' | 'letters' | 'counting' | 'shapes' | 'sounds' | 'animals';
export const EDU_GAMES: readonly EduGameId[] = [
  'colours',
  'letters',
  'counting',
  'shapes',
  'sounds',
  'animals',
];

/** Learning domain per game, for the grown-up progress view. */
export const EDU_DOMAIN: Record<EduGameId, 'cognition' | 'literacy' | 'language' | 'nature'> = {
  colours: 'cognition',
  letters: 'literacy',
  counting: 'cognition',
  shapes: 'cognition',
  sounds: 'language',
  animals: 'nature',
};

/** Recommended set per age. Everything is available; this is the default selection. */
export const EDU_RECOMMENDED: Record<EduAge, readonly EduGameId[]> = {
  3: ['colours', 'animals', 'shapes', 'counting'],
  4: ['colours', 'shapes', 'counting', 'letters', 'animals'],
  5: ['letters', 'counting', 'sounds', 'shapes', 'colours', 'animals'],
  6: ['letters', 'sounds', 'counting', 'shapes', 'animals'],
};

export const EDU = {
  /** Rounds per play session of one game. */
  roundsPerGame: 5,
  /** Tries before the answer is shown; the round still counts as learned. */
  triesBeforeShow: 3,
  /** Shells per star, so the Grove economy works for a child too. */
  shellsPerStar: 5,
  /** R0691: a sprout save's Nubbins are always reborn at end of life. */
  alwaysRebornSprout: true,
  /** R0724: the warning comes this many minutes before the break. */
  breakWarnMinutes: 2,
  /** R0724: a round or scene still open may run this long past the break time. */
  breakGraceMinutes: 3,
  /** A sticker every this many stars. */
  starsPerSticker: 9,
  /** Default and allowed session length in minutes before the break screen. */
  sessionMinutes: 25,
  /** How long the break screen locks play, in minutes. */
  breakMinutes: 10,
  sessionRange: [10, 60] as const,
  /** Timers are never shown under this age; above it only a gentle progress dot. */
  noTimerUnderAge: 5,
} as const;

/** Colours by age: five at 3, eight by 5 (readiness benchmark). */
export const EDU_COLOURS: Record<EduAge, readonly string[]> = {
  3: ['red', 'blue', 'yellow', 'green', 'orange'],
  4: ['red', 'blue', 'yellow', 'green', 'orange', 'purple'],
  5: ['red', 'blue', 'yellow', 'green', 'orange', 'purple', 'pink', 'brown'],
  6: ['red', 'blue', 'yellow', 'green', 'orange', 'purple', 'pink', 'brown', 'black', 'white'],
};

export const EDU_COLOUR_HEX: Record<string, string> = {
  red: '#e23b3b',
  blue: '#2f6fe0',
  yellow: '#f2d34c',
  green: '#3fae4a',
  orange: '#f28c28',
  purple: '#8b4fd1',
  pink: '#f08ab9',
  brown: '#8a5a2b',
  black: '#1b1326',
  white: '#f7f3ff',
};

export const EDU_SHAPES: Record<EduAge, readonly string[]> = {
  3: ['circle', 'square', 'triangle'],
  4: ['circle', 'square', 'triangle', 'rectangle'],
  5: ['circle', 'square', 'triangle', 'rectangle', 'star', 'heart'],
  6: ['circle', 'square', 'triangle', 'rectangle', 'star', 'heart', 'oval', 'diamond'],
};

export const EDU_SHAPE_SIDES: Record<string, number> = {
  circle: 0,
  oval: 0,
  square: 4,
  rectangle: 4,
  triangle: 3,
  diamond: 4,
  star: 10,
  heart: 0,
};

/** Counting range by age: up to 3 at age 3, 5 at 4, 10 at 5 and 6. */
export const EDU_COUNT_MAX: Record<EduAge, number> = { 3: 3, 4: 5, 5: 10, 6: 10 };

/** Letters introduced by age; the child's own name is handled by the grown-up area. */
export const EDU_LETTERS: Record<EduAge, readonly string[]> = {
  3: ['A', 'B', 'C', 'D', 'E', 'M', 'O', 'S'],
  4: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'L', 'M', 'N', 'O', 'P', 'S', 'T'],
  5: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split(''),
  6: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split(''),
};

/** Picture words: emoji plus the word, grouped by first letter, for letters and sounds. */
export const EDU_WORDS: ReadonlyArray<{ word: string; icon: string; rhyme: string }> = [
  { word: 'apple', icon: '🍎', rhyme: 'ap' },
  { word: 'ball', icon: '⚽', rhyme: 'all' },
  { word: 'bee', icon: '🐝', rhyme: 'ee' },
  { word: 'cat', icon: '🐱', rhyme: 'at' },
  { word: 'cake', icon: '🎂', rhyme: 'ake' },
  { word: 'dog', icon: '🐶', rhyme: 'og' },
  { word: 'duck', icon: '🦆', rhyme: 'uck' },
  { word: 'egg', icon: '🥚', rhyme: 'eg' },
  { word: 'fish', icon: '🐟', rhyme: 'ish' },
  { word: 'frog', icon: '🐸', rhyme: 'og' },
  { word: 'goat', icon: '🐐', rhyme: 'oat' },
  { word: 'hat', icon: '🎩', rhyme: 'at' },
  { word: 'ice', icon: '🧊', rhyme: 'ice' },
  { word: 'jam', icon: '🫙', rhyme: 'am' },
  { word: 'kite', icon: '🪁', rhyme: 'ite' },
  { word: 'leaf', icon: '🍃', rhyme: 'eaf' },
  { word: 'moon', icon: '🌙', rhyme: 'oon' },
  { word: 'mouse', icon: '🐭', rhyme: 'ouse' },
  { word: 'nest', icon: '🪺', rhyme: 'est' },
  { word: 'owl', icon: '🦉', rhyme: 'owl' },
  { word: 'pig', icon: '🐷', rhyme: 'ig' },
  { word: 'queen', icon: '👸', rhyme: 'een' },
  { word: 'rain', icon: '🌧', rhyme: 'ain' },
  { word: 'sun', icon: '☀️', rhyme: 'un' },
  { word: 'star', icon: '⭐', rhyme: 'ar' },
  { word: 'tree', icon: '🌳', rhyme: 'ee' },
  { word: 'umbrella', icon: '☂️', rhyme: 'ella' },
  { word: 'van', icon: '🚐', rhyme: 'an' },
  { word: 'whale', icon: '🐳', rhyme: 'ail' },
  { word: 'box', icon: '📦', rhyme: 'ox' },
  { word: 'yarn', icon: '🧶', rhyme: 'arn' },
  { word: 'zebra', icon: '🦓', rhyme: 'ebra' },
  { word: 'log', icon: '🪵', rhyme: 'og' },
  { word: 'bat', icon: '🦇', rhyme: 'at' },
  { word: 'bun', icon: '🥐', rhyme: 'un' },
  { word: 'car', icon: '🚗', rhyme: 'ar' },
  { word: 'spoon', icon: '🥄', rhyme: 'oon' },
  { word: 'house', icon: '🏠', rhyme: 'ouse' },
  { word: 'wig', icon: '💇', rhyme: 'ig' },
  { word: 'snail', icon: '🐌', rhyme: 'ail' },
  { word: 'pail', icon: '🪣', rhyme: 'ail' },
];

/** Animals: name, picture, the sound it makes, where it lives, its baby. */
export const EDU_ANIMALS: ReadonlyArray<{
  name: string;
  icon: string;
  sound: string;
  home: 'water' | 'sky' | 'land' | 'farm';
  baby: string;
}> = [
  { name: 'cow', icon: '🐄', sound: 'moo', home: 'farm', baby: 'calf' },
  { name: 'duck', icon: '🦆', sound: 'quack', home: 'water', baby: 'duckling' },
  { name: 'dog', icon: '🐶', sound: 'woof', home: 'land', baby: 'puppy' },
  { name: 'cat', icon: '🐱', sound: 'meow', home: 'land', baby: 'kitten' },
  { name: 'sheep', icon: '🐑', sound: 'baa', home: 'farm', baby: 'lamb' },
  { name: 'pig', icon: '🐷', sound: 'oink', home: 'farm', baby: 'piglet' },
  { name: 'frog', icon: '🐸', sound: 'ribbit', home: 'water', baby: 'tadpole' },
  { name: 'owl', icon: '🦉', sound: 'hoot', home: 'sky', baby: 'owlet' },
  { name: 'bee', icon: '🐝', sound: 'buzz', home: 'sky', baby: 'larva' },
  { name: 'horse', icon: '🐴', sound: 'neigh', home: 'farm', baby: 'foal' },
  { name: 'lion', icon: '🦁', sound: 'roar', home: 'land', baby: 'cub' },
  { name: 'fish', icon: '🐟', sound: 'blub', home: 'water', baby: 'fry' },
  { name: 'bird', icon: '🐦', sound: 'tweet', home: 'sky', baby: 'chick' },
  { name: 'penguin', icon: '🐧', sound: 'squawk', home: 'water', baby: 'chick' },
  { name: 'bear', icon: '🐻', sound: 'growl', home: 'land', baby: 'cub' },
  { name: 'chicken', icon: '🐔', sound: 'cluck', home: 'farm', baby: 'chick' },
];

/**
 * The reader band (7–10) plays three of the games at reader level (review C, item 18):
 * sums to twenty, spelling and rhymes. Colours, shapes and animals are preschool and are
 * not offered to readers.
 */
export const EDU_READER_GAMES: readonly EduGameId[] = ['counting', 'letters', 'sounds'];

/** Spelling words for readers, with their beats marked and a one-line hint. */
export const EDU_READER_WORDS: ReadonlyArray<{
  word: string;
  icon: string;
  split: string;
  hint: string;
}> = [
  { word: 'rabbit', icon: '🐇', split: 'rab-bit', hint: 'two b’s in the middle.' },
  { word: 'garden', icon: '🌷', split: 'gar-den', hint: '“gar” then “den”.' },
  { word: 'basket', icon: '🧺', split: 'bas-ket', hint: '“bas” then “ket”.' },
  { word: 'yellow', icon: '🌼', split: 'yel-low', hint: 'two l’s, then “ow”.' },
  { word: 'pencil', icon: '✏️', split: 'pen-cil', hint: 'a soft c, like an s.' },
  { word: 'window', icon: '🪟', split: 'win-dow', hint: '“win” then “dow”.' },
  { word: 'lantern', icon: '🏮', split: 'lan-tern', hint: '“lan” then “tern”.' },
  { word: 'button', icon: '🔘', split: 'but-ton', hint: 'two t’s in the middle.' },
  { word: 'kitten', icon: '🐈', split: 'kit-ten', hint: 'two t’s in the middle.' },
  { word: 'dragon', icon: '🐉', split: 'drag-on', hint: '“drag” then “on”.' },
  { word: 'pocket', icon: '👖', split: 'pock-et', hint: 'ck makes one sound.' },
  { word: 'turtle', icon: '🐢', split: 'tur-tle', hint: 'it ends in “le”.' },
  { word: 'carrot', icon: '🥕', split: 'car-rot', hint: 'two r’s in the middle.' },
  { word: 'squirrel', icon: '🐿️', split: 'squir-rel', hint: '“squ”, and two r’s.' },
  { word: 'umbrella', icon: '☂️', split: 'um-brel-la', hint: 'two l’s near the end.' },
  { word: 'butterfly', icon: '🦋', split: 'but-ter-fly', hint: 'butter, then fly.' },
  { word: 'pineapple', icon: '🍍', split: 'pine-ap-ple', hint: 'pine, then apple.' },
  { word: 'strawberry', icon: '🍓', split: 'straw-ber-ry', hint: 'straw, then berry.' },
  { word: 'snail', icon: '🐌', split: 'snail', hint: '“ai” says its name.' },
  { word: 'bridge', icon: '🌉', split: 'bridge', hint: 'it ends in “dge”.' },
];

/** Rhyme families for readers: words in one row rhyme, rows never rhyme with each other. */
export const EDU_READER_RHYMES: ReadonlyArray<readonly string[]> = [
  ['cake', 'lake', 'snake', 'rake'],
  ['night', 'light', 'kite', 'bright'],
  ['moon', 'spoon', 'tune', 'soon'],
  ['rain', 'train', 'chain', 'plain'],
  ['clock', 'sock', 'rock', 'block'],
  ['king', 'ring', 'swing', 'sing'],
  ['boat', 'coat', 'goat', 'float'],
  ['bear', 'chair', 'hair', 'stair'],
  ['shell', 'bell', 'well', 'spell'],
  ['hand', 'sand', 'band', 'land'],
];

/**
 * R0676: which pointing plan the "Show me" guide follows for each campaign chapter goal
 * (`ChapterDef.goal`). A goal not listed gets the spoken hint only, no hand.
 */
export const EDU_GUIDE_PLANS: Record<string, 'hatch-pet' | 'feed'> = {
  firstHatch: 'hatch-pet',
  feedTwice: 'feed',
};

/**
 * R0684: a picture word's first sound, by how it sounds rather than how it is spelt: cat,
 * cake, car and kite all start with "k", queen with "kw". The rhyme keys in `EDU_WORDS` are
 * by sound the same way (snail, pail and whale share "ail").
 */
export function firstSound(word: string): string {
  const w = word.toLowerCase();
  if (w.startsWith('qu')) return 'kw';
  if (w.startsWith('wh')) return 'w';
  const c = w.charAt(0);
  if (c === 'c') return /^c[eiy]/.test(w) ? 's' : 'k';
  return c;
}
