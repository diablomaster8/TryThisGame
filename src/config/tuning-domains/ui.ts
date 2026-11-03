/**
 * TECH-36: the `ui` tuning domain. Re-exports the satellite tuning files that belong to it
 * (the file names still carry the review pass that added them), so a number can be found by
 * domain. `tests/arch/tuning-domains.test.ts` checks every tuning-*.ts file is in one domain.
 */
export * from '../tuning-ui';
export * from '../tuning-hud-world';
export * from '../tuning-r8d';
export * from '../tuning-r9d2';
export * from '../tuning-r9d3';
export * from '../tuning-r9d4';
export * from '../tuning-r10d2';
export * from '../tuning-r11d4';
