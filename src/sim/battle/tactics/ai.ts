/**
 * The tactics AI (recs FIGHT-59): utility scoring over every reachable tile × usable move ×
 * target. Score = expected damage / target HP + 0.6 for a tuck-in + 0.3 for a back hit + 0.2 per
 * level of height gained − 0.5 × the threat at the tile + the objective's weight. Sprout picks
 * at random from the better half, Keeper the best with 10% noise, Champion the best and looks
 * ahead at charged moves (a target that moves before the charge lands is not worth it).
 * The search is capped by a count of evaluations, not by the clock, so a replay always picks
 * the same move; tiles are tried nearest-first so the cap cuts the least promising ones.
 */
import { TACTICS } from '../../../config/tuning-tactics';
import { Rng } from '../../rng';
import { damageWith, standing } from '../damage';
import { moveById } from '../moves';
import { zipOf } from '../status';
import type { AiLevel, MoveDef } from '../types';
import {
  activeUnit,
  affected,
  hitChance,
  hitMult,
  mapOf,
  movesOf,
  reachOf,
  setAiHook,
  tacticsAct,
} from './engine';
import { dirTo, DIRS } from './facing';
import { heightAt, N4, tileAt } from './map';
import { canAim, gridOf, manhattan } from './range';
import { TILE, type Cell, type TacticsAction, type TacticsState, type TUnit } from './types';

const W = TACTICS.ai;
/** Evaluations per decision before the search stops (about 8 ms on a phone, measured). */
export const EVAL_CAP = 2500;

interface Option {
  tile: Cell;
  act: TacticsAction | null;
  score: number;
}

const alive = (u: TUnit) => standing(u.c);

/** Expected damage foes can do to `u` standing at each tile next turn, cached per decision. */
function threatMap(s: TacticsState, u: TUnit): (c: Cell) => number {
  const bonk = moveById('bonk')!;
  const foes = s.units.filter((e) => alive(e) && e.c.side !== u.c.side && !e.ward);
  const per = foes.map((e) => ({ e, dmg: damageWith(e.c, u.c, bonk, false, 1).dmg }));
  const cache = new Map<number, number>();
  return (c) => {
    const k = c.y * 64 + c.x;
    let v = cache.get(k);
    if (v === undefined) {
      v = 0;
      for (const { e, dmg } of per) if (manhattan(e, c) <= e.move + 1) v += dmg;
      cache.set(k, v);
    }
    return v;
  };
}

/** Ticks until `t` next acts. */
function ticksToTurn(t: TUnit): number {
  const gain = Math.max(0.1, zipOf(t.c) / TACTICS.ct.zipDiv);
  return Math.ceil((TACTICS.ct.full - t.ct) / gain);
}

function scoreMove(s: TacticsState, u: TUnit, def: MoveDef, at: Cell, level: AiLevel): number {
  let score = 0;
  const p = gridOf(def);
  const boss = s.objective.kind === 'calmBoss' ? s.objective.target : undefined;
  for (const v of affected(s, u, def, at)) {
    const h = hitMult(s, u, v, def);
    const chance = hitChance(s, u, v, def, h.side);
    if (v.c.side === u.c.side) {
      if (def.heal) score += (Math.min(v.c.maxHp - v.c.hp, v.c.maxHp * def.heal) / v.c.maxHp) * 1.2;
      if (def.mood) score += 0.1;
      continue;
    }
    const hurts = def.kind === 'bonk' || def.kind === 'splash';
    if (hurts && !v.c.shadow) {
      const dmg = damageWith(u.c, v.c, def, false, 1, h.mult).dmg;
      score += chance * W.damage * Math.min(1, dmg / Math.max(1, v.c.hp));
      if (dmg >= v.c.hp) score += chance * W.tucker;
      if (h.side === 'back') score += W.back;
      score += W.height * Math.max(0, h.dh);
    }
    if (def.status && !v.c.major) score += 0.25 * chance * def.status.chance;
    if (def.mood) score += 0.1 * chance;
    // The calmBoss objective: the Keeper's side calms the boss rather than bonking it.
    if (v.c.id === boss && u.c.side === 0) score += hurts ? -W.objective * 0.5 : W.objective;
    // Champion lookahead: a charge on a target that moves first will land on nothing.
    if (p.ct > 0 && level === 'champion' && ticksToTurn(v) < p.ct) score *= 0.2;
  }
  return score;
}

/** Where the objective pulls this side, if anywhere. */
function objectiveTile(s: TacticsState, u: TUnit): Cell | null {
  const o = s.objective;
  if (u.c.side === 0 && (o.kind === 'reach' || o.kind === 'escort') && o.goal) return o.goal;
  if (o.kind === 'gather' && s.fruit.length)
    return s.fruit.reduce((b, f) => (manhattan(u, f) < manhattan(u, b) ? f : b));
  return null;
}

function options(s: TacticsState, u: TUnit, level: AiLevel): Option[] {
  const m = mapOf(s);
  const threat = threatMap(s, u);
  const foes = s.units.filter((e) => alive(e) && e.c.side !== u.c.side && !e.ward);
  const allies = s.units.filter((e) => alive(e) && e.c.side === u.c.side);
  const goal = objectiveTile(s, u);
  const near = (c: Cell) =>
    goal ? manhattan(c, goal) : foes.reduce((b, e) => Math.min(b, manhattan(c, e)), 99);
  const tiles = s.moved ? [{ x: u.x, y: u.y }] : [...reachOf(s, u).tiles];
  tiles.sort((a, b) => near(a) - near(b) || a.y - b.y || a.x - b.x);
  const moves = movesOf(u)
    .map((id) => moveById(id))
    .filter((d): d is MoveDef => !!d && d.puff <= u.c.puff && d.special !== 'decoy');
  const out: Option[] = [];
  const home = { x: u.x, y: u.y };
  let evals = 0;
  for (const t of tiles) {
    if (evals > EVAL_CAP) break;
    u.x = t.x;
    u.y = t.y;
    const dh = heightAt(m, t.x, t.y) - heightAt(m, home.x, home.y);
    let base = -W.threat * (threat(t) / Math.max(1, u.c.hp)) + W.height * 0.25 * dh;
    base -= 0.02 * near(t);
    if (goal && t.x === goal.x && t.y === goal.y) base += W.objective;
    if (u.c.side === 1 && s.objective.kind === 'protectPlot' && tileAt(m, t.x, t.y) === TILE.plot)
      base += W.objective * 0.5;
    out.push({ tile: t, act: null, score: base });
    if (!s.acted) {
      for (const def of moves) {
        const p = gridOf(def);
        const aims: Cell[] =
          p.range[1] === 0 ? [t] : def.target === 'ally' || def.kind === 'support' ? allies : foes;
        for (const a of aims) {
          evals++;
          if (!canAim(m, t, a, p, u.jump, u.job === 'glider')) continue;
          const sc = scoreMove(s, u, def, a, level);
          if (sc > 0)
            out.push({
              tile: t,
              act: { k: 'act', move: def.id, x: a.x, y: a.y },
              score: base + sc,
            });
        }
      }
      // Lanterns: the Keeper's side relights, the foes blow them out (holdLanterns).
      if (s.objective.kind === 'holdLanterns')
        for (const d of N4) {
          const x = t.x + d.x;
          const y = t.y + d.y;
          if (tileAt(m, x, y) !== TILE.lantern) continue;
          const lit = s.progress.lit[`${x},${y}`] !== false;
          if (lit === (u.c.side === 1))
            out.push({ tile: t, act: { k: 'relight', x, y }, score: base + W.objective * 0.7 });
        }
      if (s.objective.kind === 'gather')
        for (const d of N4)
          if (tileAt(m, t.x + d.x, t.y + d.y) === TILE.tree)
            out.push({
              tile: t,
              act: { k: 'shake', x: t.x + d.x, y: t.y + d.y },
              score: base + 0.3,
            });
    }
  }
  u.x = home.x;
  u.y = home.y;
  return out;
}

/** Picks per level from the scored options. */
function pick(opts: Option[], level: AiLevel, rng: Rng): Option {
  if (level === 'sprout') {
    const sorted = [...opts].sort((a, b) => b.score - a.score);
    const half = sorted.slice(0, Math.max(1, Math.ceil(sorted.length / 2)));
    return half[rng.int(0, half.length - 1)]!;
  }
  let best = opts[0]!;
  let bestScore = -Infinity;
  for (const o of opts) {
    const sc =
      level === 'keeper' ? o.score * (1 + rng.float(-W.keeperNoise, W.keeperNoise)) : o.score;
    if (sc > bestScore) {
      bestScore = sc;
      best = o;
    }
  }
  return best;
}

/** Plays the active unit's whole turn for its side's AI level. */
export function aiTurn(s: TacticsState): void {
  const u = activeUnit(s);
  if (!u) return;
  const level = s.ai[u.c.side] ?? 'keeper';
  const rng = new Rng(s.rngState);
  const opts = options(s, u, level);
  const choice = pick(opts, level, rng);
  const face = rng.int(0, 3);
  s.rngState = rng.state;
  if (choice.tile.x !== u.x || choice.tile.y !== u.y)
    tacticsAct(s, { k: 'move', x: choice.tile.x, y: choice.tile.y });
  if (s.result || s.active !== u.c.id) return;
  if (choice.act) tacticsAct(s, choice.act);
  if (s.result || s.active !== u.c.id) return;
  // Face the nearest foe; a Sprout looks any old way.
  const foes = s.units.filter((e) => alive(e) && e.c.side !== u.c.side);
  const nearest = foes.reduce<TUnit | null>(
    (b, e) => (!b || manhattan(u, e) < manhattan(u, b) ? e : b),
    null,
  );
  const dir = level === 'sprout' ? DIRS[face]! : nearest ? dirTo(u, nearest) : u.face;
  tacticsAct(s, { k: 'wait', face: dir });
}

/** The best action for the active player unit, for the "suggest" button and tests. */
export function suggest(s: TacticsState): TacticsAction[] {
  const u = activeUnit(s);
  if (!u) return [];
  const level: AiLevel = 'keeper';
  const opts = options(s, u, level);
  const best = opts.reduce((b, o) => (o.score > b.score ? o : b), opts[0]!);
  const out: TacticsAction[] = [];
  if (best.tile.x !== u.x || best.tile.y !== u.y)
    out.push({ k: 'move', x: best.tile.x, y: best.tile.y });
  if (best.act) out.push(best.act);
  return out;
}

setAiHook(aiTurn);
