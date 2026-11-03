/**
 * Lane A round 11 (SOUL): the second four personalities' quirks (R0529) and the soul items
 * built on them. Behaviour and looks only, never stats.
 */

/**
 * R0529 (SOUL-11): each of the second four has three signature quirks, the first the most
 * likely (its "top" quirk). `pick` is the chance of the first, then the second; the third
 * takes the rest. A quirk that needs something nearby (a sad friend, a fruit) passes to the
 * next one when there is none.
 */
export const QUIRKS_R11 = {
  pick: [0.55, 0.3] as const,
  /** Curious: roams far to something new, peers at it, pokes the nearest item. */
  roamRange: [6, 10] as const,
  roamMs: [5_000, 8_000] as const,
  peerMs: [3_000, 5_000] as const,
  pokeRadius: 8,
  pokeMs: 2_500,
  /** Gentle: pats a sad or hungry friend this near, offers a fruit, tends a tree. */
  patRadius: 8,
  patMs: 2_500,
  /** A pat gives the patted one this much happiness. */
  patHappiness: 2,
  offerMs: 3_000,
  tendMs: [3_000, 5_000] as const,
  /** Bold: leads a march, with friends this near falling in behind; splashes; flexes. */
  leadRange: 6,
  leadMs: [4_000, 6_000] as const,
  leadFollowRadius: 6,
  splashMs: [3_000, 5_000] as const,
  flexMs: 2_000,
  /** Dreamy: gazes at the clouds (or stars), drifts after a butterfly, daydreams. */
  gazeMs: [6_000, 10_000] as const,
  butterflyMs: [5_000, 8_000] as const,
  butterflyRange: 3,
  daydreamMs: [5_000, 8_000] as const,
} as const;

/**
 * R0558 (SOUL-41), the cry half, and R0581 (SOUL-64): crying by personality, the brief cries
 * besides hunger, and friends coming over to comfort.
 */
export const CRY_SOUL = {
  /** A bold one's cry is short (then a stomp); a gentle one walks to the Keeper to cry. */
  boldScale: 0.5,
  gentleScale: 1.4,
  gentleSpeed: 0.6,
  /** How near the Keeper a gentle one stops to cry. */
  keeperGap: 1.3,
  /** A brief cry (a taunt, a snatch, a throw streak). */
  briefMs: 2_500,
  /** A rival's puff makes the softer ones cry briefly (shy, gentle, dreamy) at this chance. */
  tauntChance: 0.6,
  /** This many throws within this long, and the next landing ends in tears. */
  throwStreak: 3,
  throwWindowMs: 2 * 60_000,
  /** A friend this near and this fond comes over: chance per second, gentle ×3, Sun ×2. */
  comfortRadius: 6,
  friendAt: 10,
  comfortPerSecond: 0.5,
  gentleBoost: 3,
  sunBoost: 2,
  comfortMs: 2_000,
} as const;
