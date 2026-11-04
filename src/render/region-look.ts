import type { Season } from '../sim/types';

/**
 * R0094 and R0118: what the place the Keeper stands in asks both renderers to wear, set by the
 * game from `sim/region-weather-live.ts` and read by a region's own module. A plain store keeps
 * the region hosts untouched: `season` is null in the Grove (which has its own season paths).
 */
export const regionLook: { season: Season | null; fog: number } = { season: null, fog: 0 };
