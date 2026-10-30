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
