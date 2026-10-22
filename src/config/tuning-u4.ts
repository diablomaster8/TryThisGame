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
    /** How far (world x) Logged In's scoreboard stands from the message board, so neither hides the other. */
    scoreDx: -2.7,
    /** World size of the face, its bottom edge and how far it stands off the board (pixel, 3D). */
    pixel: { w: 2.75, h: 2, bottom: 0.75, forward: 0.06 },
    three: { w: 1.38, h: 0.86, bottom: 0.67, forward: 0.052 },
    /** The guard house notices: size, bottom edge, how far out from the wall and to the right of the door. */
    notice: { w: 0.9, h: 0.7, bottom: 0.9, out: 1.34, side: 1.2, pixelOut: 0.05, pixelBottom: 0.9 },
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
    /** Which stage set (config/stage-sets.ts) each separate campaign stands in. */
    setOf: {
      hundred: 'fold',
      logged: 'logged',
      beetle: 'beetle',
      dawn: 'dawndusk',
      dusk: 'dawndusk',
    },
    /** The story marks (config/stage-marks.ts, Grove set) each set shows on the Map. */
    marks: {
      fold: ['fold-well', 'fold-door-1'],
      logged: ['board'],
      beetle: ['guardhouse-bench', 'banner-1'],
      dawndusk: ['green-centre', 'house-1-door'],
    },
  },
} as const;
