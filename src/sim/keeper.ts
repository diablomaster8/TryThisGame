import { GROVE, KEEPER, NEEDS, SIM, TREES, TRUST } from '../config/tuning';
import { nudgeAlignment } from './alignment';
import { eat, putDown, react } from './behavior';
import { applyPet } from './needs';
import { noteCare } from './personality';
import { addTrust, settleStray } from './trust';
import { noteCampaign } from './campaign';
import type { Keeper, KeeperIntent, Nubbin, SimEvent, Vec2, World } from './types';

const dist = (a: Vec2, b: Vec2): number => Math.hypot(a.x - b.x, a.z - b.z);

export function createKeeper(pos: Vec2): Keeper {
  return {
    pos: { x: pos.x, z: pos.z },
    facing: 0,
    alignment: 'sun',
    moveTarget: null,
    input: { x: 0, z: 0 },
    carrying: null,
    intent: null,
  };
}

function clampToWorld(p: Vec2): void {
  const h = SIM.worldHalf;
  p.x = Math.max(-h, Math.min(h, p.x));
  p.z = Math.max(-h, Math.min(h, p.z));
}

/** Keep the Keeper on dry land: points inside the pond move to its edge. */
export function shoreline(p: Vec2): Vec2 {
  const pond = GROVE.pond;
  const dx = p.x - pond.x;
  const dz = p.z - pond.z;
  const d = Math.hypot(dx, dz);
  const edge = pond.r + 0.5;
  if (d >= edge) return p;
  if (d < 1e-6) return { x: pond.x + edge, z: pond.z };
  return { x: pond.x + (dx / d) * edge, z: pond.z + (dz / d) * edge };
}

function findNubbin(world: World, id: string): Nubbin | undefined {
  return world.nubbins.find((n) => n.id === id);
}

function intentTarget(world: World, intent: KeeperIntent): Vec2 | null {
  switch (intent.kind) {
    case 'pet':
    case 'pickUp':
    case 'feed':
      return findNubbin(world, intent.nubbinId)?.pos ?? null;
    case 'shakeTree':
      return world.trees.find((t) => t.id === intent.treeId)?.pos ?? null;
    case 'collect':
      return world.items.find((i) => i.id === intent.itemId)?.pos ?? null;
  }
}

export function updateKeeper(world: World, dtMs: number, events: SimEvent[]): void {
  const k = world.keeper;
  const dt = dtMs / 1000;

  // Direct input wins over tap targets.
  if (k.input.x !== 0 || k.input.z !== 0) {
    const len = Math.hypot(k.input.x, k.input.z);
    const nx = k.input.x / len;
    const nz = k.input.z / len;
    k.pos.x += nx * KEEPER.speed * dt;
    k.pos.z += nz * KEEPER.speed * dt;
    k.facing = Math.atan2(nx, nz);
    k.moveTarget = null;
    k.intent = null;
  } else {
    let target = k.moveTarget;
    if (k.intent) target = intentTarget(world, k.intent);
    if (k.intent && !target) k.intent = null;
    // The Keeper does not wade: a target in the pond becomes the nearest shoreline point,
    // and a Nubbin in the water is reached from there.
    if (target) target = shoreline(target);
    if (target) {
      const d = dist(k.pos, target);
      // From the shore, a swimming Nubbin is within reach however far out it is.
      const reach = k.intent ? KEEPER.interactRadius + GROVE.pond.r : KEEPER.arriveRadius;
      if (d <= reach) {
        if (k.intent) {
          performIntent(world, k.intent, events);
          k.intent = null;
        }
        k.moveTarget = null;
      } else {
        const step = Math.min(d, KEEPER.speed * dt);
        const dx = (target.x - k.pos.x) / d;
        const dz = (target.z - k.pos.z) / d;
        k.pos.x += dx * step;
        k.pos.z += dz * step;
        k.facing = Math.atan2(dx, dz);
      }
    }
  }
  clampToWorld(k.pos);

  // A carried Nubbin rides above the Keeper's head.
  if (k.carrying) {
    const n = findNubbin(world, k.carrying);
    if (n && n.behavior.state === 'carried') {
      n.pos.x = k.pos.x;
      n.pos.z = k.pos.z;
      n.y = KEEPER.carryHeight;
      n.facing = k.facing;
    } else {
      k.carrying = null;
    }
  }
}

function performIntent(world: World, intent: KeeperIntent, events: SimEvent[]): void {
  const now = world.timeMs;
  switch (intent.kind) {
    case 'pet': {
      const n = findNubbin(world, intent.nubbinId);
      if (!n || n.stage === 'egg') return;
      petNubbin(world, n, events);
      return;
    }
    case 'pickUp': {
      const n = findNubbin(world, intent.nubbinId);
      if (!n || world.keeper.carrying) return;
      if (n.behavior.state === 'held' || n.behavior.state === 'thrown') return;
      n.behavior.state = 'carried';
      n.behavior.sinceMs = now;
      n.behavior.target = null;
      n.behavior.itemId = null;
      world.keeper.carrying = n.id;
      events.push({ kind: 'pickedUp', nubbinId: n.id });
      return;
    }
    case 'feed': {
      const n = findNubbin(world, intent.nubbinId);
      if (!n || n.stage === 'egg' || world.inventory.fruit <= 0) return;
      if (n.behavior.state === 'thrown') return;
      world.inventory.fruit -= 1;
      eat(n, now, events);
      addTrust(n, TRUST.feed, events);
      noteCampaign(world, 'feed', n.id);
      if (n.stray) settleStray(n);
      nudgeAlignment(n, world.keeper.alignment);
      noteCare(n, 'feeds');
      return;
    }
    case 'shakeTree': {
      const tree = world.trees.find((t) => t.id === intent.treeId);
      if (!tree) return;
      tree.fruitTimerMs = Math.max(0, tree.fruitTimerMs - TREES.shakeBonusMs);
      events.push({ kind: 'treeShaken', treeId: tree.id });
      return;
    }
    case 'collect': {
      const item = world.items.find((i) => i.id === intent.itemId);
      if (!item || item.kind !== 'fruit') return;
      world.items = world.items.filter((i) => i.id !== item.id);
      world.inventory.fruit += 1;
      events.push({ kind: 'collected', itemId: item.id });
      return;
    }
  }
}

export function petNubbin(world: World, n: Nubbin, events: SimEvent[]): void {
  const now = world.timeMs;
  applyPet(n);
  addTrust(n, TRUST.pet, events);
  noteCampaign(world, 'pet', n.id);
  if (n.stray) settleStray(n);
  nudgeAlignment(n, world.keeper.alignment);
  if (now - n.lastPetMs >= NEEDS.petCooldownMs) noteCare(n, 'pets');
  n.lastPetMs = now;
  react(n, 'love', now, events);
}

/** Put a carried Nubbin down at the Keeper's feet. */
export function keeperPutDown(world: World, events: SimEvent[]): void {
  const k = world.keeper;
  if (!k.carrying) return;
  const n = findNubbin(world, k.carrying);
  k.carrying = null;
  if (!n) return;
  n.pos.x = k.pos.x + Math.sin(k.facing) * 0.8;
  n.pos.z = k.pos.z + Math.cos(k.facing) * 0.8;
  putDown(n, world.timeMs, events);
}
