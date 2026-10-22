/**
 * Tunables for campaign-graphics-4 wave 0 (re-exported from tuning.ts): the fit weights
 * (K3), the automatic shot / reverse shot (K9) and grave moments (K15).
 */
export const STAGE4 = {
  /** K3: focus weights. When everything can't fit, the lowest go first; the speaker stays. */
  weight: { cast: 1, prop: 0.5, place: 0.3 },
  /** K3: a big prop (a MARK_FIT with `keep`) may be cropped to this share of its width. */
  propKeep: 0.6,
  /**
   * K3, 3D: a fitted shot that would stand back further than this (world units) drops
   * focus points by weight instead: just short of STAGE2.fitMaxDistance, where the
   * distance search gives up and the frame stops holding everything.
   */
  fit3dBudget: 68,
  /** K9: alternating two-speaker exchanges cut to `over` shots (3D) or pan (pixel). */
  reverse: {
    /** The 3D over-the-shoulder: share of the way from the listener to the speaker aimed at. */
    toward: 0.62,
    /** How far round from the pair's line the camera stands (radians, same side each cut). */
    sideRad: 0.5,
    /** Pixel: share of the way from the pair's middle to the speaker the view pans. */
    panToward: 0.3,
  },
  /** K40: the partner's default spot, this far to the Keeper's right (world units). */
  partnerSide: 1.1,
  /** K15: grave moments. */
  grave: {
    /** Auto-advance delay multiplier, where auto-advance exists. */
    delayK: 1.25,
    /** 3D: the slow push in (seconds) and how far in it ends (share of the distance). */
    pushS: 2,
    pushK: 0.8,
    /** Each letterbox bar's height as a share of the view (the N1 postcard bars). */
    bar: 0.09,
  },
} as const;
