import type { RegionId } from '../config/regions';
import { hashSeed, Rng } from './rng';
import { layoutOf, resolveRegion, standsIn } from './region-walk';
import type { RegionLayout } from '../config/region-layout';

/**
 * R12 d2: seeded, always-reachable places in a drawn region, for the things that are set on
 * open ground rather than authored by hand: the pressed petals, postcards and old key of
 * WORLD-27, and the traces of WORLD-26 that have no hand-placed spot. Every spot is on
 * walkable ground the Keeper can reach by foot from the region's path (a flood fill from the
 * path's first point), clear of the solid pieces, and a few units from its neighbours. Region
 * local, memoised per region, and the same for the same region every time (no `Math.random`).
 */
export interface Spot {
  x: number;
  z: number;
}

/** A spot's own radius: how much open ground it wants round it. */
const CLEAR = 0.9;

/** Walkable cells reachable on foot from the path's start, as cell centres in raster order. */
const reach = new WeakMap<RegionLayout, Spot[]>();

export function reachableCells(l: RegionLayout): Spot[] {
  const hit = reach.get(l);
  if (hit) return hit;
  const { gw, gh, grid, cell } = l;
  const ox = -l.spec.size.w / 2;
  const oz = -l.spec.size.h / 2;
  const start = l.spec.path[0]!;
  const sx = Math.floor((start.x - ox) / cell);
  const sz = Math.floor((start.z - oz) / cell);
  const seen = new Uint8Array(gw * gh);
  const queue: number[] = [];
  // Start from the nearest walkable cell to the path's first point.
  let best = -1;
  let bd = Infinity;
  for (let dz = -4; dz <= 4; dz++)
    for (let dx = -4; dx <= 4; dx++) {
      const ix = sx + dx;
      const iz = sz + dz;
      if (ix < 0 || iz < 0 || ix >= gw || iz >= gh) continue;
      const i = iz * gw + ix;
      if (grid[i] !== 1) continue;
      const d = dx * dx + dz * dz;
      if (d < bd) {
        bd = d;
        best = i;
      }
    }
  if (best >= 0) {
    seen[best] = 1;
    queue.push(best);
  }
  for (let q = 0; q < queue.length; q++) {
    const i = queue[q]!;
    const ix = i % gw;
    const iz = (i / gw) | 0;
    const nb = [
      ix > 0 ? i - 1 : -1,
      ix < gw - 1 ? i + 1 : -1,
      iz > 0 ? i - gw : -1,
      iz < gh - 1 ? i + gw : -1,
    ];
    for (const n of nb) {
      if (n < 0 || seen[n] || grid[n] !== 1) continue;
      seen[n] = 1;
      queue.push(n);
    }
  }
  const out: Spot[] = [];
  for (let i = 0; i < seen.length; i++)
    if (seen[i])
      out.push({ x: ox + ((i % gw) + 0.5) * cell, z: oz + (((i / gw) | 0) + 0.5) * cell });
  reach.set(l, out);
  return out;
}

/** True when (x, z) fits a spot: walkable all round and clear of every solid piece and trunk. */
export function fits(l: RegionLayout, x: number, z: number): boolean {
  if (!standsIn(l, x, z, CLEAR)) return false;
  // A walker pushed out of anything here would not stand where the spot says it does.
  return !resolveRegion(l, { x, z }, CLEAR);
}

const memo = new Map<string, Spot[]>();

/**
 * `n` spots in `region`, at least `gap` units apart and `away` from every `avoid` point, picked
 * by a seeded shuffle. Fewer come back only if the region has no room (it always has).
 */
export function scatterSpots(
  region: RegionId,
  tag: string,
  n: number,
  gap: number,
  avoid: readonly Spot[] = [],
  away = 3,
): Spot[] {
  const key = `${region}:${tag}:${n}:${gap}`;
  const hit = memo.get(key);
  if (hit) return hit;
  const l = layoutOf(region);
  if (!l) return [];
  const cells = reachableCells(l).slice();
  const rng = new Rng(hashSeed(`spots:${region}:${tag}`));
  for (let i = cells.length - 1; i > 0; i--) {
    const j = rng.int(0, i);
    [cells[i], cells[j]] = [cells[j]!, cells[i]!];
  }
  const out: Spot[] = [];
  for (const c of cells) {
    if (out.length >= n) break;
    if (!fits(l, c.x, c.z)) continue;
    if (avoid.some((a) => Math.hypot(a.x - c.x, a.z - c.z) < away)) continue;
    if (out.some((a) => Math.hypot(a.x - c.x, a.z - c.z) < gap)) continue;
    out.push({ x: c.x, z: c.z });
  }
  memo.set(key, out);
  return out;
}

/** The nearest fitting reachable spot to (x, z): where a hand-placed thing wants to stand. */
export function spotNear(region: RegionId, x: number, z: number): Spot | null {
  const l = layoutOf(region);
  if (!l) return null;
  let best: Spot | null = null;
  let bd = Infinity;
  for (const c of reachableCells(l)) {
    const d = Math.hypot(c.x - x, c.z - z);
    if (d < bd && fits(l, c.x, c.z)) {
      bd = d;
      best = c;
    }
  }
  return best;
}

/**
 * The nearest reachable spot to (x, z) with open ground all round it, out to `half` units each
 * way (a build plot wants a square, not one standing place). Null if the region has none.
 */
export function roomNear(region: RegionId, x: number, z: number, half: number): Spot | null {
  const l = layoutOf(region);
  if (!l) return null;
  const sorted = reachableCells(l)
    .map((c) => ({ c, d: Math.hypot(c.x - x, c.z - z) }))
    .sort((a, b) => a.d - b.d);
  for (const { c } of sorted) {
    let ok = true;
    for (let dz = -half; dz <= half && ok; dz += half / 2)
      for (let dx = -half; dx <= half; dx += half / 2)
        if (!fits(l, c.x + dx, c.z + dz)) {
          ok = false;
          break;
        }
    if (ok) return { x: c.x, z: c.z };
  }
  return null;
}
