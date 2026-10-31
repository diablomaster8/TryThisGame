import { degenerate, degenerationTarget, restore } from './degeneration';
import { createEgg } from './nubbin';
import { isSharedLine, lineCast, registerStorylineRule } from './storyline-rules';
import type { CampaignState, SimEvent, World } from './types';
import { newId, uniqueName, withRng } from './world';

/**
 * SL4 "Dawn & Dusk" (content/storyline-dawndusk.ts): one rule per half. The oldest grown
 * Nubbin that was not already an adult when the line began reverts to an egg when chapter 3 opens; naming the real cause puts it back if it
 * is still that egg. The ending reads the cause and whether the other half was finished
 * first (`dd-other-done`, passed in by the title screen).
 */
function revert(world: World, c: CampaignState, events: SimEvent[]): void {
  const before = typeof c.flags['dd-before'] === 'string' ? c.flags['dd-before'] : '';
  const spared = new Set(before ? before.split(',') : []);
  // R0594: beside Hazel's Grove only the line's own Nubbin can revert, never the Keeper's.
  const cast = lineCast(c);
  if (cast.length > 0) for (const n of world.nubbins) if (!cast.includes(n.id)) spared.add(n.id);
  const target = degenerationTarget(world, spared);
  if (target && degenerate(world, target, events)) c.flags['dd-reverted'] = target.id;
}

for (const side of ['dawn', 'dusk'] as const) {
  registerStorylineRule({
    id: side,
    setup: (world, c) => {
      c.flags.side = side;
      // Nubbins already grown up when the line starts are the player's own: never the one reverted.
      c.flags['dd-before'] = world.nubbins
        .filter((n) => n.stage === 'adult')
        .map((n) => n.id)
        .join(',');
      if (!isSharedLine(world, c)) return;
      // R0594: beside Hazel's Grove the line brings the Nubbin it will turn back, and reads
      // the other half's ending from this world rather than from the title screen.
      withRng(world, (rng) => {
        const egg = createEgg(newId(world, 'nub'), { x: 1, z: 2 }, rng, 'plain');
        egg.name = uniqueName(world, egg.name, rng);
        world.nubbins.push(egg);
        c.flags.cast = egg.id;
      });
      if (world.lines[side === 'dawn' ? 'dusk' : 'dawn']?.ending) c.flags['dd-other-done'] = true;
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
    // Lane C r10 agent A (R0601, R0605): beside Hazel's Grove, its half's recolour is the Sun
    // or Moon region's own, drawn only while the Keeper is there.
    present: () => ({ grove: side === 'dawn' ? 'sun' : 'moon' }),
    endingFor: (_world, c) => {
      if (c.flags['dd-right'] !== true) return 'wrong-cause';
      return c.flags['dd-other-done'] ? 'whole-day' : 'half-day';
    },
  });
}
