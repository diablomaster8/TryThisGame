/**
 * Lane D round 12, helper d1: the region engine's numbers added this round (WORLD-09 Grove
 * chunks, WORLD-25/36 region moves, WORLD-33 lane, WORLD-69 rides). Imported directly where used.
 */

/** WORLD-09: the Grove's own props and grass, cut into the same 16 u chunks as the regions. */
export const GROVE_CHUNKS = {
  /** Pixel: how far past a chunk's edge its tallest sprite may reach (a tree's half width). */
  pxReach: 4.5,
  /** Pixel: the tallest Grove sprite, world units (the oak). */
  pxHeight: 11,
  /** 3D: the grass chunk boxes' height range, world units (hills reach about 3.5). */
  grassLow: -0.5,
  grassHigh: 4.5,
  /** 3D: margin round a grass chunk's box when testing it against the frustum. */
  grassMargin: 1.5,
} as const;

/** WORLD-39: the real Grove drawn back across a seamless border from inside a neighbour. */
export const GROVE_BACK = {
  /** 3D: how deep into the Grove, from its south and east sides, its terrain is drawn. */
  depth: 40,
} as const;

/** WORLD-25/36: the Keeper's moves inside a drawn region (`sim/region-moves.ts`). */
export const REGION_MOVES = {
  /** Half the width of a built jump route's air lane, world units. */
  laneHalf: 1.6,
  /** A ledge counts as under the feet this far past its edge (the body's reach). */
  ledgeGrace: 0.3,
  /** An updraft's lift (ms) and a glide line's speed (units a second). */
  liftMs: 1200,
  glideSpeed: 8,
  /** A glide line rides at least this high over the ground under it. */
  glideClear: 0.6,
  /** How near a flying zone's spot the Keeper must step to set it off. */
  reach: 1.1,
} as const;

/** WORLD-69: a ride's side-on scene (`render/vignette.ts`). */
export const RIDE_SCENE = {
  /** How long the scene plays (ms). */
  ms: 6000,
  /** Under reduced motion, how long the one still frame holds (ms). */
  stillMs: 1500,
} as const;
