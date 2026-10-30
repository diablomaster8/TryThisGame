/**
 * Lane E round 9: player-facing text for the Learning Grove's session flow (more lane E r9
 * agents may append below). Re-exported from strings.ts by one `export *` line.
 */

/** R0696 / R0720: the new Learning Grove's name-and-icon step. */
export const KIDS_TAG_TEXT = {
  name: 'What’s your name?',
  nameHelp: 'Grown-up: type the child’s name, or leave it empty.',
  namePlaceholder: 'Name',
  colour: 'Pick a colour',
  icon: 'Pick an animal',
  go: 'Start my Grove',
  colourNames: {
    red: 'Red',
    orange: 'Orange',
    yellow: 'Yellow',
    green: 'Green',
    blue: 'Blue',
    purple: 'Purple',
  } as Record<string, string>,
  /** Read aloud when the step opens. */
  say: 'What’s your name? Then pick a colour and an animal.',
} as const;

/** R0696: the `?kids` launcher, the children's Groves as big pictures. */
export const KIDS_PICK_TEXT = {
  title: 'Whose Grove?',
  say: 'Whose Grove shall we visit?',
  open: (name: string) => `Open ${name}’s Grove`,
  unnamed: (n: number) => `Grove ${n}`,
  grownUps: 'Grown-ups: all modes',
  none: 'No Learning Groves yet. A grown-up can start one.',
} as const;

/** R0704 (KIDS-36): the entry prompt's heading and spoken suggestion by session phase. */
export const EDU_ARC_TEXT = {
  hello: { title: 'What shall we do?', say: 'Shall we hear the story, or play a game?' },
  main: { title: 'What shall we do?', say: 'Shall we hear the story, or play a game?' },
  care: {
    title: 'Time for a cuddle?',
    say: 'Shall we give your Nubbin a fruit, or a gentle pat?',
  },
  second: { title: 'One more thing?', say: 'One more story, or one more game?' },
  windDown: {
    title: 'Nearly time to rest',
    say: 'The Nubbins are getting sleepy. One small thing, then a rest.',
  },
  careBtn: 'Feed or pat',
  careHint: 'Shake a tree for a fruit, or tap your Nubbin for a pat.',
  suggested: '⭐',
} as const;

/** Lane E r9 (kidsread): the story box's read-aloud extras. */
export const KIDS_READ_TEXT = {
  /** R0734: the co-play prompt chip's label. */
  forGrownUps: 'For grown-ups',
  /** R0736: the tap bubble on a stacked language word. */
  glossPop: (roman: string, meaning: string) => `${roman}: ${meaning}`,
  /** R0730: the box's auto-advance toggle and the grown-up switch. */
  autoOn: 'Stop turning pages by itself',
  autoOff: 'Turn pages by itself',
  autoLabel: 'Turn the story pages by itself',
  autoHelp:
    'Little Sprouts with read-aloud on: the next line comes once the voice has finished. Stops at every choice.',
  /** R0737: Ori or Hana's next visit, as a picture of the time and a spoken line. */
  backMorning: (friend: string) => `${friend} comes back in the morning`,
  backSoon: (friend: string) => `${friend} comes back very soon`,
  backNow: (friend: string) => `${friend} is waiting for you at the gate`,
  skipMorning: 'Skip to Grove morning',
  skipMorningHelp: 'Lets the next language visit come now, without waiting for a Grove morning.',
  skipMorningDone: 'Done. The next visit can come now.',
} as const;

/** R0424 (LOOK-54, lane E r9): the remembrance flower, worn by a departed Nubbin's friends. */
export const REMEMBRANCE_TEXT = {
  label: 'Remembrance flower',
  flavour: 'The same flower as on the hill. Worn for a friend, and a little for luck.',
  /** Toast when a bonded friend may now wear it. */
  given: (friend: string, gone: string) =>
    `${friend} keeps a flower for ${gone}. It can wear it as a hat now.`,
  /** The Roster refuses it to a Nubbin with nobody to remember. */
  notYours: 'Only a friend of someone on the hill wears this one.',
} as const;

/** Lane E r9 (kidsread), R0679 KIDS-11: the sprout HUD's picture-button names. */
export const SPROUT_HUD_TEXT = {
  story: 'Story',
  nubbins: 'My Nubbins',
  places: 'Places',
} as const;

/** R0441 (LOOK-73, lane E r9): the photo mode's "With me" selfie with the Keeper. */
export const PHOTO_SELFIE_TEXT = {
  withMe: 'With me',
  alone: 'Just them',
  /** Full 3D: the Keeper walks over and picks the Nubbin up before the picture. */
  fetching: 'You go and pick them up. Say cheese in a moment.',
  caption: (name: string) => `${name} and you. One of you is looking at the camera.`,
} as const;
