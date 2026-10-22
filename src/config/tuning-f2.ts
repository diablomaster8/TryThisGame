/**
 * Tunables for campaign-graphics-2 wave 0 (re-exported from tuning.ts): the shared staging
 * the packages build on (H4 fit, H5 push-in, the pixel building fade).
 */
export const STAGE2 = {
  /** Pixel: the building fade's dither circle, as a share of the view's height. */
  fadeRadius: 0.2,
  /** H5: seconds the push-in after the first line eases over (a cut under reduced motion). */
  pushS: 0.8,
  /** H4, 3D: the farthest a fitted shot stands back, and the margin round the focus (share). */
  fitMaxDistance: 70,
  fitMargin: 0.06,
  /** H4: the height the fit keeps in frame over each focus point: a house's roof (world units). */
  figureH: 5,
  /** H4: the reach kept in frame round each focus point: a house's walls (world units). */
  fitRadius: 2.4,
  /** H7: a two-shot's camera stands off the line between the pair by this much (radians). */
  twoSideRad: Math.PI / 2,
  /** H7: how far the pair turn from each other toward that side camera (radians). */
  faceTurnRad: 0.6,
} as const;
