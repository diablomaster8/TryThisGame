/**
 * Lane A round 11 (SOUL), helper G3: the tunables for ambient critters Nubbins chase
 * (R0547), jam sessions (R0555), group games, weather play, toy play, the Keeper tag,
 * family bonds and how Nubbins treat visitors. Behaviour and looks only, never stats.
 */

/** R0547 (SOUL-29): the butterflies, fireflies, frog and dragonfly the sim keeps. */
export const AMBIENT = {
  /** Spawn chance per second while below the target count. */
  spawnPerSecond: 0.25,
  /** Cumulative chances of 0, 1, 2 butterflies in a window (3 for the rest). */
  butterflyOdds: [0.1, 0.4, 0.75] as const,
  /** How long one count of butterflies holds before it is drawn again. */
  windowMs: 45_000,
  fireflyMax: 4,
  /** A critter stays this long, then drifts away. */
  lifeMs: [40_000, 90_000] as const,
  /** Spawn this far from the Nubbin (or Keeper) it appears near. */
  spawnNear: [3, 8] as const,
  speed: { butterfly: 0.9, firefly: 0.35, dragonfly: 2.2, frog: 0 } as const,
  /** A chased butterfly flies this much faster than it drifts. */
  fleeBoost: 1.25,
  /** A frog hops every so often, this far. */
  frogHopMs: [2_500, 5_000] as const,
  frogHop: 1.1,
  /** Nubbins within this notice a critter; chance per second to start chasing, per kind of Nubbin. */
  noticeRadius: 8,
  chasePerSecond: 0.05,
  /** Curious, dreamy and cheerful chase this many times as readily. */
  eagerBoost: 3,
  chaseMs: [4_000, 8_000] as const,
  /** Within this the Nubbin can try to catch; chance per second, and a clumsy one trips. */
  catchRadius: 0.9,
  catchPerSecond: 0.45,
  tripMs: 1_600,
  /** The butterfly sits on its head this long. */
  landedMs: 3_000,
  /** Bounds: keep inside the Grove this far from the edge. */
  edge: 6,
} as const;

/** R0555 (SOUL-38): sing along, dance circles and bands. */
export const JAM = {
  /** Others this near who know the music join; chance 0.5 x their play multiplier. */
  joinRadius: 6,
  joinChance: 0.5,
  /** A jam lasts this long once someone starts it (the leader's perform is stretched). */
  ms: [11_000, 16_000] as const,
  /** Where the circle sits: this far from the centre. */
  ringRadius: 1.7,
  /** Three or more is a concert. */
  concertAt: 3,
  concertRadius: 8,
  concertTickMs: 10_000,
  concertHappiness: 1,
  /** A friend nearby who knows the music may start one by itself: chance per second. */
  sparkPerSecond: 0.03,
  /** Music-lovers farther than the join radius but within this drift toward each other: chance per second. */
  gatherRadius: 16,
  gatherPerSecond: 0.03,
  gatherMs: 7_000,
  /** After a jam ends, nobody starts another for this long. */
  cooldownMs: 20_000,
} as const;
