/** Phone taps in the Hollow (R0192, DUNG-49). */
export const DUNGEON_TAP = {
  /** A ground tap this close (world units) to a pack, shrine, stone or loot snaps to it. */
  radius: 1.2,
  /** While a finger holds underground, the Keeper's goal is re-planned this often (ms). */
  replanMs: 250,
} as const;

/**
 * Phone performance for big Hollow floors (R0194, DUNG-51). Budgets are what a floor is held
 * to; `levelSector` and `minCells` turn the rock and floor's sector draw ranges on for the big
 * dungeon levels too (they were fields only): only the 3×3 sectors round the Keeper draw.
 */
export const HOLLOW_PERF = {
  /** Floor build, synchronous part (ms): desktop and a mid-range phone. */
  buildMsDesktop: 400,
  buildMsPhone: 1200,
  /** In the Hollow: draw calls, and triangles in view. */
  drawCalls: 140,
  trianglesInView: 60_000,
  /** Dungeon levels with at least this many cells are cut into sectors this many cells wide. */
  minCells: 80 * 60,
  levelSector: 16,
} as const;
