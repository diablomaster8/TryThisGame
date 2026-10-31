/**
 * Version 3 of the Hollow Below's floor generator (R0143, R0144): bigger floors assembled
 * D2-style from authored room pieces. A seeded walk over a grid of 12-cell slots grows a
 * branching tree from the entry, a few loops close it, and each slot gets a piece whose
 * sockets face its neighbours (turned to fit; unused sockets walled up). Short tunnels join
 * the sockets, cellular-automata rock fills the space between pieces so the cave still
 * feels dug rather than built, and version 2's dressing does the rest (landmark, water,
 * nook, torches, elevation, finds). A leaf partway along holds the way down and two or
 * three other leaves are treasure dead-ends, so a side branch is a choice with a payoff.
 * Pure and seeded like the rest of `dungeon.ts`.
 */
import { DUNGEON, HOLLOW, type HollowLevel } from '../config/tuning';
import { CRITTER_SPECIES } from './critters';
import {
  FLOOR,
  WALL,
  hash2,
  WATER,
  type Cell,
  type Floor,
  type FloorLayout,
  type PlacedPiece,
  type Room,
  type RoomKind,
  type SlotRole,
  type SpecialFloor,
} from './dungeon';
import { dressFloor } from './dungeon-gen';
import { bossPack, placePacks } from './dungeon-encounters';
import {
  pieceById,
  piecesFor,
  rotateRows,
  socketsOf,
  type Piece,
  type PieceTag,
  type Side,
} from './dungeon-pieces';
import { Rng } from './rng';
import { HOLLOW_R9D } from '../config/dungeon-r9-d';
import { NUBBIN_TYPES, type DungeonLootKind } from './types';

const V = HOLLOW.v3;
const SIDES: readonly Side[] = ['n', 'e', 's', 'w'];
const STEP: Record<Side, readonly [number, number]> = {
  n: [0, -1],
  e: [1, 0],
  s: [0, 1],
  w: [-1, 0],
};
const OPP: Record<Side, Side> = { n: 's', e: 'w', s: 'n', w: 'e' };
/** R0205: the four steps as plain arrays (destructuring step pairs in hot loops was slow). */
const DX4 = [1, -1, 0, 0] as const;
const DY4 = [0, 0, 1, -1] as const;

/** Lane B r9 (R0188): kid mode's smaller floors sit beside the three levels. */
export type V3Level = HollowLevel | 'kid';

export interface V3Options {
  level: V3Level;
  tileset: string;
  /** The last floor of an act dungeon: the exit is a boss room. */
  boss: boolean;
  /**
   * R0197: authored pieces by id for the entry, the exit and one hub (story floors), set
   * from storyline data so the generator stays generic. A piece that cannot fit its slot
   * falls back to the tileset's.
   */
  authored?: { entry?: string; exit?: string; hub?: string };
}

/** The nearest FLOOR cell to `c` by rings (itself when dry). */
function dryNear(f: Floor, c: Cell): Cell {
  for (let r = 0; r < 8; r++)
    for (let dy = -r; dy <= r; dy++)
      for (let dx = -r; dx <= r; dx++) {
        if (Math.max(Math.abs(dx), Math.abs(dy)) !== r) continue;
        const x = c.x + dx;
        const y = c.y + dy;
        if (x >= 0 && y >= 0 && x < f.cols && y < f.rows && f.cells[y * f.cols + x] === FLOOR)
          return { x, y };
      }
  return c;
}

/** The endless Hollow's floors: Rootways pieces, growing with depth. */
export function v3OptionsFor(depth: number): V3Options {
  const d = V.deepLevels;
  const level: HollowLevel = depth <= d.small ? 'small' : depth <= d.standard ? 'standard' : 'big';
  return { level, tileset: 'rootways', boss: false };
}

/**
 * Lane B r8 (R0182): each version-3 floor's side caves, as cell indexes (the cave and the
 * tunnel dug to it). Kept beside the floor, not on it, so floors stay as they were.
 */
const SIDE_CAVES = new WeakMap<Floor, number[][]>();

export function sideCaves(f: Floor): readonly number[][] {
  return SIDE_CAVES.get(f) ?? [];
}

// ---------------------------------------------------------------- turned pieces

interface Turned {
  piece: Piece;
  turns: number;
  rows: string[];
  w: number;
  h: number;
  sides: Set<Side>;
}

const turnedCache = new Map<string, Turned>();

function turned(p: Piece, turns: number): Turned {
  const key = `${p.id}:${turns}`;
  let t = turnedCache.get(key);
  if (!t) {
    const rows = rotateRows(p.rows, turns);
    t = {
      piece: p,
      turns,
      rows,
      w: rows[0]!.length,
      h: rows.length,
      sides: new Set(socketsOf(rows).map((s) => s.dir)),
    };
    turnedCache.set(key, t);
  }
  return t;
}

// ---------------------------------------------------------------- the slot walk

interface Walk {
  /** Slot indices in the order the walk reached them; `order[0]` is the entry. */
  order: number[];
  adj: Map<number, Set<number>>;
  roles: Map<number, SlotRole>;
  junctions: number;
}

function link(adj: Map<number, Set<number>>, a: number, b: number): void {
  adj.get(a)!.add(b);
  adj.get(b)!.add(a);
}

function growWalk(rng: Rng, sx: number, sy: number, count: number, boss: boolean): Walk | null {
  const near = (s: number): number[] => {
    const x = s % sx;
    const y = Math.floor(s / sx);
    const out: number[] = [];
    for (const d of SIDES) {
      const nx = x + STEP[d][0];
      const ny = y + STEP[d][1];
      if (nx >= 0 && ny >= 0 && nx < sx && ny < sy) out.push(ny * sx + nx);
    }
    return out;
  };
  const edge: number[] = [];
  for (let s = 0; s < sx * sy; s++) {
    const x = s % sx;
    const y = Math.floor(s / sx);
    if (x === 0 || y === 0 || x === sx - 1 || y === sy - 1) edge.push(s);
  }
  const entry = rng.pick(edge);
  const order = [entry];
  const adj = new Map<number, Set<number>>([[entry, new Set()]]);
  const free = (s: number) => near(s).filter((n) => !adj.has(n));
  let tip = entry;
  while (order.length < count) {
    let base = tip;
    if (free(base).length === 0 || rng.chance(V.branchChance)) {
      const open = order.filter((s) => free(s).length > 0);
      if (open.length === 0) return null;
      base = rng.pick(open);
    }
    const next = rng.pick(free(base));
    adj.set(next, new Set());
    link(adj, base, next);
    order.push(next);
    tip = next;
  }
  // Roles: the leaf nearest the middle of the stairs band holds the way down; the farthest
  // other leaves are the treasure rooms.
  const dist = new Map<number, number>([[entry, 0]]);
  const queue = [entry];
  for (let k = 0; k < queue.length; k++) {
    const s = queue[k]!;
    for (const n of adj.get(s)!) {
      if (dist.has(n)) continue;
      dist.set(n, dist.get(s)! + 1);
      queue.push(n);
    }
  }
  const far = Math.max(...dist.values());
  const leaves = order.slice(1).filter((s) => adj.get(s)!.size === 1);
  const treasureCount = rng.int(V.treasureRooms[0], V.treasureRooms[1]);
  if (leaves.length < 1 + V.treasureRooms[0]) return null;
  const mid = V.exitAim;
  const exitScore = (s: number) => Math.abs(dist.get(s)! / far - mid) + (dist.get(s)! >= 2 ? 0 : 9);
  const exit = [...leaves].sort((a, b) => exitScore(a) - exitScore(b) || a - b)[0]!;
  const roles = new Map<number, SlotRole>([
    [entry, 'entry'],
    [exit, boss ? 'boss' : 'exit'],
  ]);
  leaves
    .filter((s) => s !== exit)
    .sort((a, b) => dist.get(b)! - dist.get(a)! || a - b)
    .forEach((s, k) => roles.set(s, k < treasureCount || !boss ? 'treasure' : 'hub'));
  // Loops between ordinary slots only: a dead-end stays a dead-end.
  const plain = (s: number) => !roles.has(s) || roles.get(s) === 'entry';
  const pairs: Array<[number, number]> = [];
  for (const a of order)
    for (const b of near(a))
      if (a < b && adj.has(b) && !adj.get(a)!.has(b) && plain(a) && plain(b)) pairs.push([a, b]);
  const loops = rng.int(V.loops[0], V.loops[1]);
  for (let i = 0; i < loops && pairs.length > 0; i++) {
    const [a, b] = pairs.splice(rng.int(0, pairs.length - 1), 1)[0]!;
    link(adj, a, b);
  }
  const junctions = order.filter((s) => adj.get(s)!.size >= 3).length;
  return { order, adj, roles, junctions };
}

// ---------------------------------------------------------------- the floor

interface Placed {
  slot: number;
  t: Turned;
  x: number;
  y: number;
  role: SlotRole;
}

export function generateV3(seed: number, depth: number, opts: V3Options): Floor {
  const level = opts.level === 'kid' ? HOLLOW_R9D.kid.dims : V.levels[opts.level];
  const levelIndex = Object.keys(V.levels).indexOf(opts.level);
  const rng = Rng.fromSeed((seed * 31 + depth * 7919 + levelIndex * 104729 + 0x3c6ef372) >>> 0);
  const { cols, rows } = level;
  const S = DUNGEON.special;
  let special: SpecialFloor = 'none';
  if (depth >= S.minDepth && rng.chance(S.chance))
    special = rng.pick(['crystal', 'flooded', 'glowworm'] as const);

  const slot = V.slot;
  const sx = Math.floor((cols - 2 * V.margin) / slot);
  const sy = Math.floor((rows - 2 * V.margin) / slot);
  const roomCount = Math.min(sx * sy, rng.int(level.rooms[0], level.rooms[1]));
  // The walk: the first of a few tries with the junctions a floor needs (else the best one).
  let walk: Walk | null = null;
  for (let t = 0; t < 40; t++) {
    const w = growWalk(rng, sx, sy, roomCount, opts.boss);
    if (!w) continue;
    if (!walk || w.junctions > walk.junctions) walk = w;
    if (w.junctions >= 3) break;
  }
  if (!walk) throw new Error(`hollow v3: no walk for ${seed}:${depth}`);

  // Pieces, one per slot, turned so their sockets face the slot's links.
  const all = piecesFor(opts.tileset);
  const used = new Map<string, number>();
  const cells = new Uint8Array(cols * rows);
  const owner = new Int16Array(cols * rows).fill(-1);
  const dirTo = (a: number, b: number): Side => {
    const dx = (b % sx) - (a % sx);
    const dy = Math.floor(b / sx) - Math.floor(a / sx);
    return dx > 0 ? 'e' : dx < 0 ? 'w' : dy > 0 ? 's' : 'n';
  };
  const placed: Placed[] = [];
  const spawns: Cell[] = [];
  const shrines: Cell[] = [];
  const lootMarks: Array<{ cell: Cell; piece: number }> = [];
  const raised: Cell[] = [];
  let boss: Cell | null = null;
  let hubAuthored = false;
  for (const s of walk.order) {
    const need = new Set([...walk.adj.get(s)!].map((n) => dirTo(s, n)));
    let role: SlotRole =
      walk.roles.get(s) ?? (need.size >= 3 || !rng.chance(V.corridorChance) ? 'hub' : 'corridor');
    const fits = (tag: PieceTag, capped: boolean): Turned[] => {
      const out: Turned[] = [];
      for (const p of all) {
        if (!p.tags.includes(tag)) continue;
        if (capped && (used.get(p.id) ?? 0) >= V.maxRepeats) continue;
        for (let k = 0; k < 4; k++) {
          const t = turned(p, k);
          if (t.w > slot - 2 || t.h > slot - 2) continue;
          if ([...need].every((d) => t.sides.has(d))) out.push(t);
        }
      }
      return out;
    };
    const leaf = !opts.boss && (role === 'exit' || role === 'treasure');
    let options: Turned[] = [];
    // R0197: the story's own piece for this slot, turned to fit.
    const a = opts.authored;
    const wanted = !a
      ? undefined
      : role === 'entry'
        ? a.entry
        : role === 'exit' || role === 'boss'
          ? a.exit
          : (role === 'hub' || role === 'corridor') && !hubAuthored
            ? a.hub
            : undefined;
    const ap = wanted ? pieceById(wanted) : undefined;
    if (ap) {
      for (let k = 0; k < 4; k++) {
        const t = turned(ap, k);
        if (t.w <= slot - 2 && t.h <= slot - 2 && [...need].every((d) => t.sides.has(d)))
          options.push(t);
      }
      if (options.length && wanted === a?.hub) {
        hubAuthored = true;
        role = 'hub';
      }
    }
    if (options.length === 0) options = fits(leaf ? 'deadEnd' : role, true);
    if (leaf && options.length === 0) options = fits('deadEnd', false);
    if (options.length === 0 && (role === 'hub' || role === 'corridor')) {
      role = role === 'hub' ? 'corridor' : 'hub';
      options = fits(role, true);
    }
    if (options.length === 0) options = fits(role, false);
    if (options.length === 0) options = [...fits('hub', false), ...fits('corridor', false)];
    let roll = rng.next() * options.reduce((a, t) => a + t.piece.weight, 0);
    let t = options[options.length - 1]!;
    for (const o of options) {
      roll -= o.piece.weight;
      if (roll < 0) {
        t = o;
        break;
      }
    }
    used.set(t.piece.id, (used.get(t.piece.id) ?? 0) + 1);
    const slotX = V.margin + (s % sx) * slot;
    const slotY = V.margin + Math.floor(s / sx) * slot;
    const x = slotX + rng.int(1, Math.max(1, slot - 1 - t.w));
    const y = slotY + rng.int(1, Math.max(1, slot - 1 - t.h));
    const index = placed.length;
    placed.push({ slot: s, t, x, y, role });
    for (let py = 0; py < t.h; py++) {
      for (let px = 0; px < t.w; px++) {
        const ch = t.rows[py]![px]!;
        const i = (y + py) * cols + (x + px);
        const c = { x: x + px, y: y + py };
        owner[i] = index;
        const edgeSide: Side | null =
          py === 0 ? 'n' : py === t.h - 1 ? 's' : px === 0 ? 'w' : px === t.w - 1 ? 'e' : null;
        if (ch === '#' || (ch === 'D' && (!edgeSide || !need.has(edgeSide)))) {
          cells[i] = WALL;
          continue;
        }
        cells[i] = ch === '~' ? WATER : FLOOR;
        if (ch === 'S') spawns.push(c);
        else if (ch === 'X') shrines.push(c);
        else if (ch === 'B') boss = c;
        else if (ch === 'L') lootMarks.push({ cell: c, piece: index });
        else if (ch === '^') raised.push(c);
      }
    }
  }

  // Tunnels between linked sockets, through the gap the slots leave between pieces.
  const dug = new Uint8Array(cols * rows);
  const inner = (x: number, y: number) => x > 1 && y > 1 && x < cols - 2 && y < rows - 2;
  const dig = (x: number, y: number) => {
    if (!inner(x, y)) return;
    const i = y * cols + x;
    if (owner[i]! >= 0) return;
    dug[i] = 1;
  };
  const socketCells = (p: Placed, side: Side): Cell[] => {
    const out: Cell[] = [];
    const { t } = p;
    for (let py = 0; py < t.h; py++)
      for (let px = 0; px < t.w; px++) {
        const onSide =
          side === 'n'
            ? py === 0
            : side === 's'
              ? py === t.h - 1
              : side === 'w'
                ? px === 0
                : px === t.w - 1;
        if (onSide && t.rows[py]![px] === 'D') out.push({ x: p.x + px, y: p.y + py });
      }
    return out;
  };
  const bySlot = new Map(placed.map((p, i) => [p.slot, i]));
  const links: Array<[number, number]> = [];
  for (const s of walk.order) {
    for (const n of walk.adj.get(s)!) {
      if (n < s) continue;
      let a = placed[bySlot.get(s)!]!;
      let b = placed[bySlot.get(n)!]!;
      links.push([bySlot.get(s)!, bySlot.get(n)!]);
      let d = dirTo(s, n);
      if (d === 'w' || d === 'n') {
        [a, b] = [b, a];
        d = OPP[d];
      }
      const from = socketCells(a, d);
      const to = socketCells(b, OPP[d]);
      if (from.length === 0 || to.length === 0) continue;
      const width = rng.int(2, 3);
      if (d === 'e') {
        const xa = a.x + a.t.w;
        const xb = b.x - 1;
        const mx = rng.int(xa, Math.max(xa, xb - width + 1));
        for (const c of from) for (let x = xa; x < mx + width; x++) dig(x, c.y);
        for (const c of to) for (let x = mx; x <= xb; x++) dig(x, c.y);
        const ys = [...from, ...to].map((c) => c.y);
        for (let y = Math.min(...ys); y <= Math.max(...ys); y++)
          for (let x = mx; x < mx + width; x++) dig(x, y);
      } else {
        const ya = a.y + a.t.h;
        const yb = b.y - 1;
        const my = rng.int(ya, Math.max(ya, yb - width + 1));
        for (const c of from) for (let y = ya; y < my + width; y++) dig(c.x, y);
        for (const c of to) for (let y = my; y <= yb; y++) dig(c.x, y);
        const xs = [...from, ...to].map((c) => c.x);
        for (let x = Math.min(...xs); x <= Math.max(...xs); x++)
          for (let y = my; y < my + width; y++) dig(x, y);
      }
    }
  }

  // Cave rock between the pieces: cellular automata, never inside a piece and never touching
  // a tunnel or a piece, so each pocket joins the cave by one tunnel of its own below. A
  // pocket is a side cave to explore, never a shortcut that skips the walk between pieces.
  const kept = new Uint8Array(cols * rows);
  for (let y = 0; y < rows; y++)
    for (let x = 0; x < cols; x++) {
      if (!inner(x, y)) {
        kept[y * cols + x] = 1;
        continue;
      }
      for (let dy = -1; dy <= 1 && !kept[y * cols + x]; dy++)
        for (let dx = -1; dx <= 1; dx++) {
          const j = (y + dy) * cols + (x + dx);
          if (dug[j] || (owner[j]! >= 0 && cells[j] !== WALL)) {
            kept[y * cols + x] = 1;
            break;
          }
        }
    }
  let ca = new Uint8Array(cols * rows);
  for (let y = 0; y < rows; y++)
    for (let x = 0; x < cols; x++) {
      const i = y * cols + x;
      ca[i] = !kept[i] && rng.chance(level.caFill) ? 1 : 0;
    }
  for (let pass = 0; pass < V.caPasses; pass++) {
    const next = new Uint8Array(ca);
    for (let y = 2; y < rows - 2; y++)
      for (let x = 2; x < cols - 2; x++) {
        const i = y * cols + x;
        if (kept[i]) continue;
        // R0205: the eight neighbours summed straight (cells are 0 or 1), same count.
        const up = i - cols;
        const dn = i + cols;
        const n =
          ca[up - 1]! +
          ca[up]! +
          ca[up + 1]! +
          ca[i - 1]! +
          ca[i + 1]! +
          ca[dn - 1]! +
          ca[dn]! +
          ca[dn + 1]!;
        next[i] = ca[i] ? (n >= 4 ? 1 : 0) : n >= 5 ? 1 : 0;
      }
    ca = next;
  }
  for (let i = 0; i < cells.length; i++)
    if (owner[i]! < 0) cells[i] = dug[i] || ca[i] ? FLOOR : WALL;

  // The stairs up in the entry piece; every pocket of open rock joins the cave or is filled.
  const middleOf = (p: Placed): Cell => {
    const cx = p.x + (p.t.w - 1) / 2;
    const cy = p.y + (p.t.h - 1) / 2;
    let best: Cell = { x: p.x + 1, y: p.y + 1 };
    let bestD = Infinity;
    for (let y = p.y; y < p.y + p.t.h; y++)
      for (let x = p.x; x < p.x + p.t.w; x++) {
        if (cells[y * cols + x] !== FLOOR) continue;
        const d = (x - cx) ** 2 + (y - cy) ** 2;
        if (d < bestD) {
          bestD = d;
          best = { x, y };
        }
      }
    return best;
  };
  const start = middleOf(placed[0]!);
  const startI = start.y * cols + start.x;
  const comp = new Int32Array(cols * rows).fill(-1);
  const flood = (from: number, id: number): number[] => {
    const out = [from];
    comp[from] = id;
    for (let k = 0; k < out.length; k++) {
      const i = out[k]!;
      const x = i % cols;
      const y = (i - x) / cols;
      for (let s4 = 0; s4 < 4; s4++) {
        const dx = DX4[s4]!;
        const dy = DY4[s4]!;
        const nx = x + dx;
        const ny = y + dy;
        if (nx < 0 || ny < 0 || nx >= cols || ny >= rows) continue;
        const j = ny * cols + nx;
        if (cells[j] === WALL || comp[j]! >= 0) continue;
        comp[j] = id;
        out.push(j);
      }
    }
    return out;
  };
  flood(startI, 0);
  let nextId = 1;
  const from = new Int32Array(cols * rows);
  const seenAt = new Int32Array(cols * rows);
  let stamp = 0;
  // Lane B r8 (R0182): each side cave and the tunnel dug to it, the secret rooms' candidates.
  const caves: number[][] = [];
  for (let i = 0; i < cells.length; i++) {
    if (cells[i] === WALL || comp[i]! >= 0) continue;
    const pocket = flood(i, nextId++);
    if (pocket.length < V.minPocket && !pocket.some((j) => owner[j]! >= 0)) {
      for (const j of pocket) {
        cells[j] = WALL;
        comp[j] = -1;
      }
      continue;
    }
    // Tunnel from the pocket to the nearest open cell already joined, around the pieces.
    // One search buffer for every pocket: `seenAt` marks what this pocket's search touched.
    stamp++;
    const queue: number[] = [];
    for (const j of pocket) {
      seenAt[j] = stamp;
      from[j] = -1;
      queue.push(j);
    }
    let hit = -1;
    for (let k = 0; k < queue.length && hit < 0; k++) {
      const j = queue[k]!;
      const x = j % cols;
      const y = (j - x) / cols;
      for (let s4 = 0; s4 < 4; s4++) {
        const dx = DX4[s4]!;
        const dy = DY4[s4]!;
        const nx = x + dx;
        const ny = y + dy;
        if (!inner(nx, ny)) continue;
        const n = ny * cols + nx;
        if (seenAt[n] === stamp) continue;
        seenAt[n] = stamp;
        if (cells[n] !== WALL && comp[n] === 0) {
          from[n] = j;
          hit = n;
          break;
        }
        if (owner[n]! >= 0) continue;
        from[n] = j;
        queue.push(n);
      }
    }
    if (hit < 0) {
      for (const j of pocket) {
        cells[j] = WALL;
        comp[j] = -1;
      }
      continue;
    }
    const cave = pocket.some((j) => owner[j]! >= 0) ? null : [...pocket];
    for (let j = from[hit]!; j >= 0 && from[j] !== -1; j = from[j]!) {
      const x = j % cols;
      const y = (j - x) / cols;
      for (let w = 0; w < V.tunnelWidth; w++) {
        const tx = x + (w % 2);
        const ty = y + (w >> 1);
        const t = ty * cols + tx;
        if (!inner(tx, ty) || owner[t]! >= 0) continue;
        if (cells[t] === WALL) {
          cells[t] = FLOOR;
          cave?.push(t);
        }
        // Claimed even where it crossed another pocket, so that pocket is never filled
        // in under the tunnel.
        comp[t] = 0;
      }
    }
    // The pocket now belongs to the cave.
    for (const j of pocket) comp[j] = 0;
    if (cave) caves.push(cave);
  }
  for (let i = 0; i < cells.length; i++) if (cells[i] !== WALL && comp[i] !== 0) cells[i] = WALL;

  // The way down: the dead-end whose walk from the stairs up is nearest the stairs band
  // (rock shortcuts make the slot walk a poor guess); the farthest others hold treasure.
  // "Farthest" is the farthest room: the side caves wind on well past every room.
  // An authored exit stays where the walk put it (R0197).
  if (!opts.boss && !opts.authored?.exit) {
    const d = new Int32Array(cols * rows).fill(-1);
    const q = [startI];
    d[startI] = 0;
    for (let k = 0; k < q.length; k++) {
      const i = q[k]!;
      const x = i % cols;
      const y = (i - x) / cols;
      for (let s4 = 0; s4 < 4; s4++) {
        const dx = DX4[s4]!;
        const dy = DY4[s4]!;
        const j = (y + dy) * cols + (x + dx);
        if (cells[j] === WALL || d[j]! >= 0) continue;
        d[j] = d[i]! + 1;
        q.push(j);
      }
    }
    const leaves = placed
      .map((p, i) => i)
      .filter((i) => placed[i]!.role === 'exit' || placed[i]!.role === 'treasure');
    const walkTo = (i: number) => {
      const c = middleOf(placed[i]!);
      return d[c.y * cols + c.x]!;
    };
    const far = Math.max(1, ...placed.map((_, i) => walkTo(i)));
    const share = (i: number) => {
      return walkTo(i) / far;
    };
    // Inside the band is best; past it is better than short of it (a dash for the stairs
    // should never skip most of the floor).
    const [lo, hi] = V.stairsBand;
    const miss = (i: number) => {
      const s = share(i);
      return s < lo ? (lo - s) * 3 : s > hi ? s - hi : 0;
    };
    const exit = [...leaves].sort((a, b) => miss(a) - miss(b) || a - b)[0];
    const treasureCount = rng.int(V.treasureRooms[0], V.treasureRooms[1]);
    const rest = leaves.filter((i) => i !== exit).sort((a, b) => share(b) - share(a) || a - b);
    if (exit !== undefined) placed[exit]!.role = 'exit';
    rest.forEach((i, k) => (placed[i]!.role = k < treasureCount ? 'treasure' : 'hub'));
  }

  // Rooms in walk order for the dressing: the entry first, the biggest room holds the
  // landmark, the first treasure room keeps the chest's nook.
  const kindOf = (p: Placed): RoomKind => (p.t.w * p.t.h >= 64 ? 'medium' : 'small');
  const rooms: Room[] = placed.map((p) => ({
    x: p.x,
    y: p.y,
    w: p.t.w,
    h: p.t.h,
    kind: kindOf(p),
  }));
  const hubs = placed.map((_, i) => i).filter((i) => placed[i]!.role === 'hub');
  const pool = hubs.length > 0 ? hubs : placed.map((_, i) => i).filter((i) => i > 0);
  const greatRoom = pool.reduce((a, b) =>
    rooms[b]!.w * rooms[b]!.h > rooms[a]!.w * rooms[a]!.h ? b : a,
  );
  rooms[greatRoom]!.kind = 'great';
  const great = rooms[greatRoom]!;
  const treasure = placed.map((_, i) => i).filter((i) => placed[i]!.role === 'treasure');
  const nookIndex = treasure[0] ?? placed.length - 1;
  const nr = rooms[nookIndex]!;
  const nookRoom: Room = { x: nr.x + 1, y: nr.y + 1, w: nr.w - 2, h: nr.h - 2, kind: nr.kind };
  const mediums = rooms.filter(
    (r, i) => r.kind === 'medium' && placed[i]!.role === 'hub' && i !== greatRoom,
  );
  const exitIndex = placed.findIndex((p) => p.role === 'exit' || p.role === 'boss');
  const stairsDown = exitIndex >= 0 ? middleOf(placed[exitIndex]!) : null;

  const lootTarget = rng.int(level.poi[0], level.poi[1]);
  const treasureMarks = lootMarks.filter((m) => placed[m.piece]!.role === 'treasure');
  const floor = dressFloor({
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
    version: 3,
    stairsDown,
    counts: {
      loot: Math.max(8, lootTarget - treasureMarks.length - 1),
      strays: Math.min(
        DUNGEON.straysMax,
        Math.round(DUNGEON.straysBase + DUNGEON.straysPerDepth * (depth - 1)),
      ),
    },
    raised,
    // Most finds lie in the rooms and tunnels; the side caves keep a share (R0143).
    findsAt: (c) => {
      const i = c.y * cols + c.x;
      return owner[i]! >= 0 || dug[i] === 1 || hash2(c.x, c.y, seed ^ 13) < V.caveFinds;
    },
  });

  // The nook is the treasure room the dressing was handed shrunk to its inside.
  if (floor.nook) floor.nook.room = nookIndex;

  // The treasure rooms' own finds, on their marks.
  const taken = new Set(
    [floor.chest, ...(floor.nook?.rug ?? []), ...floor.loot.map((l) => l.cell)].map(
      (c) => `${c.x},${c.y}`,
    ),
  );
  treasureMarks.forEach((m, i) => {
    if (taken.has(`${m.cell.x},${m.cell.y}`) || floor.cells[m.cell.y * cols + m.cell.x] !== FLOOR)
      return;
    const roll = rng.next();
    const kind: DungeonLootKind =
      roll < 0.5 ? 'shells' : roll < 0.75 ? 'essence' : roll < 0.9 ? 'stone' : 'critter';
    floor.loot.push({
      id: `loot-t${i}`,
      kind,
      cell: m.cell,
      amount: kind === 'shells' ? rng.int(10, 16) + depth * 2 : kind === 'stone' ? 2 : 1,
      param:
        kind === 'essence'
          ? rng.pick(NUBBIN_TYPES)
          : kind === 'critter'
            ? rng.pick(CRITTER_SPECIES).id
            : null,
    });
  });

  const layout: FloorLayout = {
    level: opts.level,
    tileset: opts.tileset,
    pieces: placed.map((p): PlacedPiece => ({
      id: p.t.piece.id,
      role: p.role,
      at: { x: p.x, y: p.y },
      size: [p.t.w, p.t.h],
      turns: p.t.turns,
    })),
    links,
    junctions: walk.junctions,
    spawns: spawns.filter((c) => floor.cells[c.y * cols + c.x] === FLOOR),
    shrines: shrines.filter((c) => floor.cells[c.y * cols + c.x] === FLOOR),
    // The dressing can pool water over the boss's mark: it stands on the nearest dry cell.
    boss: boss ? dryNear(floor, boss) : null,
  };
  floor.layout = layout;
  SIDE_CAVES.set(floor, caves);
  floor.packs = placePacks(floor, rng, depth, rng.int(level.packs[0], level.packs[1]));
  if (opts.boss) {
    const at = layout.boss ?? floor.stairsDown;
    if (at) floor.packs.push(bossPack(floor, rng, depth, at));
  }
  return floor;
}
