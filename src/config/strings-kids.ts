/** Player-facing text for the Learning Grove's kid-facing screens (lane E, round 7: KIDS). */

/** R0671: the kid-safe sound sheet the ⚙ button opens in a Learning Grove. */
export const KID_SHEET_TEXT = {
  title: 'Sound',
  soundOn: 'Sound on',
  soundOff: 'Sound off',
  volume: 'How loud',
  grownUps: 'Grown-up settings',
  /** The link that replaces the Learning Grove fieldset inside the full Settings. */
  eduLink: 'Age, story and read-aloud live in the grown-up area.',
  eduLinkButton: 'Open the grown-up area',
} as const;

/** R0672: the break card's goodnight, which keeps the break running. */
export const BREAK_KID_TEXT = {
  done: 'All done for now',
  goodnight: 'Goodnight! See you next time.',
  /** R0725: the break card's stretches, each with the Nubbin's pose (a sprite clip). */
  stretches: [
    { clip: 'happy', icon: '🙌', say: 'Reach up high, like your Nubbin! Up, up, up!' },
    { clip: 'tumble', icon: '🦶', say: 'Now bend down and touch your toes.' },
    { clip: 'love', icon: '〰️', say: 'Wiggle, wiggle, wiggle!' },
    { clip: 'eat', icon: '🥤', say: 'Time for water! Have a little drink.' },
  ] as readonly { clip: string; icon: string; say: string }[],
  /** R0724: said once, two minutes before the break. */
  soon: 'Two more minutes, then a rest!',
  /** Read aloud with the goodnight card; the name is the child's Nubbin. */
  goodnightSay: (name: string) => `${name} is fast asleep. Goodnight! See you next time.`,
  goodnightSayNone: 'The Grove is fast asleep. Goodnight! See you next time.',
} as const;

/** R0673 / R0676: the "What's next" card's big button and the guide's spoken hints. */
export const GUIDE_TEXT = {
  showMe: 'Show me',
  /** Said when the hand appears, by the target's kind. */
  say: {
    egg: 'Give the egg a little shake!',
    nubbin: 'Tap your Nubbin!',
    pet: 'Now tap Pet!',
    feed: 'Now tap Feed!',
    pickup: 'Now tap Pick up!',
    putdown: 'Now tap Put down. Watch!',
    shake: 'Now tap Shake! Shake, shake, shake!',
    tree: 'Tap the tree to shake it!',
    fruit: 'Pick up a fruit!',
  },
  nothing: 'Look around the Grove. Your Nubbin is waiting!',
} as const;

/** R0674: how the minigames sound when read aloud. */
export const EDU_SAY_TEXT = {
  hearAgain: 'Hear it again',
  /** The counting icons, said as words in a prompt ("How many apples?"). */
  emoji: {
    '🍎': 'apples',
    '⭐': 'stars',
    '🐚': 'shells',
    '🌼': 'flowers',
    '🍄': 'mushrooms',
    '🥚': 'eggs',
  } as Record<string, string>,
  numbers: [
    'zero',
    'one',
    'two',
    'three',
    'four',
    'five',
    'six',
    'seven',
    'eight',
    'nine',
    'ten',
    'eleven',
    'twelve',
    'thirteen',
    'fourteen',
    'fifteen',
    'sixteen',
    'seventeen',
    'eighteen',
    'nineteen',
    'twenty',
  ] as readonly string[],
  /** A letter said as itself, so "A" is not read as the word "a". */
  letter: (l: string) => `the letter ${l}`,
} as const;

/** R0677: sprout-band choices read aloud. */
export const SPROUT_CHOICE_TEXT = {
  /** "You can say: one, Smile. Two, Wave." */
  intro: 'You can say:',
  item: (n: string, label: string) => `${n}, ${label}.`,
  /** The fallback icons, one per place. */
  numbers: ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣'] as readonly string[],
} as const;

/** R0681: the game picker, spoken. */
export const EDU_PICKER_TEXT = {
  say: 'What shall we play?',
  stars: (n: number) => `${n} of 3 stars`,
} as const;

/** R0686: the results card, said aloud. */
export const EDU_RESULTS_TEXT = {
  say: (stars: number, name: string) =>
    `You got ${stars} ${stars === 1 ? 'star' : 'stars'}! ${name} is so happy.`,
} as const;

/** R0711 / R0731: kind words for a miss, and the sprout band's hold-to-leave. */
export const EDU_WRONG_TEXT = {
  first: 'Hmm, not that one. Try another!',
  leaveHold: 'Hold to go back to the Grove',
  saved: 'Your stars are saved.',
} as const;

/** R0691: a sprout's Nubbin comes back, said gently. */
export const EDU_REBORN_TEXT = {
  toggle: 'Every Nubbin comes back',
  toggleHelp: 'At the end of its life a Nubbin is always reborn as an egg, never gone for good.',
  say: (name: string) =>
    `${name} was tired and slept in a glowing cocoon. And here is a new egg! ${name} is back!`,
} as const;

/** R0720: the Learning Grove's age screen. */
export const AGE_PICK_TEXT = {
  tagline: 'Read-aloud stories and gentle games',
  reader: 'Reader',
} as const;

/** R0729: a chapter card, said aloud. */
export const CHAPTER_SAY_TEXT = {
  say: (n: string, title: string) => `Chapter ${n}: ${title}.`,
} as const;

/** R0746: the grown-up area's rounds-per-game picker. */
export const EDU_ROUNDS_TEXT = {
  label: 'Rounds in each game',
} as const;

/** R0682 / R0683: the grown-up area's "what your child knows" report. */
export const EDU_MASTERY_TEXT = {
  heading: 'What your child knows',
  help: 'Green: knows it. Amber: still learning. Grey: not met yet.',
  letters: 'Letters',
  numbers: 'Numbers',
  colours: 'Colours',
  shapes: 'Shapes',
  states: { known: 'knows it', learning: 'learning', new: 'not met yet' },
  ladderHeading: 'Where each game is up to',
  ladderRow: (say: string, rung: number, of: number) => `${say} (step ${rung} of ${of})`,
} as const;

/** R0685: the sticker book, "My Book". */
export const STICKER_BOOK_TEXT = {
  title: 'My Book',
  close: 'Close',
  prev: 'Page before',
  next: 'Next page',
  empty: 'A sticker still to come',
  count: (have: number, of: number) => `${have} of ${of}`,
  /** The results card's line when a sticker arrives; tap it to open the book. */
  arrived: (say: string) => `A new sticker! ${say}`,
  open: 'Open my book',
} as const;

/** R0680: the Learning Grove's Places menu: each place's name, said on a long press. */
export const EDU_PLACES_TEXT = {
  title: 'Places',
  say: 'Where shall we go?',
  names: {
    book: 'My Book',
    collection: 'My Nubbins',
    decorate: 'Decorate',
    photo: 'Take a photo',
    playFight: 'Play-fight',
    kindergarten: 'Kindergarten',
    map: 'Map',
    beetle: 'Beetle Run',
  },
  grownUps: 'Grown-ups',
  /** The grown-up area's toggles. */
  heading: 'Places your child can visit',
  help: 'These show as big pictures when your child taps ⋯. The rest of the game stays hidden.',
} as const;

/** R0692: the Learning Grove's egg shelf. */
export const EDU_EGG_TEXT = {
  gone: 'In your Grove',
  egg: (colour: string, gone: boolean) =>
    gone ? `A ${colour} egg, already bought today` : `A ${colour} egg. It hatches just like this.`,
} as const;

/** R0695: limits, quiet hours and the boot lock. */
export const EDU_LIMITS_TEXT = {
  title: 'The Grove is asleep',
  why: {
    daily: "That's all the playing for today. The Grove wakes up tomorrow.",
    quiet: 'Shh, it is quiet time. The Grove is sleeping now.',
  },
  say: {
    daily: "That's all for today! Your Nubbin is fast asleep. See you tomorrow!",
    quiet: 'Shh! It is quiet time. Your Nubbin is fast asleep. Goodnight!',
  },
  unlock: 'Grown-up: play a little longer',
  heading: 'Limits',
  help: 'Leave a box empty for no limit. Missing a day never costs anything.',
  none: 'none',
  daily: 'Minutes a day',
  quietFrom: 'Quiet from (hour, 0–23)',
  quietTo: 'Quiet until (hour, 0–23)',
  lock: 'Open straight into this Grove',
  lockHelp: 'A reload skips the title. Turn it off here to reach the other games.',
} as const;

/** R0703: the tracing game's spoken help. */
export const TRACE_KID_TEXT = {
  start: 'Start at the green dot.',
  watch: 'Watch the finger, then you try!',
  helped: "Let's do that one together.",
  good: 'Yes!',
  done: 'You wrote it!',
} as const;
