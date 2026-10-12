import { NUBBIN_NAMES } from '../config/strings';
import { EGG, GROVE, OFFLINE, THROW, TREES } from '../config/tuning';
import { applyDrop, decayNeeds } from './needs';
import { clampToWorld, putDown, react, sampleAll, startThrow, updateBehavior } from './behavior';
import { createKeeper, keeperPutDown, updateKeeper } from './keeper';
import { advanceStage, evolve, hatch } from './lifecycle';
import { createEgg, isHeld } from './nubbin';
import { Rng } from './rng';
import type { Command, Item, Nubbin, Settings, SimEvent, Tree, Vec2, World } from './types';

export function defaultSettings(): Settings {
  return {
    offlineAging: {
      mode: OFFLINE.defaultMode,
      capHours: OFFLINE.defaultCapHours,
      allowOfflineDepartures: OFFLINE.defaultAllowDepartures,
    },
    joystick: false,
  };
}

export function createWorld(seed: number, wallMs: number): World {
  const rng = Rng.fromSeed(seed);
  const world: World = {
    seed,
    rngState: 0,
    timeMs: 0,
    lastWallMs: wallMs,
    nubbins: [],
    items: [],
    trees: [],
    keeper: createKeeper(GROVE.keeperStart),
    inventory: { shells: 0, fruit: 0, critters: {}, essences: {} },
    settings: defaultSettings(),
    memorials: [],
    unlocks: { sunGrove: false, moonGrove: false },
    nextId: 1,
    selected: null,
  };
  for (const t of GROVE.trees) {
    world.trees.push({
      id: newId(world, 'tree'),
      pos: { x: t.x, z: t.z },
      fruitTimerMs: TREES.fruitIntervalMs / 2,
    });
  }
  for (let i = 0; i < EGG.startCount; i++) {
    const spot = GROVE.eggSpots[i] ?? { x: i * 2 - 1, z: 0 };
    const egg = createEgg(newId(world, 'nub'), spot, rng);
    egg.name = uniqueName(world, egg.name, rng);
    world.nubbins.push(egg);
  }
  world.rngState = rng.state;
  return world;
}

/** Avoid two Nubbins sharing a random name. */
export function uniqueName(world: World, name: string, rng: Rng): string {
  const taken = new Set(world.nubbins.map((n) => n.name));
  if (!taken.has(name)) return name;
  const free = NUBBIN_NAMES.filter((n) => !taken.has(n));
  if (free.length > 0) return rng.pick(free);
  return `${name} ${world.nubbins.length + 1}`;
}

export function newId(world: World, prefix: string): string {
  const id = `${prefix}-${world.nextId}`;
  world.nextId += 1;
  return id;
}

export function findNubbin(world: World, id: string): Nubbin | undefined {
  return world.nubbins.find((n) => n.id === id);
}

/** Take the world's RNG, use it, and store the state back. */
export function withRng<T>(world: World, fn: (rng: Rng) => T): T {
  const rng = new Rng(world.rngState);
  const out = fn(rng);
  world.rngState = rng.state;
  return out;
}

// ---------- commands ----------

export function applyCommand(world: World, cmd: Command, events: SimEvent[]): void {
  const k = world.keeper;
  const now = world.timeMs;
  switch (cmd.kind) {
    case 'moveKeeperTo':
      k.moveTarget = { x: cmd.pos.x, z: cmd.pos.z };
      clampToWorld(k.moveTarget);
      k.intent = null;
      return;
    case 'keeperInput':
      k.input = { x: cmd.input.x, z: cmd.input.z };
      return;
    case 'select':
      world.selected = cmd.id;
      return;
    case 'pet':
      k.intent = { kind: 'pet', nubbinId: cmd.nubbinId };
      k.moveTarget = null;
      return;
    case 'pickUp':
      if (k.carrying) return;
      k.intent = { kind: 'pickUp', nubbinId: cmd.nubbinId };
      k.moveTarget = null;
      return;
    case 'putDown':
      keeperPutDown(world, events);
      return;
    case 'feed':
      if (world.inventory.fruit <= 0) return;
      k.intent = { kind: 'feed', nubbinId: cmd.nubbinId };
      k.moveTarget = null;
      return;
    case 'shakeTree':
      k.intent = { kind: 'shakeTree', treeId: cmd.treeId };
      k.moveTarget = null;
      return;
    case 'collect':
      k.intent = { kind: 'collect', itemId: cmd.itemId };
      k.moveTarget = null;
      return;
    case 'grab': {
      const n = findNubbin(world, cmd.nubbinId);
      if (!n || n.behavior.state === 'thrown') return;
      if (k.carrying === n.id) k.carrying = null;
      n.behavior.state = 'held';
      n.behavior.sinceMs = now;
      n.behavior.target = null;
      n.behavior.itemId = null;
      n.y = THROW.holdHeight;
      events.push({ kind: 'pickedUp', nubbinId: n.id });
      return;
    }
    case 'drag': {
      const n = heldNubbin(world);
      if (!n) return;
      n.pos.x = cmd.pos.x;
      n.pos.z = cmd.pos.z;
      clampToWorld(n.pos);
      n.y = THROW.holdHeight;
      return;
    }
    case 'shakeHeld': {
      const n = heldNubbin(world) ?? (k.carrying ? findNubbin(world, k.carrying) : undefined);
      if (!n) return;
      if (now - n.lastShakeMs < EGG.shakeCooldownMs) return;
      n.lastShakeMs = now;
      if (n.stage === 'egg') {
        n.hatchRemainingMs = Math.max(0, n.hatchRemainingMs - EGG.shakeBonusMs);
        events.push({ kind: 'eggShaken', nubbinId: n.id });
      } else {
        react(n, 'dizzy', now, events);
      }
      return;
    }
    case 'release': {
      const n = heldNubbin(world);
      if (!n) return;
      const speed = Math.hypot(cmd.vel.x, cmd.vel.z);
      if (speed >= THROW.minSpeed) {
        startThrow(n, cmd.vel, now, events);
      } else {
        if (n.stage !== 'egg') applyDrop(n);
        putDown(n, now, events);
      }
      return;
    }
    case 'switchKeeper':
      k.alignment = cmd.alignment;
      return;
    case 'setSettings':
      world.settings = cmd.settings;
      return;
    case 'rename': {
      const n = findNubbin(world, cmd.nubbinId);
      if (n) n.name = cmd.name.trim().slice(0, 16) || n.name;
      return;
    }
    case 'debugGive':
      if (cmd.what === 'shells') world.inventory.shells += cmd.amount;
      else world.inventory.fruit += cmd.amount;
      return;
    case 'debugFillNeeds': {
      const n = findNubbin(world, cmd.nubbinId);
      if (!n) return;
      n.needs.hunger = 1;
      n.needs.energy = 1;
      return;
    }
    case 'debugForceEvolve': {
      const n = findNubbin(world, cmd.nubbinId);
      if (!n || n.stage === 'egg' || n.stage === 'adult') return;
      evolve(n, events);
      return;
    }
    case 'debugForceEndOfLife': {
      // End of life arrives in M3. For now jump the adult to the end of its stage.
      const n = findNubbin(world, cmd.nubbinId);
      if (!n || n.stage !== 'adult') return;
      n.stageMs = Number.MAX_SAFE_INTEGER / 4;
      return;
    }
    case 'debugHatchNow': {
      const n = findNubbin(world, cmd.nubbinId);
      if (n && n.stage === 'egg') n.hatchRemainingMs = 0;
      return;
    }
  }
}

export function heldNubbin(world: World): Nubbin | undefined {
  return world.nubbins.find((n) => n.behavior.state === 'held');
}

// ---------- stepping ----------

/** One fixed step with full fidelity. Returns the events that happened. */
export function stepWorld(world: World, dtMs: number, wallMs?: number): SimEvent[] {
  const events: SimEvent[] = [];
  world.timeMs += dtMs;
  if (wallMs !== undefined) world.lastWallMs = wallMs;

  withRng(world, (rng) => {
    updateTrees(world, dtMs, rng, events);
    updateItems(world, dtMs);
    for (const n of world.nubbins) {
      if (n.stage === 'egg') {
        if (!isHeld(n) && n.behavior.state !== 'thrown') {
          n.hatchRemainingMs -= dtMs;
        } else {
          n.hatchRemainingMs -= dtMs; // eggs still incubate while carried
        }
        if (n.hatchRemainingMs <= 0 && !isHeld(n) && n.behavior.state !== 'thrown') {
          hatch(n, events);
        }
        if (n.behavior.state === 'thrown') updateBehavior(n, world, dtMs, rng, events);
        continue;
      }
      decayNeeds(n, dtMs);
      advanceStage(n, dtMs, events);
      updateBehavior(n, world, dtMs, rng, events);
    }
    updateKeeper(world, dtMs, events);
  });

  // Lifetime happiness sampling, once a sim second.
  if (Math.floor(world.timeMs / 1000) !== Math.floor((world.timeMs - dtMs) / 1000)) {
    sampleAll(world);
  }
  return events;
}

function updateTrees(world: World, dtMs: number, rng: Rng, events: SimEvent[]): void {
  for (const tree of world.trees) {
    tree.fruitTimerMs -= dtMs;
    if (tree.fruitTimerMs <= 0) {
      tree.fruitTimerMs += TREES.fruitIntervalMs;
      if (world.items.filter((i) => i.kind === 'fruit').length >= TREES.maxFruitOnGround) continue;
      dropFruit(world, tree, rng, events);
    }
  }
}

export function dropFruit(world: World, tree: Tree, rng: Rng, events: SimEvent[]): Item {
  const a = rng.float(0, Math.PI * 2);
  const r = rng.float(0.8, TREES.dropRadius);
  const item: Item = {
    id: newId(world, 'fruit'),
    kind: 'fruit',
    pos: { x: tree.pos.x + Math.cos(a) * r, z: tree.pos.z + Math.sin(a) * r },
    y: 2.4,
    vel: { x: 0, y: 0, z: 0 },
  };
  world.items.push(item);
  events.push({ kind: 'fruitDropped', treeId: tree.id, itemId: item.id });
  return item;
}

function updateItems(world: World, dtMs: number): void {
  const dt = dtMs / 1000;
  for (const item of world.items) {
    if (item.y > 0) {
      item.vel.y -= THROW.gravity * dt;
      item.y = Math.max(0, item.y + item.vel.y * dt);
      if (item.y === 0) item.vel.y = 0;
    }
  }
}

export function positionOf(world: World, id: string): Vec2 | null {
  return findNubbin(world, id)?.pos ?? world.items.find((i) => i.id === id)?.pos ?? null;
}
