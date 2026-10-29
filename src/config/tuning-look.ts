/** Tunable numbers for the look lane: cosmetics and the eggshell hat. */

export const LOOK_SHOP = {
  /** The shop's hat of the day changes once per this much sim time (a daily refresh). */
  hatDayMs: 86_400_000,
};

export const EGG_FINISH = {
  /** Shop eggs with a rare colour: the chance of a metal, then a glass finish (LOOK-31). */
  metalChance: 0.01,
  glassChance: 0.01,
};

export const EGGSHELL = {
  /** How long a hatchling wears its eggshell in live play before it comes off (LOOK-26). */
  wearMs: 10 * 60_000,
};
