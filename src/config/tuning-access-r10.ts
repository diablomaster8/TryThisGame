/**
 * Lane E round 10 (R0709 KIDS-41, R0710 KIDS-42, R0694 KIDS-26): access tunables. Wired from
 * `src/input/simple-touch.ts`, `src/ui/access-r10.ts` and `src/sim/loss-notice.ts`.
 */

/** KIDS-42: "Simple touch" for small or unsteady hands (INPUT.simple in the recs). */
export const SIMPLE_TOUCH = {
  /** The Nubbin near-miss ring grows by this much, so a wobbly tap still lands. */
  pickSlopScale: 1.5,
  /** A press this long (ms) still counts as a tap; no hold ever lifts or drags. */
  tapMaxMs: 1200,
  /** And this much finger travel (CSS px), since nothing turns a press into a drag. */
  tapMovePx: 32,
} as const;

/** KIDS-41: what "high contrast" paints with (also in access-r10.css). */
export const HIGH_CONTRAST = {
  focusRingPx: 3,
} as const;

/**
 * KIDS-26: the story chapters about loss, by chapter number, with the kind of hard moment
 * they hold (`sensitive` in the recs). Chapter 10 is Moss's fading; 11 is the days after.
 */
export const SENSITIVE_CHAPTERS: Readonly<Record<number, 'loss' | 'fear' | 'separation'>> = {
  10: 'loss',
  11: 'loss',
};

/**
 * KIDS-26: side stories with a departure, by id. S10 is Hazel's prepared farewell, S19
 * Cinder's last light (a new red flower on the hill), S27 Spindle dying in her season.
 */
export const SENSITIVE_SIDE_STORIES: Readonly<Record<string, 'loss' | 'fear' | 'separation'>> = {
  s10: 'loss',
  s19: 'loss',
  s27: 'loss',
};

/** KIDS-26: up to this age the loss chapters wait for a grown-up unless one says otherwise. */
export const LOSS_TOGETHER_MAX_AGE = 4;
