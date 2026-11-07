/** R18 d2 (R0140, WORLD-74): the two-Keeper camera. */
export const COOP_CAMERA = {
  /**
   * Both Keepers are framed together while their spread, on screen, is at most this share of the
   * view's width and height (the rest is margin for the HUD, the sheet and the Keepers' size).
   */
  enterFit: 0.6,
  /** Once framed, they stay framed until the spread passes this share (stops flicker at the edge). */
  exitFit: 0.7,
  /** The glide to a new subject (midpoint, or the other Keeper) uses this follow rate, 1/s ... */
  switchRate: 3,
  /** ... for this long after the subject changes, ms. */
  switchMs: 900,
} as const;
