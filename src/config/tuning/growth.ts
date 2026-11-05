/**
 * Tuning: the growth domain (TECH-36). Moved out of config/tuning.ts, which still re-exports it.
 * Numbers are unchanged; the review-pass letters in the comments are their provenance.
 */

/**
 * Lane F r11 (EVO): the top stage, Chaos-tier for the Chao line and Radiant for the pocket
 * line, checked every step from `LIFECYCLE.thirdEvolutionMs` into adult life until the end.
 * The digital line ends at its Ultimate instead.
 */
export const RADIANT = {
  minLifetimeHappiness: 30,
  minAffection: 60,
  /** At least one stat at this level or more. */
  minStatLevel: 10,
  /** How much bigger a Radiant pocket species stands than its final form. */
  pocketScale: 1.12,
  /** A single-species pocket line's juvenile look for the child hour. */
  juvenileScale: 0.72,
} as const;

/** Lane F r11 (EVO): the Chao Chaos-tier stage in Pixel: wings at least this big. */
export const RADIANT_PX = { wingScale: 1.8 } as const;

/** Lane F r11 (EVO): the top stage's Full 3D finish. */
export const RADIANT3D = {
  /** A Radiant pocket form's glowing rim (the Eternal Sun wears 0.3). */
  rimGlow: 0.35,
  /** A Chaos-tier Nubbin's wings grow by this much, to at least `wingMin` (an Eternal's are 2.2). */
  wingGrow: 1.35,
  wingMin: 1.9,
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
    // R0582 (lane A r11): a shy one wades at the edge, and seldom (x0.5).
    shy: { greet: 0.3, play: 0.8, sit: 1.3, swim: 0.5 },
    mischievous: { greet: 1.0, play: 1.6, sit: 0.5, swim: 1.5 },
    lazy: { greet: 0.8, play: 0.6, sit: 2.2, swim: 0.5 },
    // R0529 (SOUL-11): the second four.
    curious: { greet: 0.9, play: 1.2, sit: 0.6, swim: 1.0 },
    gentle: { greet: 1.4, play: 0.9, sit: 1.1, swim: 0.8 },
    bold: { greet: 1.2, play: 1.5, sit: 0.5, swim: 1.5 },
    dreamy: { greet: 0.8, play: 0.7, sit: 1.8, swim: 0.7 },
  } as const,
  /**
   * R0529: the second four are decided before the first four's fallbacks, each when its own
   * care reaches this many acts and leads the care that would make the others:
   * curious (critters given, things inspected), gentle (hugs, tuck-ins, praise), bold (high
   * fives, games of catch, expeditions), dreamy (minutes sat near an idle Keeper, as acts).
   */
  curiousActs: 6,
  gentleActs: 6,
  /** Of those, at least this many must be praise (hugs alone grow cheerful, R0530). */
  gentlePraises: 2,
  boldActs: 6,
  dreamyActs: 6,
  /** Sim ms of sitting near an idle Keeper that count as one dreamy act, and how near. */
  dreamyActMs: 30_000,
  dreamyRadius: 4,
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

/** Care slips: a need ignored this long logs one; evolution and lifespan read them. */
export const SLIPS = {
  afterMs: 120_000,
  cooldownMs: 300_000,
  /** Awake with energy under this counts toward a sleepy slip (catch-up naps at it). */
  sleepyEnergy: 0.1,
  keep: 8,
  /** Each slip trims the adult span by this fraction, down to the floor. */
  lifespanPerSlip: 0.05,
  lifespanFloor: 0.75,
  /** Slips at evolution that mark the Grumpy / Sleepy looks. */
  moodyAt: 3,
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

/** Rebirth memories and the heirloom look. */
export const INHERITANCE = {
  heirloomGenerations: 3,
} as const;

/** The Keeper skill tree. */
export const SKILLS = {
  pointsPerAchievement: 1,
  pointsPerQuest: 1,
  /** Green Thumb shortens the time between fruit drops to this fraction. */
  greenThumbFruitInterval: 0.9,
} as const;

/** Scanning wild and neighbour species toward an egg. */
export const SCANS = {
  perArrival: 25,
  perMinutePresent: 2,
  perNeighbourVisit: 10,
  full: 100,
} as const;

/** S3's fusion (sim/fusion.ts): what both partners must be sure of before they can agree. */
export const FUSION = {
  minAffection: 80,
  minTrust: 60,
  affectionGain: 10,
} as const;
