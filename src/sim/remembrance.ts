/**
 * R0424 (LOOK-54, lane E r9): "we are made of being remembered". When a Nubbin departs, every
 * Nubbin it was bonded with (friendship at the buddy mark, either way round) keeps its name in
 * `remembers` and may wear the remembrance flower, the hill's memorial flower as a hat. The
 * hat joins the inventory the first time; only a Nubbin that remembers someone can put it on.
 * Rebirth is not a departure, so it never gives the flower.
 */
import { REMEMBRANCE_HAT } from '../config/cosmetics-r9e';
import { FRIENDS } from '../config/tuning';
import type { Nubbin, SimEvent, World } from './types';

/** Called as `gone` departs, before it leaves `world.nubbins`. */
export function rememberDeparted(world: World, gone: Nubbin, events: SimEvent[]): void {
  for (const n of world.nubbins) {
    if (n.id === gone.id) continue;
    const bond = Math.max(n.friends?.[gone.id] ?? 0, gone.friends?.[n.id] ?? 0);
    if (bond < FRIENDS.buddyAt) continue;
    const list = (n.remembers ??= []);
    if (!list.includes(gone.name)) list.push(gone.name);
    if (!world.inventory.hats.includes(REMEMBRANCE_HAT)) world.inventory.hats.push(REMEMBRANCE_HAT);
    events.push({ kind: 'remembrance', nubbinId: n.id, friend: gone.name });
  }
}

/** Whether `n` may wear `hat`: the remembrance flower only for a Nubbin who remembers someone. */
export function mayWear(n: Nubbin, hat: string | null): boolean {
  return hat !== REMEMBRANCE_HAT || (n.remembers?.length ?? 0) > 0;
}
