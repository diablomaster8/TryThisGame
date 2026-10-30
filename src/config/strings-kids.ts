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
