import type { BattleAction, BattleState } from '../sim/battle';

/**
 * The live bout's replay record for the debug panel (recs FIGHT-80): the bout as the screen
 * first saw it (seed and all) and every action the screen sent, stamped with the ATB time for
 * a Command bout. "Copy replay" turns it into JSON; pasting that JSON back replays it through
 * the sim's own `replay` and compares the logs. UI-only bookkeeping: the sim never reads it.
 */
export interface BoutReplay {
  seed: number;
  start: BattleState;
  actions: { atMs: number; a: BattleAction }[];
}

let current: BoutReplay | null = null;

/** A new bout is on screen: keep a copy of it as it starts. */
export function recordStart(s: BattleState): void {
  current = {
    seed: s.seed,
    start: JSON.parse(JSON.stringify(s)) as BattleState,
    actions: [],
  };
}

export function recordAct(s: BattleState, a: BattleAction): void {
  if (!current || current.seed !== s.seed) return;
  current.actions.push({ atMs: s.atb?.timeMs ?? 0, a: JSON.parse(JSON.stringify(a)) });
}

export function currentReplay(): BoutReplay | null {
  return current;
}
