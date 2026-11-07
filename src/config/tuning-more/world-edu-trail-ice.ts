// was tuning-r14d2; review pass R14 D2
/** Lane D round 14 helper 2: tunables for the Learning Grove trail, ice and the visual run. */

/** R0099 (WORLD-40): in the Learning Grove the tap footprints glow, last longer and are bigger. */
export const EDU_TRAIL = {
  /** The prints fade over this many times the normal fade. */
  fadeMul: 3,
  /** Print size multiplier. */
  size: 1.7,
  /** The 3D glow colour (warm, never the only signal: the prints are also larger and longer). */
  colour: '#ffe27a',
} as const;

/** R0118 (WORLD-51): the frozen pond in a free-play winter. */
export const ICE = {
  /** The Keeper's stick pace on the ice (the item's x1.4 slide). */
  speedMul: 1.4,
  /** The stick accelerates, brakes and turns at this fraction of the normal rate: low steering. */
  steerScale: 0.22,
  /** The ice surface's height: just over the water line. */
  surfaceLift: 0.02,
} as const;
