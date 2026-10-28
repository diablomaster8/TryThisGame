/**
 * Lane A (MOVE) numbers that are not sim rules: how a jump looks and sounds in both
 * renderers. The sim's own jump numbers stay in `tuning-sim.ts` (`JUMP`).
 */

/**
 * MOVE-21: the Keeper's jump frames and landing feedback. The crouch shows for `crouchMs`
 * after take-off while the feet are within `crouchGap` of the floor; rise and fall turn
 * over at `apexVy` (u/s); the land frame holds for `JUMP.landSquashMs`. `stretch` and
 * `squash` scale the sprite or rig height (width the other way), never under reduced motion.
 */
export const KEEPER_JUMP_FX = {
  crouchMs: 60,
  crouchGap: 0.15,
  apexVy: 1.5,
  stretch: 1.08,
  squash: 0.9,
  /** 3D rig scale on rise and on landing (MOVE-21: 1.1 / 0.92). */
  rigStretch: 1.1,
  rigSquash: 0.92,
  /** A fall from higher than this lands with a plop (MOVE-25). */
  plopFall: 2,
  plopMs: 300,
  /** Dust on landing: this many puffs each side. */
  landDust: 3,
  /** Sparkles under the feet on a double jump. */
  airSparkles: 5,
  /** The 3D landing ring: `bursts` quads and how long it lasts. */
  ringQuads: 8,
  ringMs: 300,
} as const;

/**
 * MOVE-24: auto-hop on tap-to-move paths. Nav joins rising up to `hopRise` (one jump) or
 * `doubleRise` (a double jump) are open while the setting is on, and cells shut only by a
 * hop or standable piece no taller than `hopRise` cost `hopCost`. The Keeper jumps when the
 * ground `runUp` past its body (radius `body`) is higher than a step, or a hop piece is there.
 */
export const AUTO_HOP = {
  runUp: 0.3,
  body: 0.35,
  hopRise: 0.85,
  doubleRise: 1.55,
  hopCost: 3,
} as const;
