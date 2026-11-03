/**
 * Lane D round 11, helper 2: camera, viewport and terrain height (R0073, R0126, R0086,
 * R0109, R0125). Imported directly where used.
 */

/**
 * R0073 (WORLD-07): the survey zoom's second slice. The Keeper, Keeper 2 and NPCs are drawn
 * as map tokens too (the Nubbins' `WORLD_SURVEY.tokenScale`), and a tap there finds a
 * Nubbin or a person within `pickRadiusCss` CSS px, so each has a hit area of at least
 * 44 CSS px across even when the token itself is smaller.
 */
export const SURVEY_R11 = {
  pickRadiusCss: 22,
} as const;

/**
 * R0086 (WORLD-20): Nubbins on the terraced hills. While the Keeper is up a hill, an idle
 * Nubbin within `near` units of it walks up its ramp to join (`chance` per idle choice,
 * drawn from a hash so no rng is spent), sits on the top for `topMs`, and walks back down. A Fly adult with Fly
 * level `flutterFly` or more flutters up the first cliff instead of walking the first leg.
 */
export const HILL_OUTING = {
  chance: 0.3,
  near: 14,
  topMs: [8000, 16000] as const,
  /** Walking pace on the ramp, as a share of `BEHAVIOR.walkSpeed`. */
  speedK: 0.85,
  flutterFly: 20,
  /** How close to the foot a walk must end for the climb to start. */
  footReach: 1.2,
} as const;

/**
 * R0109 (WORLD-23): flying zones for a Fly partner (`sim/flight-zones.ts`). An updraft at a
 * cliff's foot lifts the Keeper `liftLevels` terraces in `liftMs`; a glide line from a hill
 * top's lookout carries the Keeper `perLevel` units for every level it drops, at
 * `glideSpeed`, steering only sideways (`steer` units a second, at most `steerMax` off the
 * line; a Learning Grove rides the line). Each zone is a hill (index into `GROVE.hills`) and
 * an angle from its centre (degrees, atan2(dz, dx)); `fly` is the partner's least Fly level.
 */
export const FLIGHT_ZONES = {
  fly: 30,
  liftLevels: 2,
  liftMs: 1200,
  perLevel: 8,
  glideSpeed: 4,
  steer: 1.5,
  steerMax: 4,
  /** How near a zone's spot the Keeper must step to set it off. */
  reach: 0.9,
  /** Leaves swirl at a zone the renderers draw within this many units of the Keeper. */
  showWithin: 24,
  updrafts: [{ hill: 1, angleDeg: 30 }],
  glides: [{ hill: 1, angleDeg: 60 }],
} as const;

/**
 * R0125 (WORLD-59): a region with `canopyCut` (a wood). Pixel: a tree in front of the
 * Keeper's head or feet thins to `pixelAlpha` (the Grove's occluders keep 55 %). Full 3D:
 * the crown see-through hole round the Keeper opens `holeK3d` times wider.
 */
export const CANOPY_CUT = {
  pixelAlpha: 0.4,
  holeK3d: 1.8,
} as const;
