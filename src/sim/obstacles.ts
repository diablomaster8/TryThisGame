import { GROVE } from '../config/tuning';
import type { Vec2, World } from './types';

/**
 * Solid things in the Grove: hills, trees, buildings (fixed and placed), the big rocks.
 * Walkers are pushed out of them so nobody strolls through a hill. Circles are enough
 * at this scale; the pond is handled separately (the shoreline, unless the Keeper
 * wades).
 */
export interface Circle {
  x: number;
  z: number;
  r: number;
  /** Trees block only the Keepers: Nubbins walk under the canopy to the fruit. */
  tree?: boolean;
}

const PLACED_RADIUS: Record<string, number> = { nursery: 2.1, bathhouse: 2.6, workshop: 2.7 };

export function obstacles(world: World | null): Circle[] {
  const out: Circle[] = [];
  for (const h of GROVE.hills) out.push({ x: h.x, z: h.z, r: h.r + 0.25 });
  for (const t of GROVE.trees) out.push({ x: t.x, z: t.z, r: 0.45, tree: true });
  for (const b of Object.values(GROVE.buildings)) out.push({ x: b.x, z: b.z + 0.4, r: b.r });
  for (const k of GROVE.rocks) out.push({ x: k.x, z: k.z, r: k.r });
  if (world) {
    for (const d of world.placed) {
      const r = PLACED_RADIUS[d.kind];
      if (r) out.push({ x: d.pos.x, z: d.pos.z + 0.3, r });
    }
  }
  return out;
}

/** True when the point is inside any obstacle. */
export function blocked(p: Vec2, world: World | null, radius = 0): boolean {
  return obstacles(world).some((c) => Math.hypot(p.x - c.x, p.z - c.z) < c.r + radius);
}

/**
 * Push a walker out of every obstacle it overlaps, sliding along the edge. Returns true
 * if it was moved.
 */
export function resolve(p: Vec2, world: World | null, radius = 0.35, skipTrees = false): boolean {
  let moved = false;
  for (const c of obstacles(world)) {
    if (skipTrees && c.tree) continue;
    const dx = p.x - c.x;
    const dz = p.z - c.z;
    const d = Math.hypot(dx, dz);
    const min = c.r + radius;
    if (d >= min) continue;
    moved = true;
    if (d < 1e-6) {
      p.x = c.x + min;
      continue;
    }
    p.x = c.x + (dx / d) * min;
    p.z = c.z + (dz / d) * min;
  }
  return moved;
}
