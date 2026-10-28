/**
 * Every number the battle core uses (`src/sim/battle/`), kept apart from `tuning.ts` so the
 * combat lane can grow without touching the shared file; `tuning.ts` re-exports it. The derived
 * stats are the old karate maths, now shared by every mode (recs FIGHT-01, FIGHT-04).
 */
export const BATTLE = {
  /** Derived stats: HP from Stamina, strike power from Power, dodge from Run. */
  derive: {
    hp: 100,
    hpPerStamina: 1.2,
    power: 10,
    powerPerLevel: 0.9,
    dodgePerRun: 0.004,
    dodgeCap: 0.35,
    /** The `thickSkin` skill. */
    thickSkinHp: 10,
  },
  /**
   * Rival strength follows the party (recs FIGHT-06): level = clamp(party average + offset,
   * floor, cap) per tier, so the first bout is winnable for a fresh Nubbin and the third is not.
   */
  rivals: {
    tierOffset: [-4, 0, 6] as const,
    tierFloor: [0, 15, 40] as const,
    tierCap: [20, 50, 99] as const,
    /** Tier 1 rivals have this share of the party's average HP. */
    tier1HpShare: 0.8,
    /** Seeded spread on rival HP and power. */
    hpSpread: [0.85, 1.15] as const,
    powerSpread: [0.85, 1.05] as const,
    /** Foes dodge less than a Nubbin of the same level. */
    dodgeShare: 0.8,
    dodgeCap: 0.3,
    /** Party-bout foes start a little softer than a dojo rival. */
    foePower: 8,
    foeHpShare: 0.8,
  },
  /** The turn-based party bout (SL2 "Logged In"). */
  turn: {
    /** At most this many foes; never more than the party has members, so the odds stay even. */
    foesPerTier: 3,
    /** A struck guard takes this share. */
    guardFactor: 0.5,
    /** Rally heals every standing ally by this share of max HP. */
    rallyHeal: 0.15,
    /** Seeded spread on a strike. */
    hitSpread: [0.8, 1.2] as const,
    foeGuardChance: 0.15,
    /** Turns before a bout is called a draw, so a guard-only bout still ends. */
    maxRounds: 60,
    /** Foe-name slots in `strings-battle.ts`. */
    foeNames: 6,
  },
  /** The timed dojo bout. */
  karate: {
    tiers: 3,
    /** A tap this close to the bar's centre (0 centre, 1 edge) is a strong strike. */
    sweetSpot: 0.18,
    strong: 1.6,
    weak: 0.6,
    hitSpread: [0.9, 1.1] as const,
    rivalStrongChance: 0.3,
    rivalStrong: 1.3,
    rivalWeak: 0.7,
    /** ms between rival strikes: base minus per tier, never below the floor. */
    rivalEveryMs: 1700,
    rivalEveryPerTier: 220,
    rivalEveryFloorMs: 900,
    rivalFirstMs: 1800,
    /** Bar swings per second: base plus per tier. */
    barSpeed: 0.9,
    barSpeedPerTier: 0.25,
    /** A bout ends as a loss after this long, so a player who never taps still finishes. */
    maxMs: 120_000,
  },
  /** Prizes, computed in the sim from the tier (recs FIGHT-02). Losing never costs Shells. */
  prizes: {
    karate: [25, 60, 120] as const,
    karateLoss: 5,
    party: [20, 50, 110] as const,
    /** A lost party bout pays this share of the tier prize. */
    partyLossShare: 0.25,
    encounter: [15, 35, 80] as const,
    encounterLossShare: 0,
  },
  /** Kept in the save so a bout log stays small. */
  logCap: 200,
} as const;
