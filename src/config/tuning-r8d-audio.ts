/**
 * Lane D round 8 (audio): the mix, the music duck and the sound effects' numbers.
 * Re-exported from tuning.ts.
 */

/** R0464 (TECH-22): the bus graph built once sound unlocks (platform/audio.ts buildGraph). */
export const AUDIO_MIX = {
  /** The master compressor. */
  compThresholdDb: -18,
  compRatio: 4,
  masterGain: 0.9,
  /** The default slider levels for a new save (0..1). */
  defaultMusic: 0.6,
  defaultSfx: 0.8,
  /** The music echo. */
  delaySec: 0.32,
  delayFeedback: 0.28,
  delayLowpassHz: 2400,
  delaySend: 0.35,
  /** The small hall: a decaying noise impulse. */
  hallSec: 1.8,
  hallDecayPow: 2.6,
  hallRightLevel: 0.9,
  hallSend: 0.22,
} as const;

/**
 * R0464 (TECH-22): the music ducks under words and big moments. Levels multiply the music
 * slider; the quietest active duck wins. `tau` is the setTargetAtTime time constant, so the
 * music is back within 5τ (0.4 s) of a duck ending.
 */
export const MUSIC_DUCK = {
  tau: 0.08,
  /** While the story dialogue box is open. */
  dialogue: 0.35,
  /** While a read-aloud line is being spoken. */
  speech: 0.2,
  /** A short dip under a big sting (hatch, evolve, a win). */
  sting: 0.5,
  stingMs: 1200,
  /** The sounds that count as a sting. */
  stingSounds: ['hatch', 'evolve', 'win'] as readonly string[],
} as const;

/**
 * R0507 (TECH-64): per-song trims in dB, set so every song's estimated level
 * (platform/mix-level.ts) sits within `toleranceDb` of `SONG_LEVEL.targetDb` plus its offset.
 * Trims stay within ±`maxTrimDb`, so a sparse cue is never pushed into the compressor.
 */
export const SONG_TRIM_DB: Readonly<Record<string, number>> = {
  title: -1,
  grove: -1.5,
  night: -0.5,
  race: -2,
  expedition: -1,
  story: 6,
  sorrow: 0.5,
  tense: 2.5,
  hollow: 2,
  karate: 0,
  battle: 0,
  circuit: 0.5,
  calm: 6,
};

export const SONG_LEVEL = {
  /** The common level the songs are trimmed to, in the estimator's relative dB. */
  targetDb: -9,
  /** How far a trimmed song may sit from its target. */
  toleranceDb: 1.5,
  /** The largest trim either way. */
  maxTrimDb: 6,
  /**
   * Songs meant to sit under the rest: the night and sorrow pieces by 2 dB (the item asks
   * for it); the sparse story cue and the calm lullaby read far lower on a loop average,
   * and stay quieter rather than take more than `maxTrimDb` of boost.
   */
  offsetDb: { night: -2, sorrow: -2, story: -8, calm: -9 } as Readonly<Record<string, number>>,
} as const;

/** R0450 (TECH-08): the Expedition's sound cues (minigames/expedition/sfx.ts). */
export const EXPEDITION_SFX = {
  /** Holding the jump this long (ms) adds the high jump's second tone. */
  highJumpHoldMs: 180,
  /** Shells caught within this many ms of each other build a combo. */
  comboWindowMs: 600,
  /** The combo at which the shell chime reaches its top note. */
  comboSteps: 6,
} as const;
