/**
 * Lane E r10 (kids UI): tunables for the Learning Grove's round-10 screens. Re-exported from
 * `tuning.ts` like the other lane files.
 */
export const KIDS_R10_TUNING = {
  /** R0696: the first Nubbin's picture on a Learning Grove tile, drawn at this size. */
  portraitPx: 64,
  /** R0696: the longest the title waits for an idle moment before drawing the pictures. */
  portraitIdleMs: 600,
  /** R0679: how long the grown-ups corner tab is held before it asks the gate. */
  grownUpHoldMs: 900,
  /** R0735: the ages a reader save can take (the band stays `reader`). */
  readerAges: [7, 8, 9, 10],
  /** R0679: the longest one tutorial line keeps its button lit if the voice never ends. */
  tutorialStepMaxMs: 6000,
  /** R0700: the do beats. A drawing needs this long before it can be shown. */
  drawMinMs: 10_000,
  /** R0700: the "your turn" pause for a say beat, with no microphone. */
  sayMs: 5_000,
  /** R0700: items in a sort beat, and bushes in a find beat. */
  sortItems: 6,
  findBushes: 6,
  /** R0705: the gap between Ori's and Hana's hello on the postcard. */
  greetGapMs: 1400,
} as const;
