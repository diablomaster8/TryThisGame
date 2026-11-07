/**
 * TECH-36: the `perf` tuning domain. Re-exports the satellite tuning files that belong to it
 * (the file names still carry the review pass that added them), so a number can be found by
 * domain. `tests/arch/tuning-domains.test.ts` checks every tuning-*.ts file is in one domain.
 */
export * from '../tuning-more/perf-tiers';
export * from '../tuning-more/perf-view-cache';
export * from '../tuning-more/perf-platform';
export * from '../tuning-more/perf-offline-packs';
export * from '../tuning-more/perf-catchup';
export * from '../tuning-more/perf-heap-pool';
