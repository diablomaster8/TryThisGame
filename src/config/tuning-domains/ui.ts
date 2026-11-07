/**
 * TECH-36: the `ui` tuning domain. Re-exports the satellite tuning files that belong to it
 * (the file names still carry the review pass that added them), so a number can be found by
 * domain. `tests/arch/tuning-domains.test.ts` checks every tuning-*.ts file is in one domain.
 */
export * from '../tuning-ui';
export * from '../tuning-hud-world';
export * from '../tuning-more/ui-shake-sheet';
export * from '../tuning-more/ui-tap-prints-border';
export * from '../tuning-more/ui-shake-hint';
export * from '../tuning-more/ui-world-hints';
export * from '../tuning-more/ui-inspect-egg';
export * from '../tuning-more/ui-first-loop';
export * from '../tuning-more/ui-system-throttle';
