/**
 * Numbers for the Hollow Below's rebuild (lane B of the 2026-10-27 recommendations, DUNG).
 * The older Hollow numbers stay in `DUNGEON` in tuning.ts; everything the rebuild adds
 * lives here, so the dungeon work never has to edit the shared tuning file.
 */
export const HOLLOW = {
  /**
   * After arriving on a floor (entering, descending, or the loading veil lifting) strays
   * and packs leave the Keeper be for this long (R0142).
   */
  arrivalGraceMs: 8000,
  /**
   * The generator new floors use (`DUNGEON.genVersion` in tuning.ts is the older setting,
   * kept for the pixel samples). Saved runs keep the version their floor was made with.
   */
  genVersion: 3,
  /** Monster packs on version-3 floors (R0146). Radii and spacing in cells. */
  packs: {
    minFromEntry: 8,
    spacing: 6,
    members: [2, 4] as const,
    championFrom: 3,
    championChance: 0.15,
    aggroRadius: 5,
    leash: 12,
    wander: 3,
    /** World units per second; the chase is a share of the Keeper's walking speed. */
    wanderSpeed: 0.9,
    chaseSpeed: 0.8,
    /** The "!" beat before a chase starts, and how close counts as a bump (world units). */
    noticeMs: 600,
    contact: 0.9,
    fleeGraceMs: 3000,
    /** The auto-resolve stub: a member's weight on top of its level, the win-chance clamp. */
    memberBase: 4,
    winBias: 0.15,
    winMin: 0.25,
    winMax: 0.95,
    rewardShells: 6,
    rewardPerTier: 4,
    /** An act boss: levels over its depth, notice radius and leash (cells). */
    bossLevels: 6,
    bossAggro: 6,
    bossLeash: 30,
  },
  /**
   * Generator version 3 (R0143, R0144): authored pieces on a grid of slots, a branching
   * walk between them, cave rock roughened around them. The three dungeon levels set the
   * size; acts pick a level per floor (R0145), the endless Hollow by depth (`deepLevels`).
   */
  v3: {
    /** Cells per macro slot; a piece is at most `slot - 2` across, leaving a gap for tunnels. */
    slot: 12,
    /** Cells kept as rock around the slot grid. */
    margin: 2,
    /** Chance the walk branches from an earlier slot instead of carrying on from its tip. */
    branchChance: 0.35,
    loops: [1, 3] as const,
    /** Chance a plain slot gets a corridor piece rather than a room. */
    corridorChance: 0.35,
    /** No piece more often than this on one floor. */
    maxRepeats: 3,
    treasureRooms: [2, 3] as const,
    /** Where the stairs down sit, as a share of the farthest walk from the stairs up. */
    stairsBand: [0.55, 0.75] as const,
    /** The walk picks the exit leaf nearest this share of the slot walk (tuned to land the stairs in the band). */
    exitAim: 1,
    /** The cave rock around the pieces (open chance per level below): passes, smallest pocket. */
    caPasses: 4,
    minPocket: 6,
    tunnelWidth: 2,
    /** Share of side-cave cells that may hold a find (the rest lie in rooms and tunnels). */
    caveFinds: 0.12,
    levels: {
      small: { cols: 64, rows: 48, rooms: [8, 10], poi: [22, 28], packs: [3, 4], caFill: 0.78 },
      standard: { cols: 80, rows: 60, rooms: [10, 14], poi: [28, 36], packs: [4, 6], caFill: 0.6 },
      big: { cols: 96, rows: 72, rooms: [14, 18], poi: [36, 44], packs: [6, 8], caFill: 0.58 },
    },
    /** The endless Hollow's level by depth: up to `small` floors, then up to `standard`. */
    deepLevels: { small: 3, standard: 9 },
  },
  /** Levels kept per run so going back finds them as left (R0151). */
  levels: { keep: 12 },
  /**
   * Waypoint stones (R0148): on level 1 of every act and every `every` levels after, never on
   * the boss level; `reach` is how close (world units) counts as standing on one.
   */
  waypoints: { every: 2, reach: 1.2 },
  /** The Homing Acorn (R0150): a bundle in the cave-mouth shop, and the chance a find holds one. */
  acorns: { bundle: 5, price: 10, dropChance: 0.12 },
  /**
   * Solid set pieces (R0032): the landmark blocks this share of its clear radius (cells); nav
   * closes cells within the block plus `navClearance` (world units).
   */
  props: { landmarkShare: 0.7, navClearance: 0.35 },
} as const;

export type HollowLevel = keyof typeof HOLLOW.v3.levels;
