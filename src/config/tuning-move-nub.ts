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

/**
 * Nubbin hops and jumps (MOVE-30). Height (units) is `base + run·perRun + fly·perFly` per
 * level, ×`child` for a child; Fly at `airJumpFly` or more gives one flap in the air, which
 * reaches `flapExtra` higher. Hops are idle-only: personality picks how often, never stats.
 */
export const NUBBIN_JUMP = {
  base: 0.35,
  perRun: 0.006,
  perFly: 0.004,
  child: 0.6,
  airJumpFly: 40,
  flapExtra: 0.3,
  /** One hop up, down or over, start to finish (ms). */
  hopMs: 300,
  /** The arc over the straight line between the two heights, as a share of the jump. */
  arc: 0.35,
  /** A happy hop on the spot, as a share of the jump. */
  happyArc: 0.6,
  /** Happiness at or above which a Nubbin hops for joy. */
  happyAt: 30,
  /** Seconds between happy hops, by personality (none: never on its own). */
  happyEvery: {
    cheerful: [8, 20],
    mischievous: [30, 60],
    none: [30, 60],
  } as Readonly<Record<string, readonly [number, number]>>,
  /** A Mischievous Nubbin picks a bench or rock to climb this often when idle. */
  perchChance: 0.35,
  /** How far (units) it looks for one. */
  perchRadius: 8,
  /** A Shy Nubbin hops back from a Keeper landing this close (units)... */
  shyRadius: 2.5,
  /** ...and backs off this far. */
  shyBack: 1.6,
} as const;
