import type { DyeColor, DyeSlot, SimEvent, World } from './types';

/** Dyed hats and scarves, and glasses. Dyes come from the workshop. */
export function dye(
  world: World,
  nubbinId: string,
  slot: DyeSlot,
  color: DyeColor | null,
  events: SimEvent[],
): boolean {
  const n = world.nubbins.find((x) => x.id === nubbinId);
  if (!n) return false;
  // Children keep the yellow tip: the wing and crown tips take dye from adulthood.
  if ((slot === 'wingTip' || slot === 'crownTip') && n.stage !== 'adult') return false;
  if (color) {
    if ((world.inventory.dyes[color] ?? 0) <= 0) return false;
    world.inventory.dyes[color] = (world.inventory.dyes[color] ?? 0) - 1;
  }
  if (slot === 'hat') n.hatDye = color;
  else if (slot === 'wingTip') n.wingDye = color;
  else if (slot === 'crownTip') n.crownDye = color;
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
