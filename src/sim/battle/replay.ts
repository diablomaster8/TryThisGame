import { battleAct } from './core';
import type { BattleAction, BattleState } from './types';

/**
 * Replays a bout: a fresh state (as `createBattle` made it) plus the actions, in order. The
 * state is cloned through JSON first, which is also what the save does, so a replay checks
 * both that the core is deterministic and that a saved bout resumes to the same result.
 */
export function replay(start: BattleState, actions: readonly BattleAction[]): BattleState {
  const s = JSON.parse(JSON.stringify(start)) as BattleState;
  for (const a of actions) battleAct(s, a);
  return s;
}
