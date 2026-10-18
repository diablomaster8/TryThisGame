import { EGG, GROVE, PLOTS } from '../config/tuning';
import { resolve } from './obstacles';
import { hasSkill } from './skills';
import type { Nubbin, SimEvent, Vec2, World } from './types';

/** How many Nubbins the Grove holds: the base roster plus bought plots. */
export function rosterCap(world: World): number {
  return EGG.maxRoster + (world.plots ?? 0) * PLOTS.rosterPerPlot;
}

/**
 * Moss watches from the western hill and is not the Keeper's to list, count or trade until
 * the story brings him down (`c7-stillness`) and the roster has room for him.
 */
export function mossOnHill(world: World, id: string): boolean {
  const c = world.campaign;
  return c !== null && c.mossId === id && c.flags.mossDown !== true;
}

/** Where Moss sits on the western hill: its slope, pushed clear of the hill's footing. */
export function mossSeat(world: World): Vec2 {
  const hill = GROVE.hills[0];
  const seat = { x: hill.x + 2.5, z: hill.z - 2.5 };
  resolve(seat, world, 0.3, true);
  return seat;
}

/** The Keeper's own Nubbins: everyone in the Grove except Moss while he keeps to the hill. */
export function rosterNubbins(world: World): Nubbin[] {
  return world.nubbins.filter((n) => !mossOnHill(world, n.id));
}

export function hasRoom(world: World): boolean {
  return rosterNubbins(world).length < rosterCap(world);
}

/** The campaign's own Nubbins (Moss and Sable): the story needs them, so they are never traded. */
export function storyNubbin(world: World, id: string): boolean {
  const c = world.campaign;
  return c !== null && (c.mossId === id || c.sableId === id);
}

export function buyPlot(world: World, events: SimEvent[]): boolean {
  const max = PLOTS.max + (hasSkill(world, 'bigPlot') ? 1 : 0);
  const ok = world.plots < max && world.inventory.shells >= PLOTS.price;
  if (ok) {
    world.inventory.shells -= PLOTS.price;
    world.plots += 1;
  }
  events.push({ kind: 'plotBought', plots: world.plots, ok });
  return ok;
}
