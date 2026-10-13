// Every tunable number lives here. Nothing in this file is player-facing text
// (that is config/strings.ts).

const SECOND = 1000;
const MINUTE = 60 * SECOND;
const HOUR = 60 * MINUTE;

export const RENDER = {
  /** Height of the low-res frame in pixels. Width follows the screen aspect ratio. */
  targetHeight: 270,
  /** The low-res target does the heavy lifting, so device pixel ratio is capped at 1. */
  maxPixelRatio: 1,
} as const;

export const CAMERA = {
  /** Fixed downward tilt of the orbit camera, in degrees. */
  pitchDeg: 35,
  /** The camera orbits in steps of this many degrees. */
  yawStepDeg: 45,
  /** Number of yaw steps in a full circle (360 / yawStepDeg). */
  yawSteps: 8,
  initialYawIndex: 1,
  /**
   * Zoom levels, expressed as low-res pixels per world unit. Integer ratios keep
   * pixel art crisp. Index 0 is the farthest view.
   */
  pixelsPerUnit: [8, 16] as const,
  initialZoomIndex: 1,
  /** Distance from the orbit target. Only affects clipping for an orthographic camera. */
  distance: 60,
  near: 0.1,
  far: 200,
  /** Duration of the eased snap between yaw steps and zoom levels, in ms. */
  snapMs: 180,
  /** How quickly the orbit target follows the Keeper (fraction per second). */
  followRate: 6,
} as const;

export const TEST_SCENE = {
  groundSize: 32,
  /** Ground texture tiles per world unit. */
  groundTilesPerUnit: 1,
  /** Pixels per ground tile. */
  groundTilePx: 8,
  spriteSizePx: 32,
  /** World height of a 32px sprite. 2 units at 16 px/unit means 1:1 pixels at the near zoom. */
  spriteWorldHeight: 2,
} as const;

export const INPUT = {
  /** Horizontal two-finger travel (CSS px) that counts as a rotate swipe. */
  swipeThresholdPx: 40,
  /** Pinch distance ratios that count as zoom out / zoom in. */
  pinchOutRatio: 0.8,
  pinchInRatio: 1.25,
  /** Wheel delta (px) that counts as one zoom step. */
  wheelThreshold: 20,
  /** Pointer travel (CSS px) before a press becomes a drag instead of a tap. */
  dragThresholdPx: 10,
  /** Press duration (ms) under which a release counts as a tap. */
  tapMaxMs: 350,
  /** Pointer direction reversals per second that count as shaking a held egg. */
  shakeReversalsPerSecond: 4,
  /** Logo taps within this window open the debug panel. */
  tripleTapMs: 600,
} as const;

export const UI = {
  fpsUpdateMs: 1000,
  /** Mood bubble lifetime above a Nubbin, in ms. */
  bubbleMs: 1500,
} as const;

// ---------- simulation ----------

export const SIM = {
  /** Fixed sim step. 10 per second. */
  stepMs: 100,
  /** Fine steps allowed per rendered frame before the loop falls back to coarse steps. */
  maxStepsPerFrame: 400,
  /** Longest real gap one frame may feed the clock; anything longer is a pause. */
  maxFrameDeltaMs: 5000,
  /** Coarse step used for long catch-ups. */
  coarseStepMs: 1 * MINUTE,
  /** Absences longer than this are simulated in coarse steps. */
  coarseAfterMs: 3 * MINUTE,
  timeScales: [1, 10, 100, 1000] as const,
  autosaveMs: 30 * SECOND,
  /** Show a progress indicator when catch-up takes longer than this. */
  catchUpProgressMs: 500,
  /** Grove bounds: entities stay within ±half on both axes. */
  worldHalf: 14,
} as const;

export const OFFLINE = {
  defaultMode: 'capped' as const,
  defaultCapHours: 8,
  minCapHours: 1,
  maxCapHours: 720,
  defaultAllowDepartures: false,
} as const;

export const EGG = {
  startCount: 2,
  /** Roster cap: eggs plus Nubbins. */
  maxRoster: 8,
  hatchMs: 3 * MINUTE,
  /** Each shake while held takes this much off the hatch timer. */
  shakeBonusMs: 15 * SECOND,
  /** Minimum gap between shakes that count. */
  shakeCooldownMs: 250,
} as const;

export const NEEDS = {
  /** Hunger goes from 1 (full) to 0 (starving) in this time. */
  hungerFullToStarvingMs: 20 * MINUTE,
  /** Energy goes from 1 to 0 in this time. */
  energyFullToEmptyMs: 40 * MINUTE,
  napMs: 3 * MINUTE,
  /** Below this hunger the Nubbin looks for food. */
  hungryThreshold: 0.35,
  /** Below this hunger it is starving and loses happiness. */
  starvingThreshold: 0.1,
  starvingHappinessPerMinute: -2,
  happinessMin: -100,
  happinessMax: 100,
  happinessStart: 20,
  affectionMin: 0,
  affectionMax: 100,
  affectionStart: 10,
  petHappiness: 5,
  petAffection: 2,
  dropHappiness: -10,
  dropAffection: -3,
  /** One fruit restores this much hunger (0..1). */
  fruitHunger: 0.5,
  fruitHappiness: 3,
  fruitStaminaPoints: 10,
  /** Happiness drifts toward 0 by this much per minute when nothing else happens. */
  happinessDriftPerMinute: 0.5,
  /** Pets are only counted as a new kindness after this gap. */
  petCooldownMs: 2 * SECOND,
} as const;

export const TREES = {
  fruitIntervalMs: 4 * MINUTE,
  /** Shaking the tree takes this much off the fruit timer. */
  shakeBonusMs: 60 * SECOND,
  maxFruitOnGround: 6,
  /** Fruit lands within this radius of the trunk. */
  dropRadius: 1.6,
} as const;

export const LIFECYCLE = {
  childMs: 60 * MINUTE,
  cocoonMs: 30 * SECOND,
  adultMs: 5 * HOUR,
  /** How far into adult life the second evolution settles. */
  secondEvolutionMs: 60 * MINUTE,
  /** Lines with a champion stage take their final form this far into adult life. */
  thirdEvolutionMs: 3 * HOUR,
  /** A hatchling with a fixed rule to another baby grows into it after this long. */
  babyGrowthMs: 10 * MINUTE,
} as const;

export const REBIRTH = {
  /** Lifetime average happiness needed to be reborn instead of departing. */
  minLifetimeHappiness: 30,
  minAffection: 40,
  /** Fraction of stat points carried into the next life. */
  keepPointsFraction: 0.1,
} as const;

export const ETERNAL = {
  minRebirths: 2,
  sunThreshold: 0.8,
  moonThreshold: -0.8,
  /** |alignment| at or under this counts as Eternal Neutral. */
  neutralBand: 0.1,
} as const;

export const PERSONALITY = {
  /** Thresholds on childhood care counts, checked in this order at evolution. */
  mischievousThrows: 5,
  cheerfulPets: 10,
  shyTotal: 3,
  lazyFeeds: 5,
  /** Idle multipliers by personality: greet, play, sit, swim. */
  multipliers: {
    cheerful: { greet: 1.6, play: 1.4, sit: 0.7, swim: 1.1 },
    shy: { greet: 0.3, play: 0.8, sit: 1.3, swim: 0.8 },
    mischievous: { greet: 1.0, play: 1.6, sit: 0.5, swim: 1.5 },
    lazy: { greet: 0.8, play: 0.6, sit: 2.2, swim: 0.5 },
  } as const,
} as const;

export const RACE = {
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

export const CRITTERS = {
  mainStatPoints: 30,
  otherStatPoints: 10,
  leanNudge: 30,
  /** Giving a critter is a kindness too. */
  happiness: 8,
} as const;

export const ESSENCES = {
  statPoints: 50,
  leanNudge: 50,
  happiness: 5,
} as const;

export const STATS = {
  maxLevel: 99,
  pointsPerLevel: 100,
  gradeMultiplier: { E: 0.8, D: 0.9, C: 1.0, B: 1.1, A: 1.2, S: 1.35 } as const,
  /** Birth grade weights, low end heavy. */
  gradeWeights: { E: 30, D: 28, C: 22, B: 12, A: 6, S: 2 } as const,
} as const;

export const ALIGNMENT = {
  /** Every kind action moves alignment this far toward the active Keeper. */
  kindActionDelta: 0.01,
  sunThreshold: 0.5,
  moonThreshold: -0.5,
  /** Children show hints once they lean this far. */
  childHintThreshold: 0.15,
} as const;

export const TYPE_LEAN = {
  /** The leading type must beat the runner-up by this fraction or the adult is Normal. */
  leadMargin: 0.15,
  /** Lean gained after evolution needed for a second evolution to show. */
  secondMin: 40,
  /** A type needs at least this much lean to count at all; less than one critter. */
  minToCount: 20,
  /** Lean gained per second of swimming / flapping. Slow: an hour of play ≈ one critter. */
  trainingPerSecond: 0.02,
} as const;

export const BEHAVIOR = {
  /** World units per second. */
  walkSpeed: 1.4,
  swimSpeed: 0.8,
  arriveRadius: 0.25,
  /** How long each state lasts, min and max, in ms. */
  wanderMs: [2 * SECOND, 6 * SECOND] as const,
  sitMs: [3 * SECOND, 8 * SECOND] as const,
  eatMs: 2 * SECOND,
  greetMs: 2 * SECOND,
  cryMs: 3 * SECOND,
  swimMs: [5 * SECOND, 12 * SECOND] as const,
  reactMs: 1200,
  /** The Nubbin notices the Keeper within this distance. */
  greetRadius: 2.2,
  greetChance: 0.35,
  swimChance: 0.15,
  sitChance: 0.3,
  /** Chance to go play with a toy when one is around. */
  playChance: 0.3,
  playMs: [4 * SECOND, 8 * SECOND] as const,
  playHappiness: 4,
  /** Hungry Nubbins only look for fruit within this distance. */
  foodSearchRadius: 30,
} as const;

export const KEEPER = {
  speed: 3.5,
  arriveRadius: 0.2,
  /** Distance at which the Keeper can touch, pick up, shake or feed. */
  interactRadius: 1.4,
  /** Height a carried Nubbin floats at above the Keeper's feet. */
  carryHeight: 1.6,
} as const;

export const THROW = {
  /** Release speeds above this count as a throw; slower is a put-down. */
  minSpeed: 3,
  maxSpeed: 12,
  gravity: 24,
  /** Upward speed added to a throw. */
  lift: 5,
  /** Held Nubbins float this high above the ground under the pointer. */
  holdHeight: 1.2,
} as const;

export const SHOP = {
  fruit: 5,
  egg: 60,
  /** Chance a bought egg is a rare colour. */
  rareEggChance: 0.15,
  /** Of the rare eggs: chance of a two-tone, and of a shiny. */
  twoToneChance: 0.3,
  shinyChance: 0.2,
  hat: 40,
  toy: 30,
  /** How many toys can lie in the Grove at once. */
  maxToys: 3,
} as const;

export const EXPEDITION = {
  durationMs: 50_000,
  /** Low-res view height; width follows the screen aspect, clamped. */
  viewH: 270,
  minViewW: 200,
  maxViewW: 480,
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

export const GROVE = {
  size: 32,
  /** Centre and radius of the pond. */
  pond: { x: 6, z: 5, r: 4 },
  trees: [
    { x: -6, z: -4 },
    { x: 5, z: -8 },
  ] as const,
  hills: [
    { x: -11, z: 8, r: 5, h: 2.2 },
    { x: 11, z: -11, r: 6, h: 3 },
    { x: -12, z: -11, r: 4, h: 1.6 },
  ] as const,
  waterfall: { x: 11, z: -11, height: 3, width: 1.5 },
  keeperStart: { x: 0, z: 3 },
  eggSpots: [
    { x: -2, z: 0 },
    { x: 2, z: -1 },
  ] as const,
} as const;
