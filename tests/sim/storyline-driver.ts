/** Drives a separate campaign (sim/storyline.ts) the way a player would, for its tests. */
import { STORYLINE_CONTENT } from '../../src/sim/storyline-content';
import { registerStorylines } from '../../src/sim/story-scenes';
import type { SimEvent, World } from '../../src/sim/types';
import { applyCommand, createWorld } from '../../src/sim/world';
import { c, playScenes, tick } from './campaign-driver';

registerStorylines(STORYLINE_CONTENT);

/** A world with storyline `id` started as `trainer`. */
export function storylineWorld(
  id: string,
  trainer = 'fern',
  seed = 31,
): { world: World; events: SimEvent[] } {
  const world = createWorld(seed, 0);
  const events: SimEvent[] = [];
  applyCommand(world, { kind: 'setTrainer', id: trainer }, events);
  applyCommand(world, { kind: 'storylineStart', id }, events);
  return { world, events };
}

/** Tick and answer scenes until `done` holds or the guard runs out; returns whether it did. */
export function settle(
  world: World,
  events: SimEvent[],
  done: () => boolean,
  passes = 30,
  choices: Record<string, string> = {},
): boolean {
  for (let i = 0; i < passes && !done(); i++) {
    tick(world, events, 1.1);
    playScenes(world, events, choices);
  }
  return done();
}

/** Play until the storyline is on chapter `n` with its opening seen. */
export function toChapter(
  world: World,
  events: SimEvent[],
  n: number,
  choices: Record<string, string> = {},
): boolean {
  return settle(world, events, () => c(world).chapter === n && c(world).step === 1, 40, choices);
}

export { c, playScenes, tick };
