/**
 * R0568 (SOUL-51): each Nubbin can come to prefer one Keeper of the two. Every kind act
 * (the ones that nudge alignment) counts toward the Keeper who did it; once one leads by
 * `FONDNESS.lead` it is the favourite: greeted half as often again, and the one it trails
 * when there is fruit. The first time the other Keeper comes near after a switch, it tilts
 * its head ("?"). Behaviour only; optional fields, no save bump.
 */
import { FONDNESS } from '../config/tuning-more/soul-quirks-gait';
import { soulLive } from './antics';
import type { IdleAct } from './soul-idle';
import type { KeeperAlignment, Nubbin, World } from './types';

/** A kind act by this Keeper. */
export function noteFondness(n: Nubbin, side: KeeperAlignment): void {
  const f = (n.keeperFondness ??= { sun: 0, moon: 0 });
  f[side] += 1;
}

/** The favourite Keeper, or null while neither leads by enough. */
export function favouriteKeeper(n: Nubbin): KeeperAlignment | null {
  const f = n.keeperFondness;
  if (!f) return null;
  if (f.sun - f.moon >= FONDNESS.lead) return 'sun';
  if (f.moon - f.sun >= FONDNESS.lead) return 'moon';
  return null;
}

/** The greet multiplier for the Keeper on duty. */
export function fondGreet(n: Nubbin, world: World): number {
  return favouriteKeeper(n) === world.keeper.alignment ? FONDNESS.greet : 1;
}

/** Whether this Nubbin would rather not follow the Keeper on duty (it is not its favourite). */
export function followsOther(n: Nubbin, world: World): boolean {
  const fav = favouriteKeeper(n);
  return fav !== null && fav !== world.keeper.alignment;
}

/** The head tilt on the less-loved Keeper's first approach after a switch, or null. */
export function tiltAct(n: Nubbin, world: World): IdleAct | null {
  const side = world.keeper.alignment;
  const fav = favouriteKeeper(n);
  if (fav === side && n.tiltFor) delete n.tiltFor;
  if (!soulLive() || !fav || fav === side || n.tiltFor === side) return null;
  const k = world.keeper.pos;
  if (Math.hypot(k.x - n.pos.x, k.z - n.pos.z) > FONDNESS.tiltRadius) return null;
  n.tiltFor = side;
  return {
    state: 'sit',
    ms: FONDNESS.tiltMs,
    itemId: 'tiltHead',
    facing: Math.atan2(k.x - n.pos.x, k.z - n.pos.z),
  };
}
