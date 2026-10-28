/**
 * Nubbin hops (MOVE-30). A Nubbin's jump comes from its Run and Fly levels; it hops up onto
 * what it walks into (a bench, a rock), over a log, and down again, and it hops on the spot
 * for joy as often as its personality likes. The arc is the sim's own `n.y`, so both
 * renderers draw it with no extra state. Timing comes from the Nubbin's seed, not the rng,
 * so adding hops changes no other random draw; the arc state is transient (a reload lands a
 * hop at once).
 */
import { NUBBIN_JUMP } from '../config/tuning-move-nub';
import { JUMP } from '../config/tuning-sim';
import { nubbinWalker, obstacles, perchTopAt, resolve } from './obstacles';
import { groveHeight } from './terrain';
import { isFree } from './nubbin';
import { levelOf } from './stats';
import type { Nubbin, SimEvent, Vec2, World } from './types';

/** How high (units) a Nubbin can jump from the ground. */
export function nubbinJump(n: Nubbin): number {
  const j =
    NUBBIN_JUMP.base +
    NUBBIN_JUMP.perRun * levelOf(n.stats.run.points) +
    NUBBIN_JUMP.perFly * levelOf(n.stats.fly.points);
  return n.stage === 'child' ? j * NUBBIN_JUMP.child : j;
}

/** Flaps a Nubbin has in the air: one with Fly high enough, else none. */
export function nubbinAirJumps(n: Nubbin): number {
  return levelOf(n.stats.fly.points) >= NUBBIN_JUMP.airJumpFly ? 1 : 0;
}

/** The highest top a Nubbin reaches, a flap included. */
export function nubbinReach(n: Nubbin): number {
  return nubbinJump(n) + (nubbinAirJumps(n) > 0 ? NUBBIN_JUMP.flapExtra : 0);
}

/** The highest top a Nubbin climbs onto by itself: none for a Lazy one (it walks round). */
function climbCap(n: Nubbin): number {
  return n.personality === 'lazy' ? 0 : nubbinReach(n);
}

/**
 * Push a free Nubbin out of what stops it. A bench or rock top it can climb does not stop
 * it (it hops up in `stepHop`), and one already up on a top stays there.
 */
export function resolveNubbin(n: Nubbin, world: World | null): boolean {
  const lift = Math.max(n.y, climbCap(n));
  const feetY = lift > 0.05 ? groveHeight(n.pos.x, n.pos.z) + lift - JUMP.stepUp : undefined;
  return resolve(n.pos, world, 0.3, nubbinWalker(n), feetY);
}

interface Hop {
  from: number;
  to: number;
  t0: number;
  peak: number;
  /** The top it last stood on, so a step onto a new one starts a hop. */
  on: number;
  last: Vec2;
  /** When the next joy hop is due (sim ms), or 0 when not yet drawn. */
  nextJoy: number;
  joys: number;
  /** A hop is under way. */
  live: boolean;
}

const hops = new WeakMap<Nubbin, Hop>();

function hopOf(n: Nubbin): Hop {
  let h = hops.get(n);
  if (!h) {
    h = {
      from: n.y,
      to: n.y,
      t0: 0,
      peak: 0,
      on: n.y,
      last: { x: n.pos.x, z: n.pos.z },
      nextJoy: 0,
      joys: 0,
      live: false,
    };
    hops.set(n, h);
  }
  return h;
}

/** A hash in [0, 1) from the Nubbin's seed and a counter. */
function seeded(seed: number, k: number): number {
  let x = (seed ^ Math.imul(k + 1, 0x9e3779b1)) >>> 0;
  x = Math.imul(x ^ (x >>> 16), 0x45d9f3b) >>> 0;
  x = Math.imul(x ^ (x >>> 16), 0x45d9f3b) >>> 0;
  return ((x ^ (x >>> 16)) >>> 0) / 4294967296;
}

function startHop(n: Nubbin, h: Hop, to: number, peak: number, now: number, events: SimEvent[]) {
  h.from = n.y;
  h.to = to;
  h.t0 = now;
  h.peak = peak;
  h.live = true;
  events.push({ kind: 'nubbinHop', nubbinId: n.id });
}

/** Hop on the spot now (joy, or a Shy start). */
export function hopInPlace(n: Nubbin, now: number, events: SimEvent[]): void {
  const h = hopOf(n);
  if (h.live) return;
  startHop(n, h, h.on, nubbinJump(n) * NUBBIN_JUMP.happyArc, now, events);
}

const JOY_STATES = new Set(['sit', 'wander', 'greet', 'play']);

/**
 * One step of a free Nubbin's hops: onto or off what it walked into, a joy hop when due,
 * and the arc. Costs one map lookup for a Nubbin standing still on the ground.
 */
export function stepHop(n: Nubbin, world: World, events: SimEvent[]): void {
  if (n.stage === 'egg') return;
  const now = world.timeMs;
  const h = hopOf(n);
  const moved = h.last.x !== n.pos.x || h.last.z !== n.pos.z;
  if (moved) {
    h.last.x = n.pos.x;
    h.last.z = n.pos.z;
    // Too high to reach: it stays on the ground (the steering walks it round).
    const top = perchTopAt(world, n.pos.x, n.pos.z, climbCap(n));
    if (top !== h.on) {
      h.on = top;
      startHop(n, h, top, nubbinJump(n) * NUBBIN_JUMP.arc, now, events);
    }
  }
  // Joy hops: by personality, only when happy and idle.
  const every = NUBBIN_JUMP.happyEvery[n.personality ?? 'none'];
  if (every && n.needs.happiness >= NUBBIN_JUMP.happyAt && JOY_STATES.has(n.behavior.state)) {
    if (h.nextJoy === 0 || h.nextJoy > now + every[1] * 1000) {
      h.nextJoy = now + 1000 * (every[0] + (every[1] - every[0]) * seeded(n.seed, h.joys++));
    } else if (now >= h.nextJoy) {
      h.nextJoy = 0;
      hopInPlace(n, now, events);
    }
  }
  if (!h.live) {
    if (n.y !== h.on && !moved) n.y = h.on;
    return;
  }
  const t = Math.min(1, (now - h.t0) / NUBBIN_JUMP.hopMs);
  n.y = h.from + (h.to - h.from) * t + 4 * h.peak * t * (1 - t);
  if (t >= 1) {
    n.y = h.to;
    h.live = false;
  }
}

/** Where a thrown Nubbin comes down: on a bench or rock top it falls onto, else the ground. */
export function landingTop(n: Nubbin, world: World): number {
  const top = perchTopAt(world, n.pos.x, n.pos.z, Math.max(n.y, climbCap(n)));
  const h = hopOf(n);
  h.last.x = n.pos.x;
  h.last.z = n.pos.z;
  h.live = false;
  h.on = top;
  return top;
}

/** A held or put-down Nubbin forgets its perch (it is set down on the ground). */
export function clearHop(n: Nubbin): void {
  hops.delete(n);
}

/** MOVE-30: a Shy Nubbin hops back from the Keeper landing near it. */
export function shyHopBack(world: World, at: Vec2, events: SimEvent[]): void {
  const now = world.timeMs;
  for (const n of world.nubbins) {
    if (n.personality !== 'shy' || n.stage === 'egg') continue;
    const b = n.behavior;
    if (!isFree(n)) continue;
    if (b.state === 'thrown' || b.state === 'nap' || b.state === 'eat' || b.state === 'swim')
      continue;
    const dx = n.pos.x - at.x;
    const dz = n.pos.z - at.z;
    const d = Math.hypot(dx, dz);
    if (d > NUBBIN_JUMP.shyRadius) continue;
    hopInPlace(n, now, events);
    const l = d || 1;
    b.state = 'avoid';
    b.sinceMs = now;
    b.untilMs = now + 1500;
    b.itemId = null;
    b.target = {
      x: n.pos.x + (dx / l) * NUBBIN_JUMP.shyBack,
      z: n.pos.z + (dz / l) * NUBBIN_JUMP.shyBack,
    };
  }
}

/** MOVE-30: the nearest bench or rock top a Nubbin can climb, for a Mischievous idle. */
export function perchSpot(world: World, n: Nubbin): Vec2 | null {
  const reach = nubbinReach(n);
  let best: Vec2 | null = null;
  let bestD: number = NUBBIN_JUMP.perchRadius;
  for (const c of obstacles(world)) {
    const f = c.flags;
    if (!f.includes('standable') || f.includes('keeperOnly') || c.top > reach) continue;
    const d = Math.hypot(c.x - n.pos.x, c.z - n.pos.z);
    if (d < bestD) {
      bestD = d;
      best = { x: c.x, z: c.z };
    }
  }
  return best;
}

/** MOVE-43: the nearest wild bush for a Shy Nubbin to sit in, or null. */
export function bushSpot(world: World, n: Nubbin, radius: number): Vec2 | null {
  let best: Vec2 | null = null;
  let bestD = radius;
  for (const c of obstacles(world)) {
    if (!c.flags.includes('soft') || !c.id.startsWith('wild-')) continue;
    const d = Math.hypot(c.x - n.pos.x, c.z - n.pos.z);
    if (d < bestD) {
      bestD = d;
      best = { x: c.x, z: c.z };
    }
  }
  return best;
}
