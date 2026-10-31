import { DUNGEON, HOLLOW, HOLLOW_R7, KEEPER, SCANS, type HollowLevel } from '../config/tuning';
import { CRITTER_SPECIES } from './critters';
import { dayKey } from './daily';
import { tzOf } from './local-time';
import { createEgg, EGG_COLORS } from './nubbin';
import { generateV2 } from './dungeon-gen';
import { generateV3, v3OptionsFor } from './dungeon-gen-v3';
import { stepSecrets, withSeals, type Seal } from './dungeon-secrets';
import { stepPuzzles } from './dungeon-puzzles';
import { platformFloor } from './dungeon-gaps';
import { hopAcross, stepFall } from './dungeon-falls';
import {
  isStrayKing,
  kingHat,
  maySnatch,
  pickTrail,
  shooStray,
  stepStray,
  stepStrayAsk,
  strayBoutEnded,
  strayBoutLive,
} from './dungeon-strays';
import { rumbleEnded, stepRumble } from './dungeon-rumble';
import { gearStat } from './gear';
import { shrineShells, shrineSight, stepShrines, type Shrine } from './dungeon-shrines';
import { stepTraps, type Trap } from './dungeon-traps';
import { stepPicnic } from './dungeon-picnic';
import { noteSplit } from './dungeon-speed';
import { fillRooms, quietScan } from './dungeon-rooms';
import { forfeitBattleCmd } from './battle';
import { escapeProps, propBlocked, resolveProps } from './dungeon-props';
import { actSeed, rememberLevel, restoreLevel } from './dungeon-levels';
import { acornInFind, goToLevel, stepWaypoint } from './dungeon-travel';
import { actBossDepth, actFloor, actOpen, actProgress } from './dungeon-acts';
import { actStartDepth } from '../config/dungeon-acts';
import type { ServiceKind } from '../config/dungeon-zones';
import { zoneFloor, zoneStairs } from './dungeon-zones';
import {
  boutOutcome,
  finishEncounter,
  HOLLOW_BATTLE_SOURCE,
  freshPacks,
  stepPacks,
  type EncounterOutcome,
  type EncounterPack,
} from './dungeon-encounters';
import { nubbinWaypoint } from './dungeon-nav';
import {
  fetchRadiusOf,
  hollowPartySize,
  leadFirst,
  lightBonus,
  mayFetch,
  stepScout,
} from './dungeon-roles';
import { noteTrail } from './dungeon-speed';
import { shellPay } from './dungeon-economy';
import {
  dailyActFloor,
  dailyActOf,
  dailyBossDown,
  DAILY_LEVELS,
  onDailyChain,
} from './dungeon-daily';
import { followDistanceOf, moodTarget } from './dungeon-moods';
import { friendSight } from './dungeon-friends';
import { stepRoundNineC } from './dungeon-r9-c';
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
import { bankSack, partySpent, stepSack, tumbleHome } from './dungeon-sack';
import { noteDailyDepth, noteLevelDone, notePickup, noteTripEnd } from './dungeon-log';
// Lane B r9 (helper d): kid mode, raised shelves, authored story floors.
import { HOLLOW_R9D } from '../config/dungeon-r9-d';
import { gentleFloor, hollowKid } from './dungeon-kid';
import { raiseShelves, type Shelf } from './dungeon-shelves';
import { storyFloor } from './dungeon-story-floors';

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
/** A chasm cut across a passage (R0031): `cells` in order across it. */
export interface Gap {
  cells: Cell[];
  nook: boolean;
}

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
  /** 0 wall, 1 floor, 2 water, 3 chasm (version 4). */
  cells: Uint8Array;
  rooms: Room[];
  stairsUp: Cell;
  stairsDown: Cell | null;
  chest: Cell;
  torches: Cell[];
  crystals: Cell[];
  loot: FloorLoot[];
  strayStarts: Cell[];
  /** R0198: `nook` marks a nursery nook, scanned by waiting quietly beside it. */
  wildSpots: Array<{ cell: Cell; species: string; nook?: true }>;
  /** Ambient light level 0..1; floors get darker. */
  light: number;
  /** The generator that made this floor (`HOLLOW.genVersion` for new floors). */
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
  /** How a version-3 floor was assembled from pieces (R0144); absent on older floors. */
  layout?: FloorLayout;
  /** The floor's monster packs (R0146); absent on floors without them. */
  packs?: EncounterPack[];
  /** Chasm cuts (R0031, version 4); `nook` marks a cut that puts a side pocket behind a jump. */
  gaps?: Gap[];
  /** Water cells the generator dried so every part of the floor can be reached (version 4). */
  fords?: Cell[];
  /** Shrines (R0159, version 4). */
  shrines?: Shrine[];
  /** Traps (R0161, version 4). */
  traps?: Trap[];
  /** An act's camp, field or side cave (R0152, R0147); absent on dungeon levels. The secret
   * levels (lane B r9) wear 'field' (the Moo Meadow) or 'side' (the Pillow Fort). */
  zone?: 'town' | 'field' | 'side';
  /** A camp's services. */
  services?: Service[];
  /** A field's cave mouths onto its side caves, by side-cave index. */
  mouths?: Cell[];
  /** Where an authored waypoint stone stands (camps and fields). */
  stone?: Cell;
  /** The act a camp, field or side cave belongs to, by `ACTS` index. */
  act?: number;
  /** Lane B r8: secret rooms, puzzle gates and the boss door (dungeon-secrets.ts). */
  seals?: Seal[];
  /** Lane B r9 (R0191): raised shelves, a jump up (dungeon-shelves.ts). */
  shelves?: Shelf[];
}

/** A camp service (R0152): who keeps it is a trainer id, `local`, or '' for the stash. */
export interface Service {
  kind: ServiceKind;
  cell: Cell;
  keeper: string;
}

/** A slot's job on a version-3 floor. */
export type SlotRole = 'entry' | 'exit' | 'boss' | 'treasure' | 'hub' | 'corridor';

export interface PlacedPiece {
  id: string;
  role: SlotRole;
  /** Top-left cell and size after turning. */
  at: Cell;
  size: [number, number];
  /** Quarter turns clockwise. */
  turns: number;
}

export interface FloorLayout {
  /** R0188: 'kid' on kid mode's smaller floors. */
  level: HollowLevel | 'kid';
  tileset: string;
  /** In walk order: `pieces[0]` is the entry; `rooms[i]` is `pieces[i]`'s rectangle. */
  pieces: PlacedPiece[];
  /** Joined pieces, by index (the walk's tree plus its loops). */
  links: Array<[number, number]>;
  /** Pieces joined to three or more others. */
  junctions: number;
  /** The pieces' spawn spots (`S`), shrine sockets (`X`) and the boss's spot (`B`). */
  spawns: Cell[];
  shrines: Cell[];
  boss: Cell | null;
}

export const WALL = 0;
export const FLOOR = 1;
export const WATER = 2;
/** A gap in the floor (R0031, version 4): jump it or walk round. Never stood on. */
export const CHASM = 3;

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
    const v = cellAt(f, x0 + dx, y0 + dy);
    if (v === WALL || v === CHASM || w <= 0) continue;
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
  counts?: { loot: number; strays: number },
): void {
  const open = floors.filter(
    (c) =>
      cellAt(floor, c.x, c.y) === FLOOR &&
      !special.has(`${c.x},${c.y}`) &&
      cellDist(c, floor.stairsUp) > 3,
  );
  // R0205: the same pick as filtering the open cells by distance and taking the k-th, without
  // building the filtered list on every call (it was a tenth of a deep floor's time).
  const su = floor.stairsUp;
  const far = (c: Cell, m: number) => (c.x - su.x) ** 2 + (c.y - su.y) ** 2 >= m * m;
  const pickOpen = (minFromStairs: number): Cell | null => {
    let count = 0;
    for (const c of open) if (far(c, minFromStairs)) count++;
    if (count === 0) return null;
    let k = rng.int(0, count - 1);
    for (let i = 0; i < open.length; i++) {
      const c = open[i]!;
      if (!far(c, minFromStairs)) continue;
      if (k-- === 0) {
        open.splice(i, 1);
        return c;
      }
    }
    return null;
  };
  const lootCount =
    counts?.loot ??
    Math.min(DUNGEON.lootMax, Math.round(DUNGEON.lootBase + DUNGEON.lootPerDepth * (depth - 1)));
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
  const strayCount =
    counts?.strays ??
    Math.min(
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
export function floorOf(
  seed: number,
  depth: number,
  version: number = HOLLOW.genVersion,
  kid = false,
): Floor {
  // R0188: a kid run's floors are their own (smaller, gentler); older versions ignore it.
  kid &&= version >= 3;
  const key = `${seed}:${depth}:${version}${kid ? ':kid' : ''}`;
  let f = cache.get(key);
  if (!f) {
    const opts = kid
      ? { ...v3OptionsFor(depth), level: HOLLOW_R9D.kid.level }
      : v3OptionsFor(depth);
    f =
      version <= 1
        ? generateV1(seed, depth)
        : version === 2
          ? generateV2(seed, depth)
          : version === 3
            ? generateV3(seed, depth, opts)
            : raiseShelves(
                fillRooms(
                  platformFloor(generateV3(seed, depth, opts), seed, depth),
                  seed,
                  depth,
                  null,
                ),
                seed,
                depth,
              );
    if (kid) gentleFloor(f);
    if (cache.size > 12) cache.delete(cache.keys().next().value!);
    cache.set(key, f);
  }
  return f;
}

/** The floor a run stands on: its act's dungeon (R0145), or the endless Hollow by version. */
export function floorOfRun(run: DungeonRun): Floor {
  const zone = zoneFloor(run);
  if (zone) return zone;
  // Lane B r8: the run's opened secrets, puzzle gates and the boss door.
  return withSeals(
    run,
    run.act !== undefined
      ? actFloor(run.seed, run.act, run.depth, run.genVersion, run.difficulty, !!run.kid)
      : run.dailyAct !== undefined && run.daily !== null
        ? // R0185 (round 9): today's five-level act chain.
          dailyActFloor(run.seed, run.dailyAct, run.depth, run.genVersion)
        : run.story && run.genVersion >= 3
          ? storyFloor(run.seed, run.depth)
          : floorOf(run.seed, run.depth, run.genVersion, !!run.kid),
  );
}

export function runFloor(world: World): Floor | null {
  const run = world.dungeon;
  return run && world.location === 'dungeon' ? floorOfRun(run) : null;
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
export function revealAround(run: DungeonRun, f: Floor, c: Cell, extra = 0): void {
  const r = DUNGEON.explore.radius + shrineSight(run) + extra;
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

/**
 * What a body treats as solid (R0031): rock only (the Keeper, who may jump a gap or fall
 * in one), rock and chasms (swimmers), or rock, chasms and deep water.
 */
export type Solid = 'rock' | 'chasm' | 'all';

function blocks(f: Floor, x: number, y: number, solid: Solid): boolean {
  const v = cellAt(f, x, y);
  if (v === WALL) return true;
  if (solid === 'rock') return false;
  return v === CHASM || (solid === 'all' && v === WATER && f.version >= 4);
}

/** Push a circle out of the wall cells around it. Returns true when it moved. */
export function resolveDungeon(p: Vec2, f: Floor, radius: number, solid: Solid = 'rock'): boolean {
  let moved = false;
  const c = cellOf(f, p);
  if (blocks(f, c.x, c.y, solid)) {
    // Inside rock (a tap landed there, or a load): step to the nearest open cell.
    const near = nearestOpen(f, c, solid);
    if (near) {
      const q = cellCentre(f, near);
      p.x = q.x;
      p.z = q.z;
      if (resolveProps(p, f, radius)) escapeProps(p, f, radius, (q) => wallsBlock(q, f, radius));
      return true;
    }
  }
  for (let pass = 0; pass < 2; pass++) {
    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= 1; dx++) {
        const cx = c.x + dx;
        const cy = c.y + dy;
        if (!blocks(f, cx, cy, solid)) continue;
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
  // Solid set pieces (R0032), then the walls once more so a prop never pushes into rock.
  if (resolveProps(p, f, radius)) {
    moved = true;
    escapeProps(p, f, radius, (q) => wallsBlock(q, f, radius));
  }
  return moved;
}

export function dungeonBlocked(p: Vec2, f: Floor, radius = 0.3): boolean {
  return propBlocked(p, f, radius) || wallsBlock(p, f, radius);
}

/** Whether rock alone blocks a body of `radius` at `p`. */
function wallsBlock(p: Vec2, f: Floor, radius: number): boolean {
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

function nearestOpen(f: Floor, c: Cell, solid: Solid = 'rock'): Cell | null {
  for (let r = 1; r < 8; r++) {
    for (let dy = -r; dy <= r; dy++) {
      for (let dx = -r; dx <= r; dx++) {
        if (Math.max(Math.abs(dx), Math.abs(dy)) !== r) continue;
        if (!blocks(f, c.x + dx, c.y + dy, solid)) return { x: c.x + dx, y: c.y + dy };
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
  // R0167: 3 come along, 4 after Act II.
  const size = hollowPartySize(world);
  if (world.keeper.carrying) party.push(world.keeper.carrying);
  // The party picked at the cave mouth (R0168), then partners, then anyone.
  for (const id of [...world.hollow.lastParty, ...world.partners]) {
    const n = id ? world.nubbins.find((x) => x.id === id) : undefined;
    if (n && canJoin(n) && !party.includes(n.id) && party.length < size) party.push(n.id);
  }
  for (const n of world.nubbins) {
    if (party.length >= size) break;
    if (canJoin(n) && !party.includes(n.id)) party.push(n.id);
  }
  // R0167: a Fight Nubbin walks at the front and leads the bouts.
  return leadFirst(world, party);
}

/** A floor's strays, wild creatures and packs, fresh; nothing taken, seen or opened. */
export function populate(run: DungeonRun, f: Floor): void {
  run.strays = f.strayStarts.map((c, i): DungeonStray => ({
    id: `stray-${i}`,
    pos: cellCentre(f, c),
    target: null,
    cooldownMs: 0,
    ...(isStrayKing(run.seed, run.depth, `stray-${i}`) ? { king: true as const } : {}),
  }));
  run.wild = f.wildSpots.map((w, i): DungeonWild => ({
    id: `wild-${i}`,
    species: w.species,
    pos: cellCentre(f, w.cell),
    scanned: false,
    ...(w.nook ? { nook: true as const } : {}),
  }));
  run.taken = [];
  run.chestOpen = false;
  run.pending = null;
  run.pendingPos = null;
  run.fetch = {};
  run.explored = '';
  if (f.packs) run.packs = freshPacks(f);
  else delete run.packs;
  delete run.encounter;
}

/** The Keeper on `cell` (the stairs up unless told), the party sat on open cells around. */
export function placeParty(world: World, run: DungeonRun, f: Floor, cell: Cell = f.stairsUp): void {
  const k = world.keeper;
  const at = cellCentre(f, cell);
  k.pos = { x: at.x, z: at.z };
  revealAround(run, f, cell);
  k.moveTarget = null;
  k.intent = null;
  const spots = openAround(f, cell, run.party.length + 1);
  run.party.forEach((id, i) => {
    const n = world.nubbins.find((x) => x.id === id);
    if (!n) return;
    const c = spots[i] ?? cell;
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
export function dailySeed(wallMs: number, tzMin = 0): { day: string; seed: number } {
  // TECH-45: the Keeper's local day, from the time zone the UI sent.
  const day = dayKey(wallMs, tzMin);
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
  act?: number,
): boolean {
  if (world.location !== 'grove' || world.dungeon) return false;
  if (story) daily = false;
  // An act's dungeon (R0145): only once it is open, never as today's shared cave.
  if (act !== undefined && (story || !actOpen(world, act))) return false;
  if (act !== undefined) daily = false;
  const today = dailySeed(world.lastWallMs, tzOf(world));
  // An act's floors are the same every visit until a reroll (R0149).
  const seed = story
    ? story.seed
    : daily
      ? today.seed
      : act !== undefined
        ? actSeed(world, act, rng)
        : rng.int(1, 2_000_000_000);
  const depth = story
    ? Math.max(1, Math.round(story.depth))
    : act !== undefined
      ? actStartDepth(act)
      : 1;
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
    // R0197: new story runs get their authored floors (dungeon-story-floors.ts); a story run
    // saved on a version-2 floor keeps version 2 all the way down.
    genVersion: HOLLOW.genVersion,
    explored: '',
    // R0209: co-op hooks, data only; the run's other Keepers (none yet).
    keepers: [],
    ...(story ? { story: true as const } : {}),
    // R0188: kid mode (story floors are the story's own).
    ...(!story && hollowKid(world) ? { kid: true as const } : {}),
    ...(act !== undefined ? { act } : {}),
    // R0185 (round 9): today's shared Hollow is a fixed act chain, the same for everyone.
    ...(daily ? { dailyAct: dailyActOf(today.seed) } : {}),
    // R0179: an act run keeps the tier it set out on.
    ...(act !== undefined && world.hollow.difficulty
      ? { difficulty: world.hollow.difficulty }
      : {}),
  };
  const f = floorOfRun(run);
  populate(run, f);
  run.graceUntilMs = world.timeMs + HOLLOW.arrivalGraceMs;
  world.dungeon = run;
  world.location = 'dungeon';
  placeParty(world, run, f);
  if (daily && world.hollow.dailyDay !== today.day) {
    world.hollow.dailyDay = today.day;
    world.hollow.dailyDepth = 1;
  }
  noteDailyDepth(world, run);
  events.push({ kind: 'dungeonEntered', depth, daily });
  events.push({ kind: 'located', location: 'dungeon' });
  return true;
}

export function leaveDungeon(world: World, events: SimEvent[]): boolean {
  const run = world.dungeon;
  if (!run || world.location !== 'dungeon') return false;
  // Walking out of a fight gives it up: the bout ends with no prize and nothing on record.
  const live = world.battle;
  if (run.encounter && live && !live.result && live.context.kind === 'encounter')
    if (live.context.source === HOLLOW_BATTLE_SOURCE) forfeitBattleCmd(world, events);
  // R0175: the sack banks on the way in; R0185 and R0211 note the trip.
  bankSack(world, run, 'home', events);
  noteTripEnd(world, run);
  returnHome(world, run);
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

/** Back up to the Grove where everyone was before the Hollow; the run itself is left alone. */
export function returnHome(world: World, run: DungeonRun): void {
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
}

function descend(world: World, run: DungeonRun, events: SimEvent[]): void {
  // The bottom of an act: the boss guards the way on; once it is beaten the way leads home
  // with the haul, and the next act is open from the cave mouth (R0145).
  if (run.act !== undefined && run.depth >= actBossDepth(run.act)) {
    if (actProgress(world, run.act).bossDefeated) leaveDungeon(world, events);
    else events.push({ kind: 'bossGuard' });
    return;
  }
  // R0185 (round 9): today's chain ends at its fifth level; the boss there guards the way home.
  if (onDailyChain(run) && run.depth >= DAILY_LEVELS) {
    if (dailyBossDown(run)) leaveDungeon(world, events);
    else events.push({ kind: 'bossGuard' });
    return;
  }
  // R0205: the Deep Hollow ends at floor 99; its stairs there only rumble.
  if (run.act === undefined && !run.story && run.depth >= HOLLOW_R7.deepMax) {
    events.push({ kind: 'deepBottom' });
    return;
  }
  noteLevelDone(world, run);
  noteSplit(world, run, events);
  rememberLevel(run);
  run.depth += 1;
  // A new floor always comes from the current generator, whatever made the one above.
  run.genVersion = run.story && run.genVersion <= 2 ? 2 : HOLLOW.genVersion;
  const f = floorOfRun(run);
  populate(run, f);
  restoreLevel(run);
  run.graceUntilMs = world.timeMs + HOLLOW.arrivalGraceMs;
  placeParty(world, run, f);
  if (run.act !== undefined) {
    const p = actProgress(world, run.act);
    p.deepest = Math.max(p.deepest, run.depth - actStartDepth(run.act) + 1);
  }
  world.hollow.best = Math.max(world.hollow.best, run.depth);
  if (run.daily && run.daily === world.hollow.dailyDay)
    world.hollow.dailyDepth = Math.max(world.hollow.dailyDepth, run.depth);
  noteDailyDepth(world, run);
  events.push({ kind: 'descended', depth: run.depth, daily: run.daily !== null });
}

/**
 * The boot veil is up (or has just lifted) over a floor (R0142). While it is up the floor
 * holds still; when it lifts the arrival grace starts again, so the first thing the player
 * sees is never a stray already making off with their Shells.
 */
export function setDungeonLoading(world: World, on: boolean): void {
  const run = world.dungeon;
  if (!run) return;
  if (on) run.loading = true;
  else if (run.loading) {
    delete run.loading;
    run.graceUntilMs = world.timeMs + HOLLOW.arrivalGraceMs;
  }
}

/** The fight the floor was waiting on is over (R0146). */
export function encounterDone(world: World, outcome: EncounterOutcome, events: SimEvent[]): void {
  const f = runFloor(world);
  if (f) finishEncounter(world, f, outcome, events);
}

/**
 * The battle core's hook (lane C): a Hollow bout that just ended (`battleEnd` among `fresh`)
 * finishes its encounter, so the floor moves again and the pack poofs, goes home or wins.
 */
export function hollowBattleEnded(world: World, fresh: SimEvent[], events: SimEvent[]): void {
  const run = world.dungeon;
  // Round 5: the stray's calm bout (R0281) and the rumble rooms' tactics bouts (R0257).
  if (run?.strayBout) strayBoutEnded(world, fresh, events);
  if (run && fresh.some((e) => e.kind === 'tacticsEnd')) rumbleEnded(world, fresh, events);
  const enc = run?.encounter;
  const f = runFloor(world);
  if (!enc || !f) return;
  for (const e of fresh) {
    if (e.kind !== 'battleEnd' || e.source !== HOLLOW_BATTLE_SOURCE || e.key !== enc.packId)
      continue;
    const boss = f.packs?.find((p) => p.id === enc.packId)?.kind === 'boss';
    const outcome = boutOutcome({ winner: e.winner, reason: e.reason }, !boss);
    finishEncounter(world, f, outcome, events, outcome === 'won' ? e.shells : 0);
    return;
  }
}

/** Walk to the stairs or the chest and use it on arrival. */
export function dungeonGo(world: World, to: 'up' | 'down' | 'chest', events: SimEvent[]): void {
  const run = world.dungeon;
  const f = runFloor(world);
  if (!run || !f || run.encounter) return;
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
  if (run.strayAsk?.id === id) delete run.strayAsk;
  if (world.inventory.fruit < 1) {
    // No fruit: a party Nubbin chases it off instead, if one has the energy (R0162).
    if (shooStray(world, run, id, events)) return;
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
  // Camps, fields and side caves have their own ways in and out (R0147, R0152).
  if ((pending === 'up' || pending === 'down') && zoneStairs(world, run, pending, events)) return;
  if (pending === 'up') {
    // Inside an act the stairs up climb a level; from its top they lead home.
    if (run.act !== undefined && !run.story && run.depth > actStartDepth(run.act))
      goToLevel(world, run, run.depth - 1, 'down', events);
    else leaveDungeon(world, events);
  } else if (pending === 'down') {
    descend(world, run, events);
  } else if (pending === 'chest') {
    if (run.chestOpen) return;
    run.chestOpen = true;
    const rng = Rng.fromSeed(`${run.seed}:${run.depth}:chest`);
    // R0178: scaled by the act's payout, so the bigger floors don't flood the shop.
    const shells = shellPay(
      run,
      (rng.int(DUNGEON.chestShells[0], DUNGEON.chestShells[1]) + run.depth * 10) *
        shrineShells(run),
    );
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
    kingHat(world, s, events);
    const rng = Rng.fromSeed(`${run.seed}:${run.depth}:${s.id}`);
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
  if (acornInFind(run, loot.id)) {
    world.hollow.acorns += 1;
    events.push({ kind: 'acornFound' });
  }
  const inv = world.inventory;
  let amount = loot.amount;
  let kind = loot.kind;
  switch (loot.kind) {
    case 'shells':
      // A Sunny shrine finds a quarter more (R0159).
      // Gloves and Sunny gear add a few to every handful (R0164).
      // R0178: the act's payout scale applies before the gear's flat bonus.
      amount = shellPay(run, amount * shrineShells(run)) + Math.round(gearStat(world, 'shells'));
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
  notePickup(world, kind);
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
  if (run.loading) return;
  // A fight holds the floor still, the Keeper too (the bout panel or the tactics board is up).
  const held = !!run.encounter || strayBoutLive(world, run, events) || !!world.tactics;
  if (held) {
    world.keeper.moveTarget = null;
    world.keeper.intent = null;
    run.pending = null;
    run.pendingPos = null;
  }
  const settling = world.timeMs < (run.graceUntilMs ?? 0);
  const dt = dtMs / 1000;
  const k = world.keeper;
  const available = (l: FloorLoot) => !run.taken.includes(l.id);
  // R0167: a Light Nubbin's glow orb shows more of the floor.
  const sight =
    Math.floor(gearStat(world, 'explore')) + lightBonus(world, run) + friendSight(world);
  revealAround(run, f, cellOf(f, k.pos), sight);
  noteTrail(world, run, f);
  stepFall(world, run, f, events);

  // Anything the Keeper walks over.
  for (const l of f.loot) {
    if (!available(l)) continue;
    if (dist(k.pos, cellCentre(f, l.cell)) <= DUNGEON.pickupRadius + gearStat(world, 'pickup'))
      takeLoot(world, run, l, null, rng, events);
  }
  stepWaypoint(world, run, f, events);
  stepSack(world, run, events);
  stepShrines(world, run, f, dtMs, events);
  stepTraps(world, run, f, dtMs, events);
  stepSecrets(world, run, f, dtMs, events);
  stepPuzzles(world, run, f, dtMs, events);
  stepPicnic(world, run, f, dtMs, events);
  for (const w of run.wild) {
    if (w.scanned || dist(k.pos, w.pos) > DUNGEON.scanRadius) continue;
    // R0198: a nursery nook's baby waits for the Keeper to stand still and quiet a moment.
    if (w.nook && !quietScan(world, run, w, dtMs)) continue;
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
  // R0362: everyone out of puff tumbles home in a heap.
  if (!held && run.zone !== 'town' && partySpent(world, run)) {
    tumbleHome(world, events);
    return;
  }

  // R0167: a Scout calls out a pack before it notices.
  stepScout(world, run, events);
  // Monster packs (R0146); a fight under way holds the rest of the floor still.
  stepPacks(world, f, dtMs, rng, events, settling);
  if (run.encounter || held || world.dungeon !== run || runFloor(world) !== f) return;
  // Rumble rooms (R0257, R0282): walking in starts a tactics bout on this very room.
  if (!settling) stepRumble(world, run, f, events);
  if (world.tactics) return;

  // Strays wander, flee after a snatch, and snatch Shells when they bump the Keeper.
  for (const s of [...run.strays]) {
    s.cooldownMs = Math.max(0, s.cooldownMs - dtMs);
    const fleeing = s.cooldownMs > 0;
    // R0281: a stray that bumped the Keeper holds still and asks before it snatches.
    const touching =
      !fleeing && maySnatch(s, settling) && dist(s.pos, k.pos) < 0.9 && world.inventory.shells > 0;
    if (stepStrayAsk(world, run, s, touching, dtMs, events)) continue;
    if (s.cooldownMs > 0 && !fleeing) {
      // It just snatched after asking: off it runs.
      const away = randomOpenCell(f, rng, null, 0);
      s.target = away ? cellCentre(f, away) : null;
    }
    if (
      !s.target ||
      walkToward(s.pos, s.target, fleeing ? DUNGEON.strayFleeSpeed : DUNGEON.straySpeed, dt)
    ) {
      const c = randomOpenCell(f, rng, cellOf(f, s.pos), fleeing ? 10 : 5);
      s.target = c ? cellCentre(f, c) : null;
    }
    resolveDungeon(s.pos, f, 0.3, 'all');
    // R0162: the snatched Shells drop as a trail behind it; twice a floor at most.
    stepStray(world, run, f, s, dtMs);
  }
  pickTrail(world, run, events);

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
      // R0167: Fetch reaches further, Lazy stays close, only a Swim Nubbin swims to an island.
      let bestD: number = fetchRadiusOf(world, n);
      for (const l of f.loot) {
        if (!available(l) || Object.values(run.fetch).includes(l.id)) continue;
        if (!mayFetch(world, f, n, l.cell)) continue;
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
    else {
      // R0167 (round 9): personality colours the follow (a hop, a hide, a borrowed Shell).
      const mood = moodTarget(world, run, n, events);
      if (mood === 'hold') continue;
      if (mood) target = mood;
      else if (dist(n.pos, k.pos) > followDistanceOf(n)) target = k.pos;
    }
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
    resolveDungeon(n.pos, f, 0.3, 'chasm');
  }
  hopAcross(world, run, f);
  // Lane B round 9 (helper c): moods (R0167), the hired friend (R0181), act quests (R0166).
  stepRoundNineC(world, run, f, dtMs, events);
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
/** The ids of who would come along now. */
export function partyIds(world: World): string[] {
  return choosePartyFor(world);
}

export function partyPreview(world: World): string[] {
  return choosePartyFor(world).map((id) => world.nubbins.find((n) => n.id === id)?.name ?? id);
}
