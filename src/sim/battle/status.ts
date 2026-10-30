import { BATTLE, BATTLE_CONTENT } from '../../config/tuning-battle';
import type { Rng } from '../rng';
import type { BattleState, Combatant, MoodStat, StatusId } from './types';

/**
 * Cosy statuses (recs FIGHT-15). A combatant holds one major at a time (Drowsy, Dizzy, Soggy,
 * Giggly, Peckish, Sticky) and any number of mood stages, ±2 at most, ×1.25 per stage. The
 * Swim S/A trait "Slippery" shrugs off the first status; personalities resist one thing each
 * and a Mischievous Nubbin lands statuses a little more often. Every one of these has an
 * icon and a word in `strings-battle.ts`, never colour alone.
 */
const S = BATTLE.status;

export interface StatusDef {
  id: StatusId;
  kind: 'major';
  turns: readonly [number, number];
  /** The same span on the grid (recs FIGHT-70): turns × 10 CT ticks, so both modes agree. */
  ctTicks: readonly [number, number];
  /** What ends it early: 'bonked' (Drowsy), 'fruit' (Peckish, once battle items exist). */
  cure: string[];
}

const ticks = (t: readonly [number, number]): readonly [number, number] => [
  t[0] * BATTLE_CONTENT.ctPerTurn,
  t[1] * BATTLE_CONTENT.ctPerTurn,
];

export const STATUS_DEFS: Record<StatusId, StatusDef> = {
  drowsy: {
    id: 'drowsy',
    kind: 'major',
    turns: S.drowsy.turns,
    ctTicks: ticks(S.drowsy.turns),
    cure: ['bonked'],
  },
  dizzy: {
    id: 'dizzy',
    kind: 'major',
    turns: S.dizzy.turns,
    ctTicks: ticks(S.dizzy.turns),
    cure: [],
  },
  soggy: {
    id: 'soggy',
    kind: 'major',
    turns: S.soggy.turns,
    ctTicks: ticks(S.soggy.turns),
    cure: [],
  },
  giggly: {
    id: 'giggly',
    kind: 'major',
    turns: S.giggly.turns,
    ctTicks: ticks(S.giggly.turns),
    cure: [],
  },
  peckish: {
    id: 'peckish',
    kind: 'major',
    turns: S.peckish.turns,
    ctTicks: ticks(S.peckish.turns),
    cure: ['fruit'],
  },
  sticky: {
    id: 'sticky',
    kind: 'major',
    turns: S.sticky.turns,
    ctTicks: ticks(S.sticky.turns),
    cure: [],
  },
};

function resists(to: Combatant, what: StatusId | MoodStat, delta = 0): boolean {
  const p = to.personality;
  return (
    (p === 'shy' && what === 'giggly') ||
    (p === 'cheerful' && what === 'bonk' && delta < 0) ||
    (p === 'lazy' && what === 'zip' && delta < 0)
  );
}

function chanceFor(by: Combatant, to: Combatant, base: number, what: StatusId | MoodStat, d = 0) {
  let c = base;
  if (by.side !== to.side && by.personality === 'mischievous') c *= S.mischief;
  if (resists(to, what, d)) c *= S.resist;
  return Math.min(1, c);
}

/** Half-strength traits fire on a roll; S grades always. */
function traitFires(c: Combatant, id: string, rng: Rng): boolean {
  const t = c.traits.find((x) => x.id === id);
  if (!t) return false;
  return t.full || rng.chance(BATTLE.traits.halfChance);
}

/**
 * Tries to give `to` a major status. The roll order (chance, then Slippery, then duration)
 * is fixed so replays match.
 */
export function inflict(
  s: BattleState,
  rng: Rng,
  by: Combatant,
  to: Combatant,
  id: StatusId,
  base: number,
): boolean {
  if (!rng.chance(chanceFor(by, to, base, id))) return false;
  if (to.major || (id === 'soggy' && to.type === 'swim')) {
    s.log.push({ k: 'shrug', to: to.id, id });
    return false;
  }
  if (!to.used.includes('slippery') && to.traits.some((t) => t.id === 'slippery')) {
    to.used.push('slippery');
    if (traitFires(to, 'slippery', rng)) {
      s.log.push({ k: 'trait', who: to.id, id: 'slippery' });
      return false;
    }
  }
  const [lo, hi] = STATUS_DEFS[id].turns;
  to.major = { id, turns: rng.int(lo, hi) };
  s.log.push({ k: 'status', to: to.id, id, on: true });
  return true;
}

export function cure(s: BattleState, c: Combatant): void {
  if (!c.major) return;
  s.log.push({ k: 'status', to: c.id, id: c.major.id, on: false });
  c.major = null;
}

/** Moves a mood stage by `delta`, within ±2. */
export function shiftMood(
  s: BattleState,
  rng: Rng,
  by: Combatant,
  to: Combatant,
  stat: MoodStat,
  delta: number,
  base: number,
): void {
  if (!rng.chance(chanceFor(by, to, base, stat, delta))) return;
  const cur = to.moods[stat] ?? 0;
  const next = Math.max(-S.moodMax, Math.min(S.moodMax, cur + delta));
  if (next === cur) {
    s.log.push({ k: 'shrug', to: to.id, id: stat });
    return;
  }
  to.moods[stat] = next;
  s.log.push({ k: 'mood', to: to.id, stat, delta: next - cur });
}

/** The multiplier a mood stage gives: ×1.25 per stage up, ÷1.25 per stage down. */
export function moodMult(c: Combatant, stat: MoodStat): number {
  return Math.pow(S.moodStep, c.moods[stat] ?? 0);
}

/** Zip with its mood and Soggy. */
export function zipOf(c: Combatant): number {
  return c.zip * moodMult(c, 'zip') * (c.major?.id === 'soggy' ? S.soggy.zip : 1);
}

/**
 * Before acting: Drowsy dozes, Giggly may laugh, Dizzy may spin into itself. Returns false
 * when the combatant loses its action.
 */
export function canAct(s: BattleState, rng: Rng, c: Combatant): boolean {
  const m = c.major;
  if (!m) return true;
  if (m.id === 'drowsy') {
    s.log.push({ k: 'skip', who: c.id, why: 'drowsy' });
    return false;
  }
  if (m.id === 'giggly' && rng.chance(S.giggly.chance)) {
    s.log.push({ k: 'skip', who: c.id, why: 'giggly' });
    return false;
  }
  if (m.id === 'dizzy' && rng.chance(S.dizzy.chance)) {
    const dmg = Math.max(1, Math.round(c.maxHp * S.dizzy.selfShare));
    c.hp = Math.max(0, c.hp - dmg);
    s.log.push({ k: 'boing', who: c.id, dmg });
    if (c.hp === 0) s.log.push({ k: 'tuckered', who: c.id, side: c.side });
    return false;
  }
  return true;
}

/** End of turn: Peckish nibbles, then every major counts down and wears off at 0. */
export function tickStatus(s: BattleState, c: Combatant): void {
  const m = c.major;
  if (!m || c.hp <= 0) return;
  if (m.id === 'peckish') {
    const dmg = Math.max(1, Math.round(c.maxHp * S.peckish.share));
    c.hp = Math.max(1, c.hp - dmg);
    s.log.push({ k: 'peckish', who: c.id, dmg });
  }
  m.turns -= 1;
  if (m.turns <= 0) cure(s, c);
}
