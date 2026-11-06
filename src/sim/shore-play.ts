import { SHORE_CASTLES, SHORE_FOLK } from '../config/region-shore';
import { SHORE_PLAY } from '../config/tuning-r13d1';
import { isPartner } from './partners';
import { canOpen } from './region-gates';
import { regionOf } from './regions';
import type { SimEvent, World } from './types';

/**
 * R0097 (WORLD-35, R13 d1): the shore's play. A Power partner standing by a sandcastle for a
 * moment knocks it down and shells wash out; it is built again `rebuildMs` later, so the beach is
 * never used up. The Kettleby folk greet a Keeper who comes up to them (once a minute each).
 * Castle state lives in `world.collected` (`castle:<i>` = when it fell); the folk's rest in
 * `world.gateTries`.
 */
const castleKey = (i: number) => `castle:${i}`;

/** Whether castle `i` stands at the world's time. */
export function castleStands(world: Pick<World, 'collected' | 'timeMs'>, i: number): boolean {
  const fell = (world.collected ?? {})[castleKey(i)];
  return fell === undefined || world.timeMs - fell >= SHORE_PLAY.rebuildMs;
}

export function stepShorePlay(world: World, dtMs: number, events: SimEvent[]): void {
  if (regionOf(world.location) !== 'shore') return;
  const tries = (world.gateTries ??= {});
  const k = world.keeper.pos;
  SHORE_CASTLES.forEach((c, i) => {
    const id = `sc${i}`;
    const was = (world.collected ?? {})[castleKey(i)];
    if (!castleStands(world, i)) {
      tries[id] = 0;
      return;
    }
    if (was !== undefined && tries[`${id}r`] === undefined) {
      // It stood up again while the Keeper was here (or away): say so once.
      tries[`${id}r`] = 1;
      events.push({ kind: 'castleRebuilt', id: i });
    }
    const fit = world.nubbins.some(
      (n) =>
        isPartner(world, n.id) &&
        canOpen(n, 'boulder') &&
        Math.hypot(n.pos.x - c.x, n.pos.z - c.z) <= SHORE_PLAY.reach,
    );
    if (!fit) {
      if (tries[id]) tries[id] = Math.max(0, tries[id]! - dtMs);
      return;
    }
    tries[id] = (tries[id] ?? 0) + dtMs;
    if (tries[id]! < SHORE_PLAY.knockMs) return;
    tries[id] = 0;
    delete tries[`${id}r`];
    (world.collected ??= {})[castleKey(i)] = world.timeMs;
    world.inventory.shells += SHORE_PLAY.shells;
    events.push({ kind: 'castleDown', id: i, shells: SHORE_PLAY.shells });
  });
  for (const f of SHORE_FOLK) {
    const id = `folk:${f.id}`;
    if (tries[id]) {
      tries[id] = Math.max(0, tries[id]! - dtMs);
      continue;
    }
    if (Math.hypot(k.x - f.x, k.z - f.z) > 2.4) continue;
    tries[id] = 60_000;
    events.push({ kind: 'folkGreet', id: f.id });
  }
}
