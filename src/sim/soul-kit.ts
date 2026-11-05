/**
 * Lane A round 11 (SOUL), helper G3: small helpers shared by the group games, weather play,
 * kin and visitor reactions. They set a Nubbin into a timed `perform` act the way the quirks
 * do, and move one by hand where a game needs it quicker than the usual walk (tag).
 */
import { GROVE } from '../config/tuning';
import { hashSeed } from './rng';
import { isFree } from './nubbin';
import type { Nubbin, Vec2, World } from './types';

export const h01 = (key: string): number => hashSeed(key) / 4294967296;
export const dist = (a: Vec2, b: Vec2): number => Math.hypot(a.x - b.x, a.z - b.z);
export const awake = (n: Nubbin): boolean => n.stage !== 'egg' && n.stage !== 'cocoon';

/** Free, awake and idling: a Nubbin a game or a reaction may take over. */
export function idle(n: Nubbin): boolean {
  if (!awake(n) || !isFree(n)) return false;
  const s = n.behavior.state;
  return s === 'wander' || s === 'sit';
}

/** Puts a Nubbin into a timed act (a walk target is optional). */
export function act(n: Nubbin, now: number, itemId: string, ms: number, target?: Vec2): void {
  const b = n.behavior;
  b.state = 'perform';
  b.sinceMs = now;
  b.untilMs = now + ms;
  b.itemId = itemId;
  b.target = target ? { x: target.x, z: target.z } : null;
  b.reaction = null;
}

/** Whether a Nubbin is still in an act of this kind (nothing else has taken it over). */
export const stillIn = (n: Nubbin | undefined, ids: readonly string[]): n is Nubbin =>
  !!n && isFree(n) && n.behavior.state === 'perform' && ids.includes(n.behavior.itemId ?? '');

/** Moves a Nubbin by hand toward a spot; returns true once it is within `reach`. */
export function moveToward(n: Nubbin, to: Vec2, speed: number, dtMs: number, reach = 0.3): boolean {
  const dx = to.x - n.pos.x;
  const dz = to.z - n.pos.z;
  const d = Math.hypot(dx, dz);
  if (d <= reach) return true;
  const step = Math.min(d, speed * (dtMs / 1000));
  n.pos.x += (dx / d) * step;
  n.pos.z += (dz / d) * step;
  n.facing = Math.atan2(dx, dz);
  clampToGrove(n.pos);
  return d - step <= reach;
}

/** A point `gap` units from `from`, directly away from `threat` (where a runner heads). */
export function awayFrom(from: Vec2, threat: Vec2, gap: number): Vec2 {
  const d = dist(from, threat) || 1;
  const p = {
    x: from.x + ((from.x - threat.x) / d) * gap,
    z: from.z + ((from.z - threat.z) / d) * gap,
  };
  clampToGrove(p);
  return p;
}

export function clampToGrove(p: Vec2): void {
  const lim = GROVE.size / 2 - 3;
  p.x = Math.max(-lim, Math.min(lim, p.x));
  p.z = Math.max(-lim, Math.min(lim, p.z));
}

/** True while a story scene is running or waiting: reactions to guests hold off. */
export function storyBusy(world: World): boolean {
  const c = world.campaign;
  if (!c) return false;
  if (c.queue.length > 0) return true;
  return Object.values(c.side).some(
    (s) =>
      s.status === 'open' && (s.stage === 'scene' || s.stage === 'done' || s.stage === 'complete'),
  );
}

/** True for two Nubbins bred from the same parents (R0572: they get on better). */
export function areSiblings(a: Nubbin, b: Nubbin): boolean {
  return (
    !!a.parents &&
    !!b.parents &&
    a !== b &&
    a.parents[0] === b.parents[0] &&
    a.parents[1] === b.parents[1]
  );
}

const LIGHT_ACTS = ['twirl', 'flex', 'poke', 'tend', 'splash', 'sneak', 'hum', 'daydream'];

/** Free to notice the Keeper: idle, greeting or playing, or in a light idle quirk. */
export function noticing(n: Nubbin): boolean {
  if (idle(n)) return true;
  if (!awake(n) || !isFree(n)) return false;
  const b = n.behavior;
  if (b.state === 'greet' || b.state === 'play') return true;
  return b.state === 'perform' && LIGHT_ACTS.includes(b.itemId ?? '');
}
