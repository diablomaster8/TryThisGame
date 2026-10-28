import { BATTLE } from '../../config/tuning-battle';
import type { Rng } from '../rng';
import { standing } from './damage';
import type { BattleAction, BattleState } from './types';

/**
 * Rival choices. Tier 1 rivals play "Sprout" (recs FIGHT-23): they never guard and bonk a
 * standing ally at random, so a fresh party's first bout spreads the bumps around. Higher
 * tiers guard now and then and pick on the ally with the least HP.
 */
export function foeChoice(s: BattleState, rng: Rng): BattleAction {
  const tier = s.context.tier;
  if (tier > 1 && rng.chance(BATTLE.turn.foeGuardChance)) return { k: 'guard' };
  const up = s.sides[0].filter(standing);
  if (up.length === 0) return { k: 'guard' };
  const target = tier <= 1 ? rng.pick(up) : up.sort((a, b) => a.hp - b.hp)[0]!;
  return { k: 'strike', target: target.id };
}

/** The best plain move for an ally, for autoplay and the balance tests: hit the weakest foe. */
export function bestAllyAction(s: BattleState): BattleAction {
  const target = s.sides[1].filter(standing).sort((a, b) => a.hp - b.hp)[0];
  return target ? { k: 'strike', target: target.id } : { k: 'guard' };
}
