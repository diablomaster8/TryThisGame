import { BATTLE } from '../../config/tuning-battle';
import { Rng } from '../rng';
import { moveDamage, onField, standing, stabOf } from './damage';
import { moodMult } from './status';
import { itemsLeft } from './items';
import { moveOf } from './moves';
import { bench, canChoose, puffCost, resolveTurn } from './turn';
import { typeMult } from './types-chart';
import type { AiLevel, BattleAction, BattleState, Combatant, SideIx } from './types';

/**
 * How combatants choose (recs FIGHT-23), for the rivals and for an ally on autopilot:
 *
 * - **Sprout**: a random affordable move (no status move on turn 1), never ganging up on a
 *   nearly tuckered target when another is up, and "Catch your breath" 20% of the time.
 * - **Keeper**: the move with the best expected damage (power × type × accuracy × STAB), a
 *   15% "fun pick", and a 30% swap away from a ×1.5 matchup when someone is on the bench.
 * - **Champion**: swaps off bad matchups, snacks under 30% HP, and otherwise tries each of its
 *   choices one turn ahead on a copy of the bout against a Keeper-level reply, with the same
 *   dice for every candidate, and keeps the best.
 *
 * A personality overlay comes first for everyone: Cheerful supports a hurt ally, Shy catches
 * its breath when low, Mischievous throws in a status move, Lazy yawns a breath at full Puff.
 */
const A = BATTLE.ai;

/** The rivals' level: set by the context, else Sprout at tier 1 and Keeper above. */
export function levelFor(s: BattleState): AiLevel {
  if (s.gentle) return 'sprout';
  return s.ai ?? (s.context.tier <= 1 ? 'sprout' : 'keeper');
}

const other = (side: SideIx): SideIx => (side === 0 ? 1 : 0);
const field = (s: BattleState, side: SideIx): Combatant[] =>
  s.sides[side].filter((c) => onField(s, c));

function act(id: string, target?: string): BattleAction {
  const t = target === undefined ? {} : { target };
  if (id === 'bonk') return { k: 'strike', ...t };
  if (id === 'huddle') return { k: 'rally' };
  return { k: 'move', move: id, ...t };
}

/** Every affordable move with a sensible target, as actions. */
function options(s: BattleState, me: Combatant): { id: string; a: BattleAction }[] {
  const out: { id: string; a: BattleAction }[] = [];
  for (const id of ['bonk', ...me.moves, 'huddle']) {
    if (puffCost(s, me, id) > me.puff) continue;
    const d = moveOf(id);
    if (d.target === 'foe') {
      for (const t of field(s, other(me.side))) out.push({ id, a: act(id, t.id) });
    } else if (d.target === 'ally') {
      for (const t of field(s, me.side)) out.push({ id, a: act(id, t.id) });
    } else out.push({ id, a: act(id) });
  }
  return out.filter((o) => canChoose(s, me, o.a));
}

const hits = (id: string): boolean => {
  const k = moveOf(id).kind;
  return k === 'bonk' || k === 'splash';
};

function expected(me: Combatant, id: string, to: Combatant): number {
  const d = moveOf(id);
  const reach = d.target === 'allFoes' ? 1.5 : 1;
  return d.power * d.acc * typeMult(d.type, to.type) * stabOf(me, d) * reach;
}

function targetOfAction(a: BattleAction): string | undefined {
  return a.k === 'strike' || a.k === 'move' ? a.target : undefined;
}

function bestHit(s: BattleState, me: Combatant): BattleAction | null {
  let best: BattleAction | null = null;
  let score = -1;
  for (const o of options(s, me)) {
    if (!hits(o.id)) continue;
    const t = targetOfAction(o.a);
    const to = s.sides[other(me.side)].find((x) => x.id === t) ?? field(s, other(me.side))[0];
    if (!to) continue;
    // Ties go to the target with less HP left.
    const v = expected(me, o.id, to) + (1 - to.hp / to.maxHp) * 1e-3;
    if (v > score) [best, score] = [o.a, v];
  }
  return best;
}

/** How badly the foe's active one's type hits `c` (×1.5 is a bad matchup). */
function threat(s: BattleState, c: Combatant): number {
  const foe = field(s, other(c.side))[0];
  return foe ? typeMult(foe.type, c.type) : 1;
}

/** The benched one best placed against the foe on the field (or the first standing). */
export function replacementFor(s: BattleState, side: SideIx): Combatant {
  const list = bench(s, side);
  const foe = field(s, other(side))[0];
  if (!foe) return list[0]!;
  return [...list].sort(
    (a, b) => typeMult(foe.type, a.type) - typeMult(foe.type, b.type) || b.hp - a.hp,
  )[0]!;
}

function swapAway(s: BattleState, me: Combatant): BattleAction | null {
  const list = bench(s, me.side);
  if (list.length === 0) return null;
  const pick = replacementFor(s, me.side);
  return typeMult(field(s, other(me.side))[0]?.type ?? 'normal', pick.type) < threat(s, me)
    ? { k: 'swap', to: pick.id }
    : null;
}

function personality(s: BattleState, me: Combatant, rng: Rng): BattleAction | null {
  const P = A.personality;
  switch (me.personality) {
    case 'cheerful': {
      const hurt = field(s, me.side).find((c) => c.hp < c.maxHp * P.cheerfulAllyBelow);
      if (!hurt) return null;
      const heal = options(s, me).find((o) => moveOf(o.id).kind === 'support' && moveOf(o.id).heal);
      return heal ? heal.a : null;
    }
    case 'shy':
      // Half the time, so a Shy Nubbin still finishes its bouts.
      return me.hp < me.maxHp * P.shyGuardBelow && rng.chance(0.5) ? { k: 'guard' } : null;
    case 'mischievous': {
      if (!rng.chance(P.mischiefStatus)) return null;
      const tricks = options(s, me).filter((o) => moveOf(o.id).kind === 'status');
      return tricks.length ? rng.pick(tricks).a : null;
    }
    case 'lazy':
      return rng.chance(P.lazyBreath) ? { k: 'guard' } : null;
    default:
      return null;
  }
}

function sprout(s: BattleState, me: Combatant, rng: Rng): BattleAction {
  if (me.puff < me.puffMax && rng.chance(A.sprout.breath)) return { k: 'guard' };
  let opts = options(s, me).filter((o) => !(s.turn === 1 && moveOf(o.id).kind === 'status'));
  // Never focus a nearly tuckered target while another is up.
  const foes = field(s, other(me.side));
  if (foes.length > 1) {
    const low = foes.filter((c) => c.hp <= c.maxHp * 0.25).map((c) => c.id);
    const kind = opts.filter((o) => !low.includes(targetOfAction(o.a) ?? ''));
    if (kind.length) opts = kind;
  }
  // A random pick of tricks and huddles dragged kid bouts to 30-odd turns (R0274).
  // The plain bonk only when it is all there is: a move of its own lands harder.
  const moves = opts.filter((o) => hits(o.id) && o.id !== 'bonk');
  const strikes = moves.length ? moves : opts.filter((o) => hits(o.id));
  if (strikes.length && rng.chance(A.sprout.hitShare)) opts = strikes;
  return opts.length ? rng.pick(opts).a : { k: 'guard' };
}

function keeper(s: BattleState, me: Combatant, rng: Rng): BattleAction {
  const K = A.keeper;
  if (threat(s, me) >= K.badMatchup && rng.chance(K.switchChance)) {
    const sw = swapAway(s, me);
    if (sw) return sw;
  }
  if (rng.chance(K.funPick)) {
    const opts = options(s, me);
    if (opts.length) return rng.pick(opts).a;
  }
  return bestHit(s, me) ?? { k: 'guard' };
}

/**
 * How well side `side` stands: its HP share minus the other's, the foe's weighted up so a
 * one-turn look ahead does not just heal and stall in a mirror match.
 */
function standingScore(s: BattleState, side: SideIx): number {
  const share = (list: Combatant[]) =>
    list.reduce((a, c) => a + (standing(c) ? A.champion.upWorth + c.hp / c.maxHp : 0), 0);
  if (s.result) return s.result.winner === side ? 100 : s.result.winner === null ? 0 : -100;
  // Puff in hand, a status on someone and mood stages all count for later turns.
  const C = A.champion;
  const edge = (list: Combatant[]) =>
    list.reduce((a, c) => {
      if (!standing(c)) return a;
      const moods = Object.values(c.moods).reduce((m, v) => m + (v ?? 0), 0);
      return (
        a + C.puffWorth * (c.puff / c.puffMax) - (c.major ? C.statusWorth : 0) + C.moodWorth * moods
      );
    }, 0);
  const me = s.sides[side];
  const them = s.sides[other(side)];
  return share(me) - C.aggression * share(them) + edge(me) - edge(them);
}

function champion(s: BattleState, me: Combatant, rng: Rng): BattleAction {
  const C = A.champion;
  // A snack when low, or when the foe's best hit would tuck it in and a fruit would not.
  const foe = field(s, other(me.side))[0];
  const danger = foe ? (exactHit(s, foe)?.dmg ?? 0) : 0;
  const heal = me.maxHp * BATTLE.items.fruitHeal;
  const saves = danger >= me.hp && danger < me.hp + heal;
  if ((me.hp < me.maxHp * C.itemBelow || saves) && itemsLeft(s, me.side, 'fruit') > 0) {
    const snack: BattleAction = { k: 'item', item: 'fruit', target: me.id };
    if (canChoose(s, me, snack)) return snack;
  }
  if (threat(s, me) >= C.swapAt) {
    const sw = swapAway(s, me);
    if (sw) return sw;
  }
  const hit = exactHit(s, me);
  if (hit?.ko) return hit.a;
  // The best hit by the real formula is the default; a breath, a status or a support move
  // replaces it only when one turn played ahead (on the same rolls) says it is clearly better.
  const base: BattleAction = hit?.a ?? { k: 'guard' };
  const others: BattleAction[] = [
    { k: 'guard' },
    ...options(s, me)
      .filter((o) => !hits(o.id))
      .map((o) => o.a),
  ];
  const seeds = Array.from({ length: C.samples }, () => Math.floor(rng.next() * 2147483646) + 1);
  const judge = (a: BattleAction): number =>
    seeds.reduce((v, seed) => v + lookahead(s, me, a, seed), 0) / seeds.length;
  let best = base;
  let score = judge(base) + C.margin;
  for (const a of others) {
    if (a === base) continue;
    const v = judge(a);
    if (v > score) [best, score] = [a, v];
  }
  return best;
}

/** The hit with the most expected damage by the real formula; a sure tuck-in at least Puff. */
function exactHit(
  s: BattleState,
  me: Combatant,
): { a: BattleAction; ko: boolean; dmg: number } | null {
  let best: BattleAction | null = null;
  let ko = false;
  let most = 0;
  let score = -1;
  const roll = Rng.fromSeed(7);
  for (const o of options(s, me)) {
    if (!hits(o.id)) continue;
    const t = targetOfAction(o.a);
    const to = s.sides[other(me.side)].find((x) => x.id === t) ?? field(s, other(me.side))[0];
    if (!to) continue;
    const d = moveOf(o.id);
    let dmg = 0;
    for (let i = 0; i < 4; i++) dmg += moveDamage(roll, me, to, d).dmg / 4;
    const p = d.acc * moodMult(me, 'acc') * (1 - to.flutter);
    // A likely tuck-in beats everything, the cheapest first.
    const sure = dmg * 0.9 >= to.hp && p >= 0.9;
    const v = sure ? 1000 - puffCost(s, me, o.id) : Math.min(dmg, to.hp) * p;
    if (v > score) [best, score, ko] = [o.a, v, sure];
    most = Math.max(most, dmg);
  }
  return best ? { a: best, ko, dmg: most } : null;
}

/** Plays one turn ahead on a copy: `me` does `a`, everyone else plays at Keeper level. */
function lookahead(s: BattleState, me: Combatant, a: BattleAction, seed: number): number {
  const copy: BattleState = JSON.parse(JSON.stringify({ ...s, log: [] })) as BattleState;
  copy.ai = 'keeper';
  const rng = Rng.fromSeed(seed);
  const choices: Record<string, BattleAction> = { ...(s.choices ?? {}) };
  for (const c of [...copy.sides[0], ...copy.sides[1]]) {
    if (!onField(copy, c) || choices[c.id]) continue;
    choices[c.id] = c.id === me.id ? a : keeper(copy, c, rng);
  }
  choices[me.id] = a;
  copy.choices = choices;
  resolveTurn(copy, rng);
  // Then a few plain turns at Keeper level all round, so a move's cost shows up.
  for (let d = 1; d < A.champion.depth && !copy.result && copy.phase === 'choose'; d++) {
    const next: Record<string, BattleAction> = {};
    for (const c of [...copy.sides[0], ...copy.sides[1]])
      if (onField(copy, c)) next[c.id] = bestHit(copy, c) ?? { k: 'guard' };
    copy.choices = next;
    resolveTurn(copy, rng);
  }
  return standingScore(copy, me.side);
}

/** The choice for combatant `actorId` at `level` (recs FIGHT-23). */
export function chooseAction(
  s: BattleState,
  actorId: string,
  level: AiLevel,
  rng: Rng,
): BattleAction {
  const me = [...s.sides[0], ...s.sides[1]].find((c) => c.id === actorId);
  if (!me || field(s, other(me.side)).length === 0) return { k: 'guard' };
  const mood = personality(s, me, rng);
  if (mood) return mood;
  if (level === 'sprout') return sprout(s, me, rng);
  if (level === 'keeper') return keeper(s, me, rng);
  return champion(s, me, rng);
}

/** The best plain move for the active ally, for autoplay and the balance tests. */
export function bestAllyAction(s: BattleState): BattleAction {
  if (s.phase === 'replace') {
    const next = bench(s, 0)[0];
    return next ? { k: 'swap', to: next.id } : { k: 'guard' };
  }
  const me = s.sides[0][s.active];
  const target = field(s, 1).sort((a, b) => a.hp - b.hp)[0];
  if (!target) return { k: 'guard' };
  if (!me) return { k: 'strike', target: target.id };
  let id = 'bonk';
  let score = 0;
  for (const m of ['bonk', ...me.moves]) {
    if (!hits(m) || puffCost(s, me, m) > me.puff) continue;
    const v = expected(me, m, target);
    if (v > score) [id, score] = [m, v];
  }
  return act(id, target.id);
}
