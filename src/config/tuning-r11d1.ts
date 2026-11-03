/**
 * Lane D round 11, helper d1: the region engine's numbers (WORLD-09, 15, 25, 39, 56, 68).
 * Walking a region, streaming its chunks, the two kinds of border, the coordinate rules and
 * the memory caps. Imported directly where used.
 */

/** How a region's walkable ground and scenery are laid out from its data (`region-layout.ts`). */
export const REGION_LAYOUT = {
  /** Walk-grid cell, world units (the Keeper's A* runs on it). */
  cell: 2,
  /** Half the width of a path band the Keeper may walk. */
  pathHalf: 2.6,
  /** Open ground round a point of interest, by tier. */
  clearing: { major: 7.5, minor: 4.5, micro: 0 },
  /** Points further than this from the path get a spur path to it. */
  spurFrom: 3,
  /** Trees stand on a jittered grid this far apart, and keep this far off open ground. */
  treeSpacing: 3.4,
  treeJitter: 1.3,
  treeClear: 1.4,
  /** Half the width of a stream; the cells it crosses are water (not walkable). */
  streamHalf: 1.8,
  /** Forest drawn past the region's edge (never walked), so the view never shows the void. */
  edge: 12,
  /** Grass tufts per chunk on open ground (3D draws them; the pixel ground paints them). */
  tuftsPerChunk: 26,
} as const;

/** The Keeper in a drawn region (`sim/region-walk.ts`). */
export const REGION_WALK = {
  radius: 0.35,
  /** A tap target is reached within this. */
  arrive: 0.25,
  /** A tap walk that has not got closer for this long (ms) stops where it is. */
  stallMs: 1500,
  /** Re-plan a tap walk at most this often (ms). */
  replanMs: 600,
  /** A* bound for a 56 × 56 cell region. */
  maxExpansions: 4000,
} as const;

/** WORLD-39: the two kinds of border. */
export const REGION_BORDER = {
  /** Seamless: the neighbour's edge rows stream in within this of the exit. */
  neighbourReach: 24,
  /** Rows of the neighbour's chunks drawn across a seamless edge. */
  neighbourRows: 2,
  /** Loaded: the target's programs link within this of the exit (WORLD-68)... */
  prewarmReach: 24,
  /** ...and its scene is built within this, so the iris only has to swap it in. */
  prebuildReach: 8,
  /** Loaded: the iris (shared with fast travel, `WORLD_TRAVEL.irisMs`) and its footstep. */
  stepSound: 'pat',
} as const;

/** WORLD-56: coordinates. Every region is local and centred, inside this on each axis. */
export const REGION_ORIGIN = {
  maxLocal: 80,
  /** The pixel camera's far plane covers the region's diagonal times this, at least `CAMERA.far`. */
  farScale: 1.2,
} as const;

/** WORLD-09: the chunk cache, per region, in bytes of instance data. */
export const REGION_CACHE = {
  lruBytes: 3 * 1024 * 1024,
} as const;

/** WORLD-15: memory caps per tier, and what the debug line reads against. */
export const REGION_MEM = {
  phone: { gpuTexMB: 96, geometries: 350, heapMB: 180 },
  desktop: { gpuTexMB: 384, geometries: 1200, heapMB: 600 },
} as const;
