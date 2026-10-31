/**
 * R0299 (FUN-10, lane E r10): a running Keeper who turns hard right beside a Nubbin does a
 * little hop to miss it. Uses the ordinary jump (a press, let go at once, so the rise is
 * cut short to a hop), with a cooldown. Live play only; never while carrying or in the air.
 * The last step's heading is kept beside the world, so nothing is saved.
 */
import { KEEPER_DODGE } from '../config/tuning-fun-r10';
import { keeperJump, keeperRunningNow } from './keeper';
import type { World } from './types';

interface DodgeMemo {
  facing: number;
  atMs: number;
  /** When the last hop went, for the cooldown. */
  hopMs: number;
  /** A press to let go of on the next step (the cut-short rise). */
  release: boolean;
}
const memos = new WeakMap<World, DodgeMemo>();

function turn(a: number, b: number): number {
  const d = Math.abs(a - b) % (Math.PI * 2);
  return d > Math.PI ? Math.PI * 2 - d : d;
}

/** Each live step, after the Keeper moves. True when a hop started this step. */
export function stepKeeperDodge(world: World): boolean {
  const k = world.keeper;
  const now = world.timeMs;
  let m = memos.get(world);
  if (!m) {
    m = { facing: k.facing, atMs: now, hopMs: -Infinity, release: false };
    memos.set(world, m);
    return false;
  }
  if (m.release) {
    keeperJump(world, false);
    m.release = false;
  }
  const turned = turn(k.facing, m.facing);
  const prev = m.atMs;
  m.facing = k.facing;
  m.atMs = now;
  if (world.location !== 'grove' || k.carrying || !k.grounded) return false;
  if (turned < KEEPER_DODGE.turn || now - prev > KEEPER_DODGE.windowMs) return false;
  if (now - m.hopMs < KEEPER_DODGE.cooldownMs || !keeperRunningNow(world)) return false;
  const near = world.nubbins.some(
    (n) =>
      n.y < 0.05 &&
      n.behavior.state !== 'held' &&
      Math.hypot(n.pos.x - k.pos.x, n.pos.z - k.pos.z) < KEEPER_DODGE.reach,
  );
  if (!near) return false;
  keeperJump(world, true);
  m.release = true;
  m.hopMs = now;
  return true;
}
