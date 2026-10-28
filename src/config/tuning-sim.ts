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

/** Bushes, flowerbeds and thickets (MOVE-03/04): the Keeper's speed in one, and how much of the overlap is eased back out each step. */
export const KEEPER_SOFT = {
  slow: 0.5,
  push: 0.2,
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

/** Grove tap-to-move pathfinding (R0008): a 0.5 u grid over the field. */
export const GROVE_NAV = {
  /** Grid cell size (world units). */
  cell: 0.5,
  /** Cells closer than this to a collider are shut (the Keeper's body radius). */
  clearance: 0.3,
  /** A waypoint counts as passed inside this distance (world units). */
  waypointReach: 0.3,
  /** Bound on expanded cells per plan: a long walk round the pond fits well inside. */
  maxExpansions: 20000,
  /** How far (cells) to look for an open cell when the walker stands in a shut one. */
  entrySearch: 12,
  /** Cost of crossing a bush or bed cell, against 1 for open grass. */
  softCost: 4,
  /** How far round a shut-in target (cells) to look for a reachable stand-in. */
  reachSearch: 24,
  /** A rise between hill samples 0.1 u apart bigger than this shuts the join (MOVE-09): well under
   * `JUMP.stepUp`, so a planned path never meets a step the Keeper cannot take.  */
  cliffJump: 0.2,
} as const;

/**
 * The Keeper's jump (MOVE-10/11). Heights in units, times in ms. A held jump rises to
 * `height`; letting go on the way up cuts the rise to `shortHopScale`. Each air jump sets
 * vy afresh. At these numbers the air time is about half a second: a running jump or a
 * double jump clears the 2.2 u stream. The Learning Grove and the Gentle jumps setting
 * use `kidFloat` over the top.
 */
export const JUMP = {
  gravity: 26,
  fallGravityScale: 1.5,
  maxFall: 14,
  height: 0.95,
  shortHopScale: 0.55,
  doubleHeight: 0.75,
  airJumps: 1,
  coyoteMs: 120,
  bufferMs: 150,
  /** Share of the walking speed the Keeper can steer with in the air. */
  airControl: 0.8,
  /** A walking Keeper steps up or down this much without a jump. */
  stepUp: 0.35,
  landSquashMs: 90,
  kidFloat: { gravity: 20, coyoteMs: 200, bufferMs: 250 },
} as const;

/** The Keeper moves on its own fine clock (MOVE-15): this many substeps a second. */
export const KEEPER_MOTION = { hz: 60 } as const;

/** Wading the stream (MOVE-13): feet sink to the bed, at most `maxSink` under the water. */
export const KEEPER_WADE = { maxSink: 0.35, speed: 0.55, rippleMs: 300 } as const;

/**
 * The plank bridge over the inflow (MOVE-12): a deck `hw` × `hd` (half sizes, across and
 * along) whose plank tops sit `lift` above the stream bed at its centre and ramp down to
 * the banks over the last `ramp` units; posted rails `railOffset` off the centre line.
 */
/** The bridge's yaw: the path it carries runs from (1, 4) towards (-5, 14). */
export const BRIDGE_YAW = Math.atan2(14 - 4, -5 - 1) + Math.PI / 2;

export const BRIDGE_DECK = {
  hw: 1.0,
  hd: 1.9,
  lift: 0.64,
  ramp: 0.4,
  railOffset: 0.8,
  railR: 0.08,
  railTop: 0.9,
} as const;

/**
 * The hill terraces (MOVE-09). Each hill is `ceil(h / maxStep)` tiers (at least two), so
 * every step is under a jump's height; the top tier is `topFactor` of the hill's radius
 * across. A cliff's soft toon edge runs `edge` units in from its rim. The ramp is a band
 * `rampWidth` wide that climbs along the foot of each next tier in turn, with a level
 * `landing` (arc units) at its top end; its outer side and far end are walkable banks
 * `rampBank` wide.
 */
export const TERRACE = {
  maxStep: 0.9,
  topFactor: 0.4,
  edge: 0.5,
  rampWidth: 1.2,
  rampBank: 0.6,
  landing: 1.0,
} as const;

/**
 * The Keeper's ground feel (MOVE-20): speed builds toward the stick at `accel` and falls at
 * `decel` (units/s²), a turn of more than `skidDeg` uses `turnAccel` and skids, the air
 * steers at `airAccelScale` of it. Full walking speed comes in about 0.12 s, so it never
 * slides. A tap walk eases in over its last `arriveEase` units. The renderers turn the
 * drawn facing at `facingTurnDegPerS` (3D) or after `pixelFacingHoldMs` on a new heading.
 */
export const KEEPER_ACCEL = {
  accel: 28,
  decel: 34,
  turnAccel: 40,
  airAccelScale: 0.8,
  skidDeg: 120,
  arriveEase: 0.6,
  facingTurnDegPerS: 900,
  pixelFacingHoldMs: 60,
} as const;
