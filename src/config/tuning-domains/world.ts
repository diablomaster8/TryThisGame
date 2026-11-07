/**
 * TECH-36: the `world` tuning domain. Re-exports the satellite tuning files that belong to it
 * (the file names still carry the review pass that added them), so a number can be found by
 * domain. `tests/arch/tuning-domains.test.ts` checks every tuning-*.ts file is in one domain.
 */
export * from '../tuning-world';
export * from '../tuning-more/world-region-engine';
export * from '../tuning-more/world-camera-terrain';
export * from '../tuning-more/world-overview-puddles';
export * from '../tuning-more/world-region-sky';
export * from '../tuning-more/world-region-lands';
export * from '../tuning-more/world-content-tables';
export * from '../tuning-more/world-backdrops';
export * from '../tuning-more/world-region-moves';
export * from '../tuning-more/world-region-content';
export * from '../tuning-more/world-edu-trail-ice';
