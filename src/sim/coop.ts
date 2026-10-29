import { resolve } from './obstacles';
import { runFloor } from './dungeon';
import { KEEPER2 } from '../config/tuning-move';
import { KEEPER, NEEDS } from '../config/tuning';
import { addTrust } from './trust';
import { createKeeper, keeperJump, petNubbin, updateKeeper } from './keeper';
import { eat } from './behavior';
import { isFree } from './nubbin';
import { TRAINERS } from './trainers';
import type { Keeper, SimEvent, Vec2, World } from './types';

/**
 * Drop-in local co-op: a second Keeper on the same screen, moved with IJKL or a gamepad,
 * who can pet and feed the nearest Nubbin. No server; the sim just has two Keepers.
 */
export function setCoop(world: World, active: boolean, trainer: string, events: SimEvent[]): void {
  world.coop = { active, trainer: TRAINERS.some((t) => t.id === trainer) ? trainer : 'nova' };
  if (active) {
    world.keeper2 ??= createKeeper({ x: world.keeper.pos.x + 1.5, z: world.keeper.pos.z });
  } else {
    world.keeper2 = null;
  }
  events.push({ kind: 'coop', active });
}

/** Keeper 2's view of each world (MOVE-54); see `asKeeper2`. */
const views = new WeakMap<World, World>();

/**
 * MOVE-54: the world as Keeper 2 sees it: the same world, with Keeper 2 as its Keeper. Keeper
 * 2 then moves by the very rules Keeper 1 does (fine substeps, colliders, ledges, the jump,
 * the mantle), and its passing motion state (speed, coyote, glide) is held by this view,
 * apart from Keeper 1's. Keeper 2 only walks by stick: it has no tap walks or care walks.
 */
function asKeeper2(world: World, k: Keeper): World {
  let view = views.get(world);
  if (!view) {
    view = Object.create(world) as World;
    views.set(world, view);
  }
  view.keeper = k;
  return view;
}

/** Keeper 2's move for one sim step. Its own jump and landing events stay its own. */
export function stepKeeper2(world: World, dtMs: number, events: SimEvent[]): void {
  const k = world.keeper2;
  if (!k || !world.coop.active) return;
  // A Keeper 2 saved before the jump (v6 and older) has no height yet: feet on the ground.
  if (!Number.isFinite(k.y))
    Object.assign(k, createKeeper(k.pos), { input: k.input, facing: k.facing });
  k.moveTarget = null;
  k.intent = null;
  const own: SimEvent[] = [];
  updateKeeper(asKeeper2(world, k), dtMs, own);
  // The renderers read keeper* events as Keeper 1's (dust, sounds, the camera's dip).
  for (const e of own)
    if (!e.kind.startsWith('keeper') && e.kind !== 'moveUnreachable' && e.kind !== 'cantReach')
      events.push(e);
  separateKeepers(world);
}

/** MOVE-54: Keeper 2's jump button (Enter, Numpad 0, or its pad's A). */
export function keeper2Jump(world: World, down: boolean): void {
  const k = world.keeper2;
  if (k && world.coop.active) keeperJump(asKeeper2(world, k), down);
}

/**
 * MOVE-54: the two Keepers never stand in each other: when their bodies overlap and their
 * feet are within `sepHeight` of each other, each steps back half the overlap, then out of
 * anything solid that put it in.
 */
export function separateKeepers(world: World): void {
  const a = world.keeper;
  const b = world.keeper2;
  if (!b || !world.coop.active || Math.abs(a.y - b.y) > KEEPER2.sepHeight) return;
  const dx = b.pos.x - a.pos.x;
  const dz = b.pos.z - a.pos.z;
  const d = Math.hypot(dx, dz);
  const min = KEEPER2.body * 2;
  if (d >= min) return;
  const nx = d > 1e-6 ? dx / d : 1;
  const nz = d > 1e-6 ? dz / d : 0;
  const push = (min - d) / 2;
  a.pos.x -= nx * push;
  a.pos.z -= nz * push;
  b.pos.x += nx * push;
  b.pos.z += nz * push;
  if (runFloor(world)) return;
  // Keeper 1 pinned against something solid: Keeper 2 takes the rest of the gap.
  resolve(a.pos, world, KEEPER2.body, 'keeper', a.y);
  const ex = b.pos.x - a.pos.x;
  const ez = b.pos.z - a.pos.z;
  const e = Math.hypot(ex, ez);
  if (e < min) {
    b.pos.x = a.pos.x + (e > 1e-6 ? ex / e : nx) * min;
    b.pos.z = a.pos.z + (e > 1e-6 ? ez / e : nz) * min;
  }
  resolve(b.pos, world, KEEPER2.body, 'keeper', b.y);
}

function nearest(world: World, pos: Vec2) {
  let best = null as World['nubbins'][number] | null;
  let d = KEEPER.interactRadius + 0.8;
  for (const n of world.nubbins) {
    if (n.stage === 'egg' || !isFree(n)) continue;
    const dist = Math.hypot(n.pos.x - pos.x, n.pos.z - pos.z);
    if (dist < d) {
      d = dist;
      best = n;
    }
  }
  return best;
}

export function keeper2Act(world: World, action: 'pet' | 'feed', events: SimEvent[]): void {
  const k = world.keeper2;
  if (!k || !world.coop.active) return;
  const n = nearest(world, k.pos);
  if (!n) return;
  if (action === 'pet') {
    petNubbin(world, n, events);
  } else if (world.inventory.fruit > 0) {
    world.inventory.fruit -= 1;
    eat(n, world.timeMs, events);
    addTrust(n, NEEDS.petAffection, events);
  }
}
