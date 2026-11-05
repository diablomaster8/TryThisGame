/**
 * TECH-36: the `soul` tuning domain. Re-exports the satellite tuning files that belong to it
 * (the file names still carry the review pass that added them), so a number can be found by
 * domain. `tests/arch/tuning-domains.test.ts` checks every tuning-*.ts file is in one domain.
 */
export * from '../tuning-soul-r10';
export * from '../tuning-soul-r10b';
export * from '../tuning-soul-r11';
export * from '../tuning-soul-r11a';
export * from '../tuning-soul-r11b';
export * from '../tuning-soul-r11g';
export * from '../tuning-soul-r11h';
export * from '../tuning-soul-r12a';
export * from '../tuning-soul-r8';
export * from '../tuning-soul-r9';
