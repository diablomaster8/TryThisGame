import {
  COLLECT,
  COLLECTIBLES,
  type Collectible,
  type CollectibleKind,
} from '../config/region-collectibles';
import type { RegionId } from '../config/regions';
import { regionOf } from './regions';
import type { SimEvent, World } from './types';

/**
 * R0091: one-time collectibles. Walking over one keeps it in `world.collected` (id → sim
 * time), an optional save field that an older save simply lacks; nothing ever removes an
 * entry, so nothing respawns. A finished set of petals or postcards gives its reward once.
 */

/** Uncollected ones in the Keeper's region (where the renderers sparkle and the step looks). */
export function openHere(world: World): Collectible[] {
  if (world.location !== 'grove') return [];
  const region = regionOf(world.location);
  const got = world.collected ?? {};
  return COLLECTIBLES.filter((c) => c.region === region && got[c.id] === undefined);
}

/** How many of a kind the Keeper has in a region, of how many there are. */
export function tally(
  world: Pick<World, 'collected'>,
  region: RegionId,
  kind: CollectibleKind,
): { got: number; of: number } {
  const of = COLLECT.perRegion[kind];
  const prefix = `${region}:${kind}:`;
  const got = Object.keys(world.collected ?? {}).filter((k) => k.startsWith(prefix)).length;
  return { got: Math.min(got, of), of };
}

/** Pick up whatever the Keeper stands on. */
export function stepCollectibles(world: World, events: SimEvent[]): void {
  const k = world.keeper.pos;
  for (const c of openHere(world)) {
    if (Math.hypot(c.x - k.x, c.z - k.z) > COLLECT.pickRadius) continue;
    const got = (world.collected ??= {});
    got[c.id] = world.timeMs;
    events.push({ kind: 'keepsakeFound', id: c.id, what: c.kind });
    const t = tally(world, c.region, c.kind);
    if (t.got < t.of) continue;
    if (c.kind === 'petal') {
      const d = COLLECT.rewards.petal.decor;
      world.inventory.decor[d] = (world.inventory.decor[d] ?? 0) + 1;
    } else if (c.kind === 'postcard') {
      world.inventory.hats.push(COLLECT.rewards.postcard.hat);
    }
    events.push({ kind: 'collectionSetDone', region: c.region, what: c.kind });
  }
}
