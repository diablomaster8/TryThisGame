/**
 * Numbers for lane C round 5 of the battle core, kept apart from `tuning-battle.ts` so this
 * round does not reshape the shared table: the ATB "Command" mode (recs FIGHT-40, FIGHT-41),
 * turn-based doubles (FIGHT-60) and the stalemate guard the balance harness asks for (FIGHT-81).
 */
export const BATTLE_ATB = {
  /** Each 100 ms tick a combatant's gauge gains (zipBase + Zip) × rate; it acts at `full`. */
  rate: 0.04,
  zipBase: 20,
  full: 100,
  /** The ATB clock moves in ticks this long, however the sim's step is chunked. */
  tickMs: 100,
  /** One step never moves the bout more than this, so a clock jump can't resolve a fight. */
  maxCatchupMs: 500,
  /** An ATB "round" (for statuses that count rounds, the stalemate guard and the time limit). */
  roundMs: 3000,
  /** Each command button waits this long after use, like the race cheer. */
  cooldownMs: 3000,
  /** Obedience p = base + perAffection × affection + perTrust × trust, at most `cap`. */
  obey: { base: 0.4, perAffection: 0.004, perTrust: 0.002, cap: 0.95 },
  /** "Careful!" picks a support move when an ally on the field is below this share of HP. */
  carefulHurt: 0.5,
} as const;

/** Turn-based doubles (recs FIGHT-60): two on the field a side. */
export const BATTLE_DOUBLES = {
  slots: 2,
  /** A move that hits both foes deals this share to each. */
  spread: 0.75,
} as const;

/**
 * The stalemate guard (recs FIGHT-81): after this many turns every Guard stat counts at
 * `guardMult`, so two walls still finish before the 60-turn draw.
 */
export const BATTLE_STALEMATE = { afterTurn: 40, guardMult: 0.5 } as const;
