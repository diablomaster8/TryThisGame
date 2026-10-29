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
  /** World units a terrain chunk's box grows by before the view test (shadows from hills). */
  terrainMargin: 6,
  /**
   * Round 4 (phone perf): a tree at least `farFrom` units from the camera, and farther than the
   * Keeper by its crown's reach plus `farMargin` (so it can never need its own fade), is drawn
   * in the shared far batch (`render3d/far-trees.ts`). `farBand` is the hysteresis.
   */
  farTrees: { farFrom: 16, farMargin: 1, farBand: 2 },
  /** Creatures (`render3d/lod.ts`). */
  creature: {
    /** World units added to a rig's bounding sphere for the longest shadow it throws. */
    shadowReach: 4,
    /** From level 2, a creature shorter than this on screen (CSS px) loses its outline hull. */
    hullMinPx: 90,
    /** Share around the threshold a creature keeps its state in, against flicker. */
    band: 0.15,
    /** R0079: camera distance (world units) past which a rig is drawn as its merged stand-in. */
    proxyFrom: 8,
    /** R0079: the stand-in's sculpt grid (one of `SCULPT_RES.steps`). */
    proxyRes: 48,
    /** R0079: past this camera distance no creature keeps its outline hull. */
    hullMaxDist: 14,
    /**
     * R0079: past this camera distance a creature casts no sun shadow; its contact blob keeps it
     * on the ground. A stand-in's shadow costs its whole mesh again in the shadow pass.
     */
    shadowMaxDist: 20,
    /** R0079: past this camera distance a creature is an impostor (`impostor-creature.ts`). */
    impostorFrom: 20,
    impostor: {
      /** The shared atlas and each creature's cell, in pixels (64 cells, 4 MB). */
      atlasPx: 1024,
      cellPx: 128,
      /** Cells drawn again each frame at most, stalest first (a cell is a rig's whole draw). */
      perFrame: 2,
      /** Round 4: on a phone or slower tier, one cell a frame (far poses step at 3.75 fps). */
      perFramePhone: 1,
      /** Frames a cell is kept before it is drawn again: far poses step at 60 / 8 = 7.5 fps. */
      minAge: 8,
      /** The cell's half-size over the rig's bounding radius. */
      margin: 1.05,
    },
  },
} as const;

/**
 * WORLD-14: the device tier, read from the sculpt grid the first-run benchmark picked
 * (`settings.sculptRes`, `SCULPT_RES.steps`), so no second benchmark runs. Each tier caps the
 * share of the instanced ground cover it draws at geometry level 0; the levels thin from there.
 */
export const WORLD_TIER = {
  /** The finest sculpt grid that still counts as each tier. */
  minRes: { desktop: 80, phone: 64 },
  /** Share of grass tufts per tier (desktop 18k across both passes, so a phone draws 9k). */
  grass: { desktop: 1, phone: 0.5, slow: 0.25 },
} as const;

export type DeviceTier = keyof typeof WORLD_TIER.grass;

export function tierForRes(res: number): DeviceTier {
  return res >= WORLD_TIER.minRes.desktop
    ? 'desktop'
    : res >= WORLD_TIER.minRes.phone
      ? 'phone'
      : 'slow';
}

/**
 * WORLD-15: what one region may hold, per device. The debug panel shows the live counts
 * against them and marks one that is over. On 2026-10-28 the Grove on a phone held about 540
 * geometries and a 200 MB heap, over the phone line (not yet broken down by owner),
 * so these are the target a new region is built to, not yet a limit that releases anything.
 */
export const WORLD_MEM = {
  phone: { gpuTexMB: 96, geometries: 350, heapMB: 180 },
  desktop: { gpuTexMB: 384, geometries: 1200, heapMB: 600 },
  /**
   * R0081: spare rigs the creature pool keeps per device tier. A spare is about 50 geometries
   * and their materials; 12 of them (`GROVE3D.poolSpares`) were most of a phone's geometry
   * overrun. Fewer spares only means a rebuild (from cached surfaces) when a look comes back.
   */
  poolSpares: { desktop: 12, phone: 4, slow: 2 },
} as const;

/** R0074: the fast-travel transition (`ui/travel-iris.ts`): iris, or cross-fade with reduced motion. */
export const WORLD_TRAVEL = {
  irisMs: 350,
  fadeMs: 150,
} as const;

/** WORLD-18: the walking lead on a portrait view (`walkLead` in `render/camera.ts`). */
export const CAMERA_LEAD = {
  /** Share of the view's width the camera aims ahead of a walking Keeper (the follow lag takes about 0.8 u back, so the Keeper sits 22–30% from the trailing edge). */
  share: 0.32,
  /** World units the lead stays inside the view's half-width. */
  edge: 2,
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

/**
 * R0073 (WORLD-07): the survey zoom, a third step past the far one (zoom index -1), so a
 * portrait phone sees the field instead of a corridor. Pixel: 8 px a unit (half the far
 * step, so the art stays on whole pixels); Nubbins and eggs are drawn `tokenScale` times
 * larger there so they stay findable and tappable. 3D: the orbit pulls back to `distance3d`.
 * "Zoom out when running" enters it after `runMs` of running (phones, unless switched off)
 * and leaves `backMs` after the run stops.
 */
export const WORLD_SURVEY = {
  pixelsPerUnit: 8,
  distance3d: 26,
  tokenScale: 1.5,
  runMs: 2000,
  backMs: 800,
  /** Impostor cells redrawn a frame at the survey zoom (they are small there). */
  impostorPerFrame: 1,
} as const;

/** R0106 (WORLD-48): the bottom bar tucking away while walking on a phone (`ui/walk-tuck.ts`). */
export const WORLD_TUCK = {
  /** Moving this long (ms) with no panel open tucks the bar. */
  walkMs: 1000,
  /** Standing still this long (ms) brings it back. */
  backMs: 800,
  /** How often the Keeper's position is checked (ms), and the least step that counts as moving. */
  pollMs: 150,
  minStep: 0.02,
} as const;

/**
 * R0100 (WORLD-42): the objective beacon (`render/beacon.ts`) and its edge arrow
 * (`ui/beacon-arrow.ts`). The beam is unfogged, so it reads from `seenFrom` units away.
 */
export const WORLD_BEACON = {
  beamRadius: 0.35,
  beamHeight: 26,
  ringRadius: 1.1,
  starSize: 1.6,
  starHeight: 6,
  balloonRadius: 0.7,
  balloonHeight: 3.6,
  /** Beyond this the beacon is not drawn (the arrow and the compass still point). */
  seenFrom: 60,
  /** The arrow chip keeps this far (CSS px) inside the screen edges, clear of the HUD bands. */
  inset: { side: 34, top: 150, bottom: 190 },
  /** An on-screen target within this share of the screen's half-size shows no arrow. */
  onScreen: 0.92,
} as const;

/**
 * R0101 (WORLD-43): the regions that offer their own quests. A quest whose region is not
 * listed is offered from the Grove, the hub, until that region can be walked to (the lane
 * is drawn only as Corvin's story set today). Add a region here when it opens.
 */
export const WORLD_QUESTS = {
  ownOffers: ['grove', 'hollow'] as readonly string[],
} as const;

/**
 * R0099 (WORLD-40): the Learning Grove's fenced play area (`sim/little-grove.ts`): 40 x 40 round
 * the cottage, the pond and the near fruit trees, with the Hollow's mouth (z -13.6) outside.
 * `margin` keeps everyone a step in from the fence; `home` is where the Home button walks to.
 */
export const LITTLE_GROVE = {
  minX: -20,
  maxX: 20,
  minZ: -12,
  maxZ: 28,
  margin: 0.6,
  /** Picket spacing of the drawn fence, in world units. */
  picket: 1.2,
  home: { x: -7, z: 18 },
} as const;
