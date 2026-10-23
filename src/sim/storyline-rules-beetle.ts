import { enterDungeon, leaveDungeon } from './dungeon';
import { canFuse } from './fusion';
import { Rng } from './rng';
import { registerStorylineRule } from './storyline-rules';
import { counter } from './storyline-checks';
import { queueScene } from './story-state';
import type { CampaignState, SimEvent, World } from './types';

/**
 * K16 (campaign graphics 4): the Beetle Road's Hollow Below chapters are played on a real
 * floor. One fixed story seed, so every Keeper meets the same floors, and a depth per
 * domain: the guard's stairs (3), the first door (4), the slope above the weather (6), the
 * machine's floor (7, "the fourth floor") and the last door (8). Leaving by the stairs and
 * going down work as on any run.
 */
export const BEETLE_STORY_SEED = 41_017;
export const BEETLE_FLOORS: Readonly<Record<number, number>> = { 3: 1, 4: 2, 6: 3, 7: 4, 8: 5 };

/** Whether the run under way is the Beetle Road's story floor. */
export function isBeetleRun(world: World): boolean {
  const run = world.dungeon;
  return !!run && run.seed === BEETLE_STORY_SEED && run.daily === null;
}

/**
 * Put the Keeper on chapter `n`'s floor, or back in the Grove from a story floor when the
 * chapter is played above. A run of the Keeper's own is never cut short.
 */
export function beetleFloorFor(world: World, n: number, events: SimEvent[]): void {
  const depth = BEETLE_FLOORS[n];
  // The debug jump may have moved the world to the dungeon before any run exists.
  if (world.location === 'dungeon' && !world.dungeon) world.location = 'grove';
  if (world.dungeon && !isBeetleRun(world)) return;
  if (depth === undefined) {
    if (isBeetleRun(world)) leaveDungeon(world, events);
    return;
  }
  if (isBeetleRun(world)) {
    if (world.dungeon!.depth === depth) return;
    leaveDungeon(world, events);
  }
  if (world.location !== 'grove') return;
  enterDungeon(world, false, new Rng(BEETLE_STORY_SEED), events, {
    seed: BEETLE_STORY_SEED,
    depth,
  });
}

/** The ending the lever and the fusion add up to. */
function beetleEnding(c: CampaignState): string {
  if (c.flags['b-machine'] === 'keep') return 'steady-rain';
  return c.flags['b-fusion'] === 'fused' ? 'two-as-one' : 'open-sky';
}

/**
 * SL3 "The Beetle Road" (content/storyline-beetle.ts): the ordinary roster, dojo wins as
 * the two door keepers while their chapters are open, the Fuse button on the partners,
 * and an ending from the lever and the fusion.
 */
registerStorylineRule({
  id: 'beetle',
  onChapter: (world, c, n, events) => {
    if (n === 4 || n === 8) c.flags[`b-wins-at-${n}`] = counter(c, 'karateWon');
    beetleFloorFor(world, n, events);
  },
  onEvent: (_world, c, e) => {
    if (e.kind !== 'karate' || !e.won) return;
    if (c.chapter === 4) c.flags['b-boss-1'] = true;
    if (c.chapter === 8) c.flags['b-boss-2'] = true;
  },
  // Ottoline's stay-or-go (b-vane) is answered inside the ending: its body plays as
  // `b-end-<ending>-<stayed|left>` straight after b-c8-close, ahead of the title card
  // (`end-beetle-<ending>`); Steady Rain also remembers a fused partner.
  onScene: (_world, c, scene) => {
    if (scene !== 'b-c8-close') return;
    const ending = beetleEnding(c);
    const vane = c.flags['b-vane'] === 'stayed' ? 'stayed' : 'left';
    const fused = ending === 'steady-rain' && c.flags['b-fusion'] === 'fused' ? '-fused' : '';
    queueScene(c, `b-end-${ending}-${vane}${fused}`);
  },
  endingFor: (_world, c) => beetleEnding(c),
  actions: (world, c) => {
    const [a, b] = world.partners;
    return [
      {
        id: 'fuse',
        command: { kind: 'fuse' },
        enabled: c.chapter === 5 && a !== null && b !== null && canFuse(world, a, b) === null,
      },
    ];
  },
});
