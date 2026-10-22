/**
 * Tunables for campaign-graphics package a, "Light and grade" (re-exported from tuning.ts):
 * the readable night (C3), window glow (M8), the Sun and Moon Grove hue shift (M15), the
 * skyline ring (M16) and buildings that thin out in front of a framed speaker (H9).
 */
export const CG_A = {
  /**
   * C3: the night fill. The hemisphere and the sky map carry the unlit ground to about a
   * fifth of full brightness in a blue-violet, not near black; the moon key stays low.
   */
  night: {
    hemi: 6,
    /** The night sky's fill colour, mixed into the daylight's by `hemiMix`. */
    hemiColor: '#aab6ee',
    hemiMix: 0.8,
    env: 3,
    moon: 0.85,
  },
  /**
   * C3: a cool moonlit rim on creatures and Keepers at night, in the toon rim's band. It
   * grows with the daylight's darkness from `from` to `full`.
   */
  nightRim: { strength: 0.8, from: 0.3, full: 0.65 },
  /**
   * C3: the story key. While a scene is staged after dark, one lamp-pool light hangs
   * soft and shadowless over the framed speakers, pulled toward the camera so it lights
   * faces, not crowns.
   */
  storyKey: {
    color: '#ffe2c4',
    intensity: 6,
    distance: 9,
    decay: 1.2,
    lift: 2.6,
    toward: 2.2,
  },
  /** M8: lit window and lantern glass, scaled so it clears the bloom threshold. */
  glassGlow: 1.9,
  /**
   * M15: the Sun and Moon Grove hue shift keeps each pixel's luminance, and this share of
   * it is held back on green ground so the grass stays grass.
   */
  hueGround: 0.7,
  /**
   * H9: a building between the camera and a framed point thins out in a dithered circle
   * round that point. `radius` is in world units at the point's distance, `keep` the
   * share of the wall drawn inside it, `height` the point's height off the ground.
   */
  occlude: { radius: 2, keep: 0.2, height: 0.9, margin: 0.8 },
  /**
   * M16: the skyline ring at the fog's edge, three painted layers of hill and treeline
   * round the Grove's centre. `fog` is how far each layer melts into the fog's colour.
   */
  skyline: {
    radii: [62, 84, 110] as const,
    heights: [14, 22, 34] as const,
    base: -3,
    fog: [0.35, 0.55, 0.72] as const,
    day: '#4f7a4c',
    night: '#343c68',
    /** Lit cottage windows low on the nearest hills at night (count, warm colour, glow). */
    windows: 14,
    windowColor: '#ffbf66',
    windowGlow: 2.6,
  },
} as const;
