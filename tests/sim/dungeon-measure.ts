import { DUNGEON } from '../../src/config/tuning';
import { WALL, type Cell, type Floor } from '../../src/sim/dungeon';

/**
 * Floor measurements shared by the generator tests (R0143): walk distances by BFS over
 * walkable cells, and the nearest-neighbour full-clear tour the 2026-10-27 review used
 * (stairs up → every loot spot → the chest → stairs down), in world units.
 */
export function bfs(f: Floor, from: Cell): Int32Array {
  const d = new Int32Array(f.cols * f.rows).fill(-1);
  const q = [from.y * f.cols + from.x];
  d[q[0]!] = 0;
  for (let k = 0; k < q.length; k++) {
    const i = q[k]!;
    const x = i % f.cols;
    const y = (i - x) / f.cols;
    for (const [dx, dy] of [
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1],
    ] as const) {
      const nx = x + dx;
      const ny = y + dy;
      if (nx < 0 || ny < 0 || nx >= f.cols || ny >= f.rows) continue;
      const j = ny * f.cols + nx;
      if (f.cells[j] === WALL || d[j]! >= 0) continue;
      d[j] = d[i]! + 1;
      q.push(j);
    }
  }
  return d;
}

export interface FloorStats {
  walkable: number;
  rooms: number;
  pois: number;
  /** Full-clear tour, world units. */
  tour: number;
  /** Up→down walk over the walk to the farthest room (its middle) from the stairs up. */
  stairsShare: number;
  connected: boolean;
}

export function measure(f: Floor): FloorStats {
  const at = (c: Cell) => c.y * f.cols + c.x;
  const fromUp = bfs(f, f.stairsUp);
  let walkable = 0;
  let far = 0;
  let connected = true;
  for (let i = 0; i < f.cells.length; i++) {
    if (f.cells[i] === WALL) continue;
    walkable++;
    if (fromUp[i]! < 0) connected = false;
  }
  for (const r of f.rooms) {
    const c = { x: Math.floor(r.x + r.w / 2), y: Math.floor(r.y + r.h / 2) };
    far = Math.max(far, fromUp[at(c)]!);
  }
  const stops = [...f.loot.map((l) => l.cell), f.chest];
  let here = f.stairsUp;
  let tour = 0;
  const left = [...stops];
  while (left.length) {
    const d = bfs(f, here);
    let best = 0;
    for (let i = 1; i < left.length; i++) if (d[at(left[i]!)]! < d[at(left[best]!)]!) best = i;
    tour += Math.max(0, d[at(left[best]!)]!);
    here = left.splice(best, 1)[0]!;
  }
  if (f.stairsDown) tour += Math.max(0, bfs(f, here)[at(f.stairsDown)]!);
  return {
    walkable,
    rooms: f.rooms.length,
    pois: f.loot.length + 1,
    tour: tour * DUNGEON.cell,
    stairsShare: f.stairsDown ? fromUp[at(f.stairsDown)]! / far : 0,
    connected,
  };
}
