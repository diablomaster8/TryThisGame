/**
 * Hollow traps (R0161, DUNG-21): funny, telegraphed and never punishing. Two to five per
 * version-4 level, each on a slightly raised tile you can see. Stepping on one springs it
 * once; it re-arms after `rearmMs` of sim time. Nothing ever takes an item or a Shell. The
 * Learning Grove has none. A party Nubbin with Run 30 or more scouts: it spots any trap within
 * three cells and points with a "!".
 *
 * - whoopee: a little hop and an embarrassed party; sticky: slower for a few seconds (lane A
 *   reads `hollowSpeed`); leaves: a leaf pile slides you back three cells; sneeze: a spore
 *   cloud stops you for a moment; bell: the nearest pack comes to look; ice (Act IV only): you
 *   slide on until something stops you.
 */
import { HOLLOW } from '../config/tuning';
import { cellAt, cellCentre, cellDist, cellOf, FLOOR, type Cell, type Floor } from './dungeon';
import { shrineSpeed } from './dungeon-shrines';
import { Rng } from './rng';
import { levelOf } from './stats';
import type { DungeonRun, SimEvent, Vec2, World } from './types';

export type TrapKind = 'whoopee' | 'sticky' | 'leaves' | 'sneeze' | 'bell' | 'ice';

export interface Trap {
  id: string;
  cell: Cell;
  kind: TrapKind;
}

const T = HOLLOW.traps;
const FOUR = [
  [1, 0],
  [-1, 0],
  [0, 1],
  [0, -1],
] as const;

/** Traps for a fresh version-4 floor; `act` 3 (Act IV) adds ice. Mutates `f.traps`. */
export function placeTraps(f: Floor, seed: number, depth: number, act: number | null): void {
  const rng = new Rng((seed ^ 0x7a9_0b1e ^ (depth * 0x3c5)) >>> 0);
  const kinds: TrapKind[] = ['whoopee', 'sticky', 'leaves', 'sneeze', 'bell'];
  if (act === 3) kinds.push('ice');
  const want = rng.int(T.perLevel[0], T.perLevel[1]);
  const busy = [
    f.stairsUp,
    f.chest,
    ...(f.stairsDown ? [f.stairsDown] : []),
    ...f.loot.map((l) => l.cell),
    ...(f.shrines ?? []).map((s) => s.cell),
    ...(f.landmark ? [f.landmark.cell] : []),
  ];
  // Only on dry ground with dry ground all round: never beside a gap or deep water.
  const solidAround = (c: Cell) =>
    FOUR.every(([dx, dy]) => cellAt(f, c.x + dx, c.y + dy) === FLOOR) &&
    cellAt(f, c.x, c.y) === FLOOR;
  const out: Trap[] = [];
  for (let t = 0; out.length < want && t < 400; t++) {
    const c = { x: rng.int(1, f.cols - 2), y: rng.int(1, f.rows - 2) };
    if (!solidAround(c)) continue;
    if (cellDist(c, f.stairsUp) < T.fromStairs) continue;
    if (busy.some((b) => cellDist(b, c) < 2)) continue;
    if (out.some((o) => cellDist(o.cell, c) < T.spacing)) continue;
    out.push({ id: `trap-${out.length}`, cell: c, kind: rng.pick(kinds) });
  }
  f.traps = out;
}

/** The traps in play: none in the Learning Grove. */
export function liveTraps(world: World, f: Floor): readonly Trap[] {
  return world.edu ? [] : (f.traps ?? []);
}

/** Whether a trap is armed (sprung ones wait `rearmMs`). */
export function trapArmed(run: DungeonRun, id: string): boolean {
  return !run.trapsSprung?.some((s) => s.id === id);
}

/** The walking speed share from shrines and a sticky puddle together; lane A multiplies by it. */
export function hollowSpeed(world: World): number {
  const run = world.location === 'dungeon' ? world.dungeon : null;
  const sticky = run?.trapsSprung?.some((s) => s.kind === 'sticky' && s.slowMs > 0) ?? false;
  return shrineSpeed(world) * (sticky ? 1 - T.stickySlow : 1);
}

// Where the Keeper stood last step, to know which way it walked onto a trap.
const lastPos = new WeakMap<DungeonRun, Vec2>();

/** The furthest dry cell up to `n` cells from `c` along (dx, dy), stopping short of anything else. */
function slide(f: Floor, c: Cell, dx: number, dy: number, n: number): Cell {
  let at = c;
  for (let k = 1; k <= n; k++) {
    const next = { x: c.x + dx * k, y: c.y + dy * k };
    if (cellAt(f, next.x, next.y) !== FLOOR) break;
    at = next;
  }
  return at;
}

function spring(world: World, run: DungeonRun, f: Floor, trap: Trap, events: SimEvent[]): void {
  const k = world.keeper;
  const from = lastPos.get(run) ?? k.pos;
  // The way it was walking, as a grid step (the larger axis wins).
  const vx = k.pos.x - from.x;
  const vz = k.pos.z - from.z;
  const [dx, dy] = Math.abs(vx) >= Math.abs(vz) ? [Math.sign(vx) || 1, 0] : [0, Math.sign(vz) || 1];
  (run.trapsSprung ??= []).push({
    id: trap.id,
    kind: trap.kind,
    leftMs: T.rearmMs,
    slowMs: trap.kind === 'sticky' ? T.stickyMs : 0,
  });
  if (trap.kind === 'whoopee') {
    // A little hop, nothing more.
    if (k.grounded) {
      k.grounded = false;
      k.vy = T.whoopeeHop;
    }
  } else if (trap.kind === 'leaves' || trap.kind === 'ice') {
    const to =
      trap.kind === 'leaves'
        ? slide(f, trap.cell, -dx, -dy, T.leafCells)
        : slide(f, trap.cell, dx, dy, f.cols + f.rows);
    const p = cellCentre(f, to);
    k.pos.x = p.x;
    k.pos.z = p.z;
    k.moveTarget = null;
    k.intent = null;
  } else if (trap.kind === 'sneeze') {
    k.moveTarget = null;
    k.intent = null;
  } else if (trap.kind === 'bell') {
    // The nearest pack still about comes to have a look.
    let best: { d: number; id: string } | null = null;
    for (const p of run.packs ?? []) {
      if (p.state === 'beaten' || p.state === 'chase') continue;
      const d = Math.hypot(p.pos.x - k.pos.x, p.pos.z - k.pos.z);
      if (!best || d < best.d) best = { d, id: p.id };
    }
    const pack = best && run.packs?.find((p) => p.id === best.id);
    if (pack && best!.d <= T.bellReach) {
      pack.state = 'chase';
      pack.noticedMs = world.timeMs;
      pack.target = { x: k.pos.x, z: k.pos.z };
      events.push({ kind: 'packNoticed', packId: pack.id });
    }
  }
  events.push({ kind: 'trapSprung', trap: trap.kind });
}

/** One step: re-arm sprung traps, scout ahead, and spring any armed trap underfoot. */
export function stepTraps(
  world: World,
  run: DungeonRun,
  f: Floor,
  dtMs: number,
  events: SimEvent[],
): void {
  const traps = liveTraps(world, f);
  if (world.edu) run.noTraps = true;
  else delete run.noTraps;
  if (run.trapsSprung?.length) {
    for (const s of run.trapsSprung) {
      s.leftMs = Math.max(0, s.leftMs - dtMs);
      s.slowMs = Math.max(0, s.slowMs - dtMs);
    }
    run.trapsSprung = run.trapsSprung.filter((s) => s.leftMs > 0);
  }
  if (traps.length === 0) return;
  const k = world.keeper;
  const kc = cellOf(f, k.pos);
  // A quick Nubbin in the party spots traps near the Keeper.
  const scout = run.party.some((id) => {
    const n = world.nubbins.find((x) => x.id === id);
    return !!n && levelOf(n.stats.run.points) >= T.scoutRun;
  });
  if (scout)
    for (const t of traps)
      if (!run.trapsSpotted?.includes(t.id) && cellDist(t.cell, kc) <= T.scoutCells) {
        (run.trapsSpotted ??= []).push(t.id);
        events.push({ kind: 'trapSpotted', trap: t.kind });
      }
  if (k.grounded)
    for (const t of traps)
      if (t.cell.x === kc.x && t.cell.y === kc.y && trapArmed(run, t.id))
        spring(world, run, f, t, events);
  lastPos.set(run, { x: k.pos.x, z: k.pos.z });
}
