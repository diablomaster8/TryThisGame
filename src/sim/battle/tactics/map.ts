/**
 * Tactics maps (recs FIGHT-50): a small grid of tile kinds and heights 0..4 with a deploy zone
 * per side. `mapFromFloor` crops one Hollow room out of a generated floor, so every floor is
 * free map content; `mapFromRows` builds one from ASCII rows for tests and story battles. A
 * map travels in the state as base64 strings (`encodeMap`/`decodeMap`), so the state stays JSON.
 */
import { TACTICS } from '../../../config/tuning-tactics';
import type { Floor } from '../../dungeon';
import type { Rng } from '../../rng';
import { TILE, type Cell, type GridMap, type SerialMap, type TileKind } from './types';

const M = TACTICS.map;
const B64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

/** Base64 without the DOM's `btoa`, so the sim stays pure. */
export function toB64(bytes: Uint8Array): string {
  let out = '';
  for (let i = 0; i < bytes.length; i += 3) {
    const n = (bytes[i]! << 16) | ((bytes[i + 1] ?? 0) << 8) | (bytes[i + 2] ?? 0);
    out += B64[(n >> 18) & 63]! + B64[(n >> 12) & 63]!;
    out += i + 1 < bytes.length ? B64[(n >> 6) & 63]! : '=';
    out += i + 2 < bytes.length ? B64[n & 63]! : '=';
  }
  return out;
}

export function fromB64(s: string): Uint8Array {
  const clean = s.replace(/=+$/, '');
  const out = new Uint8Array(Math.floor((clean.length * 3) / 4));
  let o = 0;
  for (let i = 0; i < clean.length; i += 4) {
    const n =
      (B64.indexOf(clean[i]!) << 18) |
      (B64.indexOf(clean[i + 1] ?? 'A') << 12) |
      (Math.max(0, B64.indexOf(clean[i + 2] ?? 'A')) << 6) |
      Math.max(0, B64.indexOf(clean[i + 3] ?? 'A'));
    if (o < out.length) out[o++] = (n >> 16) & 255;
    if (o < out.length) out[o++] = (n >> 8) & 255;
    if (o < out.length) out[o++] = n & 255;
  }
  return out;
}

export function encodeMap(m: GridMap): SerialMap {
  return { w: m.w, h: m.h, tiles: toB64(m.tiles), height: toB64(m.height), deploy: m.deploy };
}

const decoded = new Map<string, GridMap>();

/** Decodes a serial map; the last few are cached by content, since every action reads one. */
export function decodeMap(s: SerialMap): GridMap {
  const key = `${s.w}x${s.h}:${s.tiles}:${s.height}`;
  const hit = decoded.get(key);
  if (hit) return hit;
  const m: GridMap = {
    w: s.w,
    h: s.h,
    tiles: fromB64(s.tiles),
    height: fromB64(s.height),
    deploy: s.deploy,
  };
  if (decoded.size > 16) decoded.clear();
  decoded.set(key, m);
  return m;
}

export const inside = (m: GridMap, x: number, y: number): boolean =>
  x >= 0 && y >= 0 && x < m.w && y < m.h;
export const ix = (m: GridMap, x: number, y: number): number => y * m.w + x;
export const tileAt = (m: GridMap, x: number, y: number): TileKind =>
  (inside(m, x, y) ? m.tiles[ix(m, x, y)]! : TILE.wall) as TileKind;
export const heightAt = (m: GridMap, x: number, y: number): number =>
  inside(m, x, y) ? m.height[ix(m, x, y)]! : 0;

/** Nobody stands on a wall, a tree or a lantern post. */
export function blocks(t: number): boolean {
  return t === TILE.wall || t === TILE.tree || t === TILE.lantern;
}

export const N4: readonly Cell[] = [
  { x: 0, y: -1 },
  { x: 1, y: 0 },
  { x: 0, y: 1 },
  { x: -1, y: 0 },
];

const ASCII: Record<string, TileKind> = {
  '.': TILE.grass,
  '#': TILE.wall,
  '~': TILE.deep,
  ',': TILE.shallow,
  '*': TILE.crystal,
  L: TILE.lantern,
  '"': TILE.tall,
  '=': TILE.path,
  m: TILE.mud,
  s: TILE.shade,
  T: TILE.tree,
  p: TILE.plot,
  X: TILE.exit,
};

/**
 * A map from ASCII rows (`.` grass, `#` wall, `~` deep, `,` shallow, `*` crystal, `L` lantern,
 * `"` tall grass, `=` path, `m` mud, `s` shade, `T` tree, `p` plot, `X` exit) and optional
 * digit rows of heights. Deploy zones default to the first and last walkable columns.
 */
export function mapFromRows(
  rows: readonly string[],
  heights?: readonly string[],
  deploy?: { a: Cell[]; b: Cell[] },
): GridMap {
  const h = rows.length;
  const w = rows[0]!.length;
  const tiles = new Uint8Array(w * h);
  const height = new Uint8Array(w * h);
  for (let y = 0; y < h; y++)
    for (let x = 0; x < w; x++) {
      tiles[y * w + x] = ASCII[rows[y]![x]!] ?? TILE.grass;
      height[y * w + x] = Number(heights?.[y]?.[x] ?? 0) || 0;
    }
  const m: GridMap = { w, h, tiles, height, deploy: deploy ?? { a: [], b: [] } };
  if (!deploy) m.deploy = defaultDeploy(m);
  return m;
}

/** A tile a walker with no special skills can stand on and cross. */
export function plainWalkable(m: GridMap, x: number, y: number): boolean {
  const t = tileAt(m, x, y);
  return inside(m, x, y) && !blocks(t) && t !== TILE.deep;
}

/** The westmost and eastmost plain walkable tiles nearest the middle row: a deploy zone each. */
export function defaultDeploy(m: GridMap, n: number = M.deploy): { a: Cell[]; b: Cell[] } {
  const cells: Cell[] = [];
  for (let y = 0; y < m.h; y++)
    for (let x = 0; x < m.w; x++) if (plainWalkable(m, x, y)) cells.push({ x, y });
  const mid = (m.h - 1) / 2;
  const by = (west: boolean) =>
    [...cells]
      .sort(
        (p, q) =>
          (west ? p.x - q.x : q.x - p.x) * 100 + (Math.abs(p.y - mid) - Math.abs(q.y - mid)),
      )
      .slice(0, n);
  return { a: by(true), b: by(false) };
}

/**
 * Whether every deploy tile reaches every other for a plain walker with `jump` (no deep
 * water, |Δheight| ≤ jump per step). Checked once from one tile: reachability is symmetric.
 */
export function deployConnected(m: GridMap, jump = 1): boolean {
  const all = [...m.deploy.a, ...m.deploy.b];
  if (!all.length) return false;
  const seen = flood(m, all[0]!, jump);
  return all.every((c) => seen[ix(m, c.x, c.y)] === 1);
}

function flood(m: GridMap, from: Cell, jump: number): Uint8Array {
  const seen = new Uint8Array(m.w * m.h);
  if (!plainWalkable(m, from.x, from.y)) return seen;
  const q: number[] = [ix(m, from.x, from.y)];
  seen[q[0]!] = 1;
  while (q.length) {
    const i = q.pop()!;
    const x = i % m.w;
    const y = (i - x) / m.w;
    for (const d of N4) {
      const nx = x + d.x;
      const ny = y + d.y;
      if (!plainWalkable(m, nx, ny)) continue;
      const j = ix(m, nx, ny);
      if (seen[j] || Math.abs(m.height[j]! - m.height[i]!) > jump) continue;
      seen[j] = 1;
      q.push(j);
    }
  }
  return seen;
}

/** Lowers the higher of any two walkable neighbours more than one level apart, until none are. */
function smooth(m: GridMap): void {
  for (let pass = 0; pass < 64; pass++) {
    let changed = false;
    for (let y = 0; y < m.h; y++)
      for (let x = 0; x < m.w; x++) {
        if (!plainWalkable(m, x, y)) continue;
        const i = ix(m, x, y);
        for (const d of N4) {
          if (!plainWalkable(m, x + d.x, y + d.y)) continue;
          const j = ix(m, x + d.x, y + d.y);
          if (m.height[i]! - m.height[j]! > 1) {
            m.height[i] = m.height[j]! + 1;
            changed = true;
          }
        }
      }
    if (!changed) return;
  }
}

/**
 * Carves a walkable lane between the two deploy zones when the room split them (a wall
 * spur, a pool): an L-shaped run of grass, each step at most one level from the last.
 */
function carve(m: GridMap): void {
  const a = m.deploy.a[0]!;
  const b = m.deploy.b[0]!;
  let x = a.x;
  let y = a.y;
  let prev = m.height[ix(m, x, y)]!;
  const visit = () => {
    const i = ix(m, x, y);
    if (!plainWalkable(m, x, y)) m.tiles[i] = TILE.grass;
    const h = m.height[i]!;
    if (Math.abs(h - prev) > 1) m.height[i] = h > prev ? prev + 1 : prev - 1;
    prev = m.height[i]!;
  };
  while (x !== b.x) {
    x += Math.sign(b.x - x);
    visit();
  }
  while (y !== b.y) {
    y += Math.sign(b.y - y);
    visit();
  }
  // Every deploy tile joins the lane: walk it to the lane's row, then smooth the whole map.
  for (const c of [...m.deploy.a, ...m.deploy.b]) {
    x = c.x;
    y = c.y;
    prev = m.height[ix(m, x, y)]!;
    while (y !== a.y) {
      y += Math.sign(a.y - y);
      visit();
    }
  }
  smooth(m);
}

/**
 * Crops the room nearest `near` (the party) out of a Hollow floor (FIGHT-50): between
 * `TACTICS.map.min` and `max` tiles a side, centred on the room. Walls stay walls, chasms
 * become walls, water becomes deep (shallow where it touches dry ground), crystals crystal
 * tiles and torches lantern posts. Height is the floor's elevation in steps plus seeded bumps,
 * smoothed so no two walkable neighbours differ by more than one level, and a lane is carved
 * if the room left the deploy zones apart.
 */
export function mapFromFloor(
  floor: Floor,
  near: Cell,
  rng: Rng,
  max: number = M.maxDesk,
  step = 0.5,
): GridMap {
  let room = floor.rooms[0];
  let best = Infinity;
  for (const r of floor.rooms) {
    const d = Math.hypot(r.x + r.w / 2 - near.x, r.y + r.h / 2 - near.y);
    if (d < best) {
      best = d;
      room = r;
    }
  }
  const cx = room ? Math.floor(room.x + room.w / 2) : Math.floor(floor.cols / 2);
  const cy = room ? Math.floor(room.y + room.h / 2) : Math.floor(floor.rows / 2);
  const side = (n: number) => Math.max(M.min, Math.min(max, n + 2));
  const w = Math.min(floor.cols, side(room?.w ?? M.min));
  const h = Math.min(floor.rows, side(room?.h ?? M.min));
  const x0 = Math.max(0, Math.min(floor.cols - w, cx - Math.floor(w / 2)));
  const y0 = Math.max(0, Math.min(floor.rows - h, cy - Math.floor(h / 2)));
  const torches = new Set(floor.torches.map((c) => `${c.x},${c.y}`));
  const crystals = new Set(floor.crystals.map((c) => `${c.x},${c.y}`));
  const tiles = new Uint8Array(w * h);
  const height = new Uint8Array(w * h);
  const cellAt = (x: number, y: number) =>
    x < 0 || y < 0 || x >= floor.cols || y >= floor.rows ? 0 : floor.cells[y * floor.cols + x]!;
  for (let y = 0; y < h; y++)
    for (let x = 0; x < w; x++) {
      const fx = x0 + x;
      const fy = y0 + y;
      const c = cellAt(fx, fy);
      const key = `${fx},${fy}`;
      const elev = floor.elevation[fy * floor.cols + fx] ?? 0;
      let lv = Math.max(0, Math.round(elev / step));
      let t: number = TILE.grass;
      if (c === 0 || c === 3) t = torches.has(key) ? TILE.lantern : TILE.wall;
      else if (c === 2) {
        const dry = N4.some((d) => cellAt(fx + d.x, fy + d.y) === 1);
        t = dry ? TILE.shallow : TILE.deep;
        lv = 0;
      } else if (crystals.has(key)) t = TILE.crystal;
      if (t === TILE.grass && rng.chance(M.bump)) lv += 1;
      tiles[y * w + x] = t;
      height[y * w + x] = Math.min(M.maxHeight, lv);
    }
  const m: GridMap = { w, h, tiles, height, deploy: { a: [], b: [] } };
  smooth(m);
  // A wall's height is its top: two levels over the highest walkable neighbour.
  for (let y = 0; y < h; y++)
    for (let x = 0; x < w; x++) {
      if (!blocks(tiles[y * w + x]!)) continue;
      let top = 0;
      for (const d of N4)
        if (plainWalkable(m, x + d.x, y + d.y)) top = Math.max(top, heightAt(m, x + d.x, y + d.y));
      height[y * w + x] = Math.min(M.maxHeight, top + 2);
    }
  m.deploy = defaultDeploy(m);
  if (m.deploy.a.length < M.deploy || m.deploy.b.length < M.deploy) {
    // A room too cramped to deploy in: open the middle row from wall to wall.
    for (let x = 0; x < w; x++) {
      const i = Math.floor(h / 2) * w + x;
      tiles[i] = TILE.grass;
      height[i] = 0;
    }
    m.deploy = defaultDeploy(m);
  }
  if (!deployConnected(m)) carve(m);
  return m;
}
