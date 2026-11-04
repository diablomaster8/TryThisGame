/**
 * Lane D round 11, helper d7: player-facing text for the regions built on the engine.
 */

/** Walking into a way that is shut (`exitLocked`), by where it leads. */
export const GATE_SHUT_TEXT: Readonly<Record<string, string>> = {
  sunlands: 'The Sun gate is shut. It opens for your first Sun adult.',
  moonlands: 'The Moon gate is shut. It opens for your first Moon adult.',
  ruins: 'The old ruins are for another day.',
  default: "The way's shut. Maybe later.",
};
