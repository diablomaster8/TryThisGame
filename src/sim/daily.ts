import { VISITS } from '../config/tuning';
import { createEgg, EGG_COLORS } from './nubbin';
import { removeNpc, spawnNpc } from './npcs';
import type { Rng } from './rng';
import { TRAINERS } from './trainers';
import type { SimEvent, World } from './types';
import { newId, uniqueName } from './world';

/**
 * The daily rhythm, on the real calendar: once a day a Keeper visits with a gift and
 * potters about for a while, and Saturday is lantern night. Outside the campaign the
 * visitor is the only NPC in the Grove.
 */
export function dayKey(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

export function isLanternNight(date: Date): boolean {
  return date.getDay() === VISITS.lanternNightDay;
}

/** Called each live step with the wall clock. */
export function stepDaily(world: World, wallMs: number, rng: Rng, events: SimEvent[]): void {
  const date = new Date(wallMs);
  const key = dayKey(date);
  if (world.visits.lastDay === key) return;
  world.visits.lastDay = key;
  world.visits.count += 1;
  // Who visits: any Keeper but the player's.
  const others = TRAINERS.filter((t) => t.id !== world.trainer);
  const trainer = rng.pick(others).id;
  const roll = rng.next();
  let gift: 'shells' | 'fruit' | 'egg' | 'heartFruit';
  if (roll < 0.5) {
    gift = 'shells';
    world.inventory.shells += VISITS.giftShells;
  } else if (roll < 0.75) {
    gift = 'fruit';
    world.inventory.fruit += 3;
  } else if (roll < 0.9 && world.nubbins.length < 8) {
    gift = 'egg';
    const colours = EGG_COLORS.filter((c) => c !== 'plain');
    const egg = createEgg(newId(world, 'nub'), { x: 1, z: 4 }, rng, rng.pick(colours));
    egg.name = uniqueName(world, egg.name, rng);
    world.nubbins.push(egg);
  } else {
    gift = 'heartFruit';
    world.inventory.heartFruit += 1;
  }
  // The visitor stays the day unless the campaign already fills the Grove with Keepers.
  if (!world.campaign) {
    for (const npc of [...world.npcs]) removeNpc(world, npc.trainer);
    spawnNpc(world, trainer);
  }
  events.push({ kind: 'visitor', trainer, gift });
  if (isLanternNight(date)) events.push({ kind: 'lanternNight' });
}
