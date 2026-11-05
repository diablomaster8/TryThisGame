import type { RegionId } from '../config/regions';
import { WILD_NUBBIN } from '../config/tuning-r12d2';
import { hashSeed } from './rng';
import { scatterSpots } from './region-spots';
import { drawnRegionOf } from './region-walk';
import { isCommonSpecies, SPECIES } from './species';
import { addRecruit } from './town';
import type { SimEvent, World } from './types';

/**
 * R0120 (WORLD-53): the wild Nubbin of a region. One shy baby, seeded per save and region, strolls
 * near a home spot on open ground. A Keeper who stands by it with a fruit for a moment is trusted:
 * it takes the fruit and moves into the village square as a recruit (`sim/town.ts`), once per
 * region (`wild:<region>` in `world.collected`). Not a quest and not a chore: it is simply there.
 */
export interface WildNubbin {
  region: string;
  name: string;
  species: string;
  x: number;
  z: number;
  /** Which way it is walking (radians), for the flip and the lean. */
  heading: number;
}

const key = (region: string) => `wild:${region}`;

/** Whether the region's wild Nubbin has been befriended. */
export function befriended(world: Pick<World, 'collected'>, region: string): boolean {
  return (world.collected ?? {})[key(region)] !== undefined;
}

/** Its name and species: a seeded pick for this save, the same every time. */
export function wildIdentity(
  seed: number,
  region: string,
): { name: string; species: string } | null {
  const rule = WILD_NUBBIN.regions[region];
  if (!rule) return null;
  const h = hashSeed(`${seed}:wild:${region}`);
  const pool = SPECIES.filter(
    (s) =>
      s.family !== 'chao' &&
      s.stage === 'baby' &&
      isCommonSpecies(s) &&
      rule.types.includes(s.type),
  );
  const species = pool.length > 0 ? pool[h % pool.length]!.id : 'chao';
  return { name: rule.names[(h >>> 8) % rule.names.length]!, species };
}

const homes = new Map<string, { x: number; z: number } | null>();
function homeOf(region: string): { x: number; z: number } | null {
  const k = region;
  if (!homes.has(k)) {
    const s = scatterSpots(region as RegionId, 'wild', 1, 10, [], 3)[0];
    homes.set(k, s ?? null);
  }
  return homes.get(k)!;
}

/** The wild Nubbin of the region the Keeper is in, or null (none here, or befriended already). */
export function wildNubbinHere(world: World): WildNubbin | null {
  const region = drawnRegionOf(world.location);
  if (!region || befriended(world, region)) return null;
  const id = wildIdentity(world.seed, region);
  const home = homeOf(region);
  if (!id || !home) return null;
  const a = (world.timeMs / WILD_NUBBIN.strollMs) * Math.PI * 2 + (hashSeed(region) % 7);
  return {
    region,
    ...id,
    x: home.x + Math.cos(a) * WILD_NUBBIN.roam,
    z: home.z + Math.sin(a) * WILD_NUBBIN.roam * 0.7,
    heading: a + Math.PI / 2,
  };
}

const near = new WeakMap<World, number>();

/** Stand by it with a fruit and it decides to trust you. */
export function stepWildNubbin(world: World, dtMs: number, events: SimEvent[]): void {
  const w = wildNubbinHere(world);
  if (!w) {
    near.delete(world);
    return;
  }
  const k = world.keeper.pos;
  if (Math.hypot(w.x - k.x, w.z - k.z) > WILD_NUBBIN.reach) {
    near.delete(world);
    return;
  }
  const had = near.get(world) ?? 0;
  if (had === 0) events.push({ kind: 'wildNubbin', region: w.region, name: w.name, state: 'met' });
  if (world.inventory.fruit < WILD_NUBBIN.fruit) {
    near.set(world, Math.max(1, had));
    return;
  }
  const t = had + dtMs;
  near.set(world, t);
  if (t < WILD_NUBBIN.befriendMs) return;
  near.delete(world);
  world.inventory.fruit -= WILD_NUBBIN.fruit;
  (world.collected ??= {})[key(w.region)] = world.timeMs;
  addRecruit(world, w.name, w.species, events);
  events.push({ kind: 'wildNubbin', region: w.region, name: w.name, state: 'friend' });
}
