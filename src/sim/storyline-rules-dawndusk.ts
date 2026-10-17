import { degenerate, degenerationTarget, restore } from './degeneration';
import { registerStorylineRule } from './storyline-rules';
import type { CampaignState, SimEvent, World } from './types';

/**
 * S4 "Dawn & Dusk" (content/storyline-dawndusk.ts): one rule per half. The oldest grown
 * Nubbin reverts to an egg when chapter 3 opens; naming the real cause puts it back if it
 * is still that egg. The ending reads the cause and whether the other half was finished
 * first (`dd-other-done`, passed in by the title screen).
 */
function revert(world: World, c: CampaignState, events: SimEvent[]): void {
  const target = degenerationTarget(world);
  if (target && degenerate(world, target, events)) c.flags['dd-reverted'] = target.id;
}

for (const side of ['dawn', 'dusk'] as const) {
  registerStorylineRule({
    id: side,
    setup: (_world, c) => {
      c.flags.side = side;
    },
    onChapter: (world, c, n, events) => {
      if (n === 3) revert(world, c, events);
    },
    onScene: (world, c, scene, _choice, events) => {
      if (scene !== `${side}-c6-open` || c.flags['dd-right'] !== true) return;
      const id = c.flags['dd-reverted'];
      const n = typeof id === 'string' ? world.nubbins.find((x) => x.id === id) : undefined;
      if (n) restore(n, events);
    },
    endingFor: (_world, c) => {
      if (c.flags['dd-right'] !== true) return 'wrong-cause';
      return c.flags['dd-other-done'] ? 'whole-day' : 'half-day';
    },
  });
}
