import { hasRoom } from './roster';
import { VISITS } from '../config/tuning';
import { createEgg, EGG_COLORS } from './nubbin';
import { removeNpc, spawnNpc } from './npcs';
import type { Rng } from './rng';
import { TRAINERS } from './trainers';
import type { SimEvent, World } from './types';
import { newId, uniqueName } from './world';
import { localDayKey, localParts, tzOf } from './local-time';

/**
 * The calendar rhythm: a Keeper may drop by on a new real day and potter about for a
 * while, and Saturday is lantern night. Outside the campaign the visitor is the only NPC
 * in the Grove. Canon 22 allows free daily gifts (Maor, 2026-10-21); no quest repeats daily.
 * Each Keeper brings one story gift, the first time they visit; later visits are company.
 */
/** TECH-45: the local day, from the wall time and the Keeper's time zone (`sim/local-time.ts`). */
export function dayKey(wallMs: number, tzMin: number): string {
  return localDayKey(wallMs, tzMin);
}

export function isLanternNight(wallMs: number, tzMin: number): boolean {
  return localParts(wallMs, tzMin).weekday === VISITS.lanternNightDay;
}

/** Called each live step with the wall clock. */
export function stepDaily(world: World, wallMs: number, rng: Rng, events: SimEvent[]): void {
  const tz = tzOf(world);
  const key = dayKey(wallMs, tz);
  if (world.visits.lastDay === key) return;
  world.visits.lastDay = key;
  world.visits.count += 1;
  // Who visits: any Keeper but the player's.
  const others = TRAINERS.filter((t) => t.id !== world.trainer);
  const trainer = rng.pick(others).id;
  const roll = rng.next();
  let gift: 'shells' | 'fruit' | 'egg' | 'heartFruit' | null = null;
  const firstVisit = !world.visits.gifted.includes(trainer);
  if (!firstVisit) {
    // Already brought their gift: company only.
  } else if (roll < 0.5) {
    gift = 'shells';
    world.inventory.shells += VISITS.giftShells;
  } else if (roll < 0.75) {
    gift = 'fruit';
    world.inventory.fruit += 3;
  } else if (roll < 0.9 && hasRoom(world)) {
    gift = 'egg';
    const colours = EGG_COLORS.filter((c) => c !== 'plain');
    const egg = createEgg(newId(world, 'nub'), { x: 1, z: 4 }, rng, rng.pick(colours));
    egg.name = uniqueName(world, egg.name, rng);
    world.nubbins.push(egg);
  } else {
    gift = 'heartFruit';
    world.inventory.heartFruit += 1;
  }
  if (gift) world.visits.gifted.push(trainer);
  // The visitor stays the day unless the campaign already fills the Grove with Keepers.
  if (!world.campaign) {
    for (const npc of [...world.npcs]) removeNpc(world, npc.trainer);
    spawnNpc(world, trainer);
  }
  events.push({ kind: 'visitor', trainer, gift });
  if (isLanternNight(wallMs, tz)) events.push({ kind: 'lanternNight' });
}
