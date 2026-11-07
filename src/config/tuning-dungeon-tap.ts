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
  /**
   * On such a level, small props (rubble, stalagmites, roots, decals) draw only in the sectors
   * within this many cells of the Keeper, each way: a far stone is a few pixels on a phone.
   * At half a sector it is at most 2×2 sectors (the nearest ones), not the rock's 3×3.
   */
  propReach: 8,
  /**
   * Low detail for far sectors on such a level (R0194 part 2). A sector draws its full rock,
   * ground and props while it lies within `near` cells of the Keeper's cell, and its low-detail
   * twin (the same vertices and baked light, fewer triangles) once it is more than
   * `near + hold` away; in between it keeps what it had, so walking along a sector's edge never
   * flickers it. `wallRowStep` and `wallColStep` thin a far wall face's rows and columns (they
   * divide `rock.wallRows` and 2); `flatEps` is how far (world units) a far ground vertex
   * may sit off a merged rectangle of sub-quads (`hollow-lod.ts`) and still be passed over.
   */
  lod: { near: 4, hold: 2, wallRowStep: 2, wallColStep: 2, flatEps: 0.004 },
} as const;
