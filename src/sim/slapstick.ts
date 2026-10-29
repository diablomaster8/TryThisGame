/**
 * R0299 (FUN-10): gentle slapstick on a walk. Now and then a wandering Nubbin is distracted
 * (looking up at a butterfly) and ambles toward the nearest tree trunk, which a Nubbin
 * normally walks under, and bonks into it: dizzy stars for a moment, no stat change, then
 * it carries on. The roll is a hash of the Nubbin and the walk's start, so the world's
 * dice are untouched, and the check runs only for a distracted walk, so idle cost is nil.
 */
import { SLAPSTICK } from '../config/tuning-fun';
import { react } from './behavior';
import { blocked, nubbinWalker, obstacles, stops } from './obstacles';
import { hashSeed } from './rng';
import type { Nubbin, SimEvent, World } from './types';

interface WalkMemo {
  since: number;
  distracted: boolean;
}
const memos = new WeakMap<Nubbin, WalkMemo>();

/** Whether this wander walk is a distracted one (decided once per walk). */
export function distractedWalk(n: Nubbin): boolean {
  return memos.get(n)?.distracted ?? false;
}

/**
 * Called each step of a wander. Returns true when the Nubbin bonked (it is now reacting,
 * so the caller leaves it be).
 */
export function stepWanderGag(n: Nubbin, world: World, now: number, events: SimEvent[]): boolean {
  if (world.location !== 'grove' || n.stage === 'egg' || n.y > 0.05) return false;
  const b = n.behavior;
  let m = memos.get(n);
  if (!m || m.since !== b.sinceMs) {
    const roll = (hashSeed(`${n.id}:${b.sinceMs}`) >>> 0) % 1000;
    m = { since: b.sinceMs, distracted: roll < SLAPSTICK.perMille };
    memos.set(n, m);
    if (m.distracted) {
      // Eyes on the butterfly, feet toward the nearest trunk it would usually walk under.
      const who = nubbinWalker(n);
      let best: { x: number; z: number } | null = null;
      let bestD: number = SLAPSTICK.reach;
      for (const c of obstacles(world)) {
        if (!stops(c, 'keeper') || stops(c, who)) continue;
        const d = Math.hypot(c.x - n.pos.x, c.z - n.pos.z);
        if (d < bestD && d > 0.5) {
          bestD = d;
          best = c;
        }
      }
      if (best) {
        const k = (bestD + 1) / bestD;
        b.target = { x: n.pos.x + (best.x - n.pos.x) * k, z: n.pos.z + (best.z - n.pos.z) * k };
      } else m.distracted = false;
    }
  }
  if (!m.distracted || !blocked(n.pos, world, SLAPSTICK.radius, 'keeper')) return false;
  m.distracted = false;
  events.push({ kind: 'bonked', nubbinId: n.id, by: 'obstacle' });
  react(n, 'dizzy', now, events);
  return true;
}
