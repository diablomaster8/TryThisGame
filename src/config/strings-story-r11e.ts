/** Lane E r11: the playing-alone prompts and the Read it again button. */
export const KIDS_STORY_TEXT = {
  /** R0697: the badge on a spoken child prompt. */
  yourTurn: '🙋 Your turn!',
  /** R0697: the chip label for a grown-up in the room. */
  grownUpTip: 'Grown-up tip',
  coPlayLabel: 'Playing alone',
  coPlayHelp:
    'On: a prompt in brackets is spoken to the child as "your turn", then the story waits a moment. Off: it shows as a tip for a grown-up sitting beside them.',
  /** R0698: the button in the dialogue box. */
  readAgain: '🔁 Read it again',
  readAgainLabel: 'Read this line again',
} as const;

/** R0701: Ori or Hana says a word that is due, while a Nubbin waves. */
export const DUE_WAVE_TEXT = {
  friend: { he: 'Ori', ja: 'Hana' } as Record<string, string>,
  says: (friend: string, roman: string) => `${friend} says: ${roman}`,
} as const;
