import { blocked, obstacles, resolve } from './obstacles';
import { dungeonBlocked, resolveDungeon, runFloor } from './dungeon';
import { keeperWaypoint } from './dungeon-nav';
import { GATHER, GROVE, KEEPER, NEEDS, PERKS, SIM, TREES, TRUST } from '../config/tuning';
import { KEEPER_UNSTICK } from '../config/tuning-sim';
import { keeperPerks, keeperSpeedMultiplier } from './perks';
import { dropFruit, withRng } from './world';
import { nudgeAlignment } from './alignment';
import { eat, pet, putDown, react } from './behavior';
import { addAffection, addHappiness, applyPet } from './needs';
import { isFree } from './nubbin';
import { giveHeartFruit } from './breeding';
import { noteCare } from './personality';
import { addTrust, isWary, settleStray } from './trust';
import { noteCampaign } from './campaign';
import type { Interaction, Keeper, KeeperIntent, Nubbin, SimEvent, Vec2, World } from './types';

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
    running: false,
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

/** Whether a point is somewhere the Keeper may stand in the Grove: clear of every solid thing and out of the pond unless wading. */
function standable(p: Vec2, world: World, wade: boolean): boolean {
  if (blocked(p, world, KEEPER_UNSTICK.clearance - 0.05)) return false;
  if (wade) return true;
  const pond = GROVE.pond;
  // A hair inside the shoreline ring counts as ashore: shoreline() puts the Keeper exactly on it.
  return Math.hypot(p.x - pond.x, p.z - pond.z) >= pond.r + 0.5 - 0.05;
}

/**
 * The nearest point the Keeper may stand on, searching outward in rings. A Keeper left
 * inside a blocker or the pond (a teleport, a lost Swim perk, an old save, the crack where
 * the well's footing meets the shoreline) would otherwise be pushed back and forth for good.
 */
export function freeSpot(world: World, p: Vec2, wade = keeperPerks(world).wade): Vec2 {
  if (standable(p, world, wade)) return p;
  const h = SIM.worldHalf;
  for (
    let r = KEEPER_UNSTICK.searchStep;
    r <= KEEPER_UNSTICK.searchMax;
    r += KEEPER_UNSTICK.searchStep
  ) {
    const steps = Math.max(12, Math.ceil(r * 8));
    for (let i = 0; i < steps; i++) {
      const a = (i / steps) * Math.PI * 2;
      const q = { x: p.x + Math.cos(a) * r, z: p.z + Math.sin(a) * r };
      if (Math.abs(q.x) > h || Math.abs(q.z) > h) continue;
      if (standable(q, world, wade)) return q;
    }
  }
  return { x: GROVE.keeperStart.x, z: GROVE.keeperStart.z };
}

/** Free a Keeper standing inside a blocker or the pond; true if it moved. */
export function unstickKeeper(world: World): boolean {
  if (runFloor(world)) return false;
  const k = world.keeper;
  const to = freeSpot(world, k.pos);
  if (to === k.pos) return false;
  k.pos = { x: to.x, z: to.z };
  return true;
}

/** Progress of the current care walk, per world; transient, so it is not saved. */
const careWalk = new WeakMap<World, { intent: KeeperIntent; at: Vec2; sinceMs: number }>();

/**
 * A care walk where the Keeper stops moving (wedged where steering cannot get round)
 * gives up and says so, instead of leaving the Keeper pressing against a wall in silence.
 */
function careWalkStalled(world: World): boolean {
  const k = world.keeper;
  const intent = k.intent;
  if (!intent) {
    careWalk.delete(world);
    return false;
  }
  const w = careWalk.get(world);
  if (!w || w.intent !== intent || dist(w.at, k.pos) > KEEPER_UNSTICK.minProgress) {
    careWalk.set(world, { intent, at: { x: k.pos.x, z: k.pos.z }, sinceMs: world.timeMs });
    return false;
  }
  return world.timeMs - w.sinceMs >= KEEPER_UNSTICK.giveUpMs;
}

/**
 * Walk around a solid thing instead of into it: when the straight step would end inside a
 * hill, tree or building, follow that obstacle's edge on the side nearer the target.
 */
function steer(world: World, p: Vec2, to: Vec2, dx: number, dz: number): [number, number] {
  const look = KEEPER_UNSTICK.clearance + 0.1;
  const ax = p.x + dx * look;
  const az = p.z + dz * look;
  for (const c of obstacles(world)) {
    const min = c.r + KEEPER_UNSTICK.clearance;
    if ((ax - c.x) ** 2 + (az - c.z) ** 2 >= min * min) continue;
    // A target inside the obstacle itself is walked into and dropped, as before.
    if ((to.x - c.x) ** 2 + (to.z - c.z) ** 2 < min * min) continue;
    const rx = p.x - c.x;
    const rz = p.z - c.z;
    const len = Math.hypot(rx, rz) || 1;
    // The two tangents; keep the one that still heads toward the target.
    const tx = -rz / len;
    const tz = rx / len;
    return tx * dx + tz * dz >= 0 ? [tx, tz] : [-tx, -tz];
  }
  return [dx, dz];
}

/** The id of what a care walk heads for: a Nubbin, a tree or an item. */
function intentTargetId(intent: KeeperIntent): string {
  if (intent.kind === 'shakeTree') return intent.treeId;
  if (intent.kind === 'collect') return intent.itemId;
  return intent.nubbinId;
}

function findNubbin(world: World, id: string): Nubbin | undefined {
  return world.nubbins.find((n) => n.id === id);
}

function intentTarget(world: World, intent: KeeperIntent): Vec2 | null {
  switch (intent.kind) {
    case 'pet':
    case 'pickUp':
    case 'feed':
    case 'interact':
    case 'heartFruit':
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
  const dungeonFloor = runFloor(world);

  // Direct input wins over tap targets.
  if (k.input.x !== 0 || k.input.z !== 0) {
    const len = Math.hypot(k.input.x, k.input.z);
    const nx = k.input.x / len;
    const nz = k.input.z / len;
    k.pos.x +=
      nx * KEEPER.speed * keeperSpeedMultiplier(world, k.running, KEEPER.runMultiplier) * dt;
    k.pos.z +=
      nz * KEEPER.speed * keeperSpeedMultiplier(world, k.running, KEEPER.runMultiplier) * dt;
    k.facing = Math.atan2(nx, nz);
    k.moveTarget = null;
    k.intent = null;
    // Without the Swim perk the Keeper does not wade: a step into the pond stops at the
    // shore, as a tap target in the pond does below.
    if (!dungeonFloor && !keeperPerks(world).wade) {
      const s = shoreline(k.pos);
      k.pos.x = s.x;
      k.pos.z = s.z;
    }
  } else {
    let target = k.moveTarget;
    if (k.intent) target = intentTarget(world, k.intent);
    if (k.intent && !target) k.intent = null;
    // The Keeper does not wade: a target in the pond becomes the nearest shoreline point,
    // and a Nubbin in the water is reached from there.
    const raw = target;
    if (target && !dungeonFloor && !keeperPerks(world).wade) target = shoreline(target);
    if (target) {
      const d = dist(k.pos, target);
      // On land the Keeper walks up to arm's length; from the shore, a swimming Nubbin is
      // within reach however far out it is.
      const reach = !k.intent
        ? KEEPER.arriveRadius
        : target !== raw
          ? KEEPER.interactRadius + GROVE.pond.r
          : KEEPER.interactRadius;
      if (d <= reach) {
        if (k.intent) {
          performIntent(world, k.intent, events);
          k.intent = null;
        }
        k.moveTarget = null;
      } else if (k.intent && careWalkStalled(world)) {
        events.push({ kind: 'cantReach', targetId: intentTargetId(k.intent) });
        k.intent = null;
        k.moveTarget = null;
      } else if (dungeonFloor) {
        // Underground the Keeper follows an A* path round the rock (dungeon-nav.ts). No
        // waypoint means it already stands as near as it can get: a plain tap ends there,
        // a care walk is left to give up through careWalkStalled.
        const wp = keeperWaypoint(world, dungeonFloor, target);
        if (!wp) {
          if (!k.intent) k.moveTarget = null;
        } else {
          const wd = dist(k.pos, wp);
          const speed =
            KEEPER.speed * keeperSpeedMultiplier(world, k.running, KEEPER.runMultiplier);
          if (wd > 1e-6) {
            const dx = (wp.x - k.pos.x) / wd;
            const dz = (wp.z - k.pos.z) / wd;
            const step = Math.min(wd, speed * dt);
            k.pos.x += dx * step;
            k.pos.z += dz * step;
            k.facing = Math.atan2(dx, dz);
          }
        }
      } else {
        const step = Math.min(
          d,
          KEEPER.speed * keeperSpeedMultiplier(world, k.running, KEEPER.runMultiplier) * dt,
        );
        let dx = (target.x - k.pos.x) / d;
        let dz = (target.z - k.pos.z) / d;
        if (!dungeonFloor) [dx, dz] = steer(world, k.pos, target, dx, dz);
        k.pos.x += dx * step;
        k.pos.z += dz * step;
        k.facing = Math.atan2(dx, dz);
      }
    }
  }
  // Solid things: hills, trees, buildings, rocks, or the Hollow's walls. A tap target
  // inside one is dropped.
  if (dungeonFloor) {
    if (
      resolveDungeon(k.pos, dungeonFloor, 0.35) &&
      k.moveTarget &&
      dungeonBlocked(k.moveTarget, dungeonFloor, 0.3)
    ) {
      k.moveTarget = null;
      k.intent = null;
    }
  } else {
    if (resolve(k.pos, world) && k.moveTarget && blocked(k.moveTarget, world, 0.3)) {
      k.moveTarget = null;
      k.intent = null;
    }
    clampToWorld(k.pos);
    // Still inside something (two blockers, or a blocker and the shore, pushing in turn):
    // step out to the nearest free spot so no position can trap the Keeper.
    unstickKeeper(world);
  }

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
      // Wood now and then, and a Power-type friend shakes fruit loose at once.
      withRng(world, (rng) => {
        if (rng.chance(GATHER.woodChance)) {
          world.inventory.wood += 1;
          events.push({ kind: 'gathered', what: 'wood', count: 1 });
        }
        if (keeperPerks(world).power) {
          for (let i = 0; i < PERKS.powerShakeFruit; i++) dropFruit(world, tree, rng, events);
        }
      });
      return;
    }
    case 'collect': {
      const item = world.items.find((i) => i.id === intent.itemId);
      if (!item || item.kind === 'toy') return;
      world.items = world.items.filter((i) => i.id !== item.id);
      if (item.kind === 'fruit') world.inventory.fruit += 1;
      else if (item.kind === 'notebook' && world.campaign)
        world.campaign.flags.notebookFound = true;
      events.push({ kind: 'collected', itemId: item.id });
      return;
    }
    case 'heartFruit': {
      const n = findNubbin(world, intent.nubbinId);
      if (n) giveHeartFruit(world, n, events);
      return;
    }
    case 'interact': {
      const n = findNubbin(world, intent.nubbinId);
      if (!n || n.stage === 'egg' || n.stage === 'cocoon') return;
      interact(world, n, intent.action, events);
      return;
    }
  }
}

/**
 * The gentler interactions. A wary Shadow Nubbin refuses most of them (it is not ready),
 * which is its own lesson; tucking in and praise always land.
 */
export function interact(world: World, n: Nubbin, action: Interaction, events: SimEvent[]): void {
  const now = world.timeMs;
  const refused = isWary(n) && action !== 'tuckIn' && action !== 'praise';
  if (refused) {
    react(n, 'surprised', now, events);
    events.push({ kind: 'interacted', nubbinId: n.id, action, ok: false });
    return;
  }
  switch (action) {
    case 'tickle':
      addHappiness(n, 4);
      addTrust(n, 1, events);
      react(n, 'happy', now, events);
      break;
    case 'hug':
      addAffection(n, 4);
      addTrust(n, 2.5, events);
      addHappiness(n, 3);
      react(n, 'love', now, events);
      break;
    case 'groom':
      addHappiness(n, 3);
      addAffection(n, 2);
      addTrust(n, 1.5, events);
      react(n, 'happy', now, events);
      break;
    case 'tuckIn':
      if (n.needs.energy < 0.6 && isFree(n)) {
        n.behavior.state = 'nap';
        n.behavior.sinceMs = now;
        n.behavior.untilMs = now + NEEDS.napMs;
        n.behavior.target = null;
        addTrust(n, 2, events);
        events.push({ kind: 'napStarted', nubbinId: n.id });
      } else {
        react(n, 'confused', now, events);
      }
      break;
    case 'praise':
      addHappiness(n, 2);
      addTrust(n, 1, events);
      nudgeAlignment(n, world.keeper.alignment);
      react(n, 'happy', now, events);
      break;
    case 'highFive':
      addHappiness(n, 3);
      addTrust(n, 1, events);
      react(n, n.personality === 'shy' ? 'confused' : 'happy', now, events);
      break;
  }
  if (n.stray) settleStray(n);
  noteCampaign(world, 'pet', n.id);
  events.push({ kind: 'interacted', nubbinId: n.id, action, ok: true });
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
  pet(n, world.keeper.pos, now, events);
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
