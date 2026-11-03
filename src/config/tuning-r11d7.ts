/**
 * Lane D round 11, helper d7: the numbers of the regions built on the region engine (the shore,
 * the Sun and Moon lands, the ruins, the ridge). Imported directly where used.
 */

/** WORLD-35: the shore's water. */
export const SHORE_LOOK = {
  /** The high-tide line (region z): the walk grid stops here. */
  highTideZ: 10,
  /** How far the water's edge moves out between high and low tide, units. */
  tideRange: 4,
  /** The surf's slow swell, radians a second (still under reduced motion). */
  swell: 0.9,
} as const;

/** The Grove's edge strip drawn back across a seamless border from inside a neighbour. */
export const GROVE_EDGE = {
  /** How deep into the Grove its pieces are stood along each side it shares (units). */
  depth: 24,
  /** Texels a unit of the stand-in ground (coarser than a region's: only its edges show). */
  ppu: 6,
} as const;

/** WORLD-36: the ridge's climb. */
export const RIDGE = {
  /** The snow line: terraces at or above this level are under permanent snow. */
  snowLevel: 3,
} as const;
