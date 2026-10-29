import { BATTLE } from '../../config/tuning-battle';
import type { Rng } from '../rng';
import { chooseAction, levelFor, replacementFor } from './ai';
import { addCalm, calmGain } from './befriend';
import { end, hurt, moveDamage, onField, settle, standing } from './damage';
import { itemFits, itemsLeft, useItem } from './items';
import { moveOf } from './moves';
import { BASIC_MOVES } from './moves-sources';
import { canAct, cure, inflict, moodMult, shiftMood, tickStatus, zipOf } from './status';
import type { BattleAction, BattleState, Combatant, MoveDef, SideIx } from './types';

/**
 * The turn-based resolver (party bouts, dojo singles, story and Circuit bouts, encounters),
 * recs FIGHT-18: every ally on the field chooses in turn, then the rivals choose, then
 * everything resolves in order of priority, then Zip × rng(0.95, 1.05), then a seeded tiebreak.
 * Catching a breath, swapping and items go first. A turn is logged as `turnStart`, each
 * action's events, then `turnEnd` after statuses tick and Puff comes back (+2, FIGHT-14).
 *
 * Singles (FIGHT-19): with `s.lead` set only each side's active one is on the field. A swap
 * happens before attacks, so a foe that already aimed at the old active one hits the new one.
 * When our active one is tuckered and someone is on the bench, the bout waits in the `replace`
 * phase for a `swap`; the rivals pick their next one themselves. Tuckered allies nap on the
 * field and are skipped; tuckered rivals have gone home. Returns false for an action that does
 * not apply (a move it does not have, Puff it does not have, a foe who went home), leaving the
 * state untouched.
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
  a.k === 'strike' || a.k === 'move' || a.k === 'item' ? a.target : undefined;

export function hasMove(c: Combatant, id: string): boolean {
  return BASIC_MOVES.includes(id) || c.moves.includes(id);
}

/** Puff a move costs this combatant: nothing on the Keeper's side of a gentle bout. */
export function puffCost(s: BattleState, c: Combatant, id: string): number {
  return s.gentle && c.side === 0 ? 0 : moveOf(id).puff;
}

/** The benched combatants of a side who could come in (singles only). */
export function bench(s: BattleState, side: SideIx): Combatant[] {
  if (!s.lead) return [];
  const lead = s.sides[side][s.lead[side]];
  return s.sides[side].filter((c) => c !== lead && standing(c));
}

function itemsChosen(s: BattleState, side: SideIx, item?: string): number {
  let n = 0;
  for (const c of s.sides[side]) {
    const a = s.choices?.[c.id];
    if (a?.k === 'item' && (item === undefined || a.item === item)) n += 1;
  }
  return n;
}

/** Whether `c` may choose `a` now. */
export function canChoose(s: BattleState, c: Combatant, a: BattleAction): boolean {
  if (a.k === 'guard') return true;
  if (a.k === 'swap') return bench(s, c.side).some((x) => x.id === a.to);
  if (a.k === 'item') {
    if (itemsChosen(s, c.side) >= BATTLE.items.perTurn) return false;
    if (itemsLeft(s, c.side, a.item) - itemsChosen(s, c.side, a.item) <= 0) return false;
    const all = [...s.sides[0], ...s.sides[1]];
    const to = a.target === undefined ? c : all.find((x) => x.id === a.target);
    if (!to || !itemFits(c, a.item, to)) return false;
    // A foe must be on the field; fruit may go to any ally, benched ones too.
    return to.side === c.side || onField(s, to);
  }
  const id = moveIdOf(a);
  if (id === null || !hasMove(c, id)) return false;
  if (puffCost(s, c, id) > c.puff) return false;
  const t = targetOf(a);
  if (t === undefined) return true;
  const def = moveOf(id);
  const pool = def.target === 'ally' ? s.sides[c.side] : s.sides[c.side === 0 ? 1 : 0];
  const to = pool.find((x) => x.id === t);
  return !!to && onField(s, to);
}

function priorityOf(s: BattleState, c: Combatant, a: BattleAction): number {
  let p =
    a.k === 'guard'
      ? BATTLE.order.breathPriority
      : a.k === 'swap'
        ? BATTLE.order.swapPriority
        : a.k === 'item'
          ? BATTLE.order.itemPriority
          : moveOf(moveIdOf(a) ?? 'bonk').priority;
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

/** Brings `to` in for its side's active one. */
export function swapIn(s: BattleState, side: SideIx, to: string): boolean {
  if (!s.lead) return false;
  const ix = s.sides[side].findIndex((x) => x.id === to);
  const cur = s.sides[side][s.lead[side]];
  if (ix < 0 || !cur || ix === s.lead[side] || !standing(s.sides[side][ix]!)) return false;
  s.lead[side] = ix;
  s.log.push({ k: 'swap', side, from: cur.id, to });
  return true;
}

function pickTargets(s: BattleState, c: Combatant, def: MoveDef, want?: string): Combatant[] {
  const own = s.sides[c.side].filter((x) => onField(s, x));
  const opp = s.sides[c.side === 0 ? 1 : 0].filter((x) => onField(s, x));
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

/** A Circuit Keeper's field: puddles boost Swim moves, night boosts Moon moves. */
function fieldMult(s: BattleState, by: Combatant, def: MoveDef): number {
  const boost = BATTLE.circuit.gimmickBoost;
  if (s.gimmick === 'puddle' && def.type === 'swim') return boost;
  if (s.gimmick === 'night' && (by.alignAs?.align ?? def.align) === 'moon') return boost;
  return 1;
}

function useMove(
  s: BattleState,
  rng: Rng,
  c: Combatant,
  id: string,
  want?: string,
  swing = false,
): void {
  let def = moveOf(id);
  if (puffCost(s, c, def.id) > c.puff) def = moveOf('bonk');
  c.puff -= puffCost(s, c, def.id);
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
    const doodler = s.sides[c.side === 0 ? 1 : 0].find((x) => x.decoy > 0 && onField(s, x));
    if (doodler) {
      doodler.decoy = 0;
      s.log.push({ k: 'decoy', by: c.id, to: doodler.id });
      return;
    }
  }
  const sweet = swing && def.id === 'bonk';
  if (swing && def.id === 'bonk') s.log.push({ k: 'swing', by: c.id, sweet });
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
      // A gentle move calms a wild one (FIGHT-21).
      if (to.calm !== undefined && to.side !== c.side) addCalm(s, to, calmGain(to, 0));
      continue;
    }
    // A Shadow stray takes no HP: only Calm.
    if (to.shadow) {
      s.log.push({ k: 'unhurt', to: to.id });
      continue;
    }
    const hit = moveDamage(rng, c, to, def);
    const mult = fieldMult(s, c, def) * (sweet ? BATTLE.swing.sweet : 1);
    const dmg = mult === 1 ? hit.dmg : Math.max(1, Math.round(hit.dmg * mult));
    s.log.push({
      k: 'hit',
      by: c.id,
      to: to.id,
      dmg,
      strong: hit.eff > 1,
      guarded: to.guard,
      move: def.id,
      eff: hit.eff,
      crit: hit.crit,
    });
    hurt(s, rng, to, dmg);
    if (to.calm !== undefined && to.side !== c.side) addCalm(s, to, BATTLE.befriend.bonk);
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
  // A swap is a free action: it happens whatever the status.
  if (a.k === 'swap') {
    swapIn(s, c.side, a.to);
    return;
  }
  if (c.playing && c.playing > 0) {
    c.playing -= 1;
    s.log.push({ k: 'play', who: c.id });
    return;
  }
  if (!canAct(s, rng, c)) return;
  if (a.k === 'guard') catchBreath(s, c);
  else if (a.k === 'item') {
    const all = [...s.sides[0], ...s.sides[1]];
    const to = a.target === undefined ? c : all.find((x) => x.id === a.target);
    if (to && itemFits(c, a.item, to) && itemsLeft(s, c.side, a.item) > 0)
      useItem(s, rng, c, a.item, to);
  } else useMove(s, rng, c, moveIdOf(a) ?? 'bonk', targetOf(a), a.k === 'strike' && !!a.swing);
}

function nextAlly(s: BattleState, from: number): number {
  for (let i = from; i < s.sides[0].length; i++) if (onField(s, s.sides[0][i]!)) return i;
  return -1;
}

/** Everyone's choice this turn, in the order they act. Rolls one Zip spread and one tiebreak each. */
export function turnOrder(s: BattleState, rng: Rng): { c: Combatant; a: BattleAction }[] {
  const picks: { c: Combatant; a: BattleAction }[] = [];
  for (const c of s.sides[0].filter((x) => onField(s, x)))
    picks.push({ c, a: s.choices?.[c.id] ?? { k: 'strike' } });
  for (const c of s.sides[1].filter((x) => onField(s, x)))
    picks.push({ c, a: s.choices?.[c.id] ?? chooseAction(s, c.id, levelFor(s), rng) });
  const keyed = picks.map((p) => ({
    ...p,
    pri: priorityOf(s, p.c, p.a),
    zip: zipOf(p.c) * rng.float(...BATTLE.order.zipSpread),
    tie: rng.next(),
  }));
  keyed.sort((x, y) => y.pri - x.pri || y.zip - x.zip || y.tie - x.tie);
  return keyed;
}

/** Singles: a side whose active one is out brings in the next (ours waits for the Keeper). */
function refill(s: BattleState): void {
  if (!s.lead || s.result) return;
  for (const side of [1, 0] as const) {
    const cur = s.sides[side][s.lead[side]];
    if (cur && standing(cur)) continue;
    const next = bench(s, side);
    if (next.length === 0) continue;
    if (side === 1 || s.gentle) {
      swapIn(s, side, replacementFor(s, side).id);
    } else {
      s.phase = 'replace';
    }
  }
}

/** Resolves the turn from `s.choices` (rivals without a choice pick one now). */
export function resolveTurn(s: BattleState, rng: Rng): void {
  s.log.push({ k: 'turnStart', n: s.turn });
  for (const { c, a } of turnOrder(s, rng)) {
    if (s.result) return;
    if (!standing(c)) continue;
    // A swapped-out combatant keeps its swap but loses any other action.
    if (a.k !== 'swap' && !onField(s, c)) continue;
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
    if (c.alignAs && --c.alignAs.turns <= 0) delete c.alignAs;
  }
  s.log.push({ k: 'turnEnd', n: s.turn });
  s.choices = {};
  s.turn += 1;
  if (s.gentle && s.turn > BATTLE.gentle.hugAfter) {
    end(s, { k: 'end', winner: 0, reason: 'hug' });
    return;
  }
  if (s.turn > T.maxRounds) {
    end(s, { k: 'end', winner: null, reason: 'time' });
    return;
  }
  refill(s);
  s.active = s.phase === 'replace' ? s.lead![0] : nextAlly(s, 0);
}

export function turnAct(s: BattleState, rng: Rng, a: BattleAction): boolean {
  if (s.result || s.mode !== 'turn') return false;
  if (a.k === 'tap' || a.k === 'advance') return false;
  if (s.phase === 'replace') {
    if (a.k !== 'swap' || !swapIn(s, 0, a.to)) return false;
    s.phase = 'choose';
    s.active = s.lead![0];
    return true;
  }
  const me = s.sides[0][s.active];
  if (!me || !onField(s, me) || !canChoose(s, me, a)) return false;
  s.choices = { ...(s.choices ?? {}), [me.id]: a };
  const next = nextAlly(s, s.active + 1);
  if (next >= 0) {
    s.active = next;
    return true;
  }
  resolveTurn(s, rng);
  return true;
}
