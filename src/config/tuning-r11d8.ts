/** R11 lane D, helper d8: the tunables of the per-region sky, seasons, life and gates. */

export const REGION_WEATHER_LIVE = {
  /** A sunshower is a light rain under a bright sky. */
  sunshowerIntensity: 0.3,
  /** Rain that reaches the floor under a canopy (the Wood is drier than the Grove). */
  canopyShare: 0.45,
  /** The haze a fog spell lays over the picture, 0..1. */
  fog: 0.55,
} as const;

/**
 * R0128 (WORLD-62): ambient life per 16 u chunk, the chunks within `rings` of the Keeper only.
 * Counts are per chunk and halve on a phone; `fish` needs the region's `water` (a pond), and a
 * region with no entry here has none. Never tappable. Caps keep Pixel at ≤ 60 sprites.
 */
export const AMBIENT_LIFE = {
  rings: 1,
  perChunk: { birds: 2, butterflies: 4, fish: 3 },
  /** Flapping and fluttering speeds, in beats a second. */
  flap: { bird: 5, butterfly: 7 },
  /** Per region id: which kinds live there. Add a line for a new region. */
  regions: {
    grove: { birds: true, butterflies: true, water: [{ x: 7, z: 6, r: 4.2 }] },
    wood: { birds: true, butterflies: true, water: [] },
  } as Record<
    string,
    | { birds: boolean; butterflies: boolean; water: { x: number; z: number; r: number }[] }
    | undefined
  >,
} as const;
