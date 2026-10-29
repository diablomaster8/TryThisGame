/**
 * MOVE-55: lookouts. A standable top is pointless unless standing there shows you
 * something. On a rock, a bench or a hay bale at least `LOOKOUT.minTop` up (or at the well's
 * rim), "Look around" finds what can only be seen from up high: each vista marker within
 * range once per save, and once a shell at the bottom of the well. Never daily: every find
 * is one-time.
 */
import { GROVE } from '../config/tuning';
import { LOOKOUT } from '../config/tuning-move';
import { keeperFooting } from './keeper';
import { groveHeight } from './terrain';
import type { SimEvent, World } from './types';

export type LookoutKind = 'top' | 'well';

/** Where the Keeper could look around from now, or null. */
export function lookoutHere(world: World): LookoutKind | null {
  const k = world.keeper;
  if (world.location !== 'grove' || !k.grounded || k.carrying) return null;
  const w = GROVE.buildings.well;
  if (Math.hypot(k.pos.x - w.x, k.pos.z - w.z) <= w.r + LOOKOUT.wellReach) return 'well';
  const f = keeperFooting(world, k.pos.x, k.pos.z, k.y);
  if (f.on === 'deck' && f.y - groveHeight(k.pos.x, k.pos.z) >= LOOKOUT.minTop) return 'top';
  return null;
}

/** The `lookAround` command: one-time finds from where the Keeper stands. */
export function lookAround(world: World, events: SimEvent[]): void {
  const at = lookoutHere(world);
  if (!at) return;
  const found = (world.lookouts ??= []);
  let any = false;
  if (at === 'well') {
    if (!found.includes('well')) {
      found.push('well');
      world.inventory.shells += LOOKOUT.wellShells;
      events.push({ kind: 'lookoutFind', id: 'well', shells: LOOKOUT.wellShells, critter: null });
      any = true;
    }
  } else {
    const k = world.keeper.pos;
    for (const v of LOOKOUT.vistas) {
      if (found.includes(v.id) || Math.hypot(v.x - k.x, v.z - k.z) > LOOKOUT.vistaRange) continue;
      found.push(v.id);
      world.inventory.shells += v.shells;
      if (v.critter)
        world.inventory.critters[v.critter] = (world.inventory.critters[v.critter] ?? 0) + 1;
      events.push({ kind: 'lookoutFind', id: v.id, shells: v.shells, critter: v.critter });
      any = true;
    }
  }
  events.push({ kind: 'lookedAround', at, found: any });
}
