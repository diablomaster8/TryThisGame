/**
 * Lane D round 9, helper d2: tunables for the tap-path footprints (WORLD-41).
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

