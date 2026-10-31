/**
 * R0542 (SOUL-24), the lane A r10 half: a Sun Nubbin tidies up. Now and then it walks to a
 * toy lying about away from the toy corner by the cottage, and pushes it back there, the
 * toy rolling along in front of it; then it looks pleased with itself. Nobody else's play is
 * cut short (a toy someone is playing with or fetching is left alone).
 *
 * Chances are hashed (`roll`), so no world rng is drawn, and it never starts while catching
 * up on time away (`soulLive`).
 */
import { TIDY } from '../config/tuning-soul-r10';
import { soulLive } from './antics';
import { addHappiness } from './needs';
import { resolve } from './obstacles';
import { bandStrength, type IdleAct } from './soul-idle';
import { roll } from './traits';
import type { Item, Nubbin, Vec2, World } from './types';

const dist = (a: Vec2, b: Vec2): number => Math.hypot(a.x - b.x, a.z - b.z);

/** The toy corner, pushed clear of any solid. */
export function toyCorner(world: World): Vec2 {
  const p = { x: TIDY.spot.x, z: TIDY.spot.z };
  resolve(p, world, 0.6, 'nubbin');
  return p;
}

const inUse = (world: World, toy: Item): boolean =>
  world.nubbins.some(
    (o) =>
      (o.behavior.state === 'play' || o.behavior.state === 'fetch') && o.behavior.itemId === toy.id,
  ) || world.nubbins.some((o) => o.behavior.itemId === `tidy:${toy.id}`);

/** The idle choice's tidy act for a Sun Nubbin, or null. */
export function tidyAct(n: Nubbin, world: World, now: number): IdleAct | null {
  if (!soulLive() || n.stage === 'egg' || n.stage === 'cocoon') return null;
  const b = bandStrength(n, world);
  if (b?.band !== 'sun') return null;
  if (roll(n, 'tidy', now) >= Math.min(1, TIDY.chance * b.s)) return null;
  const corner = toyCorner(world);
  let toy: Item | null = null;
  for (const t of world.items) {
    if (t.kind !== 'toy' || t.y > 0.05 || dist(t.pos, corner) < TIDY.strayFrom) continue;
    if (dist(t.pos, n.pos) > TIDY.fetchRadius || inUse(world, t)) continue;
    if (!toy || dist(t.pos, n.pos) < dist(toy.pos, n.pos)) toy = t;
  }
  if (!toy) return null;
  return {
    state: 'perform',
    ms: TIDY.legMs,
    itemId: `tidy:${toy.id}`,
    target: { x: toy.pos.x, z: toy.pos.z },
  };
}

/** The walk speed multiplier for a perform act: pushing a toy home is slower. */
export function tidySpeed(itemId: string | null): number {
  return itemId?.startsWith('tidyRun:') ? TIDY.pushSpeed : 1;
}

/** While pushing, the toy rolls along just in front of it (each step, before the walk). */
export function tidyPush(n: Nubbin, world: World): void {
  const id = n.behavior.itemId ?? '';
  if (!id.startsWith('tidyRun:')) return;
  const toy = world.items.find((i) => i.id === id.slice('tidyRun:'.length));
  if (!toy) return;
  toy.pos.x = n.pos.x + Math.sin(n.facing) * TIDY.ahead;
  toy.pos.z = n.pos.z + Math.cos(n.facing) * TIDY.ahead;
}

/**
 * On arrival (or a stalled walk): at the toy, set off pushing it to the corner; at the
 * corner, leave it there and look pleased. True when the arrival was a tidy's.
 */
export function tidyArrive(n: Nubbin, world: World, now: number): boolean {
  const b = n.behavior;
  const id = b.itemId ?? '';
  if (id.startsWith('tidyRun:')) {
    addHappiness(n, TIDY.happiness);
    b.itemId = 'tidyDone';
    b.target = null;
    b.sinceMs = now;
    b.untilMs = now + 1500;
    return true;
  }
  if (!id.startsWith('tidy:')) return false;
  const toy = world.items.find((i) => i.id === id.slice('tidy:'.length));
  if (!toy || dist(toy.pos, n.pos) > 1.4) {
    b.itemId = null;
    b.target = null;
    b.untilMs = now;
    return true;
  }
  const corner = toyCorner(world);
  b.itemId = `tidyRun:${toy.id}`;
  b.target = corner;
  b.sinceMs = now;
  b.untilMs = now + TIDY.legMs;
  n.facing = Math.atan2(corner.x - n.pos.x, corner.z - n.pos.z);
  return true;
}
