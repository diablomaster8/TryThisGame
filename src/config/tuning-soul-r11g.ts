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

/** R0561 (SOUL-44): group games among friends. */
export const GAMES = {
  /** Friend score that counts (buddies are 30). */
  friendAt: 20,
  radius: 6,
  /** Chance per second that a bold or cheerful Nubbin with two friends near starts one. */
  startPerSecond: 0.012,
  maxMembers: 5,
  ms: 30_000,
  hideMs: 40_000,
  cooldownMs: 40_000,
  chaserBoost: 1.4,
  speed: 1.4,
  swapReach: 0.4,
  immuneMs: 1_500,
  squealMs: 900,
  /** Follow-the-leader: three points this far from the start. */
  legRange: [4, 7] as const,
  followGap: 1.2,
  /** Hide and seek: the seeker counts this long with its hands over its eyes. */
  countMs: 6_000,
  foundReach: 1.2,
  hideBehind: 1.1,
} as const;

/** R0587 (SOUL-70): a mischievous or bold Nubbin tags the Keeper. */
export const KEEPER_TAG = {
  affectionAt: 60,
  radius: 10,
  perSecond: 0.012,
  cooldownMs: 10 * 60_000,
  runMs: 15_000,
  catchReach: 1,
  affection: 2,
  gloatMs: 2_500,
  speed: 1.8,
} as const;

/** R0562 (SOUL-45): play that belongs to the weather and the season. */
export const WEATHER_PLAY = {
  /** Chance per second that a free idle Nubbin does the day's thing. */
  perSecond: 0.012,
  lazySun: 3,
  snowballMs: 2_200,
  snowBuildMs: 8_000,
  snowmanMax: 4,
  /** A thrown snowball peaks this high above its 0.5 start (R0562). */
  lobHeight: 1.6,
  /** Snow figures and puddles go this long after the weather that made them ends. */
  meltMs: 25_000,
  puddleMax: 6,
  puddlePerSecond: 0.15,
  puddleSpan: [3, 9] as const,
  stompMs: 3_000,
  sunbatheMs: 9_000,
  leafJumpMs: 2_500,
  sniffMs: 3_000,
  sneezeMs: 1_500,
} as const;

/** R0572, R0565, R0571: kin, visitors and the Keeper's own doings. */
export const KIN = {
  /** Parent-child friend score at hatch. */
  bond: 50,
  followGap: 2,
  followMs: 10 * 60_000,
  comfortRadius: 10,
  copyRadius: 6,
  copyMs: 3_000,
  siblingCompat: 1.3,
} as const;

export const VISITOR = {
  radius: 10,
  perSecond: 0.1,
  reactMs: 3_000,
} as const;

export const KEEPER_ACTS = {
  jumpRadius: 8,
  copycatRadius: 12,
  hopMs: 900,
  lookRadius: 12,
  lookMs: 2_000,
  gluttonRadius: 16,
  runSpeed: 3.2,
  runRadius: 2.5,
  flinchMs: 1_200,
  chaseMs: 3_000,
  greetAffection: 60,
  greetMax: 3,
  greetRadius: 30,
} as const;
