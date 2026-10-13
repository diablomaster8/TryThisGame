import { EGG, PLOTS } from '../config/tuning';
import type { SimEvent, World } from './types';

/** How many Nubbins the Grove holds: the base roster plus bought plots. */
export function rosterCap(world: World): number {
  return EGG.maxRoster + (world.plots ?? 0) * PLOTS.rosterPerPlot;
}

export function hasRoom(world: World): boolean {
  return world.nubbins.length < rosterCap(world);
}

export function buyPlot(world: World, events: SimEvent[]): boolean {
  const ok = world.plots < PLOTS.max && world.inventory.shells >= PLOTS.price;
  if (ok) {
    world.inventory.shells -= PLOTS.price;
    world.plots += 1;
  }
  events.push({ kind: 'plotBought', plots: world.plots, ok });
  return ok;
}
