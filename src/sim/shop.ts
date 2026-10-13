import { BREEDING, EGG, GROVE, SHOP } from '../config/tuning';
import { EGG_COLORS, createEgg } from './nubbin';
import type { Rng } from './rng';
import { rollEggSpecies, trainerOf } from './trainers';
import type { Rewards, ShopItem, SimEvent, Vec2, World } from './types';
import { newId, uniqueName } from './world';

export const HAT_IDS = ['straw', 'crown', 'beanie', 'flower', 'bucket'] as const;

export function priceOf(item: ShopItem): number {
  switch (item) {
    case 'fruit':
      return SHOP.fruit;
    case 'egg':
      return SHOP.egg;
    case 'hat':
      return SHOP.hat;
    case 'toy':
      return SHOP.toy;
    case 'heartFruit':
      return BREEDING.heartFruit;
  }
}

export function rosterCount(world: World): number {
  return world.nubbins.length;
}

/** A free spot near the centre for a new egg or toy. */
function freeSpot(world: World, rng: Rng): Vec2 {
  for (let attempt = 0; attempt < 12; attempt++) {
    const p = { x: rng.float(-4, 4), z: rng.float(-3, 3) };
    const near = world.nubbins.some((n) => Math.hypot(n.pos.x - p.x, n.pos.z - p.z) < 1.2);
    const pond = Math.hypot(p.x - GROVE.pond.x, p.z - GROVE.pond.z) < GROVE.pond.r + 1;
    if (!near && !pond) return p;
  }
  return { x: 0, z: 2 };
}

/** Spend Shells on an item; returns false when it cannot be bought. */
export function buy(world: World, item: ShopItem, rng: Rng, events: SimEvent[]): boolean {
  const price = priceOf(item);
  const fail = (reason: 'shells' | 'roster' | 'toys') => {
    events.push({ kind: 'bought', item, ok: false, reason });
    return false;
  };
  if (world.inventory.shells < price) return fail('shells');
  switch (item) {
    case 'fruit':
      world.inventory.fruit += 1;
      break;
    case 'heartFruit':
      world.inventory.heartFruit += 1;
      break;
    case 'egg': {
      if (rosterCount(world) >= EGG.maxRoster) return fail('roster');
      const rare = rng.chance(SHOP.rareEggChance);
      const colours = EGG_COLORS.filter((c) => c !== 'plain');
      const color = rare ? rng.pick(colours) : 'plain';
      const egg = createEgg(
        newId(world, 'nub'),
        freeSpot(world, rng),
        rng,
        color,
        rollEggSpecies(trainerOf(world.trainer), rng),
      );
      if (rare) {
        if (rng.chance(SHOP.twoToneChance)) egg.tone = rng.pick(colours.filter((c) => c !== color));
        if (rng.chance(SHOP.shinyChance)) egg.shiny = true;
      }
      egg.name = uniqueName(world, egg.name, rng);
      world.nubbins.push(egg);
      break;
    }
    case 'hat':
      world.inventory.hats.push(rng.pick(HAT_IDS));
      break;
    case 'toy': {
      const toys = world.items.filter((i) => i.kind === 'toy').length;
      if (toys >= SHOP.maxToys) return fail('toys');
      world.items.push({
        id: newId(world, 'toy'),
        kind: 'toy',
        pos: freeSpot(world, rng),
        y: 0,
        vel: { x: 0, y: 0, z: 0 },
      });
      break;
    }
  }
  world.inventory.shells -= price;
  events.push({ kind: 'bought', item, ok: true, reason: null });
  return true;
}

export function addRewards(world: World, rewards: Rewards, events: SimEvent[]): void {
  world.inventory.shells += Math.max(0, Math.floor(rewards.shells));
  for (const [type, n] of Object.entries(rewards.essences)) {
    if (!n) continue;
    world.inventory.essences[type] = (world.inventory.essences[type] ?? 0) + n;
  }
  for (const [species, n] of Object.entries(rewards.critters)) {
    if (!n) continue;
    world.inventory.critters[species] = (world.inventory.critters[species] ?? 0) + n;
  }
  events.push({ kind: 'rewards', rewards });
}
