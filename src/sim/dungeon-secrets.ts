/**
 * Sealed places on a Hollow floor (lane B round 8, "floors"): secret rooms (R0182, DUNG-39),
 * the puzzle rooms' rewards and pillars (R0202, R0212) and the boss arena's door (R0160).
 *
 * Each is a `Seal` on the generated floor, which is made in every seal's starting state
 * (secrets shut, puzzles unsolved, the boss door open). Nav masks, props and the renderers
 * cache by floor, so a flipped seal gives a new derived floor (`withSeals`), cached by the
 * base floor and the flipped seals: the renderers see a new floor and rebuild, nav replans.
 *
 * A secret room is one of the floor's side caves (the generator records each cave and the
 * tunnel dug to it) that holds nothing anyone needs but finds: until it is found its cells
 * are solid rock, so neither renderer nor the automap gives it away, and its finds wait. It opens
 * when the Keeper leans on the cracked wall at its mouth for a second, or when a Light or
 * Scout friend in the party walks by. The boss door is open at the start and seals behind
 * the Keeper once they are well inside the arena; it opens again when the boss is beaten or
 * the Keeper is back outside (a loss puts them in the anteroom). Everything here runs on its
 * own seeded stream after the rest of the floor is made, so nothing else moves. Pure sim.
 */
import { FLOORS_R8 } from '../config/dungeon-floors-r8';
import { DUNGEON } from '../config/tuning';
import { CRITTER_SPECIES } from './critters';
import { cellCentre, cellOf, FLOOR, WALL, type Cell, type Floor, type FloorLoot } from './dungeon';
import { sideCaves } from './dungeon-gen-v3';
import type { Puzzle } from './dungeon-puzzles';
import { Rng } from './rng';
import { levelOf } from './stats';
import { NUBBIN_TYPES, type DungeonRun, type SimEvent, type World } from './types';

const S = FLOORS_R8.secrets;

export interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
}

export type SealKind = 'secret' | 'puzzle' | 'boss';

export interface Seal {
  /** Unique within a run: the depth is part of it. */
  id: string;
  kind: SealKind;
  /** The cells that shut: a secret room's mouth, the boss arena's doorway. */
  door: Cell[];
  /** Where the Keeper stands: outside a secret's mouth, the boss's anteroom, a puzzle's spot. */
  front: Cell;
  /** A secret room's cells (rock while it is closed), and what each was before. */
  region: Cell[];
  was?: number[];
  /** Finds the generator had put in a secret room, kept back until it opens. */
  hidden?: FloorLoot[];
  /** Finds that appear once it opens (a secret's stash, a solved puzzle's chest). */
  loot: FloorLoot[];
  /** The boss door: open at the start, it closes behind the Keeper. */
  startsOpen?: true;
  /** The boss arena's room. */
  room?: Rect;
  /** A puzzle room's puzzle (dungeon-puzzles.ts). */
  puzzle?: Puzzle;
}

export const FOUR = [
  [1, 0],
  [-1, 0],
  [0, 1],
  [0, -1],
] as const;

// ---------------------------------------------------------------- state

/** Is the seal open on this run (a secret found, a puzzle solved, the boss door open)? */
export function sealOpen(run: DungeonRun, s: Seal): boolean {
  const toggled = !!run.seals?.includes(s.id);
  return s.startsOpen ? !toggled : toggled;
}

function toggleSeal(run: DungeonRun, id: string): void {
  const list = (run.seals ??= []);
  const i = list.indexOf(id);
  if (i >= 0) list.splice(i, 1);
  else list.push(id);
}

export function openSeal(run: DungeonRun, s: Seal): void {
  if (!sealOpen(run, s)) toggleSeal(run, s.id);
}

export function closeSeal(run: DungeonRun, s: Seal): void {
  if (sealOpen(run, s)) toggleSeal(run, s.id);
}

const derived = new WeakMap<Floor, Map<string, Floor>>();

/**
 * The floor as the run sees it: the generated floor with every flipped seal applied. The
 * same base and flips give the same object, so per-floor caches stay warm.
 */
export function withSeals(run: DungeonRun, base: Floor): Floor {
  if (!base.seals?.length || !run.seals?.length) return base;
  const flipped = base.seals.filter((s) => run.seals!.includes(s.id));
  if (flipped.length === 0) return base;
  const key = flipped.map((s) => s.id).join('|');
  let byKey = derived.get(base);
  if (!byKey) derived.set(base, (byKey = new Map()));
  const hit = byKey.get(key);
  if (hit) return hit;
  const f: Floor = { ...base, cells: base.cells.slice(), loot: [...base.loot] };
  for (const s of flipped) {
    if (s.kind === 'boss') {
      for (const c of s.door) f.cells[c.y * f.cols + c.x] = WALL;
      continue;
    }
    s.region.forEach((c, i) => (f.cells[c.y * f.cols + c.x] = s.was![i]!));
    f.loot.push(...(s.hidden ?? []), ...s.loot);
  }
  if (byKey.size > 16) byKey.delete(byKey.keys().next().value!);
  byKey.set(key, f);
  return f;
}

// ---------------------------------------------------------------- shared helpers

/** Open (not rock) cells reachable from the stairs up, as a mask. */
export function reachable(f: Floor, without?: Uint8Array): Uint8Array {
  const seen = new Uint8Array(f.cells.length);
  const start = f.stairsUp.y * f.cols + f.stairsUp.x;
  const q = [start];
  seen[start] = 1;
  for (let k = 0; k < q.length; k++) {
    const i = q[k]!;
    const x = i % f.cols;
    const y = (i - x) / f.cols;
    for (const [dx, dy] of FOUR) {
      const nx = x + dx;
      const ny = y + dy;
      if (nx < 0 || ny < 0 || nx >= f.cols || ny >= f.rows) continue;
      const j = ny * f.cols + nx;
      if (seen[j] || f.cells[j] === WALL || without?.[j]) continue;
      seen[j] = 1;
      q.push(j);
    }
  }
  return seen;
}

/** Cells something on the floor already stands on (no secret room may swallow them). */
export function busyCells(f: Floor): Cell[] {
  return [
    f.stairsUp,
    f.chest,
    ...(f.stairsDown ? [f.stairsDown] : []),
    ...(f.landmark ? [f.landmark.cell] : []),
    ...f.torches,
    ...f.crystals,
    ...f.strayStarts,
    ...f.wildSpots.map((w) => w.cell),
    ...(f.shrines ?? []).map((s) => s.cell),
    ...(f.traps ?? []).map((t) => t.cell),
    ...(f.packs ?? []).map((p) => p.cell),
    ...(f.nook?.rug ?? []),
  ];
}

/** A small stash of finds: Shells, then an essence, a critter or stones. */
export function stash(
  rng: Rng,
  id: string,
  cells: Cell[],
  depth: number,
  shells: readonly [number, number],
): FloorLoot[] {
  const out: FloorLoot[] = [];
  if (cells[0])
    out.push({
      id: `${id}-0`,
      kind: 'shells',
      cell: cells[0],
      amount: shells[0] + shells[1] * depth + rng.int(0, 6),
      param: null,
    });
  if (cells[1]) {
    const roll = rng.next();
    const kind = roll < 0.45 ? 'essence' : roll < 0.8 ? 'critter' : 'stone';
    out.push({
      id: `${id}-1`,
      kind,
      cell: cells[1],
      amount: kind === 'stone' ? 3 : 1,
      param:
        kind === 'essence'
          ? rng.pick(NUBBIN_TYPES)
          : kind === 'critter'
            ? rng.pick(CRITTER_SPECIES).id
            : null,
    });
  }
  return out;
}

// ---------------------------------------------------------------- secrets

/** How many secret rooms a level rolls (before checking that it has caves for them). */
export function secretCount(rng: Rng): number {
  const r = rng.next();
  const [a, b] = S.countWeights;
  return r < a ? 0 : r < a + b ? 1 : 2;
}

interface Candidate {
  region: number[];
  mouth: number[];
  front: number;
}

/**
 * A side cave that can be a secret room: open, reachable, holding nothing anyone needs, with
 * a small mouth, and shutting it cuts nothing else off.
 */
function candidate(
  f: Floor,
  cave: readonly number[],
  base: Uint8Array,
  busy: Set<number>,
  taken: Uint8Array,
  nooks: Set<number>,
): Candidate | null {
  const region = cave.filter((i) => f.cells[i] !== WALL);
  if (region.length < S.minCells || region.length > S.maxCells) return null;
  // A jump nook belongs to the platforming (R0031): its find is the reward for the jump.
  if (region.some((i) => nooks.has(i))) return null;
  const inRegion = new Set<number>();
  for (const i of region) {
    if (!base[i] || busy.has(i) || taken[i]) return null;
    inRegion.add(i);
  }
  const mouth: number[] = [];
  const contacts: number[] = [];
  let front = -1;
  for (const i of region) {
    const x = i % f.cols;
    const y = (i - x) / f.cols;
    for (const [dx, dy] of FOUR) {
      const j = (y + dy) * f.cols + x + dx;
      if (inRegion.has(j) || f.cells[j] === WALL) continue;
      if (nooks.has(j)) return null;
      if (!mouth.includes(i)) mouth.push(i);
      if (!contacts.includes(j)) contacts.push(j);
      if (front < 0 && f.cells[j] === FLOOR) front = j;
    }
  }
  if (front < 0 || mouth.length === 0 || mouth.length > S.maxMouth) return null;
  // Shutting it must cut nothing else off: every cell touching it still reaches the others
  // without it (a short local search; the rest of the cave was joined already).
  const want = new Set(contacts);
  const seen = new Set([contacts[0]!]);
  const q = [contacts[0]!];
  want.delete(contacts[0]!);
  for (let k = 0; k < q.length && k < 600 && want.size > 0; k++) {
    const i = q[k]!;
    const x = i % f.cols;
    const y = (i - x) / f.cols;
    for (const [dx, dy] of FOUR) {
      const j = (y + dy) * f.cols + x + dx;
      if (seen.has(j) || inRegion.has(j) || f.cells[j] === WALL) continue;
      seen.add(j);
      want.delete(j);
      q.push(j);
    }
  }
  if (want.size > 0) return null;
  return { region, mouth, front };
}

/** R0182: up to two of the floor's side caves become secret rooms. Adds to `f.seals` only. */
export function placeSecrets(f: Floor, rng: Rng, depth: number, taken: Uint8Array): void {
  const want = secretCount(rng);
  const caves = sideCaves(f);
  if (want === 0 || caves.length === 0) return;
  const base = reachable(f);
  const busy = new Set(busyCells(f).map((c) => c.y * f.cols + c.x));
  // Jump nooks' gaps: a cave holding or touching one is the jump's reward, not a secret.
  const nooks = new Set<number>();
  for (const g of f.gaps ?? []) if (g.nook) for (const c of g.cells) nooks.add(c.y * f.cols + c.x);
  const order = caves.map((_, i) => i);
  for (let i = order.length - 1; i > 0; i--) {
    const j = rng.int(0, i);
    [order[i], order[j]] = [order[j]!, order[i]!];
  }
  const at = (i: number): Cell => ({ x: i % f.cols, y: Math.floor(i / f.cols) });
  let made = 0;
  for (const k of order) {
    if (made >= want) break;
    const c = candidate(f, caves[k]!, base, busy, taken, nooks);
    if (!c) continue;
    for (const i of c.region) taken[i] = 1;
    const id = `${depth}:secret${made}`;
    // The stash sits deepest in: the cells farthest from the mouth.
    const front = at(c.front);
    const far = [...c.region]
      .filter((i) => f.cells[i] === FLOOR)
      .sort((a, b) => {
        const da = Math.hypot(at(a).x - front.x, at(a).y - front.y);
        const db = Math.hypot(at(b).x - front.x, at(b).y - front.y);
        return db - da || a - b;
      });
    // Shut it: its cells turn to rock and its finds wait for it.
    const inside = new Set(c.region);
    const hidden = f.loot.filter((l) => inside.has(l.cell.y * f.cols + l.cell.x));
    f.loot = f.loot.filter((l) => !inside.has(l.cell.y * f.cols + l.cell.x));
    const was = c.region.map((i) => f.cells[i]!);
    for (const i of c.region) f.cells[i] = WALL;
    (f.seals ??= []).push({
      id,
      kind: 'secret',
      door: c.mouth.map(at),
      front,
      region: c.region.map(at),
      was,
      hidden,
      loot: stash(rng, `loot-${id}`, far.slice(0, 2).map(at), depth, S.shells),
    });
    made++;
  }
}

// ---------------------------------------------------------------- the boss door

/** R0160: the boss arena's door, open until the Keeper is inside. */
export function placeBossDoor(f: Floor, depth: number): void {
  const i = f.layout?.pieces.findIndex((p) => p.role === 'boss') ?? -1;
  if (i < 0) return;
  const p = f.layout!.pieces[i]!;
  const room: Rect = { x: p.at.x, y: p.at.y, w: p.size[0], h: p.size[1] };
  const isIn = (c: Cell) =>
    c.x >= room.x && c.y >= room.y && c.x < room.x + room.w && c.y < room.y + room.h;
  const door: Cell[] = [];
  const outside: Cell[] = [];
  for (let y = room.y; y < room.y + room.h; y++)
    for (let x = room.x; x < room.x + room.w; x++) {
      const edge =
        x === room.x || y === room.y || x === room.x + room.w - 1 || y === room.y + room.h - 1;
      if (!edge || f.cells[y * f.cols + x] === WALL) continue;
      // A door cell opens onto open ground outside the room.
      for (const [dx, dy] of FOUR) {
        const o = { x: x + dx, y: y + dy };
        if (isIn(o) || f.cells[o.y * f.cols + o.x] === WALL) continue;
        door.push({ x, y });
        outside.push(o);
        break;
      }
    }
  // The anteroom: the nearest dry floor outside the doorway (a gap may lie across it).
  let front: Cell | null = null;
  const seen = new Set(outside.map((c) => c.y * f.cols + c.x));
  const q = [...outside];
  for (let k = 0; k < q.length && k < 400 && !front; k++) {
    const c = q[k]!;
    if (f.cells[c.y * f.cols + c.x] === FLOOR) {
      front = c;
      break;
    }
    for (const [dx, dy] of FOUR) {
      const o = { x: c.x + dx, y: c.y + dy };
      const i = o.y * f.cols + o.x;
      if (isIn(o) || seen.has(i) || f.cells[i] === WALL) continue;
      seen.add(i);
      q.push(o);
    }
  }
  if (!front || door.length === 0) return;
  (f.seals ??= []).push({
    id: `${depth}:boss`,
    kind: 'boss',
    door,
    front,
    region: [],
    loot: [],
    startsOpen: true,
    room,
  });
}

/** The boss arena's anteroom cell (a lost boss fight puts the Keeper here), if any. */
export function bossAnteroom(f: Floor): Cell | null {
  return f.seals?.find((s) => s.kind === 'boss')?.front ?? null;
}

function bossBeaten(run: DungeonRun, f: Floor): boolean {
  const boss = f.packs?.find((p) => p.kind === 'boss');
  if (!boss) return true;
  return run.packs?.find((p) => p.id === boss.id)?.state === 'beaten';
}

function insideBy(r: Rect, c: Cell, by: number): boolean {
  return c.x >= r.x + by && c.y >= r.y + by && c.x < r.x + r.w - by && c.y < r.y + r.h - by;
}

function stepBossDoor(world: World, run: DungeonRun, f: Floor, s: Seal, events: SimEvent[]) {
  const k = world.keeper;
  const kc = cellOf(f, k.pos);
  const room = s.room!;
  if (sealOpen(run, s)) {
    if (bossBeaten(run, f) || run.encounter) return;
    if (!insideBy(room, kc, FLOORS_R8.boss.sealInside)) return;
    closeSeal(run, s);
    // Friends still in the doorway hop in after the Keeper, so nobody is shut outside.
    for (const id of run.party) {
      const n = world.nubbins.find((x) => x.id === id);
      if (n && !insideBy(room, cellOf(f, n.pos), 1)) n.pos = { x: k.pos.x, z: k.pos.z };
    }
    events.push({ kind: 'hollowBossDoor', sealed: true });
  } else if (bossBeaten(run, f) || !insideBy(room, kc, 0)) {
    openSeal(run, s);
    events.push({ kind: 'hollowBossDoor', sealed: false });
  }
}

// ---------------------------------------------------------------- finding secrets

const bumps = new WeakMap<DungeonRun, Map<string, number>>();

/** A party friend who sees hidden things (a Light or Scout role, or a quick runner), or null. */
export function partySeer(world: World, run: DungeonRun): string | null {
  for (const id of run.party) {
    const role = world.hollow.roles?.[id];
    const n = world.nubbins.find((x) => x.id === id);
    if (!n) continue;
    if (role === 'light' || role === 'scout') return id;
    if (!role && levelOf(n.stats.run.points) >= S.scoutRun) return id;
  }
  return null;
}

/** Is the Keeper leaning into this cell (pushing at it from beside it, or tapping it)? */
function leaning(world: World, f: Floor, c: Cell): boolean {
  const k = world.keeper;
  const at = cellCentre(f, c);
  const dx = at.x - k.pos.x;
  const dz = at.z - k.pos.z;
  const d = Math.hypot(dx, dz);
  if (d > S.bumpCells * DUNGEON.cell) return false;
  const push = Math.hypot(k.input.x, k.input.z);
  if (push > 0.2 && (k.input.x * dx + k.input.z * dz) / (d * push) > 0.5) return true;
  const t = k.moveTarget;
  return !!t && Math.hypot(t.x - at.x, t.z - at.z) < DUNGEON.cell * 0.8;
}

/**
 * Each tick on a floor: secret walls found by leaning or by a seeing friend, and the boss
 * door. `f` is the floor the run stands on.
 */
export function stepSecrets(
  world: World,
  run: DungeonRun,
  f: Floor,
  dtMs: number,
  events: SimEvent[],
): void {
  if (!f.seals?.length) return;
  const kc = cellOf(f, world.keeper.pos);
  let map = bumps.get(run);
  for (const s of f.seals) {
    if (s.kind === 'boss') {
      stepBossDoor(world, run, f, s, events);
      continue;
    }
    if (s.kind !== 'secret' || sealOpen(run, s)) continue;
    let how: 'bump' | 'sight' | null = null;
    const near = s.door.some((c) => Math.hypot(kc.x - c.x, kc.y - c.y) <= S.sightCells);
    if (near && partySeer(world, run)) how = 'sight';
    else if (s.door.some((c) => leaning(world, f, c))) {
      if (!map) bumps.set(run, (map = new Map()));
      const ms = (map.get(s.id) ?? 0) + dtMs;
      map.set(s.id, ms);
      if (ms === dtMs) events.push({ kind: 'hollowSecret', id: s.id, how: 'wiggle' });
      if (ms >= S.bumpMs) how = 'bump';
    } else map?.delete(s.id);
    if (how) {
      openSeal(run, s);
      map?.delete(s.id);
      events.push({ kind: 'hollowSecret', id: s.id, how });
    }
  }
}

/** Secret rooms found on this floor (the automap's ✧ marks). */
export function foundSecrets(run: DungeonRun, f: Floor): Seal[] {
  return (f.seals ?? []).filter((s) => s.kind === 'secret' && sealOpen(run, s));
}

/** The cells a cracked-wall tell is drawn on, for each secret not yet found. */
export function secretTells(run: DungeonRun, f: Floor): Cell[] {
  return (f.seals ?? [])
    .filter((s) => s.kind === 'secret' && !sealOpen(run, s))
    .flatMap((s) => s.door);
}

/** The seals' own stream, so the rest of the floor never moves. */
export function sealRng(seed: number, depth: number, act: number | null): Rng {
  return Rng.fromSeed(`${seed}:${depth}:${act ?? -1}:seals`);
}
