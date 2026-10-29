import { BATTLE } from '../../config/tuning-battle';
import type { Rng } from '../rng';
import { standing, stabOf } from './damage';
import { moveOf } from './moves';
import { typeMult } from './types-chart';
import type { BattleAction, BattleState, Combatant } from './types';

/**
 * Rival choices. Tier 1 rivals play "Sprout" (recs FIGHT-23): they only Bonk, at a standing
 * ally picked at random, so a fresh party's first bout spreads the bumps around. Higher tiers
 * catch their breath now and then, use a status or mood move some of the time, and otherwise
 * hit the ally with the least HP with their best affordable move.
 */
function bestHit(c: Combatant, to: Combatant): string {
  let best = 'bonk';
  let score = 0;
  for (const id of ['bonk', ...c.moves]) {
    const d = moveOf(id);
    if ((d.kind !== 'bonk' && d.kind !== 'splash') || d.puff > c.puff) continue;
    const reach = d.target === 'allFoes' ? 1.5 : 1;
    const v = d.power * d.acc * typeMult(d.type, to.type) * stabOf(c, d) * reach;
    if (v > score) [best, score] = [id, v];
  }
  return best;
}

export function foeChoice(s: BattleState, rng: Rng, me: Combatant): BattleAction {
  const tier = s.context.tier;
  const up = s.sides[0].filter(standing);
  if (up.length === 0) return { k: 'guard' };
  if (tier <= 1) return { k: 'strike', target: rng.pick(up).id };
  if (me.puff < me.puffMax && rng.chance(BATTLE.turn.foeGuardChance)) return { k: 'guard' };
  const target = [...up].sort((a, b) => a.hp - b.hp)[0]!;
  const tricks = me.moves.filter((id) => {
    const d = moveOf(id);
    return (d.kind === 'status' || d.kind === 'support') && d.puff <= me.puff;
  });
  if (tricks.length > 0 && rng.chance(BATTLE.turn.foeStatusChance))
    return { k: 'move', move: rng.pick(tricks), target: target.id };
  return { k: 'move', move: bestHit(me, target), target: target.id };
}

/** The best plain move for the active ally, for autoplay and the balance tests. */
export function bestAllyAction(s: BattleState): BattleAction {
  const me = s.sides[0][s.active];
  const target = s.sides[1].filter(standing).sort((a, b) => a.hp - b.hp)[0];
  if (!target) return { k: 'guard' };
  if (!me) return { k: 'strike', target: target.id };
  const id = bestHit(me, target);
  return id === 'bonk'
    ? { k: 'strike', target: target.id }
    : { k: 'move', move: id, target: target.id };
}
