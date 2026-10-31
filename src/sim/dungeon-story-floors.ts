/**
 * Authored story floors (R0197, DUNG-54). A storyline that plays chapters in the Hollow
 * registers, per story seed and depth, the pieces its scenes need (the guard's stairs, a
 * door, the machine's room); the version-3 generator puts them in the entry, exit or a hub
 * slot and builds the rest of the floor as usual. Story floors stay flat (no chasm pass)
 * and hold no packs, so a scene never has a fight wander into it.
 *
 * A story run saved on a version-2 floor keeps it (`DungeonRun.genVersion`), so in-progress
 * saves never change under the Keeper. Pure and seeded.
 */
import { generateV3, v3OptionsFor, type V3Options } from './dungeon-gen-v3';
import type { Floor } from './dungeon';

export type StoryPieces = NonNullable<V3Options['authored']>;

const registry = new Map<number, Readonly<Record<number, StoryPieces>>>();
const cache = new Map<string, Floor>();

/** A storyline's authored pieces by depth for its story seed (called from storyline data). */
export function registerStoryFloors(seed: number, byDepth: Readonly<Record<number, StoryPieces>>) {
  registry.set(seed, byDepth);
  for (const k of [...cache.keys()]) if (k.startsWith(`${seed}:`)) cache.delete(k);
}

/** The authored pieces a story floor asks for, if any. */
export function storyPiecesAt(seed: number, depth: number): StoryPieces | undefined {
  return registry.get(seed)?.[depth];
}

/** A new story run's floor at `depth`: generic version 3 with the story's pieces put in. */
export function storyFloor(seed: number, depth: number): Floor {
  const key = `${seed}:${depth}`;
  let f = cache.get(key);
  if (!f) {
    const authored = storyPiecesAt(seed, depth);
    f = generateV3(seed, depth, { ...v3OptionsFor(depth), ...(authored ? { authored } : {}) });
    f.packs = [];
    if (cache.size > 8) cache.delete(cache.keys().next().value!);
    cache.set(key, f);
  }
  return f;
}
