/**
 * TECH-36: the `move` tuning domain. Re-exports the satellite tuning files that belong to it
 * (the file names still carry the review pass that added them), so a number can be found by
 * domain. `tests/arch/tuning-domains.test.ts` checks every tuning-*.ts file is in one domain.
 */
export * from '../tuning-move-joy';
export * from '../tuning-move-npc';
export * from '../tuning-move-nub';
export * from '../tuning-more/move-keeper-ui';
export * from '../tuning-more/move-npc-colliders';
export * from '../tuning-move-race';
export * from '../tuning-move-wild';
export * from '../tuning-move';
export * from '../tuning-occlude';
