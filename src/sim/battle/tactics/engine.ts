/**
 * The grid-tactics engine (recs FIGHT-53 and the rules of FIGHT-52 to FIGHT-58): pure and
 * seeded like the turn mode. Every unit gains Zip/10 CT a tick; at 100 it takes a turn of an
 * optional Move (before or after the Act; undoable until it acts), an optional Act and a Wait with a facing, and keeps
 * 20 CT for each it skipped. Charged moves land after their ticks on whoever stands there.
 * Damage is the turn mode's formula (`damageWith`) times the grid factor from `hitMult`, which
 * the preview shares, so the number shown is the number dealt for the same roll. The status
 * helpers from the turn mode only push to the log, so they are handed this state as a sink.
 */
import { BATTLE } from '../../../config/tuning-battle';
import { TACTICS } from '../../../config/tuning-tactics';
import { Rng } from '../../rng';
import { damageWith, hurt, standing } from '../damage';
import { moveById as turnMove } from '../moves';
import { chargedById, chargedFor, shapedTiles } from './charged';
import { KEEPER_MOVES, KEEPER_UNIT, keeperMoveById } from './keeper-unit';
import { canAct, cure, inflict, moodMult, shiftMood, tickStatus, zipOf } from '../status';
import type { AiLevel, BattleContext, BattleState, Combatant, MoveDef } from '../types';
import { comboFor, comboMove, friendsEnough } from './combos';
import { accBonus, dirTo, DIR_VEC, facingMult, heightMult, sideOf, type Side } from './facing';
import { guardMult, healMult, statusMult } from './jobs';
import { blocks, decodeMap, encodeMap, heightAt, inside, N4, tileAt } from './map';
import { checkObjective, lanternKeys, plotTurn } from './objectives';
import { canEnd, fallDamage, reachable, routeTo, type Occupancy, type Reach } from './path';
import { aoeTiles, canAim, gridOf, manhattan, type GridProfile } from './range';
import { attackTerrain, flutterBonus, inLantern, isShade, isWater, reflectOf } from './terrain';
import {
  TILE,
  type Cell,
  type Dir,
  type GridMap,
  type JobId,
  type JobLayer,
  type Objective,
  type TacticsAction,
  type TacticsState,
  type TUnit,
} from './types';

const C = TACTICS.ct;
const J = TACTICS.jobs;

/** What a unit needs before the bout places it. */
export interface UnitSeed {
  c: Combatant;
  job: JobId;
  layer: JobLayer;
  move: number;
  jump: number;
  swimmer: boolean;
  extraSlot?: boolean;
  bonus?: string;
  friends?: Record<string, number>;
  ward?: boolean;
  /** Merged partners (FIGHT-57): one two-tile-tall unit. */
  tall?: boolean;
  phases?: TUnit['phases'];
  /** The Keeper's piece (FIGHT-66) and the snacks it packed. */
  keeper?: boolean;
  snacks?: number;
  at?: Cell;
}

export interface TacticsSetup {
  seed: number;
  map: GridMap;
  allies: UnitSeed[];
  foes: UnitSeed[];
  context: BattleContext;
  objective?: Objective;
  ai?: [AiLevel | null, AiLevel | null];
  aura?: 'sun' | 'moon' | null;
  fruit?: Cell[];
}

/** The status helpers only push events to `log` (and read `gentle`, never set here). */
const sink = (s: TacticsState): BattleState => s as unknown as BattleState;

/** A move by id: the shared list, then the grid-only charged moves (FIGHT-67). */
export const moveById = (id: string): MoveDef | undefined =>
  turnMove(id) ?? chargedById(id) ?? keeperMoveById(id);

export const unitOf = (s: TacticsState, id: string | null): TUnit | undefined =>
  id === null ? undefined : s.units.find((u) => u.c.id === id);
export const activeUnit = (s: TacticsState): TUnit | undefined => unitOf(s, s.active);
export const mapOf = (s: TacticsState): GridMap => decodeMap(s.map);
const alive = (u: TUnit) => standing(u.c);

function log(s: TacticsState, e: TacticsState['log'][number]): void {
  s.log.push(e);
  if (s.log.length > TACTICS.logCap) s.log.splice(0, s.log.length - TACTICS.logCap);
}

/** Creates the bout and runs the CT clock to the first player turn (or the end). */
export function createTactics(o: TacticsSetup): TacticsState {
  const rng = new Rng(o.seed);
  const taken = new Set<string>();
  const place = (seed: UnitSeed, zone: Cell[], i: number): Cell => {
    const want = seed.at ?? zone[i] ?? zone.find((c) => !taken.has(`${c.x},${c.y}`));
    let at = want ?? { x: 0, y: 0 };
    if (taken.has(`${at.x},${at.y}`)) at = zone.find((c) => !taken.has(`${c.x},${c.y}`)) ?? at;
    taken.add(`${at.x},${at.y}`);
    return at;
  };
  const units: TUnit[] = [];
  const add = (seed: UnitSeed, zone: Cell[], i: number, face: Dir) => {
    const at = place(seed, zone, i);
    units.push({
      c: seed.c,
      x: at.x,
      y: at.y,
      face,
      ct: 0,
      job: seed.job,
      layer: seed.layer,
      move: seed.move,
      jump: seed.jump,
      swimmer: seed.swimmer,
      extraSlot: seed.extraSlot ?? false,
      order: 0,
      ...(seed.ward ? { ward: true } : {}),
      ...(seed.tall ? { tall: true } : {}),
      ...(seed.keeper ? { keeper: true, snacks: seed.snacks ?? 0 } : {}),
      ...(seed.friends ? { friends: seed.friends } : {}),
      ...(seed.bonus ? { bonus: seed.bonus } : {}),
      ...(seed.phases ? { phases: seed.phases } : {}),
    });
  };
  o.allies.forEach((u, i) => add(u, o.map.deploy.a, i, 'e'));
  o.foes.forEach((u, i) => add(u, o.map.deploy.b, i, 'w'));
  // Seeded tie-break order (FIGHT-53: ties go to the higher Zip, then this).
  const order = units.map((_, i) => i);
  for (let i = order.length - 1; i > 0; i--) {
    const j = rng.int(0, i);
    [order[i], order[j]] = [order[j]!, order[i]!];
  }
  order.forEach((u, k) => (units[u]!.order = k));
  const lit: Record<string, boolean> = {};
  for (const k of lanternKeys(o.map)) lit[k] = true;
  const s: TacticsState = {
    v: 1,
    seed: o.seed,
    rngState: rng.state,
    tick: 0,
    turns: 0,
    map: encodeMap(o.map),
    units,
    active: null,
    moved: false,
    acted: false,
    from: null,
    charges: [],
    fruit: o.fruit ?? [],
    objective: o.objective ?? { kind: 'tuckerAll' },
    progress: { rounds: 0, seen: [], got: [0, 0], lit, onPlot: 0 },
    ai: o.ai ?? [null, 'keeper'],
    aura: o.aura ?? null,
    hits: [],
    snap: null,
    log: [],
    result: null,
    context: o.context,
  };
  advance(s);
  return s;
}

const occupancy =
  (s: TacticsState, side: 0 | 1, self: string): Occupancy =>
  (x, y) => {
    const u = s.units.find((v) => v.c.id !== self && alive(v) && v.x === x && v.y === y);
    if (!u) return undefined;
    // Everyone politely goes round the Keeper: it can be passed through, never stood on.
    if (u.keeper) return 0;
    return u.c.side === side ? 0 : 1;
  };

/** Where the unit can move this turn (empty once it has moved or acted). */
export function reachOf(s: TacticsState, u: TUnit): Reach {
  return reachable(mapOf(s), u, occupancy(s, u.c.side, u.c.id));
}

/** The moves a unit can use on the grid: its slots, plus a champion's extra one. */
export function movesOf(u: TUnit): string[] {
  if (u.keeper)
    return KEEPER_MOVES.filter((d) => d.special !== 'snack' || (u.snacks ?? 0) > 0).map(
      (d) => d.id,
    );
  const phase = u.phases?.filter((p) => (u.c.hp / u.c.maxHp) * 100 <= p.atHpPct).pop();
  // Bonk is always there, as in the turn mode.
  const base = phase ? phase.moveset : u.c.moves;
  const out = base.includes('bonk') ? [...base] : ['bonk', ...base];
  if (u.bonus && !out.includes(u.bonus)) out.push(u.bonus);
  // Each job (and layer) brings one big charged move to the grid, beside its slots.
  for (const id of chargedFor(u.job, u.layer)) if (!out.includes(id)) out.push(id);
  return out;
}

/** The order the next `n` turns come in, charges included as ghosts (the turn strip). */
export function turnStrip(
  s: TacticsState,
  n: number = C.strip,
): Array<{ id: string; charge?: string }> {
  const sim = s.units
    .filter((u) => alive(u) && !u.ward)
    .map((u) => ({
      id: u.c.id,
      ct: u.c.id === s.active ? 0 : u.ct,
      zip: zipOf(u.c),
      order: u.order,
    }));
  const charges = s.charges.map((c) => ({ ...c }));
  const out: Array<{ id: string; charge?: string }> = [];
  if (s.active) out.push({ id: s.active });
  for (let t = 0; out.length < n && t < 2000; t++) {
    for (const c of charges) if (--c.left === 0) out.push({ id: c.by, charge: c.move });
    for (const u of sim) u.ct = Math.min(C.full, u.ct + u.zip / C.zipDiv);
    for (;;) {
      const ready = sim.filter((u) => u.ct >= C.full).sort(byTurn);
      if (!ready.length || out.length >= n) break;
      out.push({ id: ready[0]!.id });
      ready[0]!.ct = 0;
    }
  }
  return out.slice(0, n);
}

function byTurn(
  a: { ct: number; zip: number; order: number },
  b: { ct: number; zip: number; order: number },
): number {
  return b.ct - a.ct || b.zip - a.zip || a.order - b.order;
}

/** Runs the clock until a unit's turn starts or the bout ends; AI sides play themselves. */
export function advance(s: TacticsState, aiTurn?: (s: TacticsState) => void): void {
  const play = aiTurn ?? aiHook;
  let guard = 0;
  while (!s.result && guard++ < 100_000) {
    if (s.active === null) {
      const ready = s.units
        .filter((u) => alive(u) && u.ct >= C.full)
        .map((u) => ({ u, ct: u.ct, zip: zipOf(u.c), order: u.order }))
        .sort(byTurn);
      if (ready.length) startTurn(s, ready[0]!.u);
      else tick(s);
      continue;
    }
    const u = activeUnit(s)!;
    if (s.ai[u.c.side] && play) {
      play(s);
      // A turn the AI left open closes with a Wait facing where it already looks.
      if (s.active === u.c.id && !s.result) endTurn(s, u.face);
      continue;
    }
    return;
  }
}

/** The AI's turn; set by `ai.ts` so the engine and the AI don't import each other in a loop. */
let aiHook: ((s: TacticsState) => void) | null = null;
export function setAiHook(f: (s: TacticsState) => void): void {
  aiHook = f;
}

function tick(s: TacticsState): void {
  s.tick += 1;
  for (const u of s.units) if (alive(u)) u.ct = Math.min(C.full, u.ct + zipOf(u.c) / C.zipDiv);
  const due = s.charges.filter((c) => --c.left <= 0);
  if (due.length) {
    s.charges = s.charges.filter((c) => c.left > 0);
    const rng = new Rng(s.rngState);
    for (const c of due) {
      const by = unitOf(s, c.by);
      const def = moveById(c.move);
      if (by && alive(by) && def) resolve(s, rng, by, def, { x: c.x, y: c.y });
    }
    s.rngState = rng.state;
    finishCheck(s);
  }
  if (s.tick > TACTICS.maxTurns * 100) s.result = { winner: null, reason: 'time' };
}

function startTurn(s: TacticsState, u: TUnit): void {
  s.active = u.c.id;
  s.moved = false;
  s.acted = false;
  s.from = { x: u.x, y: u.y };
  s.snap = null;
  log(s, { k: 'turn', who: u.c.id, tick: s.tick });
  const m = mapOf(s);
  const rng = new Rng(s.rngState);
  u.c.puff = Math.min(u.c.puffMax, u.c.puff + TACTICS.puff.perTurn);
  // Lantern light wakes a Drowsy unit; a Puddler in water heals a little.
  if (u.c.major?.id === 'drowsy' && inLantern(m, u.x, u.y, s.progress.lit)) cure(sink(s), u.c);
  if (u.job === 'puddler' && isWater(m, u.x, u.y) && u.c.hp < u.c.maxHp) {
    const add = Math.min(u.c.maxHp - u.c.hp, Math.round(u.c.maxHp * J.puddlerWaterHeal));
    u.c.hp += add;
    log(s, { k: 'rally', by: u.c.id, heal: add });
  }
  const phase = u.phases?.findIndex((p) => (u.c.hp / u.c.maxHp) * 100 <= p.atHpPct) ?? -1;
  if (phase >= 0 && !u.c.used.includes(`phase${phase}`)) {
    u.c.used.push(`phase${phase}`);
    log(s, { k: 'phase', who: u.c.id, line: u.phases![phase]!.line });
  }
  if (!canAct(sink(s), rng, u.c)) s.acted = true;
  s.rngState = rng.state;
  if (!alive(u)) {
    s.active = null;
    finishCheck(s);
  }
}

/** Ends the active unit's turn with a facing (the Wait). */
function endTurn(s: TacticsState, face: Dir): void {
  const u = activeUnit(s);
  if (!u) return;
  u.face = face;
  log(s, { k: 'wait', who: u.c.id, face });
  u.ct = (s.moved ? 0 : C.keepNoMove) + (s.acted ? 0 : C.keepNoAct);
  if (!s.acted) u.c.puff = Math.min(u.c.puffMax, u.c.puff + TACTICS.puff.rest);
  tickStatus(sink(s), u.c);
  s.turns += 1;
  const m = mapOf(s);
  plotTurn(s, m, u);
  const p = s.progress;
  if (!p.seen.includes(u.c.id)) p.seen.push(u.c.id);
  const everyone = s.units.filter((v) => alive(v) && !v.ward).map((v) => v.c.id);
  if (everyone.every((id) => p.seen.includes(id))) {
    p.rounds += 1;
    p.seen = [];
  }
  s.active = null;
  s.from = null;
  s.snap = null;
  if (s.turns >= TACTICS.maxTurns && !s.result) s.result = { winner: null, reason: 'time' };
  finishCheck(s);
}

function finishCheck(s: TacticsState): void {
  if (s.result) return;
  const r = checkObjective(s);
  if (r) {
    s.result = r;
    s.active = null;
    log(s, { k: 'objective', done: r.winner === 0 });
  }
}

/** Whether an action is legal for the active unit right now (the views grey out the rest). */
export function canDo(s: TacticsState, a: TacticsAction): boolean {
  const u = activeUnit(s);
  if (!u || s.result) return false;
  const m = mapOf(s);
  switch (a.k) {
    case 'move':
      return !s.moved && canEnd(reachOf(s, u), a.x, a.y) && !(a.x === u.x && a.y === u.y);
    case 'undo':
      return s.moved && !s.acted && s.snap !== null;
    case 'act': {
      if (s.acted || !movesOf(u).includes(a.move)) return false;
      const def = moveById(a.move);
      if (!def || u.c.puff < def.puff || def.special === 'decoy') return false;
      return canAim(m, u, a, gridOf(def), u.jump, u.job === 'glider');
    }
    case 'together':
      return !s.acted && togetherOk(s, u, a.with, a);
    case 'shake':
      return !s.acted && tileAt(m, a.x, a.y) === TILE.tree && manhattan(u, a) === 1;
    case 'whistle':
      return !s.acted && whistleOk(s, u, a.a, a.b);
    case 'relight': {
      if (s.acted || tileAt(m, a.x, a.y) !== TILE.lantern || manhattan(u, a) !== 1) return false;
      const lit = s.progress.lit[`${a.x},${a.y}`] !== false;
      return u.c.side === 0 ? !lit : lit;
    }
    case 'wait':
      return true;
  }
}

/** Plays one action for the active unit; false (and nothing changed) when it isn't legal. */
export function tacticsAct(s: TacticsState, a: TacticsAction): boolean {
  if (!canDo(s, a)) return false;
  const u = activeUnit(s)!;
  const m = mapOf(s);
  const rng = new Rng(s.rngState);
  switch (a.k) {
    case 'move': {
      s.snap = JSON.stringify({ u, fruit: s.fruit, progress: s.progress, log: s.log.length });
      const path = routeTo(m, reachOf(s, u), a.x, a.y);
      const last = path.length > 1 ? path[path.length - 2]! : { x: u.x, y: u.y };
      u.face = dirTo(last, a);
      u.x = a.x;
      u.y = a.y;
      s.moved = true;
      log(s, { k: 'step', who: u.c.id, path });
      // Shallow water soaks anyone but a Swim type; standing on fruit picks it up.
      if (tileAt(m, u.x, u.y) === TILE.shallow && u.c.type !== 'swim' && !u.c.major)
        inflict(sink(s), rng, u.c, u.c, 'soggy', 1);
      pickFruit(s, u);
      break;
    }
    case 'undo': {
      const snap = JSON.parse(s.snap!) as {
        u: TUnit;
        fruit: Cell[];
        progress: TacticsState['progress'];
        log: number;
      };
      Object.assign(u, snap.u);
      s.fruit = snap.fruit;
      s.progress = snap.progress;
      s.log.length = Math.min(s.log.length, snap.log);
      log(s, { k: 'undo', who: u.c.id });
      s.moved = false;
      s.snap = null;
      break;
    }
    case 'act': {
      const def = moveById(a.move)!;
      u.c.puff -= def.puff;
      if (u.keeper && def.special === 'snack') u.snacks = (u.snacks ?? 0) - 1;
      u.c.last = def.id;
      s.acted = true;
      s.snap = null;
      u.face = a.x === u.x && a.y === u.y ? u.face : dirTo(u, a);
      const p = gridOf(def);
      if (p.ct > 0) {
        s.charges.push({ by: u.c.id, move: def.id, x: a.x, y: a.y, left: p.ct });
        log(s, { k: 'charge', who: u.c.id, move: def.id, x: a.x, y: a.y, ticks: p.ct });
      } else resolve(s, rng, u, def, a);
      break;
    }
    case 'together': {
      const mate = unitOf(s, a.with)!;
      const combo = comboFor(u.c.type, mate.c.type);
      const def = comboMove(combo);
      u.c.puff -= def.puff;
      mate.c.puff -= def.puff;
      s.acted = true;
      s.snap = null;
      log(s, { k: 'combo', combo: combo.id, a: u.c.id, b: mate.c.id });
      if (def.kind === 'support') {
        for (const v of [u, mate]) shiftMood(sink(s), rng, v.c, v.c, 'bonk', 1, 1);
      } else {
        u.face = dirTo(u, a);
        resolve(s, rng, u, def, a, def.knock === true);
      }
      break;
    }
    case 'shake': {
      s.acted = true;
      s.snap = null;
      const spots = N4.map((d) => ({ x: a.x + d.x, y: a.y + d.y })).filter(
        (c) =>
          inside(m, c.x, c.y) &&
          !blocks(tileAt(m, c.x, c.y)) &&
          tileAt(m, c.x, c.y) !== TILE.deep &&
          !s.fruit.some((f) => f.x === c.x && f.y === c.y),
      );
      if (spots.length) {
        const at = spots[rng.int(0, spots.length - 1)]!;
        s.fruit.push(at);
        log(s, { k: 'fruit', x: at.x, y: at.y });
        // Whoever stands there catches it.
        const under = s.units.find((v) => alive(v) && v.x === at.x && v.y === at.y);
        if (under) pickFruit(s, under);
      }
      break;
    }
    case 'whistle': {
      s.acted = true;
      s.snap = null;
      const p = unitOf(s, a.a)!;
      const q = unitOf(s, a.b)!;
      const at = { x: p.x, y: p.y };
      p.x = q.x;
      p.y = q.y;
      q.x = at.x;
      q.y = at.y;
      log(s, { k: 'knock', who: p.c.id, x: p.x, y: p.y });
      log(s, { k: 'knock', who: q.c.id, x: q.x, y: q.y });
      break;
    }
    case 'relight': {
      s.acted = true;
      s.snap = null;
      const lit = u.c.side === 0;
      s.progress.lit[`${a.x},${a.y}`] = lit;
      log(s, { k: 'lantern', x: a.x, y: a.y, lit });
      break;
    }
    case 'wait':
      s.rngState = rng.state;
      endTurn(s, a.face);
      advance(s);
      return true;
  }
  s.rngState = rng.state;
  finishCheck(s);
  if (!s.result && !alive(u)) {
    s.active = null;
    advance(s);
  }
  return true;
}

function pickFruit(s: TacticsState, u: TUnit): void {
  const i = s.fruit.findIndex((f) => f.x === u.x && f.y === u.y);
  if (i < 0) return;
  s.fruit.splice(i, 1);
  log(s, { k: 'pick', who: u.c.id });
  if (s.objective.kind === 'gather') s.progress.got[u.c.side] += 1;
  else {
    // Outside the gather race a fruit is a snack: a fifth of max HP.
    u.c.hp = Math.min(u.c.maxHp, u.c.hp + Math.round(u.c.maxHp / 5));
  }
}

function togetherOk(s: TacticsState, u: TUnit, mateId: string, at: Cell): boolean {
  const mate = unitOf(s, mateId);
  if (!mate || mate === u || mate.c.side !== u.c.side || !alive(mate)) return false;
  const score = u.friends?.[mate.c.id] ?? mate.friends?.[u.c.id] ?? 0;
  if (!friendsEnough(score)) return false;
  const cost = TACTICS.range.comboPuff;
  if (u.c.puff < cost || mate.c.puff < cost) return false;
  // Side by side, diagonals included (three tiles can't all touch edge to edge).
  if (Math.max(Math.abs(u.x - mate.x), Math.abs(u.y - mate.y)) !== 1) return false;
  const target = s.units.find(
    (v) => alive(v) && v.c.side !== u.c.side && v.x === at.x && v.y === at.y,
  );
  return !!target && manhattan(u, target) === 1 && manhattan(mate, target) === 1;
}

/** The Keeper's Whistle: two different standing allies within reach swap places. */
function whistleOk(s: TacticsState, u: TUnit, a: string, b: string): boolean {
  if (!u.keeper || a === b) return false;
  const ok = (id: string) => {
    const v = unitOf(s, id);
    return (
      !!v &&
      alive(v) &&
      !v.keeper &&
      v.c.side === u.c.side &&
      manhattan(u, v) <= KEEPER_UNIT.whistleRange
    );
  };
  return ok(a) && ok(b);
}

/** Allies "Together!" could call on with this target (the bar's button reads it). */
export function togetherMates(s: TacticsState, at: Cell): string[] {
  const u = activeUnit(s);
  if (!u) return [];
  return s.units.filter((v) => togetherOk(s, u, v.c.id, at)).map((v) => v.c.id);
}

/** Who a move aimed at `to` affects. */
export function affected(s: TacticsState, u: TUnit, def: MoveDef, to: Cell): TUnit[] {
  const m = mapOf(s);
  const p = gridOf(def);
  const foe = def.kind === 'bonk' || def.kind === 'splash' || def.kind === 'status';
  if (def.target === 'self' && !foe) return [u];
  const tiles = shapedTiles(m, u, to, def, s.seed) ?? aoeTiles(m, u, to, p);
  return s.units.filter(
    (v) =>
      alive(v) &&
      tiles.some((t) => t.x === v.x && t.y === v.y) &&
      !v.keeper &&
      (foe ? v.c.side !== u.c.side && !v.ward : v.c.side === u.c.side),
  );
}

/**
 * The grid factor of a hit (FIGHT-54 to -57): facing, height, the attacker's terrain and
 * job layer, the target's Guard job, a Lantern Keeper's aura and a pile-on.
 */
export function hitMult(
  s: TacticsState,
  by: TUnit,
  to: TUnit,
  def: MoveDef,
): { mult: number; side: Side; dh: number; pile: boolean } {
  const m = mapOf(s);
  const side = sideOf(by, to, to.face);
  const dh = heightAt(m, by.x, by.y) - heightAt(m, to.x, to.y);
  const align = by.c.alignAs?.align ?? def.align;
  let mult =
    facingMult(side, by.job === 'dasher') *
    heightMult(dh) *
    attackTerrain(m, by.x, by.y, def, align, s.progress.lit) *
    guardMult(to.job);
  if (by.layer === 'sunny' && inLantern(m, by.x, by.y, s.progress.lit)) mult *= J.sunnyLantern;
  if (by.layer === 'moony' && isShade(m, by.x, by.y)) mult *= J.moonyShade;
  const keeper = s.units.some(
    (k) =>
      k.job === 'lanternKeeper' &&
      alive(k) &&
      k.c.side === by.c.side &&
      Math.max(Math.abs(k.x - by.x), Math.abs(k.y - by.y)) <= 1,
  );
  if (keeper) mult *= J.lanternAura;
  const pile = s.hits.some(
    (h) => h.to === to.c.id && h.side === by.c.side && s.tick - h.tick <= TACTICS.range.pileWindow,
  );
  if (pile) mult *= TACTICS.range.pileOn;
  return { mult, side, dh, pile };
}

/** The chance a damaging or status move lands (back hits ignore Flutter). */
export function hitChance(s: TacticsState, by: TUnit, to: TUnit, def: MoveDef, side: Side): number {
  if (to.c.side === by.c.side || def.kind === 'support') return 1;
  const flutter =
    def.kind === 'status' || side === 'back'
      ? 0
      : to.c.flutter + flutterBonus(mapOf(s), to.x, to.y);
  return Math.min(1, def.acc * moodMult(by.c, 'acc') * (1 - flutter) + accBonus(side));
}

export interface PreviewRow {
  id: string;
  dmg: number;
  heal: number;
  chance: number;
  side: Side;
  dh: number;
  pile: boolean;
}

/** What a move aimed at `to` would do, with the spread roll fixed at `roll` and no crit. */
export function preview(s: TacticsState, moveId: string, to: Cell, roll = 1): PreviewRow[] {
  const u = activeUnit(s);
  const def = moveById(moveId);
  if (!u || !def) return [];
  return affected(s, u, def, to).map((v) => {
    const h = hitMult(s, u, v, def);
    const hurts = def.kind === 'bonk' || def.kind === 'splash';
    return {
      id: v.c.id,
      dmg: hurts && !v.c.shadow ? damageWith(u.c, v.c, def, false, roll, h.mult).dmg : 0,
      heal: def.heal ? Math.round(v.c.maxHp * def.heal * healMult(u.layer, s.aura)) : 0,
      chance: hitChance(s, u, v, def, h.side),
      side: h.side,
      dh: h.dh,
      pile: h.pile,
    };
  });
}

/** Resolves a move on its tiles. Rolls per target: land, then crit, then spread, then effects. */
function resolve(
  s: TacticsState,
  rng: Rng,
  u: TUnit,
  def: MoveDef,
  to: Cell,
  knockAll = false,
): void {
  const m = mapOf(s);
  for (const v of affected(s, u, def, to)) {
    const h = hitMult(s, u, v, def);
    if (!rng.chance(hitChance(s, u, v, def, h.side))) {
      log(s, { k: 'miss', by: u.c.id, to: v.c.id });
      continue;
    }
    if (def.kind === 'support' || v.c.side === u.c.side) {
      if (def.heal && v.c.hp > 0) {
        const add = Math.min(
          v.c.maxHp - v.c.hp,
          Math.round(v.c.maxHp * def.heal * healMult(u.layer, s.aura)),
        );
        v.c.hp += add;
        log(s, { k: 'rally', by: v.c.id, heal: add });
      }
      if (def.mood)
        shiftMood(sink(s), rng, u.c, v.c, def.mood.stat, def.mood.delta, def.mood.chance);
      continue;
    }
    if (h.side !== 'front') log(s, { k: 'facing', to: v.c.id, side: h.side });
    if (h.pile) log(s, { k: 'pileOn', to: v.c.id });
    const hurts = def.kind === 'bonk' || def.kind === 'splash';
    if (hurts && v.c.shadow) log(s, { k: 'unhurt', to: v.c.id });
    else if (hurts) {
      const crit = rng.chance(BATTLE.damage.critChance);
      const roll = rng.float(...BATTLE.damage.spread);
      const { dmg, eff } = damageWith(u.c, v.c, def, crit, roll, h.mult);
      log(s, {
        k: 'hit',
        by: u.c.id,
        to: v.c.id,
        dmg,
        strong: eff > 1,
        guarded: v.c.guard,
        move: def.id,
        eff,
        crit,
      });
      hurt(sink(s), rng, v.c, v.ward ? Math.min(dmg, v.c.hp - 1) : dmg);
      s.hits.push({ to: v.c.id, side: u.c.side, tick: s.tick });
      if (s.hits.length > 12) s.hits.shift();
      if (def.kind === 'bonk' && v.c.hp > 0 && v.c.major?.id === 'drowsy') cure(sink(s), v.c);
      const back = reflectOf(m, v.x, v.y, def, dmg);
      if (back > 0) {
        u.c.hp = Math.max(1, u.c.hp - back);
        log(s, { k: 'reflect', who: u.c.id, dmg: back });
      }
      // Bonking a boss you are meant to calm makes it warier.
      if (v.c.calm !== undefined) v.c.calm = Math.max(0, v.c.calm + TACTICS.objective.calmPerBonk);
      if (v.c.hp > 0 && ((u.job === 'bonker' && def.kind === 'bonk') || knockAll)) knock(s, u, v);
    }
    if (def.status && v.c.hp > 0) {
      const lift =
        statusMult(u.layer, s.aura) *
        (u.layer === 'moony' && isShade(m, u.x, u.y) ? J.moonyShade : 1);
      inflict(sink(s), rng, u.c, v.c, def.status.id, Math.min(1, def.status.chance * lift));
    }
    const md = def.mood;
    if (md && v.c.hp > 0) {
      const who = md.who === 'self' || md.who === 'allies' ? u.c : v.c;
      // Shade keeps a unit from going Shy-eyed.
      const shy = md.stat === 'acc' && md.delta < 0 && who === v.c && isShade(m, v.x, v.y);
      if (!shy) shiftMood(sink(s), rng, u.c, who, md.stat, md.delta, md.chance);
    }
    // Kindness calms a wild one (songs, snacks, lullabies: the non-damaging moves).
    if (!hurts && v.c.calm !== undefined) {
      const before = v.c.calm;
      v.c.calm = Math.min(100, v.c.calm + TACTICS.objective.calmPerKind);
      log(s, { k: 'calm', to: v.c.id, calm: v.c.calm, delta: v.c.calm - before });
    }
  }
  // Mega Belly Flop and friends: the user lands where it aimed, when the tile is free.
  if ((def as { land?: boolean }).land && alive(u)) {
    const free =
      !blocks(tileAt(m, to.x, to.y)) &&
      tileAt(m, to.x, to.y) !== TILE.deep &&
      !s.units.some((w) => w !== u && alive(w) && w.x === to.x && w.y === to.y);
    if (free && (u.x !== to.x || u.y !== to.y)) {
      u.x = to.x;
      u.y = to.y;
      log(s, { k: 'knock', who: u.c.id, x: to.x, y: to.y });
    }
  }
}

/** Pushes `v` one tile straight away from `u`; a drop of 3+ levels bumps it (never tuckers). */
function knock(s: TacticsState, u: TUnit, v: TUnit): void {
  const m = mapOf(s);
  const d = DIR_VEC[dirTo(u, v)];
  const x = v.x + d.x;
  const y = v.y + d.y;
  if (!inside(m, x, y) || blocks(tileAt(m, x, y))) return;
  if (s.units.some((w) => alive(w) && w.x === x && w.y === y)) return;
  // Slapstick (FUN-74): bonked into deep water, a non-swimmer goes in with a splash, climbs
  // straight back out soggy and loses its next move. The water never hurts.
  if (tileAt(m, x, y) === TILE.deep && !v.swimmer) {
    log(s, { k: 'splash', who: v.c.id, x, y });
    v.ct = 0;
    if (!v.c.major) {
      v.c.major = { id: 'soggy', turns: 2 };
      log(s, { k: 'status', to: v.c.id, id: 'soggy', on: true });
    }
    return;
  }
  const drop = heightAt(m, v.x, v.y) - heightAt(m, x, y);
  v.x = x;
  v.y = y;
  log(s, { k: 'knock', who: v.c.id, x, y });
  const dmg = fallDamage(drop, v.c.hp, v.c.maxHp);
  if (dmg > 0) {
    v.c.hp -= dmg;
    log(s, { k: 'fall', who: v.c.id, dmg });
    if (!v.c.major) {
      v.c.major = { id: 'dizzy', turns: 2 };
      log(s, { k: 'status', to: v.c.id, id: 'dizzy', on: true });
    }
  }
}

/** Gives up: the foes' side wins, nobody is hurt. */
export function tacticsForfeit(s: TacticsState): void {
  if (s.result) return;
  s.result = { winner: 1, reason: 'forfeit' };
  s.active = null;
}

/** Throws a unit off a ledge directly (tests, and story pushes). */
export function pushUnit(s: TacticsState, by: string, who: string): void {
  const u = unitOf(s, by);
  const v = unitOf(s, who);
  if (u && v) knock(s, u, v);
}

/** For the views: the pending tiles of every charge. */
export function chargeTiles(s: TacticsState): Array<Cell & { by: string }> {
  const m = mapOf(s);
  const out: Array<Cell & { by: string }> = [];
  for (const c of s.charges) {
    const by = unitOf(s, c.by);
    const def = moveById(c.move);
    const at = { x: c.x, y: c.y };
    const tiles =
      by && def ? (shapedTiles(m, by, at, def, s.seed) ?? aoeTiles(m, by, at, gridOf(def))) : [at];
    for (const t of tiles) out.push({ ...t, by: c.by });
  }
  return out;
}

export type { GridProfile };
