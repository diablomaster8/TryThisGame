/**
 * Light puzzles in the Hollow (R0202, DUNG-59) and critter-part shortcuts (R0212, DUNG-71).
 *
 * Some levels get one puzzle, laid out in a room off the way down (a hub or treasure room
 * with a clear 5×5 patch of floor, its board). The patch and the ring round it are what the
 * block solver walks. Solving it opens a chest of finds on the ring. Three kinds:
 * - plates: two or three pressure plates; the Keeper and the party Nubbins stand on them (a
 *   plate stays down a few seconds after you step off) and the chest opens once all are down;
 * - torches: three or four torch stands, lit by walking up to them in the order the mural
 *   shows (its symbols); a wrong one puts them all out again, gently;
 * - blocks: a push-block board from an authored set of twelve; walk into a block to push it.
 *   The chest opens when every block sits on a target. A board that can no longer be solved
 *   quietly sets itself back.
 *
 * R0212: a puzzle may also have a part spot (an icon hint on the ring). A party Nubbin with
 * a matching critter part solves it there and then: fins dive for the lever under the pool,
 * wings fetch the key from the high ledge, strong arms shove the heavy blocks home. Without
 * the part, the puzzle itself is the longer way round. Kid mode (the Learning Grove or gentle
 * bouts) shows a hint arrow after half a minute on the puzzle.
 *
 * The puzzle is a `Seal` (dungeon-secrets.ts): its pillars are rock on the floor (the only
 * cells it changes) and its chest appears once it opens. Pure sim: no DOM.
 */
import { FLOORS_R8 } from '../config/dungeon-floors-r8';
import { ALL_CRITTERS } from './critters';
import { cellCentre, cellOf, FLOOR, WALL, type Cell, type Floor } from './dungeon';
import {
  openSeal,
  placeBossDoor,
  placeSecrets,
  sealOpen,
  sealRng,
  stash,
  type Rect,
  type Seal,
} from './dungeon-secrets';
import type { Rng } from './rng';
import type { DungeonRun, SimEvent, World } from './types';

const P = FLOORS_R8.puzzles;

export type PuzzleKind = 'plates' | 'torches' | 'blocks';
export type PartShortcut = 'swim' | 'fly' | 'power';

export interface Puzzle {
  kind: PuzzleKind;
  /** The 7×7 patch: the 5×5 board and its ring. */
  area: Rect;
  /** The patch's 49 cells, row-major (`G` wide). */
  grid: Cell[];
  /** Cells that are rock in the run's floor (a block board's pillars). */
  pillars: Cell[];
  /** Ring cells (patch indexes) nobody can stand on: rock or water round the board. */
  closed: number[];
  plates?: Cell[];
  /** Torch stands, each with its symbol (its index); `order` is the mural's order. */
  torches?: Cell[];
  order?: number[];
  /** The cell the mural stands on (on the ring). */
  mural?: Cell;
  /** Index into `BLOCK_LAYOUTS`. */
  layout?: number;
  /** R0212: the part spot on the ring. */
  shortcut?: { part: PartShortcut; spot: Cell };
}

/** Which part solves which kind of puzzle the short way. */
export const SHORTCUT_PART: Record<PuzzleKind, PartShortcut> = {
  plates: 'swim',
  torches: 'fly',
  blocks: 'power',
};

/** The push-block boards: `#` pillar, `B` block, `T` target, `.` floor. */
export const BLOCK_LAYOUTS: readonly (readonly string[])[] = [
  ['.....', '..B..', '.....', '.T...', '.....'],
  ['.....', '.B...', '..#..', '...T.', '.....'],
  ['.....', '..B..', '.#.#.', '..T..', '.....'],
  ['.....', '.B.B.', '.....', '.T.T.', '.....'],
  ['.....', '...B.', '.#...', '...#.', 'T....'],
  ['.....', '.#B#.', '.....', '.....', '...T.'],
  ['.....', '..B..', '.B...', 'T....', '..T..'],
  ['.#...', '..B..', '...#.', '.T...', '.....'],
  ['.....', '.B.#.', '.....', '#..T.', '.....'],
  ['.....', '...B.', '.B...', '.....', 'T...T'],
  ['.....', '.....', '.#B#.', '.....', '.T...'],
  ['.....', '.B...', '...B.', '.#.#.', 'T...T'],
];

/** The patch is `G` wide: the board and a ring of one. */
const G = P.board + 2;
const MURAL = 3;
const SPOT = G * (G - 1) + 3;

const inner = (g: number) => {
  const x = g % G;
  const y = Math.floor(g / G);
  return x > 0 && y > 0 && x < G - 1 && y < G - 1;
};

// ---------------------------------------------------------------- the block solver

/** A board's blocks, pillars and targets as patch indexes. */
export function layoutOf(i: number): { blocks: number[]; pillars: Set<number>; targets: number[] } {
  const hit = layouts.get(i);
  if (hit) return { blocks: [...hit.blocks], pillars: hit.pillars, targets: hit.targets };
  const blocks: number[] = [];
  const targets: number[] = [];
  const pillars = new Set<number>();
  BLOCK_LAYOUTS[i]!.forEach((r, y) =>
    [...r].forEach((ch, x) => {
      const g = (y + 1) * G + x + 1;
      if (ch === 'B') blocks.push(g);
      else if (ch === 'T') targets.push(g);
      else if (ch === '#') pillars.add(g);
    }),
  );
  layouts.set(i, { blocks, pillars, targets });
  return { blocks: [...blocks], pillars, targets };
}

const layouts = new Map<number, { blocks: number[]; pillars: Set<number>; targets: number[] }>();

const STEPS = [
  [1, 0],
  [-1, 0],
  [0, 1],
  [0, -1],
] as const;

function stepOn(g: number, d: readonly [number, number]): number {
  const x = (g % G) + d[0];
  const y = Math.floor(g / G) + d[1];
  return x < 0 || y < 0 || x >= G || y >= G ? -1 : y * G + x;
}

/**
 * Breadth-first solve of a block board, the Keeper at patch cell `keeper` and the blocks at
 * `blocks`: the Keeper's cells in order to a state with every target covered, or null if
 * there is none. Blocks stay on the board; the Keeper may walk the ring. Small, so cheap.
 */
export function solveBlocks(
  layout: number,
  blocks: readonly number[],
  keeper: number,
  closed: readonly number[] = [],
): number[] | null {
  const { targets, pillars: fixed } = layoutOf(layout);
  const solid = new Uint8Array(G * G);
  for (const g of fixed) solid[g] = 1;
  for (const g of closed) solid[g] = 1;
  // A state is the Keeper's cell and the blocks' cells, sorted, packed into one number.
  const nb = blocks.length;
  const pack = (k: number, b: readonly number[]) => {
    let key = 0;
    for (let i = nb - 1; i >= 0; i--) key = key * 64 + b[i]!;
    return key * 64 + k;
  };
  const unpack = (key: number, b: number[]) => {
    const k = key % 64;
    let rest = (key - k) / 64;
    for (let i = 0; i < nb; i++) {
      b[i] = rest % 64;
      rest = (rest - b[i]!) / 64;
    }
    return k;
  };
  const sorted = (b: number[]) => b.sort((x, y) => x - y);
  const startKey = pack(keeper, sorted([...blocks]));
  const parent = new Map<number, number>([[startKey, -1]]);
  const q = [startKey];
  const b: number[] = new Array<number>(nb);
  for (let i = 0; i < q.length; i++) {
    const key = q[i]!;
    const k = unpack(key, b);
    if (targets.every((t) => b.includes(t))) {
      const path: number[] = [];
      for (let at = key; parent.get(at)! >= 0; at = parent.get(at)!) path.push(at % 64);
      return path.reverse();
    }
    for (const d of STEPS) {
      const n = stepOn(k, d);
      if (n < 0 || solid[n]) continue;
      let next = b;
      const hit = b.indexOf(n);
      if (hit >= 0) {
        const to = stepOn(n, d);
        if (to < 0 || !inner(to) || solid[to] || b.includes(to)) continue;
        next = [...b];
        next[hit] = to;
        sorted(next);
      }
      const nk = pack(n, next);
      if (parent.has(nk)) continue;
      parent.set(nk, key);
      q.push(nk);
    }
  }
  return null;
}

// ---------------------------------------------------------------- generation

/**
 * A clear 5×5 board in a room off the way down, as its 7×7 patch with the ring, or null.
 * Loot, packs' homes and crystals may share it; the stairs, the chest, shrines, traps,
 * nursery nooks and the landmark may not.
 */
function findArea(f: Floor, rng: Rng, taken: Uint8Array): Rect | null {
  const L = f.layout;
  if (!L) return null;
  const busy = new Uint8Array(f.cells.length);
  const keep = [
    f.stairsUp,
    f.chest,
    ...(f.stairsDown ? [f.stairsDown] : []),
    ...(f.landmark ? [f.landmark.cell] : []),
    ...f.wildSpots.map((w) => w.cell),
    ...(f.shrines ?? []).map((s) => s.cell),
    ...(f.traps ?? []).map((t) => t.cell),
    ...(f.nook?.rug ?? []),
  ];
  for (const c of keep) busy[c.y * f.cols + c.x] = 1;
  const rooms = L.pieces.filter((p) => p.role === 'hub' || p.role === 'treasure');
  const B = P.board;
  const found: Rect[] = [];
  for (const p of rooms)
    for (let y = p.at.y; y + B <= p.at.y + p.size[1]; y++)
      for (let x = p.at.x; x + B <= p.at.x + p.size[0]; x++) {
        if (x < 1 || y < 1 || x + B >= f.cols - 1 || y + B >= f.rows - 1) continue;
        let ok = true;
        for (let dy = 0; dy < B && ok; dy++)
          for (let dx = 0; dx < B && ok; dx++) {
            const i = (y + dy) * f.cols + x + dx;
            if (f.cells[i] !== FLOOR || busy[i] || taken[i]) ok = false;
          }
        if (ok) found.push({ x: x - 1, y: y - 1, w: G, h: G });
      }
  return found.length ? rng.pick(found) : null;
}

/** R0202: maybe one puzzle in a room off the way down. Adds to `f.seals` only. */
export function placePuzzle(f: Floor, rng: Rng, depth: number, taken: Uint8Array): void {
  if (!rng.chance(P.chance)) return;
  const area = findArea(f, rng, taken);
  if (!area) return;
  for (let y = area.y; y < area.y + G; y++)
    for (let x = area.x; x < area.x + G; x++) taken[y * f.cols + x] = 1;
  const grid: Cell[] = [];
  for (let y = 0; y < G; y++)
    for (let x = 0; x < G; x++) grid.push({ x: area.x + x, y: area.y + y });
  const closed = grid.flatMap((c, g) => (f.cells[c.y * f.cols + c.x] === FLOOR ? [] : [g]));
  let kind: PuzzleKind = rng.pick(['plates', 'torches', 'blocks'] as const);
  // A block board needs a layout it can be solved in from the ring as it stands.
  let layout = -1;
  if (kind === 'blocks') {
    const first = rng.int(0, BLOCK_LAYOUTS.length - 1);
    const from = [...Array(G * G).keys()].find((g) => !inner(g) && !closed.includes(g)) ?? 0;
    // Pillars turn to rock, so never on a find, a pack's home or a stray's start.
    const soft = new Set(
      [
        ...f.loot.map((l) => l.cell),
        ...(f.packs ?? []).map((p) => p.cell),
        ...f.strayStarts,
        ...f.crystals,
        ...f.torches,
      ].map((c) => c.y * f.cols + c.x),
    );
    const clear = (i: number) =>
      [...layoutOf(i).pillars].every((g) => !soft.has(grid[g]!.y * f.cols + grid[g]!.x));
    for (let k = 0; k < BLOCK_LAYOUTS.length && layout < 0; k++) {
      const i = (first + k) % BLOCK_LAYOUTS.length;
      if (clear(i) && solveBlocks(i, layoutOf(i).blocks, from, closed)) layout = i;
    }
    if (layout < 0) kind = 'plates';
  }
  const puzzle: Puzzle = { kind, area, grid, pillars: [], closed };
  const board = grid.map((_, g) => g).filter(inner);
  const take = (n: number, from: number[]): number[] => {
    const pool = [...from];
    const out: number[] = [];
    while (out.length < n && pool.length) out.push(pool.splice(rng.int(0, pool.length - 1), 1)[0]!);
    return out;
  };
  if (kind === 'plates') {
    puzzle.plates = take(rng.int(P.plates[0], P.plates[1]), board).map((g) => grid[g]!);
  } else if (kind === 'torches') {
    const edge = board.filter((g) => {
      const x = g % G;
      const y = Math.floor(g / G);
      return x === 1 || y === 1 || x === G - 2 || y === G - 2;
    });
    const torches = take(rng.int(P.torches[0], P.torches[1]), edge);
    puzzle.torches = torches.map((g) => grid[g]!);
    puzzle.order = take(
      torches.length,
      torches.map((_, i) => i),
    );
    puzzle.mural = grid[MURAL]!;
  } else {
    puzzle.layout = layout;
    puzzle.pillars = [...layoutOf(puzzle.layout).pillars].map((g) => grid[g]!);
    for (const c of puzzle.pillars) f.cells[c.y * f.cols + c.x] = WALL;
  }
  // The part spot and the chest stand on open ring cells (the board's edge if the ring is rock).
  const ring = (g: number) => (closed.includes(g) ? g + (g < G ? G : -G) : g);
  const spot = grid[ring(SPOT)]!;
  if (rng.chance(P.shortcutChance)) puzzle.shortcut = { part: SHORTCUT_PART[kind], spot };
  const id = `${depth}:puzzle`;
  const chest = [ring(0) === 0 ? 0 : G + 1, ring(G - 1) === G - 1 ? G - 1 : 2 * G - 2];
  (f.seals ??= []).push({
    id,
    kind: 'puzzle',
    door: [],
    front: spot,
    region: [],
    loot: stash(
      rng,
      `loot-${id}`,
      chest.map((g) => grid[g]!),
      depth,
      P.shells,
    ),
    puzzle,
  });
}

/**
 * Lane B r8: a finished version-4 floor's seals, on their own seeded stream after everything
 * else: the puzzle, then the secret rooms, then the boss door. The floor's cells never change.
 */
export function addSeals(f: Floor, seed: number, depth: number, act: number | null): void {
  if (f.zone) return;
  const rng = sealRng(seed, depth, act);
  const taken = new Uint8Array(f.cells.length);
  placePuzzle(f, rng, depth, taken);
  placeSecrets(f, rng, depth, taken);
  placeBossDoor(f, depth);
}

// ---------------------------------------------------------------- play

interface Live {
  /** The Keeper's floor cell index last tick. */
  prev: number;
  plates: Map<number, number>;
  onMs: number;
}
const live = new WeakMap<DungeonRun, Map<string, Live>>();

function liveOf(run: DungeonRun, id: string): Live {
  let m = live.get(run);
  if (!m) live.set(run, (m = new Map()));
  let l = m.get(id);
  if (!l) m.set(id, (l = { prev: -1, plates: new Map(), onMs: 0 }));
  return l;
}

const hints = new WeakMap<DungeonRun, { cell: Cell | null; atMs: number }>();

/** Kid mode's hint arrow cell on this run (R0202), or null; the renderers draw it. */
export function hintFor(run: DungeonRun): Cell | null {
  return hints.get(run)?.cell ?? null;
}

/** The plates down right now (indexes into `plates`), for the renderers. */
export function platesDown(run: DungeonRun, id: string): number[] {
  return [...(live.get(run)?.get(id)?.plates.keys() ?? [])];
}

function gridIndex(p: Puzzle, c: Cell): number {
  const x = c.x - p.area.x;
  const y = c.y - p.area.y;
  return x < 0 || y < 0 || x >= G || y >= G ? -1 : y * G + x;
}

/** A block board's blocks as they stand on this run (patch indexes). */
export function blocksNow(run: DungeonRun, s: Seal): number[] {
  const saved = run.puzzles?.[s.id];
  return saved ? [...saved] : layoutOf(s.puzzle!.layout!).blocks;
}

/** Torches lit so far on this run. */
export function torchesLit(run: DungeonRun, s: Seal): number {
  return run.puzzles?.[s.id]?.[0] ?? 0;
}

/** A party Nubbin with a critter part of the given type (R0212), or null. */
export function partFriend(world: World, run: DungeonRun, part: PartShortcut): string | null {
  for (const id of run.party) {
    const n = world.nubbins.find((x) => x.id === id);
    if (!n) continue;
    for (const v of Object.values(n.parts))
      if (typeof v === 'string' && ALL_CRITTERS.find((c) => c.id === v)?.type === part) return id;
  }
  return null;
}

function kidMode(world: World): boolean {
  return !!world.edu || world.settings.bouts === 'gentle' || !!world.dungeon?.kid;
}

/** Each tick: plates, torches, blocks and part spots on the floor's puzzle. */
export function stepPuzzles(
  world: World,
  run: DungeonRun,
  f: Floor,
  dtMs: number,
  events: SimEvent[],
): void {
  // Kid mode's arrow, worked out twice a second for the renderers (`hintFor`).
  const h = hints.get(run);
  if (!h || Math.abs(world.timeMs - h.atMs) >= 500)
    hints.set(run, { cell: puzzleHint(world, run, f), atMs: world.timeMs });
  for (const s of f.seals ?? []) {
    if (s.kind !== 'puzzle' || !s.puzzle || sealOpen(run, s)) continue;
    const p = s.puzzle;
    const l = liveOf(run, s.id);
    const kc = cellOf(f, world.keeper.pos);
    const ki = kc.y * f.cols + kc.x;
    const here = gridIndex(p, kc);
    l.onMs = here >= 0 ? l.onMs + dtMs : 0;
    const solved = (what: 'solved' | 'shortcut', nubbinId?: string) => {
      openSeal(run, s);
      events.push({
        kind: 'hollowPuzzle',
        what,
        puzzle: p.kind,
        ...(nubbinId ? { nubbinId } : {}),
      });
    };
    // R0212: the part spot.
    const sc = p.shortcut;
    if (sc && kc.x === sc.spot.x && kc.y === sc.spot.y) {
      const who = partFriend(world, run, sc.part);
      if (who) {
        solved('shortcut', who);
        continue;
      }
    }
    if (p.kind === 'plates') {
      const feet = [kc];
      for (const id of run.party) {
        const n = world.nubbins.find((x) => x.id === id);
        if (n) feet.push(cellOf(f, n.pos));
      }
      p.plates!.forEach((c, i) => {
        if (feet.some((q) => q.x === c.x && q.y === c.y)) {
          if (!l.plates.has(i))
            events.push({ kind: 'hollowPuzzle', what: 'plate', puzzle: p.kind });
          l.plates.set(i, P.plateHoldMs);
        } else if (l.plates.has(i)) {
          const left = l.plates.get(i)! - dtMs;
          if (left <= 0) l.plates.delete(i);
          else l.plates.set(i, left);
        }
      });
      if (l.plates.size === p.plates!.length) solved('solved');
    } else if (p.kind === 'torches') {
      const t = ki !== l.prev ? p.torches!.findIndex((c) => c.x === kc.x && c.y === kc.y) : -1;
      const done = torchesLit(run, s);
      if (t >= 0 && !p.order!.slice(0, done).includes(t)) {
        const puzzles = (run.puzzles ??= {});
        if (p.order![done] === t) {
          puzzles[s.id] = [done + 1];
          events.push({ kind: 'hollowPuzzle', what: 'torch', puzzle: p.kind });
          if (done + 1 === p.order!.length) solved('solved');
        } else if (done > 0) {
          puzzles[s.id] = [0];
          events.push({ kind: 'hollowPuzzle', what: 'reset', puzzle: p.kind });
        }
      }
    } else if (p.kind === 'blocks') {
      if (here >= 0) stepBlocks(world, run, f, s, l, here, events);
      const { targets } = layoutOf(p.layout!);
      const b = blocksNow(run, s);
      if (targets.every((t) => b.includes(t))) solved('solved');
    }
    l.prev = cellOf(f, world.keeper.pos).y * f.cols + cellOf(f, world.keeper.pos).x;
  }
}

function stepBlocks(
  world: World,
  run: DungeonRun,
  f: Floor,
  s: Seal,
  l: Live,
  here: number,
  events: SimEvent[],
): void {
  const p = s.puzzle!;
  const b = blocksNow(run, s);
  const hit = b.indexOf(here);
  if (hit < 0 || l.prev < 0) return;
  const k = world.keeper;
  const { pillars } = layoutOf(p.layout!);
  const px = l.prev % f.cols;
  const py = (l.prev - px) / f.cols;
  const dx = p.grid[here]!.x - px;
  const dy = p.grid[here]!.y - py;
  const to = Math.abs(dx) + Math.abs(dy) === 1 ? stepOn(here, [dx, dy]) : -1;
  if (to >= 0 && inner(to) && !pillars.has(to) && !b.includes(to) && !p.closed.includes(here)) {
    b[hit] = to;
    (run.puzzles ??= {})[s.id] = b;
    events.push({ kind: 'hollowPuzzle', what: 'push', puzzle: p.kind });
    // A board that can no longer be solved quietly sets itself back.
    if (!solveBlocks(p.layout!, b, here, p.closed)) {
      delete run.puzzles![s.id];
      events.push({ kind: 'hollowPuzzle', what: 'reset', puzzle: p.kind });
    }
    return;
  }
  // The block will not budge: the Keeper stays where they were.
  const at = cellCentre(f, { x: px, y: py });
  k.pos = { x: at.x, z: at.z };
  k.moveTarget = null;
}

/**
 * Kid mode's hint arrow (R0202): after half a minute on a puzzle, the cell to go to next,
 * else null.
 */
export function puzzleHint(world: World, run: DungeonRun, f: Floor): Cell | null {
  if (!kidMode(world)) return null;
  for (const s of f.seals ?? []) {
    if (s.kind !== 'puzzle' || !s.puzzle || sealOpen(run, s)) continue;
    const l = live.get(run)?.get(s.id);
    if (!l || l.onMs < P.hintMs) continue;
    const p = s.puzzle;
    if (p.shortcut && partFriend(world, run, p.shortcut.part)) return p.shortcut.spot;
    if (p.kind === 'plates') {
      const i = p.plates!.findIndex((_, k) => !l.plates.has(k));
      return i >= 0 ? p.plates![i]! : null;
    }
    if (p.kind === 'torches') {
      const t = p.order![torchesLit(run, s)];
      return t === undefined ? null : p.torches![t]!;
    }
    const here = gridIndex(p, cellOf(f, world.keeper.pos));
    const b = blocksNow(run, s);
    const path = solveBlocks(p.layout!, b, here >= 0 ? here : 0, p.closed);
    // The cell of the next push, else the next step.
    const push = path?.find((g) => b.includes(g)) ?? path?.[0];
    return push === undefined ? null : p.grid[push]!;
  }
  return null;
}
