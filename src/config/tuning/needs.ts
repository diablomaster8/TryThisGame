/**
 * Tuning: the needs domain (TECH-36). Moved out of config/tuning.ts, which still re-exports it.
 * Numbers are unchanged; the review-pass letters in the comments are their provenance.
 */

const SECOND = 1000;
const MINUTE = 60 * SECOND;

export const EGG = {
  startCount: 2,
  /** Roster cap: eggs plus Nubbins. */
  maxRoster: 8,
  hatchMs: 3 * MINUTE,
  /** Each shake while held takes this much off the hatch timer. */
  shakeBonusMs: 15 * SECOND,
  /** Minimum gap between shakes that count. */
  shakeCooldownMs: 250,
  /** A first hatch starts a little hungry so Feed works at once (TECH-01); a rebirth hatches full. */
  hatchHunger: 0.7,
  hatchEnergy: 1,
  /** Fruit in hand at the start, so the first Feed works without a tree trip (TECH-01). */
  startFruit: 2,
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
  petAffection: 4,
  dropHappiness: -10,
  dropAffection: -3,
  /** One fruit restores this much hunger (0..1). */
  fruitHunger: 0.5,
  fruitHappiness: 3,
  fruitStaminaPoints: 10,
  /**
   * Happiness drifts toward its resting mood by this much per minute when nothing else
   * happens (Maor, 2026-11-02: a Nubbin left alone settles at mild content, not at 0).
   */
  happinessDriftPerMinute: 0.25,
  happinessRest: 20,
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

export const BEHAVIOR = {
  /** World units per second. */
  walkSpeed: 1.4,
  swimSpeed: 0.8,
  arriveRadius: 0.25,
  /** SOUL-01: a toy counts as reached within this distance; it rolls, so the walk re-aims
   * each step. */
  toyReach: 0.7,
  /** A walk to a toy, fruit or ball gives up after this long (or 1.5× the walk time from where it
   * started, if longer) without arriving ... */
  approachTimeoutMs: 6 * SECOND,
  /** ... or when the distance has not dropped by progressMin within progressWindowMs. */
  progressMin: 0.2,
  progressWindowMs: 2 * SECOND,
  /** A toy or fruit given up on is not picked again for this long. */
  skipItemMs: 30 * SECOND,
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
  /** Releases slower than this are a gentle place: no penalty (TECH-02). Between this and
   * minSpeed is a drop, at dropScale of the full drop penalty. */
  placeMaxSpeed: 1.5,
  dropScale: 0.5,
  /** Release velocity is read from this last stretch of the drag, so a pointer held still
   * this long before letting go reads as speed 0. */
  placeStillMs: 120,
  maxSpeed: 12,
  gravity: 24,
  /** Upward speed added to a throw. */
  lift: 5,
  /** Held Nubbins float this high above the ground under the pointer. */
  holdHeight: 1.2,
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
