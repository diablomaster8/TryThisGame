import { DUNGEON, KEEPER, SCANS } from '../config/tuning';
import { CRITTER_SPECIES } from './critters';
import { dayKey } from './daily';
import { createEgg, EGG_COLORS } from './nubbin';
import { generateV2 } from './dungeon-gen';
import { nubbinWaypoint } from './dungeon-nav';
import { Rng } from './rng';
import { hasRoom } from './roster';
import { noteScan } from './scans';
import { isCommonSpecies, SPECIES } from './species';
import { addRecruit } from './town';
import {
  FLAVORS,
  NUBBIN_TYPES,
  type DungeonLootKind,
  type DungeonRun,
  type DungeonStray,
  type DungeonWild,
  type Nubbin,
  type SimEvent,
  type Vec2,
  type World,
} from './types';
import { newId, uniqueName } from './world';

/**
 * The Hollow Below: a seeded cave under the Grove, one floor at a time. Each floor is
 * generated from the run's seed and its depth (cellular automata, rooms carved in,
 * wobbly corridors, water pockets, torches on the walls, crystals in the nooks, a chest
 * and a way down). The Keeper walks it with a party of two; loot is picked up by walking
 * over it, Shadow strays snatch Shells unless fed, wild creatures fill the scan bar.
 * Everything here is pure: the renderer paints what `floorOf` returns.
 */
export interface Cell {
  x: number;
  y: number;
}

export interface Room {
  x: number;
  y: number;
  w: number;
  h: number;
  /**
   * The three sizes of space (item 4): one 'great' chamber per version-2 floor (an
   * ellipse-plus-noise hall), 'medium' rooms, and 'small' side rooms (the chest nook's).
   * Every version-1 room is 'medium'. The box is the room's bounds; a great chamber's open
   * cells are the ellipse inside it.
   */
  kind: RoomKind;
}

export type RoomKind = 'great' | 'medium' | 'small';

/** What stands in the middle of the great chamber (item 18, rendered by a later pass). */
export type LandmarkKind =
  'crystalTree' | 'waterfallPool' | 'mushroomRing' | 'shrine' | 'rootPillar';

export const LANDMARK_KINDS: readonly LandmarkKind[] = [
  'crystalTree',
  'waterfallPool',
  'mushroomRing',
  'shrine',
  'rootPillar',
];

/** The rare floor moods (item 41); 'none' on almost every floor. */
export type SpecialFloor = 'none' | 'crystal' | 'flooded' | 'glowworm';

export interface Landmark {
  kind: LandmarkKind;
  /** The centre cell, always walkable (a 'waterfallPool' centre is its pool, water). */
  cell: Cell;
  /** Cells within this many cells of `cell` hold no loot, torches, crystals or strays. */
  radius: number;
}

/**
 * An opening in the outer wall onto the painted chasm (item 31). `cell` is the first of
 * `width` walkable edge cells, running along +x for 'n'/'s' and +y for 'e'/'w'. From each
 * of them, the `depth` cells in direction `dir` (n = -y, s = +y, w = -x, e = +x) are wall
 * all the way to the grid edge: draw those low (a lip), not as tall rock. They stay WALL in
 * the grid, so nobody walks out.
 */
export interface Vista {
  cell: Cell;
  dir: 'n' | 'e' | 's' | 'w';
  width: number;
  depth: number;
}

/**
 * A way over a straight run of water (item 32): `from` and `to` are the dry walkable cells
 * at its ends, `cells` the water cells between, in order. 'bridge' for the longer runs (a
 * rope bridge from end to end), 'stones' for the short ones (a stone on each water cell).
 * Water is walkable in the sim either way; this is the picture of how you cross.
 */
export interface Crossing {
  kind: 'bridge' | 'stones';
  from: Cell;
  to: Cell;
  cells: Cell[];
}

/**
 * The cosy chest nook (item 33), in a small side room. All its cells are dry FLOOR:
 * `rug` lies in front of the chest, `lanterns` flank it, `tent` sits to one side (null when
 * the room had no spare cell). The chest itself is `Floor.chest`.
 */
export interface Nook {
  room: number;
  rug: Cell[];
  lanterns: Cell[];
  tent: Cell | null;
}

export interface FloorLoot {
  id: string;
  kind: DungeonLootKind;
  cell: Cell;
  amount: number;
  /** A flavour, a type or a species, by kind. */
  param: string | null;
}

export interface Floor {
  cols: number;
  rows: number;
  /** 0 wall, 1 floor, 2 water. */
  cells: Uint8Array;
  rooms: Room[];
  stairsUp: Cell;
  stairsDown: Cell | null;
  chest: Cell;
  torches: Cell[];
  crystals: Cell[];
  loot: FloorLoot[];
  strayStarts: Cell[];
  wildSpots: Array<{ cell: Cell; species: string }>;
  /** Ambient light level 0..1; floors get darker. */
  light: number;
  /** The generator that made this floor (`DUNGEON.genVersion` for new floors). */
  version: number;
  /** Index into `rooms` of the great chamber; -1 on version-1 floors. */
  greatRoom: number;
  /**
   * Visual height of each cell's top surface in world units (item 19), row-major like
   * `cells`: terraces at multiples of `DUNGEON.elev.step` up to `elev.max`, a pool-basin
   * room below 0, water `elev.waterSink` under the ground it sits in, and walls at the
   * highest ground beside them. Dry walkable 4-neighbours never differ by more than one
   * step (a ledge); the stairs, the chest's room and the landmark sit level at 0.
   * `elevationAt` blends across walkable cells, which gives the ramps actors walk. All zero
   * on version-1 floors. The sim grid stays flat.
   */
  elevation: Float32Array;
  landmark: Landmark | null;
  vistas: Vista[];
  crossings: Crossing[];
  nook: Nook | null;
  special: SpecialFloor;
}

export const WALL = 0;
export const FLOOR = 1;
export const WATER = 2;

const CELL = DUNGEON.cell;

// ---------------------------------------------------------------- small pure helpers

export function hash2(x: number, y: number, salt: number): number {
  let h = (x * 374761393 + y * 668265263 + salt * 1274126177) | 0;
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  h ^= h >>> 16;
  return (h >>> 0) / 4294967296;
}

/** Smooth value noise in 0..1, enough for water pockets. */
export function vnoise(x: number, y: number, salt: number): number {
  const x0 = Math.floor(x);
  const y0 = Math.floor(y);
  const tx = x - x0;
  const ty = y - y0;
  const sx = tx * tx * (3 - 2 * tx);
  const sy = ty * ty * (3 - 2 * ty);
  const a = hash2(x0, y0, salt);
  const b = hash2(x0 + 1, y0, salt);
  const c = hash2(x0, y0 + 1, salt);
  const d = hash2(x0 + 1, y0 + 1, salt);
  return (a + (b - a) * sx) * (1 - sy) + (c + (d - c) * sx) * sy;
}

export function hashString(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export function cellIndex(f: Floor, x: number, y: number): number {
  return y * f.cols + x;
}

export function cellAt(f: Floor, x: number, y: number): number {
  if (x < 0 || y < 0 || x >= f.cols || y >= f.rows) return WALL;
  return f.cells[y * f.cols + x] ?? WALL;
}

export function isWalkable(f: Floor, x: number, y: number): boolean {
  return cellAt(f, x, y) !== WALL;
}

/** World position of a cell's centre; the floor is centred on the origin. */
export function cellCentre(f: Floor, c: Cell): Vec2 {
  return { x: (c.x + 0.5 - f.cols / 2) * CELL, z: (c.y + 0.5 - f.rows / 2) * CELL };
}

/**
 * The visual ground height under a world position: `Floor.elevation` blended between the
 * centres of the four nearest walkable cells (walls left out, so a wall never lifts anyone).
 */
export function elevationAt(f: Floor, p: Vec2): number {
  const gx = p.x / CELL + f.cols / 2 - 0.5;
  const gz = p.z / CELL + f.rows / 2 - 0.5;
  const x0 = Math.floor(gx);
  const y0 = Math.floor(gz);
  const tx = gx - x0;
  const ty = gz - y0;
  let sum = 0;
  let weight = 0;
  for (const [dx, dy, w] of [
    [0, 0, (1 - tx) * (1 - ty)],
    [1, 0, tx * (1 - ty)],
    [0, 1, (1 - tx) * ty],
    [1, 1, tx * ty],
  ] as const) {
    if (!isWalkable(f, x0 + dx, y0 + dy) || w <= 0) continue;
    sum += (f.elevation[(y0 + dy) * f.cols + x0 + dx] ?? 0) * w;
    weight += w;
  }
  if (weight > 0) return sum / weight;
  const c = cellOf(f, p);
  return f.elevation[c.y * f.cols + c.x] ?? 0;
}

export function cellOf(f: Floor, p: Vec2): Cell {
  return { x: Math.floor(p.x / CELL + f.cols / 2), y: Math.floor(p.z / CELL + f.rows / 2) };
}

function dist(a: Vec2, b: Vec2): number {
  return Math.hypot(a.x - b.x, a.z - b.z);
}

export function cellDist(a: Cell, b: Cell): number {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

// ---------------------------------------------------------------- generation

export function neighbours(
  cells: Uint8Array,
  cols: number,
  rows: number,
  x: number,
  y: number,
): number {
  let n = 0;
  for (let dy = -1; dy <= 1; dy++) {
    for (let dx = -1; dx <= 1; dx++) {
      if (dx === 0 && dy === 0) continue;
      const nx = x + dx;
      const ny = y + dy;
      if (nx < 0 || ny < 0 || nx >= cols || ny >= rows) continue;
      if (cells[ny * cols + nx] !== WALL) n++;
    }
  }
  return n;
}

/** The grid size of a floor at a depth, under a generator version. */
export function floorSize(
  depth: number,
  version: number = DUNGEON.genVersion,
): { cols: number; rows: number } {
  const g = version <= 1 ? DUNGEON : DUNGEON.layout;
  return {
    cols: Math.min(g.maxCols, g.baseCols + g.growCols * (depth - 1)),
    rows: Math.min(g.maxRows, g.baseRows + g.growRows * (depth - 1)),
  };
}

/** Version 1: the 34×24 cave. Frozen: saved runs regenerate their floors from it. */
function generateV1(seed: number, depth: number): Floor {
  const rng = Rng.fromSeed((seed * 31 + depth * 7919) >>> 0);
  const { cols, rows } = floorSize(depth, 1);
  let cells = new Uint8Array(cols * rows);
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const border = x < 2 || y < 2 || x >= cols - 2 || y >= rows - 2;
      cells[y * cols + x] = !border && rng.chance(0.52) ? FLOOR : WALL;
    }
  }
  // Cellular automata: a cell stays floor with enough floor neighbours.
  for (let it = 0; it < 5; it++) {
    const next = new Uint8Array(cells);
    for (let y = 1; y < rows - 1; y++) {
      for (let x = 1; x < cols - 1; x++) {
        const n = neighbours(cells, cols, rows, x, y);
        next[y * cols + x] =
          cells[y * cols + x] !== WALL ? (n >= 4 ? FLOOR : WALL) : n >= 5 ? FLOOR : WALL;
      }
    }
    cells = next;
  }
  // Rooms with chipped corners, joined in order by wobbly corridors.
  const roomCount = Math.min(7, 4 + Math.floor((depth - 1) / 2));
  const rooms: Room[] = [];
  for (let i = 0; i < roomCount; i++) {
    const w = rng.int(6, 11);
    const h = rng.int(5, 8);
    const x = rng.int(4, cols - w - 4);
    const y = rng.int(4, rows - h - 4);
    rooms.push({ x, y, w, h, kind: 'medium' });
    for (let yy = y; yy < y + h; yy++) {
      for (let xx = x; xx < x + w; xx++) {
        const corner = (xx === x || xx === x + w - 1) && (yy === y || yy === y + h - 1);
        if (corner && rng.chance(0.6)) continue;
        cells[yy * cols + xx] = FLOOR;
      }
    }
  }
  const carve = (x: number, y: number) => {
    if (x > 1 && y > 1 && x < cols - 2 && y < rows - 2) cells[y * cols + x] = FLOOR;
  };
  for (let i = 1; i < rooms.length; i++) {
    const a = rooms[i - 1]!;
    const b = rooms[i]!;
    let x = Math.floor(a.x + a.w / 2);
    let y = Math.floor(a.y + a.h / 2);
    const tx = Math.floor(b.x + b.w / 2);
    const ty = Math.floor(b.y + b.h / 2);
    while (x !== tx || y !== ty) {
      if (x !== tx && (y === ty || rng.chance(0.6))) x += Math.sign(tx - x);
      else y += Math.sign(ty - y);
      carve(x, y);
      if (rng.chance(0.5)) carve(x + 1, y);
      if (rng.chance(0.5)) carve(x, y + 1);
    }
  }
  // Keep only what the first room reaches (the rooms are chained, so all of them).
  const r0 = rooms[0]!;
  const start: Cell = { x: r0.x + 1, y: r0.y + 1 };
  const reach = new Uint8Array(cols * rows);
  const stack: Cell[] = [start];
  reach[start.y * cols + start.x] = 1;
  while (stack.length) {
    const c = stack.pop()!;
    for (const [dx, dy] of [
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1],
    ] as const) {
      const nx = c.x + dx;
      const ny = c.y + dy;
      if (nx < 0 || ny < 0 || nx >= cols || ny >= rows) continue;
      const i = ny * cols + nx;
      if (cells[i] === WALL || reach[i]) continue;
      reach[i] = 1;
      stack.push({ x: nx, y: ny });
    }
  }
  for (let i = 0; i < cells.length; i++) if (!reach[i]) cells[i] = WALL;
  // Water: low pockets of a noise field, fully surrounded by floor.
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      if (cells[y * cols + x] !== FLOOR) continue;
      if (vnoise(x / 5 + seed, y / 5, 3) < 0.3 && neighbours(cells, cols, rows, x, y) === 8)
        cells[y * cols + x] = WATER;
    }
  }
  const floor: Floor = {
    cols,
    rows,
    cells,
    rooms,
    stairsUp: start,
    stairsDown: null,
    chest: { x: 0, y: 0 },
    torches: [],
    crystals: [],
    loot: [],
    strayStarts: [],
    wildSpots: [],
    light: Math.max(DUNGEON.lightMin, DUNGEON.lightBase - DUNGEON.lightPerDepth * (depth - 1)),
    version: 1,
    greatRoom: -1,
    elevation: new Float32Array(cols * rows),
    landmark: null,
    vistas: [],
    crossings: [],
    nook: null,
    special: 'none',
  };
  const rl = rooms[rooms.length - 1]!;
  floor.chest = { x: rl.x + rl.w - 2, y: rl.y + rl.h - 2 };
  if (depth < DUNGEON.maxDepth) floor.stairsDown = { x: rl.x + 1, y: rl.y + rl.h - 2 };
  const keepDry = [floor.stairsUp, floor.chest, floor.stairsDown].filter((c): c is Cell => !!c);
  for (const c of keepDry) cells[c.y * cols + c.x] = FLOOR;
  // Torches on walls that face the floor; crystals in dead-end nooks.
  const floors: Cell[] = [];
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) if (cells[y * cols + x] !== WALL) floors.push({ x, y });
  }
  for (const c of floors) {
    if (
      cellAt(floor, c.x, c.y - 1) === WALL &&
      cellAt(floor, c.x, c.y + 1) !== WALL &&
      cellAt(floor, c.x, c.y) === FLOOR &&
      hash2(c.x, c.y, seed) < 0.12 &&
      !floor.torches.some((t) => cellDist(t, c) < 6)
    ) {
      floor.torches.push(c);
    }
    if (
      neighbours(cells, cols, rows, c.x, c.y) <= 3 &&
      hash2(c.x, c.y, seed + 1) < 0.4 &&
      cellAt(floor, c.x, c.y) === FLOOR &&
      !floor.crystals.some((t) => cellDist(t, c) < 8)
    ) {
      floor.crystals.push(c);
    }
  }
  // Loot, strays and a wild creature on open floor away from the stairs.
  const special = new Set(
    [floor.stairsUp, floor.chest, floor.stairsDown, ...floor.torches, ...floor.crystals]
      .filter((c): c is Cell => !!c)
      .map((c) => `${c.x},${c.y}`),
  );
  scatterFinds(floor, rng, depth, floors, special);
  return floor;
}

/** The baby species a version-1 floor's wild spots pick from, in their frozen order. */
const V1_WILD_BABIES = [
  ...['zapling', 'starbud', 'puffbud', 'shellbit', 'scrapper', 'kissbud', 'plugbud', 'emberbud'],
  ...['droplet', 'grinlet', 'spiralshell', 'domeshell', 'skyfang', 'lilystalk', 'clawnymph'],
  ...['fuzzlet', 'chompet'],
];

/**
 * Loot, strays and wild creatures on dry open floor away from the stairs. Shared by both
 * generators; the order of the rng calls is part of version 1's frozen output.
 */
export function scatterFinds(
  floor: Floor,
  rng: Rng,
  depth: number,
  floors: Cell[],
  special: Set<string>,
): void {
  const open = floors.filter(
    (c) =>
      cellAt(floor, c.x, c.y) === FLOOR &&
      !special.has(`${c.x},${c.y}`) &&
      cellDist(c, floor.stairsUp) > 3,
  );
  const pickOpen = (minFromStairs: number): Cell | null => {
    const pool = open.filter((c) => cellDist(c, floor.stairsUp) >= minFromStairs);
    if (pool.length === 0) return null;
    const c = pool[rng.int(0, pool.length - 1)]!;
    open.splice(open.indexOf(c), 1);
    return c;
  };
  const lootCount = Math.min(
    DUNGEON.lootMax,
    Math.round(DUNGEON.lootBase + DUNGEON.lootPerDepth * (depth - 1)),
  );
  for (let i = 0; i < lootCount; i++) {
    const cell = pickOpen(3);
    if (!cell) break;
    const roll = rng.next();
    let kind: DungeonLootKind;
    if (roll < 0.4) kind = 'shells';
    else if (roll < 0.6) kind = 'stone';
    else if (roll < 0.75) kind = 'seed';
    else if (roll < 0.9) kind = 'essence';
    else if (roll < 0.97 || depth < 2) kind = 'critter';
    else kind = 'egg';
    let amount = 1;
    let param: string | null = null;
    if (kind === 'shells') amount = rng.int(4, 8) + depth * 2;
    else if (kind === 'stone') amount = rng.int(1, 2) + Math.floor(depth / 3);
    else if (kind === 'seed') param = rng.pick(FLAVORS);
    else if (kind === 'essence') param = rng.pick(NUBBIN_TYPES);
    else if (kind === 'critter') param = rng.pick(CRITTER_SPECIES).id;
    floor.loot.push({ id: `loot-${i}`, kind, cell, amount, param });
  }
  const strayCount = Math.min(
    DUNGEON.straysMax,
    Math.round(DUNGEON.straysBase + DUNGEON.straysPerDepth * (depth - 1)),
  );
  for (let i = 0; i < strayCount; i++) {
    const cell = pickOpen(7) ?? pickOpen(3);
    if (cell) floor.strayStarts.push(cell);
  }
  // Version-1 floors keep the wild pool they were frozen with; later species join version 2.
  const babies =
    floor.version <= 1
      ? V1_WILD_BABIES.map((id) => ({ id }))
      : SPECIES.filter((s) => s.id !== 'chao' && s.stage === 'baby' && isCommonSpecies(s));
  const wildCount = DUNGEON.wildPerFloor + Math.floor((depth - 1) / 3);
  for (let i = 0; i < wildCount && babies.length > 0; i++) {
    const cell = pickOpen(6) ?? pickOpen(3);
    if (cell) floor.wildSpots.push({ cell, species: rng.pick(babies).id });
  }
}

const cache = new Map<string, Floor>();

/**
 * The floor for a run's seed and depth, generated once. `version` picks the generator: a
 * saved run passes the one its floor was made with (`DungeonRun.genVersion`).
 */
export function floorOf(seed: number, depth: number, version: number = DUNGEON.genVersion): Floor {
  const key = `${seed}:${depth}:${version}`;
  let f = cache.get(key);
  if (!f) {
    f = version <= 1 ? generateV1(seed, depth) : generateV2(seed, depth);
    if (cache.size > 12) cache.delete(cache.keys().next().value!);
    cache.set(key, f);
  }
  return f;
}

export function runFloor(world: World): Floor | null {
  const run = world.dungeon;
  return run && world.location === 'dungeon' ? floorOf(run.seed, run.depth, run.genVersion) : null;
}

// ---------------------------------------------------------------- explored mask

// The decoded mask of each run's `explored` string, kept while the string is unchanged.
const maskCache = new WeakMap<DungeonRun, { text: string; mask: Uint8Array }>();

function decodeMask(text: string, size: number): Uint8Array {
  const mask = new Uint8Array(size);
  for (let k = 0; k < text.length; k++) {
    const v = parseInt(text[k]!, 16) || 0;
    for (let j = 0; j < 4; j++) {
      const i = k * 4 + j;
      if (i < size && v & (1 << j)) mask[i] = 1;
    }
  }
  return mask;
}

function encodeMask(mask: Uint8Array): string {
  let out = '';
  for (let k = 0; k < mask.length; k += 4) {
    let v = 0;
    for (let j = 0; j < 4; j++) if (mask[k + j]) v |= 1 << j;
    out += v.toString(16);
  }
  return out;
}

/**
 * Which cells of the run's floor the Keeper has seen (item 40): 1 or 0 per cell, row-major
 * like `Floor.cells`, walls included so a minimap can draw the outline. Read-only.
 */
export function exploredMask(run: DungeonRun, f: Floor): Uint8Array {
  const hit = maskCache.get(run);
  if (hit && hit.text === run.explored && hit.mask.length === f.cells.length) return hit.mask;
  const mask = decodeMask(run.explored, f.cells.length);
  maskCache.set(run, { text: run.explored, mask });
  return mask;
}

export function isExplored(run: DungeonRun, f: Floor, x: number, y: number): boolean {
  if (x < 0 || y < 0 || x >= f.cols || y >= f.rows) return false;
  return exploredMask(run, f)[y * f.cols + x] === 1;
}

/** Per room (the index of `Floor.rooms`): seen once its centre cell has been seen. */
export function exploredRooms(run: DungeonRun, f: Floor): boolean[] {
  return f.rooms.map((r) =>
    isExplored(run, f, Math.floor(r.x + r.w / 2), Math.floor(r.y + r.h / 2)),
  );
}

/** Mark the cells round a cell seen. Writes the save string only when something changed. */
export function revealAround(run: DungeonRun, f: Floor, c: Cell): void {
  const r = DUNGEON.explore.radius;
  const mask = exploredMask(run, f);
  let changed = false;
  for (let dy = -r; dy <= r; dy++) {
    for (let dx = -r; dx <= r; dx++) {
      if (dx * dx + dy * dy > r * r) continue;
      const x = c.x + dx;
      const y = c.y + dy;
      if (x < 0 || y < 0 || x >= f.cols || y >= f.rows) continue;
      const i = y * f.cols + x;
      if (mask[i]) continue;
      mask[i] = 1;
      changed = true;
    }
  }
  if (!changed) return;
  run.explored = encodeMask(mask);
  maskCache.set(run, { text: run.explored, mask });
}

// ---------------------------------------------------------------- collision

/** Push a circle out of the wall cells around it. Returns true when it moved. */
export function resolveDungeon(p: Vec2, f: Floor, radius: number): boolean {
  let moved = false;
  const c = cellOf(f, p);
  if (!isWalkable(f, c.x, c.y)) {
    // Inside rock (a tap landed there, or a load): step to the nearest open cell.
    const near = nearestOpen(f, c);
    if (near) {
      const q = cellCentre(f, near);
      p.x = q.x;
      p.z = q.z;
      return true;
    }
  }
  for (let pass = 0; pass < 2; pass++) {
    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= 1; dx++) {
        const cx = c.x + dx;
        const cy = c.y + dy;
        if (isWalkable(f, cx, cy)) continue;
        const x0 = (cx - f.cols / 2) * CELL;
        const z0 = (cy - f.rows / 2) * CELL;
        const qx = Math.max(x0, Math.min(x0 + CELL, p.x));
        const qz = Math.max(z0, Math.min(z0 + CELL, p.z));
        const ddx = p.x - qx;
        const ddz = p.z - qz;
        const d = Math.hypot(ddx, ddz);
        if (d >= radius) continue;
        moved = true;
        if (d < 1e-6) {
          // On the cell's edge exactly: push toward the centre of our own cell.
          const own = cellCentre(f, c);
          const ox = own.x - p.x;
          const oz = own.z - p.z;
          const ol = Math.hypot(ox, oz) || 1;
          p.x += (ox / ol) * radius;
          p.z += (oz / ol) * radius;
        } else {
          p.x = qx + (ddx / d) * radius;
          p.z = qz + (ddz / d) * radius;
        }
      }
    }
  }
  return moved;
}

export function dungeonBlocked(p: Vec2, f: Floor, radius = 0.3): boolean {
  const c = cellOf(f, p);
  if (!isWalkable(f, c.x, c.y)) return true;
  for (let dy = -1; dy <= 1; dy++) {
    for (let dx = -1; dx <= 1; dx++) {
      const cx = c.x + dx;
      const cy = c.y + dy;
      if (isWalkable(f, cx, cy)) continue;
      const x0 = (cx - f.cols / 2) * CELL;
      const z0 = (cy - f.rows / 2) * CELL;
      const qx = Math.max(x0, Math.min(x0 + CELL, p.x));
      const qz = Math.max(z0, Math.min(z0 + CELL, p.z));
      if (Math.hypot(p.x - qx, p.z - qz) < radius) return true;
    }
  }
  return false;
}

function nearestOpen(f: Floor, c: Cell): Cell | null {
  for (let r = 1; r < 8; r++) {
    for (let dy = -r; dy <= r; dy++) {
      for (let dx = -r; dx <= r; dx++) {
        if (Math.max(Math.abs(dx), Math.abs(dy)) !== r) continue;
        if (isWalkable(f, c.x + dx, c.y + dy)) return { x: c.x + dx, y: c.y + dy };
      }
    }
  }
  return null;
}

/** Open cells around a cell, nearest first, for placing the party. */
function openAround(f: Floor, c: Cell, count: number): Cell[] {
  const out: Cell[] = [];
  for (let r = 1; r < 6 && out.length < count; r++) {
    for (let dy = -r; dy <= r && out.length < count; dy++) {
      for (let dx = -r; dx <= r && out.length < count; dx++) {
        if (Math.max(Math.abs(dx), Math.abs(dy)) !== r) continue;
        if (cellAt(f, c.x + dx, c.y + dy) === FLOOR) out.push({ x: c.x + dx, y: c.y + dy });
      }
    }
  }
  return out;
}

// ---------------------------------------------------------------- the run

export function inParty(world: World, id: string): boolean {
  return world.location === 'dungeon' && !!world.dungeon && world.dungeon.party.includes(id);
}

function canJoin(n: Nubbin): boolean {
  return n.stage !== 'egg' && n.stage !== 'cocoon' && n.behavior.state !== 'thrown';
}

function choosePartyFor(world: World): string[] {
  const party: string[] = [];
  if (world.keeper.carrying) party.push(world.keeper.carrying);
  for (const id of world.partners) {
    const n = id ? world.nubbins.find((x) => x.id === id) : undefined;
    if (n && canJoin(n) && !party.includes(n.id) && party.length < DUNGEON.partySize)
      party.push(n.id);
  }
  for (const n of world.nubbins) {
    if (party.length >= DUNGEON.partySize) break;
    if (canJoin(n) && !party.includes(n.id)) party.push(n.id);
  }
  return party;
}

function populate(run: DungeonRun, f: Floor): void {
  run.strays = f.strayStarts.map((c, i): DungeonStray => ({
    id: `stray-${i}`,
    pos: cellCentre(f, c),
    target: null,
    cooldownMs: 0,
  }));
  run.wild = f.wildSpots.map((w, i): DungeonWild => ({
    id: `wild-${i}`,
    species: w.species,
    pos: cellCentre(f, w.cell),
    scanned: false,
  }));
  run.taken = [];
  run.chestOpen = false;
  run.pending = null;
  run.pendingPos = null;
  run.fetch = {};
  run.explored = '';
}

function placeParty(world: World, run: DungeonRun, f: Floor): void {
  const k = world.keeper;
  const at = cellCentre(f, f.stairsUp);
  k.pos = { x: at.x, z: at.z };
  revealAround(run, f, f.stairsUp);
  k.moveTarget = null;
  k.intent = null;
  const spots = openAround(f, f.stairsUp, run.party.length + 1);
  run.party.forEach((id, i) => {
    const n = world.nubbins.find((x) => x.id === id);
    if (!n) return;
    const c = spots[i] ?? f.stairsUp;
    const p = cellCentre(f, c);
    n.pos = { x: p.x, z: p.z };
    n.behavior.target = null;
    if (n.id !== k.carrying) {
      n.behavior.state = 'sit';
      n.behavior.sinceMs = world.timeMs;
      n.behavior.untilMs = world.timeMs;
    }
  });
}

/** Today's seed, the same for everyone: the request board asks for its floors. */
export function dailySeed(wallMs: number): { day: string; seed: number } {
  const day = dayKey(new Date(wallMs));
  return { day, seed: hashString(`hollow:${day}`) % 1_000_000_007 };
}

/**
 * Go down into the Hollow Below. `story` (campaign graphics 4, K16) starts a storyline's
 * fixed floor instead: its seed, straight at its depth, never a daily.
 */
export function enterDungeon(
  world: World,
  daily: boolean,
  rng: Rng,
  events: SimEvent[],
  story?: { seed: number; depth: number },
): boolean {
  if (world.location !== 'grove' || world.dungeon) return false;
  if (story) daily = false;
  const today = dailySeed(world.lastWallMs);
  const seed = story ? story.seed : daily ? today.seed : rng.int(1, 2_000_000_000);
  const depth = story ? Math.max(1, Math.round(story.depth)) : 1;
  const party = choosePartyFor(world);
  const run: DungeonRun = {
    seed,
    depth,
    daily: daily ? today.day : null,
    party,
    returnKeeper: { x: world.keeper.pos.x, z: world.keeper.pos.z },
    returnParty: Object.fromEntries(
      party.map((id) => {
        const n = world.nubbins.find((x) => x.id === id)!;
        return [id, { x: n.pos.x, z: n.pos.z }];
      }),
    ),
    taken: [],
    chestOpen: false,
    strays: [],
    wild: [],
    pending: null,
    pendingPos: null,
    fetch: {},
    haul: { shells: 0, items: 0 },
    startedMs: world.timeMs,
    genVersion: DUNGEON.genVersion,
    explored: '',
  };
  const f = floorOf(seed, depth, run.genVersion);
  populate(run, f);
  world.dungeon = run;
  world.location = 'dungeon';
  placeParty(world, run, f);
  if (daily && world.hollow.dailyDay !== today.day) {
    world.hollow.dailyDay = today.day;
    world.hollow.dailyDepth = 1;
  }
  events.push({ kind: 'dungeonEntered', depth, daily });
  events.push({ kind: 'located', location: 'dungeon' });
  return true;
}

export function leaveDungeon(world: World, events: SimEvent[]): boolean {
  const run = world.dungeon;
  if (!run || world.location !== 'dungeon') return false;
  world.location = 'grove';
  world.dungeon = null;
  const k = world.keeper;
  k.pos = { x: run.returnKeeper.x, z: run.returnKeeper.z };
  k.moveTarget = null;
  k.intent = null;
  run.party.forEach((id, i) => {
    const n = world.nubbins.find((x) => x.id === id);
    if (!n) return;
    const back = run.returnParty[id] ?? { x: k.pos.x + 1 + i, z: k.pos.z + 1 };
    n.pos = { x: back.x, z: back.z };
    n.behavior.target = null;
    if (n.id !== k.carrying) {
      n.behavior.state = 'wander';
      n.behavior.sinceMs = world.timeMs;
      n.behavior.untilMs = world.timeMs + 1500;
    }
  });
  world.hollow.runs += 1;
  world.hollow.best = Math.max(world.hollow.best, run.depth);
  events.push({
    kind: 'dungeonLeft',
    depth: run.depth,
    shells: run.haul.shells,
    items: run.haul.items,
  });
  events.push({ kind: 'located', location: 'grove' });
  return true;
}

function descend(world: World, run: DungeonRun, events: SimEvent[]): void {
  run.depth += 1;
  // A new floor always comes from the current generator, whatever made the one above.
  run.genVersion = DUNGEON.genVersion;
  const f = floorOf(run.seed, run.depth, run.genVersion);
  populate(run, f);
  placeParty(world, run, f);
  world.hollow.best = Math.max(world.hollow.best, run.depth);
  if (run.daily && run.daily === world.hollow.dailyDay)
    world.hollow.dailyDepth = Math.max(world.hollow.dailyDepth, run.depth);
  events.push({ kind: 'descended', depth: run.depth, daily: run.daily !== null });
}

/** Walk to the stairs or the chest and use it on arrival. */
export function dungeonGo(world: World, to: 'up' | 'down' | 'chest', events: SimEvent[]): void {
  const run = world.dungeon;
  const f = runFloor(world);
  if (!run || !f) return;
  const cell = to === 'up' ? f.stairsUp : to === 'down' ? f.stairsDown : f.chest;
  if (!cell || (to === 'chest' && run.chestOpen)) return;
  const at = cellCentre(f, cell);
  run.pending = to;
  run.pendingPos = at;
  world.keeper.moveTarget = at;
  world.keeper.intent = null;
  // Already there: act now.
  if (dist(world.keeper.pos, at) <= DUNGEON.useRadius) usePending(world, run, f, events);
}

export function feedStray(world: World, id: string, events: SimEvent[]): void {
  const run = world.dungeon;
  const f = runFloor(world);
  if (!run || !f) return;
  const s = run.strays.find((x) => x.id === id);
  if (!s) return;
  if (world.inventory.fruit < 1) {
    events.push({ kind: 'strayFed', ok: false, name: null });
    return;
  }
  run.pending = `stray:${id}`;
  run.pendingPos = { x: s.pos.x, z: s.pos.z };
  world.keeper.moveTarget = run.pendingPos;
  world.keeper.intent = null;
  if (dist(world.keeper.pos, s.pos) <= DUNGEON.useRadius) usePending(world, run, f, events);
}

function usePending(world: World, run: DungeonRun, f: Floor, events: SimEvent[]): void {
  const pending = run.pending;
  run.pending = null;
  run.pendingPos = null;
  world.keeper.moveTarget = null;
  if (pending === 'up') {
    leaveDungeon(world, events);
  } else if (pending === 'down') {
    descend(world, run, events);
  } else if (pending === 'chest') {
    if (run.chestOpen) return;
    run.chestOpen = true;
    const rng = Rng.fromSeed((run.seed + run.depth * 101 + world.nubbins.length) >>> 0);
    const shells = rng.int(DUNGEON.chestShells[0], DUNGEON.chestShells[1]) + run.depth * 10;
    world.inventory.shells += shells;
    run.haul.shells += shells;
    const egg = rng.chance(DUNGEON.chestEggChance + run.depth * 0.03) && hasRoom(world);
    if (egg) grantEgg(world, rng);
    events.push({ kind: 'chestOpened', shells, egg });
  } else if (pending?.startsWith('stray:')) {
    const s = run.strays.find((x) => x.id === pending.slice('stray:'.length));
    if (!s || world.inventory.fruit < 1) return;
    world.inventory.fruit -= 1;
    run.strays = run.strays.filter((x) => x !== s);
    const rng = Rng.fromSeed((run.seed + run.depth * 17 + world.nubbins.length) >>> 0);
    const name = uniqueName(world, rng.pick(STRAY_NAMES), rng);
    addRecruit(world, name, 'chao', events);
    events.push({ kind: 'strayFed', ok: true, name });
  }
}

const STRAY_NAMES = ['Sooty', 'Ash', 'Murk', 'Dusk', 'Ember', 'Wisp', 'Cinder', 'Shade'];

function grantEgg(world: World, rng: Rng): Nubbin | null {
  if (!hasRoom(world)) return null;
  const babies = SPECIES.filter((s) => s.id !== 'chao' && s.stage === 'baby' && isCommonSpecies(s));
  const species = rng.chance(0.4) && babies.length > 0 ? rng.pick(babies).id : 'chao';
  const color = rng.pick(EGG_COLORS);
  const egg = createEgg(newId(world, 'nubbin'), { x: 2, z: 0 }, rng, color, species);
  world.nubbins.push(egg);
  return egg;
}

function takeLoot(
  world: World,
  run: DungeonRun,
  loot: FloorLoot,
  by: string | null,
  rng: Rng,
  events: SimEvent[],
): void {
  run.taken.push(loot.id);
  run.haul.items += 1;
  const inv = world.inventory;
  let amount = loot.amount;
  let kind = loot.kind;
  switch (loot.kind) {
    case 'shells':
      inv.shells += amount;
      run.haul.shells += amount;
      break;
    case 'stone':
      inv.stone += amount;
      break;
    case 'seed':
      if (loot.param)
        inv.seeds[loot.param as keyof typeof inv.seeds] =
          (inv.seeds[loot.param as keyof typeof inv.seeds] ?? 0) + amount;
      break;
    case 'essence':
      if (loot.param) inv.essences[loot.param] = (inv.essences[loot.param] ?? 0) + amount;
      break;
    case 'critter':
      if (loot.param) inv.critters[loot.param] = (inv.critters[loot.param] ?? 0) + amount;
      break;
    case 'egg':
      if (!grantEgg(world, rng)) {
        // No room in the roster: the egg's finder keeps the Shells it was lying on.
        kind = 'shells';
        amount = 25;
        inv.shells += amount;
        run.haul.shells += amount;
      }
      break;
  }
  if (by) {
    const n = world.nubbins.find((x) => x.id === by);
    if (n) n.needs.happiness = Math.min(100, n.needs.happiness + 5);
  }
  events.push({ kind: 'dungeonFound', loot: kind, amount, param: loot.param, by });
}

function walkToward(p: Vec2, target: Vec2, speed: number, dt: number): boolean {
  const d = dist(p, target);
  if (d < 0.05) return true;
  const step = Math.min(d, speed * dt);
  p.x += ((target.x - p.x) / d) * step;
  p.z += ((target.z - p.z) / d) * step;
  return step >= d;
}

function randomOpenCell(f: Floor, rng: Rng, near: Cell | null, within: number): Cell | null {
  for (let i = 0; i < 30; i++) {
    const c = near
      ? { x: near.x + rng.int(-within, within), y: near.y + rng.int(-within, within) }
      : { x: rng.int(0, f.cols - 1), y: rng.int(0, f.rows - 1) };
    if (cellAt(f, c.x, c.y) === FLOOR) return c;
  }
  return null;
}

/** Live steps only: the party, the loot underfoot, the strays and the wild creature. */
export function stepDungeon(world: World, dtMs: number, rng: Rng, events: SimEvent[]): void {
  const run = world.dungeon;
  const f = runFloor(world);
  if (!run || !f || dtMs > 1000) return;
  const dt = dtMs / 1000;
  const k = world.keeper;
  const available = (l: FloorLoot) => !run.taken.includes(l.id);
  revealAround(run, f, cellOf(f, k.pos));

  // Anything the Keeper walks over.
  for (const l of f.loot) {
    if (!available(l)) continue;
    if (dist(k.pos, cellCentre(f, l.cell)) <= DUNGEON.pickupRadius)
      takeLoot(world, run, l, null, rng, events);
  }
  for (const w of run.wild) {
    if (w.scanned || dist(k.pos, w.pos) > DUNGEON.scanRadius) continue;
    w.scanned = true;
    noteScan(world, w.species, SCANS.perArrival, events);
    events.push({ kind: 'wildScanned', species: w.species });
  }
  // The pending stairs, chest or stray: act on arrival; a new tap elsewhere cancels it.
  if (run.pending && run.pendingPos) {
    if (run.pending.startsWith('stray:')) {
      const s = run.strays.find((x) => x.id === run.pending!.slice('stray:'.length));
      if (!s) {
        run.pending = null;
        run.pendingPos = null;
      } else {
        run.pendingPos.x = s.pos.x;
        run.pendingPos.z = s.pos.z;
      }
    }
    if (run.pendingPos) {
      if (dist(k.pos, run.pendingPos) <= DUNGEON.useRadius) usePending(world, run, f, events);
      else if (k.moveTarget !== run.pendingPos) {
        run.pending = null;
        run.pendingPos = null;
      }
    }
  }
  // Leaving or descending replaced the floor: the rest belongs to the old one.
  if (world.dungeon !== run || runFloor(world) !== f) return;

  // Strays wander, flee after a snatch, and snatch Shells when they bump the Keeper.
  for (const s of run.strays) {
    s.cooldownMs = Math.max(0, s.cooldownMs - dtMs);
    const fleeing = s.cooldownMs > 0;
    if (
      !s.target ||
      walkToward(s.pos, s.target, fleeing ? DUNGEON.strayFleeSpeed : DUNGEON.straySpeed, dt)
    ) {
      const c = randomOpenCell(f, rng, cellOf(f, s.pos), fleeing ? 10 : 5);
      s.target = c ? cellCentre(f, c) : null;
    }
    resolveDungeon(s.pos, f, 0.3);
    if (!fleeing && dist(s.pos, k.pos) < 0.9 && world.inventory.shells > 0) {
      const shells = Math.min(world.inventory.shells, DUNGEON.straySnatch);
      world.inventory.shells -= shells;
      run.haul.shells = Math.max(0, run.haul.shells - shells);
      s.cooldownMs = DUNGEON.strayCooldownMs;
      const away = randomOpenCell(f, rng, null, 0);
      s.target = away ? cellCentre(f, away) : null;
      events.push({ kind: 'strayStartled', shells });
    }
  }

  // The party: fetch loot nearby, otherwise keep close to the Keeper.
  run.party = run.party.filter((id) => world.nubbins.some((n) => n.id === id));
  for (const id of run.party) {
    const n = world.nubbins.find((x) => x.id === id);
    if (!n) continue;
    const st = n.behavior.state;
    if (
      st === 'held' ||
      st === 'carried' ||
      st === 'thrown' ||
      n.stage === 'egg' ||
      n.stage === 'cocoon'
    )
      continue;
    if (n.needs.energy <= 0 || st === 'nap') {
      // Too tired: it naps where it stands; the needs system wakes it.
      continue;
    }
    let target: Vec2 | null = null;
    let fetching = run.fetch[id] ? f.loot.find((l) => l.id === run.fetch[id]) : undefined;
    if (fetching && !available(fetching)) fetching = undefined;
    if (!fetching) {
      delete run.fetch[id];
      let best: FloorLoot | undefined;
      let bestD: number = DUNGEON.fetchRadius;
      for (const l of f.loot) {
        if (!available(l) || Object.values(run.fetch).includes(l.id)) continue;
        const d = dist(n.pos, cellCentre(f, l.cell));
        if (d < bestD) {
          bestD = d;
          best = l;
        }
      }
      if (best) {
        run.fetch[id] = best.id;
        fetching = best;
      }
    }
    if (fetching) target = cellCentre(f, fetching.cell);
    else if (dist(n.pos, k.pos) > DUNGEON.followDistance) target = k.pos;
    if (target) {
      // Round the rock by a path, not a straight line that snags on corners (R0009).
      const wp = nubbinWaypoint(n, f, target) ?? n.pos;
      if (dist(n.pos, wp) > 1e-6) n.facing = Math.atan2(wp.x - n.pos.x, wp.z - n.pos.z);
      walkToward(n.pos, wp, DUNGEON.nubbinSpeed, dt);
      n.behavior.target = target;
      if (n.behavior.state !== 'wander') {
        n.behavior.state = 'wander';
        n.behavior.sinceMs = world.timeMs;
      }
      n.behavior.untilMs = world.timeMs + 500;
      if (fetching && dist(n.pos, target) <= 0.5) {
        takeLoot(world, run, fetching, id, rng, events);
        delete run.fetch[id];
      }
    } else {
      n.behavior.target = null;
      if (n.behavior.state !== 'sit' && n.behavior.state !== 'react') {
        n.behavior.state = 'sit';
        n.behavior.sinceMs = world.timeMs;
      }
      n.behavior.untilMs = world.timeMs + 500;
      n.facing = Math.atan2(k.pos.x - n.pos.x, k.pos.z - n.pos.z);
    }
    resolveDungeon(n.pos, f, 0.3);
  }
  void KEEPER;
}

/** Loot still lying on the floor, with world positions, for the renderer. */
export function lootOnFloor(world: World): Array<FloorLoot & { pos: Vec2 }> {
  const run = world.dungeon;
  const f = runFloor(world);
  if (!run || !f) return [];
  return f.loot
    .filter((l) => !run.taken.includes(l.id))
    .map((l) => ({ ...l, pos: cellCentre(f, l.cell) }));
}

/** Who would come along right now, by name, for the menu. */
export function partyPreview(world: World): string[] {
  return choosePartyFor(world).map((id) => world.nubbins.find((n) => n.id === id)?.name ?? id);
}
