import { NEEDS, RIDE } from '../config/tuning';
import { isHeld } from './nubbin';
import { levelOf } from './stats';
import { STAT_KEYS, type Nubbin, type SimEvent, type World } from './types';

/**
 * Riding a Nubbin (R0085, WORLD-19). A well-loved adult with a trained top stat carries the
 * Keeper on its back: its type sets the pace (Run fastest), its personality colours the ride
 * (a Lazy one sits down now and then until cheered, a Mischievous one hops aside on turns, a
 * Shy one slows near people, a Cheerful one bounces) and riding tires it at twice the walking
 * rate until it asks to get down. In a Learning Grove any hatched Nubbin will carry, children
 * tow the Keeper by the hand, and riding costs no energy.
 *
 * The ridden Nubbin skips its own behaviour (world.ts) and is pinned under the Keeper here,
 * after the Keeper's step; the renderers read `world.ride` to seat the Keeper on its back.
 */

export type RideRefusal = 'egg' | 'adult' | 'bond' | 'stat' | 'tired' | 'busy' | 'away';

/** Why this Nubbin cannot carry the Keeper now, or null when it can. */
export function rideRefusal(world: World, n: Nubbin): RideRefusal | null {
  if (world.location !== 'grove') return 'away';
  if (n.stage === 'egg' || n.stage === 'cocoon') return 'egg';
  if (isHeld(n) || n.behavior.state === 'thrown' || world.keeper.carrying) return 'busy';
  if (world.edu) return null;
  if (n.stage !== 'adult') return 'adult';
  if (!n.bond && n.needs.affection < RIDE.minAffection) return 'bond';
  if (topLevel(n) < RIDE.minTopLevel) return 'stat';
  if (n.needs.energy < RIDE.tiredEnergy) return 'tired';
  return null;
}

function topLevel(n: Nubbin): number {
  let best = 0;
  for (const k of STAT_KEYS) best = Math.max(best, levelOf(n.stats[k].points));
  return best;
}

/** The Nubbin being ridden, if any. */
export function rider(world: World): Nubbin | null {
  const id = world.ride?.nubbinId;
  return id ? (world.nubbins.find((n) => n.id === id) ?? null) : null;
}

export function isRidden(world: World, id: string): boolean {
  return world.ride?.nubbinId === id;
}

/** A child tows the Keeper by the hand rather than carrying it (Learning Grove only). */
export function rideTows(n: Nubbin): boolean {
  return n.stage !== 'adult';
}

export function startRide(world: World, nubbinId: string, events: SimEvent[]): boolean {
  const n = world.nubbins.find((x) => x.id === nubbinId);
  if (!n || rideRefusal(world, n)) return false;
  if (world.ride) endRide(world, events, 'down');
  world.ride = {
    nubbinId,
    nextSitMs: world.timeMs + RIDE.lazyEveryMs,
    sitUntilMs: 0,
    hopUntilMs: 0,
    hopSide: 1,
    heading: world.keeper.facing,
  };
  // The carrier walks wherever the Keeper goes: a plain wander with no end of its own.
  n.behavior.state = 'wander';
  n.behavior.untilMs = Infinity;
  n.behavior.target = null;
  n.behavior.itemId = null;
  n.pos.x = world.keeper.pos.x;
  n.pos.z = world.keeper.pos.z;
  events.push({ kind: 'rideStarted', nubbinId });
  return true;
}

export function endRide(world: World, events: SimEvent[], reason: 'down' | 'tired' | 'gone'): void {
  const ride = world.ride;
  if (!ride) return;
  delete world.ride;
  const n = world.nubbins.find((x) => x.id === ride.nubbinId);
  if (n && !isHeld(n) && n.behavior.state === 'wander') {
    // It hops down beside the Keeper and goes back to its own day.
    n.behavior.untilMs = world.timeMs;
    n.y = 0;
  }
  events.push({ kind: 'rideEnded', nubbinId: ride.nubbinId, reason });
}

/** A cheer gets a sitting Lazy carrier up and puts off its next sit. */
export function cheerRide(world: World): void {
  const ride = world.ride;
  if (!ride) return;
  ride.sitUntilMs = 0;
  ride.nextSitMs = world.timeMs + RIDE.lazyEveryMs;
}

/**
 * The Keeper's pace on its carrier (× walking speed), or null when on foot. Running only
 * matters on a Run carrier; a sitting Lazy one does not move at all.
 */
export function rideSpeed(world: World, running: boolean): number | null {
  const ride = world.ride;
  if (!ride) return null;
  const n = rider(world);
  if (!n) return null;
  if (world.timeMs < ride.sitUntilMs) return 0;
  let m: number;
  if (rideTows(n)) m = RIDE.towSpeed;
  else {
    const t = n.form?.type ?? 'normal';
    m = t === 'run' && running ? RIDE.runRunning : RIDE.speed[t];
  }
  if (n.personality === 'shy' && !world.edu && nearPeople(world)) m *= RIDE.shySpeed;
  return m;
}

function nearPeople(world: World): boolean {
  const k = world.keeper.pos;
  return world.npcs.some((p) => Math.hypot(p.pos.x - k.x, p.pos.z - k.z) < RIDE.shyNear);
}

/** A small seeded roll from the time and the Nubbin's id: no RNG stream is spent on a ride. */
function roll(world: World, salt: string): number {
  let h = 2166136261 ^ Math.floor(world.timeMs / 100);
  for (let i = 0; i < salt.length; i++) h = Math.imul(h ^ salt.charCodeAt(i), 16777619);
  return ((h >>> 0) % 10_000) / 10_000;
}

/**
 * After the Keeper's step: end a ride that can no longer go on, pin the carrier under the
 * Keeper, tire it, and run its personality. `moved` is how far the Keeper went this step.
 */
export function stepRide(world: World, dtMs: number, moved: number, events: SimEvent[]): void {
  const ride = world.ride;
  if (!ride) return;
  const n = rider(world);
  if (
    !n ||
    world.location !== 'grove' ||
    n.stage === 'egg' ||
    n.stage === 'cocoon' ||
    isHeld(n) ||
    n.behavior.state === 'thrown'
  ) {
    endRide(world, events, 'gone');
    return;
  }
  const k = world.keeper;
  n.pos.x = k.pos.x;
  n.pos.z = k.pos.z;
  n.y = Math.max(0, k.y);
  n.facing = k.facing;
  n.behavior.state = 'wander';
  n.behavior.untilMs = Infinity;
  if (world.edu) return;

  // Twice the walking drain while it carries the Keeper somewhere.
  if (moved > 1e-4) {
    n.needs.energy = Math.max(
      0,
      n.needs.energy - (RIDE.extraDrain * dtMs) / NEEDS.energyFullToEmptyMs,
    );
  }
  if (n.needs.energy < RIDE.tiredEnergy) {
    endRide(world, events, 'tired');
    return;
  }

  const now = world.timeMs;
  if (n.personality === 'lazy' && now >= ride.nextSitMs && moved > 1e-4) {
    ride.sitUntilMs = now + RIDE.lazySitMs;
    ride.nextSitMs = now + RIDE.lazyEveryMs;
    events.push({ kind: 'rideSat', nubbinId: n.id });
  }
  if (moved > 1e-4) {
    let turn = Math.abs(k.facing - ride.heading);
    if (turn > Math.PI) turn = 2 * Math.PI - turn;
    if (turn >= RIDE.turnRad) {
      ride.heading = k.facing;
      if (
        n.personality === 'mischievous' &&
        now >= ride.hopUntilMs &&
        roll(world, n.id) < RIDE.hopChance
      ) {
        ride.hopUntilMs = now + RIDE.hopMs;
        ride.hopSide = roll(world, `${n.id}:side`) < 0.5 ? -1 : 1;
        events.push({ kind: 'rideHopped', nubbinId: n.id });
      }
    }
  }
}

/** How the renderers seat the Keeper: height above the ground and the sideways hop sway. */
export function rideSeat(world: World): { lift: number; sway: number; scale: number } | null {
  const ride = world.ride;
  const n = rider(world);
  if (!ride || !n) return null;
  const hop =
    world.timeMs < ride.hopUntilMs
      ? Math.sin((Math.PI * (ride.hopUntilMs - world.timeMs)) / RIDE.hopMs) * ride.hopSide
      : 0;
  const tows = rideTows(n);
  return {
    lift: tows ? RIDE.seatChild : RIDE.seatAdult,
    sway: hop * RIDE.hopSway,
    scale: tows ? 1 : RIDE.keeperScale,
  };
}
