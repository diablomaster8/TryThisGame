import type { ReadonlyWorld } from './readonly';
import {
  COLLECT,
  COLLECTIBLES,
  type Collectible,
  type CollectibleKind,
} from '../config/region-collectibles';
import type { RegionId } from '../config/regions';
import { KEEPSAKE_SPOTS, SET_REWARDS } from '../config/tuning-more/world-content-tables';
import { WORLD_TRACES } from '../content/world-traces';
import { drawnRegionOf } from './region-walk';
import { scatterSpots } from './region-spots';
import { traceSpot } from './regions-trace';
import { bumpMarks } from './region-marks';
import type { SimEvent, World } from './types';

/**
 * R0091: one-time collectibles. Walking over one keeps it in `world.collected` (id → sim
 * time), an optional save field that an older save simply lacks; nothing ever removes an
 * entry, so nothing respawns. A finished set of petals or postcards gives its reward once.
 */

const seeded = new Map<RegionId, Collectible[]>();

/**
 * Every collectible of a region. The Grove's are authored; a drawn region's are seeded on its
 * open, reachable ground (`sim/region-spots.ts`), clear of its traces: 12 petals, 3 postcards
 * and the old key, the same for the same region every time.
 */
export function collectiblesIn(region: RegionId): readonly Collectible[] {
  if (region === 'grove') return COLLECTIBLES;
  const hit = seeded.get(region);
  if (hit) return hit;
  const traces = WORLD_TRACES.filter((t) => t.region === region)
    .map(traceSpot)
    .filter((s): s is { x: number; z: number } => s !== null);
  const n = COLLECT.perRegion;
  const spots = scatterSpots(
    region,
    'keep',
    n.petal + n.postcard + n.key,
    KEEPSAKE_SPOTS.gap,
    traces,
    KEEPSAKE_SPOTS.awayFromTrace,
  );
  const out: Collectible[] = [];
  let at = 0;
  for (const kind of ['petal', 'postcard', 'key'] as const)
    for (let i = 0; i < n[kind]; i++) {
      const s = spots[at++];
      if (s) out.push({ id: `${region}:${kind}:${i + 1}`, region, kind, x: s.x, z: s.z });
    }
  seeded.set(region, out);
  return out;
}

/** The region whose collectibles are on show: the Grove, or the drawn region the Keeper is in. */
function hereRegion(world: Pick<ReadonlyWorld, 'location'>): RegionId | null {
  return world.location === 'grove' ? 'grove' : drawnRegionOf(world.location);
}

/** Uncollected ones in the Keeper's region (where the renderers sparkle and the step looks). */
export function openHere(world: ReadonlyWorld): Collectible[] {
  const region = hereRegion(world);
  if (!region) return [];
  const got = world.collected ?? {};
  return collectiblesIn(region).filter((c) => got[c.id] === undefined);
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

/** Where the Keeper stood at the last look, per world: a still Keeper picks up nothing new. */
const lastAt = new WeakMap<ReadonlyWorld, { x: number; z: number }>();

/** Pick up whatever the Keeper stands on. */
export function stepCollectibles(world: World, events: SimEvent[]): void {
  if (!hereRegion(world)) return;
  const k = world.keeper.pos;
  const at = lastAt.get(world);
  if (at && at.x === k.x && at.z === k.z) return;
  lastAt.set(world, { x: k.x, z: k.z });
  for (const c of openHere(world)) {
    if (Math.hypot(c.x - k.x, c.z - k.z) > COLLECT.pickRadius) continue;
    const got = (world.collected ??= {});
    got[c.id] = world.timeMs;
    bumpMarks();
    events.push({ kind: 'keepsakeFound', id: c.id, what: c.kind });
    const t = tally(world, c.region, c.kind);
    if (t.got < t.of) continue;
    const r = SET_REWARDS[c.region];
    if (c.kind === 'petal') {
      const d = r?.decor ?? COLLECT.rewards.petal.decor;
      world.inventory.decor[d] = (world.inventory.decor[d] ?? 0) + 1;
    } else if (c.kind === 'postcard') {
      world.inventory.hats.push(r?.hat ?? COLLECT.rewards.postcard.hat);
    }
    events.push({ kind: 'collectionSetDone', region: c.region, what: c.kind });
  }
}
