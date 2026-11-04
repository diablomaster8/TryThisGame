/**
 * TECH-36: the `world` tuning domain. Re-exports the satellite tuning files that belong to it
 * (the file names still carry the review pass that added them), so a number can be found by
 * domain. `tests/arch/tuning-domains.test.ts` checks every tuning-*.ts file is in one domain.
 */
export * from '../tuning-world';
export * from '../tuning-r11d1';
export * from '../tuning-r11d2';
export * from '../tuning-r11d6';
export * from '../tuning-r11d8';
export * from '../tuning-r11d7';
export * from '../tuning-r12d1';
