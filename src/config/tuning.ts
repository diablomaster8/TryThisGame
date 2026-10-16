// Every tunable number lives here. Nothing in this file is player-facing text
// (that is config/strings.ts).

const SECOND = 1000;
const MINUTE = 60 * SECOND;
const HOUR = 60 * MINUTE;

export const RENDER = {
  /** Height of the low-res frame in pixels. Width follows the screen aspect ratio. */
  targetHeight: 540,
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
  pixelsPerUnit: [16, 32] as const,
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

/**
 * The 3D mode's sculpt grid per device. A first-run benchmark marches a small test surface
 * and picks the finest torso resolution whose opening build fits the budget; the save
 * keeps the answer in `settings.sculptRes`. Parts scale by the same share of their own grid.
 */
export const SCULPT_RES = {
  /** The resolution species are authored at (the torso default in `species.ts`). */
  authored: 104,
  /** The choices, finest first: desktop, mid, phone, slow phone. */
  steps: [104, 80, 64, 48] as const,
  /** Grid of the benchmark surface (the Nubbin's torso). */
  benchRes: 24,
  /**
   * How marching time grows with the grid: the narrow band and the per-vertex bake make
   * it nearer the square than the cube (2.84x from 64 to 104, measured 2026-10-16).
   */
  exponent: 2.2,
  /**
   * Marching work of an opening Grove (the Keeper and 8 Nubbins in 7 looks, 54 surfaces)
   * in benchmark surfaces at the benchmark's grid. The benchmark runs at boot, when it
   * reads about 3.5x slower than on an idle page (20 ms against 6 on Maor's PC); the
   * opening marched in 540 ms on 4 workers at grid 63 there, 2026-10-16.
   */
  openingWork: 15,
  /**
   * Marching time the opening may take, in ms. It runs in workers while the page builds
   * the scene and compiles its shaders (2.4 s on Maor's PC, several times that on a
   * phone), so time inside this is hidden; the cache makes it a one-off.
   */
  budgetMs: 3000,
} as const;

/** The full-3D Grove: its Lakitu camera, the heightfield and the dressing built from GROVE. */
export const GROVE3D = {
  /**
   * Entering a place whose programs are still linking keeps the last frame up; after
   * `delayMs` it dims over `ms` (and brightens back as fast once the place draws).
   */
  placeFade: { delayMs: 60, ms: 180 },
  /** The tap ring grows to a thing's reach, up to this many times a Nubbin's ring. */
  highlightMaxScale: 3,
  /** The tap halo round a still prop: how far it stands out from the surface, world units. */
  haloRim: 0.1,
  /** The lamp the Keeper carries in the Hollow Below (the torches burn at about 16). */
  keeperLamp: 5,
  /** Downward tilt of the camera behind the Keeper, in degrees (gentler than the pixel 35°). */
  pitchDeg: 24,
  /** Orbit distance for each zoom level (index 0 is the farthest, as in CAMERA). */
  distance: [15, 8.5] as const,
  /** Where the camera looks: this far above the Keeper's feet. */
  lookHeight: 1.1,
  fovDeg: 42,
  /** In portrait the vertical field of view widens until the view is at least this wide,
   * in degrees; at 42 alone a phone held upright sees about 20 degrees across. */
  minHFovDeg: 34,
  near: 0.3,
  far: 260,
  /** Depth of the pond and the stream channel below the meadow. */
  pondDepth: 0.9,
  riverDepth: 0.5,
  /** Beyond this radius the field rises into a rim so the edge reads as a bowl. */
  rimStart: 42,
  rimHeight: 9,
  /** Instanced grass tufts (12 000 on the sample stage; fewer here for the bigger field). */
  grassCount: 9000,
  /** Grass grows this far from the centre on each axis (the heart, where play happens). */
  grassHalf: 30,
  /** Figure heights in world units: the species format sculpts at about 3 to 4 units. */
  keeperHeight: 1.6,
  nubbinHeight: 1.0,
  adultHeight: 1.2,
  /** Sun elevation at local noon, degrees, and the hours the sun rises and sets. */
  noonElevationDeg: 62,
  sunriseHour: 6,
  sunsetHour: 18.5,
  /** Bloom is on only while the sun is this low (golden hour), in degrees. */
  bloomBelowDeg: 16,
  /** Camera shake in world units: a Nubbin landing, a tree shaken (pixel: 0.18 / 0.08). */
  shake: { landed: 0.12, tree: 0.05 },
  /** Height above a fruit tree's foot where its leaves burst from when shaken. */
  treeCrown: 3.0,
  /**
   * A crown in the camera's way (see crowns.ts): how much of it stays with the camera
   * inside it or with it between the camera and the Keeper, how fast it eases (per
   * second), and below which its branches and fruit hide.
   */
  crownFade: { inside: 0, blocked: 0.2, rate: 10, innerBelow: 0.5 },
  /**
   * Most a walk cycle is sped up to keep feet planted at the sim's speed (see gait.ts).
   * Walking needs 2.45 for the Keeper and 1.8 for a child; 4 keeps Fennel (3.9) planted.
   */
  maxCadence: 4,
  /** How deep a wading Keeper (Swim perk) sinks below the water surface, in world units. */
  wadeDepth: 0.38,
  /** Frame grades for the recoloured places (pixel: cream and lavender on lit materials). */
  groveTint: { sun: '#fff0d0', moon: '#d8c8ff', corvin: '#c4c8cc' },
  /** The dirt paths as polylines across the field (the pixel ground paints its own). */
  paths: [
    [
      [0, 4],
      [-3, 9],
      [-6.5, 11.5],
    ],
    [
      [0, 4],
      [4, 1],
      [9.6, -4.2],
      [14, -5],
    ],
    [
      [0, 4],
      [-1, -4],
      [-2.5, -15.5],
    ],
    [
      [0, 4],
      [3, 8],
    ],
  ] as ReadonlyArray<ReadonlyArray<readonly [number, number]>>,
  pathWidth: 1.1,
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
  worldHalf: 46,
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
  /** How long a petted Nubbin leans into the hand before going back to its day. */
  petMs: 1800,
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
  /** Running multiplies the walking speed. */
  runMultiplier: 1.8,
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
  /**
   * 96 units a side (2026-10-13, four times the earlier area). The old 48-unit heart
   * keeps every position; the outer ring is wilder: the north wood, the east ridge, the
   * south marsh along the stream, the west meadow.
   */
  size: 96,
  /** Centre and radius of the pond. */
  pond: { x: 7, z: 6, r: 5 },
  trees: [
    { x: -8, z: -5 },
    { x: 6, z: -12 },
    { x: -12, z: 7 },
    { x: 16, z: 12 },
    // The outer ring's fruit trees: the west meadow and the far orchard corner.
    { x: -32, z: 20 },
    { x: 28, z: 30 },
  ] as const,
  hills: [
    { x: -18, z: 13, r: 6, h: 2.6 },
    { x: 16, z: -16, r: 7, h: 3.4 },
    { x: -18, z: -15, r: 5, h: 2 },
    { x: 20, z: 4, r: 4, h: 1.5 },
    // The outer ring.
    { x: 36, z: -34, r: 8, h: 3.8 },
    { x: -36, z: 34, r: 7, h: 3 },
    { x: 38, z: 30, r: 5, h: 2 },
    { x: -38, z: -34, r: 6, h: 2.4 },
    { x: 2, z: -40, r: 5, h: 2.2 },
    { x: -34, z: -4, r: 4, h: 1.6 },
  ] as const,
  waterfall: { x: 16, z: -16, height: 3.4, width: 1.6 },
  /** Where the buildings stand and how wide their footprint is (walkers are kept out). */
  buildings: {
    cottage: { x: -7, z: 14, r: 2.8 },
    school: { x: -3, z: -18, r: 2.4 },
    dojo: { x: 18, z: -4, r: 3.4 },
    well: { x: 3, z: 10, r: 0.9 },
    windmill: { x: -16, z: -5, r: 2.0 },
  },
  /** The big rocks, tappable for stone and solid underfoot. */
  rocks: [
    { x: -7, z: 9, r: 0.7 },
    { x: 6, z: -9, r: 0.6 },
    { x: 13, z: -5, r: 0.5 },
    { x: -13, z: 12, r: 0.6 },
    // The outer ring.
    { x: -28, z: 8, r: 0.7 },
    { x: 30, z: 12, r: 0.6 },
    { x: -6, z: 34, r: 0.6 },
    { x: 20, z: -32, r: 0.7 },
    { x: -34, z: -20, r: 0.6 },
    { x: 36, z: 40, r: 0.5 },
    { x: -22, z: -40, r: 0.6 },
  ],
  /** The stream: from the waterfall pool into the pond, then out to the south edge. */
  river: {
    width: 2.2,
    inflow: [
      { x: 12.4, z: -10.4 },
      { x: 10.5, z: -6.5 },
      { x: 9.2, z: -3 },
      { x: 7.6, z: 0.4 },
    ],
    outflow: [
      { x: 8.2, z: 11.6 },
      { x: 9.5, z: 16 },
      { x: 11, z: 20 },
      { x: 12, z: 25 },
      // On through the south marsh to the far edge.
      { x: 12.6, z: 31 },
      { x: 11.2, z: 38 },
      { x: 12.5, z: 44 },
      { x: 12, z: 49 },
    ],
  },
  /** Where the path crosses the inflow. */
  bridge: { x: 9.6, z: -4.2 },
  keeperStart: { x: 0, z: 4 },
  eggSpots: [
    { x: -2, z: 1 },
    { x: 2, z: 0 },
  ] as const,
} as const;

/** Trust: how safe a Nubbin feels with its Keeper. Low trust turns it Shadow. */
export const TRUST = {
  start: 50,
  min: 0,
  max: 100,
  pet: 3,
  feed: 4,
  play: 2,
  throw: -8,
  drop: -3,
  /** Per minute while starving. */
  starvingPerMinute: -1.5,
  /** Per minute while crying unattended. */
  cryingPerMinute: -0.5,
  /** Slow natural settling toward the middle, per minute, while content. */
  settlePerMinute: 0.05,
  /** Below this a Nubbin turns Shadow: jaded, wary, keeps its distance. */
  shadowBelow: 15,
  /** A Shadow Nubbin that is brought back above this bonds: it loves again. */
  bondAbove: 70,
  /** Shadow Nubbins gain trust more slowly until they bond. */
  shadowGainScale: 0.6,
  /** Below this a Nubbin keeps away from the Keeper. */
  wary: 30,
  /** Keep-away radius. */
  avoidRadius: 4,
  /** A Nubbin below `runawayBelow` for this long leaves the Grove. */
  runawayBelow: 5,
  runawayAfterMs: 10 * 60_000,
  /** A stray returns to the Grove edge after this long, hoping to be found. */
  strayReturnMs: 20 * 60_000,
} as const;

/** Weather rolls on the sim clock; rain and snow change behaviour a little. */
export const WEATHER = {
  /** Clear spells last this long (ms), then a roll. */
  clearMs: [8 * 60_000, 20 * 60_000] as const,
  rainMs: [3 * 60_000, 8 * 60_000] as const,
  snowMs: [4 * 60_000, 10 * 60_000] as const,
  rainChance: 0.35,
  /** Winter rolls snow instead of rain. */
  /** Swim lean per second while out in the rain. */
  rainSwimLeanPerSecond: 0.01,
  /** Happiness per minute for Nubbins sheltering under a tree in the rain (they like it). */
  shelterHappinessPerMinute: 0.5,
} as const;

export const BREEDING = {
  heartFruit: 80,
  /** How long a fed adult looks for a partner. */
  courtMs: 90_000,
  /** Partner must be within this distance. */
  reach: 2.5,
  minAffection: 30,
  /** Chance a better grade is passed on per stat; else the average. */
  betterGradeChance: 0.5,
  shinyIfParentShiny: 0.35,
  shinyBase: 0.03,
} as const;

export const LESSONS = {
  price: 25,
  durationMs: 45_000,
  maxLevel: 3,
  /** Chance per idle choice that a schooled Nubbin performs. */
  performChance: 0.08,
  performMs: 4000,
  happiness: 6,
} as const;

export const SERVICES = {
  doctor: 15,
  fortune: 20,
} as const;

export const KARATE = {
  tiers: 3,
  /** Rounds per bout and base HP. */
  hp: 100,
  /** Stat weights. */
  powerPerLevel: 0.9,
  staminaPerLevel: 1.2,
  dodgePerRunLevel: 0.004,
  prize: [25, 60, 120] as const,
  rivalLevel: [12, 30, 60] as const,
  /** A tap in the sweet spot of the timing bar lands a strong strike. */
  sweetSpot: 0.18,
} as const;

export const DECOR = {
  prices: {
    fence: 10,
    flowerbed: 15,
    bench: 25,
    statue: 60,
    pathTile: 5,
    lanternSmall: 20,
    nursery: 400,
    bathhouse: 450,
    workshop: 250,
    rockPile: 12,
    thicket: 18,
  } as const,
  maxPlaced: 60,
} as const;

export const VISITS = {
  /** Each Keeper brings one story gift, once, ever; the neighbour host gives the same. */
  giftShells: 30,
  /** Saturday is lantern night. */
  lanternNightDay: 6,
} as const;

/** Orchards and crops. */
export const PLANTS = {
  /** Sim time per growth stage. */
  treeStageMs: 20 * 60_000,
  cropStageMs: 6 * 60_000,
  /** Grown trees drop a fruit this often. */
  treeFruitMs: 6 * 60_000,
  /** Water lost per minute without rain; growth stops when dry. */
  dryPerMinute: 0.02,
  rainRefill: true,
  /** Stat fruit adds this many points; Sun/Moon fruit nudge alignment this much. */
  fruitPoints: 40,
  fruitAlignment: 0.08,
  cropHarvest: 2,
  maxPlants: 24,
} as const;

export const TOYS = {
  prices: { ball: 30, radio: 60, blocks: 45, mirror: 40, tv: 90 } as const,
  maxPlaced: 6,
} as const;

/** Workshop recipes: what each costs in gathered materials and Shells. */
export const RECIPES = {
  fence: { wood: 2, stone: 0, reeds: 0, shells: 0 },
  bench: { wood: 4, stone: 0, reeds: 0, shells: 0 },
  pathTile: { wood: 0, stone: 1, reeds: 0, shells: 0 },
  statue: { wood: 0, stone: 6, reeds: 0, shells: 10 },
  lanternSmall: { wood: 2, stone: 1, reeds: 0, shells: 5 },
  flowerbed: { wood: 1, stone: 0, reeds: 2, shells: 0 },
  rockPile: { wood: 0, stone: 3, reeds: 0, shells: 0 },
  thicket: { wood: 3, stone: 0, reeds: 1, shells: 0 },
  nursery: { wood: 8, stone: 4, reeds: 2, shells: 80 },
  bathhouse: { wood: 6, stone: 8, reeds: 2, shells: 100 },
  workshop: { wood: 10, stone: 6, reeds: 0, shells: 60 },
  ball: { wood: 0, stone: 0, reeds: 2, shells: 0 },
  dye: { wood: 0, stone: 0, reeds: 1, shells: 5 },
} as const;

export const GATHER = {
  /** Chance a shaken tree also drops wood, and how much a stone or reed tap gives. */
  woodChance: 0.45,
  stonePerTap: 1,
  reedsPerTap: 1,
  tapCooldownMs: 8_000,
} as const;

/** Habitats: patches that draw wild creatures in. */
export const HABITAT = {
  /** Decor pieces that make each patch, and how many count as a full patch. */
  need: 3,
  /** Chance per sim minute of a visit when a patch is complete. */
  visitChancePerMinute: 0.15,
  visitMs: 4 * 60_000,
  /** Visits (or one feeding) before the creature settles. */
  settleVisits: 3,
  maxWild: 2,
} as const;

export const QUESTS = {
  perDay: 3,
  baseShells: 20,
} as const;

export const ACHIEVEMENTS = {
  shells: 25,
} as const;

/** Festival multipliers by season. */
export const SEASONS = {
  spring: { eggPrice: 0.5, rareEgg: 2 },
  summer: { racePrize: 2 },
  autumn: { fruitInterval: 0.5 },
  winter: { lanternsAllDay: true },
} as const;

export const PERKS = {
  /** A bonded or well-loved adult of each type lends its Keeper a move. */
  minAffection: 70,
  runBonus: 2.4,
  wadeSpeed: 0.55,
  powerShakeFruit: 2,
  flyGlideSpeed: 1.3,
} as const;

export const PLOTS = {
  price: 300,
  rosterPerPlot: 4,
  max: 2,
} as const;

export const FRIENDS = {
  /** Friendship per minute spent within reach of another Nubbin. */
  perMinute: 2,
  reach: 2.2,
  buddyAt: 30,
  chatChance: 0.06,
  chatMs: 5000,
} as const;

export const SLED = {
  /** Chance per idle choice to go sledding in the snow. */
  chance: 0.12,
  durationMs: 7000,
} as const;

export const LANDMARKS = [
  { id: 'bridge', x: 9.6, z: -4.2 },
  { id: 'well', x: 3, z: 10 },
  { id: 'falls', x: 12.4, z: -10.4 },
  { id: 'cottage', x: -7, z: 12 },
  { id: 'dojo', x: 18, z: -2 },
  { id: 'school', x: -3, z: -16 },
  { id: 'oldTree', x: -8, z: -3 },
  { id: 'southBend', x: 11, z: 20 },
  { id: 'westHill', x: -12, z: 13 },
  // The outer ring.
  { id: 'northWood', x: -28, z: -30 },
  { id: 'eastRidge', x: 30, z: -24 },
  { id: 'southMarsh', x: 6, z: 38 },
  { id: 'westMeadow', x: -32, z: 16 },
  { id: 'farOrchard', x: 26, z: 34 },
] as const;

// ---------------------------------------------------------------- the Digimon-inspired ten

/** The village square: recruits raise prosperity; thresholds open the square's services. */
export const TOWN = {
  perRecruit: 12,
  max: 120,
  unlocks: { stall: 20, gym: 40, attendant: 60, fortune: 80, festival: 100 } as const,
  stallDiscount: 0.9,
  festivalPrize: 1.15,
} as const;

/** Care slips: a need ignored this long logs one; evolution and lifespan read them. */
export const SLIPS = {
  afterMs: 120_000,
  cooldownMs: 300_000,
  keep: 8,
  /** Each slip trims the adult span by this fraction, down to the floor. */
  lifespanPerSlip: 0.05,
  lifespanFloor: 0.75,
  /** Slips at evolution that mark the Grumpy / Sleepy looks. */
  moodyAt: 3,
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

/** Partners and the merged form. */
export const PARTNERS = {
  followDistance: 4,
  bondPerMinute: 1,
  mergeMs: 60_000,
  minAffection: 60,
  twinePrice: 120,
  mergeLevelBonus: 2,
} as const;

/** Curfew by the real clock. */
export const CURFEW = {
  nightFrom: 22,
  nightTo: 6,
  energyDrainMultiplier: 1.6,
  napChance: 0.5,
} as const;

/** Rebirth memories and the heirloom look. */
export const INHERITANCE = {
  heirloomGenerations: 3,
} as const;

/** The Keeper skill tree. */
export const SKILLS = {
  pointsPerAchievement: 1,
  pointsPerQuest: 1,
} as const;

/** Scanning wild and neighbour species toward an egg. */
export const SCANS = {
  perArrival: 25,
  perMinutePresent: 2,
  perNeighbourVisit: 10,
  full: 100,
} as const;

/** Guard teams: weekly missions and a seeded local board. */
export const TEAMS = {
  pointsPerMission: 10,
  rankEvery: 30,
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

/** The Hollow Below: seeded cave floors under the Grove. */
export const DUNGEON = {
  /** World units per grid cell. */
  cell: 1.5,
  baseCols: 34,
  baseRows: 24,
  growCols: 4,
  growRows: 2,
  maxCols: 54,
  maxRows: 36,
  maxDepth: 20,
  /** Loot spots per floor at depth 1, plus this much again per extra floor. */
  lootBase: 9,
  lootPerDepth: 1.5,
  lootMax: 20,
  straysBase: 2,
  straysPerDepth: 0.6,
  straysMax: 6,
  straySpeed: 1.5,
  strayFleeSpeed: 3.2,
  /** Shells a stray snatches when it bumps the Keeper. */
  straySnatch: 5,
  strayCooldownMs: 6000,
  wildPerFloor: 1,
  pickupRadius: 0.8,
  useRadius: 1.4,
  scanRadius: 2.2,
  chestShells: [30, 60] as const,
  chestEggChance: 0.25,
  partySize: 2,
  followDistance: 1.7,
  nubbinSpeed: 2.8,
  fetchRadius: 4,
  /** Floor light at depth 1 and how much each floor takes away. */
  lightBase: 0.9,
  lightPerDepth: 0.06,
  lightMin: 0.3,
  torchReach: 6,
  crystalReach: 4,
  lampReach: 4.5,
} as const;

/**
 * The campaign's story clock (sim/campaign.ts, sim/side-stories.ts). The sim has no
 * time of day of its own, so a story day is a fixed span of sim time: dawn at its start,
 * dusk at `duskAt` of the way through. "The next dusk" is the next such point.
 */
export const STORY = {
  dayMs: 120_000,
  duskAt: 0.75,
  /** Story-day fractions: when morning ends, and the two night marks the waits use. */
  morningEndsAt: 0.5,
  midnightAt: 0.9,
  lateNightAt: 0.95,
  /** A "sit with them a while" step takes this long on the story clock. */
  shortWaitMs: 20_000,
  /** The nights between chapter 9's close and the Long Night (S23's three visitors). */
  nightsBeforeLongNight: 3,
  /** Story days in "a week later": a story day is two minutes, so a week is three. */
  weekDays: 3,
  /** How near a lantern post counts as having walked Moss to it. */
  lanternReach: 2.5,
  /** Chapter 10's vigil: total lit time to reach dawn, and the waves of cold. */
  vigilMs: 90_000,
  /** Fractions of the vigil at which a wave blows a lantern out (stream, then long grass). */
  vigilWaves: [0.3, 0.65],
  vigilLullAt: 0.5,
  /** Which lantern post each wave blows out (assumed mapping; the scene only names them). */
  vigilWaveLanterns: ['lantern-2', 'lantern-4'],
  /** Where Wisp settles as a stray: under the cottage step (canon 16). */
  wispHome: { x: -7, z: 10.4 },
  /** Ember's friendship for finding Ash's name (S6). */
  s6Friendship: 5,
  /** Shells Corvin asks in S27's buy-back, the same as c9-open's bargain. */
  buyBackShells: 200,
} as const;

import type { StoryPropDef } from '../sim/story-props';

/** Fun quests Q1-Q65 (sim/fun-quests.ts): how they offer themselves. */
export const FUN = {
  /** One at a time, and never in a chapter's first story day (the campaign speaks first). */
  maxOpen: 1,
  offerAfterMs: 120_000,
  /** Market days, as JavaScript weekdays (Wednesday and Saturday). */
  marketDays: [3, 6],
  /** "Midday" is this much of a story day either side of noon. */
  middayHalfWidth: 0.08,
  /** A Nubbin counts as tired below this energy. */
  tiredBelow: 0.3,
  /** "Some Swim" or "a Fly-leaning Nubbin": a stat at this level or more. */
  someStatLevel: 5,
} as const;

/** The Learning Grove's language courses (sim/lang.ts, CV3). */
export const LANG = {
  /** A course's next quest waits this long after the last one ends, then for a morning. */
  nextQuestAfterMs: 120_000,
  /** A word counts as learned once used, or once heard this many times. */
  learnedAfterHeard: 3,
  /** Nubbins this close to the Keeper react to a learned word, at most this many. */
  reactRadius: 9,
  reactMax: 3,
  /** Tracing (ui/trace.ts), on a 0-100 board: how far from a stroke still counts. */
  traceRadius: 14,
  /** Share of a stroke's points the finger must pass near, and of a letter's ink covered. */
  strokeCover: 0.7,
  inkCover: 0.5,
} as const;

/** The four lantern posts, lantern-1..4: pond, stream, wall and long grass. */
export const LANTERN_POSTS = [
  { id: 'lantern-1', x: -4, z: 4 },
  { id: 'lantern-2', x: 4, z: -3 },
  { id: 'lantern-3', x: 9, z: 7 },
  { id: 'lantern-4', x: -8, z: -6 },
] as const;

/**
 * The things the side stories point at (sim/story-props.ts says when each stands):
 * where it stands, how it is drawn, and which step checks a tap on it meets.
 */
export const STORY_PROPS: readonly StoryPropDef[] = [
  { id: 'old-trowel', kind: 'trowel', x: -6.2, z: 10.6, meets: ['old-trowel'] },
  { id: 'hatch-register', kind: 'register', x: -7.9, z: 10.7, meets: ['hatch-register'] },
  { id: 'hazels-lantern', kind: 'handLantern', x: -5.4, z: 11.2, meets: ['s24-hazels-lantern'] },
  { id: 'sunrise-shelf', kind: 'shelf', x: -8.6, z: 11.4, meets: ['sunrise-shelf'] },
  { id: 'flat-stone', kind: 'flatStone', x: -11, z: 12.2, meets: ['s24-hill'] },
  { id: 'hazels-bench', kind: 'oldBench', x: -2.4, z: 5.6, meets: ['hazel-bench'] },
  { id: 'corvins-chair', kind: 'chair', x: -1, z: 6.3, meets: [] },
  { id: 'lantern-shed', kind: 'shed', x: 6.4, z: -1.2, meets: ['s27-shed-window', 's7-minder'] },
  { id: 'old-barn', kind: 'barn', x: 15, z: 12, meets: ['s18-centre-case'] },
  {
    id: 'walled-garden-door',
    kind: 'gardenDoor',
    x: 10.6,
    z: 5.4,
    meets: ['s26-door', 's26-garden'],
  },
  { id: 'hush-bench', kind: 'oldBench', x: 12.2, z: 4.4, meets: ['s26-hush-bench', 'hush-bench'] },
];
