import { WALL, type Cell, type Floor } from './dungeon';
import { DUNGEON } from '../config/tuning';

/**
 * R0143: a floor's full-clear walking tour in world units, the way the review measured it
 * (and `tests/sim/dungeon-measure.ts` does): from the stairs up to the nearest unvisited
 * find or the chest, again and again (the first listed wins a tie), then to the stairs down.
 * Each leg is a breadth-first search over walkable cells that stops once the nearest stop's
 * ring is labelled; scratch arrays are kept between calls.
 */
let dist = new Int32Array(0);
let queue = new Int32Array(0);
let stops = new Uint8Array(0);

/** Search from `from` until a cell with a stop is reached; its distance, or -1 if none. */
function leg(f: Floor, from: number): number {
  const n = f.cols * f.rows;
  const cols = f.cols;
  const cells = f.cells;
  dist.fill(-1, 0, n);
  let head = 0;
  let tail = 0;
  queue[tail++] = from;
  dist[from] = 0;
  while (head < tail) {
    const i = queue[head++]!;
    // Every cell one step nearer is labelled before this one is taken off the queue.
    if (stops[i]! > 0) return dist[i]!;
    const d = dist[i]! + 1;
    const x = i % cols;
    let j = i + 1;
    if (x + 1 < cols && cells[j] !== WALL && dist[j]! < 0) {
      dist[j] = d;
      queue[tail++] = j;
    }
    j = i - 1;
    if (x > 0 && cells[j] !== WALL && dist[j]! < 0) {
      dist[j] = d;
      queue[tail++] = j;
    }
    j = i + cols;
    if (j < n && cells[j] !== WALL && dist[j]! < 0) {
      dist[j] = d;
      queue[tail++] = j;
    }
    j = i - cols;
    if (j >= 0 && cells[j] !== WALL && dist[j]! < 0) {
      dist[j] = d;
      queue[tail++] = j;
    }
  }
  return -1;
}

export function tourOf(f: Floor): number {
  const n = f.cols * f.rows;
  if (dist.length < n) {
    dist = new Int32Array(n);
    queue = new Int32Array(n);
    stops = new Uint8Array(n);
  }
  const at = (c: Cell) => c.y * f.cols + c.x;
  const left = [...f.loot.map((l) => at(l.cell)), at(f.chest)];
  stops.fill(0, 0, n);
  for (const i of left) stops[i]!++;
  let here = at(f.stairsUp);
  let walked = 0;
  while (left.length) {
    const d = leg(f, here);
    // The first listed stop at that distance (or, cut off, the first unreachable one).
    let best = 0;
    while (best < left.length - 1 && dist[left[best]!] !== d) best++;
    walked += Math.max(0, d);
    here = left.splice(best, 1)[0]!;
    stops[here]!--;
  }
  if (f.stairsDown) {
    const down = at(f.stairsDown);
    stops[down] = 1;
    walked += Math.max(0, leg(f, here));
    stops[down] = 0;
  }
  return walked * DUNGEON.cell;
}
