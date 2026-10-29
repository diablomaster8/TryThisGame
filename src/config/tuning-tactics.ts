/**
 * Every number the grid-tactics mode uses (`src/sim/battle/tactics/`, recs FIGHT-50 to
 * FIGHT-65). Kept apart from `tuning-battle.ts` so the tactics core can be retuned on its own;
 * `tuning-battle.ts` re-exports it, and `tuning.ts` re-exports that.
 */
export const TACTICS = {
  /** Maps (FIGHT-50, FIGHT-51). Sides are in tiles; heights are levels 0..maxHeight. */
  map: {
    min: 8,
    maxPhone: 14,
    maxDesk: 16,
    maxHeight: 4,
    /** Chance of a +1 bump on a dry Hollow tile, for a little texture. */
    bump: 0.12,
    /** Tiles per deploy zone. */
    deploy: 4,
    /** The open-field sampler's tile, in world units (1.5 like a Hollow cell). */
    fieldTile: 1.5,
    /** World units per height level when sampling the Grove's ground. */
    fieldLevel: 0.6,
  },
  /** Movement (FIGHT-52): Move = 3 + ⌊Run/25⌋, Jump = 1 + ⌊Fly/33⌋ (+1 Featherlight). */
  move: {
    base: 3,
    runPer: 25,
    jumpBase: 1,
    flyPer: 33,
    /** Deep water: Swim types, or Swim level at least this, may enter. */
    deepSwim: 30,
    /** A fall from this many levels or more bumps the unit. */
    fallFrom: 3,
    fallShare: 0.1,
  },
  /** Charge time (FIGHT-53). */
  ct: {
    full: 100,
    /** CT gained per tick = Zip / zipDiv. */
    zipDiv: 10,
    /** Kept after a turn for not moving, and for not acting. */
    keepNoMove: 20,
    keepNoAct: 20,
    /** The turn strip shows this many actors. */
    strip: 8,
  },
  /** Puff on the grid: +1 at each turn start, +2 more for a turn spent without acting. */
  puff: { perTurn: 1, rest: 2 },
  /** Facing and height (FIGHT-54). */
  facing: {
    side: 1.15,
    back: 1.35,
    sideAcc: 0.1,
    heightPer: 0.08,
    heightMax: 0.24,
    /** Ranged reach +1 per this many height levels above the target. */
    reachPer: 2,
  },
  /** Jobs (FIGHT-55). */
  jobs: {
    dasherBack: 1.5,
    bonkerGuard: 1.2,
    gliderJump: 1,
    dasherMove: 1,
    sunnyHeal: 1.25,
    sunnyLantern: 1.1,
    moonyStatus: 1.15,
    moonyShade: 1.1,
    keeperAura: 1.05,
    puddlerWaterHeal: 0.1,
    lanternAura: 1.1,
  },
  /** Terrain (FIGHT-56). */
  terrain: {
    tallGrassFlutter: 0.1,
    tallGrassHideBeyond: 3,
    pathCost: 0.5,
    mudCost: 2,
    deepCost: 2,
    swimInShallow: 1.1,
    lanternRadius: 2,
    lanternMoves: 1.1,
    shadeMoves: 1.1,
    crystalReflect: 0.25,
  },
  /** Ranged and combos (FIGHT-57). */
  range: {
    arcClear: 2,
    pileWindow: 5,
    pileOn: 1.2,
    friendsAt: 60,
    comboPuff: 4,
    comboPower: 70,
  },
  /** Objectives (FIGHT-58). */
  objective: {
    calmPerBonk: -5,
    calmPerKind: 25,
    protectTurns: 3,
  },
  /** The utility AI (FIGHT-59). */
  ai: {
    damage: 1,
    tucker: 0.6,
    back: 0.3,
    height: 0.2,
    threat: 0.5,
    objective: 1,
    keeperNoise: 0.1,
    budgetMs: 8,
  },
  /** The vertical slice (FIGHT-65). */
  slice: { size: 10, shells: 40, level: 12 },
  /** Safety: a bout ends as a draw after this many turns. */
  maxTurns: 400,
  logCap: 200,
} as const;
