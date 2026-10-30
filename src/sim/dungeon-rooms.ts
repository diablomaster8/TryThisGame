/**
 * No room left bare (R0201, DUNG-58) and nursery nooks (R0198, DUNG-55). After a version-4
 * floor has its packs, shrines, traps and finds, every room piece that still holds none of
 * a pack, the chest, a shrine, a trap or a wild one gets a nursery nook: a wild baby from
 * the act's own pool, sitting where the Keeper has to stop and wait quietly to scan it. An
 * act's wild ones all come from its pool. Its own seeded stream, so nothing else on the
 * floor moves. Pure sim: no DOM.
 */
import { ACT_WILD } from '../config/dungeon-wild';
import { HOLLOW_R7 } from '../config/tuning-dungeon';
import { cellDist, FLOOR, type Cell, type Floor } from './dungeon';
import { waypointCell } from './dungeon-levels';
import { DENSITY } from '../config/dungeon-foes';
import { Rng } from './rng';
import type { DungeonRun, DungeonWild, World } from './types';

function inside(r: { x: number; y: number; w: number; h: number }, c: Cell): boolean {
  return c.x >= r.x && c.y >= r.y && c.x < r.x + r.w && c.y < r.y + r.h;
}

/** Does room `i` already hold something to do (the stairs count for the entry and exit)? */
export function roomHasContent(f: Floor, i: number): boolean {
  const r = f.rooms[i]!;
  const c = (cell: Cell) => inside(r, cell);
  return (
    !!f.packs?.some((p) => p.room === i || c(p.cell)) ||
    c(f.chest) ||
    !!f.shrines?.some((s) => c(s.cell)) ||
    !!f.traps?.some((t) => c(t.cell)) ||
    f.wildSpots.some((w) => c(w.cell)) ||
    c(f.stairsUp) ||
    (!!f.stairsDown && c(f.stairsDown))
  );
}

/** Room pieces (not corridors), by index into `rooms`. */
export function roomPieces(f: Floor): number[] {
  return (f.layout?.pieces ?? []).flatMap((p, i) => (p.role === 'corridor' ? [] : [i]));
}

/** An open cell in the room, clear of everything else, nearest a wall (a nook, not the aisle). */
function nookCell(f: Floor, i: number, rng: Rng): Cell | null {
  const r = f.rooms[i]!;
  const busy = new Set<string>(
    [
      f.chest,
      f.stairsUp,
      ...(f.stairsDown ? [f.stairsDown] : []),
      ...f.loot.map((l) => l.cell),
      ...(f.traps ?? []).map((t) => t.cell),
      ...(f.shrines ?? []).map((s) => s.cell),
      ...(f.packs ?? []).map((p) => p.cell),
      ...f.wildSpots.map((w) => w.cell),
    ].map((c) => `${c.x},${c.y}`),
  );
  const open: Array<{ c: Cell; walls: number }> = [];
  for (let y = r.y; y < r.y + r.h; y++)
    for (let x = r.x; x < r.x + r.w; x++) {
      if (f.cells[y * f.cols + x] !== FLOOR || busy.has(`${x},${y}`)) continue;
      let walls = 0;
      for (const [dx, dy] of [
        [1, 0],
        [-1, 0],
        [0, 1],
        [0, -1],
      ] as const)
        if (f.cells[(y + dy) * f.cols + x + dx] !== FLOOR) walls++;
      if (walls < 3) open.push({ c: { x, y }, walls });
    }
  if (!open.length) return null;
  const want = Math.max(...open.map((o) => o.walls));
  const best = open.filter((o) => o.walls === want);
  return rng.pick(best).c;
}

/**
 * Fill a finished floor's bare rooms with nursery nooks; an act floor's wild ones come from
 * its pool (`act` null: the Deep Hollow keeps whoever it rolled). Mutates the floor.
 */
export function fillRooms(f: Floor, seed: number, depth: number, act: number | null): Floor {
  const rng = Rng.fromSeed(`${seed}:${depth}:${act ?? -1}:rooms`);
  spreadPacks(f);
  const pool = act === null ? null : ACT_WILD[act];
  if (pool?.length) for (const w of f.wildSpots) w.species = rng.pick(pool);
  const fallback = f.wildSpots.map((w) => w.species);
  for (const i of roomPieces(f)) {
    if (roomHasContent(f, i)) continue;
    const species = pool?.length ? rng.pick(pool) : fallback.length ? rng.pick(fallback) : null;
    const cell = species ? nookCell(f, i, rng) : null;
    if (species && cell) f.wildSpots.push({ cell, species, nook: true });
  }
  return f;
}

/**
 * R0198: one step beside a nursery nook. Standing still counts up; walking starts over. A
 * Shy friend in the party settles the baby sooner. True once it may be scanned.
 */
export function quietScan(world: World, run: DungeonRun, w: DungeonWild, dtMs: number): boolean {
  const k = world.keeper;
  if (k.moveTarget || k.intent) {
    w.quietMs = 0;
    return false;
  }
  w.quietMs = (w.quietMs ?? 0) + dtMs;
  const shy = run.party.some((id) => world.nubbins.find((n) => n.id === id)?.personality === 'shy');
  return w.quietMs >= (shy ? HOLLOW_R7.nook.shyMs : HOLLOW_R7.nook.quietMs);
}

/** Rooms next to room `i`: linked directly, or through one corridor piece. */
export function roomNeighbours(f: Floor, i: number): number[] {
  const L = f.layout;
  if (!L) return [];
  const direct = (j: number) => L.links.flatMap(([a, b]) => (a === j ? [b] : b === j ? [a] : []));
  const out = new Set<number>();
  for (const j of direct(i)) {
    if (L.pieces[j]!.role !== 'corridor') out.add(j);
    else for (const k of direct(j)) if (k !== i && L.pieces[k]!.role !== 'corridor') out.add(k);
  }
  return [...out];
}

/** A pack that roams a room (not a treasure guard, a named unique or the boss). */
function roaming(p: NonNullable<Floor['packs']>[number]): boolean {
  return !p.guard && !p.unique && p.kind !== 'boss' && p.room >= 0;
}

/** An open cell in room `i` that keeps the density rules (R0158) for pack `p`, nearest its middle. */
function packCell(f: Floor, i: number, p: object): Cell | null {
  const r = f.rooms[i]!;
  const wp = waypointCell(f);
  const mid = { x: r.x + r.w / 2, y: r.y + r.h / 2 };
  let best: Cell | null = null;
  let bestD = Infinity;
  for (let y = r.y; y < r.y + r.h; y++)
    for (let x = r.x; x < r.x + r.w; x++) {
      const c = { x, y };
      if (f.cells[y * f.cols + x] !== FLOOR) continue;
      if (cellDist(c, f.stairsUp) < DENSITY.fromEntry || cellDist(c, wp) < DENSITY.fromWaypoint)
        continue;
      if (f.packs!.some((q) => q !== p && !q.guard && cellDist(c, q.cell) < DENSITY.spacing))
        continue;
      const d = Math.hypot(x - mid.x, y - mid.y);
      if (d < bestD) {
        bestD = d;
        best = c;
      }
    }
  return best;
}

/**
 * R0201: on Cosy no two roaming packs sit in neighbouring rooms. A pack next to an earlier
 * one moves to a quiet room far enough from the entry, or stays out of this floor.
 */
export function spreadPacks(f: Floor): void {
  if (!f.packs?.length || !f.layout) return;
  const rooms = roomPieces(f).filter((i) => {
    const role = f.layout!.pieces[i]!.role;
    return role === 'hub' && i !== f.nook?.room;
  });
  const held = (i: number, except: object) =>
    f.packs!.some((p) => p !== except && p.room === i && roaming(p));
  const crowded = (i: number, except: object) =>
    held(i, except) || roomNeighbours(f, i).some((j) => held(j, except));
  const dropped = new Set<object>();
  for (const p of f.packs) {
    if (!roaming(p) || !crowded(p.room, p)) continue;
    let to: number | undefined;
    let cell: Cell | null = null;
    for (const i of rooms) {
      if (crowded(i, p) || f.packs.some((q) => q.room === i)) continue;
      cell = packCell(f, i, p);
      if (cell) {
        to = i;
        break;
      }
    }
    if (to !== undefined && cell) {
      p.room = to;
      p.cell = cell;
    } else {
      // Nowhere quiet left: it sits this floor out (and no longer crowds anyone).
      dropped.add(p);
      p.room = -1;
    }
  }
  f.packs = f.packs.filter((p) => !dropped.has(p));
}
