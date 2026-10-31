/** Lane D, round 10 (helper d2): tunables, imported directly where used. */

/** R0472: the long-press info card's size, place beside the finger, and time on screen. */
export const INSPECT_CARD = {
  widthPx: 220,
  /** The card's top sits this far above the finger (it is about 70 px tall). */
  liftPx: 96,
  /** ... or this far below it near the top edge. */
  dropPx: 28,
  showMs: 2600,
} as const;
