import { drawnRegionOf, layoutOf, resolveRegion, standsIn } from '../sim/region-walk';
import type { Vec2, World } from '../sim/types';

/**
 * R0101 (WORLD-43): stage marks for the drawn regions. A scene's cast names marks of the Grove
 * (`green`, `house-1`), which mean nothing on the shore or the ridge, so inside a region the
 * stager translates them: the cast stands in a fan in front of the Keeper, on ground the
 * region's own walk grid says is open, each turned toward the Keeper. Drawing only.
 */
export interface RegionSpot {
  x: number;
  z: number;
  yaw: number;
}

const RADII = [2.3, 3.1, 1.7, 3.9];
const FAN = [0.75, -0.75, 1.5, -1.5, 0, 2.25, -2.25];
/** A figure's footprint for the walkable check. */
const BODY = 0.45;

/** Who a region's stage seats: every named speaker or cast entry except the Keeper and voices. */
export function regionSeats(ids: Iterable<string>): string[] {
  const out: string[] = [];
  for (const id of ids)
    if (!['you', 'narrator', 'chorus', 'moss', 'sable'].includes(id) && !out.includes(id))
      out.push(id);
  return out;
}

/** Where each of `ids` stands around the Keeper in the drawn region the world is in. */
export function regionCastSpots(world: World, ids: readonly string[]): Map<string, RegionSpot> {
  const out = new Map<string, RegionSpot>();
  const rid = drawnRegionOf(world.location);
  const l = rid ? layoutOf(rid) : null;
  const k = world.keeper.pos;
  const base = world.keeper.facing;
  const taken: Vec2[] = [];
  for (const who of ids) {
    let best: Vec2 | null = null;
    search: for (const r of RADII) {
      for (const f of FAN) {
        const a = base + f;
        const p = { x: k.x + Math.sin(a) * r, z: k.z + Math.cos(a) * r };
        if (l) {
          resolveRegion(l, p, BODY);
          if (!standsIn(l, p.x, p.z, BODY)) continue;
        }
        if (taken.some((t) => Math.hypot(t.x - p.x, t.z - p.z) < 1.1)) continue;
        best = p;
        break search;
      }
    }
    if (!best) {
      // Nowhere open (the Keeper stands at an edge): fan out regardless, one slot each.
      const a = base + FAN[taken.length % FAN.length]!;
      best = { x: k.x + Math.sin(a) * 1.8, z: k.z + Math.cos(a) * 1.8 };
    }
    taken.push(best);
    out.set(who, { x: best.x, z: best.z, yaw: Math.atan2(k.x - best.x, k.z - best.z) });
  }
  return out;
}
