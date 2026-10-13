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
  worldHalf: 22,
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
  size: 48,
  /** Centre and radius of the pond. */
  pond: { x: 7, z: 6, r: 5 },
  trees: [
    { x: -8, z: -5 },
    { x: 6, z: -12 },
    { x: -15, z: 9 },
    { x: 16, z: 12 },
  ] as const,
  hills: [
    { x: -18, z: 13, r: 6, h: 2.6 },
    { x: 16, z: -16, r: 7, h: 3.4 },
    { x: -18, z: -15, r: 5, h: 2 },
    { x: 20, z: 4, r: 4, h: 1.5 },
  ] as const,
  waterfall: { x: 16, z: -16, height: 3.4, width: 1.6 },
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
  /** A visiting Keeper brings a gift once per real day. */
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
] as const;
