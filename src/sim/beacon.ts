import { REGIONS } from '../config/regions';
import type { Vec2, World } from './types';

/**
 * R0100 (WORLD-42): where the tracked objective is, so the world can draw a beacon on it, the
 * compass a tick and the minimap a star. CAMP decides which step is tracked (the objective
 * chip's key); this only turns that key into a place, through `OBJECTIVE_POIS`: a key prefix
 * names a Grove point of interest, or one of the moving targets: `egg` (the egg nearest the
 * Keeper, then the Nubbin it hatched into) and `fruit` (fruit on the ground, else the nearest
 * fruit tree). A step with no row has no place yet and draws nothing.
 */
export const OBJECTIVE_POIS: Readonly<Record<string, string>> = {
  'grove:hatch': 'egg',
  'grove:hungry': 'fruit',
  // Hazel's chapter 1: hatch your first egg and pet the Nubbin that comes out.
  'story:hazel:1': 'egg',
};

const near = (from: Vec2, list: readonly Vec2[]): Vec2 | null => {
  let best: Vec2 | null = null;
  let d = Infinity;
  for (const p of list) {
    const e = Math.hypot(p.x - from.x, p.z - from.z);
    if (e < d) {
      d = e;
      best = p;
    }
  }
  return best && { x: best.x, z: best.z };
};

/** A Grove point of interest by id, or null. */
export function poiPos(id: string): Vec2 | null {
  const p = REGIONS.grove.pois.find((q) => q.id === id);
  return p ? { x: p.x, z: p.z } : null;
}

function target(world: World, name: string): Vec2 | null {
  const k = world.keeper.pos;
  const own = world.nubbins.filter(
    (n) => n.id !== world.campaign?.mossId && n.id !== world.campaign?.sableId,
  );
  if (name === 'egg') {
    const eggs = own.filter((n) => n.stage === 'egg').map((n) => n.pos);
    return near(k, eggs.length ? eggs : own.filter((n) => n.stage !== 'cocoon').map((n) => n.pos));
  }
  if (name === 'fruit') {
    const fruit = world.items.filter((i) => i.kind === 'fruit').map((i) => i.pos);
    return (
      near(k, fruit) ??
      near(
        k,
        world.trees.map((t) => t.pos),
      )
    );
  }
  return poiPos(name);
}

/** The place objective `key` points at in the Grove, or null when it has none. */
export function objectivePoi(world: World, key: string | null): Vec2 | null {
  if (!key || world.location !== 'grove') return null;
  for (const [prefix, name] of Object.entries(OBJECTIVE_POIS))
    if (key === prefix || key.startsWith(`${prefix}:`)) return target(world, name);
  return null;
}
