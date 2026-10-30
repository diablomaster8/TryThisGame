/**
 * Numbers for lane C round 5's battle doors and helpers, kept apart from `tuning-battle.ts`:
 * the pre-bout sheet's difficulty (recs FIGHT-86), skipped story bouts (FIGHT-71), the timing
 * ring and "Steady hands" (FIGHT-87, FIGHT-79), the matchup memory (FIGHT-77) and the debug
 * panel's battle tools (FIGHT-80).
 */
export const BATTLE_R5 = {
  /** Spicy: the rivals play as the Champion and the Shells prize is this much bigger. */
  spicyPrize: 1.25,
  /** A skipped story bout pays this share of the base prize. */
  autoPrize: 0.5,
  /** A skipped bout favours the Keeper's side: HP, Bonk, Splash and Guard ×this. */
  autoFavour: 1.2,
  /** A skipped bout stops after this many actions, and counts as won either way. */
  autoMaxActions: 400,
  /** "Steady hands": every Bonk-kind move hits this hard, with no ring to tap. */
  steady: 1.1,
  /** The timing ring: no tap within this long counts as a plain hit. */
  ringTimeoutMs: 1200,
  /** Matchups remembered for the effectiveness badges (6 types each way is 36). */
  seenCap: 64,
  /** The debug panel's "simulate" button: bouts per press and the action cap per bout. */
  simBouts: 100,
  simMaxActions: 300,
} as const;
