import { THROWN_BONK } from '../config/tuning-move';
import { react } from './behavior';
import { contact, obstacles } from './obstacles';
import type { Nubbin, SimEvent, World } from './types';

/**
 * Thrown and dropped bodies against the Grove's solids (MOVE-33). Before, eggs skipped the
 * push-out altogether and a thrown Nubbin flew through walls until it landed, so an egg let
 * go over the cottage could hatch inside it. Each step of a flight, anything taller than
 * the body is high (and not soft) pushes it out and turns its sideways speed back at
 * `restitution`; a Nubbin is dizzy from the bonk, an egg just bounces. Hills are left to
 * the walkers' own rule, as before.
 */
export function collideThrown(world: World, n: Nubbin, events: SimEvent[]): void {
  if (world.location !== 'grove') return;
  const r = THROWN_BONK.radius;
  let bonked = false;
  for (const c of obstacles(world)) {
    if (c.flags.includes('soft') || c.flags.includes('nubbinOnly')) continue;
    if (Math.abs(c.x - n.pos.x) > 12 || Math.abs(c.z - n.pos.z) > 12) continue;
    if (c.top <= n.y) continue;
    const hit = contact(c, n.pos.x, n.pos.z, r);
    if (!hit) continue;
    n.pos.x += hit.nx * hit.depth;
    n.pos.z += hit.nz * hit.depth;
    // Turn back only the part of the speed going into the wall.
    const into = n.vel.x * hit.nx + n.vel.z * hit.nz;
    if (into < 0) {
      const k = 1 + THROWN_BONK.restitution;
      n.vel.x -= k * into * hit.nx;
      n.vel.z -= k * into * hit.nz;
      bonked = true;
    }
  }
  if (bonked && n.stage !== 'egg') react(n, 'dizzy', world.timeMs, events);
}
