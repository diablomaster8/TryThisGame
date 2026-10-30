import type { SimEvent, World } from '../types';
import { end, onField } from './damage';
import { grantRewards } from './rewards';

/**
 * Save and resume mid-battle (recs FIGHT-64). A turn bout lives in `world.battle` and a tactics
 * bout in `world.tactics`, both plain JSON, so the autosave keeps them; on load the HUD asks
 * "Resume the bout? / Call it a draw". Resuming starts again at the start of the current
 * turn's picks: any half-made choices are dropped, so a pick never lands twice. A draw ends
 * the bout with nobody winning and pays as a draw does.
 */

/** Whether a load found a bout still going (turn or tactics). */
export function openBout(world: World): 'turn' | 'tactics' | null {
  if (world.battle && !world.battle.result && world.battle.mode === 'turn') return 'turn';
  if (world.tactics && !world.tactics.result) return 'tactics';
  return null;
}

/** Back to the start of the turn's picks: the Keeper chooses again for every ally. */
export function resumeBattleCmd(world: World): void {
  const s = world.battle;
  if (!s || s.result || s.mode !== 'turn' || s.atb) return;
  if (s.phase !== 'choose') return;
  s.choices = {};
  if (s.passPlay) s.passPlay.choosing = 0;
  const first = s.sides[0].findIndex((c) => onField(s, c));
  if (first >= 0) s.active = first;
}

/** "Call it a draw": the open turn bout ends with no winner. */
export function drawBattleCmd(world: World, events: SimEvent[]): void {
  const s = world.battle;
  if (!s || s.result) return;
  end(s, { k: 'end', winner: null, reason: 'time' });
  grantRewards(world, s, events);
}
