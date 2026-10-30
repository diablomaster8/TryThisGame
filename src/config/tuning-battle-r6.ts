/**
 * Numbers for lane C round 6's battle work, kept apart from `tuning-battle.ts`: the Dojo
 * Ladder (recs FIGHT-99), Fusion burst (FIGHT-95), story-world and guardian bouts (FIGHT-98,
 * FIGHT-72), pass-and-play (FIGHT-96), trial maps (FIGHT-97) and the battle idles (FIGHT-78).
 */
export const BATTLE_R6 = {
  ladder: {
    /** White, yellow, green, brown, black. */
    belts: 5,
    /** Singles bouts per belt, each with a sharper rival. */
    bouts: 3,
    /** The rival's AI by bout within a belt, and from which belt each bout plays a level up. */
    ai: ['sprout', 'keeper', 'champion'] as const,
    /** The rival's level over the fighter's: + per belt. */
    levelPerBelt: 2,
    /** Shells per ladder bout won, by belt. */
    prize: [20, 30, 45, 60, 90] as const,
    /** The black belt's hat. */
    hat: 'black-belt',
  },
  fusion: {
    /** Both partners must have at least this bond. */
    bond: 80,
    /** Turns the fused combatant lasts (its own turns counted at each turn's end). */
    turns: 3,
    /** The fused combatant's Bonk, Splash and Guard over the sum of the two halves' best. */
    boost: 1.15,
    /** The fusion signature move. */
    move: 'fusion-burst',
  },
  /** The Hollow's floor-5 guardian: a calm-only boss at this depth. */
  guardian: { depth: 5, level: 6 },
  idle: {
    /** A personality idle plays every this long, seeded per view. */
    minMs: 3000,
    maxMs: 6000,
    /** How long one idle pose lasts. */
    playMs: 900,
  },
} as const;

/** Slapstick (recs FUN-74): the share of moves that fumble. */
export const FUN_FUMBLE = 0.05;
