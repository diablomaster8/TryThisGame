/**
 * TECH-36: the `sim` tuning domain. Re-exports the satellite tuning files that belong to it
 * (the file names still carry the review pass that added them), so a number can be found by
 * domain. `tests/arch/tuning-domains.test.ts` checks every tuning-*.ts file is in one domain.
 */
export * from '../tuning-sim';
export * from '../tuning-tech';
export * from '../tuning-more/sim-access';
