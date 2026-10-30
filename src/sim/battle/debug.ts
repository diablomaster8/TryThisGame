/**
 * The debug panel's battle tools (recs FIGHT-80): set a combatant's HP, give or clear a major
 * status, and force a win or a loss. They arrive as a `{k:'debug'}` battle action, so they go
 * through the sim like any other command and a copied replay repeats them exactly. They use no
 * dice, so the rest of the bout's rolls stay where they were.
 */
import { end, settle } from './damage';
import { STATUS_IDS, type BattleDebugOp, type BattleState } from './types';

export function debugAct(s: BattleState, op: BattleDebugOp): boolean {
  if (op.op === 'win' || op.op === 'lose') {
    end(s, { k: 'end', winner: op.op === 'win' ? 0 : 1, reason: 'tuckered' });
    return true;
  }
  const c = [...s.sides[0], ...s.sides[1]].find((x) => x.id === op.who);
  if (!c) return false;
  if (op.op === 'hp') {
    if (!Number.isFinite(op.hp)) return false;
    c.hp = Math.max(0, Math.min(c.maxHp, Math.round(op.hp)));
    settle(s);
    return true;
  }
  if (op.id === null) {
    if (c.major) s.log.push({ k: 'status', to: c.id, id: c.major.id, on: false });
    c.major = null;
    return true;
  }
  if (!STATUS_IDS.includes(op.id)) return false;
  c.major = { id: op.id, turns: 3 };
  s.log.push({ k: 'status', to: c.id, id: op.id, on: true });
  return true;
}
