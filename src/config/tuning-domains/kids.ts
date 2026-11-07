/**
 * TECH-36: the `kids` tuning domain. Re-exports the satellite tuning files that belong to it
 * (the file names still carry the review pass that added them), so a number can be found by
 * domain. `tests/arch/tuning-domains.test.ts` checks every tuning-*.ts file is in one domain.
 */
export * from '../tuning-dlg';
export * from '../tuning-more/kids-screens';
export * from '../tuning-kids';
export * from '../tuning-more/kids-session-flow';
export * from '../tuning-more/kids-noticing';
export * from '../tuning-buddy';
