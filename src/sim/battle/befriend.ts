import { BATTLE } from '../../config/tuning-battle';
import type { BattleState, Combatant } from './types';

/**
 * Befriending (recs FIGHT-21): wild foes carry a Calm meter instead of being captured. A snack,
 * a toy or a gentle (status) move raises it, a bonk lowers it, and at full Calm the wild one
 * decides to come home with the Keeper: it leaves the field as a friend, never tuckered. The
 * world side (a new child, or a full scan and a thank-you gift) is `befriendWild` in
 * `sim/scans.ts`, called when the bout is paid.
 */
export function calmGain(to: Combatant, treat: number): number {
  const B = BATTLE.befriend;
  return Math.round(B.base + B.low * (1 - to.hp / to.maxHp) + treat);
}

export function addCalm(s: BattleState, to: Combatant, delta: number): void {
  if (to.calm === undefined || to.friend || to.hp <= 0) return;
  const before = to.calm;
  to.calm = Math.max(0, Math.min(BATTLE.befriend.max, before + delta));
  s.log.push({ k: 'calm', to: to.id, calm: to.calm, delta: to.calm - before });
  if (to.calm >= BATTLE.befriend.max) {
    to.friend = true;
    s.log.push({ k: 'befriend', who: to.id });
  }
}
