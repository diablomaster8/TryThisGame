/**
 * The matchup memory behind the "Inspect foe" card and the move buttons' effectiveness badges
 * (recs FIGHT-77): once a move of one type has landed on a foe of another, the pairing is
 * known for good, so discovery is part of the fun. Stored as `world.battleSeen.pairs`
 * ("moveType>foeType"), optional in the save and written only here, from the sim, when a hit
 * lands. Kid mode shows the badges always; that is the screen's call, not this file's.
 */
import { BATTLE_R5 } from '../../config/tuning-battle-r5';
import type { World } from '../types';
import { moveOf } from './moves';
import type { BattleState } from './types';

export const seenPair = (moveType: string, foeType: string): string => `${moveType}>${foeType}`;

/** Whether the Keeper has seen a move of `moveType` land on a foe of `foeType`. */
export function pairSeen(world: World, moveType: string, foeType: string): boolean {
  return !!world.battleSeen?.pairs.includes(seenPair(moveType, foeType));
}

/**
 * Notes the pairings of every hit the Keeper's side landed in `s.log` from index `from` on.
 * Called after an action or an ATB step; cheap, and nothing runs when no bout is live.
 */
export function noteSeen(world: World, s: BattleState, from: number): void {
  for (let i = Math.max(0, from); i < s.log.length; i++) {
    const e = s.log[i]!;
    if (e.k !== 'hit' || !e.move) continue;
    const by = s.sides[0].find((c) => c.id === e.by);
    const to = s.sides[1].find((c) => c.id === e.to);
    if (!by || !to) continue;
    const key = seenPair(moveOf(e.move).type, to.type);
    const seen = (world.battleSeen ??= { pairs: [] });
    if (seen.pairs.includes(key)) continue;
    seen.pairs.push(key);
    if (seen.pairs.length > BATTLE_R5.seenCap) seen.pairs.splice(0, 1);
  }
}
