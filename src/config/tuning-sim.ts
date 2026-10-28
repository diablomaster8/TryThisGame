/**
 * Tunables added by the sim fix pass of 2026-10-25, kept out of the shared tuning.ts so
 * parallel passes do not collide there. Same rule: every number the sim tunes lives in config.
 */

export const KEEPER_UNSTICK = {
  /** A care walk where the Keeper moves less than this in `giveUpMs` gives up. */
  minProgress: 0.25,
  /** How long a walk may make no progress before the Keeper gives up and says so. */
  giveUpMs: 2500,
  /** Clearance kept from obstacles when the Keeper is pushed out of one. */
  clearance: 0.35,
  /** Ring spacing and furthest ring when searching for a free spot. */
  searchStep: 0.25,
  searchMax: 16,
} as const;

/** Hollow pathfinding (R0009): A* over the floor's cells, string-pulled into legs. */
export const DUNGEON_NAV = {
  /** A waypoint counts as passed inside this distance (world units). */
  waypointReach: 0.3,
  /** Half-width of the Keeper's and a Nubbin's body for sight-line tests (world units). */
  keeperClearance: 0.35,
  nubbinClearance: 0.3,
  /** Planned paths kept per floor, oldest dropped first. */
  cacheSize: 48,
} as const;
