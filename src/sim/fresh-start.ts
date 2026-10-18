import type { Command, SimEvent, World } from './types';
import { applyCommand, createWorld } from './world';

/**
 * Reset save: a fresh world of the same kind as the one being erased. A Hazel's Grove slot
 * starts Hazel's Grove again with the same Keeper, a separate campaign starts that campaign,
 * and a Learning Grove keeps its age and band, the way the title's "New here" starts each
 * mode. Without this, Reset turned every slot into a Free Grove (review C, item 3).
 */

/** The commands the title's start sends for a world like `old`, in the order boot sends them. */
export function freshStartCommands(old: World): Command[] {
  if (old.edu) return [{ kind: 'eduStart', age: old.edu.age, band: old.edu.band }];
  const c = old.campaign;
  if (!c) return [];
  const keeper: Command = { kind: 'setTrainer', id: old.trainer };
  if (c.storyline) {
    // Dawn & Dusk: a half started after the other reached an ending keeps seeing the whole day.
    const flags = c.flags['dd-other-done'] ? { 'dd-other-done': true } : undefined;
    return [keeper, { kind: 'storylineStart', id: c.storyline, ...(flags ? { flags } : {}) }];
  }
  return [keeper, { kind: 'campaignStart' }];
}

/** Pure apart from the seed: a new world of `old`'s mode, as if started fresh at `now`. */
export function freshWorldLike(old: World, now: number): World {
  const world = createWorld(now % 2147483647, now);
  const events: SimEvent[] = [];
  for (const cmd of freshStartCommands(old)) applyCommand(world, cmd, events);
  return world;
}
