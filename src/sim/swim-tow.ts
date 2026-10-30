import { GROVE, SWIM_TOW } from '../config/tuning';
import { isHeld } from './nubbin';
import { levelOf } from './stats';
import type { Nubbin, SimEvent, World } from './types';

/**
 * Deep water and the swim tow (R0088, WORLD-22). The pond is deep water: the Keeper cannot
 * wade it alone. A Swim-trained adult (Swim level 30 or more) that is the Keeper's partner, or
 * the Nubbin it rides, tows it across faster than wading, and is drawn paddling just ahead. A
 * loved Swim adult's old wade perk still lets the Keeper in at wading pace. With neither, the
 * shore stays the limit and a hint says what would help. No drowning, no fail state.
 */

/** Whether (x, z) is deep water: the pond. The stream stays shallow, wadeable by anyone. */
export function deepAt(x: number, z: number): boolean {
  const p = GROVE.pond;
  return Math.hypot(x - p.x, z - p.z) < p.r;
}

function swims(n: Nubbin | undefined): n is Nubbin {
  return (
    !!n &&
    n.stage === 'adult' &&
    !isHeld(n) &&
    n.behavior.state !== 'thrown' &&
    levelOf(n.stats.swim.points) >= SWIM_TOW.minSwimLevel
  );
}

/** The Nubbin that would tow the Keeper through deep water: the ridden one first, then a partner. */
export function swimTower(world: World): Nubbin | null {
  if (world.location !== 'grove') return null;
  const ids = [world.ride?.nubbinId, world.partners[0], world.partners[1]];
  for (const id of ids) {
    if (!id) continue;
    const n = world.nubbins.find((x) => x.id === id);
    if (swims(n)) return n;
  }
  return null;
}

/** Per world: when the "a good swimmer" hint last showed. */
const hinted = new WeakMap<World, number>();

/** The shore stopped the Keeper: say once a minute that a swimmer could take it across. */
export function swimHint(world: World, events: SimEvent[]): void {
  const last = hinted.get(world);
  if (last !== undefined && world.timeMs - last < SWIM_TOW.hintMs) return;
  hinted.set(world, world.timeMs);
  events.push({ kind: 'swimHint' });
}

/**
 * After the Keeper's step: while it is in deep water with a tower, the tower paddles just
 * ahead of it (the tow pose). Its own wandering picks up again a moment after they land.
 */
export function stepSwimTow(world: World): void {
  const k = world.keeper;
  if (!deepAt(k.pos.x, k.pos.z)) return;
  const n = swimTower(world);
  if (!n) return;
  n.behavior.state = 'swim';
  n.behavior.untilMs = world.timeMs + 500;
  n.behavior.target = null;
  n.facing = k.facing;
  if (world.ride?.nubbinId === n.id) return;
  n.pos.x = k.pos.x + Math.sin(k.facing) * SWIM_TOW.lead;
  n.pos.z = k.pos.z + Math.cos(k.facing) * SWIM_TOW.lead;
}

/** Pace in water at (x, z): a tower's stroke in deep water, else the wading pace given. */
export function waterPace(world: World, x: number, z: number, wade: number): number {
  return deepAt(x, z) && swimTower(world) ? SWIM_TOW.speed : wade;
}
