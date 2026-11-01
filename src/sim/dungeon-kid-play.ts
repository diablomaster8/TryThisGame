/**
 * Kid mode's play in the Hollow (R0188, DUNG-45, lane B r10), on top of `dungeon-kid.ts`:
 * - the counting berries: five berries lie along the way down on every kid level, a cell or
 *   two off the path, and walking over one picks it (`hollowKid` berry events, n = how many so
 *   far). The fifth plays the counting lesson in a Learning Grove (`edu.lessons`);
 * - the act boss's game of tag: in a kid run the boss never fights. Walk near and it scampers
 *   off, slower than the Keeper; touch it three times and it giggles, poofs and runs home,
 *   which counts as the boss beaten (the same reward path as a won fight).
 * The berries are picked into `run.taken` (as `kid-berry-<i>`), so they reset per level and
 * save with the run. Pure sim: no DOM.
 */
import { R10B3 } from '../config/tuning-r10b3';
import { DUNGEON, KEEPER } from '../config/tuning';
import { HOLLOW_KID_LESSON } from '../content/edu-hollow-kid';
import { cellCentre, cellOf, FLOOR, type Cell, type Floor } from './dungeon';
import { finishEncounter, type EncounterPack } from './dungeon-encounters';
import { navMask } from './dungeon-nav';
import type { Rng } from './rng';
import type { DungeonPack, DungeonRun, SimEvent, Vec2, World } from './types';

const B = R10B3.berries;
const T = R10B3.tag;

const berryCache = new WeakMap<Floor, Cell[]>();

/** The id a berry is picked under in `run.taken`. */
export const berryId = (i: number): string => `kid-berry-${i}`;

/** The shortest walk from the stairs up to the way on (cell indices), or [] when there is none. */
function wayDown(f: Floor, open: Uint8Array = navMask(f, false)): number[] {
  const goal = f.stairsDown ?? f.chest;
  const n = f.cols * f.rows;
  const from = new Int32Array(n).fill(-1);
  const start = f.stairsUp.y * f.cols + f.stairsUp.x;
  const end = goal.y * f.cols + goal.x;
  const queue = [start];
  from[start] = start;
  for (let h = 0; h < queue.length; h++) {
    const i = queue[h]!;
    if (i === end) break;
    const x = i % f.cols;
    const y = (i - x) / f.cols;
    for (const [dx, dy] of [
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1],
    ] as const) {
      const nx = x + dx;
      const ny = y + dy;
      if (nx < 0 || ny < 0 || nx >= f.cols || ny >= f.rows) continue;
      const j = ny * f.cols + nx;
      if (from[j] !== -1 || (!open[j] && j !== end)) continue;
      from[j] = i;
      queue.push(j);
    }
  }
  if (from[end] === -1) return [];
  const path = [end];
  while (path[path.length - 1] !== start) path.push(from[path[path.length - 1]!]!);
  return path.reverse();
}

/**
 * The level's five berry cells: spread evenly along the way down, each nudged a cell or two to
 * the side where there is open floor (never onto the stairs or the chest). Worked out once per
 * floor, and the same every time for the same floor.
 */
export function kidBerryCells(f: Floor): Cell[] {
  const hit = berryCache.get(f);
  if (hit) return hit;
  // A landmark's cells are closed to the planner and can plug a small kid floor's only way
  // down; then the path wades, or steps past the landmark (berries still land on open cells).
  let path = wayDown(f);
  if (!path.length) path = wayDown(f, navMask(f, true));
  if (!path.length) path = wayDown(f, Uint8Array.from(f.cells, (v) => (v === FLOOR ? 1 : 0)));
  const open = navMask(f, false);
  const out: Cell[] = [];
  const used = new Set<number>(path.length ? [path[0]!, path[path.length - 1]!] : []);
  for (let b = 0; b < B.count && path.length > 2; b++) {
    const at = path[Math.floor(((b + 1) / (B.count + 1)) * (path.length - 1))]!;
    const x = at % f.cols;
    const y = (at - x) / f.cols;
    let pick = at;
    // Off to one side, alternating, so the child looks about a little to find each one.
    const side = b % 2 ? 1 : -1;
    for (let d = B.offPath; d >= 1 && pick === at; d--)
      for (const [dx, dy] of [
        [side * d, 0],
        [0, side * d],
        [-side * d, 0],
        [0, -side * d],
      ] as const) {
        const j = (y + dy) * f.cols + (x + dx);
        if (x + dx < 0 || x + dx >= f.cols || y + dy < 0 || y + dy >= f.rows) continue;
        if (!open[j] || f.cells[j] !== FLOOR || used.has(j)) continue;
        pick = j;
        break;
      }
    if (used.has(pick) || !open[pick]) continue;
    used.add(pick);
    out.push({ x: pick % f.cols, y: Math.floor(pick / f.cols) });
  }
  // Still short (a nudge found nothing open): top up from the path itself, so the count reaches five.
  for (let k = 1; k < path.length - 1 && out.length < B.count; k++) {
    const at = path[k]!;
    if (used.has(at) || !open[at]) continue;
    used.add(at);
    out.push({ x: at % f.cols, y: Math.floor(at / f.cols) });
  }
  berryCache.set(f, out);
  return out;
}

/** Whether this run's level has the counting berries: kid runs, below ground or in a field. */
export function hasBerries(run: DungeonRun | null | undefined): boolean {
  return !!run?.kid && run.zone !== 'town' && !run.story;
}

/** How many of the level's berries are picked. */
export function berriesPicked(run: DungeonRun): number {
  return run.taken.filter((id) => id.startsWith('kid-berry-')).length;
}

/** Each tick: pick any berry the Keeper walks over. */
export function stepKidBerries(world: World, run: DungeonRun, f: Floor, events: SimEvent[]): void {
  if (!hasBerries(run)) return;
  const k = world.keeper.pos;
  const cells = kidBerryCells(f);
  for (let i = 0; i < cells.length; i++) {
    if (run.taken.includes(berryId(i))) continue;
    const c = cellCentre(f, cells[i]!);
    if (Math.hypot(c.x - k.x, c.z - k.z) > B.radius) continue;
    run.taken.push(berryId(i));
    const n = berriesPicked(run);
    events.push({ kind: 'hollowKid', what: 'berry', n });
    // The counting beat for the grown-up's progress view, once five are counted.
    if (n === B.count && world.edu) world.edu.lessons[HOLLOW_KID_LESSON.id] ??= { best: null };
  }
}

// ---------------------------------------------------------------- the boss's game of tag

const dist = (a: Vec2, b: Vec2): number => Math.hypot(a.x - b.x, a.z - b.z);

const floorAt = (f: Floor, x: number, y: number): boolean =>
  x >= 0 && y >= 0 && x < f.cols && y < f.rows && f.cells[y * f.cols + x] === FLOOR;

/** The open neighbour cell (within the leash) farthest from the Keeper, or null in a corner. */
function fleeCell(f: Floor, from: Vec2, keeper: Vec2, home: Vec2, leash: number): Vec2 | null {
  const c = cellOf(f, from);
  let best: Vec2 | null = null;
  let bestD = dist(from, keeper);
  for (let dy = -1; dy <= 1; dy++)
    for (let dx = -1; dx <= 1; dx++) {
      if ((!dx && !dy) || !floorAt(f, c.x + dx, c.y + dy)) continue;
      // No squeezing between two walls on a diagonal.
      if (dx && dy && (!floorAt(f, c.x + dx, c.y) || !floorAt(f, c.x, c.y + dy))) continue;
      const p = cellCentre(f, { x: c.x + dx, y: c.y + dy });
      if (dist(p, home) > leash) continue;
      const d = dist(p, keeper);
      if (d > bestD) {
        bestD = d;
        best = p;
      }
    }
  return best;
}

/** Where the boss hops to after a tag: a seeded open cell a few cells off, away from the Keeper. */
function hopSpot(f: Floor, pack: DungeonPack, keeper: Vec2, home: Vec2, leash: number, rng: Rng) {
  const c = cellOf(f, pack.pos);
  for (let t = 0; t < 24; t++) {
    const r = rng.int(T.hopCells[0], T.hopCells[1]);
    const a = rng.next() * Math.PI * 2;
    const x = Math.round(c.x + Math.cos(a) * r);
    const y = Math.round(c.y + Math.sin(a) * r);
    if (!floorAt(f, x, y)) continue;
    const p = cellCentre(f, { x, y });
    if (dist(p, home) <= leash && dist(p, keeper) >= 2 * DUNGEON.cell) return p;
  }
  return null;
}

/**
 * One step of a kid run's boss: tag instead of a fight. Returns true when the floor moved on
 * (the boss was tagged out and the reward path ran), so the caller stops stepping packs.
 */
export function stepKidTag(
  world: World,
  f: Floor,
  pack: DungeonPack,
  spec: EncounterPack,
  dtMs: number,
  rng: Rng,
  events: SimEvent[],
): boolean {
  const run = world.dungeon!;
  const k = world.keeper.pos;
  const home = cellCentre(f, spec.cell);
  const leash = spec.leash * DUNGEON.cell;
  const near = dist(k, pack.pos);
  if (pack.state === 'idle' || pack.state === 'home') {
    if (near > T.noticeCells * DUNGEON.cell) return false;
    pack.state = 'chase';
    pack.noticedMs = world.timeMs;
    if (pack.tags === undefined) {
      pack.tags = 0;
      events.push({ kind: 'hollowKid', what: 'tagStart', n: 0 });
    }
  }
  if (pack.tagRestMs !== undefined && world.timeMs < pack.tagRestMs) {
    pack.target = null;
    return false;
  }
  if (pack.tagRestMs !== undefined) {
    // The giggle is over: hop off and play on.
    delete pack.tagRestMs;
    const to = hopSpot(f, pack, k, home, leash, rng);
    if (to) pack.pos = to;
  }
  if (near <= T.contact) {
    pack.tags = (pack.tags ?? 0) + 1;
    events.push({ kind: 'hollowKid', what: 'tag', n: pack.tags });
    if (pack.tags >= T.tags) {
      // Tagged out: the boss counts as beaten, poofs and runs home, as after a won bout.
      const party: Record<string, Vec2> = {};
      for (const id of run.party) {
        const n = world.nubbins.find((x) => x.id === id);
        if (n) party[id] = { x: n.pos.x, z: n.pos.z };
      }
      run.encounter = { packId: pack.id, at: { keeper: { x: k.x, z: k.z }, party } };
      finishEncounter(world, f, 'won', events);
      return true;
    }
    pack.tagRestMs = world.timeMs + T.pauseMs;
    return false;
  }
  // Scamper off, slower than the Keeper walks, so a small child always catches up.
  const to = fleeCell(f, pack.pos, k, home, leash);
  pack.target = to ? { x: to.x, z: to.z } : { x: k.x, z: k.z };
  if (!to) return false;
  const step = KEEPER.speed * T.fleeShare * (dtMs / 1000);
  const d = dist(to, pack.pos);
  if (d <= step) pack.pos = { x: to.x, z: to.z };
  else
    pack.pos = {
      x: pack.pos.x + ((to.x - pack.pos.x) / d) * step,
      z: pack.pos.z + ((to.z - pack.pos.z) / d) * step,
    };
  return false;
}
