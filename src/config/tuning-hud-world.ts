/**
 * Tunables for the two world-reading HUD pieces (R0082 and R0083): the compass rose under
 * the fps counter, and the corner minimap below the Shells counter.
 */

export const COMPASS = {
  /** Side of the round compass button, CSS px (a tap target, so at least 44). */
  size: 44,
  /** The most ticks shown around the rim at once. */
  maxTicks: 3,
  /** An undiscovered landmark this close (world units) earns a "?" tick. */
  landmarkRangeU: 60,
} as const;

export const MINIMAP = {
  /** Diameter of the round minimap, CSS px. */
  size: 96,
  /** Minimap pixels per world unit: 2 is one pixel per half unit. */
  pxPerUnit: 2,
  /** Redraws per second (a cheap canvas blit each time). */
  redrawHz: 4,
  /** Auto shows the minimap only on screens at least this tall, CSS px. */
  autoMinHeightPx: 700,
  /** Half angle of the Keeper's view cone, radians. */
  coneHalfAngle: 0.6,
  /** Gap below the top bar (the Shells counter's row), CSS px. */
  gapBelowTopbar: 6,
  /** How often the cached ground bitmap checks whether tiles or season changed, ms. */
  repaintCheckMs: 2000,
} as const;
