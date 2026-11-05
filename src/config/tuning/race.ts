/**
 * Tuning: the race domain (TECH-36). Moved out of config/tuning.ts, which still re-exports it.
 * Numbers are unchanged; the review-pass letters in the comments are their provenance.
 */

export const RACE = {
  /**
   * Longest real gap one frame may feed the race. The race runs fixed sim steps on real
   * time, so a slow phone (3 frames a second) sees the same race, only choppier; a longer
   * gap (the tab was hidden) is cut so the field does not jump to the finish.
   */
  maxFrameDeltaMs: 1000,
  /** Base speed in track units per second at level 0; stat levels add up to this much more. */
  baseSpeed: 2.0,
  statSpeedBonus: 3.0,
  /** Stamina pool at level 0 and the bonus at level 99, in seconds of effort. */
  staminaBase: 18,
  staminaBonus: 40,
  /** Stamina stretches drain at this multiple. */
  stretchDrain: 2.5,
  restMs: 1500,
  /** Fraction of the pool restored after a rest. */
  restRefill: 0.45,
  cheerBoost: 1.45,
  cheerMs: 1200,
  cheerCooldownMs: 3000,
  /** Rivals per tier (min, max) and how their stat levels scale with the tier. */
  rivals: [
    [4, 5],
    [5, 7],
    [6, 8],
  ] as const,
  rivalLevels: [
    [2, 14],
    [12, 36],
    [30, 70],
  ] as const,
  /** Prizes in Shells by placement, times the tier number. */
  prizes: [20, 10, 5] as const,
  hatChanceOnWin: 0.5,
  /** Hard cap so a race always ends. */
  maxMs: 120_000,
} as const;

/**
 * The races in Full 3D (G17): the sim's one-dimensional track (`sim/race.ts`) laid along
 * x with the lanes stacked away from the camera, each section built to read as itself.
 */
export const RACE3D = {
  /** World units per track unit (a course is 40 to 50 units long). */
  unitsPerTrack: 1.0,
  /** Depth between lanes, and the track's margin beyond the outer lanes. */
  laneGap: 2.1,
  margin: 1.6,
  /** A climb section rises this much over its length; the track stays up after it. */
  climbRise: 2.2,
  /** How high the racers fly over a gap, and how deep a swimmer sinks below the surface. */
  flyLift: 1.5,
  swimSink: 0.42,
  /** The swim channel: water level and bed depth below the track. */
  waterLevel: -0.3,
  channelDepth: 0.9,
  /** The gully under a fly section. */
  gapDepth: 2.6,
  /** How high the section signs stand over the track (above the name tags). */
  signHeight: 2.0,
  /** Ground shown before the start line, in track units, so the field lines up whole. */
  startPad: 3,
  camera: {
    lookAhead: 1.2,
    lookHeight: 0.5,
    // Low enough to read as a side view with faces (review 2026-10-21, bug 16), and the
    // lanes wide enough that each still sits clear above the one in front (review B,
    // bug 27): a lane gap shows as gap × sin(pitch) on screen.
    pitchDeg: 26,
    height: 10.5,
    minSpan: 7,
    followRate: 5,
    fovDeg: 42,
    /** The camera eases this far from the player toward the leader (0 follows the player). */
    leaderWeight: 0.3,
    /** The player never sits further left than this share of the half-width from centre. */
    playerKeep: 0.5,
  },
  /** Name tags over the racers: card size in world units and the text height in it. Tags
   * that would overlap on screen are nudged up by `gap` times the tag height. */
  nameTag: { width: 2.2, height: 0.5, fontPx: 56, gap: 1.1 },
  /** The backdrop gradient, zenith to horizon, and how deep the earth under the track goes. */
  backdrop: { top: '#4a8ad8', bottom: '#d6e8f6' },
  earthDepth: 30,
  /** How long the start may wait for the field's rigs before stand-ins run, ms. */
  rigWaitMs: 4000,
  /** Trees along the far side of the track: how many, spacing, depth past the last lane. */
  trees: { count: 8, spacing: 7, back: 3.5, scale: 0.85 },
  hour: 10.5,
  /** The cheer: sparkles round the player (none under reduced motion). */
  cheerBurst: { count: 18, spread: 0.5, speed: 1.2, rise: 1.4, lifeMs: 700 },
} as const;

/** The training gym: timing games at four stations. */
export const GYM = {
  pointsPerHit: 6,
  energyCost: 0.15,
  restedBonus: 1.5,
  roundMs: 20_000,
  minHunger: 0.5,
  minEnergy: 0.5,
  /** Timing bar: a sweep this long, hit zone this wide (fraction). */
  sweepMs: 900,
  zone: 0.22,
} as const;

/** The Beetle Run: a cart through a seeded cave. */
export const TANK = {
  lanes: 3,
  speed: 6,
  lengthUnits: 240,
  cargo: 8,
  hazardEvery: [1.4, 2.6] as const,
  lootEvery: [1.0, 2.2] as const,
  stunMs: 700,
  bossBonus: 40,
} as const;
