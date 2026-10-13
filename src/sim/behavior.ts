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
import { isWary } from './trust';
import { bestLesson, finishLesson } from './kindergarten';
import { shelterSpot } from './weather';
import { applyFlavor } from './plants';
import { bestFriend } from './friendships';
import { FRIENDS, SLED } from '../config/tuning';
import { LESSONS } from '../config/tuning';
import { idleMultipliers } from './personality';
import type { Rng } from './rng';
import { addPoints } from './stats';
import type { BehaviorState, Flavor, Item, Nubbin, Reaction, SimEvent, Vec2, World } from './types';

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
  n.behavior.itemId = null;
  if (state !== 'react') n.behavior.reaction = null;
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

function randomPoint(rng: Rng, around: Vec2, radius: number): Vec2 {
  const a = rng.float(0, Math.PI * 2);
  const r = rng.float(radius * 0.3, radius);
  const p = { x: around.x + Math.cos(a) * r, z: around.z + Math.sin(a) * r };
  clampToWorld(p);
  return p;
}

/** Step toward `target`; returns true on arrival. */
function walkToward(n: Nubbin, target: Vec2, speed: number, dtMs: number): boolean {
  const d = dist(n.pos, target);
  if (d <= BEHAVIOR.arriveRadius) return true;
  const step = Math.min(d, speed * (dtMs / 1000));
  const dx = (target.x - n.pos.x) / d;
  const dz = (target.z - n.pos.z) / d;
  n.pos.x += dx * step;
  n.pos.z += dz * step;
  n.facing = Math.atan2(dx, dz);
  return dist(n.pos, target) <= BEHAVIOR.arriveRadius;
}

function nearestFruit(world: World, from: Vec2): string | null {
  let best: string | null = null;
  let bestD: number = BEHAVIOR.foodSearchRadius;
  for (const item of world.items) {
    if (item.kind !== 'fruit' || item.y > 0.05) continue;
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
    n.behavior.target = {
      x: world.keeper.pos.x + rng.float(-1.5, 1.5),
      z: world.keeper.pos.z + rng.float(-1.5, 1.5),
    };
    return;
  }
  // Personality only shifts the odds of idle choices.
  const m = idleMultipliers(n.personality);
  const keeperNear = dist(n.pos, world.keeper.pos) < BEHAVIOR.greetRadius;
  // Rain: most Nubbins head for a tree; swimmers would rather be in the pond.
  if (world.weather.kind === 'rain' && n.stage !== 'egg') {
    const swimmer = n.form?.type === 'swim' || n.typeLean.swim > 40;
    if (swimmer && rng.chance(0.6)) {
      setState(n, 'swim', now, rng.float(...BEHAVIOR.swimMs));
      n.behavior.target = randomPoint(rng, GROVE.pond, GROVE.pond.r - 0.8);
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
    const hill = rng.pick([...GROVE.hills]);
    setState(n, 'perform', now, SLED.durationMs);
    n.behavior.itemId = 'sled';
    n.behavior.target = { x: hill.x + hill.r + 0.8, z: hill.z + 0.5 };
    addHappiness(n, 3);
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
  if (keeperNear && !isWary(n) && rng.chance(Math.min(1, BEHAVIOR.greetChance * m.greet))) {
    setState(n, 'greet', now, BEHAVIOR.greetMs);
    n.facing = Math.atan2(world.keeper.pos.x - n.pos.x, world.keeper.pos.z - n.pos.z);
    return;
  }
  const toy = nearestToy(world, n.pos);
  if (toy && rng.chance(Math.min(1, BEHAVIOR.playChance * m.play))) {
    setState(n, 'play', now, rng.float(...BEHAVIOR.playMs));
    n.behavior.itemId = toy.id;
    n.behavior.target = { x: toy.pos.x, z: toy.pos.z };
    return;
  }
  if (n.stage !== 'egg' && rng.chance(Math.min(1, BEHAVIOR.swimChance * m.swim))) {
    setState(n, 'swim', now, rng.float(...BEHAVIOR.swimMs));
    n.behavior.target = randomPoint(rng, GROVE.pond, GROVE.pond.r - 0.8);
    return;
  }
  if (rng.chance(Math.min(1, BEHAVIOR.sitChance * m.sit))) {
    setState(n, 'sit', now, rng.float(...BEHAVIOR.sitMs) * (n.personality === 'lazy' ? 1.5 : 1));
    return;
  }
  setState(n, 'wander', now, rng.float(...BEHAVIOR.wanderMs));
  n.behavior.target = randomPoint(rng, n.pos, 5);
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
    updateThrown(n, dtMs, now, events);
    return;
  }
  if (!isFree(n)) return;

  // Needs can interrupt anything except eating, napping and reacting.
  const interruptible =
    b.state !== 'eat' && b.state !== 'nap' && b.state !== 'react' && b.state !== 'lesson';
  if (interruptible && isExhausted(n)) {
    setState(n, 'nap', now, NEEDS.napMs);
    events.push({ kind: 'napStarted', nubbinId: n.id });
    return;
  }
  if (interruptible && b.state !== 'findFood' && isHungry(n)) {
    const fruit = nearestFruit(world, n.pos);
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
      const speed = b.state === 'avoid' ? BEHAVIOR.walkSpeed * 1.6 : BEHAVIOR.walkSpeed;
      if (!b.target || walkToward(n, b.target, speed, dtMs) || now >= b.untilMs) {
        chooseIdle(n, world, rng, now);
      }
      break;
    }
    case 'swim': {
      if (b.target && !inPond(n.pos)) {
        walkToward(n, b.target, BEHAVIOR.walkSpeed, dtMs);
      } else if (b.target) {
        if (walkToward(n, b.target, BEHAVIOR.swimSpeed, dtMs)) {
          b.target = randomPoint(rng, GROVE.pond, GROVE.pond.r - 0.8);
        }
        // Swimming is training: a little Swim and a little Swim lean.
        addPoints(n.stats.swim, (dtMs / 1000) * 0.5);
        n.typeLean.swim += (dtMs / 1000) * TYPE_LEAN.trainingPerSecond;
      }
      if (now >= b.untilMs) {
        // Leave the water before doing anything else.
        setState(n, 'wander', now, BEHAVIOR.wanderMs[1]);
        b.target = randomPoint(rng, { x: GROVE.pond.x, z: GROVE.pond.z + GROVE.pond.r + 2 }, 2);
      }
      break;
    }
    case 'findFood': {
      const item = world.items.find((i) => i.id === b.itemId);
      if (!item) {
        chooseIdle(n, world, rng, now);
        break;
      }
      if (walkToward(n, item.pos, BEHAVIOR.walkSpeed, dtMs)) {
        world.items = world.items.filter((i) => i.id !== item.id);
        eat(n, now, events, item.flavor);
      }
      break;
    }
    case 'play': {
      const toy = world.items.find((i) => i.id === b.itemId);
      if (!toy) {
        chooseIdle(n, world, rng, now);
        break;
      }
      if (b.target && !walkToward(n, b.target, BEHAVIOR.walkSpeed, dtMs)) break;
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
      if (b.target) walkToward(n, b.target, BEHAVIOR.walkSpeed * 1.3, dtMs);
      if (world.weather.kind !== 'rain' || now >= b.untilMs) chooseIdle(n, world, rng, now);
      break;
    }
    case 'court': {
      if (!b.target || walkToward(n, b.target, BEHAVIOR.walkSpeed, dtMs) || now >= b.untilMs) {
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
        if (walkToward(n, b.target, BEHAVIOR.walkSpeed * 1.5, dtMs)) {
          b.target = null;
        }
      } else {
        toy.pos.x = n.pos.x + Math.sin(n.facing) * 0.4;
        toy.pos.z = n.pos.z + Math.cos(n.facing) * 0.4;
        if (
          walkToward(n, world.keeper.pos, BEHAVIOR.walkSpeed * 1.3, dtMs) ||
          dist(n.pos, world.keeper.pos) < 1.4
        ) {
          addHappiness(n, BEHAVIOR.playHappiness);
          react(n, 'happy', now, events);
        }
      }
      break;
    }
    case 'eat':
    case 'sit':
    case 'greet':
    case 'cry':
    case 'perform':
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

function updateThrown(n: Nubbin, dtMs: number, now: number, events: SimEvent[]): void {
  const dt = dtMs / 1000;
  n.vel.y -= THROW.gravity * dt;
  n.pos.x += n.vel.x * dt;
  n.pos.z += n.vel.z * dt;
  n.y += n.vel.y * dt;
  clampToWorld(n.pos);
  if (n.y <= 0) {
    n.y = 0;
    n.vel = { x: 0, y: 0, z: 0 };
    events.push({ kind: 'landed', nubbinId: n.id });
    // Back on the ground first, so the reaction below replaces 'thrown' rather than
    // being swallowed by the held/thrown guard in react().
    setState(n, 'sit', now, 0);
    if (n.stage !== 'egg') {
      applyDrop(n);
      react(n, 'dizzy', now, events);
    }
  }
}

/** Dropping (gentle put-down) is kinder than throwing but still not welcome. */
export function putDown(n: Nubbin, now: number, events: SimEvent[]): void {
  n.y = 0;
  n.vel = { x: 0, y: 0, z: 0 };
  setState(n, 'sit', now, 0);
  if (n.stage === 'egg') return;
  react(n, 'confused', now, events);
}

export function sampleAll(world: World): void {
  for (const n of world.nubbins) if (n.stage !== 'egg') sampleHappiness(n);
}

export function cheerUp(n: Nubbin, amount: number): void {
  addHappiness(n, amount);
}
