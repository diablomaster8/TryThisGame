/**
 * Tunables for campaign-graphics package d (props and items; re-exported from tuning.ts).
 * Every one of its numbers lives here, not in tuning.ts.
 */
export const DRESS_D = {
  glint: {
    /** How far an item bobs up and down (world units); 0 under reduced motion. */
    bob: 0.06,
    /** Bob and twinkle speed, radians per second. */
    speed: 2.2,
    /** The 3D star card's size and its height above the item's base. */
    size: 0.5,
    lift: 0.42,
    /** The twinkle's size swing (a fraction); 0 under reduced motion. */
    twinkle: 0.18,
    /** The most glints drawn at once. */
    max: 12,
  },
  /** The keepsake shelf stands by the porch; offsets from the `porch` mark. */
  shelf: { dx: 1.7, dz: -0.2, w: 1.5, rowGap: 0.34, colGap: 0.34 },
  /** The ch1 vignette, offsets from the `step` mark (kettle, cup) and the `window` mark. */
  vignette: {
    kettle: { dx: -0.55, dz: 0.05 },
    cup: { dx: -0.2, dz: 0.12 },
    shelf: { dx: 0, dz: -0.4 },
  },
  /** The step's second prop (pie, teacup), offset from the `step` mark. */
  stepDish: { dx: 0.55, dz: 0.1 },
  /** The pixel cottage's painted front stands this far behind the 3D one (z). */
  pixelCottageDz: -1.3,
  /** The porch lantern, offset from the `porch` mark. */
  porchLight: { dx: 0.6, dz: -0.8, darkness: 0.3 },
  /** The signpost sits beside the gate mark. */
  signpost: { dx: 0.0, dz: 0.0 },
  /** The message board shows at most this many cards. */
  boardCards: 6,
  /** Hazel's bench on the hill, offset from the `hill-top` mark. */
  hillBench: { dx: 1.3, dz: 1.0 },
  /** Corvin's chair, offset from the `corvin-door` mark. */
  chair: { dx: 1.5, dz: 0.6 },
} as const;
