/**
 * A tactics board cut from a Hollow floor (R0195, DUNG-52). `arenaFor` takes a window of
 * cells around a pack (9×7 by default) and hands the fight side its walls, floor and water,
 * the terrace height of each cell in steps, the props that block a cell, and a spawn side
 * for the party and one for the foes. It promises the board is at least 60% walkable and
 * that both sides can reach each other: it slides the window a few cells to find one that
 * is, and only if none is opens up rock from the middle outward. FIGHT owns the movement
 * and height rules; this only describes the ground. Pure sim: no DOM.
 */
import { HOLLOW_R7 } from '../config/tuning-dungeon';
import { cellOf, FLOOR, WALL, WATER, type Cell, type Floor } from './dungeon';
import { floorProps } from './dungeon-props';

const A = HOLLOW_R7.arena;

export interface HollowArena {
  x0: number;
  y0: number;
  w: number;
  h: number;
  /** Row-major WALL, FLOOR or WATER (chasm and outside the floor read as WALL). */
  cells: number[];
  /** Row-major terrace height in steps, 0 to 2, above the board's lowest walkable cell. */
  height: number[];
  /** Board indexes a prop (crystal, torch stand, mushroom) stands on. */
  props: number[];
  /** Board indexes the party starts on (the left columns) and the foes (the right). */
  spawnSides: { party: number[]; foe: number[] };
}

function cut(f: Floor, x0: number, y0: number, w: number, h: number): HollowArena {
  const cells: number[] = [];
  const raw: number[] = [];
  for (let y = y0; y < y0 + h; y++)
    for (let x = x0; x < x0 + w; x++) {
      const inside = x >= 0 && y >= 0 && x < f.cols && y < f.rows;
      const c = inside ? f.cells[y * f.cols + x]! : WALL;
      cells.push(c === FLOOR || c === WATER ? c : WALL);
      raw.push(inside ? f.elevation[y * f.cols + x]! : 0);
    }
  const props: number[] = [];
  for (const p of floorProps(f)) {
    const c = cellOf(f, { x: p.x, z: p.z });
    const i = (c.y - y0) * w + (c.x - x0);
    if (c.x >= x0 && c.y >= y0 && c.x < x0 + w && c.y < y0 + h && !props.includes(i)) props.push(i);
  }
  const low = Math.min(...raw.filter((_, i) => cells[i] === FLOOR), Infinity);
  const base = Number.isFinite(low) ? low : 0;
  const height = raw.map((e, i) =>
    cells[i] === WALL ? 0 : Math.max(0, Math.min(2, Math.round((e - base) / A.heightStep))),
  );
  return { x0, y0, w, h, cells, height, props, spawnSides: { party: [], foe: [] } };
}

function standable(a: HollowArena, i: number): boolean {
  return a.cells[i] === FLOOR && !a.props.includes(i);
}

/** Board cells reachable on foot (FLOOR without props) from `from`, four ways. */
function reach(a: HollowArena, from: number): Set<number> {
  const seen = new Set<number>([from]);
  const todo = [from];
  while (todo.length) {
    const i = todo.pop()!;
    const x = i % a.w;
    const y = Math.floor(i / a.w);
    for (const [dx, dy] of [
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1],
    ] as const) {
      const nx = x + dx;
      const ny = y + dy;
      if (nx < 0 || ny < 0 || nx >= a.w || ny >= a.h) continue;
      const j = ny * a.w + nx;
      if (!seen.has(j) && standable(a, j)) {
        seen.add(j);
        todo.push(j);
      }
    }
  }
  return seen;
}

/** Fill in the spawn sides; true when the board meets the walkable and reach promises. */
function settle(a: HollowArena): boolean {
  const n = a.w * a.h;
  let walk = 0;
  for (let i = 0; i < n; i++) if (a.cells[i] !== WALL && !a.props.includes(i)) walk++;
  if (walk < n * A.minWalkable) return false;
  // The biggest connected patch is the field; each side is its cells in the outer columns.
  let best = new Set<number>();
  for (let i = 0; i < n; i++)
    if (standable(a, i) && !best.has(i)) {
      const r = reach(a, i);
      if (r.size > best.size) best = r;
    }
  const side = (cols: (x: number) => boolean): number[] =>
    [...best].filter((i) => cols(i % a.w)).sort((p, q) => p - q);
  for (let span = A.sideCols; span <= Math.floor(a.w / 2); span++) {
    const party = side((x) => x < span);
    const foe = side((x) => x >= a.w - span);
    if (party.length >= A.minSide && foe.length >= A.minSide) {
      a.spawnSides = { party, foe };
      return true;
    }
  }
  return false;
}

/**
 * The tactics board around `centre`. Slides the window up to `A.slide` cells to find one
 * that keeps the promises; failing that, opens rock from the middle until it does.
 */
export function arenaFor(f: Floor, centre: Cell, w = 9, h = 7): HollowArena {
  const hx = Math.floor(w / 2);
  const hy = Math.floor(h / 2);
  const tries: Array<[number, number]> = [[0, 0]];
  for (let r = 1; r <= A.slide; r++)
    for (let dy = -r; dy <= r; dy++)
      for (let dx = -r; dx <= r; dx++)
        if (Math.max(Math.abs(dx), Math.abs(dy)) === r) tries.push([dx, dy]);
  for (const [dx, dy] of tries) {
    const a = cut(f, centre.x - hx + dx, centre.y - hy + dy, w, h);
    if (settle(a)) return a;
  }
  // Nothing nearby will do: clear rock, nearest the middle first, until it is a field.
  const a = cut(f, centre.x - hx, centre.y - hy, w, h);
  const order = a.cells
    .map((_, i) => i)
    .filter((i) => a.cells[i] === WALL)
    .sort(
      (p, q) =>
        Math.hypot((p % w) - hx, Math.floor(p / w) - hy) -
        Math.hypot((q % w) - hx, Math.floor(q / w) - hy),
    );
  for (const i of order) {
    a.cells[i] = FLOOR;
    a.height[i] = 0;
    if (settle(a)) return a;
  }
  settle(a);
  return a;
}
