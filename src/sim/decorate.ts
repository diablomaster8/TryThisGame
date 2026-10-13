import { DECOR, GROVE } from '../config/tuning';
import type { DecorKind, SimEvent, Vec2, World } from './types';
import { newId } from './world';

/** Garden decorating: buy pieces in the shop, place them on the grass, pick them up again. */
export const DECOR_KINDS: readonly DecorKind[] = [
  'fence',
  'flowerbed',
  'bench',
  'statue',
  'pathTile',
  'lanternSmall',
];

export function decorPrice(kind: DecorKind): number {
  return DECOR.prices[kind];
}

export function buyDecor(world: World, kind: DecorKind, events: SimEvent[]): boolean {
  const price = decorPrice(kind);
  const ok = world.inventory.shells >= price;
  if (ok) {
    world.inventory.shells -= price;
    world.inventory.decor[kind] = (world.inventory.decor[kind] ?? 0) + 1;
  }
  events.push({ kind: 'decorBought', decor: kind, ok });
  return ok;
}

export function canPlaceAt(world: World, pos: Vec2): boolean {
  const pond = GROVE.pond;
  if (Math.hypot(pos.x - pond.x, pos.z - pond.z) < pond.r + 0.6) return false;
  for (const t of GROVE.trees) if (Math.hypot(pos.x - t.x, pos.z - t.z) < 1.2) return false;
  const half = GROVE.size / 2 - 0.5;
  if (Math.abs(pos.x) > half || Math.abs(pos.z) > half) return false;
  return !world.placed.some((d) => Math.hypot(d.pos.x - pos.x, d.pos.z - pos.z) < 0.7);
}

export function placeDecor(world: World, kind: DecorKind, pos: Vec2, events: SimEvent[]): boolean {
  if ((world.inventory.decor[kind] ?? 0) <= 0) return false;
  if (world.placed.length >= DECOR.maxPlaced || !canPlaceAt(world, pos)) return false;
  world.inventory.decor[kind] = (world.inventory.decor[kind] ?? 0) - 1;
  const id = newId(world, 'decor');
  // Snap to half units so fences and tiles line up.
  world.placed.push({
    id,
    kind,
    pos: { x: Math.round(pos.x * 2) / 2, z: Math.round(pos.z * 2) / 2 },
  });
  events.push({ kind: 'decorPlaced', id, decor: kind });
  return true;
}

export function removeDecor(world: World, id: string): boolean {
  const d = world.placed.find((p) => p.id === id);
  if (!d) return false;
  world.placed = world.placed.filter((p) => p.id !== id);
  world.inventory.decor[d.kind] = (world.inventory.decor[d.kind] ?? 0) + 1;
  return true;
}
