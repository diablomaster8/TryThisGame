/**
 * TECH-36: the `battle` tuning domain. Re-exports the satellite tuning files that belong to it
 * (the file names still carry the review pass that added them), so a number can be found by
 * domain. `tests/arch/tuning-domains.test.ts` checks every tuning-*.ts file is in one domain.
 */
export * from '../tuning-battle-atb';
export * from '../tuning-more/battle-doors';
export * from '../tuning-more/battle-ladder-fusion';
export * from '../tuning-friendly-match';
export * from '../tuning-more/battle-champions';
export * from '../tuning-battle';
export * from '../tuning-tactics';
export * from '../tuning-battle-3d';
