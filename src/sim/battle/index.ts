/**
 * The battle core's public surface. Everything here is pure sim: no DOM, no Three.js, no
 * player-facing text, and randomness only from the seeded `Rng` kept in `rngState`.
 *
 * - Pure: `createBattle(world, context, seed)`, `battleAct(state, action)`,
 *   `battleForfeit(state)`, `replay(start, actions)`.
 * - World commands (the live bout in `world.battle`): `battleStart {context}`,
 *   `battleAct {action}`, `battleForfeit`, `battleSlots {nubbinId, slots}`. Actions: `strike`
 *   (Bonk), `guard` (catch your breath), `rally` (Huddle) and `move {move, target}`. A finished bout is paid once from the tier tables
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
  setBattlePrefsCmd,
  setSlotsCmd,
  startBattleCmd,
  stepBattleMoves,
} from './core';
export {
  combatantOf,
  combatLevels,
  deriveStats,
  rivalLevel,
  statMult,
  traitsOf,
  typeOf,
} from './derive';
export { MOVES, moveById, moveOf } from './moves';
export {
  battleOf,
  bestFour,
  peekBattle,
  setSlots,
  slottedMoves,
  sourcesOf,
  syncMoves,
} from './moves-sources';
export { alignMult, beats, LOOP, typeMult } from './types-chart';
export { canChoose, hasMove, moveIdOf } from './turn';
export { zipOf } from './status';
export { MOOD_STATS, STATUS_IDS } from './types';
export { barAt, barOffsetAt } from './karate';
export { bestAllyAction, chooseAction, levelFor } from './ai';
export { bench, puffCost, swapIn } from './turn';
export { bagFrom, BATTLE_ITEMS, itemsLeft } from './items';
export { calmGain } from './befriend';
export {
  CIRCUIT_GIMMICK,
  CIRCUIT_TIERS,
  circuitOf,
  circuitOpen,
  circuitTeam,
  circuitTier,
} from './circuit';
export { onField, standing } from './damage';
export { battleSeedFor, contextKey, karatePrize, partyPrize, prizeFor } from './rewards';
export { replay } from './replay';
export { autoResolve, skippable } from './auto';
export { pairSeen, seenPair } from './seen';
