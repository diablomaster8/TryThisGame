/**
 * Tunables for campaign-graphics-2 package x (re-exported from tuning.ts): the 3D lychgate
 * (C9), the occluder's ground skip, round window and building hiding (H10), the pixel building fade over
 * the cast (H12) and the near-camera clear-out (H14). Every number is a default.
 */
export const CG2_X = {
  gate: {
    /** Half the lane between the posts, post size and height, in world units. */
    half: 1.55,
    post: 0.34,
    postHeight: 2.35,
    /** The roof: overhang past the beam's ends, each slope's run and rise. */
    overhang: 0.55,
    run: 0.95,
    rise: 0.6,
    /** Each leaf's height and its foot above the ground. */
    leafHeight: 1.45,
    leafFoot: 0.26,
    /** A leaf's swing at openness 1 (radians); both swing inward, toward the Grove (-z). */
    swing: 1.45,
    /** Fence panels either side (none in The Hundred Days), and a panel's width. */
    panels: 2,
    panel: 1.1,
    colors: {
      timber: '#7a5434',
      dark: '#5b3c25',
      plank: '#c49a68',
      stone: '#a9a39a',
      roof: '#b4553a',
      ridge: '#8a3c28',
    },
    /** Scenes whose subject is the gate besides any staged at `place: 'gate'`. */
    scenes: ['c2-corvin', 'c8-open', 'c11-open', 'c11-gate'] as readonly string[],
  },
  occlude: {
    /** H10: nothing within this height of the subjects' lowest ground is cut (knee height). */
    ground: 0.9,
    /** The round window cut round each subject (world units at the subject's distance). */
    radius: 1.6,
    /**
     * A hidden building's box starts this far up from its walls' foot, so paving and
     * ground pads round it stay (cutting them showed the void under the Grove).
     */
    floor: 0.05,
    /** H14: in a staged scene, anything nearer the camera than this (view depth) is cut. */
    nearCam: 5,
    /** H14: a building whose box comes this near the camera hides outright. */
    nearHide: 7,
    /**
     * A building nearer the camera than every subject hides when it is cut by the frame's
     * bottom edge (foreground clutter) or covers this share of the frame.
     */
    fill: 0.4,
  },
  pixel: {
    /** H12: a subject's feet must sit this far (CSS px) above a sprite's foot to be behind it. */
    behind: 6,
    /** A subject's drawn height (world units) for the cover test: feet, middle and head. */
    height: 1.4,
    /** Fade in and out over this many seconds (a straight swap under reduced motion). */
    ease: 0.25,
  },
} as const;
