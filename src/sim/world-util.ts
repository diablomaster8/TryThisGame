/**
 * Small world helpers with no heavy imports (ids, lookups, the world RNG, hatch speed), so
 * the step module and world.ts can both use them without an import cycle. world.ts re-exports
 * all of them.
 */
import { Rng } from './rng';
import { hasSkill } from './skills';
import type { Nubbin, Vec2, World } from './types';

/** Eggs hatch faster with the Warm hands skill, live and during catch-up alike. */
export function hatchSpeed(world: World): number {
  return hasSkill(world, 'warmHands') ? 1.1 : 1;
}

export function newId(world: World, prefix: string): string {
  const id = `${prefix}-${world.nextId}`;
  world.nextId += 1;
  return id;
}

export function findNubbin(world: World, id: string): Nubbin | undefined {
  return world.nubbins.find((n) => n.id === id);
}

/** Take the world's RNG, use it, and store the state back. */
export function withRng<T>(world: World, fn: (rng: Rng) => T): T {
  const rng = new Rng(world.rngState);
  const out = fn(rng);
  world.rngState = rng.state;
  return out;
}

export function heldNubbin(world: World): Nubbin | undefined {
  return world.nubbins.find((n) => n.behavior.state === 'held');
}

export function positionOf(world: World, id: string): Vec2 | null {
  return findNubbin(world, id)?.pos ?? world.items.find((i) => i.id === id)?.pos ?? null;
}
