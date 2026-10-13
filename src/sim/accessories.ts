import type { DyeColor, SimEvent, World } from './types';

/** Dyed hats and scarves, and glasses. Dyes come from the workshop. */
export function dye(
  world: World,
  nubbinId: string,
  slot: 'hat' | 'scarf',
  color: DyeColor | null,
  events: SimEvent[],
): boolean {
  const n = world.nubbins.find((x) => x.id === nubbinId);
  if (!n) return false;
  if (color) {
    if ((world.inventory.dyes[color] ?? 0) <= 0) return false;
    world.inventory.dyes[color] = (world.inventory.dyes[color] ?? 0) - 1;
  }
  if (slot === 'hat') n.hatDye = color;
  else n.scarf = color;
  events.push({ kind: 'dyed', nubbinId, slot });
  return true;
}

export function wearGlasses(world: World, nubbinId: string, on: boolean): boolean {
  const n = world.nubbins.find((x) => x.id === nubbinId);
  if (!n) return false;
  n.glasses = on;
  return true;
}
