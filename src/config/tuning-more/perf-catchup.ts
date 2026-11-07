// was tuning-r11d3; review pass R11 D3
/* Lane D r11 (d3): tunables for the catch-up and autosave budgets (TECH-73, TECH-09). */

/** TECH-73: a very long absence with a full Grove must still catch up quickly in Node. */
export const CATCHUP_PERF = {
  /** Days away, `indefinite`. */
  days: 30,
  /** Nubbins in the Grove (the roster cap). */
  nubbins: 8,
  /** Budget for the whole catch-up on the dev machine (CI scales it, see timing-budget.ts). */
  budgetMs: 1500,
} as const;
