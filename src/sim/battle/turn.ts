import { BATTLE } from '../../config/tuning-battle';
import type { Rng } from '../rng';
import { foeChoice } from './ai';
import { end, settle, standing, strikeOn } from './damage';
import type { BattleAction, BattleState, Combatant } from './types';

/**
 * The turn-based resolver (party bouts and encounters). Each standing ally picks Strike (at a
 * foe it names), Guard or Rally in turn; after the last ally the rivals act, then a new round
 * begins. Tuckered allies stay on the field asleep and are skipped; tuckered rivals have gone
 * home. Returns false for an action that does not apply, leaving the state untouched.
 */
const T = BATTLE.turn;

function act(s: BattleState, rng: Rng, me: Combatant, a: BattleAction, foes: Combatant[]): void {
  if (a.k === 'strike') {
    const up = foes.filter(standing);
    const to = up.find((c) => c.id === a.target) ?? up[0];
    if (to) strikeOn(s, rng, me, to, 1, T.hitSpread, T.guardFactor);
  } else if (a.k === 'guard') {
    me.guard = true;
    s.log.push({ k: 'guard', by: me.id });
  } else if (a.k === 'rally') {
    let heal = 0;
    for (const ally of s.sides[me.side].filter(standing)) {
      const add = Math.min(ally.maxHp - ally.hp, Math.round(ally.maxHp * T.rallyHeal));
      ally.hp += add;
      heal += add;
    }
    s.log.push({ k: 'rally', by: me.id, heal });
  }
}

function nextAlly(s: BattleState, from: number): number {
  for (let i = from; i < s.sides[0].length; i++) if (standing(s.sides[0][i]!)) return i;
  return -1;
}

export function turnAct(s: BattleState, rng: Rng, a: BattleAction): boolean {
  if (s.result || s.mode !== 'turn') return false;
  if (a.k !== 'strike' && a.k !== 'guard' && a.k !== 'rally') return false;
  const me = s.sides[0][s.active];
  if (!me || !standing(me)) return false;
  if (a.k === 'strike' && a.target !== undefined) {
    const t = s.sides[1].find((c) => c.id === a.target);
    if (!t || !standing(t)) return false;
  }
  act(s, rng, me, a, s.sides[1]);
  settle(s);
  if (s.result) return true;
  const next = nextAlly(s, s.active + 1);
  if (next >= 0) {
    s.active = next;
    return true;
  }
  // The rivals' turn.
  for (const foe of s.sides[1].filter(standing)) {
    act(s, rng, foe, foeChoice(s, rng), s.sides[0]);
    settle(s);
    if (s.result) return true;
  }
  s.turn += 1;
  if (s.turn > T.maxRounds) {
    end(s, { k: 'end', winner: null, reason: 'time' });
    return true;
  }
  s.log.push({ k: 'round', n: s.turn });
  s.active = nextAlly(s, 0);
  return true;
}
