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
