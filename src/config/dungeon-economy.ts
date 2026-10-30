/**
 * The Hollow's economy (R0178, DUNG-35). The act floors are four times the old ones, with
 * packs and chests, so the old Shells formulas paid about 300 a standard level in Act I and
 * would empty the shop. `payout` scales every Shells pickup, pack top-up and level chest by
 * act; the targets below are what `tests/sim/economy-hollow.test.ts` holds the game to.
 *
 * Minutes per level are estimates (a careful Keeper exploring most of a level and beating
 * most packs); replace them with the rolling `HollowStats.levelMs` (R0211) once real play
 * numbers come in.
 */
export const HOLLOW_ECONOMY = {
  /** Shells payout scale by act index (Acts I to V); a run outside an act uses Act I's. */
  payout: [0.4, 0.42, 0.49, 0.56, 0.64] as const,
  /** Shells a standard level pays in Act I, and how that grows per act. */
  levelBand: { min: 80, max: 140, growthPerAct: 1.6 },
  /** Shells per minute: Act I and Act V (the acts between are in line), within ± `slack`. */
  perMinute: { first: 25, last: 60, slack: 0.2 },
  /** Where the Shells come from: pickups, packs and the chest, within ± `slack` (share). */
  split: { pickups: 0.4, packs: 0.3, chest: 0.3, slack: 0.15 },
  /** Estimated minutes per level by size, and the share longer each act takes. */
  minutes: { small: 3, standard: 4.8, big: 6.5, perAct: 0.3 },
  /** The Expedition's pace, which the Hollow should stay near rather than dwarf. */
  expeditionPerMinute: 30,
  /** The sinks, for the record (their prices live with their systems). */
  sinks: {
    acornBundle: 10,
    craftFee: { min: 5, max: 40 },
  },
} as const;
