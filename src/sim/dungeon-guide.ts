/**
 * "Show me the way" (R0208, DUNG-63): an assist anyone can switch on at the cave mouth
 * (`world.hollow.guide`, off by default). It finds the walking path from the Keeper to the
 * next objective: the stairs down once they have been seen, otherwise the nearest edge of
 * the unexplored (a seen open cell beside an unseen open one). The automap draws the path
 * as soft footprints and the floor bar shows an arrow. A breadth-first search over the
 * Keeper's walkable cells, cached until the Keeper changes cell or more of the floor is
 * seen, so it follows a new objective on the very next step.
 *
 * Pure sim: no DOM. It only reads the world.
 */
import { PARTY_R8 } from '../config/dungeon-party-r8';
import { cellOf, exploredMask, runFloor, type Floor } from './dungeon';
import { navMask } from './dungeon-nav';
import { kidMode } from './dungeon-puzzles';
import type { DungeonRun, World } from './types';

export interface GuidePath {
  goal: 'stairs' | 'explore';
  /** Cell indices from the Keeper's cell (first) to the goal (last). */
  cells: number[];
}

/**
 * Whether the guide is on: the Keeper's own choice, or, until they choose, on in kid mode
 * (the Learning Grove or gentle bouts) and off otherwise (R0208, lane B r9).
 */
export function guideOn(world: World): boolean {
  return world.hollow.guide ?? kidMode(world);
}

const cache = new WeakMap<DungeonRun, { key: string; path: GuidePath | null }>();

/** The guide's path, or null when it is off, there is no floor, or nowhere is left to go. */
export function guidePath(world: World): GuidePath | null {
  const run = world.location === 'dungeon' ? world.dungeon : null;
  const f = runFloor(world);
  if (!guideOn(world) || !run || !f) return null;
  const k = cellOf(f, world.keeper.pos);
  const start = k.y * f.cols + k.x;
  const level = `${run.seed}:${run.depth}:${run.zone ?? ''}:${run.side ?? ''}`;
  const key = `${level}:${start}:${run.explored}`;
  const hit = cache.get(run);
  if (hit && hit.key === key) return hit.path;
  const path = findPath(f, exploredMask(run, f), start);
  cache.set(run, { key, path });
  return path;
}

/** The search itself, exported for the tests. */
export function findPath(f: Floor, seen: Uint8Array, start: number): GuidePath | null {
  const open = navMask(f, false);
  const n = f.cols * f.rows;
  const stairs = f.stairsDown ? f.stairsDown.y * f.cols + f.stairsDown.x : -1;
  const toStairs = stairs >= 0 && seen[stairs] === 1;
  const from = new Int32Array(n).fill(-1);
  const queue = new Int32Array(n);
  let head = 0;
  let tail = 0;
  queue[tail++] = start;
  from[start] = start;
  const unseenOpen = (x: number, y: number) =>
    x >= 0 &&
    y >= 0 &&
    x < f.cols &&
    y < f.rows &&
    open[y * f.cols + x] === 1 &&
    !seen[y * f.cols + x];
  const edge = (x: number, y: number) =>
    unseenOpen(x + 1, y) || unseenOpen(x - 1, y) || unseenOpen(x, y + 1) || unseenOpen(x, y - 1);
  while (head < tail) {
    const c = queue[head++]!;
    const x = c % f.cols;
    const y = (c - x) / f.cols;
    const done = toStairs ? c === stairs : c !== start && edge(x, y);
    if (done) {
      const cells: number[] = [];
      for (let p = c; ; p = from[p]!) {
        cells.push(p);
        if (p === start) break;
      }
      cells.reverse();
      return { goal: toStairs ? 'stairs' : 'explore', cells };
    }
    for (let dy = -1; dy <= 1; dy++)
      for (let dx = -1; dx <= 1; dx++) {
        if (!dx && !dy) continue;
        const nx = x + dx;
        const ny = y + dy;
        if (nx < 0 || ny < 0 || nx >= f.cols || ny >= f.rows) continue;
        const j = ny * f.cols + nx;
        // The stairs cell itself may be outside the walkable mask (a set piece): let it in.
        if (from[j] !== -1 || (open[j] !== 1 && j !== stairs)) continue;
        // Only through what the Keeper has seen, so the path never gives the floor away.
        if (!seen[j]) continue;
        // No cutting a corner between two walls.
        if (dx && dy && (open[y * f.cols + nx] !== 1 || open[ny * f.cols + x] !== 1)) continue;
        from[j] = c;
        queue[tail++] = j;
      }
  }
  return null;
}

/** The footprints to draw: every `every`-th cell of the path, at most `maxSteps` cells out. */
export function footprints(path: GuidePath): number[] {
  const G = PARTY_R8.guide;
  return path.cells.slice(1, G.maxSteps + 1).filter((_, i) => i % G.every === G.every - 1);
}

/** The cell a few steps along the path, for the bar's arrow (the goal if it is closer). */
export function lookAheadCell(path: GuidePath): number | undefined {
  const c = path.cells;
  return c[Math.min(c.length - 1, PARTY_R8.guide.lookAhead)];
}
