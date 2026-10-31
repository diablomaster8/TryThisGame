/**
 * An act's outdoor field (R0147, DUNG-07): the open meadow between the act's camp and its
 * dungeon gate, with cave mouths onto one-level side caves. It is an ordinary Hollow `Floor`
 * (`zone: 'field'`), so the sim's walking, packs, finds and both renderers work on it as on
 * any level; the renderers read `zone` for the open sky.
 *
 * The field is 128×96 cells, stitched from 16×16 tiles (`dungeon-pieces/outdoor-tiles.ts`)
 * chosen by a seeded biome noise and turned, ringed by hedge and cliff. A two-cell road runs
 * from the camp gate in the west to the act gate in the east through every tile column, with
 * spurs to each cave mouth; anything the road cannot reach is filled in, so every mouth and
 * the gate can be walked to. Side caves are small version-3 floors of the act's tileset.
 *
 * Pure sim: no DOM.
 */
import { ACTS, actStartDepth } from '../config/dungeon-acts';
import { HOLLOW, HOLLOW_ZONES } from '../config/tuning';
import {
  cellDist,
  FLOOR,
  hashString,
  scatterFinds,
  vnoise,
  WALL,
  WATER,
  type Cell,
  type Floor,
  type Room,
} from './dungeon';
import { placePacks } from './dungeon-encounters';
import { generateV3 } from './dungeon-gen-v3';
import { OUTDOOR_TILES, type OutdoorBiome } from './dungeon-pieces/outdoor-tiles';
import { PLACED_KINDS, type Shrine } from './dungeon-shrines';
import { Rng } from './rng';
import { isCommonSpecies, SPECIES } from './species';

const cache = new Map<string, Floor>();

function remember(key: string, f: Floor): Floor {
  if (cache.size > 8) cache.delete(cache.keys().next().value!);
  cache.set(key, f);
  return f;
}

/** A tile's rows turned `turns` quarter turns clockwise (tiles are square). */
function turnRows(rows: readonly string[], turns: number): string[] {
  let r = rows.slice();
  for (let t = 0; t < turns % 4; t++) {
    const n = r.length;
    r = Array.from({ length: n }, (_, y) =>
      Array.from({ length: n }, (_, x) => r[n - 1 - x]![y]).join(''),
    );
  }
  return r;
}

/** The biome of tile (tx, ty): a noise field, with meadows the most common. */
function biomeAt(tx: number, ty: number, salt: number): OutdoorBiome {
  const v = vnoise(tx * 0.9, ty * 0.9, salt);
  const w = vnoise(tx * 1.7 + 11, ty * 1.7, salt + 7);
  if (v < 0.3) return 'meadow';
  if (v < 0.45) return w < 0.5 ? 'stream' : 'meadow';
  if (v < 0.62) return 'copse';
  if (v < 0.78) return w < 0.55 ? 'ruin' : 'copse';
  return 'cliff';
}

function carve(cells: Uint8Array, cols: number, rows: number, c: Cell, w: number): void {
  for (let dy = 0; dy < w; dy++)
    for (let dx = 0; dx < w; dx++) {
      const x = c.x + dx;
      const y = c.y + dy;
      if (x >= 2 && y >= 2 && x < cols - 2 && y < rows - 2) cells[y * cols + x] = FLOOR;
    }
}

/** An L-shaped road from `a` to `b`, `w` cells wide. */
function road(cells: Uint8Array, cols: number, rows: number, a: Cell, b: Cell, w: number): void {
  const sx = Math.sign(b.x - a.x);
  for (let x = a.x; x !== b.x; x += sx) carve(cells, cols, rows, { x, y: a.y }, w);
  const sy = Math.sign(b.y - a.y);
  for (let y = a.y; y !== b.y; y += sy) carve(cells, cols, rows, { x: b.x, y }, w);
  carve(cells, cols, rows, b, w);
}

/** Cells reachable on foot from `start` (water wades, walls stop). */
function reach(cells: Uint8Array, cols: number, rows: number, start: Cell): Uint8Array {
  const seen = new Uint8Array(cols * rows);
  const queue = [start.y * cols + start.x];
  seen[queue[0]!] = 1;
  for (let i = 0; i < queue.length; i++) {
    const k = queue[i]!;
    const x = k % cols;
    const y = (k - x) / cols;
    for (const [dx, dy] of [
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1],
    ] as const) {
      const nx = x + dx;
      const ny = y + dy;
      if (nx < 0 || ny < 0 || nx >= cols || ny >= rows) continue;
      const j = ny * cols + nx;
      if (seen[j] || cells[j] === WALL) continue;
      seen[j] = 1;
      queue.push(j);
    }
  }
  return seen;
}

/** Another field's numbers in place of the act field's (lane B r9: the Moo Meadow). */
export interface FieldShape {
  /** The cache and seed name (`field` for an act's own field). */
  name: string;
  cols: number;
  rows: number;
  tile: number;
  mouths: readonly [number, number];
  packs: readonly [number, number];
  wildlife: readonly [number, number];
  shrines: readonly [number, number];
  loot: number;
  road: number;
  /** Sunny: only meadow, stream and copse tiles (no cliffs or ruins). */
  sunny?: boolean;
}

/** Act `act`'s outdoor field for its seed, generated once. */
export function fieldFloor(seed: number, act: number, shape?: FieldShape): Floor {
  const name = shape?.name ?? 'field';
  const Z = shape ?? { ...HOLLOW_ZONES.field, name };
  const key = `${name}:${seed}:${act}`;
  const hit = cache.get(key);
  if (hit) return hit;
  const rng = Rng.fromSeed((seed ^ hashString(`${name}:${act}`)) >>> 0);
  const salt = rng.int(1, 9999);
  const { cols, rows, tile } = Z;
  const tw = cols / tile;
  const th = rows / tile;
  const cells = new Uint8Array(cols * rows).fill(FLOOR);
  const rooms: Room[] = [];
  const biomes: OutdoorBiome[] = [];
  for (let ty = 0; ty < th; ty++)
    for (let tx = 0; tx < tw; tx++) {
      // The camp and gate columns stay meadow, so the ends of the road are open ground.
      let biome = tx === 0 || tx === tw - 1 ? 'meadow' : biomeAt(tx, ty, salt);
      if (Z.sunny && (biome === 'cliff' || biome === 'ruin')) biome = 'meadow';
      biomes.push(biome);
      const pool = OUTDOOR_TILES.filter((t) => t.biome === biome);
      const t = pool[rng.int(0, pool.length - 1)]!;
      const r = turnRows(t.rows, rng.int(0, 3));
      for (let y = 0; y < tile; y++)
        for (let x = 0; x < tile; x++) {
          const ch = r[y]![x];
          cells[(ty * tile + y) * cols + tx * tile + x] =
            ch === '#' ? WALL : ch === '~' ? WATER : FLOOR;
        }
      rooms.push({ x: tx * tile, y: ty * tile, w: tile, h: tile, kind: 'medium' });
    }
  // A ring of hedge and cliff.
  for (let y = 0; y < rows; y++)
    for (let x = 0; x < cols; x++)
      if (x < 2 || y < 2 || x >= cols - 2 || y >= rows - 2) cells[y * cols + x] = WALL;

  // The ends of the road, one bend per tile column, and the cave mouths: each in its own
  // tile, with a rock face behind it. Faces go in first so no face ever cuts the road.
  const up: Cell = { x: 3, y: rows / 2 + rng.int(-14, 14) };
  const down: Cell = { x: cols - 5, y: rows / 2 + rng.int(-14, 14) };
  const bends: Cell[] = [up];
  for (let tx = 1; tx < tw - 1; tx++)
    bends.push({ x: tx * tile + rng.int(4, 10), y: rng.int(1, th - 2) * tile + rng.int(4, 10) });
  bends.push(down);
  const mouths: Cell[] = [];
  const spurs: Array<[Cell, Cell]> = [];
  const want = rng.int(Z.mouths[0], Z.mouths[1]);
  const columns = Array.from({ length: tw - 2 }, (_, i) => i + 1);
  for (let i = columns.length - 1; i > 0; i--) {
    const j = rng.int(0, i);
    [columns[i], columns[j]] = [columns[j]!, columns[i]!];
  }
  for (const tx of columns) {
    if (mouths.length >= want) break;
    const ty = rng.int(0, th - 1);
    const m: Cell = { x: tx * tile + rng.int(5, 10), y: Math.max(6, ty * tile + rng.int(5, 10)) };
    if (bends.some((b) => cellDist(b, m) < 4)) continue;
    for (let dy = -3; dy <= -1; dy++)
      for (let dx = -2; dx <= 2; dx++) cells[(m.y + dy) * cols + m.x + dx] = WALL;
    mouths.push(m);
    spurs.push([{ x: m.x, y: m.y + 1 }, bends[tx]!]);
  }
  for (let i = 1; i < bends.length; i++) road(cells, cols, rows, bends[i - 1]!, bends[i]!, Z.road);
  for (const [a, b] of spurs) road(cells, cols, rows, a, b, Z.road);
  for (const m of mouths) cells[m.y * cols + m.x] = FLOOR;
  // Whatever the road cannot reach is filled in (no pockets for packs or finds to hide in).
  const seen = reach(cells, cols, rows, up);
  for (let i = 0; i < cells.length; i++) if (!seen[i]) cells[i] = WALL;

  const stone: Cell = { x: up.x + 4, y: up.y };
  const floorCells: Cell[] = [];
  for (let y = 0; y < rows; y++)
    for (let x = 0; x < cols; x++) if (cells[y * cols + x] === FLOOR) floorCells.push({ x, y });
  const far = (c: Cell, d: number) =>
    cellDist(c, up) >= d &&
    cellDist(c, down) >= 3 &&
    cellDist(c, stone) >= 3 &&
    mouths.every((m) => cellDist(c, m) >= 3);
  const ruins = rooms.filter((_, i) => biomes[i] === 'ruin');
  const chestPool = floorCells.filter(
    (c) =>
      far(c, 20) &&
      (ruins.length === 0 ||
        ruins.some((r) => c.x >= r.x + 4 && c.y >= r.y + 4 && c.x < r.x + 12 && c.y < r.y + 12)),
  );
  const chest = chestPool[rng.int(0, chestPool.length - 1)] ?? down;
  const depth = actStartDepth(act);
  const f: Floor = {
    cols,
    rows,
    cells,
    rooms,
    stairsUp: up,
    stairsDown: down,
    chest,
    torches: [],
    crystals: [],
    loot: [],
    strayStarts: [],
    wildSpots: [],
    light: 1,
    version: HOLLOW.genVersion,
    greatRoom: -1,
    elevation: new Float32Array(cols * rows),
    landmark: null,
    vistas: [],
    crossings: [],
    nook: null,
    special: 'none',
    zone: 'field',
    mouths,
    stone,
    act,
  };
  const special = new Set([up, down, chest, stone, ...mouths].map((c) => `${c.x},${c.y}`));
  scatterFinds(
    f,
    rng,
    depth,
    floorCells.filter((c) => far(c, 4)),
    special,
    { loot: Z.loot, strays: 0 },
  );
  // Friendly wildlife to scan, spread over the whole field.
  const babies = SPECIES.filter((s) => s.id !== 'chao' && s.stage === 'baby' && isCommonSpecies(s));
  const wild = rng.int(Z.wildlife[0], Z.wildlife[1]);
  for (let t = 0; f.wildSpots.length < wild && t < 200; t++) {
    const c = floorCells[rng.int(0, floorCells.length - 1)]!;
    if (far(c, 8) && f.wildSpots.every((w) => cellDist(w.cell, c) >= 8))
      f.wildSpots.push({ cell: c, species: rng.pick(babies).id });
  }
  const shrines: Shrine[] = [];
  const nShrines = rng.int(Z.shrines[0], Z.shrines[1]);
  for (let t = 0; shrines.length < nShrines && t < 200; t++) {
    const c = floorCells[rng.int(0, floorCells.length - 1)]!;
    if (far(c, 16) && shrines.every((s) => cellDist(s.cell, c) >= 20) && cellDist(c, chest) >= 2)
      shrines.push({ id: `shrine-${shrines.length}`, cell: c, kind: rng.pick(PLACED_KINDS) });
  }
  f.shrines = shrines;
  // Packs, kept off the road's ends, the stone and the mouths.
  f.packs = placePacks(f, rng, depth, rng.int(Z.packs[0], Z.packs[1]) + 4, act)
    .filter((p) => far(p.cell, 12) && shrines.every((s) => cellDist(s.cell, p.cell) >= 3))
    .slice(0, Z.packs[1])
    .map((p, i) => ({ ...p, id: `pack-${i}` }));
  return remember(key, f);
}

/** Side cave `i` off act `act`'s field: one small level of the act's tileset, no way down. */
export function sideFloor(seed: number, act: number, i: number): Floor {
  const key = `side:${seed}:${act}:${i}`;
  const hit = cache.get(key);
  if (hit) return hit;
  const def = ACTS[act]!;
  const g = generateV3((seed ^ hashString(`side:${act}:${i}`)) >>> 0, actStartDepth(act), {
    level: 'small',
    tileset: def.tileset,
    boss: false,
  });
  return remember(key, { ...g, stairsDown: null, zone: 'side', act });
}
