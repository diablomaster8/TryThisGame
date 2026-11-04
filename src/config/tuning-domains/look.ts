/**
 * TECH-36: the `look` tuning domain. Re-exports the satellite tuning files that belong to it
 * (the file names still carry the review pass that added them), so a number can be found by
 * domain. `tests/arch/tuning-domains.test.ts` checks every tuning-*.ts file is in one domain.
 */
export * from '../tuning-look-r10e';
export * from '../tuning-look';
export * from '../tuning-digi';
export * from '../tuning-pkb';
export * from '../tuning-fx3d';
export * from '../tuning-px';
