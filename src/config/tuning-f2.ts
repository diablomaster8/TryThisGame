import { HUSH } from './tuning-e';
import { CG2_W } from './tuning-w';

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
  /** H4, 3D: the same, larger (the 3D houses are bigger and a perspective lens crowds edges). */
  fitRadius3d: 3.6,
  figureH3d: 6.5,
  /** H7: a two-shot's camera stands off the line between the pair by this much (radians). */
  twoSideRad: Math.PI / 2,
  /** H7: how far the pair turn from each other toward that side camera (radians). */
  faceTurnRad: 0.6,
} as const;

/** How a focus mark is kept in frame when it is more than a figure (H4). */
export interface MarkFit {
  /** 3D: the top of what stands there, over the ground, and how far toward the camera (+z). */
  h3d: number;
  dz3d: number;
  /** Pixel: the top of its sprite over the ground. */
  hPx: number;
  /** Its half width (world units). */
  r: number;
  /**
   * K3: a big prop that may be cropped to this share of its width when the people would not
   * fit beside it whole (unset: kept whole until it is dropped by weight).
   */
  keep?: number;
  /**
   * K3: a word that names it in a line (a regex source, case-insensitive). While the line on
   * screen names it, it is that line's subject: kept (at its `keep` share) over the rest.
   */
  cue?: string;
}

/**
 * Focus marks the H4 fit keeps whole: the Hush's colossus (package W's card, raised and
 * stood toward the camera from the mark) is far taller than a figure.
 */
export const MARK_FIT: Readonly<Record<string, MarkFit>> = {
  hush: {
    h3d: CG2_W.hush.y3d + (HUSH.colossus.height * CG2_W.hush.scale3d) / 2,
    dz3d: CG2_W.hush.z3d,
    hPx: CG2_W.hush.pixelY + CG2_W.hush.pixelHeight / 2,
    r: (HUSH.colossus.width * CG2_W.hush.scale3d) / 2,
  },
  /** The pond, kept whole round its centre (GROVE.pond's radius is 5; the shore is enough). */
  'pond-centre': { h3d: 0.5, dz3d: 0, hPx: 0.5, r: 4, keep: 0.6, cue: '\\bpond\\b' },
};
