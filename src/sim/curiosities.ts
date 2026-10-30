/**
 * FUN-43 (R0332): the easter-egg layer. Fifteen kid-safe curiosities, each found once and
 * logged with the sim time in `world.curiosities`, counted on the collection book's hidden
 * Curiosities line. The UI spots most of them (a typed word, the camera spun round, a tree
 * shaken thirty times) and sends a `curiosity` command; the sim only checks the id and logs
 * it once, so finding one never changes stats.
 */
import type { SimEvent, World } from './types';

export const CURIOSITY_IDS = [
  'liftAndPush',
  'gerald',
  'mossName',
  'cup',
  'lantern',
  'dizzyCam',
  'moonFace',
  'squirrel',
  'fernBlush',
  'robotDance',
  'stopwatch',
  'scarf',
  'fruitRoll',
  'backToBack',
  'eggUpside',
] as const;
export type CuriosityId = (typeof CURIOSITY_IDS)[number];

const KNOWN: ReadonlySet<string> = new Set(CURIOSITY_IDS);

/** Log a curiosity the first time it is found; anything unknown or found before is ignored. */
export function findCuriosity(world: World, id: string, events: SimEvent[]): void {
  if (!KNOWN.has(id) || world.curiosities?.[id] !== undefined) return;
  (world.curiosities ??= {})[id] = world.timeMs;
  events.push({ kind: 'curiosityFound', id });
}

/** How many curiosities have been found. */
export const curiositiesFound = (world: World): number =>
  Object.keys(world.curiosities ?? {}).filter((k) => KNOWN.has(k)).length;
