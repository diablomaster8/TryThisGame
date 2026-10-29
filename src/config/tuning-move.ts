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

/**
 * MOVE-35: the "Can't get there" toast shows at most once per `toastEveryMs`; a shut-in
 * tap's stand-in point counts as reached within `standInReach`.
 */
export const UNREACHABLE = { toastEveryMs: 20_000, standInReach: 0.45 } as const;

/** MOVE-38: the nav overlay shows cells within `navReach` of the Keeper, `dotPx` across. */
export const DEBUG_OVERLAY_LOOK = { navReach: 12, dotPx: 4 } as const;

/** MOVE-33: a thrown body's radius against solids, and how much sideways speed a bonk keeps. */
export const THROWN_BONK = { radius: 0.25, restitution: 0.4 } as const;

/**
 * MOVE-41: slopes slow the climb and speed the descent a little. Pace is
 * `1 − up·rise + down·fall` (rise/run of the hills along the motion, over `probe` units),
 * clamped to `[min, max]`. The rec's 0.35/0.1 assumed steeper ramps: the terrace ramps rise
 * only 0.08–0.27 per unit, so 2.0/0.6 gives the asked ~0.8× climb. The ground's gentle roll
 * is left out. The 3D rig leans `lean` of the slope angle into it.
 */
export const KEEPER_SLOPE = {
  up: 2.0,
  down: 0.6,
  min: 0.65,
  max: 1.1,
  probe: 0.6,
  lean: 0.3,
} as const;

/**
 * MOVE-42: running as a mode. A running jump carries `airCarry`× further; tap walks longer
 * than `autoRunOver` units run by themselves with Auto-run on (set on for a phone at its
 * first launch); on a phone the Run toggle turns itself off after `idleResetMs` standing
 * still; Pixel dust puffs every `dustRunMs` running (`dustWalkMs` walking).
 */
export const RUN_MODE = {
  airCarry: 1.15,
  autoRunOver: 10,
  idleResetMs: 3000,
  dustRunMs: 140,
  dustWalkMs: 260,
} as const;

/**
 * MOVE-43: soft bushes. Walking into one rustles it (Pixel and 3D shake `shakeMs` at
 * `shakeAmp` units, about 3× the wind) and sheds leaves `leafChance` of the time. Each bush
 * may hide one shell, found once per save: the chance on a visit is `findPerHour` per sim
 * hour since the bush was last looked in. A Shy Nubbin picks a bush to sit in `shyChance`
 * of its idle choices (`shyRadius` units round it).
 */
export const BUSH = {
  shakeMs: 400,
  shakeAmp: 0.08,
  leafChance: 0.1,
  findPerHour: 0.02,
  findShells: 1,
  shyChance: 0.3,
  shyRadius: 10,
} as const;

/**
 * MOVE-44: after a tap, `dots` footprint dots along the walk's path fade over `dotsMs`; the
 * target marker stays up to `markMs` or until the walk ends. Under reduced motion both go
 * after `reducedMs`.
 */
export const TAP_PATH = {
  dots: 5,
  dotsMs: 600,
  markMs: 2000,
  reducedMs: 200,
  /** The route is read again for this long after the tap, while the sim plans it. */
  settleMs: 150,
} as const;

/**
 * MOVE-46: footfalls by surface. A step sounds every `stride` units walked: a hollow tok on
 * a deck or a bench, a light tap on stone, nothing on grass and paths. Pixel's grass gives
 * a green tuft every `tuftEvery`th puff instead of dust.
 */
export const FOOTFALL = {
  stride: 0.7,
  tuftEvery: 2,
} as const;

/**
 * MOVE-50: a jump that comes up short of a lip (its arc would not lift the feet onto it)
 * climbs the rest in a mantle of `ms`, when the lip is more than `minRise` over the feet.
 * The reach is the step allowance (`JUMP.stepUp`, 0.35 u), as before, now with a climb to
 * see instead of a pop: a 0.95 jump mantles onto a 1.2 lip and falls back from a 1.4 one.
 */
export const MANTLE = { ms: 250, minRise: 0.12 } as const;

/** MOVE-51: the jump button's hold ring fills over `ringMs`, about a held jump's rise. */
export const JUMP_BUTTON = { ringMs: 280 } as const;
