/**
 * R0321 (FUN-32): peekaboo in the world. A shy Nubbin sometimes ducks behind a tree, rock or
 * lantern, on the side away from the Keeper, and waits there (the renderers keep the usual
 * billboard order, so the crown and a bit of tail show past the edge). When the Keeper walks
 * up, or it gets bored, it pops out with a giggle. All bands; the sprout "Where's Kiki?" toy
 * is a separate overlay.
 */
import { HIDE } from '../config/tuning-fun';
import { addHappiness } from './needs';
import { obstacles, resolve } from './obstacles';
import { isFree } from './nubbin';
import type { Rng } from './rng';
import type { IdleAct } from './soul-idle';
import type { Nubbin, Vec2, World } from './types';

const HIDING = /^(tree|rock|lantern|wild|well|windmill)(-|$)/;

/** The nearest hiding place and the spot behind it, as seen from the Keeper. */
export function hideSpot(world: World, n: Nubbin): Vec2 | null {
  const k = world.keeper.pos;
  let best: Vec2 | null = null;
  let bestD = HIDE.radius;
  for (const c of obstacles(world)) {
    if (c.shape.type !== 'circle' || c.top < 0.6 || !HIDING.test(c.id)) continue;
    if (c.flags.includes('soft') || c.flags.includes('nubbinOnly')) continue;
    const d = Math.hypot(c.x - n.pos.x, c.z - n.pos.z);
    const dk = Math.hypot(c.x - k.x, c.z - k.z);
    if (d >= bestD || dk < HIDE.minKeeperDist) continue;
    const ux = (c.x - k.x) / dk;
    const uz = (c.z - k.z) / dk;
    const gap = c.shape.r + 0.35;
    const p = { x: c.x + ux * gap, z: c.z + uz * gap };
    resolve(p, world, 0.3, 'nubbin');
    bestD = d;
    best = p;
  }
  return best;
}

/** The idle choice: a shy Nubbin, sometimes, goes to hide. Draws one rng value for shy ones only. */
export function hideAct(n: Nubbin, world: World, rng: Rng): IdleAct | null {
  if (n.personality !== 'shy' || n.stage === 'egg' || n.stage === 'cocoon') return null;
  if (!isFree(n) || !rng.chance(HIDE.shyChance)) return null;
  const at = hideSpot(world, n);
  if (!at) return null;
  return { state: 'hide', ms: rng.float(HIDE.ms[0], HIDE.ms[1]), target: at };
}

/** Whether the Keeper has found a hider (close enough to see it). */
export function hiderFound(world: World, n: Nubbin): boolean {
  const k = world.keeper.pos;
  return Math.hypot(k.x - n.pos.x, k.z - n.pos.z) <= HIDE.foundRadius;
}

/** The small reward for being found. */
export function rewardFound(n: Nubbin): void {
  addHappiness(n, HIDE.happiness);
}
