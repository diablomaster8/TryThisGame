import { BEHAVIOR, GROVE, NEEDS, SIM, THROW } from '../config/tuning';
import {
  addHappiness,
  applyDrop,
  applyFruit,
  isExhausted,
  isHungry,
  sampleHappiness,
} from './needs';
import { isFree } from './nubbin';
import type { Rng } from './rng';
import { addPoints } from './stats';
import type { BehaviorState, Nubbin, Reaction, SimEvent, Vec2, World } from './types';

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

function chooseIdle(n: Nubbin, world: World, rng: Rng, now: number): void {
  const keeperNear = dist(n.pos, world.keeper.pos) < BEHAVIOR.greetRadius;
  if (keeperNear && rng.chance(BEHAVIOR.greetChance)) {
    setState(n, 'greet', now, BEHAVIOR.greetMs);
    n.facing = Math.atan2(world.keeper.pos.x - n.pos.x, world.keeper.pos.z - n.pos.z);
    return;
  }
  if (n.stage !== 'egg' && rng.chance(BEHAVIOR.swimChance)) {
    setState(n, 'swim', now, rng.float(...BEHAVIOR.swimMs));
    n.behavior.target = randomPoint(rng, GROVE.pond, GROVE.pond.r - 0.8);
    return;
  }
  if (rng.chance(BEHAVIOR.sitChance)) {
    setState(n, 'sit', now, rng.float(...BEHAVIOR.sitMs));
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
  const interruptible = b.state !== 'eat' && b.state !== 'nap' && b.state !== 'react';
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

  switch (b.state) {
    case 'wander': {
      if (!b.target || walkToward(n, b.target, BEHAVIOR.walkSpeed, dtMs) || now >= b.untilMs) {
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
        addPoints(n.stats.swim, (dtMs / 1000) * 0.5);
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
        eat(n, now, events);
      }
      break;
    }
    case 'eat':
    case 'sit':
    case 'greet':
    case 'cry':
    case 'play':
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

export function eat(n: Nubbin, now: number, events: SimEvent[]): void {
  applyFruit(n);
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
    if (n.stage === 'egg') {
      setState(n, 'sit', now, 0);
    } else {
      applyDrop(n);
      react(n, 'dizzy', now, events);
    }
  }
}

/** Dropping (gentle put-down) is kinder than throwing but still not welcome. */
export function putDown(n: Nubbin, now: number, events: SimEvent[]): void {
  n.y = 0;
  n.vel = { x: 0, y: 0, z: 0 };
  if (n.stage === 'egg') {
    setState(n, 'sit', now, 0);
    return;
  }
  react(n, 'confused', now, events);
}

export function sampleAll(world: World): void {
  for (const n of world.nubbins) if (n.stage !== 'egg') sampleHappiness(n);
}

export function cheerUp(n: Nubbin, amount: number): void {
  addHappiness(n, amount);
}
