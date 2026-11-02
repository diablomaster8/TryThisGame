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
