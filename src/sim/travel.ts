import { LANDMARKS, PARTNERS } from '../config/tuning';
import { clampToWorld } from './behavior';
import { teleport } from './landmarks';
import { regionOf } from './regions';
import { markRunWalk } from './keeper';
import type { SimEvent, Vec2, World } from './types';

/**
 * R0074: fast travel as a real trip. The world map sends `fastTravel` to a found landmark (or a
 * story mark it shows); the Keeper arrives there with whatever they carry still carried and
 * their partners close behind, and `travelled` tells the renderer to play the iris. Travel is
 * free and only within the Grove for now: the other regions are reached through their exits
 * (`regions.ts`), and their signposts join as travel points once they are drawn (WORLD-30).
 * Story scenes and minigames are refused by the UI, which knows when one is open.
 */
export type FastTravelBlock = 'elsewhere' | 'unknown' | 'not-found';

/** Where a trip goes, or why it can't: a landmark id must be found, a mark is shown found. */
export function fastTravelTarget(
  world: World,
  to: { poi?: string; pos?: Vec2 },
): { pos: Vec2 } | { block: FastTravelBlock } {
  if (regionOf(world.location) !== 'grove' || world.location !== 'grove')
    return { block: 'elsewhere' };
  if (to.poi !== undefined) {
    const l = LANDMARKS.find((m) => m.id === to.poi);
    if (!l) return { block: 'unknown' };
    if (world.landmarks[l.id] === undefined) return { block: 'not-found' };
    return { pos: { x: l.x, z: l.z } };
  }
  if (to.pos) return { pos: to.pos };
  return { block: 'unknown' };
}

/** Take the trip. Refusals are an event the map turns into a toast. */
export function fastTravel(
  world: World,
  to: { poi?: string; pos?: Vec2 },
  events: SimEvent[],
): boolean {
  const t = fastTravelTarget(world, to);
  if ('block' in t) {
    events.push({ kind: 'travelRefused', exit: to.poi ?? 'pos', reason: t.block });
    return false;
  }
  const from = { ...world.keeper.pos };
  teleport(world, t.pos);
  const k = world.keeper;
  // The carried Nubbin rides along above the Keeper's head.
  const held = k.carrying ? world.nubbins.find((n) => n.id === k.carrying) : undefined;
  if (held) held.pos = { ...k.pos };
  // Partners arrive a step behind, on either side, inside the follow distance.
  world.partners.forEach((id, i) => {
    const n = id ? world.nubbins.find((m) => m.id === id) : undefined;
    if (!n || n === held) return;
    const side = i === 0 ? -1 : 1;
    const r = PARTNERS.followDistance * 0.5;
    n.pos = { x: k.pos.x + side * r * 0.7, z: k.pos.z + r * 0.7 };
    clampToWorld(n.pos);
  });
  events.push({ kind: 'travelled', from, to: { ...k.pos } });
  return true;
}

/**
 * R0102: the Travel assist setting. Walk leaves travel to the player; Auto-walk turns a tapped
 * beacon or map pin into a run there (any other tap cancels it, as every tap walk replaces the
 * last); Skip fast-travels straight there. Unset reads as Auto-walk in a Learning Grove and Walk
 * otherwise, so older saves need no migration.
 */
export type TravelMode = NonNullable<World['settings']['travel']>;

export function travelMode(world: World): TravelMode {
  const saved = world.settings.travel;
  // An imported save could carry anything here: only the three modes count.
  if (saved === 'walk' || saved === 'auto' || saved === 'skip') return saved;
  return world.edu ? 'auto' : 'walk';
}

/** Auto-walk: a tap walk to `pos` that runs, whatever the Auto-run setting says. */
export function travelAssist(world: World, pos: Vec2): void {
  const k = world.keeper;
  k.moveTarget = { x: pos.x, z: pos.z };
  clampToWorld(k.moveTarget);
  k.intent = null;
  markRunWalk(world, k.moveTarget);
}
