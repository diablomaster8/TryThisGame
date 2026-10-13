import { GATHER, RECIPES, TOYS } from '../config/tuning';
import type { DecorKind, DyeColor, SimEvent, ToyKind, Vec2, World } from './types';
import { newId } from './world';

/**
 * Gathering and the workshop. Wood comes from shaken trees, stone from the rocks,
 * reeds from the stream bank. Recipes turn them into garden pieces, toys and dyes.
 * The workshop building must stand in the Grove before anything but a fence is made.
 */
export type RecipeId = keyof typeof RECIPES;

export function hasWorkshop(world: World): boolean {
  return world.placed.some((d) => d.kind === 'workshop');
}

export function canCraft(world: World, recipe: RecipeId): string | null {
  const r = RECIPES[recipe];
  if (recipe !== 'fence' && recipe !== 'workshop' && !hasWorkshop(world)) return 'workshop';
  const inv = world.inventory;
  if (inv.wood < r.wood || inv.stone < r.stone || inv.reeds < r.reeds) return 'materials';
  if (inv.shells < r.shells) return 'shells';
  return null;
}

export function craft(world: World, recipe: RecipeId, events: SimEvent[], dye?: DyeColor): boolean {
  const why = canCraft(world, recipe);
  if (why) {
    events.push({ kind: 'crafted', recipe, ok: false });
    return false;
  }
  const r = RECIPES[recipe];
  const inv = world.inventory;
  inv.wood -= r.wood;
  inv.stone -= r.stone;
  inv.reeds -= r.reeds;
  inv.shells -= r.shells;
  if (recipe === 'ball') inv.toys.ball = (inv.toys.ball ?? 0) + 1;
  else if (recipe === 'dye') {
    const c = dye ?? 'rose';
    inv.dyes[c] = (inv.dyes[c] ?? 0) + 1;
  } else {
    const kind = recipe as DecorKind;
    inv.decor[kind] = (inv.decor[kind] ?? 0) + 1;
  }
  events.push({ kind: 'crafted', recipe, ok: true });
  return true;
}

let lastGather = -Infinity;

/** A tap on a rock or the stream bank. */
export function gather(world: World, what: 'stone' | 'reeds', events: SimEvent[]): boolean {
  if (world.timeMs - lastGather < GATHER.tapCooldownMs) return false;
  lastGather = world.timeMs;
  const n = what === 'stone' ? GATHER.stonePerTap : GATHER.reedsPerTap;
  if (what === 'stone') world.inventory.stone += n;
  else world.inventory.reeds += n;
  events.push({ kind: 'gathered', what, count: n });
  return true;
}

/** Toys from the shop, placed in the Grove. */
export function buyToy(world: World, toy: ToyKind, events: SimEvent[]): boolean {
  const price = TOYS.prices[toy];
  if (world.inventory.shells < price) {
    events.push({ kind: 'bought', item: 'toy', ok: false, reason: 'shells' });
    return false;
  }
  world.inventory.shells -= price;
  world.inventory.toys[toy] = (world.inventory.toys[toy] ?? 0) + 1;
  events.push({ kind: 'bought', item: 'toy', ok: true, reason: null });
  return true;
}

export function placeToy(world: World, toy: ToyKind, pos: Vec2, events: SimEvent[]): boolean {
  if ((world.inventory.toys[toy] ?? 0) <= 0) return false;
  if (world.items.filter((i) => i.kind === 'toy').length >= TOYS.maxPlaced) return false;
  world.inventory.toys[toy] = (world.inventory.toys[toy] ?? 0) - 1;
  world.items.push({
    id: newId(world, 'toy'),
    kind: 'toy',
    pos: { x: pos.x, z: pos.z },
    y: 0,
    vel: { x: 0, y: 0, z: 0 },
    toy,
  });
  events.push({ kind: 'toyPlaced', toy });
  return true;
}
