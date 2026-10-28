/**
 * The battle core's public surface. Everything here is pure sim: no DOM, no Three.js, no
 * player-facing text, and randomness only from the seeded `Rng` kept in `rngState`.
 *
 * - Pure: `createBattle(world, context, seed)`, `battleAct(state, action)`,
 *   `battleForfeit(state)`, `replay(start, actions)`.
 * - World commands (the live bout in `world.battle`): `battleStart {context}`,
 *   `battleAct {action}`, `battleForfeit`. A finished bout is paid once from the tier tables
 *   and emits `battleEnd {context, source, key, winner, reason, shells}`.
 * - Other systems (the Hollow, story beats) start a bout with an `encounter` context naming
 *   their `source`, a `key` and their foes, and match the `battleEnd` event.
 */
export type * from './types';
export {
  actBattleCmd,
  battleAct,
  battleForfeit,
  createBattle,
  forfeitBattleCmd,
  startBattleCmd,
} from './core';
export { combatantOf, combatLevels, rivalLevel } from './derive';
export { barAt, barOffsetAt } from './karate';
export { bestAllyAction } from './ai';
export { standing } from './damage';
export { battleSeedFor, contextKey, karatePrize, partyPrize, prizeFor } from './rewards';
export { replay } from './replay';
