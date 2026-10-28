/**
 * Version 2 of the Hollow Below's floor generator: bigger floors with three sizes of space
 * (one great chamber with a landmark, medium rooms, small side rooms, tunnels 2–3 cells
 * wide), plus the data the renderers dress the cave with: a visual elevation per cell
 * (terraces, ledges and a lower pool basin), vista openings in the outer wall, bridges and
 * stepping stones over water, the chest's cosy nook and the rare special floors.
 * Pure and seeded like the rest of `dungeon.ts`, which owns the types and version 1.
 */
import { DUNGEON } from '../config/tuning';
import {
  cellAt,
  cellDist,
  FLOOR,
  floorSize,
  hash2,
  LANDMARK_KINDS,
  neighbours,
  scatterFinds,
  vnoise,
  WALL,
  WATER,
  type Cell,
  type Crossing,
  type Floor,
  type LandmarkKind,
  type Nook,
  type Room,
  type RoomKind,
  type SpecialFloor,
  type Vista,
} from './dungeon';
import { Rng } from './rng';

const L = DUNGEON.layout;
const DIRS = { n: [0, -1], e: [1, 0], s: [0, 1], w: [-1, 0] } as const;
const DIR_NAMES = ['n', 'e', 's', 'w'] as const;
const FOUR = [
  [1, 0],
  [-1, 0],
  [0, 1],
  [0, -1],
] as const;

function overlaps(a: Room, b: Room, gap: number): boolean {
  return (
    a.x - gap < b.x + b.w && b.x - gap < a.x + a.w && a.y - gap < b.y + b.h && b.y - gap < a.y + a.h
  );
}

export function centreOf(r: Room): Cell {
  return { x: Math.floor(r.x + r.w / 2), y: Math.floor(r.y + r.h / 2) };
}

function inRoom(r: Room, c: Cell): boolean {
  return c.x >= r.x && c.y >= r.y && c.x < r.x + r.w && c.y < r.y + r.h;
}

const key = (c: Cell) => `${c.x},${c.y}`;

export function generateV2(seed: number, depth: number): Floor {
  const rng = Rng.fromSeed((seed * 31 + depth * 7919 + 0x2545f491) >>> 0);
  const { cols, rows } = floorSize(depth, 2);
  const S = DUNGEON.special;
  let special: SpecialFloor = 'none';
  if (depth >= S.minDepth && rng.chance(S.chance))
    special = rng.pick(['crystal', 'flooded', 'glowworm'] as const);

  // Cellular automata for the rough rock, as in version 1.
  let cells = new Uint8Array(cols * rows);
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const border = x < 2 || y < 2 || x >= cols - 2 || y >= rows - 2;
      cells[y * cols + x] = !border && rng.chance(L.fill) ? FLOOR : WALL;
    }
  }
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
  const inner = (x: number, y: number) => x > 1 && y > 1 && x < cols - 2 && y < rows - 2;
  const open = (x: number, y: number) => {
    if (inner(x, y)) cells[y * cols + x] = FLOOR;
  };

  // Rooms: the great chamber first (it needs the most space), then the rest around it.
  const placed: Room[] = [];
  const place = (
    kind: RoomKind,
    wr: readonly [number, number],
    hr: readonly [number, number],
    force: boolean,
  ): Room | null => {
    for (let t = 0; t < L.placeTries; t++) {
      const w = rng.int(wr[0], wr[1]);
      const h = rng.int(hr[0], hr[1]);
      const x = rng.int(L.margin, cols - w - L.margin);
      const y = rng.int(L.margin, rows - h - L.margin);
      const r: Room = { x, y, w, h, kind };
      if (!placed.some((o) => overlaps(r, o, L.roomGap)) || (force && t === L.placeTries - 1)) {
        placed.push(r);
        return r;
      }
    }
    return null;
  };
  const great = place('great', L.great.w, L.great.h, true)!;
  const mediums: Room[] = [];
  const mediumCount = rng.int(L.medium.count[0], L.medium.count[1]);
  for (let i = 0; i < mediumCount; i++) {
    const r = place('medium', L.medium.w, L.medium.h, i < 2);
    if (r) mediums.push(r);
  }
  const smalls: Room[] = [];
  const smallCount = rng.int(L.small.count[0], L.small.count[1]);
  for (let i = 0; i < smallCount; i++) {
    const r = place('small', L.small.w, L.small.h, i === 0);
    if (r) smalls.push(r);
  }
  // The chain the tunnels follow: in from the first medium room, through the others, to the
  // great chamber, and on into the chest's small room at the end.
  const nookRoom = smalls[0]!;
  const rooms: Room[] = [...mediums, ...smalls.slice(1), great, nookRoom];
  const greatRoom = rooms.indexOf(great);

  for (const r of rooms) {
    if (r.kind === 'great') {
      const rx = r.w / 2;
      const ry = r.h / 2;
      for (let yy = r.y; yy < r.y + r.h; yy++) {
        for (let xx = r.x; xx < r.x + r.w; xx++) {
          const dx = (xx + 0.5 - (r.x + rx)) / rx;
          const dy = (yy + 0.5 - (r.y + ry)) / ry;
          const edge = 1 + (vnoise(xx / 3, yy / 3, seed ^ 7) - 0.5) * 2 * L.great.edgeNoise;
          if (dx * dx + dy * dy <= edge) open(xx, yy);
        }
      }
      continue;
    }
    for (let yy = r.y; yy < r.y + r.h; yy++) {
      for (let xx = r.x; xx < r.x + r.w; xx++) {
        const corner = (xx === r.x || xx === r.x + r.w - 1) && (yy === r.y || yy === r.y + r.h - 1);
        if (corner && rng.chance(0.6)) continue;
        open(xx, yy);
      }
    }
  }
  const tunnel = (a: Room, b: Room) => {
    const wide = rng.int(L.corridorWidth[0], L.corridorWidth[1]);
    let { x, y } = centreOf(a);
    const t = centreOf(b);
    while (x !== t.x || y !== t.y) {
      if (x !== t.x && (y === t.y || rng.chance(0.6))) x += Math.sign(t.x - x);
      else y += Math.sign(t.y - y);
      for (let dy = 0; dy < wide; dy++) for (let dx = 0; dx < wide; dx++) open(x + dx, y + dy);
    }
  };
  for (let i = 1; i < rooms.length; i++) tunnel(rooms[i - 1]!, rooms[i]!);
  if (rooms.length >= 4 && rng.chance(L.loopChance)) {
    const i = rng.int(0, rooms.length - 4);
    tunnel(rooms[i]!, rooms[rng.int(i + 2, rooms.length - 2)]!);
  }

  // Keep only what the first room reaches (every room is on the chain).
  const start = centreOf(rooms[0]!);
  const reachFrom = (from: Cell) => {
    const reach = new Uint8Array(cols * rows);
    const stack: Cell[] = [from];
    reach[from.y * cols + from.x] = 1;
    while (stack.length) {
      const c = stack.pop()!;
      for (const [dx, dy] of FOUR) {
        const nx = c.x + dx;
        const ny = c.y + dy;
        if (nx < 0 || ny < 0 || nx >= cols || ny >= rows) continue;
        const i = ny * cols + nx;
        if (cells[i] === WALL || reach[i]) continue;
        reach[i] = 1;
        stack.push({ x: nx, y: ny });
      }
    }
    return reach;
  };
  const reach = reachFrom(start);
  for (let i = 0; i < cells.length; i++) if (!reach[i]) cells[i] = WALL;

  return dressFloor({
    rng,
    seed,
    depth,
    cols,
    rows,
    cells,
    rooms,
    start,
    great,
    greatRoom,
    mediums,
    nookRoom,
    special,
    version: 2,
  });
}

/** What the dressing needs from a generator's carved rock (versions 2 and 3). */
export interface DressInput {
  rng: Rng;
  seed: number;
  depth: number;
  cols: number;
  rows: number;
  cells: Uint8Array;
  /** Every room; `rooms[0]` holds the stairs up. */
  rooms: Room[];
  start: Cell;
  /** The room the landmark stands in, and its index in `rooms`. */
  great: Room;
  greatRoom: number;
  /** The last of these (when there are two or more) is sunk as the pool basin. */
  mediums: Room[];
  /** The chest's room. */
  nookRoom: Room;
  special: SpecialFloor;
  version: number;
  /** Stairs placed by the generator (version 3); otherwise found beside the landmark. */
  stairsDown?: Cell | null;
  /** Loot and stray counts (version 3); otherwise by depth. */
  counts?: { loot: number; strays: number };
  /** Cells a step up (version 3 pieces' `^`). */
  raised?: Cell[];
  /** Where finds may lie (version 3 thins them out in the side caves); otherwise anywhere. */
  findsAt?: (c: Cell) => boolean;
}

/**
 * Dress carved rock as a floor: vistas, water and the basin pool, the landmark, the chest's
 * nook, torches and crystals, crossings, the elevation and the finds. Version 2's order of
 * random draws is kept exactly (`tests/sim/dungeon-v2-snapshot.test.ts`).
 */
export function dressFloor(o: DressInput): Floor {
  const { rng, seed, depth, cols, rows, cells, rooms, start, great, greatRoom, mediums } = o;
  const { nookRoom, special } = o;
  const S = DUNGEON.special;
  const inner = (x: number, y: number) => x > 1 && y > 1 && x < cols - 2 && y < rows - 2;
  const open = (x: number, y: number) => {
    if (inner(x, y)) cells[y * cols + x] = FLOOR;
  };
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
    light: Math.min(
      1,
      Math.max(DUNGEON.lightMin, DUNGEON.lightBase - DUNGEON.lightPerDepth * (depth - 1)) +
        (special === 'glowworm' ? S.glowwormLight : 0),
    ),
    version: o.version,
    greatRoom,
    elevation: new Float32Array(cols * rows),
    landmark: null,
    vistas: [],
    crossings: [],
    nook: null,
    special,
  };

  // Vista candidates: a walkable cell with nothing but wall between it and the grid edge.
  const V = DUNGEON.vista;
  const vistaDepth = (c: Cell, d: (typeof DIR_NAMES)[number]): number => {
    const [dx, dy] = DIRS[d];
    let n = 0;
    for (
      let x = c.x + dx, y = c.y + dy;
      x >= 0 && y >= 0 && x < cols && y < rows;
      x += dx, y += dy
    ) {
      if (cells[y * cols + x] !== WALL) return 0;
      n++;
    }
    return n <= V.maxDepth ? n : 0;
  };
  const anyVista = () => {
    for (let y = 0; y < rows; y++)
      for (let x = 0; x < cols; x++)
        if (cells[y * cols + x] !== WALL && DIR_NAMES.some((d) => vistaDepth({ x, y }, d) > 0))
          return true;
    return false;
  };
  if (!anyVista()) {
    // No room near the edge: dig a short balcony from the great chamber toward the nearest one.
    const gc = centreOf(great);
    const gaps = [gc.y, cols - 1 - gc.x, rows - 1 - gc.y, gc.x];
    const d = DIR_NAMES[gaps.indexOf(Math.min(...gaps))]!;
    const [dx, dy] = DIRS[d];
    let { x, y } = gc;
    const edgeLeft = () => (dx ? (dx > 0 ? cols - 1 - x : x) : dy > 0 ? rows - 1 - y : y);
    while (edgeLeft() > V.maxDepth) {
      x += dx;
      y += dy;
      open(x, y);
      open(x + Math.abs(dy), y + Math.abs(dx));
    }
  }

  // Water: noise pockets (more on a flooded floor) and the pool in the basin room.
  const W = DUNGEON.water;
  const threshold = special === 'flooded' ? W.flooded : W.threshold;
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      if (cells[y * cols + x] !== FLOOR) continue;
      if (vnoise(x / 5, y / 5, seed ^ 3) < threshold && neighbours(cells, cols, rows, x, y) === 8)
        cells[y * cols + x] = WATER;
    }
  }
  const basin = mediums.length >= 2 ? mediums[mediums.length - 1]! : null;
  if (basin) {
    const bc = { x: basin.x + basin.w / 2, y: basin.y + basin.h / 2 };
    const rx = basin.w * W.poolRadius;
    const ry = basin.h * W.poolRadius;
    for (let yy = basin.y; yy < basin.y + basin.h; yy++) {
      for (let xx = basin.x; xx < basin.x + basin.w; xx++) {
        const dx = (xx + 0.5 - bc.x) / rx;
        const dy = (yy + 0.5 - bc.y) / ry;
        if (
          dx * dx + dy * dy <= 1 &&
          cells[yy * cols + xx] !== WALL &&
          neighbours(cells, cols, rows, xx, yy) === 8
        )
          cells[yy * cols + xx] = WATER;
      }
    }
  }

  // The landmark in the middle of the great chamber, and the way down in view of it.
  const LM = DUNGEON.landmark;
  const gc = centreOf(great);
  const kind: LandmarkKind =
    special === 'crystal'
      ? 'crystalTree'
      : special === 'flooded'
        ? 'waterfallPool'
        : rng.pick(LANDMARK_KINDS);
  floor.landmark = { kind, cell: gc, radius: LM.clearRadius };
  for (let y = gc.y - LM.clearRadius; y <= gc.y + LM.clearRadius; y++) {
    for (let x = gc.x - LM.clearRadius; x <= gc.x + LM.clearRadius; x++) {
      const d = cellDist({ x, y }, gc);
      if (d > LM.clearRadius || cellAt(floor, x, y) === WALL) continue;
      const pool = kind === 'waterfallPool' && d <= LM.poolRadius;
      cells[y * cols + x] = pool ? WATER : FLOOR;
    }
  }
  if (o.stairsDown !== undefined) floor.stairsDown = o.stairsDown;
  else if (depth < DUNGEON.maxDepth) {
    const offsets = [
      [LM.stairsFrom, 0],
      [-LM.stairsFrom, 0],
      [0, LM.stairsFrom],
      [0, -LM.stairsFrom],
    ] as const;
    const first = rng.int(0, offsets.length - 1);
    for (let i = 0; i < offsets.length && !floor.stairsDown; i++) {
      const [dx, dy] = offsets[(first + i) % offsets.length]!;
      const c = { x: gc.x + dx, y: gc.y + dy };
      if (cellAt(floor, c.x, c.y) !== WALL && inRoom(great, c)) floor.stairsDown = c;
    }
    // A narrow chamber: any open cell of it far enough from the landmark.
    for (let y = great.y; y < great.y + great.h && !floor.stairsDown; y++)
      for (let x = great.x; x < great.x + great.w && !floor.stairsDown; x++)
        if (cellAt(floor, x, y) !== WALL && cellDist({ x, y }, gc) > LM.clearRadius)
          floor.stairsDown = { x, y };
    floor.stairsDown ??= { x: gc.x, y: gc.y + 1 };
  }

  // The chest's nook against the back wall of the last small room.
  const nc = centreOf(nookRoom);
  floor.chest = { x: nc.x, y: nookRoom.y };
  const lanterns = [
    { x: nc.x - 1, y: nookRoom.y },
    { x: nc.x + 1, y: nookRoom.y },
  ];
  const rug: Cell[] = [];
  for (let y = nookRoom.y + 1; y <= nookRoom.y + 2; y++)
    for (let x = nc.x - 1; x <= nc.x + 1; x++) rug.push({ x, y });
  const tentAt = { x: nookRoom.x + 1, y: nookRoom.y + nookRoom.h - 2 };
  const tent = rug.some((c) => key(c) === key(tentAt)) ? null : tentAt;
  const nook: Nook = { room: rooms.indexOf(nookRoom), rug, lanterns, tent };
  floor.nook = nook;
  const nookCells = [floor.chest, ...rug, ...lanterns, ...(tent ? [tent] : [])];
  const keepDry = [floor.stairsUp, floor.stairsDown, ...nookCells].filter((c): c is Cell => !!c);
  for (const c of keepDry) {
    if (inner(c.x, c.y)) cells[c.y * cols + c.x] = FLOOR;
  }

  // Torches on walls that face the floor; crystals in the nooks (everywhere on a crystal floor).
  const lmZone = (c: Cell) => cellDist(c, gc) <= LM.clearRadius;
  const nookZone = (c: Cell) => inRoom(nookRoom, c);
  const floors: Cell[] = [];
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) if (cells[y * cols + x] !== WALL) floors.push({ x, y });
  }
  const crystalFloor = special === 'crystal';
  const crystalGap = crystalFloor ? S.crystalSpacing : 8;
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
      neighbours(cells, cols, rows, c.x, c.y) <= (crystalFloor ? 5 : 3) &&
      hash2(c.x, c.y, seed + 1) < (crystalFloor ? 0.8 : 0.4) &&
      cellAt(floor, c.x, c.y) === FLOOR &&
      !lmZone(c) &&
      !nookZone(c) &&
      !floor.crystals.some((t) => cellDist(t, c) < crystalGap)
    ) {
      floor.crystals.push(c);
    }
  }

  // Vistas: the chosen openings, great chamber first, never through a torch's wall.
  const torchKeys = new Set(floor.torches.map(key));
  const cand = new Map<string, number>();
  const candList: Array<{ cell: Cell; dir: (typeof DIR_NAMES)[number] }> = [];
  for (const c of floors) {
    if (cellAt(floor, c.x, c.y) !== FLOOR) continue;
    for (const d of DIR_NAMES) {
      if (d === 'n' && torchKeys.has(key(c))) continue;
      const n = vistaDepth(c, d);
      if (n === 0) continue;
      cand.set(`${key(c)},${d}`, n);
      candList.push({ cell: c, dir: d });
    }
  }
  const rank = (v: { cell: Cell }) =>
    (inRoom(great, v.cell) ? 0 : 1) + hash2(v.cell.x, v.cell.y, seed ^ 5);
  candList.sort((a, b) => rank(a) - rank(b));
  const vistaCount = rng.int(V.count[0], V.count[1]);
  for (const v of candList) {
    if (floor.vistas.length >= vistaCount) break;
    if (floor.vistas.some((o) => cellDist(o.cell, v.cell) < V.spacing)) continue;
    const along = v.dir === 'n' || v.dir === 's' ? [1, 0] : [0, 1];
    const has = (c: Cell) => cand.get(`${key(c)},${v.dir}`);
    let first = v.cell;
    for (let i = 1; i < V.maxWidth; i++) {
      const back = { x: v.cell.x - along[0]! * i, y: v.cell.y - along[1]! * i };
      if (!has(back)) break;
      first = back;
    }
    let width = 0;
    let deep = Infinity;
    for (let i = 0; i < V.maxWidth; i++) {
      const c = { x: first.x + along[0]! * i, y: first.y + along[1]! * i };
      const n = has(c);
      if (!n) break;
      width++;
      deep = Math.min(deep, n);
    }
    const vista: Vista = { cell: first, dir: v.dir, width, depth: deep };
    floor.vistas.push(vista);
  }

  // Crossings over straight runs of water with dry floor at both ends.
  const C = DUNGEON.crossing;
  const runs: Crossing[] = [];
  for (const [dx, dy] of [
    [1, 0],
    [0, 1],
  ] as const) {
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        if (cellAt(floor, x, y) !== WATER || cellAt(floor, x - dx, y - dy) !== FLOOR) continue;
        const span: Cell[] = [];
        let cx = x;
        let cy = y;
        while (cellAt(floor, cx, cy) === WATER) {
          span.push({ x: cx, y: cy });
          cx += dx;
          cy += dy;
        }
        if (cellAt(floor, cx, cy) !== FLOOR || span.length < C.minLen || span.length > C.maxLen)
          continue;
        runs.push({
          kind: span.length >= C.bridgeFrom ? 'bridge' : 'stones',
          from: { x: x - dx, y: y - dy },
          to: { x: cx, y: cy },
          cells: span,
        });
      }
    }
  }
  const mid = (r: Crossing) => r.cells[Math.floor(r.cells.length / 2)]!;
  runs.sort((a, b) => hash2(mid(a).x, mid(a).y, seed ^ 9) - hash2(mid(b).x, mid(b).y, seed ^ 9));
  for (const r of runs) {
    if (floor.crossings.length >= C.max) break;
    if (floor.crossings.some((o) => cellDist(mid(o), mid(r)) < C.spacing)) continue;
    floor.crossings.push(r);
  }

  floor.elevation = elevate(floor, {
    basin,
    flat: [floor.stairsUp, floor.stairsDown, floor.chest, gc].filter((c): c is Cell => !!c),
    ...(o.raised ? { raised: o.raised } : {}),
    nookRoom,
    seed,
  });

  const lmCells: Cell[] = [];
  for (const c of floors) if (lmZone(c)) lmCells.push(c);
  const specialCells = new Set(
    [
      floor.stairsUp,
      floor.chest,
      floor.stairsDown,
      ...floor.torches,
      ...floor.crystals,
      ...nookCells,
      ...lmCells,
    ]
      .filter((c): c is Cell => !!c)
      .map(key),
  );
  const findCells = o.findsAt ? floors.filter(o.findsAt) : floors;
  scatterFinds(floor, rng, depth, findCells, specialCells, o.counts);
  return floor;
}

/**
 * Terrace heights from smooth noise, the basin room sunk, flat ground at the stairs, the
 * chest and the landmark, then relaxed until dry walkable neighbours sit at most one step
 * apart. Water sits `waterSink` under its ground; walls take the highest ground beside them.
 */
function elevate(
  f: Floor,
  o: { basin: Room | null; flat: Cell[]; nookRoom: Room; seed: number; raised?: Cell[] },
): Float32Array {
  const E = DUNGEON.elev;
  const { cols, rows, cells } = f;
  const ground = new Float32Array(cols * rows);
  const fixed = new Uint8Array(cols * rows);
  const levels = Math.round(E.max / E.step);
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const i = y * cols + x;
      if (cells[i] === WALL) continue;
      const n = vnoise(x / E.noiseScale, y / E.noiseScale, o.seed ^ 11);
      ground[i] = Math.min(levels, Math.floor(n * (levels + 1))) * E.step;
    }
  }
  const pin = (x: number, y: number, h: number) => {
    if (x < 0 || y < 0 || x >= cols || y >= rows || cells[y * cols + x] === WALL) return;
    ground[y * cols + x] = h;
    fixed[y * cols + x] = 1;
  };
  // A piece's raised shelves (version 3) sit a step up; the basin and the flats win over them.
  for (const c of o.raised ?? []) pin(c.x, c.y, E.step);
  if (o.basin) {
    const b = o.basin;
    for (let y = b.y; y < b.y + b.h; y++)
      for (let x = b.x; x < b.x + b.w; x++) pin(x, y, -E.basinDepth);
  }
  const r = E.flatRadius;
  for (const c of o.flat) {
    for (let dy = -r; dy <= r; dy++)
      for (let dx = -r; dx <= r; dx++) if (dx * dx + dy * dy <= r * r) pin(c.x + dx, c.y + dy, 0);
  }
  const nr = o.nookRoom;
  for (let y = nr.y; y < nr.y + nr.h; y++) for (let x = nr.x; x < nr.x + nr.w; x++) pin(x, y, 0);
  // Relax: pull each free cell into one step of every walkable neighbour.
  for (let pass = 0, changed = true; changed && pass < 64; pass++) {
    changed = false;
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const i = y * cols + x;
        if (cells[i] === WALL || fixed[i]) continue;
        let lo = -Infinity;
        let hi = Infinity;
        for (const [dx, dy] of FOUR) {
          const nx = x + dx;
          const ny = y + dy;
          if (nx < 0 || ny < 0 || nx >= cols || ny >= rows) continue;
          const j = ny * cols + nx;
          if (cells[j] === WALL) continue;
          lo = Math.max(lo, ground[j]! - E.step);
          hi = Math.min(hi, ground[j]! + E.step);
        }
        const h = ground[i]!;
        const v = h > hi ? hi : h < lo ? lo : h;
        if (v !== h) {
          ground[i] = v;
          changed = true;
        }
      }
    }
  }
  const out = new Float32Array(cols * rows);
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const i = y * cols + x;
      if (cells[i] === WATER) out[i] = ground[i]! - E.waterSink;
      else if (cells[i] === FLOOR) out[i] = ground[i]!;
      else {
        let top = -Infinity;
        for (const [dx, dy] of FOUR) {
          const nx = x + dx;
          const ny = y + dy;
          if (nx < 0 || ny < 0 || nx >= cols || ny >= rows) continue;
          const j = ny * cols + nx;
          if (cells[j] !== WALL) top = Math.max(top, ground[j]!);
        }
        out[i] = top === -Infinity ? 0 : top;
      }
    }
  }
  return out;
}
