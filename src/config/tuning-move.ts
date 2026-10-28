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

/**
 * MOVE-27: the Fly perk's glide. Holding jump while falling caps the fall at `maxFall` u/s
 * for up to `maxMs` per time in the air, and the Keeper moves `airSpeed` times faster.
 */
export const GLIDE = {
  maxFall: 1.6,
  maxMs: 1200,
  airSpeed: 1.2,
} as const;

/**
 * MOVE-26: what a jump does in the Grove. Within `trunkReach` of a fruit tree's centre in
 * the air, the tree shakes (once per `treeCooldownMs`). Over a sitting Nubbin, within
 * `leapReach` and at least `leapClear` above its ground, it giggles: `leapHappiness`, a
 * heart, once per `leapCooldownMs` for that Nubbin.
 */
export const JUMP_PLAY = {
  trunkReach: 0.85,
  treeCooldownMs: 3000,
  leapReach: 0.5,
  leapClear: 0.4,
  leapHappiness: 2,
  leapCooldownMs: 10_000,
} as const;

/** MOVE-26: on a standable top at least `minTop` up, the camera looks `lift` higher. */
export const PERCH = { minTop: 0.5, lift: 0.4, rate: 3 } as const;
