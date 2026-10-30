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
