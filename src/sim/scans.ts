import { SCANS } from '../config/tuning';
import { createEgg } from './nubbin';
import { neighbourGarden } from './neighbourhood';
import type { Rng } from './rng';
import { hasRoom } from './roster';
import type { SimEvent, World } from './types';
import { newId, uniqueName } from './world';

/**
 * Scan and convert: meeting a species fills its scan in the Collection Book. Wild
 * visitors scan on arrival and while they stay; a neighbour's pets scan a little on
 * each visit. At full scan the Book can convert it into an egg of that species.
 */
export function noteScan(world: World, species: string, amount: number, events: SimEvent[]): void {
  if (species === 'chao') return;
  const before = world.scans[species] ?? 0;
  const after = Math.min(SCANS.full * 3, before + amount);
  world.scans[species] = after;
  if (before < SCANS.full && after >= SCANS.full) events.push({ kind: 'scanFull', species });
}

export function stepScans(world: World, dtMs: number, events: SimEvent[]): void {
  if (events.length > 0)
    for (const e of [...events]) {
      if (e.kind === 'wildArrived') noteScan(world, e.species, SCANS.perArrival, events);
      else if (e.kind === 'visiting' && e.trainer) {
        for (const pet of neighbourGarden(e.trainer))
          noteScan(world, pet.species, SCANS.perNeighbourVisit, events);
      }
    }
  // Each wild one present scans a little per minute.
  const crossed = Math.floor(world.timeMs / 60_000) !== Math.floor((world.timeMs - dtMs) / 60_000);
  if (crossed)
    for (const w of world.wild) noteScan(world, w.species, SCANS.perMinutePresent, events);
}

export function canConvert(world: World, species: string): string | null {
  if ((world.scans[species] ?? 0) < SCANS.full) return 'scan';
  if (!hasRoom(world)) return 'roster';
  return null;
}

export function convertScan(world: World, species: string, rng: Rng, events: SimEvent[]): boolean {
  if (canConvert(world, species)) return false;
  world.scans[species] = (world.scans[species] ?? 0) - SCANS.full;
  const egg = createEgg(
    newId(world, 'nub'),
    { x: world.keeper.pos.x + 1, z: world.keeper.pos.z },
    rng,
    'plain',
    species,
  );
  egg.name = uniqueName(world, egg.name, rng);
  world.nubbins.push(egg);
  events.push({ kind: 'converted', species, nubbinId: egg.id });
  return true;
}
