import { WORLD_STREAM } from '../config/tuning-world';
import type { Vec2 } from '../sim/types';
import { chunkKey, chunkOf, chunksAround, type ChunkCoord } from './chunks';

/**
 * R0140 (WORLD-74): with co-op on, a region keeps the chunk rings of both Keepers, not only the
 * first's, so the second never walks into bare ground. Pure and shared by both region hosts:
 * `base` is the first Keeper's active set (with its hysteresis), and the second adds a plain
 * ring round its own chunk (its set needs no hysteresis: it is only drawn, never built ahead).
 * Draw calls stay flat (the batches hold chunks, not calls); only triangles grow, and only in
 * co-op. The camera still follows the first Keeper (the camera rule), so a second Keeper beyond
 * the view is not framed here.
 */
export function withSecondKeeper(
  base: readonly ChunkCoord[],
  second: Vec2 | null,
  rings: number = WORLD_STREAM.rings,
): ChunkCoord[] {
  if (!second) return [...base];
  const seen = new Set(base.map(chunkKey));
  const out = [...base];
  for (const c of chunksAround(chunkOf(second.x, second.z), rings)) {
    const k = chunkKey(c);
    if (seen.has(k)) continue;
    seen.add(k);
    out.push(c);
  }
  return out;
}

/** Whether a second Keeper's ring is worth drawing apart from the first's (far enough away). */
export function secondKeeperApart(a: Vec2, b: Vec2): boolean {
  return Math.hypot(a.x - b.x, a.z - b.z) > WORLD_STREAM.chunk * 0.75;
}
