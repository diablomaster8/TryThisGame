import { BATTLE } from '../../config/tuning-battle';
import type { Rng } from '../rng';
import { foeChoice } from './ai';
import { end, hurt, moveDamage, settle, standing } from './damage';
import { moveOf } from './moves';
import { BASIC_MOVES } from './moves-sources';
import { canAct, cure, inflict, moodMult, shiftMood, tickStatus, zipOf } from './status';
import type { BattleAction, BattleState, Combatant, MoveDef } from './types';

/**
 * The turn-based resolver (party bouts and encounters), recs FIGHT-18: every standing ally
 * chooses in turn, then the rivals choose, then everything resolves in order of priority,
 * then Zip × rng(0.95, 1.05), then a seeded tiebreak. Catching a breath goes first. A turn is
 * logged as `turnStart`, each action's events, then `turnEnd` after statuses tick and Puff
 * comes back (+2, FIGHT-14). Tuckered allies stay on the field asleep and are skipped;
 * tuckered rivals have gone home. Returns false for an action that does not apply (a move it
 * does not have, Puff it does not have, a foe who went home), leaving the state untouched.
 */
const T = BATTLE.turn;

/** The legacy actions as moves: Strike is Bonk, Rally is Huddle; Guard catches a breath. */
export function moveIdOf(a: BattleAction): string | null {
  if (a.k === 'strike') return 'bonk';
  if (a.k === 'rally') return 'huddle';
  if (a.k === 'move') return a.move;
  return null;
}

const targetOf = (a: BattleAction): string | undefined =>
  a.k === 'strike' || a.k === 'move' ? a.target : undefined;

export function hasMove(c: Combatant, id: string): boolean {
  return BASIC_MOVES.includes(id) || c.moves.includes(id);
}

/** Whether `c` may choose `a` now. */
export function canChoose(s: BattleState, c: Combatant, a: BattleAction): boolean {
  if (a.k === 'guard') return true;
  const id = moveIdOf(a);
  if (id === null || !hasMove(c, id)) return false;
  if (moveOf(id).puff > c.puff) return false;
  const t = targetOf(a);
  if (t === undefined) return true;
  const def = moveOf(id);
  const pool = def.target === 'ally' ? s.sides[c.side] : s.sides[c.side === 0 ? 1 : 0];
  const to = pool.find((x) => x.id === t);
  return !!to && standing(to);
}

function priorityOf(s: BattleState, c: Combatant, a: BattleAction): number {
  let p = a.k === 'guard' ? BATTLE.order.breathPriority : moveOf(moveIdOf(a) ?? 'bonk').priority;
  const hs = c.traits.find((t) => t.id === 'headStart');
  if (hs && s.turn === 1) p += hs.full ? BATTLE.traits.headStartS : BATTLE.traits.headStartA;
  return p;
}

function catchBreath(s: BattleState, c: Combatant): void {
  const gain = Math.min(c.puffMax - c.puff, BATTLE.puff.breath);
  c.puff += gain;
  c.guard = true;
  s.log.push({ k: 'guard', by: c.id, puff: gain });
}

function pickTargets(s: BattleState, c: Combatant, def: MoveDef, want?: string): Combatant[] {
  const own = s.sides[c.side].filter(standing);
  const opp = s.sides[c.side === 0 ? 1 : 0].filter(standing);
  switch (def.target) {
    case 'self':
      return [c];
    case 'allAllies':
      return own;
    case 'ally':
      return [own.find((x) => x.id === want) ?? c];
    case 'allFoes':
      return opp;
    case 'foe': {
      const t = opp.find((x) => x.id === want) ?? opp[0];
      return t ? [t] : [];
    }
  }
}

function lands(rng: Rng, by: Combatant, to: Combatant, def: MoveDef): boolean {
  const flutter = def.kind === 'status' || to.side === by.side ? 0 : to.flutter;
  return rng.chance(def.acc * moodMult(by, 'acc') * (1 - flutter));
}

/** Effects after a landed move: status, mood, heal. */
function effects(s: BattleState, rng: Rng, by: Combatant, to: Combatant, def: MoveDef): void {
  if (def.status && to.hp > 0) inflict(s, rng, by, to, def.status.id, def.status.chance);
  const md = def.mood;
  if (md) {
    const who = md.who === 'self' ? by : to;
    if (who.hp > 0) shiftMood(s, rng, by, who, md.stat, md.delta, md.chance);
  }
  if (def.heal && def.kind === 'support' && to.hp > 0) {
    const add = Math.min(to.maxHp - to.hp, Math.round(to.maxHp * def.heal));
    to.hp += add;
    s.log.push({ k: 'rally', by: to.id, heal: add });
  }
}

function useMove(s: BattleState, rng: Rng, c: Combatant, id: string, want?: string): void {
  let def = moveOf(id);
  if (def.puff > c.puff) def = moveOf('bonk');
  c.puff -= def.puff;
  c.last = def.id;
  s.log.push({ k: 'use', by: c.id, move: def.id });
  if (def.special === 'copycat') {
    const t = pickTargets(s, c, def, want)[0];
    const copied = t?.last ? moveOf(t.last) : null;
    if (!t || !copied || copied.special === 'copycat') {
      if (t) s.log.push({ k: 'miss', by: c.id, to: t.id });
      return;
    }
    def = copied;
    s.log.push({ k: 'use', by: c.id, move: def.id });
  }
  if (def.special === 'decoy') {
    c.decoy = 2;
    s.log.push({ k: 'decoy', by: c.id, to: c.id });
    return;
  }
  const targets = pickTargets(s, c, def, want);
  // Doodle Decoy: the next single-target attack at that side hits the doodle.
  if (def.target === 'foe' && def.kind !== 'support') {
    const doodler = s.sides[c.side === 0 ? 1 : 0].find((x) => x.decoy > 0 && standing(x));
    if (doodler) {
      doodler.decoy = 0;
      s.log.push({ k: 'decoy', by: c.id, to: doodler.id });
      return;
    }
  }
  for (const to of targets) {
    if (def.kind === 'support') {
      effects(s, rng, c, to, def);
      continue;
    }
    if (to.side !== c.side && def.ground) {
      const fl = to.traits.find((t) => t.id === 'featherlight');
      if (fl && (fl.full || rng.chance(BATTLE.traits.halfChance))) {
        s.log.push({ k: 'miss', by: c.id, to: to.id, float: true });
        continue;
      }
    }
    if (!lands(rng, c, to, def)) {
      s.log.push({ k: 'miss', by: c.id, to: to.id });
      continue;
    }
    if (def.kind === 'status') {
      effects(s, rng, c, to, def);
      continue;
    }
    const { dmg, eff, crit } = moveDamage(rng, c, to, def);
    s.log.push({
      k: 'hit',
      by: c.id,
      to: to.id,
      dmg,
      strong: eff > 1,
      guarded: to.guard,
      move: def.id,
      eff,
      crit,
    });
    hurt(s, rng, to, dmg);
    // A bonk wakes a Drowsy target.
    if (def.kind === 'bonk' && to.hp > 0 && to.major?.id === 'drowsy') cure(s, to);
    effects(s, rng, c, to, def);
    if (def.special === 'snack' && c.hp > 0) {
      const add = Math.min(c.maxHp - c.hp, Math.round(c.maxHp * (def.heal ?? 0)));
      c.hp += add;
      s.log.push({ k: 'rally', by: c.id, heal: add });
    }
  }
}

function perform(s: BattleState, rng: Rng, c: Combatant, a: BattleAction): void {
  if (!canAct(s, rng, c)) return;
  if (a.k === 'guard') catchBreath(s, c);
  else useMove(s, rng, c, moveIdOf(a) ?? 'bonk', targetOf(a));
}

function nextAlly(s: BattleState, from: number): number {
  for (let i = from; i < s.sides[0].length; i++) if (standing(s.sides[0][i]!)) return i;
  return -1;
}

/** Everyone's choice this turn, in the order they act. Rolls one Zip spread and one tiebreak each. */
export function turnOrder(s: BattleState, rng: Rng): { c: Combatant; a: BattleAction }[] {
  const picks: { c: Combatant; a: BattleAction }[] = [];
  for (const c of s.sides[0].filter(standing))
    picks.push({ c, a: s.choices?.[c.id] ?? { k: 'strike' } });
  for (const c of s.sides[1].filter(standing)) picks.push({ c, a: foeChoice(s, rng, c) });
  const keyed = picks.map((p) => ({
    ...p,
    pri: priorityOf(s, p.c, p.a),
    zip: zipOf(p.c) * rng.float(...BATTLE.order.zipSpread),
    tie: rng.next(),
  }));
  keyed.sort((x, y) => y.pri - x.pri || y.zip - x.zip || y.tie - x.tie);
  return keyed;
}

function resolveTurn(s: BattleState, rng: Rng): void {
  s.log.push({ k: 'turnStart', n: s.turn });
  for (const { c, a } of turnOrder(s, rng)) {
    if (s.result) return;
    if (!standing(c)) continue;
    perform(s, rng, c, a);
    settle(s);
  }
  if (s.result) return;
  for (const c of [...s.sides[0], ...s.sides[1]]) {
    if (!standing(c)) continue;
    tickStatus(s, c);
    c.guard = false;
    c.puff = Math.min(c.puffMax, c.puff + BATTLE.puff.regen);
    if (c.decoy > 0) c.decoy -= 1;
  }
  s.log.push({ k: 'turnEnd', n: s.turn });
  s.choices = {};
  s.turn += 1;
  if (s.turn > T.maxRounds) {
    end(s, { k: 'end', winner: null, reason: 'time' });
    return;
  }
  s.active = nextAlly(s, 0);
}

export function turnAct(s: BattleState, rng: Rng, a: BattleAction): boolean {
  if (s.result || s.mode !== 'turn') return false;
  if (a.k === 'tap' || a.k === 'advance') return false;
  const me = s.sides[0][s.active];
  if (!me || !standing(me) || !canChoose(s, me, a)) return false;
  s.choices = { ...(s.choices ?? {}), [me.id]: a };
  const next = nextAlly(s, s.active + 1);
  if (next >= 0) {
    s.active = next;
    return true;
  }
  resolveTurn(s, rng);
  return true;
}
