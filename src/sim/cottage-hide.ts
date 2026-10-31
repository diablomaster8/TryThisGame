/**
 * R0527 (SOUL-09), the lane A r10 half: in the Learning Grove a Nubbin never runs away.
 * Instead, one left at the trust floor (`EDU_SOUL.trustFloor`) for as long as one elsewhere
 * would take to run (`TRUST.runawayAfterMs`) goes and hides in the cottage, peeking out of
 * the window. It still goes out to eat. Tapping the cottage door coaxes it out with a hug;
 * kind care through the window (trust back up) brings it out on its own too.
 *
 * Learning Grove and live play only: nothing starts while catching up on time away. The
 * time at the floor is transient, so a reload starts that count again (a kindness).
 */
import { EDU_SOUL } from '../config/tuning-fun-r7';
import { TRUST } from '../config/tuning';
import { COTTAGE_HIDE } from '../config/tuning-soul-r10';
import { addHappiness } from './needs';
import { isFree } from './nubbin';
import { resolve } from './obstacles';
import type { IdleAct } from './soul-idle';
import { addTrust } from './trust';
import type { Nubbin, SimEvent, Vec2, World } from './types';

/** When each Nubbin's trust reached the floor (transient). */
const lowSince = new WeakMap<Nubbin, number>();

/** The spot at the cottage window, pushed clear of the walls. */
export function cottageWindow(world: World): Vec2 {
  const p = { x: COTTAGE_HIDE.window.x, z: COTTAGE_HIDE.window.z };
  resolve(p, world, 0.6, 'nubbin');
  return p;
}

/** Once per step, after trust: who goes to hide, and who comes out on their own. */
export function stepCottageHide(world: World, offline: boolean, events: SimEvent[]): void {
  if (!world.edu || offline) return;
  const now = world.timeMs;
  const floor = EDU_SOUL.trustFloor;
  for (const n of world.nubbins) {
    if (n.stage === 'egg' || n.stage === 'cocoon') continue;
    if (n.cottageHide) {
      if (n.trust >= floor + COTTAGE_HIDE.outAbove) comeOut(world, n, events, false);
      continue;
    }
    if (n.trust > floor + COTTAGE_HIDE.margin) {
      lowSince.delete(n);
      continue;
    }
    const since = lowSince.get(n);
    if (since === undefined) lowSince.set(n, now);
    else if (now - since >= TRUST.runawayAfterMs) {
      lowSince.delete(n);
      n.cottageHide = true;
      events.push({ kind: 'cottageHid', nubbinId: n.id });
    }
  }
}

/** The idle choice for a hiding Nubbin: back to the window, and wait there a while. */
export function cottageHideAct(n: Nubbin, world: World): IdleAct | null {
  if (!n.cottageHide) return null;
  const at = cottageWindow(world);
  return {
    state: 'perform',
    ms: COTTAGE_HIDE.waitMs,
    itemId: 'cottageHide',
    target: at,
    // It faces out of the window, toward the garden.
    facing: 0,
  };
}

/** The Keeper tapped the cottage door: every Nubbin hiding there comes out. True if any. */
export function coaxOut(world: World, events: SimEvent[]): boolean {
  const hiding = world.nubbins.filter((n) => n.cottageHide);
  for (const n of hiding) comeOut(world, n, events, true);
  return hiding.length > 0;
}

function comeOut(world: World, n: Nubbin, events: SimEvent[], coaxed: boolean): void {
  delete n.cottageHide;
  lowSince.delete(n);
  if (coaxed) {
    addTrust(n, COTTAGE_HIDE.coaxTrust, events, true);
    addHappiness(n, COTTAGE_HIDE.coaxHappiness);
  }
  const now = world.timeMs;
  if (isFree(n)) {
    const b = n.behavior;
    b.state = 'react';
    b.reaction = 'love';
    b.target = null;
    b.itemId = null;
    b.sinceMs = now;
    b.untilMs = now + COTTAGE_HIDE.hugMs;
    if (coaxed) n.facing = Math.atan2(world.keeper.pos.x - n.pos.x, world.keeper.pos.z - n.pos.z);
  }
  events.push({ kind: 'reaction', nubbinId: n.id, reaction: 'love' });
  events.push({ kind: 'coaxedOut', nubbinId: n.id, coaxed });
}
