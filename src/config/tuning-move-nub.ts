/**
 * How a Nubbin finds its way round things while it walks (MOVE-29). A walking Nubbin looks a
 * short way ahead and turns aside when the next steps would meet a wall, a fence or a bush;
 * long walks and walks behind a blocker follow a path on the Nubbins' own walkability grid.
 * The probe and the paths run only while a Nubbin walks, never for one standing still.
 */
export const NUBBIN_STEER = {
  /** How far ahead (units) the walker looks for something in the way. */
  probe: 0.6,
  /** A clear look ahead is trusted for this many steps of the same heading (0.1 s each). */
  probeEvery: 4,
  /** The body radius the probe tests (units); `resolve` keeps a Nubbin 0.3 clear. */
  radius: 0.3,
  /** The headings tried, either side of straight, when the way ahead is blocked (degrees). */
  turnsDeg: [35, 70] as const,
  /** Targets further than this (units) follow a planned path. */
  navFar: 6,
  /** A blocker no longer than this (units) across the straight line is left to steering. */
  smallBlock: 2.5,
  /** A planned path is planned again after this long (ms). */
  repathMs: 3000,
  /** A moving target (a toy, the Keeper) further than this from the planned end replans (units). */
  retarget: 1,
  /** How many times a wander target that lands somewhere a Nubbin cannot stand is redrawn. */
  resample: 4,
  /** Cells closer than this (units) to a blocker are shut on the Nubbins' grid. */
  clearance: 0.3,
  /** How far beyond the outer edge of a hill's first ramp leg the sled run starts (units). */
  sledFoot: 0.4,
} as const;
