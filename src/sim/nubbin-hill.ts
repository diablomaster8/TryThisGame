/**
 * R0086 (WORLD-20): Nubbins use the hills' height field. While the Keeper is up a hill, an
 * idle Nubbin near it now and then walks up its ramp along `hillRoute` (one at a time: the ramp is one Nubbin wide), sits on the top a while and walks back down
 * (a Fly adult flutters up the first cliff instead of walking the first leg). The outing is
 * the `perform` state with an item id `hill:<hill>:<flutter 0|1>:<phase>:<waypoint>`, so a
 * save taken half way up restores it exactly. A Nubbin on a hill is not pushed off it (its
 * body collides as the Keeper's does, `nubbinBody`), may drop down a cliff, and never walks
 * up one (`hillStepOk`).
 */
import { BEHAVIOR } from '../config/tuning';
import { HILL_OUTING } from '../config/tuning-r11d2';
import { hashString } from './hash-string';
import { canStep, hillAt, hillRoute } from './height';
import { nubbinWalker, type ObstacleWalker } from './obstacles';
import { levelOf } from './stats';
import { hillHeight, TERRACES } from './terrain';
import type { Nubbin, Vec2, World } from './types';

const routes = new Map<string, Vec2[]>();

function route(h: number, flutter: boolean): Vec2[] {
  const key = `${h}:${flutter ? 1 : 0}`;
  let r = routes.get(key);
  if (!r) {
    r = hillRoute(TERRACES[h]!, flutter);
    routes.set(key, r);
  }
  return r;
}

interface Outing {
  h: number;
  flutter: boolean;
  phase: 'go' | 'up' | 'top' | 'down';
  i: number;
}

function parse(id: string | null): Outing | null {
  if (!id?.startsWith('hill:')) return null;
  const [, h, f, phase, i] = id.split(':');
  const hi = Number(h);
  if (!TERRACES[hi] || !phase) return null;
  return { h: hi, flutter: f === '1', phase: phase as Outing['phase'], i: Number(i) || 0 };
}

function idOf(o: Outing): string {
  return `hill:${o.h}:${o.flutter ? 1 : 0}:${o.phase}:${o.i}`;
}

/** Whether a Nubbin flutters up a cliff: an adult with Fly high enough. */
export function flutters(n: Nubbin): boolean {
  return n.stage === 'adult' && levelOf(n.stats.fly.points) >= HILL_OUTING.flutterFly;
}

/** Whether the Nubbin is on a hill's shelves or ramps, or on an outing up one. */
export function onHill(n: Nubbin): boolean {
  if (n.behavior.itemId?.startsWith('hill:') && n.behavior.target === null) return true;
  return hillHeight(n.pos.x, n.pos.z, false) > 0.02;
}

/** What a Nubbin's body collides as: the Keeper's rules on a hill (the hill does not push it off). */
export function nubbinBody(n: Nubbin): ObstacleWalker {
  return onHill(n) ? 'keeper' : nubbinWalker(n);
}

/** A walk step from (fx, fz) to the Nubbin's position is allowed (never up a cliff). */
export function hillStepOk(n: Nubbin, fx: number, fz: number): boolean {
  if (!onHill(n)) return true;
  return canStep('grove', { x: fx, z: fz }, n.pos, flutters(n));
}

/**
 * An outing to start now, or null: in the Grove, the Keeper up a hill and the Nubbin near
 * it, by a hash of the Nubbin and the second (no rng drawn). Gives the item id and where to walk first (the route's foot).
 */
export function hillOutingPlan(
  n: Nubbin,
  world: World,
  now: number,
): { itemId: string; target: Vec2; ms: number } | null {
  if (world.location !== 'grove' || (n.stage !== 'child' && n.stage !== 'adult')) return null;
  // Only while the Keeper is up a hill: they come up to join it.
  const k = world.keeper.pos;
  if (hillHeight(k.x, k.z, false) <= 0.02 || onHill(n)) return null;
  const hill = hillAt(k.x, k.z);
  const best = hill ? TERRACES.indexOf(hill) : -1;
  if (best < 0) return null;
  const t = TERRACES[best]!;
  if (Math.hypot(n.pos.x - t.x, n.pos.z - t.z) - t.r > HILL_OUTING.near) return null;
  const roll = hashString(`${n.id}:hill:${Math.floor(now / 1000)}`) % 1000;
  if (roll >= HILL_OUTING.chance * 1000) return null;
  // The ramp is one Nubbin wide: one outing per hill at a time.
  for (const o of world.nubbins) {
    if (o === n) continue;
    if (parse(o.behavior.itemId)?.h === best) return null;
    if (Math.hypot(o.pos.x - t.x, o.pos.z - t.z) < t.reach && onHill(o)) return null;
  }
  const flutter = flutters(n);
  const r = route(best, flutter);
  return {
    itemId: idOf({ h: best, flutter, phase: 'go', i: 0 }),
    target: { ...r[0]! },
    ms: 120000,
  };
}

/**
 * One step of an outing whose walk to the foot is over (`behavior.target` is null). Returns
 * true while it goes on, false when it is over (or the walk ended short of the foot), and
 * the caller then picks the next idle.
 */
export function hillOutingStep(n: Nubbin, dtMs: number, now: number): boolean {
  const o = parse(n.behavior.itemId);
  if (!o) return false;
  const b = n.behavior;
  const up = route(o.h, o.flutter);
  if (o.phase === 'go') {
    const p = up[0]!;
    if (Math.hypot(n.pos.x - p.x, n.pos.z - p.z) > HILL_OUTING.footReach) return false;
    o.phase = 'up';
    o.i = 1;
  }
  if (o.phase === 'top') {
    if (now < b.untilMs) return true;
    o.phase = 'down';
    o.i = route(o.h, false).length - 2;
  }
  const line = o.phase === 'up' ? up : route(o.h, false);
  if (o.i < 0 || o.i >= line.length) {
    if (o.phase === 'up') {
      o.phase = 'top';
      const [lo, hi] = HILL_OUTING.topMs;
      b.untilMs = now + lo + (hashString(`${n.id}:${now}`) % (hi - lo));
      b.itemId = idOf(o);
      return true;
    }
    return false;
  }
  const to = line[o.i]!;
  const dx = to.x - n.pos.x;
  const dz = to.z - n.pos.z;
  const d = Math.hypot(dx, dz);
  const step = BEHAVIOR.walkSpeed * HILL_OUTING.speedK * (dtMs / 1000);
  if (d <= step) {
    n.pos.x = to.x;
    n.pos.z = to.z;
    o.i += o.phase === 'up' ? 1 : -1;
  } else {
    n.pos.x += (dx / d) * step;
    n.pos.z += (dz / d) * step;
  }
  if (d > 1e-6) n.facing = Math.atan2(dx, dz);
  b.itemId = idOf(o);
  return true;
}
