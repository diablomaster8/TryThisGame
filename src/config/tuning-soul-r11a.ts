/**
 * Lane A round 11 (SOUL): the toys that make two Nubbins play together (R0574). Seesaw and
 * sandbox need a partner; the drum is loved by musical Nubbins; the bubble wand is solo.
 */
export const TOY_PAIR = {
  /** Toys that take two players (friendship builds while both are playing on it). */
  pairKinds: ['seesaw', 'sandbox'] as readonly string[],
  /** Friendship points per minute of playing together. */
  friendPerMinute: 8,
  /** Keenness for a pair toy when a Nubbin is already waiting on it, and when none is. */
  partnerBoost: 4,
  aloneWeight: 0.4,
  /** Keenness when two are already on it. */
  fullWeight: 0.05,
  /** A musical Nubbin's keenness for the drum. */
  musicalDrum: 3,
  /** Extra happiness at the end of a play spent together. */
  togetherHappiness: 6,
  /** Slot offset from the toy's centre (units) and how fast a player settles into it. */
  slot: 0.5,
  settle: 0.2,
  /** Seesaw rock period (ms). */
  rockMs: 1200,
} as const;
