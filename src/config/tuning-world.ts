/**
 * Tunable numbers for the open world (lane D, WORLD-*): the drawn map, the geometry budget the
 * Full 3D governor holds, and the chunk grid. Re-exported from `tuning.ts`.
 */

/** The drawn map (WORLD-02). */
export const WORLD_MAP = {
  /** Anchors closer than this (view px) count as crowded and choose their label spot first. */
  crowdPx: 70,
  /** Label search rings: spacing and count. */
  ringPx: 22,
  rings: 7,
  maxZoom: 4,
  /** How often the Keeper and Nubbin markers move while the map is open. */
  liveMs: 250,
  dragSlopPx: 6,
  doubleTapMs: 320,
} as const;

/**
 * WORLD-03: the most the Full 3D Grove may draw per frame. A mid-range 2022 phone GPU holds
 * 60 fps at about 300–500 k triangles and under 200 draw calls with this shading.
 */
export const PERF_BUDGET = {
  phone: { calls: 180, tris: 450_000, nubbinTris: 25_000 },
  desktop: { calls: 400, tris: 1_500_000, nubbinTris: 80_000 },
  /** Frames over (or well under) budget in a row before the geometry level moves. */
  overFrames: 30,
  underFrames: 180,
  /** Under this share of the budget for `underFrames`, the level steps back down. */
  relaxShare: 0.6,
  maxLevel: 3,
} as const;

/** WORLD-09: the chunk grid every region is cut into. */
export const WORLD_STREAM = {
  /** Chunk side, world units. */
  chunk: 16,
  /** Rings of chunks kept around the Keeper (2 → a 5×5 block). */
  rings: 2,
  /** Extra ring a chunk may stay in before it is dropped (hysteresis). */
  keepRings: 1,
  /** Margin (world units) added to the camera's view box when picking chunks to draw. */
  viewMargin: 4,
} as const;

/** WORLD-03/12: what each geometry level keeps. */
export const WORLD_LOD = {
  /** Viewports narrower than this on their short side get the phone budget. */
  phoneMaxPx: 768,
  /** Share of grass tufts drawn at geometry level 0..3. */
  grass: [1, 0.6, 0.35, 0.2],
} as const;

/** WORLD-10/11: walking pace and how far apart points of interest may be, in walking seconds. */
export const WORLD_WALK = {
  /** The Keeper's phone walking speed, units per second, used to turn distance into time. */
  speed: 3.2,
  /** A region's longest crossing should take this long (rooms and the kids' area are exempt). */
  crossS: { min: 20, max: 50 },
  /** POI ladder: the 90th-percentile walk to the nearest POI of each tier, at most. */
  tierS: { micro: 8, minor: 15, major: 30 },
} as const;
