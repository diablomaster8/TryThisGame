/**
 * Movement on the grid (recs FIGHT-52): Move = 3 + ⌊Run/25⌋ tiles, Jump = 1 + ⌊Fly/33⌋ levels
 * (+1 for Featherlight), a step legal when the height changes by no more than Jump. Deep water
 * is for Swim types or Swim level 30+, at 2 moves a tile; others path around. One Dijkstra per
 * unit turn over the whole (at most 16×16) map gives every reachable tile and its route.
 * A unit may pass through its allies but never through a foe, and never ends on anyone.
 */
import { TACTICS } from '../../../config/tuning-tactics';
import type { StatKey } from '../../types';
import type { Trait } from '../types';
import { blocks, heightAt, inside, ix, N4, tileAt } from './map';
import { stepCost } from './terrain';
import type { Cell, GridMap } from './types';

const MV = TACTICS.move;

/** Move and Jump from the stat levels and traits (Featherlight: +1 Jump, half at grade A too). */
export function moveJump(
  levels: Readonly<Record<StatKey, number>>,
  traits: readonly Trait[],
): { move: number; jump: number } {
  const run = Math.max(0, Math.min(99, levels.run));
  const fly = Math.max(0, Math.min(99, levels.fly));
  const feather = traits.some((t) => t.id === 'featherlight') ? 1 : 0;
  return {
    move: MV.base + Math.floor(run / MV.runPer),
    jump: MV.jumpBase + Math.floor(fly / MV.flyPer) + feather,
  };
}

/** Swim types, or anyone with Swim level 30+, may enter deep water. */
export function canSwim(type: string, swimLevel: number): boolean {
  return type === 'swim' || swimLevel >= MV.deepSwim;
}

/** Whether one step from `a` to its neighbour `b` is legal for the height alone. */
export function stepOk(m: GridMap, a: Cell, b: Cell, jump: number): boolean {
  return Math.abs(heightAt(m, b.x, b.y) - heightAt(m, a.x, a.y)) <= jump;
}

export interface Walker {
  x: number;
  y: number;
  move: number;
  jump: number;
  swimmer: boolean;
}

/** Who stands where: 0 an ally of the walker, 1 a foe, undefined nobody. */
export type Occupancy = (x: number, y: number) => 0 | 1 | undefined;

export interface Reach {
  /** Half-move cost to each tile (Infinity where unreachable), row-major. */
  cost: Float64Array;
  prev: Int32Array;
  /** Tiles the walker may end on, its own tile first. */
  tiles: Cell[];
}

/**
 * Every tile the walker can end its move on, with routes. Costs are in half-moves (a path
 * tile is 1, grass 2, mud 4, deep 4); a route is legal while its total is at most 2 × Move,
 * which is the same as rounding the route's cost up once.
 */
export function reachable(m: GridMap, w: Walker, who: Occupancy): Reach {
  const n = m.w * m.h;
  const cost = new Float64Array(n).fill(Infinity);
  const prev = new Int32Array(n).fill(-1);
  const budget = w.move * 2;
  const start = ix(m, w.x, w.y);
  cost[start] = 0;
  // A small binary-free queue: maps are at most 16×16, so a linear scan for the minimum is
  // cheaper than heap bookkeeping and keeps the order seeded-stable (lowest index on ties).
  const open: number[] = [start];
  const done = new Uint8Array(n);
  while (open.length) {
    let bi = 0;
    for (let k = 1; k < open.length; k++)
      if (
        cost[open[k]!]! < cost[open[bi]!]! ||
        (cost[open[k]!] === cost[open[bi]!] && open[k]! < open[bi]!)
      )
        bi = k;
    const i = open[bi]!;
    open.splice(bi, 1);
    if (done[i]) continue;
    done[i] = 1;
    const x = i % m.w;
    const y = (i - x) / m.w;
    for (const d of N4) {
      const nx = x + d.x;
      const ny = y + d.y;
      if (!inside(m, nx, ny) || blocks(tileAt(m, nx, ny))) continue;
      if (who(nx, ny) === 1) continue;
      if (!stepOk(m, { x, y }, { x: nx, y: ny }, w.jump)) continue;
      const c = stepCost(m, nx, ny, w.swimmer);
      if (c === null) continue;
      const j = ix(m, nx, ny);
      const total = cost[i]! + c;
      if (total > budget || total >= cost[j]!) continue;
      cost[j] = total;
      prev[j] = i;
      open.push(j);
    }
  }
  const tiles: Cell[] = [{ x: w.x, y: w.y }];
  for (let i = 0; i < n; i++) {
    if (i === start || cost[i] === Infinity) continue;
    const x = i % m.w;
    const y = (i - x) / m.w;
    if (who(x, y) === undefined) tiles.push({ x, y });
  }
  return { cost, prev, tiles };
}

/** The route to (x, y), excluding the start; empty when unreachable or already there. */
export function routeTo(m: GridMap, r: Reach, x: number, y: number): Cell[] {
  let i = ix(m, x, y);
  if (r.cost[i] === Infinity) return [];
  const out: Cell[] = [];
  while (r.prev[i]! >= 0) {
    const cx = i % m.w;
    out.push({ x: cx, y: (i - cx) / m.w });
    i = r.prev[i]!;
  }
  return out.reverse();
}

export const canEnd = (r: Reach, x: number, y: number): boolean =>
  r.tiles.some((c) => c.x === x && c.y === y);

/**
 * A fall of `drop` levels (a knockback off a ledge): from `TACTICS.move.fallFrom` levels up it
 * bumps 10% of max HP and leaves the unit Dizzy, and it never tuckers anyone out (1 HP floor).
 * Returns the HP lost.
 */
export function fallDamage(drop: number, hp: number, maxHp: number): number {
  if (drop < MV.fallFrom || hp <= 1) return 0;
  const dmg = Math.max(1, Math.round(maxHp * MV.fallShare));
  return Math.min(dmg, hp - 1);
}
