/**
 * Lane D round 9, helper d2: tunables for the tap-path footprints (WORLD-41) and the
 * Grove's soft border (WORLD-67).
 */

/**
 * WORLD-41: after a tap, soft footprints lie along the Keeper's planned path every
 * `spacing` units (at most `max`, a foot `spread` off the line to each side) and fade over
 * `fadeMs`; under reduced motion they stay still and whole for `fadeMs`, then go. When the
 * walk ends more than `unreachedGap` short of the tap, a small "?" puff rises at the nearest
 * point for `puffMs`.
 */
export const TAP_PRINTS = {
  spacing: 0.8,
  max: 48,
  spread: 0.09,
  /** Print size in world units (width, length). */
  w: 0.2,
  l: 0.32,
  fadeMs: 1200,
  unreachedGap: 1,
  puffMs: 1100,
  /** The puff's size in world units, and how high it rises over its life. */
  puffSize: 0.8,
  /** How high over the ground it starts (over the Keeper's head when it gets there). */
  puffY: 1.3,
  puffRise: 0.5,
} as const;

/**
 * WORLD-67: the Grove's border. Blockers stand just outside the clamp every `step` units
 * (hedge bushes of `bushSize`, set back `bushOut` past the edge; a fallen log across each
 * way that isn't open yet). Walking into the edge says why once per stretch, until the
 * Keeper has gone `rearm` units back in; it counts as pushing within `near` of the edge.
 */
export const BORDER = {
  step: 2.2,
  bushSize: 2.6,
  bushOut: 0.55,
  logOut: 0.5,
  logLen: 4.2,
  /** How far along the edge an exit's gap reaches each side of its centre. */
  exitHalf: 2.2,
  near: 0.3,
  /** A tap walk to the edge stops short of it (arrival reach), so it counts from here. */
  tapNear: 1,
  rearm: 8,
  /** Pixel draws the blockers within this many units of the Keeper (each axis). */
  pxDraw: 34,
} as const;
