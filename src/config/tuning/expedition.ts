/**
 * Tuning: the expedition domain (TECH-36). Moved out of config/tuning.ts, which still re-exports it.
 * Numbers are unchanged; the review-pass letters in the comments are their provenance.
 */

export const EXPEDITION = {
  durationMs: 50_000,
  /** Low-res view height; width follows the screen aspect, clamped. */
  viewH: 270,
  minViewW: 200,
  maxViewW: 480,
  /** In portrait, sky is added above the track up to this multiple of `viewH`. */
  maxHeadroom: 1.6,
  /** Pixels per second, ramping up a little over the run. */
  speed: 110,
  speedRamp: 0.8,
  /** The runner stands this far from the left edge, on this ground line. */
  runnerX: 72,
  groundY: 214,
  gravity: 1100,
  jumpVelocity: 360,
  /** Holding the jump cancels this much gravity for up to holdMaxMs. */
  holdGravityCancel: 650,
  holdMaxMs: 260,
  /** Rewards. */
  shellValue: 1,
  obstaclePenalty: 5,
  /** Spawn cadence in pixels of track. */
  patternGapPx: [140, 260] as const,
  essenceChance: 0.12,
  critterChance: 0.09,
  obstacleChance: 0.45,
  /** Seconds of invulnerability after a hit. */
  hitCooldownMs: 700,
} as const;

/**
 * The Expedition in Full 3D (G17): the same run (`run.ts`, in low-res pixels) drawn as a
 * side-on 3D track with a chase camera. Distances map through `unitsPerPx`: the runner
 * is `RUNNER_H` (26) pixels tall in the run and about one world unit tall as a rig.
 */
export const EXPEDITION3D = {
  unitsPerPx: 1 / 26,
  /**
   * The chase camera: how far it looks ahead of the runner along the track and how high,
   * its downward tilt, how many world units it frames top to bottom (the runner is one,
   * so about a sixth of the screen), the least it frames across in portrait (the lens
   * widens to keep that), and how fast it eases after the runner (per second).
   */
  camera: {
    lookAhead: 2.0,
    lookHeight: 1.4,
    pitchDeg: 12,
    height: 6.5,
    minSpan: 6,
    followRate: 7,
    fovDeg: 42,
  },
  /** The backdrop gradient behind everything, zenith to horizon, by theme. */
  backdrop: {
    meadow: { top: '#4a8ad8', bottom: '#d6e8f6' },
    hollow: { top: '#0b1030', bottom: '#2b3660' },
  },
  /** Parallax hills behind the track: depth (negative z is away), height and wavelength. */
  hills: [
    { z: -13, rise: 3.0, period: 12, color: '#5f8f4a' },
    { z: -26, rise: 6.5, period: 21, color: '#4b7a52' },
    { z: -44, rise: 11, period: 35, color: '#5a7f8a' },
  ],
  /** A ring of trees recycled along the track: how many, their spacing, depth and size. */
  trees: { count: 7, spacing: 9, z: -12, scale: 1.0 },
  /** Grass tufts: how many per tile, the tile length along the track and its depth. */
  grass: { count: 1200, span: 36, depth: 9 },
  /** The ground strip: how far it reaches toward the camera and away from it. */
  ground: { front: 24, back: 14 },
  /** The tiling scenery (ground, hills) reaches this far each side of the camera. */
  sceneryHalf: 30,
  /** Prop sizes in world units. */
  shellRadius: 0.17,
  essenceSize: 0.28,
  bubbleRadius: 0.36,
  /** The hour of day each theme's sky shows (the Hollow runs at night). */
  hour: { meadow: 10.5, hollow: 21.5 },
  /** Camera shake on a hit, world units (off under reduced motion). */
  shake: 0.07,
  /** How long the view may wait for the runner's rig before the run starts, ms. */
  rigWaitMs: 2500,
} as const;
