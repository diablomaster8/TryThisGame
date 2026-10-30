/**
 * The ATB "Command" bout (recs FIGHT-40, FIGHT-41): the same turn core, but nobody waits for
 * the Keeper. Every combatant on the field fills a gauge from its Zip on each 100 ms tick and
 * acts at 100: rivals with their AI level, the Keeper's Nubbins with Keeper-level AI plus their
 * personality. The Keeper calls out one of four orders ("Go for it!", "Careful!", "Switch it
 * up!", "Come back!"), each with a 3 s cooldown, and the Nubbin listens with a chance from its
 * affection and trust; an ignored order gets a personality gag instead.
 *
 * Time only moves through `stepAtb`, which the live 10 Hz sim step calls (never offline
 * catch-up), clamped to 500 ms per call and stopped while a pause flag is set (the hidden tab,
 * the Item sheet). So a replay is the start state plus the actions, each stamped with the ATB
 * time it was applied at: `replayAtb`.
 */
import { BATTLE } from '../../config/tuning-battle';
import { BATTLE_ATB as K } from '../../config/tuning-battle-atb';
import { Rng } from '../rng';
import type { World } from '../types';
import { bestAllyAction, chooseAction, levelFor, replacementFor } from './ai';
import { end, onField, settle, standing } from './damage';
import { itemFits, itemsLeft, useItem } from './items';
import { moveOf } from './moves';
import { tickStatus, zipOf } from './status';
import { bench, canChoose, perform, puffCost, swapIn } from './turn';
import {
  ATB_COMMANDS,
  type AtbCommand,
  type AtbGag,
  type BattleAction,
  type BattleState,
  type Combatant,
} from './types';

/** p = 0.4 + 0.004 × affection + 0.002 × trust, at most 0.95. */
export function obeyChance(affection: number, trust: number): number {
  const o = K.obey;
  return Math.max(0, Math.min(o.cap, o.base + o.perAffection * affection + o.perTrust * trust));
}

/** The gag on an ignored order; a Nubbin without a personality yet just waves. */
export function gagFor(c: Combatant): AtbGag {
  switch (c.personality) {
    case 'lazy':
      return 'sit';
    case 'mischievous':
      return 'raspberry';
    case 'shy':
      return 'hide';
    default:
      return 'wave';
  }
}

/** Sets up the ATB clock on a fresh turn bout; reads affection and trust once, at the start. */
export function dressAtb(world: World, s: BattleState): void {
  const gauge: Record<string, number> = {};
  const bond: Record<string, { affection: number; trust: number }> = {};
  for (const c of [...s.sides[0], ...s.sides[1]]) gauge[c.id] = 0;
  for (const c of s.sides[0]) {
    const n = world.nubbins.find((x) => x.id === c.nubbinId);
    bond[c.id] = { affection: n?.needs.affection ?? 0, trust: n?.trust ?? 0 };
  }
  s.atb = { timeMs: 0, accMs: 0, gauge, ready: {}, orders: {}, bond };
}

export const isAtb = (s: BattleState): boolean => !!s.atb;

/** Whether the clock is stopped (the hidden tab or the Item sheet). */
export const atbPaused = (s: BattleState): boolean =>
  !!s.atb?.paused && Object.keys(s.atb.paused).length > 0;

/** The tab-hidden pause on its own, for the UI's "Paused" veil (recs FIGHT-41). */
export const pausedForHidden = (s: BattleState): boolean => !!s.atb?.paused?.hidden;

/** ATB ms until `cmd` can be called again (0 = ready). */
export function cooldownLeft(s: BattleState, cmd: AtbCommand): number {
  if (!s.atb) return 0;
  return Math.max(0, (s.atb.ready[cmd] ?? 0) - s.atb.timeMs);
}

/** The ally an order goes to: the one named, else the first on the field. */
function orderee(s: BattleState, who?: string): Combatant | undefined {
  const field = s.sides[0].filter((c) => onField(s, c));
  return who === undefined ? field[0] : field.find((c) => c.id === who);
}

/** An ATB action from the Keeper: an order, a pause flag or an item. Returns false if refused. */
export function atbAct(s: BattleState, rng: Rng, a: BattleAction): boolean {
  const t = s.atb;
  if (!t || s.result) return false;
  if (a.k === 'pause') {
    if (a.why !== 'hidden' && a.why !== 'items') return false;
    if (typeof a.on !== 'boolean') return false;
    const p = { ...(t.paused ?? {}) };
    if (a.on) p[a.why] = true;
    else delete p[a.why];
    if (Object.keys(p).length) t.paused = p;
    else delete t.paused;
    return true;
  }
  if (a.k === 'order') return order(s, rng, a.cmd, a.who);
  if (a.k === 'item') return item(s, rng, a);
  return false;
}

function order(s: BattleState, rng: Rng, cmd: AtbCommand, who?: string): boolean {
  const t = s.atb!;
  if (!ATB_COMMANDS.includes(cmd) || cooldownLeft(s, cmd) > 0) return false;
  const c = orderee(s, who);
  if (!c) return false;
  if (cmd === 'back' && bench(s, 0).length === 0) return false;
  t.ready[cmd] = t.timeMs + K.cooldownMs;
  const bond = t.bond[c.id] ?? { affection: 0, trust: 0 };
  const obeyed = rng.chance(obeyChance(bond.affection, bond.trust));
  s.log.push({ k: 'order', who: c.id, cmd, obeyed });
  if (!obeyed) {
    s.log.push({ k: 'gag', who: c.id, gag: gagFor(c) });
    return true;
  }
  // "Come back!" happens at once; the others wait for the Nubbin's next turn.
  if (cmd === 'back') {
    delete t.orders[c.id];
    swapIn(s, 0, replacementFor(s, 0).id);
  } else t.orders[c.id] = cmd;
  return true;
}

/** An item is the Keeper's own hand, so it lands at once and needs no obedience. */
function item(s: BattleState, rng: Rng, a: Extract<BattleAction, { k: 'item' }>): boolean {
  const by = orderee(s);
  if (!by || itemsLeft(s, 0, a.item) <= 0) return false;
  const all = [...s.sides[0], ...s.sides[1]];
  const to = a.target === undefined ? by : all.find((x) => x.id === a.target);
  if (!to || !itemFits(by, a.item, to)) return false;
  if (to.side !== by.side && !onField(s, to)) return false;
  useItem(s, rng, by, a.item, to);
  settle(s);
  return true;
}

/** What an obeyed order turns into for `c` now, or null to let it choose for itself. */
function orderAction(s: BattleState, c: Combatant, cmd: AtbCommand): BattleAction | null {
  const foes = s.sides[1].filter((x) => onField(s, x));
  let a: BattleAction | null = null;
  if (cmd === 'go') {
    // The strongest move: the same pick autoplay makes for the active ally.
    s.active = s.sides[0].indexOf(c);
    a = bestAllyAction(s);
  } else if (cmd === 'careful') {
    const allies = s.sides[0].filter((x) => onField(s, x));
    const hurt = allies.filter((x) => x.hp < x.maxHp * K.carefulHurt).sort((x, y) => x.hp - y.hp);
    const heal = [...c.moves, 'huddle'].find((id) => {
      const d = moveOf(id);
      return d.kind === 'support' && !!d.heal && puffCost(s, c, id) <= c.puff;
    });
    if (hurt[0] && heal) {
      const d = moveOf(heal);
      a =
        d.target === 'ally'
          ? { k: 'move', move: heal, target: hurt[0].id }
          : { k: 'move', move: heal };
    } else a = { k: 'guard' };
  } else if (cmd === 'switch') {
    const id = c.moves.find((m) => moveOf(m).kind === 'status' && puffCost(s, c, m) <= c.puff);
    const foe = foes[0];
    if (id && foe)
      a =
        moveOf(id).target === 'foe'
          ? { k: 'move', move: id, target: foe.id }
          : { k: 'move', move: id };
  }
  return a && canChoose(s, c, a) ? a : null;
}

function choose(s: BattleState, rng: Rng, c: Combatant): BattleAction {
  if (c.side === 1) return chooseAction(s, c.id, levelFor(s), rng);
  const t = s.atb!;
  const cmd = t.orders[c.id];
  if (cmd) {
    delete t.orders[c.id];
    const a = orderAction(s, c, cmd);
    if (a) return a;
  }
  return chooseAction(s, c.id, 'keeper', rng);
}

/** One combatant's turn: its own status tick and Puff come after its own action. */
function actOne(s: BattleState, rng: Rng, c: Combatant): void {
  c.guard = false;
  perform(s, rng, c, choose(s, rng, c));
  settle(s);
  if (s.result || !standing(c)) return;
  tickStatus(s, c);
  c.puff = Math.min(c.puffMax, c.puff + BATTLE.puff.regen);
  if (c.decoy > 0) c.decoy -= 1;
  if (c.alignAs && --c.alignAs.turns <= 0) delete c.alignAs;
  settle(s);
}

/** Singles: both sides bring in the next one at once (nobody waits in ATB). */
function refill(s: BattleState): void {
  if (!s.lead || s.result) return;
  for (const side of [0, 1] as const) {
    const cur = s.sides[side][s.lead[side]];
    if (cur && standing(cur)) continue;
    if (bench(s, side).length) swapIn(s, side, replacementFor(s, side).id);
  }
}

function tick(s: BattleState, rng: Rng): void {
  const t = s.atb!;
  t.timeMs += K.tickMs;
  if (t.timeMs % K.roundMs === 0) {
    s.turn += 1;
    if (s.gentle && s.turn > BATTLE.gentle.hugAfter) {
      end(s, { k: 'end', winner: 0, reason: 'hug' });
      return;
    }
    if (s.turn > BATTLE.turn.maxRounds) {
      end(s, { k: 'end', winner: null, reason: 'time' });
      return;
    }
  }
  const all = [...s.sides[0], ...s.sides[1]];
  for (const c of all) {
    if (!onField(s, c)) continue;
    t.gauge[c.id] = Math.min(K.full, (t.gauge[c.id] ?? 0) + (K.zipBase + zipOf(c)) * K.rate);
  }
  // The fullest gauge goes first, then the Keeper's side, then the order on the field: no dice.
  const due = all
    .map((c, i) => ({ c, i, g: t.gauge[c.id] ?? 0 }))
    .filter((x) => x.g >= K.full && onField(s, x.c))
    .sort((x, y) => y.g - x.g || x.c.side - y.c.side || x.i - y.i);
  for (const { c } of due) {
    if (s.result) return;
    if (!onField(s, c)) continue;
    t.gauge[c.id] = 0;
    actOne(s, rng, c);
  }
  refill(s);
}

/**
 * Moves an ATB bout on by `dtMs` of live sim time, at most 500 ms per call so a clock jump
 * can't resolve a fight, and not at all while paused. Pure: the world wrapper is in `core.ts`.
 */
export function stepAtb(s: BattleState, dtMs: number): void {
  const t = s.atb;
  if (!t || s.result || atbPaused(s) || !Number.isFinite(dtMs) || dtMs <= 0) return;
  t.accMs += Math.min(dtMs, K.maxCatchupMs);
  if (t.accMs < K.tickMs) return;
  const rng = new Rng(s.rngState);
  while (t.accMs >= K.tickMs && !s.result) {
    t.accMs -= K.tickMs;
    tick(s, rng);
  }
  s.rngState = rng.state;
  if (s.log.length > BATTLE.logCap) s.log.splice(0, s.log.length - BATTLE.logCap);
}

/** One Keeper action stamped with the ATB time it was applied at. */
export interface TimedAction {
  atMs: number;
  a: BattleAction;
}

/**
 * Replays an ATB bout: the start state plus the timed actions, stepping in 100 ms ticks until
 * ATB time `untilMs` (or the end). Applies each action through `apply` (the core's
 * `battleAct`, passed in to keep this file free of an import cycle).
 */
export function replayAtb(
  start: BattleState,
  actions: readonly TimedAction[],
  untilMs: number,
  apply: (s: BattleState, a: BattleAction) => boolean,
): BattleState {
  const s = JSON.parse(JSON.stringify(start)) as BattleState;
  const run = (to: number): void => {
    while (s.atb && !s.result && !atbPaused(s) && s.atb.timeMs < to) stepAtb(s, K.tickMs);
  };
  for (const { atMs, a } of actions) {
    run(atMs);
    apply(s, a);
  }
  run(untilMs);
  return s;
}
