/**
 * Tunables for campaign-graphics-4 package u4 (re-exported from tuning.ts): the keepsake
 * inspector (K12), the dialogue box skins (K20), the readable boards (K29), the chapter
 * thumbnails and ending gallery (K31, K47), the title card silhouettes (K32) and the
 * campaign map (K33). Every number is a default.
 */
export const CG4_U4 = {
  inspect: {
    /** The live 3D view's side, in CSS pixels, and its pixel ratio cap on phones. */
    size: 168,
    pixelRatio: 2,
    /** Radians per CSS pixel of drag, and the idle spin (radians per second; 0 under reduced motion). */
    dragRad: 0.012,
    spinRad: 0.5,
    /** The pixel card's second angle: the sprite squeezed to this share of its width. */
    sideShare: 0.62,
  },
  box: {
    /** The Hundred Days' day tally: one stroke per chapter, a slash through every fifth. */
    tallyMax: 12,
  },
  board: {
    /** The board face texture, in texels, drawn once per scene (160 x 128 = 4x the old 40 x 32 face). */
    w: 160,
    h: 128,
    /** Lines on a request card, and the cards shown. */
    cards: 6,
    /** World size of the face in the pixel view and in 3D. */
    pixel: { w: 1.75, h: 1.4, y: 0.62, forward: 0.06 },
    three: { w: 1.38, h: 0.86, y: 1.1, forward: 0.075 },
    /** The guard house notices: a small pinned pair beside the door (world units). */
    notice: { w: 0.9, h: 0.7, y: 1.05, dx: 0.0, dz: 0.0 },
  },
  thumb: { w: 160, h: 90, quality: 0.8 },
  photoQuality: 0.85,
  gallery: { cols: 2 },
  card: {
    /** The silhouette's height in the 560 x 170 card, its centre, and its alpha. */
    h: 74,
    y: 112,
    alpha: 0.34,
  },
  map: {
    /** A campaign landmark's grid spread: the same 6 x 6 cell layout as the Grove's own. */
    cells: 5,
  },
} as const;
