import { NUBBIN_NAMES } from '../config/strings';
import { EGG, GROVE, LIFECYCLE, OFFLINE, THROW, TREES, TRUST } from '../config/tuning';
import { nudgeAlignment } from './alignment';
import { applyDrop, decayNeeds } from './needs';
import { clampToWorld, putDown, react, sampleAll, startThrow, updateBehavior } from './behavior';
import { CRITTER_SPECIES, giveCritter, giveEssence } from './critters';
import { createKeeper, keeperPutDown, updateKeeper } from './keeper';
import { noteCare } from './personality';
import { addTrust, isWary, stepTrust } from './trust';
import { createWeather, seasonOf, setWeather, stepWeather } from './weather';
import { stepBreeding } from './breeding';
import { payService, startLesson } from './kindergarten';
import { buyDecor, placeDecor, removeDecor } from './decorate';
import { stepCollection } from './collection';
import { stepDaily } from './daily';
import { receiveNubbin, tradeAway } from './share';
import { applyCampaignCommand, noteCampaign, stepCampaign } from './campaign';
import { stepNpcs } from './npcs';
import { addRewards, buy } from './shop';
import { SPECIES } from './species';
import { DEFAULT_TRAINER, rollEggSpecies, TRAINERS, trainerOf } from './trainers';
import { advanceStage, evolve, hatch, secondEvolve } from './lifecycle';
import { createEgg, EGG_COLORS, isFree, isHeld } from './nubbin';
import { Rng } from './rng';
import {
  NUBBIN_TYPES,
  type Command,
  type Item,
  type Nubbin,
  type Settings,
  type SimEvent,
  type Tree,
  type Vec2,
  type World,
} from './types';

export function defaultSettings(): Settings {
  return {
    offlineAging: {
      mode: OFFLINE.defaultMode,
      capHours: OFFLINE.defaultCapHours,
      allowOfflineDepartures: OFFLINE.defaultAllowDepartures,
    },
    joystick: false,
    sound: true,
    music: true,
    musicVolume: 0.8,
    sfxVolume: 0.8,
    textSpeed: 'normal',
    screenShake: true,
    particles: 'full',
    reducedMotion: 'system',
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
    inventory: {
      shells: 0,
      fruit: 0,
      critters: {},
      essences: {},
      hats: [],
      heartFruit: 0,
      decor: {},
    },
    settings: defaultSettings(),
    memorials: [],
    unlocks: { sunGrove: false, moonGrove: false },
    grove: 'main',
    races: {},
    trainer: DEFAULT_TRAINER,
    nextId: 1,
    selected: null,
    strays: [],
    npcs: [],
    campaign: null,
    weather: createWeather(),
    season: seasonOf(new Date(wallMs)),
    placed: [],
    seen: {},
    visits: { lastDay: '', count: 0 },
    location: 'grove',
    karate: { belt: 0, wins: 0, losses: 0 },
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
    const egg = createEgg(
      newId(world, 'nub'),
      spot,
      rng,
      'plain',
      rollEggSpecies(trainerOf(world.trainer), rng),
    );
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
        noteCare(n, 'throws');
        addTrust(n, TRUST.throw, events);
        noteCampaign(world, 'throw', n.id);
        startThrow(n, cmd.vel, now, events);
      } else {
        if (n.stage !== 'egg') applyDrop(n);
        addTrust(n, TRUST.drop, events);
        putDown(n, now, events);
      }
      return;
    }
    case 'switchKeeper': {
      // Legacy toggle: the first trainer of the other side.
      const t = TRAINERS.find((x) => x.band === cmd.alignment);
      if (t) {
        world.trainer = t.id;
        k.alignment = t.band;
      }
      return;
    }
    case 'setTrainer': {
      const t = trainerOf(cmd.id);
      world.trainer = t.id;
      k.alignment = t.band;
      return;
    }
    case 'setGrove':
      if (cmd.grove === 'sun' && !world.unlocks.sunGrove) return;
      if (cmd.grove === 'moon' && !world.unlocks.moonGrove) return;
      world.grove = cmd.grove;
      return;
    case 'giveCritter': {
      const n = findNubbin(world, cmd.nubbinId);
      if (!n || n.stage === 'egg' || n.stage === 'cocoon') return;
      if ((world.inventory.critters[cmd.species] ?? 0) <= 0) return;
      const ok = withRng(world, (rng) => giveCritter(n, cmd.species, rng, events));
      if (!ok) return;
      world.inventory.critters[cmd.species] = (world.inventory.critters[cmd.species] ?? 0) - 1;
      nudgeAlignment(n, k.alignment);
      react(n, 'love', now, events);
      return;
    }
    case 'giveEssence': {
      const n = findNubbin(world, cmd.nubbinId);
      if (!n || n.stage === 'egg' || n.stage === 'cocoon') return;
      if ((world.inventory.essences[cmd.type] ?? 0) <= 0) return;
      giveEssence(n, cmd.type, events);
      world.inventory.essences[cmd.type] = (world.inventory.essences[cmd.type] ?? 0) - 1;
      nudgeAlignment(n, k.alignment);
      react(n, 'happy', now, events);
      return;
    }
    case 'addRewards':
      addRewards(world, cmd.rewards, events);
      noteCampaign(world, 'expedition');
      return;
    case 'buy':
      withRng(world, (rng) => buy(world, cmd.item, rng, events));
      return;
    case 'raceResult': {
      world.inventory.shells += Math.max(0, cmd.shells);
      if (cmd.hat) world.inventory.hats.push(cmd.hat);
      if (cmd.placement === 1) {
        world.races[cmd.course] = Math.max(world.races[cmd.course] ?? 0, cmd.tier);
        noteCampaign(world, 'raceWin');
      }
      return;
    }
    case 'wearHat': {
      const n = findNubbin(world, cmd.nubbinId);
      if (!n) return;
      if (cmd.hat && !world.inventory.hats.includes(cmd.hat)) return;
      n.hat = cmd.hat;
      return;
    }
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
      else if (cmd.what === 'fruit') world.inventory.fruit += cmd.amount;
      else if (cmd.what === 'egg') {
        // Fill the roster for checks: free eggs of every family up to the cap.
        withRng(world, (rng) => {
          const babies = SPECIES.filter((s) => s.stage === 'baby');
          for (let i = 0; i < cmd.amount && world.nubbins.length < EGG.maxRoster; i++) {
            const egg = createEgg(
              newId(world, 'nub'),
              { x: rng.float(-4, 4), z: rng.float(-3, 3) },
              rng,
              rng.pick(EGG_COLORS),
              rng.pick(babies).id,
            );
            egg.name = uniqueName(world, egg.name, rng);
            world.nubbins.push(egg);
          }
        });
      } else if (cmd.what === 'critter') {
        withRng(world, (rng) => {
          for (let i = 0; i < cmd.amount; i++) {
            const s = rng.pick(CRITTER_SPECIES).id;
            world.inventory.critters[s] = (world.inventory.critters[s] ?? 0) + 1;
          }
        });
      } else {
        withRng(world, (rng) => {
          for (let i = 0; i < cmd.amount; i++) {
            const t = rng.pick(NUBBIN_TYPES);
            world.inventory.essences[t] = (world.inventory.essences[t] ?? 0) + 1;
          }
        });
      }
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
      if (!n || n.stage === 'egg') return;
      if (n.stage === 'adult') {
        if (n.form && n.form.second === null) secondEvolve(n, events);
        return;
      }
      evolve(n, events, world);
      return;
    }
    case 'debugForceEndOfLife': {
      const n = findNubbin(world, cmd.nubbinId);
      if (!n || n.stage !== 'adult') return;
      n.eternal = null;
      n.stageMs = LIFECYCLE.adultMs;
      return;
    }
    case 'giveHeartFruit':
      if (world.inventory.heartFruit <= 0) return;
      k.intent = { kind: 'heartFruit', nubbinId: cmd.nubbinId };
      k.moveTarget = null;
      return;
    case 'interact':
      k.intent = { kind: 'interact', nubbinId: cmd.nubbinId, action: cmd.action };
      k.moveTarget = null;
      return;
    case 'call': {
      let count = 0;
      for (const n of world.nubbins) {
        if (cmd.nubbinId && n.id !== cmd.nubbinId) continue;
        if (!isFree(n) || isWary(n)) continue;
        if (n.behavior.state === 'lesson' || n.behavior.state === 'nap') continue;
        n.behavior.state = 'wander';
        n.behavior.sinceMs = now;
        n.behavior.untilMs = now + 8000;
        n.behavior.itemId = null;
        n.behavior.target = {
          x: k.pos.x + Math.sin(k.facing) * 1.2 + (count % 2 ? 0.8 : -0.8),
          z: k.pos.z + Math.cos(k.facing) * 1.2,
        };
        addTrust(n, 0.5, events);
        count += 1;
      }
      events.push({ kind: 'called', count });
      return;
    }
    case 'playCatch': {
      const n = findNubbin(world, cmd.nubbinId);
      const toy = world.items.find((i) => i.kind === 'toy');
      if (!n || !toy || !isFree(n) || isWary(n)) return;
      // The ball flies from the Keeper's hands; the Nubbin runs after it.
      withRng(world, (rng) => {
        const a = k.facing + rng.float(-0.5, 0.5);
        toy.pos.x = k.pos.x + Math.sin(a) * rng.float(3, 5);
        toy.pos.z = k.pos.z + Math.cos(a) * rng.float(3, 5);
        clampToWorld(toy.pos);
      });
      n.behavior.state = 'fetch';
      n.behavior.sinceMs = now;
      n.behavior.untilMs = now + 20_000;
      n.behavior.itemId = toy.id;
      n.behavior.target = { x: toy.pos.x, z: toy.pos.z };
      events.push({ kind: 'fetching', nubbinId: n.id });
      return;
    }
    case 'startLesson': {
      const n = findNubbin(world, cmd.nubbinId);
      if (n) startLesson(world, n, cmd.lesson, events);
      return;
    }
    case 'payService': {
      const n = findNubbin(world, cmd.nubbinId);
      if (n) payService(world, cmd.service, n, events);
      return;
    }
    case 'buyDecor':
      buyDecor(world, cmd.decor, events);
      return;
    case 'placeDecor':
      placeDecor(world, cmd.decor, cmd.pos, events);
      return;
    case 'removeDecor':
      removeDecor(world, cmd.id);
      return;
    case 'karateResult': {
      const n = findNubbin(world, cmd.nubbinId);
      world.inventory.shells += Math.max(0, cmd.shells);
      if (cmd.won) {
        world.karate.wins += 1;
        world.karate.belt = Math.max(world.karate.belt, cmd.tier);
      } else world.karate.losses += 1;
      if (n) {
        n.karate ??= { wins: 0, losses: 0, belt: 0 };
        if (cmd.won) n.karate.wins += 1;
        else n.karate.losses += 1;
        n.karate.belt = Math.max(n.karate.belt, cmd.won ? cmd.tier : 0);
        events.push({ kind: 'karate', nubbinId: n.id, won: cmd.won, belt: n.karate.belt });
      }
      return;
    }
    case 'receiveNubbin':
      receiveNubbin(world, cmd.nubbin, events);
      return;
    case 'tradeAway':
      tradeAway(world, cmd.nubbinId, events);
      return;
    case 'setLocation':
      if (world.location !== cmd.location) {
        world.location = cmd.location;
        k.pos = { x: GROVE.keeperStart.x, z: GROVE.keeperStart.z };
        k.moveTarget = null;
        k.intent = null;
        events.push({ kind: 'located', location: cmd.location });
      }
      return;
    case 'debugWeather':
      withRng(world, (rng) => setWeather(world, cmd.weather, rng, events));
      return;
    case 'setRunning':
      k.running = cmd.running;
      return;
    case 'campaignStart':
    case 'sceneDone':
    case 'talk':
    case 'lightLantern':
    case 'debugChapter':
      applyCampaignCommand(world, cmd, events);
      return;
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
    // Iterate a copy: a departure removes its Nubbin from the list.
    for (const n of [...world.nubbins]) {
      if (n.stage === 'egg') {
        if (!isHeld(n) && n.behavior.state !== 'thrown') {
          n.hatchRemainingMs -= dtMs;
        } else {
          n.hatchRemainingMs -= dtMs; // eggs still incubate while carried
        }
        if (n.hatchRemainingMs <= 0 && !isHeld(n) && n.behavior.state !== 'thrown') {
          hatch(n, events, world.timeMs);
        }
        if (n.behavior.state === 'thrown') updateBehavior(n, world, dtMs, rng, events);
        continue;
      }
      decayNeeds(n, dtMs);
      advanceStage(n, dtMs, events, world, false);
      if (world.nubbins.includes(n)) updateBehavior(n, world, dtMs, rng, events);
    }
    updateKeeper(world, dtMs, events);
    stepTrust(world, dtMs, events);
    stepNpcs(world, dtMs, rng);
    stepWeather(world, dtMs, rng, events);
    stepBreeding(world, rng, events);
    if (wallMs !== undefined) {
      world.season = seasonOf(new Date(wallMs));
      stepDaily(world, wallMs, rng, events);
    }
    stepCampaign(world, dtMs, events);
  });
  stepCollection(world, events);

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
