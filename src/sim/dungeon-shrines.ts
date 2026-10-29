/**
 * Hollow shrines (R0159, DUNG-19): small finds that change the next minute or two. A
 * version-4 floor holds one to three, on the pieces' shrine sockets first; the great chamber's
 * 'shrine' landmark is always one of them. Walking onto a shrine uses it (it dims, with a ✓);
 * a timed buff runs on the sim clock and holds still during a fight. What each buff does:
 *
 * - sunny: more Shells from finds and the chest; bouncy: faster walking (lane A reads
 *   `shrineSpeed`); snuggly: party happiness now, fight power for a while (lane C reads
 *   `shrinePower`); lucky: magic find (for the loot tables, R0163); picnic: the party's energy
 *   and hunger topped up; glowy: a wider sight radius; secret: the whole level mapped.
 *   (Gem waits for charms, DUNG-30, and is not placed yet.)
 */
import { HOLLOW } from '../config/tuning';
import { cellCentre, cellDist, exploredMask, FLOOR, type Cell, type Floor } from './dungeon';
import { propBlocked } from './dungeon-props';
import { Rng } from './rng';
import type { DungeonRun, SimEvent, World } from './types';

export type ShrineKind =
  'sunny' | 'bouncy' | 'snuggly' | 'lucky' | 'picnic' | 'glowy' | 'gem' | 'secret';

export interface Shrine {
  id: string;
  cell: Cell;
  kind: ShrineKind;
}

const S = HOLLOW.shrines;

/** The kinds placed now (gem needs charms). */
export const PLACED_KINDS: readonly ShrineKind[] = [
  'sunny',
  'bouncy',
  'snuggly',
  'lucky',
  'picnic',
  'glowy',
  'secret',
];

/** Shrines for a fresh version-4 floor; mutates `f.shrines`. */
export function placeShrines(f: Floor, seed: number, depth: number): void {
  const rng = new Rng((seed ^ 0x51a1_7e55 ^ (depth * 0x1b3)) >>> 0);
  const want = rng.int(S.perLevel[0], S.perLevel[1]);
  const out: Shrine[] = [];
  const dry = (c: Cell) => f.cells[c.y * f.cols + c.x] === FLOOR;
  const standable = (c: Cell) => dry(c) && !propBlocked(cellCentre(f, c), f, S.reach);
  const free = (c: Cell) =>
    standable(c) &&
    cellDist(c, f.stairsUp) >= S.fromStairs &&
    cellDist(c, f.chest) >= 2 &&
    (!f.stairsDown || cellDist(c, f.stairsDown) >= 2) &&
    !f.loot.some((l) => cellDist(l.cell, c) < 1) &&
    out.every((s) => cellDist(s.cell, c) >= S.spacing);
  const add = (c: Cell) =>
    out.push({ id: `shrine-${out.length}`, cell: c, kind: rng.pick(PLACED_KINDS) });
  // The great chamber's shrine landmark is a real one: its stone is solid (R0032), so the
  // shrine to step on sits just in front of it, on the nearest dry cell clear of the block.
  if (f.landmark?.kind === 'shrine') {
    const c = f.landmark.cell;
    const r = Math.ceil(f.landmark.radius * HOLLOW.props.landmarkShare) + 1;
    const beside = [0, 1, 2].flatMap((k) =>
      [
        { x: c.x, y: c.y + r + k },
        { x: c.x + r + k, y: c.y },
        { x: c.x - r - k, y: c.y },
        { x: c.x, y: c.y - r - k },
      ].filter((q) => q.x >= 0 && q.y >= 0 && q.x < f.cols && q.y < f.rows),
    );
    const at = beside.find(standable);
    if (at) add(at);
  }
  const sockets = (f.layout?.shrines ?? []).slice();
  for (let i = sockets.length - 1; i > 0; i--) {
    const j = rng.int(0, i);
    [sockets[i], sockets[j]] = [sockets[j]!, sockets[i]!];
  }
  for (const c of sockets) if (out.length < want && free(c)) add(c);
  // Then any room cell, so every level gets at least its share.
  for (let t = 0; out.length < want && t < 300; t++) {
    const r = f.rooms[rng.int(0, f.rooms.length - 1)];
    if (!r) break;
    const c = {
      x: r.x + rng.int(1, Math.max(1, r.w - 2)),
      y: r.y + rng.int(1, Math.max(1, r.h - 2)),
    };
    if (free(c)) add(c);
  }
  f.shrines = out;
}

/** A buff still running, by kind; null when none. */
export function buffLeft(run: DungeonRun | null, kind: ShrineKind): number {
  return run?.buffs?.find((b) => b.kind === kind)?.leftMs ?? 0;
}

/** Walking speed share from a Bouncy shrine (1 when none); lane A multiplies by it. */
export function shrineSpeed(world: World): number {
  return world.location === 'dungeon' && buffLeft(world.dungeon, 'bouncy') > 0 ? 1 + S.bouncy : 1;
}

/** Fight power share from a Snuggly shrine (1 when none); lane C multiplies by it. */
export function shrinePower(world: World): number {
  return buffLeft(world.dungeon, 'snuggly') > 0 ? 1 + S.snugglyPower : 1;
}

/** Shells share from a Sunny shrine (1 when none). */
export function shrineShells(run: DungeonRun | null): number {
  return buffLeft(run, 'sunny') > 0 ? 1 + S.sunny : 1;
}

/** Magic find from a Lucky Clover shrine, for the loot tables (R0163). */
export function shrineMagicFind(run: DungeonRun | null): number {
  return buffLeft(run, 'lucky') > 0 ? S.luckyMagicFind : 0;
}

/** Extra sight radius from a Glowy shrine. */
export function shrineSight(run: DungeonRun | null): number {
  return buffLeft(run, 'glowy') > 0 ? S.glowySight : 0;
}

function use(world: World, run: DungeonRun, f: Floor, s: Shrine, events: SimEvent[]): void {
  (run.shrinesUsed ??= []).push(s.id);
  const timed = S.seconds[s.kind];
  if (timed > 0) {
    const buffs = (run.buffs ??= []);
    const old = buffs.find((b) => b.kind === s.kind);
    if (old) old.leftMs = timed * 1000;
    else buffs.push({ kind: s.kind, leftMs: timed * 1000 });
  }
  const party = run.party
    .map((id) => world.nubbins.find((n) => n.id === id))
    .filter((n) => !!n && n.stage !== 'egg' && n.stage !== 'cocoon');
  if (s.kind === 'snuggly')
    for (const n of party) n!.needs.happiness = Math.min(100, n!.needs.happiness + S.snugglyHappy);
  if (s.kind === 'picnic')
    for (const n of party) {
      n!.needs.energy = 100;
      n!.needs.hunger = 100;
    }
  if (s.kind === 'secret') exploredMask(run, f).fill(1);
  events.push({ kind: 'shrineUsed', shrine: s.kind });
}

/**
 * One step: use a shrine the Keeper stands on, and run the buffs down (they hold still while
 * a fight is on).
 */
export function stepShrines(
  world: World,
  run: DungeonRun,
  f: Floor,
  dtMs: number,
  events: SimEvent[],
): void {
  if (!run.encounter && run.buffs?.length) {
    for (const b of run.buffs) b.leftMs = Math.max(0, b.leftMs - dtMs);
    const ended = run.buffs.filter((b) => b.leftMs <= 0);
    if (ended.length) {
      run.buffs = run.buffs.filter((b) => b.leftMs > 0);
      for (const b of ended) events.push({ kind: 'shrineFaded', shrine: b.kind });
    }
  }
  const k = world.keeper.pos;
  for (const s of f.shrines ?? []) {
    if (run.shrinesUsed?.includes(s.id)) continue;
    const c = cellCentre(f, s.cell);
    if (Math.hypot(c.x - k.x, c.z - k.z) <= S.reach) use(world, run, f, s, events);
  }
}
