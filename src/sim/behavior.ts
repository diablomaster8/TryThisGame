import {
  BEHAVIOR,
  CURFEW,
  GROVE,
  NEEDS,
  PARTNERS,
  SIM,
  THROW,
  TRUST,
  TYPE_LEAN,
} from '../config/tuning';
import { stepWanderGag } from './slapstick';
import { isPartner } from './partners';
import {
  addHappiness,
  applyDrop,
  applyFruit,
  isExhausted,
  isHungry,
  sampleHappiness,
} from './needs';
import { isFree } from './nubbin';
import { mossOnHill, mossSeat } from './roster';
import { isWary } from './trust';
import { bestLesson, finishLesson } from './kindergarten';
import { shelterSpot } from './weather';
import { applyFlavor } from './plants';
import { bestFriend } from './friendships';
import {
  EDU_SOUL,
  FRIENDS,
  FRIENDS_AWAY,
  NUBBIN_STEER,
  PERSONALITY_LEAN,
  SLED,
} from '../config/tuning';
import { nubbinAim } from './nav';
import type { NubbinRoute } from './nav';
import { blocked, nubbinWalker, resolve, wayAt } from './obstacles';
import type { Walker } from './obstacles';
import { levelOf } from './stats';
import { TERRACES } from './terrain';
import { LESSONS } from '../config/tuning';
import { idleMultipliers, leaningPersonality } from './personality';
import { idleOdds, idleWeights } from './idle-choice';
import { bushSpot, clearHop, landingTop, perchSpot, stepHop } from './nubbin-hop';
import { perchTopAt, softAt } from './obstacles';
import { FOLLOW_SLOT, NUBBIN_JUMP } from '../config/tuning';
import { BUSH, JUMP_TOYS } from '../config/tuning-move';
import { FRUIT_BONK } from '../config/tuning-fun';
import { springBounce } from './decorate';
import { fliesLeg } from './flight';
import { FLIGHT } from '../config/tuning-look';
import type { Rng } from './rng';
import { addPoints } from './stats';
import type {
  BehaviorState,
  Flavor,
  Item,
  Nubbin,
  PlacedDecor,
  Reaction,
  SimEvent,
  Vec2,
  World,
} from './types';

const dist = (a: Vec2, b: Vec2): number => Math.hypot(a.x - b.x, a.z - b.z);

export function inPond(p: Vec2): boolean {
  return dist(p, GROVE.pond) < GROVE.pond.r - 0.3;
}

export function clampToWorld(p: Vec2): void {
  const h = SIM.worldHalf;
  p.x = Math.max(-h, Math.min(h, p.x));
  p.z = Math.max(-h, Math.min(h, p.z));
}

function setState(n: Nubbin, state: BehaviorState, now: number, durationMs: number): void {
  n.behavior.state = state;
  n.behavior.sinceMs = now;
  n.behavior.untilMs = now + durationMs;
  n.behavior.target = null;
  delete n.behavior.progress;
  n.behavior.itemId = null;
  if (state !== 'react' && state !== 'pet') n.behavior.reaction = null;
}

export function react(n: Nubbin, reaction: Reaction, now: number, events: SimEvent[]): void {
  if (!isFree(n) && n.behavior.state !== 'react') {
    // Held or thrown Nubbins still show the face, they just do not change state.
    n.behavior.reaction = reaction;
  } else {
    setState(n, 'react', now, BEHAVIOR.reactMs);
    n.behavior.reaction = reaction;
  }
  events.push({ kind: 'reaction', nubbinId: n.id, reaction });
}

/**
 * The Keeper's hand on the head: a free Nubbin turns to the Keeper and holds the pet
 * pose for a moment (the renderers lean it into the hand and raise hearts); a held one
 * only shows the face, as with any reaction.
 */
export function pet(n: Nubbin, from: Vec2, now: number, events: SimEvent[]): void {
  if (!isFree(n)) {
    react(n, 'love', now, events);
    return;
  }
  setState(n, 'pet', now, BEHAVIOR.petMs);
  n.behavior.reaction = 'love';
  const dx = from.x - n.pos.x;
  const dz = from.z - n.pos.z;
  if (Math.hypot(dx, dz) > 1e-3) n.facing = Math.atan2(dx, dz);
  events.push({ kind: 'reaction', nubbinId: n.id, reaction: 'love' });
}

function randomPoint(rng: Rng, around: Vec2, radius: number): Vec2 {
  const a = rng.float(0, Math.PI * 2);
  const r = rng.float(radius * 0.3, radius);
  const p = { x: around.x + Math.cos(a) * r, z: around.z + Math.sin(a) * r };
  clampToWorld(p);
  return p;
}

/**
 * A target a Nubbin can stand on (MOVE-29): one inside a wall, a rock, a lantern or a hill,
 * or in the pond for a Nubbin that does not swim (unless it is off for a `swim`), is drawn
 * again up to `NUBBIN_STEER.resample` times.
 */
function standablePoint(
  rng: Rng,
  world: World,
  n: Nubbin,
  around: Vec2,
  radius: number,
  swim = false,
): Vec2 {
  const who = nubbinWalker(n);
  const wet = !swim && !swimmer(n);
  let p = randomPoint(rng, around, radius);
  for (let i = 0; i < NUBBIN_STEER.resample; i++) {
    if (!blocked(p, world, NUBBIN_STEER.radius, who) && !(wet && inPond(p))) break;
    p = randomPoint(rng, around, radius);
  }
  // Still in something solid after every draw: step it out to the nearest edge instead.
  resolve(p, world, NUBBIN_STEER.radius, who);
  return p;
}

/** A Nubbin at home in the water: a Swim form, a strong Swim lean or a trained swimmer. */
function swimmer(n: Nubbin): boolean {
  return n.form?.type === 'swim' || n.typeLean.swim > 40 || levelOf(n.stats.swim.points) >= 10;
}

// Each walker's steering memory: which way it last turned aside, so it keeps to one side of
// a wall instead of dithering, and how many more steps a clear look ahead of the same
// heading still covers. Transient: keyed by the Nubbin object, never saved.
interface Steering {
  side: number;
  skip: number;
  ux: number;
  uz: number;
  route: NubbinRoute | null;
  /** The walk `walkStalled` is watching (its state's start), its first and best distance. */
  since: number;
  d0: number;
  bestD: number;
  bestAt: number;
}
const steering = new WeakMap<Nubbin, Steering>();

function steeringOf(n: Nubbin): Steering {
  let st = steering.get(n);
  if (!st) {
    st = { side: 1, skip: 0, ux: 0, uz: 0, route: null, since: -1, d0: 0, bestD: 0, bestAt: 0 };
    steering.set(n, st);
  }
  return st;
}
const probeAt: Vec2 = { x: 0, z: 0 };
// Read once: walkToward runs for every walking Nubbin on every step.
const BODY = NUBBIN_STEER.radius;
const PROBE = NUBBIN_STEER.probe;
const PROBE_EVERY = NUBBIN_STEER.probeEvery;
const NAV_FAR = NUBBIN_STEER.navFar;
/** The direction `steer` chose, as a unit vector. */
const way: Vec2 = { x: 0, z: 0 };
/** The turns tried when blocked, nearest first, as [cos, sin]. */
const TURNS = NUBBIN_STEER.turnsDeg.map((deg) => {
  const a = (deg * Math.PI) / 180;
  return [Math.cos(a), Math.sin(a)] as const;
});

/** Whether a probe at (x, z) meets something solid (2), only a bush (1) or nothing (0). */
function probe(world: World, who: Walker, x: number, z: number): number {
  probeAt.x = x;
  probeAt.z = z;
  return wayAt(probeAt, world, BODY, who);
}

/**
 * Which way a walking Nubbin heads along the unit direction (ux, uz) (MOVE-29): straight
 * when the way ahead is open, else the nearer of ±35° and then ±70° that is, keeping to the
 * side it turned last. Writes the choice to `way` and returns what was straight ahead: 0
 * nothing, 1 a bush, 2 something solid (3 when solid and no turn was clear either, and the
 * walker goes straight on for `resolve` to slide it). A clear look ahead is trusted for the
 * next few steps of the same heading, so a walk on open ground probes now and then.
 */
function steer(
  world: World,
  n: Nubbin,
  st: Steering,
  ux: number,
  uz: number,
  ahead: number,
): number {
  way.x = ux;
  way.z = uz;
  // Within about 3° of the heading the last clear probe looked along.
  if (st.skip > 0 && ux * st.ux + uz * st.uz > 0.9986) {
    st.skip--;
    return 0;
  }
  st.ux = ux;
  st.uz = uz;
  const who = nubbinWalker(n);
  const sx = n.pos.x;
  const sz = n.pos.z;
  const straight = probe(world, who, sx + ux * ahead, sz + uz * ahead);
  if (straight === 0) {
    st.skip = PROBE_EVERY - 1;
    return 0;
  }
  st.skip = 0;
  for (const [c, s0] of TURNS) {
    for (let k = 0, side = st.side; k < 2; k++, side = -side) {
      const s = s0 * side;
      // The heading turned by the angle: (x, z) = (sin h, cos h) rotated.
      const vx = ux * c + uz * s;
      const vz = uz * c - ux * s;
      if (probe(world, who, sx + vx * ahead, sz + vz * ahead) === 0) {
        st.side = side;
        way.x = vx;
        way.z = vz;
        return straight;
      }
    }
  }
  return straight === 2 ? 3 : 1;
}

/**
 * Step toward `target`; returns true on arrival. A walk looks ahead and turns aside from
 * walls and bushes, and long walks or walks behind something solid follow a planned path
 * (MOVE-29); `resolve` in the world step still pushes out whatever slips through.
 */
function walkToward(
  world: World,
  n: Nubbin,
  target: Vec2,
  speed: number,
  dtMs: number,
  reach: number = BEHAVIOR.arriveRadius,
): boolean {
  const d = dist(n.pos, target);
  const st = steeringOf(n);
  if (d <= reach) {
    st.route = null;
    return true;
  }
  const ahead = Math.min(PROBE, Math.max(d - reach, 0.05));
  // Short walks on open ground never touch the planner.
  let aim =
    st.route || d > NAV_FAR
      ? nubbinAim(world, st, nubbinWalker(n), n.pos, target, d > NAV_FAR ? 1 : 0)
      : target;
  let ax = aim.x - n.pos.x;
  let az = aim.z - n.pos.z;
  let l = Math.hypot(ax, az) || 1;
  const met = steer(world, n, st, ax / l, az / l, ahead);
  if (met >= 2) {
    // Something solid stands in the way: ask for a path round it, planned at most every few
    // seconds and only past a long blocker, or past any when no heading was clear.
    const next = nubbinAim(world, st, nubbinWalker(n), n.pos, target, met === 3 ? 2 : 1);
    if (next !== aim) {
      aim = next;
      ax = aim.x - n.pos.x;
      az = aim.z - n.pos.z;
      l = Math.hypot(ax, az) || 1;
      steer(world, n, st, ax / l, az / l, ahead);
    }
  }
  const step = Math.min(d, speed * (dtMs / 1000));
  n.pos.x += way.x * step;
  n.pos.z += way.z * step;
  n.facing = Math.atan2(way.x, way.z);
  return dist(n.pos, target) <= reach;
}

/**
 * `approachStalled` for a walk to a perform spot (a sled run, a bath), with the progress
 * kept in the transient steering state: adding and deleting `behavior.progress` on every
 * walk would turn the behaviour object into a slow dictionary for the rest of the session.
 */
function walkStalled(n: Nubbin, target: Vec2, now: number): boolean {
  const st = steeringOf(n);
  const d = dist(n.pos, target);
  if (st.since !== n.behavior.sinceMs) {
    st.since = n.behavior.sinceMs;
    st.d0 = st.bestD = d;
    st.bestAt = now;
    return false;
  }
  const allowed = Math.max(BEHAVIOR.approachTimeoutMs, (st.d0 / BEHAVIOR.walkSpeed) * 1500);
  if (now - st.since > allowed) return true;
  if (d < st.bestD - BEHAVIOR.progressMin) {
    st.bestD = d;
    st.bestAt = now;
    return false;
  }
  return now - st.bestAt > BEHAVIOR.progressWindowMs;
}

/**
 * SOUL-01: true when a walk that has not arrived should be given up. Colliders and crowding
 * can keep a Nubbin from ever reaching its target, and walking states used to wait forever.
 */
function approachStalled(n: Nubbin, target: Vec2, now: number, far = false): boolean {
  const b = n.behavior;
  const d = dist(n.pos, target);
  const d0 = b.progress?.d0 ?? d;
  // Fruit (`far`) can be a long walk, so its time grows with the starting distance: walk
  // speed is per second, so 1.5× the walk time is d0 / speed × 1500 ms. Toys get the flat cap.
  const walkMs = far ? (d0 / BEHAVIOR.walkSpeed) * 1500 : 0;
  const allowed = Math.max(BEHAVIOR.approachTimeoutMs, walkMs);
  if (now - b.sinceMs > allowed) return true;
  if (!b.progress || d < b.progress.d - BEHAVIOR.progressMin) {
    b.progress = { d, atMs: now, d0 };
    return false;
  }
  return now - b.progress.atMs > BEHAVIOR.progressWindowMs;
}

function skipItem(n: Nubbin, id: string, now: number): void {
  n.behavior.skipItemId = id;
  n.behavior.skipItemUntilMs = now + BEHAVIOR.skipItemMs;
}

/** The item this Nubbin gave up on recently, if any. */
function skipping(n: Nubbin, now: number): string | null {
  const b = n.behavior;
  return b.skipItemId !== undefined && now < (b.skipItemUntilMs ?? 0) ? b.skipItemId : null;
}

function nearestFruit(world: World, from: Vec2, skip: string | null = null): string | null {
  let best: string | null = null;
  let bestD: number = BEHAVIOR.foodSearchRadius;
  for (const item of world.items) {
    if (item.kind !== 'fruit' || item.y > 0.05 || item.id === skip) continue;
    const d = dist(from, item.pos);
    if (d < bestD) {
      bestD = d;
      best = item.id;
    }
  }
  return best;
}

function nearestToy(world: World, from: Vec2): Item | null {
  let best: Item | null = null;
  let bestD = Infinity;
  for (const item of world.items) {
    if (item.kind !== 'toy') continue;
    const d = dist(from, item.pos);
    if (d < bestD) {
      bestD = d;
      best = item;
    }
  }
  return best;
}

// R0300: when each Nubbin last had fruit land on its head (sim ms); transient.
const bonkedAt = new WeakMap<Nubbin, number>();

/**
 * R0300 (FUN-11): a fruit shaken from a tree lands on the head of a free Nubbin standing
 * under it (the nearest, once per cooldown). The fruit drops beside it; a hungry Nubbin
 * eats it there and then, a full one looks up at the tree in outrage. No harm, no stats.
 */
export function fruitOnHead(world: World, fruit: Item, tree: Vec2, events: SimEvent[]): void {
  const now = world.timeMs;
  let best: Nubbin | null = null;
  let bestD: number = FRUIT_BONK.reach;
  for (const n of world.nubbins) {
    if (n.stage === 'egg' || n.stage === 'cocoon' || !isFree(n) || n.y > 0) continue;
    if (now - (bonkedAt.get(n) ?? -Infinity) < FRUIT_BONK.cooldownMs) continue;
    const s = n.behavior.state;
    if (s === 'nap' || s === 'held' || s === 'carried' || s === 'thrown') continue;
    const d = Math.hypot(n.pos.x - tree.x, n.pos.z - tree.z);
    if (d < bestD) {
      best = n;
      bestD = d;
    }
  }
  if (!best) return;
  bonkedAt.set(best, now);
  fruit.pos = { x: best.pos.x + 0.3, z: best.pos.z };
  events.push({ kind: 'bonked', nubbinId: best.id, by: 'fruit' });
  if (isHungry(best)) {
    setState(best, 'findFood', now, FRUIT_BONK.eatMs);
    best.behavior.itemId = fruit.id;
    best.behavior.target = { ...fruit.pos };
  } else {
    best.facing = Math.atan2(tree.x - best.pos.x, tree.z - best.pos.z);
    react(best, 'surprised', now, events);
  }
}

/** MOVE-57: the nearest placed spring mushroom within reach, in the home Grove only. */
function nearestShroom(world: World, from: Vec2): PlacedDecor | null {
  if (world.location !== 'grove') return null;
  let best: PlacedDecor | null = null;
  let bestD: number = JUMP_TOYS.nubbinReach;
  for (const d of world.placed) {
    if (d.kind !== 'springShroom') continue;
    const dist = Math.hypot(d.pos.x - from.x, d.pos.z - from.z);
    if (dist < bestD) {
      best = d;
      bestD = dist;
    }
  }
  return best;
}

/**
 * MOVE-57: walk to the mushroom, then bounce on its cap until the play time is up, and hop
 * off the front with a little happiness.
 */
function playOnShroom(
  n: Nubbin,
  world: World,
  shroom: PlacedDecor,
  rng: Rng,
  dtMs: number,
  now: number,
  events: SimEvent[],
): void {
  const b = n.behavior;
  if (b.target) {
    if (!walkToward(world, n, b.target, BEHAVIOR.walkSpeed, dtMs, BEHAVIOR.toyReach + 0.3)) {
      if (approachStalled(n, b.target, now)) {
        skipItem(n, shroom.id, now);
        chooseIdle(n, world, rng, now);
      }
      return;
    }
    b.untilMs = now + (b.untilMs - b.sinceMs);
    b.target = null;
    n.pos = { x: shroom.pos.x, z: shroom.pos.z };
  }
  if (now >= b.untilMs) {
    n.pos = {
      x: shroom.pos.x + Math.sin(n.facing) * 0.8,
      z: shroom.pos.z + Math.cos(n.facing) * 0.8,
    };
    clampToWorld(n.pos);
    addHappiness(n, JUMP_TOYS.nubbinHappiness);
    chooseIdle(n, world, rng, now);
    return;
  }
  if (now % JUMP_TOYS.nubbinHopMs < dtMs) springBounce(world, shroom, events, n.id);
}

/**
 * MOVE-57: how high a Nubbin bouncing on a spring mushroom is above the ground at sim time
 * `t` (the renderers pass an in-between time), or null when it isn't on one. The bounce is
 * drawn only: the sim keeps the Nubbin's `y` at 0 so nothing else ever sees it airborne.
 */
export function shroomHopY(world: World, n: Nubbin, t: number): number | null {
  const b = n.behavior;
  if (b.state !== 'play' || b.target || !b.itemId) return null;
  if (!world.placed.some((d) => d.id === b.itemId && d.kind === 'springShroom')) return null;
  const hop = JUMP_TOYS.nubbinHopMs;
  const p = (((t % hop) + hop) % hop) / hop;
  return JUMP_TOYS.colliders.springShroom.top + JUMP_TOYS.nubbinHop * 4 * p * (1 - p);
}

function chooseIdle(n: Nubbin, world: World, rng: Rng, now: number): void {
  // Curfew: late at night they would rather sleep.
  if (world.night && n.needs.energy < 0.9 && rng.chance(CURFEW.napChance)) {
    setState(n, 'nap', now, NEEDS.napMs);
    return;
  }
  // Partners keep near the Keeper.
  if (
    isPartner(world, n.id) &&
    dist(n.pos, world.keeper.pos) > PARTNERS.followDistance &&
    rng.chance(0.7)
  ) {
    setState(n, 'wander', now, 4000);
    // MOVE-48: to its slot behind the Keeper, not onto the Keeper's own spot.
    const k = world.keeper;
    const a = k.facing + Math.PI + (world.partners[0] === n.id ? 1 : -1) * FOLLOW_SLOT.spread;
    n.behavior.target = {
      x: k.pos.x + Math.sin(a) * FOLLOW_SLOT.slot + rng.float(-1.5, 1.5) * FOLLOW_SLOT.jitter,
      z: k.pos.z + Math.cos(a) * FOLLOW_SLOT.slot + rng.float(-1.5, 1.5) * FOLLOW_SLOT.jitter,
    };
    return;
  }
  // MOVE-30: a Mischievous Nubbin climbs a bench or a rock it can reach, and sits up there.
  if (n.personality === 'mischievous' && nubbinWalker(n) === 'hopper') {
    if (n.y > 0.2 && rng.chance(0.6)) {
      setState(n, 'sit', now, rng.float(...BEHAVIOR.sitMs));
      return;
    }
    const spot = rng.chance(NUBBIN_JUMP.perchChance) ? perchSpot(world, n) : null;
    if (spot) {
      setState(n, 'wander', now, BEHAVIOR.wanderMs[1]);
      n.behavior.target = spot;
      return;
    }
  }
  // MOVE-43: a Shy Nubbin likes to sit tucked in a bush: it goes to one, then sits there.
  if (n.personality === 'shy' && n.stage !== 'egg') {
    const tucked = softAt(n.pos, world, 0);
    if (tucked && rng.chance(0.7)) {
      setState(n, 'sit', now, rng.float(...BEHAVIOR.sitMs));
      return;
    }
    const bush = !tucked && rng.chance(BUSH.shyChance) ? bushSpot(world, n, BUSH.shyRadius) : null;
    if (bush) {
      setState(n, 'wander', now, BEHAVIOR.wanderMs[1]);
      n.behavior.target = bush;
      return;
    }
  }
  // Personality only shifts the odds of idle choices; a child's leaning does, at half
  // strength, until it locks at evolution (R0523).
  const m = n.personality
    ? idleMultipliers(n.personality)
    : idleMultipliers(leaningPersonality(n), PERSONALITY_LEAN.childStrength);
  const keeperNear = dist(n.pos, world.keeper.pos) < BEHAVIOR.greetRadius;
  // Rain: most Nubbins head for a tree; swimmers would rather be in the pond.
  if (world.weather.kind === 'rain' && n.stage !== 'egg') {
    const swimmer = n.form?.type === 'swim' || n.typeLean.swim > 40;
    if (swimmer && rng.chance(0.6)) {
      setState(n, 'swim', now, rng.float(...BEHAVIOR.swimMs));
      n.behavior.target = standablePoint(rng, world, n, GROVE.pond, GROVE.pond.r - 0.8, true);
      return;
    }
    if (!swimmer && rng.chance(0.8)) {
      setState(n, 'shelter', now, 60_000);
      n.behavior.target = shelterSpot(n.pos.x, n.pos.z);
      return;
    }
  }
  const bath = world.placed.find((d) => d.kind === 'bathhouse');
  if (bath && n.stage !== 'egg' && n.needs.happiness < 60 && rng.chance(0.08)) {
    setState(n, 'perform', now, 9000);
    n.behavior.itemId = 'bath';
    n.behavior.target = { x: bath.pos.x - 1.4, z: bath.pos.z + 1.6 };
    addHappiness(n, 6);
    n.needs.energy = Math.min(1, n.needs.energy + 0.08);
    return;
  }
  // A courting adult drifts toward the nearest other adult.
  if (n.courtingUntilMs > now && n.stage === 'adult') {
    const other = world.nubbins.find((o) => o.id !== n.id && o.stage === 'adult' && !o.eternal);
    if (other) {
      setState(n, 'court', now, 6000);
      n.behavior.target = { x: other.pos.x + 0.8, z: other.pos.z };
      return;
    }
  }
  // Snow: a slide down the hill.
  if (world.weather.kind === 'snow' && rng.chance(SLED.chance)) {
    // The run starts at the foot of the nearest hill's ramp (MOVE-29): Nubbins never climb,
    // and the old spot beside a random hill could sit in a rock or the stream.
    let t = TERRACES[0]!;
    for (const h of TERRACES) if (dist(n.pos, h) < dist(n.pos, t)) t = h;
    const leg = t.ramp[0]!;
    const r = leg.rOut + NUBBIN_STEER.sledFoot;
    const foot = { x: t.x + Math.cos(leg.a0) * r, z: t.z + Math.sin(leg.a0) * r };
    resolve(foot, world, NUBBIN_STEER.radius, nubbinWalker(n));
    setState(n, 'perform', now, SLED.durationMs);
    n.behavior.itemId = 'sled';
    n.behavior.target = foot;
    addHappiness(n, 3);
    return;
  }
  // R0539: now and then a Nubbin goes and sits a while by a departed buddy's flower.
  const missed = n.remembered?.filter((r) => now - r.atMs < FRIENDS_AWAY.visitForMs).at(-1);
  const flower = missed && world.memorials.find((m) => m.id === `memorial-${missed.id}`);
  if (flower && world.location === 'grove' && rng.chance(FRIENDS_AWAY.visitChance)) {
    setState(n, 'perform', now, FRIENDS_AWAY.visitMs);
    n.behavior.itemId = 'visitFlower';
    n.behavior.target = { x: flower.pos.x + 0.9, z: flower.pos.z + 0.3 };
    clampToWorld(n.behavior.target);
    return;
  }
  // Buddies seek each other out for a chat.
  const buddy = bestFriend(world, n);
  if (buddy && rng.chance(FRIENDS.chatChance * m.play)) {
    setState(n, 'greet', now, FRIENDS.chatMs);
    n.behavior.target = { x: buddy.pos.x + 0.9, z: buddy.pos.z };
    n.facing = Math.atan2(buddy.pos.x - n.pos.x, buddy.pos.z - n.pos.z);
    addHappiness(n, 1);
    return;
  }
  // A schooled Nubbin sometimes shows off what it learned.
  if (bestLesson(n) && rng.chance(LESSONS.performChance * m.play)) {
    setState(n, 'perform', now, LESSONS.performMs);
    n.behavior.itemId = bestLesson(n);
    addHappiness(n, 1);
    return;
  }
  // A wary Shadow Nubbin never greets; it keeps its distance instead.
  if (isWary(n) && dist(n.pos, world.keeper.pos) < TRUST.avoidRadius) {
    setState(n, 'avoid', now, 2500);
    const dx = n.pos.x - world.keeper.pos.x;
    const dz = n.pos.z - world.keeper.pos.z;
    const len = Math.hypot(dx, dz) || 1;
    n.behavior.target = { x: n.pos.x + (dx / len) * 4, z: n.pos.z + (dz / len) * 4 };
    clampToWorld(n.behavior.target);
    return;
  }
  // R0524: the everyday choice is one weighted pick (sim/idle-choice.ts), not a cascade.
  const toy = nearestToy(world, n.pos);
  const toyOk = !!toy && toy.id !== skipping(n, now);
  // MOVE-57: a spring mushroom nearby is a toy too.
  const shroom = n.stage === 'egg' ? null : nearestShroom(world, n.pos);
  const shroomOk = !!shroom && shroom.id !== skipping(n, now);
  const pick = rng.weighted(
    idleWeights({
      keeperNear,
      wary: isWary(n),
      toy: toyOk,
      shroom: shroomOk,
      canSwim: n.stage !== 'egg',
      mult: m,
    }) as Record<string, number>,
  );
  if (pick === 'greet') {
    setState(n, 'greet', now, BEHAVIOR.greetMs);
    n.facing = Math.atan2(world.keeper.pos.x - n.pos.x, world.keeper.pos.z - n.pos.z);
    return;
  }
  if (pick === 'play' && toy) {
    setState(n, 'play', now, rng.float(...BEHAVIOR.playMs));
    n.behavior.itemId = toy.id;
    n.behavior.target = { x: toy.pos.x, z: toy.pos.z };
    return;
  }
  if (pick === 'shroom' && shroom) {
    setState(n, 'play', now, rng.float(...BEHAVIOR.playMs));
    n.behavior.itemId = shroom.id;
    n.behavior.target = { x: shroom.pos.x, z: shroom.pos.z };
    return;
  }
  if (pick === 'swim') {
    setState(n, 'swim', now, rng.float(...BEHAVIOR.swimMs));
    n.behavior.target = standablePoint(rng, world, n, GROVE.pond, GROVE.pond.r - 0.8, true);
    return;
  }
  if (pick === 'sit') {
    setState(n, 'sit', now, rng.float(...BEHAVIOR.sitMs) * (n.personality === 'lazy' ? 1.5 : 1));
    return;
  }
  setState(n, 'wander', now, rng.float(...BEHAVIOR.wanderMs));
  n.behavior.target = standablePoint(rng, world, n, n.pos, 5);
}

/** R0524: the live odds of the everyday idle choice for the debug panel (no rng drawn). */
export function debugIdleOdds(world: World, n: Nubbin): Record<string, number> {
  const m = n.personality
    ? idleMultipliers(n.personality)
    : idleMultipliers(leaningPersonality(n), PERSONALITY_LEAN.childStrength);
  const now = world.timeMs;
  const toy = nearestToy(world, n.pos);
  const shroom = n.stage === 'egg' ? null : nearestShroom(world, n.pos);
  return idleOdds({
    keeperNear: dist(n.pos, world.keeper.pos) < BEHAVIOR.greetRadius,
    wary: isWary(n),
    toy: !!toy && toy.id !== skipping(n, now),
    shroom: !!shroom && shroom.id !== skipping(n, now),
    canSwim: n.stage !== 'egg',
    mult: m,
  });
}

/** One sim step for a free (not held, not egg) Nubbin. */
export function updateBehavior(
  n: Nubbin,
  world: World,
  dtMs: number,
  rng: Rng,
  events: SimEvent[],
): void {
  const now = world.timeMs;
  const b = n.behavior;

  if (b.state === 'thrown') {
    updateThrown(n, world, dtMs, now, events);
    return;
  }
  if (!isFree(n)) return;

  // Moss keeps to his seat on the western hill until the story brings him down. He is old
  // and Eternal and does not need the Keeper's fruit, so his needs stay full there.
  if (mossOnHill(world, n.id)) {
    n.needs.hunger = 1;
    n.needs.energy = 1;
    if ((b.state === 'react' || b.state === 'pet') && now < b.untilMs) return;
    const seat = mossSeat(world);
    if (dist(n.pos, seat) > BEHAVIOR.arriveRadius) {
      if (b.state !== 'wander') setState(n, 'wander', now, BEHAVIOR.wanderMs[1]);
      b.target = seat;
      walkToward(world, n, seat, BEHAVIOR.walkSpeed, dtMs);
    } else if (b.state !== 'sit') {
      setState(n, 'sit', now, BEHAVIOR.wanderMs[1]);
    }
    return;
  }

  // Needs can interrupt anything except eating, napping and reacting.
  const interruptible =
    b.state !== 'eat' &&
    b.state !== 'nap' &&
    b.state !== 'react' &&
    b.state !== 'pet' &&
    b.state !== 'lesson';
  if (interruptible && isExhausted(n)) {
    setState(n, 'nap', now, NEEDS.napMs);
    events.push({ kind: 'napStarted', nubbinId: n.id });
    return;
  }
  if (interruptible && b.state !== 'findFood' && isHungry(n)) {
    const fruit = nearestFruit(world, n.pos, skipping(n, now));
    if (fruit) {
      setState(n, 'findFood', now, Infinity);
      b.itemId = fruit;
    } else if (b.state !== 'cry' && n.needs.hunger < NEEDS.starvingThreshold) {
      setState(n, 'cry', now, BEHAVIOR.cryMs);
    }
  }

  // The Keeper coming close startles a wary Nubbin out of whatever it was doing.
  if (
    isWary(n) &&
    b.state !== 'avoid' &&
    b.state !== 'eat' &&
    b.state !== 'nap' &&
    b.state !== 'swim' &&
    dist(n.pos, world.keeper.pos) < TRUST.avoidRadius * 0.6
  ) {
    chooseIdle(n, world, rng, now);
  }

  switch (b.state) {
    case 'wander':
    case 'avoid': {
      // R0299 (FUN-10): a distracted walk can end in a bonk against a trunk.
      if (b.state === 'wander' && stepWanderGag(n, world, now, events)) break;
      // LOOK-24: a flight leg cruises faster than a walk (sim/flight.ts).
      const speed =
        b.state === 'avoid'
          ? BEHAVIOR.walkSpeed * 1.6
          : BEHAVIOR.walkSpeed * (fliesLeg(n) ? FLIGHT.speed : 1);
      if (!b.target || walkToward(world, n, b.target, speed, dtMs) || now >= b.untilMs) {
        chooseIdle(n, world, rng, now);
      }
      break;
    }
    case 'swim': {
      if (b.target && !inPond(n.pos)) {
        walkToward(world, n, b.target, BEHAVIOR.walkSpeed, dtMs);
      } else if (b.target) {
        if (walkToward(world, n, b.target, BEHAVIOR.swimSpeed, dtMs)) {
          b.target = standablePoint(rng, world, n, GROVE.pond, GROVE.pond.r - 0.8, true);
        }
        // Swimming is training: a little Swim and a little Swim lean.
        addPoints(n.stats.swim, (dtMs / 1000) * 0.5);
        n.typeLean.swim += (dtMs / 1000) * TYPE_LEAN.trainingPerSecond;
      }
      if (now >= b.untilMs) {
        // Leave the water before doing anything else.
        setState(n, 'wander', now, BEHAVIOR.wanderMs[1]);
        const shore = { x: GROVE.pond.x, z: GROVE.pond.z + GROVE.pond.r + 2 };
        b.target = standablePoint(rng, world, n, shore, 2);
      }
      break;
    }
    case 'findFood': {
      const item = world.items.find((i) => i.id === b.itemId);
      if (!item) {
        chooseIdle(n, world, rng, now);
        break;
      }
      if (walkToward(world, n, item.pos, BEHAVIOR.walkSpeed, dtMs)) {
        world.items = world.items.filter((i) => i.id !== item.id);
        eat(n, now, events, item.flavor);
      } else if (approachStalled(n, item.pos, now, true)) {
        skipItem(n, item.id, now);
        chooseIdle(n, world, rng, now);
      }
      break;
    }
    case 'play': {
      const shroom = world.placed.find((d) => d.id === b.itemId && d.kind === 'springShroom');
      if (shroom) {
        playOnShroom(n, world, shroom, rng, dtMs, now, events);
        break;
      }
      const toy = world.items.find((i) => i.id === b.itemId);
      if (!toy) {
        chooseIdle(n, world, rng, now);
        break;
      }
      if (b.target) {
        // Aim at where the toy is now, not where it was when play began.
        b.target = { x: toy.pos.x, z: toy.pos.z };
        if (!walkToward(world, n, b.target, BEHAVIOR.walkSpeed, dtMs, BEHAVIOR.toyReach)) {
          if (approachStalled(n, b.target, now)) {
            skipItem(n, toy.id, now);
            chooseIdle(n, world, rng, now);
          }
          break;
        }
        // The play timer starts on arrival, so the walk does not eat it.
        b.untilMs = now + (b.untilMs - b.sinceMs);
      }
      b.target = null;
      // Bat the toy around a little; it rolls a short way.
      if (rng.chance(0.08)) {
        const a = rng.float(0, Math.PI * 2);
        toy.pos.x += Math.cos(a) * 0.6;
        toy.pos.z += Math.sin(a) * 0.6;
        clampToWorld(toy.pos);
        addHappiness(n, BEHAVIOR.playHappiness * 0.25);
      }
      if (now >= b.untilMs) {
        // Each toy leaves something different behind.
        const kind = toy.toy ?? 'ball';
        addHappiness(n, BEHAVIOR.playHappiness * (kind === 'radio' ? 1.5 : 1));
        if (kind === 'mirror') n.needs.affection = Math.min(100, n.needs.affection + 2);
        if (kind === 'tv') n.needs.energy = Math.min(1, n.needs.energy + 0.15);
        if (kind === 'blocks') n.typeLean.power += 1;
        if (kind === 'radio' && (n.lessons?.dance ?? 0) < 1)
          n.lessons = { ...(n.lessons ?? {}), dance: 1 };
        chooseIdle(n, world, rng, now);
      }
      break;
    }
    case 'lesson': {
      if (now >= b.untilMs) {
        finishLesson(world, n, events);
        chooseIdle(n, world, rng, now);
      }
      break;
    }
    case 'shelter': {
      if (b.target) walkToward(world, n, b.target, BEHAVIOR.walkSpeed * 1.3, dtMs);
      if (world.weather.kind !== 'rain' || now >= b.untilMs) chooseIdle(n, world, rng, now);
      break;
    }
    case 'court': {
      if (
        !b.target ||
        walkToward(world, n, b.target, BEHAVIOR.walkSpeed, dtMs) ||
        now >= b.untilMs
      ) {
        chooseIdle(n, world, rng, now);
      }
      break;
    }
    case 'fetch': {
      const toy = world.items.find((i) => i.id === b.itemId);
      if (!toy || now >= b.untilMs) {
        chooseIdle(n, world, rng, now);
        break;
      }
      if (b.target) {
        // Run to the ball, then carry it back to the Keeper.
        if (walkToward(world, n, b.target, BEHAVIOR.walkSpeed * 1.5, dtMs, BEHAVIOR.toyReach)) {
          b.target = null;
        } else if (approachStalled(n, b.target, now)) {
          chooseIdle(n, world, rng, now);
        }
      } else {
        toy.pos.x = n.pos.x + Math.sin(n.facing) * 0.4;
        toy.pos.z = n.pos.z + Math.cos(n.facing) * 0.4;
        if (
          walkToward(world, n, world.keeper.pos, BEHAVIOR.walkSpeed * 1.3, dtMs) ||
          dist(n.pos, world.keeper.pos) < 1.4
        ) {
          addHappiness(n, BEHAVIOR.playHappiness);
          react(n, 'happy', now, events);
        }
      }
      break;
    }
    case 'perform': {
      // A sled run or a bath has a spot: walk there first, and the act's timer starts on
      // arrival (MOVE-29; the spot used to be set and never walked to).
      if (b.target) {
        if (walkToward(world, n, b.target, BEHAVIOR.walkSpeed, dtMs)) {
          b.untilMs = now + (b.untilMs - b.sinceMs);
          b.target = null;
        } else if (walkStalled(n, b.target, now)) {
          b.target = null;
        }
        break;
      }
      if (now >= b.untilMs) chooseIdle(n, world, rng, now);
      break;
    }
    case 'eat':
    case 'sit':
    case 'greet':
    case 'cry':
    case 'pet':
    case 'react': {
      if (now >= b.untilMs) {
        b.reaction = null;
        chooseIdle(n, world, rng, now);
      }
      break;
    }
    case 'nap': {
      if (now >= b.untilMs || n.needs.energy >= 1) {
        n.needs.energy = Math.max(n.needs.energy, 0.6);
        chooseIdle(n, world, rng, now);
      }
      break;
    }
    default:
      chooseIdle(n, world, rng, now);
  }

  stepHop(n, world, events);
  if (!inPond(n.pos) && b.state !== 'swim') clampToWorld(n.pos);
}

export function eat(n: Nubbin, now: number, events: SimEvent[], flavor?: Flavor): void {
  applyFruit(n);
  applyFlavor(n, flavor);
  addPoints(n.stats.stamina, NEEDS.fruitStaminaPoints);
  setState(n, 'eat', now, BEHAVIOR.eatMs);
  events.push({ kind: 'ate', nubbinId: n.id });
}

export function startThrow(n: Nubbin, vel: Vec2, now: number, events: SimEvent[]): void {
  const speed = Math.hypot(vel.x, vel.z);
  const s = Math.min(THROW.maxSpeed, speed);
  const k = speed > 0 ? s / speed : 0;
  n.vel = { x: vel.x * k, y: THROW.lift, z: vel.z * k };
  if (n.y <= 0) n.y = 0.1;
  setState(n, 'thrown', now, Infinity);
  n.behavior.reaction = 'surprised';
  events.push({ kind: 'thrown', nubbinId: n.id });
}

function updateThrown(
  n: Nubbin,
  world: World,
  dtMs: number,
  now: number,
  events: SimEvent[],
): void {
  const dt = dtMs / 1000;
  n.vel.y -= THROW.gravity * dt;
  n.pos.x += n.vel.x * dt;
  n.pos.z += n.vel.z * dt;
  n.y += n.vel.y * dt;
  clampToWorld(n.pos);
  // R0299 (FUN-10): a throw into a trunk or a wall (the Keeper's solids, since Nubbins
  // walk through trunks) stops dead there ("splat") and drops
  // straight down. Only the throw's own landing penalty applies; the splat adds no harm.
  if (
    world.location === 'grove' &&
    (n.vel.x !== 0 || n.vel.z !== 0) &&
    resolve(n.pos, world, 0.3, 'keeper', n.y)
  ) {
    n.vel.x = 0;
    n.vel.z = 0;
    events.push({ kind: 'bonked', nubbinId: n.id, by: 'obstacle' });
  }
  // MOVE-30: it can come down on a bench or a rock top it falls onto.
  const floor = n.vel.y < 0 ? perchTopAt(world, n.pos.x, n.pos.z) : 0;
  if (n.y <= floor) {
    n.y = landingTop(n, world);
    n.vel = { x: 0, y: 0, z: 0 };
    events.push({ kind: 'landed', nubbinId: n.id });
    // Back on the ground first, so the reaction below replaces 'thrown' rather than
    // being swallowed by the held/thrown guard in react().
    setState(n, 'sit', now, 0);
    if (n.stage !== 'egg') {
      // R0527: in the Learning Grove it lands on its feet and giggles.
      if (world.edu) {
        addHappiness(n, EDU_SOUL.tossHappiness);
        react(n, 'happy', now, events);
      } else {
        applyDrop(n);
        react(n, 'dizzy', now, events);
      }
    }
  }
}

/** Dropping (gentle put-down) is kinder than throwing but still not welcome. */
export function putDown(
  n: Nubbin,
  now: number,
  events: SimEvent[],
  reaction: Reaction = 'confused',
): void {
  n.y = 0;
  clearHop(n);
  n.vel = { x: 0, y: 0, z: 0 };
  setState(n, 'sit', now, 0);
  if (n.stage === 'egg') return;
  react(n, reaction, now, events);
}

export function sampleAll(world: World): void {
  for (const n of world.nubbins) if (n.stage !== 'egg') sampleHappiness(n);
}

export function cheerUp(n: Nubbin, amount: number): void {
  addHappiness(n, amount);
}
