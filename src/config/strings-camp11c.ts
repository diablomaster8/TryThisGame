/** Lane C round 11 (R0600, R0657, R0633, R0629): words for the open world's lines. */
export const CAMP11C_TEXT = {
  fairTitle: 'The Valley Fair',
  fairHelp: 'When the story and two of its roads have ended, the valley throws a fair.',
  fairLocked: 'Finish the story and two other lines to open it.',
  fairPlay: 'Go to the fair',
  fairAgain: 'Visit the fair again',
  fairToast: 'The Valley Fair is open.',
  /** R0633: the prompt when Dawn's story meets a Moon Keeper (and the reverse for Dusk). */
  switchSun: 'Dawn is a Sun Keeper’s story. Switch to Sun?',
  switchMoon: 'Dusk is a Moon Keeper’s story. Switch to Moon?',
  switchYes: 'Switch',
  switchNo: 'Not now',
  /** R0657: the region's name after the story. */
  afterTitle: 'After the Long Night',
  afterNext: (line: string) => `Next: ${line}`,
} as const;
