/**
 * Lane E round 9: tunables for the Learning Grove's session flow (more lane E r9 agents may
 * append below). Re-exported from tuning.ts by one `export *` line.
 */

/** R0696 (KIDS-28): the animal icons and colour tags a child's Learning Grove can wear. */
export const EDU_TAG = {
  icons: ['🐰', '🦊', '🐻', '🐸', '🐱', '🐶', '🦉', '🐢'] as readonly string[],
  /** Each colour carries its name, so colour is never the only signal. */
  colours: {
    red: '#e05a4f',
    orange: '#ef9a3c',
    yellow: '#e8c840',
    green: '#5bb36a',
    blue: '#4f8fe0',
    purple: '#9a6ad6',
  } as Record<string, string>,
  nameMax: 20,
  /** The `?kids` picker's portrait tiles, in CSS px. */
  tilePx: 160,
} as const;

/**
 * R0704 (KIDS-36): the session arc, read from `playedMs` against the session length. Hello for
 * the first minute, then the main activity, a care beat around the middle, a second activity,
 * the wind-down (`EDU.breakWarnMinutes` before the end) and goodnight once the break is due.
 */
export const EDU_ARC = {
  helloMs: 60_000,
  careFrom: 0.45,
  careTo: 0.6,
} as const;

/** R0724 (KIDS-56): during the wind-down an idle Nubbin yawns this often (a short sit). */
export const EDU_YAWN = {
  chance: 0.45,
  ms: 1800,
} as const;

/** Lane E r9 (kidsread), R0730 (KIDS-62): the read-aloud story's auto-advance. */
export const KIDS_READ = {
  /** After the voice finishes a line (and its own short pause), wait this long, then go on. */
  autoAdvanceMs: 1200,
} as const;

/**
 * Lane E r9 (look3d), R0380 (LOOK-11): the Chao head point's spring bone in Full 3D. The
 * spring runs on the tip's lean in radians; `push`, `drop` and `turn` scale the head's
 * acceleration (rig units/s²), its upward jolt and its yaw acceleration (rad/s²) into it.
 */
export const CROWN_SPRING = {
  stiffness: 60,
  damping: 8,
  /** ±12° at the stock point's length; a long point leans further, a stub less. */
  maxLag: (12 * Math.PI) / 180,
  push: 0.25,
  drop: 0.3,
  turn: 0.3,
  /** A Swim fin flexes side to side more than fore and aft. */
  finSide: 1.3,
  finFore: 0.5,
  /** The stock point's height above its cut, rig units. */
  stockLength: 0.45,
  /** How far below the cut the shared band reaches, and how near a crown prim counts. */
  band: 0.12,
  reach: 0.16,
  minTris: 24,
  /** Tip speed (rig units/s) past which a move is a teleport, not motion. */
  teleport: 60,
} as const;
