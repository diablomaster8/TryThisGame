/** Numbers for visiting Keepers' wandering and staged walk-ons (R0036). */
export const NPC_MOVE = {
  /** Body radius (units) a wander target and each step must clear. */
  radius: 0.35,
  /** How far ahead (units) a walking visitor looks for something in the way. */
  probe: 0.6,
  /** Headings tried either side of straight when blocked (degrees). */
  turnsDeg: [35, 70, 110] as const,
  /** Redraws of a wander target that lands in a solid before the visitor waits instead. */
  resample: 6,
  /** How long a visitor stops when the Keeper is in the way (ms). */
  keeperPauseMs: 600,
  /** The Keeper counts as in the way when within this of the probe point (units). */
  keeperBlock: 0.7,
  /** Pushed this long without progress (ms) and the route is planned again. */
  stuckMs: 1500,
  /** Targets farther than this (units) from the visitor ask for a path at once. */
  pathFar: 1.5,
} as const;
