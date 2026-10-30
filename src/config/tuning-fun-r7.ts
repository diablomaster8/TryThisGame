/**
 * Lane A round 7 (MOVE, FUN and SOUL): tunable numbers added this round, kept beside
 * `tuning-fun.ts` so the shared tuning file only gains a re-export line.
 */

/**
 * R0342 (FUN-53): each speaker's read-aloud voice, as the device's speech pitch (0–2) and
 * rate (0.1–10). Narration is the plain reading voice; anyone unlisted reads as `default`.
 */
export const VOICE_TTS: Record<string, { pitch: number; rate: number }> = {
  default: { pitch: 1.0, rate: 0.9 },
  narrator: { pitch: 1.0, rate: 0.9 },
  hazel: { pitch: 0.95, rate: 0.85 },
  sparks: { pitch: 1.3, rate: 1.1 },
  moss: { pitch: 0.7, rate: 0.75 },
  fern: { pitch: 1.15, rate: 0.95 },
  corvin: { pitch: 0.85, rate: 0.85 },
  byte: { pitch: 1.2, rate: 1.05 },
  marina: { pitch: 1.05, rate: 0.9 },
  clover: { pitch: 1.2, rate: 0.95 },
  pixel: { pitch: 1.25, rate: 1.05 },
  luna: { pitch: 0.9, rate: 0.85 },
  ember: { pitch: 0.9, rate: 1.0 },
  dusty: { pitch: 0.8, rate: 0.85 },
  nova: { pitch: 1.1, rate: 1.0 },
};

/**
 * R0342: how read-aloud says a shouted word (said lowercased so no engine spells it out,
 * with this much more pitch), and how long it waits after a line ending in "!".
 */
export const READ_ALOUD = {
  shoutPitch: 0.2,
  bangPauseMs: 400,
  /** Voice names that usually mean a better engine, tried in this order. */
  bestVoice: ['Natural', 'Neural', 'Premium', 'Enhanced'],
} as const;

/**
 * R0350: the Shadow Nubbin's trust bands for its refusal lines (refusals happen below
 * `TRUST.wary`): `near` and above came within a paw. Touches it allows are met with a line
 * that admits nothing until `allowsUntil`.
 */
export const SHY_TRUST = {
  near: 20,
  allowsUntil: 45,
  touches: ['tickle', 'hug', 'groom', 'pet', 'highFive'] as readonly string[],
} as const;

/**
 * R0351 (FUN-62): the waiting egg's own antics: a short wobble every `wobbleEveryMs`, a hop
 * of `hopHeight` units every `hopEveryMs` once under `hopUnderMs` from hatching, and a foot
 * out for `footMs` on every `footEvery`th shake.
 */
export const EGG_ANTICS = {
  wobbleEveryMs: 20_000,
  wobbleMs: 600,
  hopUnderMs: 30_000,
  hopEveryMs: 2_500,
  hopMs: 260,
  hopHeight: 0.06,
  footEvery: 3,
  footMs: 900,
} as const;

/**
 * R0352 (FUN-63): the Keeper's idle antics. Standing quietly in the Grove, the Keeper
 * checks the letter at `fidgetMs` (for `letterMs`), pats a pocket (`pocketMs`), and sits at
 * `sitMs`; the nearest free Nubbin within `joinRadius` comes to the seat beside them and
 * gains `affectionPerMinute` while it stays (rule three).
 */
export const KEEPER_IDLE = {
  fidgetMs: 20_000,
  letterMs: 3_000,
  pocketMs: 1_500,
  sitMs: 40_000,
  joinRadius: 14,
  arrive: 0.7,
  seat: { side: 0.9, ahead: 0.25 },
  affectionPerMinute: 2,
  /** Below this energy a Nubbin naps instead of coming to sit. */
  minEnergy: 0.2,
} as const;

/**
 * R0355 (FUN-66): the sit-with gags, by time since the Nubbin sat down beside the Keeper:
 * it leans in at `leanMs`, nods off on the Keeper's foot at `dozeMs`, and from `snoreMs`
 * snores a bubble that grows and pops every `bubbleMs`.
 */
export const SIT_WITH = {
  leanMs: 4_000,
  dozeMs: 12_000,
  snoreMs: 18_000,
  bubbleMs: 3_000,
} as const;

/** R0353: Moss reacts from chapter `fromChapter`, within `sight` units, at a seeded `chance`. */
export const MOSS_WATCH_RULE = { fromChapter: 4, sight: 12, chance: 0.3 } as const;
