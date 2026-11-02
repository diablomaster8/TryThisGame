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
 * R0086 (WORLD-20): Nubbins on the terraced hills. Now and then an idle Nubbin within
 * `near` units of a hill walks up its ramp (`chance` per idle choice, drawn from a hash so
 * no rng is spent), sits on the top for `topMs`, and walks back down. A Fly adult with Fly
 * level `flutterFly` or more flutters up the first cliff instead of walking the first leg.
 */
export const HILL_OUTING = {
  chance: 0.06,
  near: 14,
  topMs: [8000, 16000] as const,
  /** Walking pace on the ramp, as a share of `BEHAVIOR.walkSpeed`. */
  speedK: 0.85,
  flutterFly: 20,
  /** How close to the foot a walk must end for the climb to start. */
  footReach: 1.2,
} as const;
