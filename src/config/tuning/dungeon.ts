/**
 * Tuning: the dungeon domain (TECH-36). Moved out of config/tuning.ts, which still re-exports it.
 * Numbers are unchanged; the review-pass letters in the comments are their provenance.
 */

/** The Hollow Below: seeded cave floors under the Grove. */
export const DUNGEON = {
  /**
   * The pixel view's fill light underground: warm stone, whatever the hour above (cg5: the
   * night sky's blue at 1.5x turned the Beetle Road's torch-lit floor purple).
   */
  caveAmbient: '#9a7a5e',
  /** World units per grid cell. */
  cell: 1.5,
  baseCols: 34,
  baseRows: 24,
  growCols: 4,
  growRows: 2,
  maxCols: 54,
  maxRows: 36,
  maxDepth: 20,
  /** Loot spots per floor at depth 1, plus this much again per extra floor. */
  lootBase: 9,
  lootPerDepth: 1.5,
  lootMax: 20,
  straysBase: 2,
  straysPerDepth: 0.6,
  straysMax: 6,
  straySpeed: 1.5,
  strayFleeSpeed: 3.2,
  /** Shells a stray snatches when it bumps the Keeper. */
  straySnatch: 5,
  strayCooldownMs: 6000,
  wildPerFloor: 1,
  pickupRadius: 0.8,
  useRadius: 1.4,
  scanRadius: 2.2,
  chestShells: [30, 60] as const,
  chestEggChance: 0.25,
  /** R0167: 3 come along, 4 after Act II (`hollowPartySize`, config/dungeon-party-r8.ts). */
  partySize: 3,
  followDistance: 1.7,
  nubbinSpeed: 2.8,
  fetchRadius: 4,
  /** Floor light at depth 1 and how much each floor takes away. */
  lightBase: 0.9,
  lightPerDepth: 0.06,
  lightMin: 0.3,
  torchReach: 6,
  crystalReach: 4,
  lampReach: 4.5,
  /**
   * The generator new floors use. A run stores the version its current floor was made
   * with, so a saved run keeps its floor; version 1 is the old 34×24 cave and its numbers
   * above (baseCols..maxRows) must never change.
   */
  genVersion: 2,
  /** Version 2 layout: one great chamber, 2–4 medium rooms, small side rooms, wide tunnels. */
  layout: {
    baseCols: 48,
    baseRows: 34,
    growCols: 4,
    growRows: 2,
    maxCols: 72,
    maxRows: 48,
    /** Cells kept clear between a room and the grid edge. */
    margin: 3,
    /** Chance a cell starts open before the cellular-automata passes. */
    fill: 0.5,
    great: { w: [16, 22] as const, h: [12, 16] as const, edgeNoise: 0.22 },
    medium: { count: [2, 4] as const, w: [8, 12] as const, h: [6, 9] as const },
    small: { count: [1, 2] as const, w: [5, 7] as const, h: [5, 6] as const },
    /** Rooms keep this many cells apart when they can. */
    roomGap: 2,
    placeTries: 80,
    corridorWidth: [2, 3] as const,
    /** Chance of one extra tunnel that closes a loop. */
    loopChance: 0.6,
  },
  /** Version 2 visual elevation (item 19): the sim stays flat, actors sample the height. */
  elev: {
    /** One terrace step in world units, and the highest terrace. */
    step: 0.5,
    max: 1,
    noiseScale: 9,
    /** Water sits this far below the ground around it. */
    waterSink: 0.3,
    /** The pool basin room sits this far below the ground level. */
    basinDepth: 0.5,
    /** Cells around the stairs, the chest and the landmark kept level. */
    flatRadius: 2,
  },
  /** Version 2 water pockets: noise below this becomes water. */
  water: { threshold: 0.3, flooded: 0.5, poolRadius: 0.36 },
  /** Bridges and stepping stones over water runs (item 32). */
  crossing: { minLen: 2, maxLen: 7, bridgeFrom: 4, max: 6, spacing: 4 },
  /** Openings in the outer wall onto the chasm (item 31). */
  vista: { count: [1, 3] as const, maxDepth: 4, maxWidth: 3, spacing: 10 },
  /** The great chamber's landmark (item 18): cells kept clear of loot around it. */
  landmark: { clearRadius: 3, poolRadius: 1.8, stairsFrom: 5 },
  /** Rare special floors (item 41). */
  special: { minDepth: 3, chance: 0.12, crystalSpacing: 3, glowwormLight: 0.1 },
  /** The explored mask (item 40): cells within this many cells of the Keeper are seen. */
  explore: { radius: 4 },
} as const;
