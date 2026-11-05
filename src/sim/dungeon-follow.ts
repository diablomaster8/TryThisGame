/**
 * Polite following in the Hollow (R0048, round 11). A party Nubbin used to walk at the
 * Keeper's exact spot. Now each one heads for a slot on a ring behind the Keeper (by party
 * index), and a follower left far behind and out of sight for a few seconds pops to the
 * nearest free spot behind the Keeper. Runtime state only, never saved.
 *
 * Pure sim: no DOM, no Three.js.
 */
import { HOLLOW } from '../config/tuning';
import { cellAt, cellOf, FLOOR, isWalkable, type Floor } from './dungeon';
import { navMask } from './dungeon-nav';
import { propBlocked } from './dungeon-props';
import type { DungeonRun, Nubbin, Vec2, World } from './types';

const lostMs = new WeakMap<DungeonRun, Record<string, number>>();

/** Whether a body of the follower's size can stand at `p`. */
function free(f: Floor, p: Vec2): boolean {
  const c = cellOf(f, p);
  if (!isWalkable(f, c.x, c.y) || cellAt(f, c.x, c.y) !== FLOOR) return false;
  // A slot the nav grid shuts would send the follower's route-finder round in circles.
  if (!navMask(f, true)[c.y * f.cols + c.x]) return false;
  return !propBlocked(p, f, 0.3);
}

/** Open ground between two points: no rock cell on the straight line. */
function clearLine(f: Floor, a: Vec2, b: Vec2): boolean {
  const len = Math.hypot(b.x - a.x, b.z - a.z);
  const steps = Math.ceil(len / 0.5);
  for (let i = 1; i < steps; i++) {
    const t = i / steps;
    const c = cellOf(f, { x: a.x + (b.x - a.x) * t, z: a.z + (b.z - a.z) * t });
    if (!isWalkable(f, c.x, c.y)) return false;
  }
  return true;
}

/**
 * The point a follower with party index `index` heads for: on the ring `slotRadius` behind
 * the Keeper, fanned out by index, the nearest free angle if its own is rock or a prop.
 */
export function slotTarget(world: World, f: Floor, index: number): Vec2 {
  const k = world.keeper;
  const H = HOLLOW.follow;
  const base = k.facing + Math.PI;
  const fan = Math.ceil(index / 2) * (index % 2 ? 1 : -1) * H.fan;
  for (let step = 0; step < 12; step++) {
    const turn = Math.ceil(step / 2) * (step % 2 ? 1 : -1) * 0.5;
    const a = base + fan + turn;
    const p = { x: k.pos.x + Math.sin(a) * H.slotRadius, z: k.pos.z + Math.cos(a) * H.slotRadius };
    if (free(f, p) && clearLine(f, k.pos, p)) return p;
  }
  return { x: k.pos.x, z: k.pos.z };
}

/**
 * Counts how long `n` has been far off and out of sight; after `popAfterMs` it pops to its
 * slot. Returns true on the step it popped.
 */
export function popIfLost(
  world: World,
  run: DungeonRun,
  f: Floor,
  n: Nubbin,
  dtMs: number,
): boolean {
  const k = world.keeper;
  const H = HOLLOW.follow;
  let table = lostMs.get(run);
  if (!table) {
    table = {};
    lostMs.set(run, table);
  }
  const far = Math.hypot(n.pos.x - k.pos.x, n.pos.z - k.pos.z) > H.popDistance;
  if (!far || clearLine(f, k.pos, n.pos)) {
    table[n.id] = 0;
    return false;
  }
  table[n.id] = (table[n.id] ?? 0) + dtMs;
  if (table[n.id]! < H.popAfterMs) return false;
  table[n.id] = 0;
  const to = slotTarget(world, f, Math.max(0, run.party.indexOf(n.id)));
  n.pos.x = to.x;
  n.pos.z = to.z;
  n.behavior.target = null;
  return true;
}
