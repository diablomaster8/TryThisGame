import type { Rng } from '../rng';
import type { BattleEvent, BattleState, Combatant } from './types';

/**
 * One strike, shared by every mode: the target may slip it (dodge), a guard takes a share, and
 * a combatant whose HP reaches 0 is tuckered out (never "down" or "knocked out"). The caller
 * picks the multiplier; this file owns the order the dice are rolled in, which replays rely on.
 */
export function strikeOn(
  s: BattleState,
  rng: Rng,
  by: Combatant,
  to: Combatant,
  mult: number,
  spread: readonly [number, number],
  guardFactor: number,
  strong = false,
): number {
  if (rng.chance(to.dodge)) {
    s.log.push({ k: 'miss', by: by.id, to: to.id });
    return 0;
  }
  const guarded = to.guard;
  const raw = by.power * mult * rng.float(spread[0], spread[1]) * (guarded ? guardFactor : 1);
  const dmg = Math.max(1, Math.round(raw));
  to.hp = Math.max(0, to.hp - dmg);
  to.guard = false;
  s.log.push({ k: 'hit', by: by.id, to: to.id, dmg, strong, guarded });
  if (to.hp === 0) s.log.push({ k: 'tuckered', who: to.id, side: to.side });
  return dmg;
}

export const standing = (c: Combatant): boolean => c.hp > 0;

/** Ends the bout when a side has nobody standing. */
export function settle(s: BattleState): void {
  if (s.result) return;
  const foesUp = s.sides[1].some(standing);
  const alliesUp = s.sides[0].some(standing);
  if (!foesUp) end(s, { k: 'end', winner: 0, reason: 'tuckered' });
  else if (!alliesUp) end(s, { k: 'end', winner: 1, reason: 'tuckered' });
}

export function end(s: BattleState, e: Extract<BattleEvent, { k: 'end' }>): void {
  if (s.result) return;
  s.result = { winner: e.winner, reason: e.reason };
  s.phase = 'done';
  s.log.push(e);
}
