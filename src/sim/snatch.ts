/**
 * R0545 (SOUL-27): a mischievous Nubbin (a Moon one more often) sees another walking to a
 * fruit nearby and sprints for it. If it gets there first it grabs the fruit, runs off a
 * few steps holding it over its head and eats it with a smug face; the other one looks
 * surprised, then sad, and thinks a little less of it. Never from a Nubbin that is starving.
 *
 * Chances are hashed from the Nubbin and the second (no world rng drawn), as the traits'.
 */
import { NEEDS, SNATCH } from '../config/tuning';
import { liveliness, soulLive } from './antics';
import { roll } from './traits';
import { addRivalry } from './rivals';
import { RIVALS } from '../config/tuning-soul-r10';
import type { IdleAct } from './soul-idle';
import { isFree } from './nubbin';
import type { Flavor, Nubbin, SimEvent, World } from './types';

const dist = (a: { x: number; z: number }, b: { x: number; z: number }): number =>
  Math.hypot(a.x - b.x, a.z - b.z);

function cheek(n: Nubbin): number {
  const p = n.personality ?? null;
  if (p !== 'mischievous') return 0;
  const moon = n.stage === 'adult' && n.form?.band === 'moon';
  return moon ? SNATCH.moonScale : 1;
}

/**
 * For a wandering or sitting Nubbin, once per sim second: the dash for another's fruit, or
 * null. The act's item id names the fruit and the one it was taken from.
 */
export function snatchAct(n: Nubbin, world: World, now: number, dtMs: number): IdleAct | null {
  if (Math.floor(now / 1000) === Math.floor((now - dtMs) / 1000)) return null;
  // Lane A r10: a snatch (and the grudge it leaves) is for watching, never in catch-up.
  if (!soulLive()) return null;
  const c = cheek(n);
  if (c <= 0 || n.stage === 'egg' || n.stage === 'cocoon') return null;
  if (roll(n, 'snatch', now) >= SNATCH.perSecond * c * liveliness(world)) return null;
  for (const v of world.nubbins) {
    if (v.id === n.id || v.behavior.state !== 'findFood' || !v.behavior.itemId) continue;
    if (dist(v.pos, n.pos) > SNATCH.radius) continue;
    if (v.needs.hunger < NEEDS.starvingThreshold) continue;
    const fruit = world.items.find((i) => i.id === v.behavior.itemId);
    if (!fruit) continue;
    return {
      state: 'perform',
      ms: SNATCH.eatMs,
      itemId: `snatch:${fruit.id}:${v.id}`,
      target: { x: fruit.pos.x, z: fruit.pos.z },
    };
  }
  return null;
}

/** The sprint's speed multiplier for a perform act, by its item id. */
export function snatchSpeed(itemId: string | null): number {
  return itemId?.startsWith('snatch:') ? SNATCH.sprint : 1;
}

/**
 * On arrival: at the fruit, grab it if it is still there and run off with it (the act goes
 * on as `snatchRun`, with a new target; the victim looks surprised), or give up; at the end
 * of the run, eat it (and the victim, if it is free and near, looks sad). Returns whether
 * the arrival was a snatch's.
 */
export function snatchArrive(
  n: Nubbin,
  world: World,
  now: number,
  events: SimEvent[],
  hooks: {
    react: (who: Nubbin, r: 'surprised' | 'sad') => void;
    eat: (flavor: Flavor | undefined) => void;
  },
): boolean {
  const b = n.behavior;
  const id = b.itemId ?? '';
  if (id.startsWith('snatchRun:')) {
    const [, flavor, victimId] = id.split(':');
    hooks.eat(flavor === 'plain' ? undefined : (flavor as Flavor));
    const victim = world.nubbins.find((v) => v.id === victimId);
    if (victim && isFree(victim) && dist(victim.pos, n.pos) < SNATCH.radius * 2)
      hooks.react(victim, 'sad');
    return true;
  }
  if (!id.startsWith('snatch:')) return false;
  const [, fruitId, victimId] = id.split(':');
  const fruit = world.items.find((i) => i.id === fruitId);
  const victim = world.nubbins.find((v) => v.id === victimId);
  if (!fruit || dist(fruit.pos, n.pos) > 1.2) {
    // Too late: it stops where it is and thinks of something else.
    b.itemId = null;
    b.target = null;
    b.untilMs = now;
    return true;
  }
  world.items = world.items.filter((i) => i.id !== fruit.id);
  // Off with it over its head, away from the one it took it from.
  const from = victim?.pos ?? fruit.pos;
  const away = dist(n.pos, from) || 1;
  b.itemId = `snatchRun:${fruit.flavor ?? 'plain'}:${victimId}`;
  b.target = {
    x: n.pos.x + ((n.pos.x - from.x) / away) * SNATCH.runAway,
    z: n.pos.z + ((n.pos.z - from.z) / away) * SNATCH.runAway,
  };
  b.sinceMs = now;
  b.untilMs = now + SNATCH.runMs;
  if (victim) {
    if (isFree(victim)) hooks.react(victim, 'surprised');
    const f = { ...(victim.friends ?? {}) };
    f[n.id] = Math.max(0, (f[n.id] ?? 0) - SNATCH.friendshipCost);
    victim.friends = f;
    // R0538/R0545 (lane A r10): a grudge, and a hurry on its next fruit so it isn't starved.
    addRivalry(victim, n, RIVALS.snatch, events);
    victim.searchBoost = true;
    events.push({ kind: 'snatched', nubbinId: n.id, victimId: victim.id });
  }
  return true;
}
