/**
 * The grid-tactics mode's public surface (recs FIGHT-50 to FIGHT-59). Importing this file also
 * installs the AI, so a side with an AI level plays itself. The turn-mode battle API in
 * `../index.ts` is untouched; tactics bouts live beside it, in `world.tactics`.
 */
export * from './types';
export {
  activeUnit,
  affected,
  canDo,
  chargeTiles,
  createTactics,
  hitChance,
  hitMult,
  mapOf,
  movesOf,
  preview,
  reachOf,
  tacticsAct,
  tacticsForfeit,
  togetherMates,
  turnStrip,
  unitOf,
  type PreviewRow,
  type TacticsSetup,
  type UnitSeed,
} from './engine';
export { aiTurn, suggest } from './ai';
export { canAim, gridOf, aoeTiles, manhattan } from './range';
export { routeTo } from './path';
export { decodeMap, encodeMap, mapFromFloor, mapFromRows, heightAt, tileAt, blocks } from './map';
export { mapFromField } from './map-field';
export { terrainOf } from './terrain';
export { chipOf } from './objectives';
export { DIRS, dirTo } from './facing';
export { jobOfNubbin, jobOfSpecies } from './jobs';
export { unitFromLevels, unitFromNubbin } from './units';
