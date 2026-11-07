/** The child-profile Friendly Match (R0747): tricks, the fun meter and the learning twist. */
export const FRIENDLY_MATCH = {
  /** The meter is full at this many fun points. */
  funToFill: 60,
  /** The match ends after this many rounds even if the meter is not full. */
  maxRounds: 8,
  /** A trick's base fun, plus its stat level times `perLevel`. */
  baseFun: 4,
  perLevel: 0.2,
  /** A learning twist (sum, rhyme or word) multiplies the trick. A miss is a normal trick. */
  twistMultiplier: 2,
  /** Spread added to the opponent's own trick, so it giggles back a little. */
  opponentFun: 3,
} as const;
