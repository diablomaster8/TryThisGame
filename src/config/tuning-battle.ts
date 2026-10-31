/**
 * Every number the battle core uses (`src/sim/battle/`), kept apart from `tuning.ts` so the
 * combat lane can grow without touching the shared file; `tuning.ts` re-exports it. The derived
 * stats are the old karate maths, now shared by every mode (recs FIGHT-01, FIGHT-04).
 */
export const BATTLE = {
  /**
   * Derived stats from the five care stats (recs FIGHT-10), L = level 0–99:
   * HP = 24 + 1.5·L(stamina) + 0.5·L(power); Bonk = 10 + L(power);
   * Splash = 10 + 0.7·L(swim) + 0.3·L(stamina); Guard = 10 + 0.5·L(stamina) + 0.5·L(power);
   * Zip = 10 + L(run); Flutter = min(0.2, 0.002·L(fly)); Puff max = 6 + ⌊L(stamina)/20⌋.
   */
  derive: {
    /** Lane C r10 (R0274): 30 → 24, the 2,000-bout Champion median 15 → 14. */
    hp: 24,
    hpPerStamina: 1.5,
    hpPerPower: 0.5,
    bonk: 10,
    bonkPerPower: 1,
    splash: 10,
    splashPerSwim: 0.7,
    splashPerStamina: 0.3,
    guard: 10,
    guardPerStamina: 0.5,
    guardPerPower: 0.5,
    zip: 10,
    zipPerRun: 1,
    flutterPerFly: 0.002,
    flutterCap: 0.2,
    puffMax: 6,
    puffPerStamina: 1 / 20,
    /** Children fight at this share of every stat, Eternals at the second; Shadows at 1. */
    child: 0.85,
    eternal: 1.1,
    /** The `thickSkin` skill. */
    thickSkinHp: 10,
  },
  /** One damage formula (recs FIGHT-11). */
  damage: {
    /** dmg = power × (A + soak)/(D + soak) × scale × type × align × stab × crit × spread. */
    soak: 20,
    scale: 0.35,
    stab: 1.2,
    critChance: 1 / 16,
    crit: 1.5,
    spread: [0.9, 1.1] as const,
    /** A non-crit hit never takes more than this share of the target's max HP. */
    capShare: 0.6,
    /** Moves a level-3 lesson has polished hit this much harder. */
    lessonBoost: 1.25,
  },
  /** The type loop and the Sun/Moon layer (recs FIGHT-13). */
  chart: {
    strong: 1.5,
    weak: 0.67,
    /** A Sun move on a Moon-band target, or the reverse. */
    across: 1.25,
    /** A Sun move on a Sun target, a Moon move on a Moon target. */
    same: 0.9,
  },
  /** One shared energy bar (recs FIGHT-14). */
  puff: {
    start: 3,
    regen: 2,
    /** "Catch your breath": Puff gained and the Guard boost for the turn. */
    breath: 4,
    breathGuard: 1.3,
    /** Below this share of needs.energy a Nubbin starts "Yawny" with this much Puff. */
    yawnyEnergy: 0.3,
    yawnyStart: 1,
  },
  /** Cosy statuses (recs FIGHT-15). Turn ranges are inclusive. */
  status: {
    drowsy: { turns: [1, 3] as const },
    dizzy: { turns: [2, 4] as const, chance: 0.33, selfShare: 1 / 8 },
    soggy: { turns: [3, 3] as const, zip: 0.7 },
    giggly: { turns: [3, 3] as const, chance: 0.25 },
    /** A burn that food cures; without battle items yet it also wears off. */
    peckish: { turns: [4, 6] as const, share: 1 / 16 },
    sticky: { turns: [2, 2] as const },
    /** Mood stages are ±1 per move, at most ±2, ×1.25 per stage. */
    moodStep: 1.25,
    moodMax: 2,
    /** A personality that resists a status or mood halves its chance. */
    resist: 0.5,
    /** Mischievous Nubbins land statuses this much more often. */
    mischief: 1.1,
  },
  /** Grade traits (recs FIGHT-12): A grades get these odds of the S effect. */
  traits: {
    halfChance: 0.5,
    /** Run A "Head Start" adds this priority on turn 1; Run S always goes first. */
    headStartA: 0.5,
    headStartS: 5,
  },
  /** Turn order (recs FIGHT-18): priority, then Zip × this spread, then a seeded tiebreak. */
  order: {
    zipSpread: [0.95, 1.05] as const,
    /** Catch your breath (and later switching and items) goes first. */
    breathPriority: 3,
    /** Swapping in a benched Nubbin and using an item go first too (FIGHT-19, FIGHT-20). */
    swapPriority: 3,
    itemPriority: 3,
  },
  /** Battle items from the inventory (recs FIGHT-20). */
  items: {
    /** Plain fruit heals this share of max HP and cures Peckish. */
    fruitHeal: 0.3,
    /** A Sun or Moon fruit lends its alignment to the holder's moves this many turns. */
    alignTurns: 3,
    /** A thrown toy: the foe skips this many turns playing with it (once per foe). */
    toySkip: 1,
    /** At most this many items per side per turn. */
    perTurn: 2,
  },
  /** Befriending wild foes (recs FIGHT-21): Calm 0..100. */
  befriend: {
    max: 100,
    /** Calm += base + low × (1 − hp/maxHp) + treat, for a snack or a gentle move. */
    base: 15,
    low: 25,
    /** A flavoured fruit offered as a snack is a better treat than plain fruit. */
    treatFlavour: 10,
    /** A toy thrown at a wild foe. */
    toy: 20,
    /** Bonking a wild foe. */
    bonk: -5,
    /** A tuckered wild foe goes home and fills this much of its scan. */
    tuckeredScan: 25,
    /** No room on the roster: the thank-you gift. */
    giftShells: 30,
  },
  /** The three AI levels (recs FIGHT-23) and the personality overlay. */
  ai: {
    /** Lane C r8 (R0274): a Sprout mostly picks a hit when it has one, so bouts end in 6–14. */
    sprout: { breath: 0.2, hitShare: 0.8 },
    keeper: { funPick: 0.15, switchChance: 0.3, badMatchup: 1.5 },
    /**
     * Snacks under this HP share; swaps from a matchup this bad (off: it did not help in the
     * mirror test); judges each choice over this many rolls; a non-hit must beat the best hit
     * by `margin`; the score weighs the foe's HP by `aggression`, a standing one by `upWorth`,
     * a status and each mood stage by their worths.
     */
    champion: {
      itemBelow: 0.4,
      swapAt: 99,
      samples: 3,
      depth: 1,
      margin: 0.1,
      aggression: 5,
      upWorth: 0.6,
      puffWorth: 0,
      statusWorth: 0.5,
      moodWorth: 0.1,
    },
    personality: {
      cheerfulAllyBelow: 0.5,
      shyGuardBelow: 0.4,
      mischiefStatus: 0.15,
      lazyBreath: 0.1,
    },
  },
  /** Gentle bouts (recs FIGHT-24). */
  gentle: {
    /** The bout ends in a play-fight hug after this many turns if nobody is tuckered. */
    hugAfter: 8,
    /** Prizes are this share of the usual. */
    prizeShare: 0.5,
    /** The free cuddle fruit heals this share. */
    cuddleHeal: 0.3,
  },
  /** The dojo's Power swing (recs FIGHT-28): a Bonk with a sweet-spot tap hits this hard. */
  swing: { sweet: 1.2 },
  /** The future tactical grid (recs MOVE-61): tiles of 1 unit, height levels of 0.5. */
  grid: { tile: 1, level: 0.5, jumpBase: 1, jumpPer: 30, moveBase: 3, movePer: 25 },
  /** The battle stage in the open Grove (recs MOVE-62): units. */
  arena: {
    radius: 10,
    /** A combatant's body and a thrown move's radius. */
    body: 0.4,
    thrown: 0.2,
    /** Sweeps move in steps this long, so nothing tunnels through a thin fence. */
    step: 0.1,
  },
  /** The Grove Circuit (recs FIGHT-22). */
  circuit: {
    /** Rematch teams are this many levels above the tier-3 level for the party. */
    championBonus: 8,
    gimmickBoost: 1.1,
    /** Dusty's team starts Drowsy this often. */
    napChance: 0.5,
    prize: [60, 120, 200] as const,
    championPrize: 300,
    skillPoints: 1,
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
    /** Party-bout foes start a little softer than a dojo rival: a share of every stat. */
    foeShare: 0.8,
    foeHpShare: 0.8,
  },
  /** The turn-based party bout (SL2 "Logged In"). */
  turn: {
    /** At most this many foes; never more than the party has members, so the odds stay even. */
    foesPerTier: 3,
    /** "Huddle" (the old Rally) heals every standing ally by this share of max HP. */
    rallyHeal: 0.15,
    /** Higher-tier rivals catch their breath this often when a move is affordable. */
    foeGuardChance: 0.15,
    /** And use a status or mood move this often when they have one. */
    foeStatusChance: 0.3,
    /** Turns before a bout is called a draw, so a guard-only bout still ends. */
    maxRounds: 60,
    /** Foe-name slots in `strings-battle.ts`. */
    foeNames: 6,
  },
  /** The timed dojo bout. */
  karate: {
    tiers: 3,
    /** The timed bout scales the derived HP up so it lasts as long as the old dojo bout. */
    hpScale: 3.3,
    /** A guarded strike (old turn guard) takes this share. */
    guardFactor: 0.5,
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
export { TACTICS } from './tuning-tactics';

/**
 * Lane C round 5 (recs FIGHT-70, -73, -74, -90): shared content rules, what a bout feeds back
 * into care, the one-time rewards and how rivals are picked. Kept as its own block so the
 * balance numbers above can change without touching it.
 */
export const BATTLE_CONTENT = {
  /** One turn of a status lasts this many CT ticks on the grid (FIGHT-70). */
  ctPerTurn: 10,
  /** A turn move's priority +1 is worth this much CT on the grid for its user. */
  ctPerPriority: 10,
} as const;

export const BATTLE_PROGRESS = {
  /** Stat points per use of a move (before the grade multiplier). */
  perUse: 4,
  /** At most this many raw points to any one stat from one bout. */
  capPerStat: 60,
  /** Energy a bout costs (0..1), a little less than the gym's 0.15. */
  energyCost: 0.1,
  happyWin: 3,
  happyLoss: 1,
  /** A child with this many more bout wins than losses leans Cheerful; the reverse, Shy. */
  leanGap: 3,
} as const;

export const BATTLE_ONCE = {
  /** The hat the first win at each tier gives, by tier (one-time). */
  // Existing registry hats for now; a dedicated prize hat per tier is a cosmetics-lane job.
  firstWinHats: ['party', 'top-hat', 'halo-band'] as const,
} as const;
