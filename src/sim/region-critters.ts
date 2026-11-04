import { CRITTER_RULES, REGION_CRITTERS, type CritterSpot } from '../config/region-wild';
import { regionOf } from './regions';
import { hashSeed } from './rng';
import { speciesById } from './critters';
import type { SimEvent, World } from './types';

/**
 * R0120 (WORLD-53): critters with homes. A region's critter spots (`config/region-wild.ts`)
 * each hold one critter of the region's three species until the Keeper takes it; the spot holds
 * another after `respawnMs` of play. Which species a spot holds is a seeded pick from its own
 * hash and its take count, so the same save sees the same wood, and only the region's table ever
 * appears. At most `maxLive` spots are open in one ring. An ambient resource: no quest, no chore.
 */
export interface LiveCritter {
  id: string;
  x: number;
  z: number;
  species: string;
}

const key = (region: string, id: string) => `cspot:${region}:${id}`;

/** How many times a spot has been taken (kept in `world.collected` as `cspot:<region>:<id>`). */
function takenAt(world: Pick<World, 'collected'>, region: string, id: string): number | undefined {
  return (world.collected ?? {})[key(region, id)];
}

/** The species a spot holds at its next appearing: a seeded pick from the region's three. */
export function spotSpecies(
  seed: number,
  region: string,
  spot: CritterSpot,
  takes: number,
): string {
  const table = REGION_CRITTERS[region];
  if (!table) return '';
  return table.species[hashSeed(`${seed}:${region}:${spot.id}:${takes}`) % table.species.length]!;
}

/** The critters out in the region now (the renderers draw them; never more than `maxLive`). */
export function liveCritters(world: World): LiveCritter[] {
  const region = regionOf(world.location);
  const table = REGION_CRITTERS[region];
  if (!table) return [];
  const out: LiveCritter[] = [];
  for (const s of table.spots) {
    const at = takenAt(world, region, s.id);
    if (at !== undefined && world.timeMs - at < CRITTER_RULES.respawnMs) continue;
    const takes = (world.critterTakes ??= {})[key(region, s.id)] ?? 0;
    out.push({ id: s.id, x: s.x, z: s.z, species: spotSpecies(world.seed, region, s, takes) });
    if (out.length >= CRITTER_RULES.maxLive) break;
  }
  return out;
}

/** Walking up to a critter takes it into the critter inventory, ready to give. */
export function stepRegionCritters(world: World, events: SimEvent[]): void {
  if (!world.location.startsWith('region:')) return;
  const k = world.keeper.pos;
  for (const c of liveCritters(world)) {
    if (Math.hypot(c.x - k.x, c.z - k.z) > CRITTER_RULES.takeRadius) continue;
    if (!speciesById(c.species)) continue;
    const region = regionOf(world.location);
    (world.collected ??= {})[key(region, c.id)] = world.timeMs;
    const takes = (world.critterTakes ??= {});
    takes[key(region, c.id)] = (takes[key(region, c.id)] ?? 0) + 1;
    world.inventory.critters[c.species] = (world.inventory.critters[c.species] ?? 0) + 1;
    events.push({ kind: 'regionCritter', region, species: c.species });
  }
}
