import { BATTLE_R6 } from '../../config/tuning-battle-r6';
import type { World } from '../types';
import { circuitOf, CIRCUIT_TIERS } from './circuit';
import { ladderBelt } from './ladder';
import { MOVES } from './moves';
import { onceOf } from './rewards';

/**
 * The Battle Book (recs FIGHT-84): the Collection's pages for moves seen and learned, foes
 * befriended, Circuit ribbons, keepsakes and Dojo Ladder belts. Read only: everything comes
 * from what the sim already keeps (`battleOnce.moveCards` for learned moves,
 * `battleSeen.moves` for moves seen in a bout, the Circuit, the Nubbins' own records).
 */
export interface BookMove {
  id: string;
  learned: boolean;
  seen: boolean;
}

export interface BattleBook {
  moves: BookMove[];
  learned: number;
  seen: number;
  /** Every move a Nubbin can learn (the basics and the fused pair's own are left out). */
  total: number;
  befriended: number;
  ribbons: number;
  ribbonSlots: number;
  keepsakes: string[];
  /** The best Dojo Ladder belt any Nubbin holds, 0..5. */
  belt: number;
}

const BOOK_MOVES = MOVES.filter((m) => m.source !== 'basic' && m.id !== BATTLE_R6.fusion.move);

export function battleBook(world: World): BattleBook {
  const once = onceOf(world);
  const seen = new Set(world.battleSeen?.moves ?? []);
  const moves = BOOK_MOVES.map((m) => ({
    id: m.id,
    learned: once.moveCards.includes(m.id),
    seen: seen.has(m.id) || once.moveCards.includes(m.id),
  }));
  return {
    moves,
    learned: moves.filter((m) => m.learned).length,
    seen: moves.filter((m) => m.seen).length,
    total: moves.length,
    befriended: world.nubbins.reduce((s, n) => s + (n.battle?.befriended ?? 0), 0),
    ribbons: circuitOf(world).ribbons.length,
    ribbonSlots: CIRCUIT_TIERS.flat().length,
    keepsakes: [...once.keepsakes],
    belt: world.nubbins.reduce((b, n) => Math.max(b, ladderBelt(n)), 0),
  };
}
