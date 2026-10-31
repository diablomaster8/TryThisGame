/**
 * R0558 (SOUL-41), the sim side: the rest of the state machine gets a personality.
 * - Eating: a glutton gulps (quicker, then a burp), a shy one nibbles (slower), a lazy one
 *   lies down to eat, a cheerful one chomps happily. The act's `itemId` names the way
 *   (`gulp`, `nibble`, `lieEat`, `chomp`) for the renderers.
 * - Napping: a tired shy one walks to the nearest tree to nap under it, a cheerful one to
 *   its best friend's side; the rest (a lazy one especially) nap wherever they are.
 * - Swimming: a lazy one floats on its back, drifting.
 *
 * Live play only (`soulLive`), so time away is simulated exactly as before.
 */
import { STATE_FLAVOUR } from '../config/tuning-soul-r10';
import { soulLive } from './antics';
import { bestFriend } from './friendships';
import { hasTrait } from './traits';
import type { Nubbin, Vec2, World } from './types';

const dist = (a: Vec2, b: Vec2): number => Math.hypot(a.x - b.x, a.z - b.z);

/** How it eats: the act's name and its time scale, or null for the plain way. */
export function eatFlavour(n: Nubbin): { itemId: string; scale: number } | null {
  if (!soulLive()) return null;
  if (hasTrait(n, 'glutton')) return { itemId: 'gulp', scale: STATE_FLAVOUR.gulpScale };
  switch (n.personality) {
    case 'shy':
      return { itemId: 'nibble', scale: STATE_FLAVOUR.nibbleScale };
    case 'lazy':
      return { itemId: 'lieEat', scale: 1 };
    case 'cheerful':
      return { itemId: 'chomp', scale: 1 };
    default:
      return null;
  }
}

/** Where a tired Nubbin goes to nap first, or null to nap where it is. */
export function napSpot(n: Nubbin, world: World): Vec2 | null {
  if (!soulLive() || n.stage === 'egg' || n.stage === 'cocoon') return null;
  if (n.personality === 'shy') {
    let tree: Vec2 | null = null;
    for (const t of world.trees)
      if (
        dist(t.pos, n.pos) < STATE_FLAVOUR.napTreeRadius &&
        (!tree || dist(t.pos, n.pos) < dist(tree, n.pos))
      )
        tree = t.pos;
    // Under the canopy, on the side it came from.
    if (!tree) return null;
    const d = dist(tree, n.pos) || 1;
    return {
      x: tree.x + ((n.pos.x - tree.x) / d) * 0.9,
      z: tree.z + ((n.pos.z - tree.z) / d) * 0.9,
    };
  }
  if (n.personality === 'cheerful') {
    const f = bestFriend(world, n);
    if (!f || dist(f.pos, n.pos) > STATE_FLAVOUR.napFriendRadius) return null;
    return { x: f.pos.x + 0.8, z: f.pos.z };
  }
  return null;
}

/** The swim speed multiplier: a lazy one drifts on its back. */
export function swimPace(n: Nubbin): number {
  return soulLive() && n.personality === 'lazy' ? STATE_FLAVOUR.lazyFloat : 1;
}
