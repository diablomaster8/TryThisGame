import { GROVE, PLANTS } from '../config/tuning';
import { addHappiness } from './needs';
import type { Rng } from './rng';
import { addPoints } from './stats';
import type { Flavor, Nubbin, Plant, SimEvent, Vec2, World } from './types';
import { newId } from './world';

/**
 * Orchards and crops. Seeds come from Expeditions and harvests. A planted tree grows
 * through four stages and then drops stat fruit on a timer; a crop row grows faster and
 * is harvested by hand. Both need water: rain fills them, dry spells drain them, and a
 * tap waters one by hand. Fruit flavours add points to one stat; Sun and Moon fruit
 * nudge alignment.
 */
export function canPlantAt(world: World, pos: Vec2): boolean {
  const pond = GROVE.pond;
  if (Math.hypot(pos.x - pond.x, pos.z - pond.z) < pond.r + 1.5) return false;
  for (const t of GROVE.trees) if (Math.hypot(pos.x - t.x, pos.z - t.z) < 2.5) return false;
  for (const h of GROVE.hills) if (Math.hypot(pos.x - h.x, pos.z - h.z) < h.r + 1) return false;
  const half = GROVE.size / 2 - 1;
  if (Math.abs(pos.x) > half || Math.abs(pos.z) > half) return false;
  if (world.plants.some((p) => Math.hypot(p.pos.x - pos.x, p.pos.z - pos.z) < 1.6)) return false;
  return !world.placed.some((d) => Math.hypot(d.pos.x - pos.x, d.pos.z - pos.z) < 1.2);
}

export function plant(
  world: World,
  kind: 'tree' | 'crop',
  flavor: Flavor,
  pos: Vec2,
  events: SimEvent[],
): boolean {
  if ((world.inventory.seeds[flavor] ?? 0) <= 0) return false;
  if (world.plants.length >= PLANTS.maxPlants || !canPlantAt(world, pos)) return false;
  world.inventory.seeds[flavor] = (world.inventory.seeds[flavor] ?? 0) - 1;
  const id = newId(world, 'plant');
  world.plants.push({
    id,
    kind,
    flavor,
    pos: { x: Math.round(pos.x * 2) / 2, z: Math.round(pos.z * 2) / 2 },
    plantedMs: world.timeMs,
    water: 1,
    stage: 0,
    fruitTimerMs: PLANTS.treeFruitMs,
    ripe: false,
  });
  events.push({ kind: 'planted', id, flavor, plantKind: kind });
  return true;
}

export function waterPlant(world: World, id: string, events: SimEvent[]): boolean {
  const p = world.plants.find((x) => x.id === id);
  if (!p) return false;
  p.water = 1;
  events.push({ kind: 'watered', id });
  return true;
}

/** Harvest a ripe crop: seeds back plus fruit into the inventory as flavoured fruit items. */
export function harvest(world: World, id: string, rng: Rng, events: SimEvent[]): boolean {
  const p = world.plants.find((x) => x.id === id);
  if (!p || p.kind !== 'crop' || !p.ripe) return false;
  dropFlavoured(world, p, PLANTS.cropHarvest, rng);
  world.inventory.seeds[p.flavor] =
    (world.inventory.seeds[p.flavor] ?? 0) + (rng.chance(0.5) ? 2 : 1);
  p.ripe = false;
  p.stage = 1;
  p.plantedMs = world.timeMs;
  events.push({ kind: 'harvested', id, flavor: p.flavor, count: PLANTS.cropHarvest });
  return true;
}

function dropFlavoured(world: World, p: Plant, count: number, rng: Rng): void {
  for (let i = 0; i < count; i++) {
    const a = rng.float(0, Math.PI * 2);
    world.items.push({
      id: newId(world, 'fruit'),
      kind: 'fruit',
      pos: { x: p.pos.x + Math.cos(a) * 0.9, z: p.pos.z + Math.sin(a) * 0.9 },
      y: 0,
      vel: { x: 0, y: 0, z: 0 },
      flavor: p.flavor,
    });
  }
}

/** Per step: dry out, grow when watered, drop fruit when grown. */
export function stepPlants(world: World, dtMs: number, rng: Rng, events: SimEvent[]): void {
  const minutes = dtMs / 60_000;
  const raining = world.weather.kind === 'rain';
  for (const p of world.plants) {
    if (raining) p.water = 1;
    else p.water = Math.max(0, p.water - PLANTS.dryPerMinute * minutes);
    if (p.water <= 0) continue;
    const stageMs = p.kind === 'tree' ? PLANTS.treeStageMs : PLANTS.cropStageMs;
    if (p.stage < 3) {
      const stage = Math.min(3, Math.floor((world.timeMs - p.plantedMs) / stageMs));
      if (stage > p.stage) {
        p.stage = stage;
        events.push({ kind: 'plantGrew', id: p.id, stage });
        if (p.kind === 'crop' && stage === 3) p.ripe = true;
      }
      continue;
    }
    if (p.kind === 'tree') {
      p.fruitTimerMs -= dtMs;
      if (p.fruitTimerMs <= 0) {
        p.fruitTimerMs = PLANTS.treeFruitMs;
        if (world.items.filter((i) => i.kind === 'fruit').length < 14)
          dropFlavoured(world, p, 1, rng);
      }
    }
  }
}

/** What a flavoured fruit does when eaten. */
export function applyFlavor(n: Nubbin, flavor: Flavor | undefined): void {
  if (!flavor) return;
  if (flavor === 'sun') n.alignment = Math.min(1, n.alignment + PLANTS.fruitAlignment);
  else if (flavor === 'moon') n.alignment = Math.max(-1, n.alignment - PLANTS.fruitAlignment);
  else {
    addPoints(n.stats[flavor], PLANTS.fruitPoints);
    n.typeLean[flavor === 'stamina' ? 'normal' : flavor] += 3;
  }
  addHappiness(n, 2);
}
