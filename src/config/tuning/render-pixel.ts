/**
 * Tuning: the render-pixel domain (TECH-36). Moved out of config/tuning.ts, which still re-exports it.
 * Numbers are unchanged; the review-pass letters in the comments are their provenance.
 */

export const RENDER = {
  /** Height of the low-res frame in pixels. Width follows the screen aspect ratio. */
  targetHeight: 540,
  /** The low-res target does the heavy lifting, so device pixel ratio is capped at 1. */
  maxPixelRatio: 1,
} as const;

/**
 * Pixel mode's light rig on top of the daylight table. The post pass now encodes sRGB
 * (review C, item 7); the table was tuned on the old linear output, so day light is lifted
 * until painted ground at noon sits near its painted colours, and night is held back so it
 * still reads as night.
 */
export const PIXEL_LIGHT = {
  dayGain: 1.35,
  nightGain: 0.85,
} as const;

/**
 * The pixel story camera (campaign graphics C2, H14): how a staged hour blends in, and how
 * far the frame lifts its subjects over the dialogue box.
 */
export const PIXEL_STAGE = {
  /** A staged hour blends over this long; reduced motion cuts. */
  hourBlendMs: 1000,
  /** Fraction of the view the subjects are lifted by, clear of the dialogue box. */
  boxLift: 0.11,
  /** How fast the camera eases to the scene's centre (per second, exponential). */
  followRate: 4,
} as const;
