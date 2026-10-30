/**
 * R0542 (SOUL-24), the lane A r9 half: Sun and Moon Nubbins and fruit. A Sun one picks up
 * a fallen fruit and carries it to a hungry Nubbin that has none near it (its "share"); a
 * Moon one carries a fruit off to its stash beside the nearest tree and sits on it (its
 * "hoard"). The hoard is an ordinary fruit lying there, so it is eaten later like any other
 * and no food is lost. The fruit is lifted out of the world while carried (so nobody else
 * walks to it) and put back where it is set down, with its flavour.
 *
 * Chances are hashed from the Nubbin and the second, as the traits' are (no world rng).
 */
import { CARRY_FRUIT } from '../config/tuning';
import { roll } from './traits';
import { bandStrength, type IdleAct } from './soul-idle';
import type { Flavor, Item, Nubbin, SimEvent, World } from './types';
import { newId } from './world';

const dist = (a: { x: number; z: number }, b: { x: number; z: number }): number =>
  Math.hypot(a.x - b.x, a.z - b.z);

const fruitsOnGround = (world: World): Item[] =>
  world.items.filter((i) => i.kind === 'fruit' && i.y <= 0.05);

/** The act for this idle choice, or null. */
export function carryAct(n: Nubbin, world: World, now: number): IdleAct | null {
  if (n.stage === 'egg' || n.stage === 'cocoon') return null;
  const b = bandStrength(n, world);
  if (!b) return null;
  const C = CARRY_FRUIT;
  const fruits = fruitsOnGround(world).filter((f) => dist(f.pos, n.pos) < C.fetchRadius);
  if (!fruits.length) return null;
  const nearest = fruits.reduce((a, f) => (dist(f.pos, n.pos) < dist(a.pos, n.pos) ? f : a));
  if (b.band === 'sun') {
    const all = fruitsOnGround(world);
    const mark = world.nubbins.find(
      (o) =>
        o.id !== n.id &&
        o.stage !== 'egg' &&
        o.stage !== 'cocoon' &&
        o.needs.hunger < C.hungryBelow &&
        dist(o.pos, n.pos) < C.shareRadius &&
        !all.some((f) => dist(f.pos, o.pos) < C.noneWithin),
    );
    if (!mark || roll(n, 'share', now) >= Math.min(1, C.shareChance * b.s)) return null;
    return {
      state: 'perform',
      ms: C.carryMs,
      itemId: `share:${nearest.id}:${mark.id}`,
      target: { x: nearest.pos.x, z: nearest.pos.z },
    };
  }
  if (roll(n, 'hoard', now) >= Math.min(1, C.hoardChance * b.s)) return null;
  return {
    state: 'perform',
    ms: C.carryMs,
    itemId: `hoard:${nearest.id}`,
    target: { x: nearest.pos.x, z: nearest.pos.z },
  };
}

/** The stash spot: beside the tree nearest this Nubbin, on the far side from the pond's. */
function stashSpot(world: World, n: Nubbin): { x: number; z: number } {
  let best = world.trees[0]?.pos ?? n.pos;
  for (const t of world.trees) if (dist(t.pos, n.pos) < dist(best, n.pos)) best = t.pos;
  return { x: best.x - 1.1, z: best.z + 0.8 };
}

/**
 * On arrival: at the fruit, lift it and set off (to the hungry one, or the stash); at the
 * end, set it down (the hungry one is pleased; the hoarder sits on its stash). True when
 * the arrival was a carry's.
 */
export function carryArrive(
  n: Nubbin,
  world: World,
  now: number,
  events: SimEvent[],
  react: (who: Nubbin, r: 'love') => void,
): boolean {
  const b = n.behavior;
  const id = b.itemId ?? '';
  const [kind, a, c] = id.split(':');
  if (kind === 'share' || kind === 'hoard') {
    const fruit = world.items.find((i) => i.id === a);
    if (!fruit || dist(fruit.pos, n.pos) > 1.2 || fruit.y > 0.05) {
      b.itemId = null;
      b.target = null;
      b.untilMs = now;
      return true;
    }
    world.items = world.items.filter((i) => i.id !== fruit.id);
    const flavor = fruit.flavor ?? 'plain';
    const mark = kind === 'share' ? world.nubbins.find((o) => o.id === c) : null;
    b.itemId = kind === 'share' ? `shareRun:${flavor}:${c}` : `hoardRun:${flavor}`;
    b.target = mark ? { x: mark.pos.x + 0.9, z: mark.pos.z } : stashSpot(world, n);
    b.sinceMs = now;
    b.untilMs = now + CARRY_FRUIT.carryMs;
    return true;
  }
  if (kind !== 'shareRun' && kind !== 'hoardRun') return false;
  // Set the fruit down here, flavour and all.
  const item: Item = {
    id: newId(world, 'fruit'),
    kind: 'fruit',
    pos: { x: n.pos.x + (kind === 'shareRun' ? -0.5 : 0), z: n.pos.z + 0.2 },
    y: 0,
    vel: { x: 0, y: 0, z: 0 },
    ...(a && a !== 'plain' ? { flavor: a as Flavor } : {}),
  };
  world.items.push(item);
  if (kind === 'shareRun') {
    const mark = world.nubbins.find((o) => o.id === c);
    if (mark) {
      n.facing = Math.atan2(mark.pos.x - n.pos.x, mark.pos.z - n.pos.z);
      if (mark.behavior.state !== 'eat' && mark.behavior.state !== 'held') react(mark, 'love');
      events.push({ kind: 'sharedFruit', nubbinId: n.id, markId: mark.id });
    }
    b.itemId = null;
    return true;
  }
  // The hoarder sits on its stash a while, looking pleased with itself.
  b.state = 'sit';
  b.itemId = 'hoardSit';
  b.target = null;
  b.sinceMs = now;
  b.untilMs = now + CARRY_FRUIT.sitMs;
  return true;
}
