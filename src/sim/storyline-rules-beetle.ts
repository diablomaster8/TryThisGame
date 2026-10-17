import { canFuse } from './fusion';
import { registerStorylineRule } from './storyline-rules';
import { counter } from './storyline-checks';

/**
 * S3 "The Beetle Road" (content/storyline-beetle.ts): the ordinary roster, dojo wins as
 * the two door keepers while their chapters are open, the Fuse button on the partners,
 * and an ending from the lever and the fusion.
 */
registerStorylineRule({
  id: 'beetle',
  onChapter: (_world, c, n) => {
    if (n === 4 || n === 8) c.flags[`b-wins-at-${n}`] = counter(c, 'karateWon');
  },
  onEvent: (_world, c, e) => {
    if (e.kind !== 'karate' || !e.won) return;
    if (c.chapter === 4) c.flags['b-boss-1'] = true;
    if (c.chapter === 8) c.flags['b-boss-2'] = true;
  },
  endingFor: (_world, c) => {
    if (c.flags['b-machine'] === 'keep') return 'steady-rain';
    return c.flags['b-fusion'] === 'fused' ? 'two-as-one' : 'open-sky';
  },
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
