import { resolve } from './obstacles';
import { KEEPER, NEEDS } from '../config/tuning';
import { addTrust } from './trust';
import { createKeeper, petNubbin } from './keeper';
import { eat } from './behavior';
import { isFree } from './nubbin';
import { TRAINERS } from './trainers';
import type { SimEvent, Vec2, World } from './types';

/**
 * Drop-in local co-op: a second Keeper on the same screen, moved with IJKL or a gamepad,
 * who can pet and feed the nearest Nubbin. No server; the sim just has two Keepers.
 */
export function setCoop(world: World, active: boolean, trainer: string, events: SimEvent[]): void {
  world.coop = { active, trainer: TRAINERS.some((t) => t.id === trainer) ? trainer : 'nova' };
  if (active) {
    world.keeper2 ??= createKeeper({ x: world.keeper.pos.x + 1.5, z: world.keeper.pos.z });
  } else {
    world.keeper2 = null;
  }
  events.push({ kind: 'coop', active });
}

export function stepKeeper2(world: World, dtMs: number): void {
  const k = world.keeper2;
  if (!k || !world.coop.active) return;
  const dt = dtMs / 1000;
  if (k.input.x !== 0 || k.input.z !== 0) {
    const len = Math.hypot(k.input.x, k.input.z);
    const nx = k.input.x / len;
    const nz = k.input.z / len;
    k.pos.x += nx * KEEPER.speed * dt;
    k.pos.z += nz * KEEPER.speed * dt;
    k.facing = Math.atan2(nx, nz);
    resolve(k.pos, world);
  }
}

function nearest(world: World, pos: Vec2) {
  let best = null as World['nubbins'][number] | null;
  let d = KEEPER.interactRadius + 0.8;
  for (const n of world.nubbins) {
    if (n.stage === 'egg' || !isFree(n)) continue;
    const dist = Math.hypot(n.pos.x - pos.x, n.pos.z - pos.z);
    if (dist < d) {
      d = dist;
      best = n;
    }
  }
  return best;
}

export function keeper2Act(world: World, action: 'pet' | 'feed', events: SimEvent[]): void {
  const k = world.keeper2;
  if (!k || !world.coop.active) return;
  const n = nearest(world, k.pos);
  if (!n) return;
  if (action === 'pet') {
    petNubbin(world, n, events);
  } else if (world.inventory.fruit > 0) {
    world.inventory.fruit -= 1;
    eat(n, world.timeMs, events);
    addTrust(n, NEEDS.petAffection, events);
  }
}
