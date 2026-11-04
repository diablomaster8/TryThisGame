/**
 * Lane A round 11 (SOUL), helper G4: numbers for the wider kindergarten (R0554), the nap
 * dreams (R0586), the seasonal moods (R0590), the watch camera (R0550) and the old souls
 * (R0592). Every figure here is a default; nothing is read from the rng.
 */

/** R0554 (SOUL-37): the class list is a family of variants, each bought once. */
export const VARIANT_LESSONS = {
  /** A Nubbin performs one of its best this many variants (picked by its own seed). */
  repertoire: 2,
} as const;

/** R0550 (SOUL-32): edge chips and the watch camera. */
export const WATCH = {
  /** At most this many edge chips at once. */
  maxChips: 4,
  /** Chip size in CSS px (a tap target). */
  chipPx: 44,
  /** How far inside the screen edge a chip sits, in CSS px. */
  edgePad: 8,
  /** A Nubbin counts as off screen when its projected point is this far outside, in px. */
  margin: 12,
  /** The caption is re-read this often, in ms (it must update within a second). */
  captionEveryMs: 400,
  /** Holding a portrait this long starts Watch. */
  longPressMs: 500,
} as const;

/** R0586: a napping Nubbin dreams of what it did or loves. */
export const DREAMS = {
  /** A bubble every this many ms of a nap (halved for lazy and dreamy ones). */
  everyMs: 20_000,
  /** The first bubble comes this long into the nap. */
  firstMs: 4000,
  /** A bubble stays this long. */
  holdMs: 3600,
} as const;

/** R0590: seasonal moods and festival behaviour. */
export const SEASON_MOOD = {
  /** How long a seasonal flourish lasts. */
  flourishMs: 3200,
} as const;

/** R0592: Eternals and Moss as old souls. */
export const OLD_SOUL = {
  /** Slowest and calmest: walk speed multiplier. */
  paceMul: 0.7,
  /** How long an old soul sits and watches the Grove. */
  sitMs: 9000,
} as const;

/** R0564 and R0588: the Antics album's prizes and the Fridge's size. */
export const ALBUM = {
  /** One-time Shells prizes at this many stamps. */
  prizes: { 10: 20, 20: 50, 40: 120 } as Record<number, number>,
  /** The Fridge keeps this many doodles, newest last. */
  fridgeMax: 30,
} as const;
