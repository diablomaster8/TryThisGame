import { hasRoom, rosterNubbins } from './roster';
import { BREEDING, EGG_FINISH, GROVE, LOOK_SHOP, PARTNERS, SHOP } from '../config/tuning';
import { SHOP_COSMETICS, seasonHat } from '../config/cosmetics';
import { shopDiscount } from './town';
import { EGG_COLORS, JEWEL_EGG_COLORS, createEgg, isJewel } from './nubbin';
import type { Rng } from './rng';
import { rollEggSpecies, trainerOf } from './trainers';
import type { Rewards, ShopItem, SimEvent, Vec2, World } from './types';
import { newId, uniqueName } from './world';
import { eggPriceMultiplier, rareEggMultiplier, seasonalEggColor } from './seasons';
import { eduTakeEgg } from './edu-eggs';

export const HAT_IDS = ['straw', 'crown', 'beanie', 'flower', 'bucket'] as const;

/**
 * The hat on sale today (LOOK-32): the registry's shop wearables in turn, a new one each
 * day, skipping ones already owned, so the shop shows what you get instead of a lucky dip.
 */
export function shopHat(world: World): string {
  // LOOK-70: in its season, that season's hat comes first until it is owned.
  const season = seasonHat(world.season);
  if (season && !world.inventory.hats.includes(season)) return season;
  const ids = SHOP_COSMETICS;
  const day = Math.floor(world.timeMs / LOOK_SHOP.hatDayMs);
  for (let k = 0; k < ids.length; k++) {
    const id = ids[(day + k) % ids.length]!;
    if (!world.inventory.hats.includes(id)) return id;
  }
  return ids[day % ids.length]!;
}

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
    case 'twine':
      return PARTNERS.twinePrice;
  }
}

export function rosterCount(world: World): number {
  return rosterNubbins(world).length;
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
export function buy(
  world: World,
  item: ShopItem,
  rng: Rng,
  events: SimEvent[],
  pick?: number,
): boolean {
  const base = priceOf(item);
  // An unknown item (a stale UI, a bad save, a console typo) must not touch the purse.
  if (!Number.isFinite(base)) {
    events.push({ kind: 'bought', item, ok: false, reason: 'shells' });
    return false;
  }
  const price = Math.round(
    base * (item === 'egg' ? eggPriceMultiplier(world) : 1) * shopDiscount(world),
  );
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
    case 'twine':
      world.inventory.twine += 1;
      break;
    case 'egg': {
      if (!hasRoom(world)) return fail('roster');
      // Lane E r8, R0692: a Learning Grove buys the egg it sees on the shelf, no rarity roll.
      if (world.edu) {
        const shelf = eduTakeEgg(world, pick);
        if (!shelf) return fail('shells');
        const egg = createEgg(newId(world, 'nub'), freeSpot(world, rng), rng, shelf, 'chao');
        egg.name = uniqueName(world, egg.name, rng);
        world.nubbins.push(egg);
        break;
      }
      const rare = rng.chance(Math.min(0.9, SHOP.rareEggChance * rareEggMultiplier(world)));
      const colours = EGG_COLORS.filter((c) => c !== 'plain');
      const seasonal = seasonalEggColor(world.season);
      const color = rng.chance(SHOP.jewelEggChance)
        ? rng.pick(JEWEL_EGG_COLORS)
        : rare
          ? seasonal && rng.chance(0.35)
            ? seasonal
            : rng.pick(colours)
          : 'plain';
      const egg = createEgg(
        newId(world, 'nub'),
        freeSpot(world, rng),
        rng,
        color,
        rollEggSpecies(trainerOf(world.trainer), rng),
      );
      // A jewel is its own finish: no two-tone or shiny on top.
      if (rare && !isJewel(color)) {
        if (rng.chance(SHOP.twoToneChance)) egg.tone = rng.pick(colours.filter((c) => c !== color));
        if (rng.chance(SHOP.shinyChance)) egg.shiny = true;
        // LOOK-31: the metal and glass finishes, rarer still.
        if (rng.chance(EGG_FINISH.metalChance)) egg.finish = 'metal';
        else if (rng.chance(EGG_FINISH.glassChance)) egg.finish = 'glass';
      }
      egg.name = uniqueName(world, egg.name, rng);
      world.nubbins.push(egg);
      break;
    }
    case 'hat':
      world.inventory.hats.push(shopHat(world));
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
        bornMs: world.timeMs,
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
  for (const [flavor, n] of Object.entries(rewards.seeds ?? {})) {
    if (!n) continue;
    const f = flavor as keyof typeof world.inventory.seeds;
    world.inventory.seeds[f] = (world.inventory.seeds[f] ?? 0) + n;
  }
  for (const [species, n] of Object.entries(rewards.critters)) {
    if (!n) continue;
    world.inventory.critters[species] = (world.inventory.critters[species] ?? 0) + n;
  }
  events.push({ kind: 'rewards', rewards });
}
