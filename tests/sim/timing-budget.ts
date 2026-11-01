/**
 * HOT-CI: a timing test's budget (see `TIMING_BUDGET`). On a dev machine it is the budget as
 * written; in CI's `perf` job (`PERF=1`) it is scaled by `ciScale`; in CI's main suite the
 * wall-clock assert is skipped (an infinite budget), since parallel workers swamp it there.
 */
import { TIMING_BUDGET } from '../../src/config/tuning-sim';

export function budgetMs(ms: number = TIMING_BUDGET.ms): number {
  if (!process.env.CI) return ms;
  return process.env.PERF ? ms * TIMING_BUDGET.ciScale : Infinity;
}
