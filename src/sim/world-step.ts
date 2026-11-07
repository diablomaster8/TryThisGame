/**
 * The Grove's own step systems: Nubbins, the Keeper, fruit trees and loose items. Pulled out of
 * world.ts (R0477) so that file keeps to the system list and the world's entry points.
 */
import { SKILLS, THROW, TREES } from '../config/tuning';
import { fruitOnHead, updateBehavior } from './behavior';
import { stepGearNeeds } from './dungeon-gear-effects';
import { inParty } from './dungeon';
import { flightStep, flightTrigger } from './flight-zones';
import { hatchInArms } from './hatch-arms';
import { advanceStage, hatch, keepEggshell } from './lifecycle';
import { updateKeeper } from './keeper';
import { stepKeeperDodge } from './keeper-dodge';
import { decayNeeds } from './needs';
import { isHeld } from './nubbin';
import { resolve } from './obstacles';
import { resolveNubbin } from './nubbin-hop';
import { crossExits } from './region-walk';
import { stepRegionCompanion } from './region-companion';
import { travel } from './regions';
import { isRidden, stepRide } from './ride';
import type { Rng } from './rng';
import { fruitIntervalMultiplier } from './seasons';
import { hasSkill } from './skills';
import { stepSwimTow } from './swim-tow';
import { collideThrown } from './throw-collide';
import type { StepCtx } from './systems';
import type { Item, SimEvent, Tree, World } from './types';
import { hatchSpeed, newId } from './world-util';

/** The Nubbins' own step: eggs incubate, needs decay, ages advance, behaviour runs. */
export function stepNubbins({ world, dtMs, offline, events }: StepCtx, rng: Rng): void {
  // Iterate a copy: a departure removes its Nubbin from the list.
  for (const n of [...world.nubbins]) {
    if (n.stage === 'egg') {
      // Eggs incubate on the ground, held and carried alike.
      n.hatchRemainingMs -= dtMs * hatchSpeed(world);
      // TECH-18: an egg ready in the Keeper's arms pops there and the child tumbles into a
      // hug; a thrown egg waits to land.
      if (n.hatchRemainingMs <= 0 && isHeld(n)) hatchInArms(world, n, events);
      if (n.hatchRemainingMs <= 0 && n.stage === 'egg' && n.behavior.state !== 'thrown') {
        hatch(n, events, world.timeMs);
        // Lane E, R0394: the eggshell goes in the hat box as the egg hatches.
        keepEggshell(n, world);
      }
      if (n.behavior.state === 'thrown') {
        updateBehavior(n, world, dtMs, rng, events);
        // MOVE-33: a thrown egg bounces off walls and never comes to rest inside one.
        if (n.behavior.state === 'thrown') collideThrown(world, n, events);
        else resolve(n.pos, world, 0.25, 'nubbin');
      }
      continue;
    }
    decayNeeds(n, dtMs);
    // R0164: Snug and Naps from worn gear.
    stepGearNeeds(world, n, dtMs);
    advanceStage(n, dtMs, events, world, offline);
    // Party members underground are moved by the Hollow step instead.
    // R0085: the ridden Nubbin is pinned under the Keeper by stepRide instead.
    // R0121: a partner in a drawn region follows the Keeper there instead.
    if (stepRegionCompanion(world, n, dtMs)) continue;
    if (world.nubbins.includes(n) && !inParty(world, n.id) && !isRidden(world, n.id)) {
      updateBehavior(n, world, dtMs, rng, events);
      // MOVE-33: a thrown Nubbin bonks off what is taller than it flies.
      if (n.behavior.state === 'thrown') collideThrown(world, n, events);
      resolveNubbin(n, world);
    }
  }
}

/** The Keeper's own step: intent, ride, tow, dodge. Live play only (catch-up never acts). */
export function stepKeeperSystem({ world, dtMs, events }: StepCtx): void {
  // R0085/R0088: the carrier follows the Keeper's step; a swimmer tows it through the pond.
  const fx = world.keeper.pos.x;
  const fz = world.keeper.pos.z;
  // R0109: an updraft or a glide moves the Keeper in place of its walking step.
  if (!flightStep(world, dtMs)) {
    updateKeeper(world, dtMs, events);
    flightTrigger(world, fx, fz);
  }
  const moved = Math.hypot(world.keeper.pos.x - fx, world.keeper.pos.z - fz);
  stepRide(world, dtMs, moved, events);
  stepSwimTow(world);
  stepKeeperDodge(world); /* R0299 (lane E r10): a hop past a Nubbin on a hard turn */
  // R11 lane D (WORLD-39): a border walked into: seamless now, loaded through the iris.
  const seam = crossExits(world, events);
  if (seam) travel(world, seam.id, events);
}

/**
 * The time between fruit drops now: the season (autumn) and Green Thumb change it. Live play
 * and offline catch-up both read it, so time away grows the same fruit as time here.
 */
export function fruitIntervalMs(world: World): number {
  const thumb = hasSkill(world, 'greenThumb') ? SKILLS.greenThumbFruitInterval : 1;
  return TREES.fruitIntervalMs * fruitIntervalMultiplier(world) * thumb;
}

export function updateTrees(world: World, dtMs: number, rng: Rng, events: SimEvent[]): void {
  for (const tree of world.trees) {
    tree.fruitTimerMs -= dtMs;
    if (tree.fruitTimerMs <= 0) {
      tree.fruitTimerMs += fruitIntervalMs(world);
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
  // R0300: a Nubbin under the tree may get it on the head.
  fruitOnHead(world, item, tree.pos, events);
  return item;
}

export function updateItems(world: World, dtMs: number): void {
  const dt = dtMs / 1000;
  for (const item of world.items) {
    if (item.y > 0) {
      item.vel.y -= THROW.gravity * dt;
      item.y = Math.max(0, item.y + item.vel.y * dt);
      if (item.y === 0) item.vel.y = 0;
    }
  }
}
