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
  /** Round 5: half the sun shadow box, world units, by device tier (`grove-3d-scene.ts`). */
  shadowHalf: { desktop: 30, phone: 22, slow: 18 },
  /** Round 5: the sun shadow camera's far plane by device tier (the sun stands 60 u out). */
  shadowFar: { desktop: 200, phone: 95, slow: 90 },
  /** Round 5: and its near plane: casters nearer the sun than this are left out. */
  shadowNear: { desktop: 1, phone: 25, slow: 30 },
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
    /**
     * Round 5: triangles all creatures in view may draw (whole, stand-ins, their hulls and
     * shadows), by device tier; past it the farther ones step down a tier (`lod.ts` capFull).
     */
    fullTris: { desktop: Infinity, phone: 190_000, slow: 150_000 },
    /** Round 5: an over-budget creature at least this far (units) goes to its impostor. */
    capFarFrom: 10,
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
  /** R0102: with Travel assist on, a beacon on screen farther than this (units) gets a tap chip. */
  assistFrom: 4,
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

/**
 * R0085 (WORLD-19): riding a Nubbin. An adult partner with enough affection and a trained top
 * stat carries the Keeper; its type sets the pace and its personality colours the ride.
 */
export const RIDE = {
  minAffection: 60,
  /** The Nubbin's best stat level must reach this. */
  minTopLevel: 30,
  /** Pace by the carrier's type (× the Keeper's walking speed). Run sprints on the run toggle. */
  speed: { run: 2.0, power: 1.6, swim: 1.4, fly: 1.5, normal: 1.6 },
  runRunning: 2.6,
  /** A child (only in a Learning Grove) tows the Keeper by the hand instead. */
  towSpeed: 1.3,
  /** Energy spent per minute of riding, as a share of the walking drain (2× walking in all). */
  extraDrain: 1,
  /** Below this the Nubbin asks to get down. */
  tiredEnergy: 0.2,
  /** Lazy carriers sit down for `lazySitMs` every `lazyEveryMs` unless cheered. */
  lazyEveryMs: 40_000,
  lazySitMs: 2_000,
  /** Mischievous carriers take a little side hop on this share of turns. */
  hopChance: 0.1,
  hopMs: 600,
  /** A heading change at least this big (radians) counts as a turn. */
  turnRad: 0.8,
  /** Shy carriers slow near people. */
  shyNear: 4,
  shySpeed: 0.7,
  /** The Keeper's seat: height above the carrier's feet, and the Keeper's scale on top. */
  seatAdult: 0.7,
  /** How far behind the carrier's middle the Keeper sits, and the gap to a towing child. */
  seatBack: 0.2,
  towGap: 0.45,
  seatChild: 0,
  keeperScale: 0.8,
  /** Side-hop sway the renderers draw (world units). */
  hopSway: 0.6,
  /** Cheerful bounce the renderers draw (world units, per walk cycle). */
  bounce: 0.08,
} as const;

/**
 * R0088 (WORLD-22): deep water. A Swim-trained adult partner (or the Nubbin being ridden) tows
 * the Keeper across the pond faster than wading; without one the shore is the limit and a hint
 * says why, at most once per `hintMs`.
 */
export const SWIM_TOW = {
  minSwimLevel: 30,
  speed: 1.2,
  hintMs: 60_000,
  /** How far ahead of the Keeper the swimmer paddles. */
  lead: 0.7,
} as const;

/**
 * R0119 (WORLD-52): the Keeper's pace by what is underfoot, so paths are worth keeping to.
 * Shallow water keeps its own wading pace (`KEEPER_WADE.speed`); sand and snow are for the
 * regions that have them.
 */
export const SURFACE_PACE = {
  grass: 1,
  path: 1.15,
  deck: 1.15,
  stone: 1,
  water: 1,
  sand: 0.9,
  snow: 0.85,
} as const;
