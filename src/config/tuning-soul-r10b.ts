/**
 * Lane A round 10 (SOUL, kindergarten and expression): performances (R0525), the doctor's
 * check-up (R0556), the emote ball's moods and morphs (R0548) and the friend chat (R0540).
 */

/** R0525 (SOUL-07): how each lesson looks and sounds when performed. */
export const PERFORM = {
  /** The instruments a schooled player can be handed (chosen by seed when it learns). */
  instruments: ['bell', 'drum', 'trumpet'] as const,
  /** A drawing stays on the ground this long, fading over the last part of it. */
  doodleMs: 10 * 60_000,
  doodleFadeMs: 2 * 60_000,
  /** The doodle is drawn in over the first part of the performance. */
  doodleDrawMs: 3000,
  /** At most this many doodles in the Grove; the oldest goes first. */
  doodleMax: 8,
  /** Doodle side in world units, and how far in front of the artist it lies. */
  doodleSize: 1,
  doodleAhead: 0.75,
  /** How many doodle pictures there are to pick from. */
  doodleKinds: 12,
  /** Dance: one beat in ms, per level (sway, stomp, spin). */
  danceBeatMs: [520, 380, 300] as const,
  /** Singing and instrument: a note particle every this many ms. */
  noteEveryMs: 520,
  /** A held prop's offset from the body, in world units (to the side, up). */
  propSide: 0.42,
  propUp: 0.55,
  propSize: 0.55,
} as const;

/** R0556 (SOUL-39): the doctor's check-up. */
export const DOCTOR = {
  /** The little scene before the card (ms per step: stethoscope, tongue, reflex). */
  stepMs: 900,
  /** No pat for this long and a sociable one misses it. */
  hugGapMs: 10 * 60_000,
  hungryBelow: 0.35,
  tiredBelow: 0.25,
  sadBelow: 0,
  gladAbove: 60,
  shyTrustBelow: 40,
  /** A type lean this far ahead of the next shows in the legs (or wings, or fins). */
  leanLead: 15,
  /** Alignment past this reads as a lean toward the Sun or the Moon. */
  alignLean: 0.5,
} as const;

/** R0548 (SOUL-30): the emote ball's moods and its morph from one shape to the next. */
export const EMOTE_MOOD = {
  /** The morph: the old shape squashes away, then the new one pops in (ms in all). */
  morphMs: 150,
  /** Frame flip (bob) period in ms: happy bobs fast, sad slowly. */
  flipMs: { happy: 220, content: 400, sad: 720 } as const,
  /** A sad ball sinks this far (world units) toward the head. */
  droop: 0.14,
  /** A happy ball bounces this high on its quick bob. */
  hop: 0.06,
  /** Pocket and digi families: their tiny content sign shows this long out of every cycle. */
  familySignMs: 900,
  familyCycleMs: 4200,
} as const;

/** R0540 (SOUL-22): two friends trading picture bubbles. */
export const CHAT = {
  /** They stand this far apart, facing each other. */
  gap: 0.9,
  /** The walk over gives up after this long. */
  approachMs: 5000,
  /** One speech bubble each, turn about. */
  turnMs: 800,
  turns: 4,
  /** The ending (a laugh, a hug or a huff). */
  endMs: 1400,
  /** Friendship at which a talk ends in a hug rather than a laugh. */
  hugAt: 60,
  /** Recent things count as shared news for this long. */
  newsMs: 3 * 60_000,
} as const;
