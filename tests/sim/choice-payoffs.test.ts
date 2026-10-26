/**
 * The ten S1–S5 choice flags the review found unread (2026-10-18): each value now adds one
 * line to a scene three or more stories later, in the main game and in both Learning
 * Grove bands. A payoff whose anchor line is missing would fail silently in play, so every
 * anchor is checked here.
 */
import { describe, expect, it } from 'vitest';
import * as EDU from '../../src/content/edu';
import { registerEduContent, registerSideStories, sceneFor } from '../../src/sim/story-scenes';
import { SIDE_STORY_CONTENT } from '../../src/sim/side-story-content';
import { c, campaignWorld } from './campaign-driver';

registerSideStories(SIDE_STORY_CONTENT);
registerEduContent(EDU);

const CASES: Array<[scene: string, flag: string, values: Array<string | boolean>]> = [
  ['s2-night', 's2-early', ['fed', 'shooed', 'waited']],
  ['s2-night', 's2-carried', [true, false]],
  ['s19-climb', 's1-pace', ['walk', 'offered', 'asked']],
  ['s26-bench', 's1-sat', [true]],
  ['s26-bench', 's1-asked-why', [true]],
  ['s30-party', 's3-seat', ['gap', 'sun', 'moon']],
  ['s28-for-byte', 's3-byte', ['science', 'nicely']],
  ['s23-stove', 's3-shown', ['together', 'apart']],
  ['s19-marina', 's4-swim', ['with', 'trust']],
  ['s10-letter', 's4-gate', ['lift-push', 'nubbin', 'note']],
  ['s10-letter-told', 's4-gate', ['lift-push', 'nubbin', 'note']],
  ['s18-fossils', 's5-carry', ['egg', 'shoulder']],
  ['s18-shore', 's5-holder', ['yours', 'marina']],
  ['c10-dawn', 'c4-lamps', ['remember', 'home', 'together', 'dunno']],
  ['c9-open', 'c5-race', ['want', 'win', 'home']],
  ['c9-open-sold', 'c5-race', ['want', 'win', 'home']],
  ['lj3-s2-done', 'lj3-race', ['fair', 'head', 'sparks']],
  ['lj4-s1-done', 'lj4-bento', ['beans', 'cucumber', 'lettuce']],
];

describe('S1–S5 choices pay off later', () => {
  for (const [scene, flag, values] of CASES) {
    it(`${flag} in ${scene}`, () => {
      for (const band of ['main', 'sprout', 'reader'] as const) {
        const { world } = campaignWorld();
        const plain = sceneFor(world, scene, band)!;
        expect(plain, `${scene} ${band}`).toBeDefined();
        const added = new Set<string>();
        for (const v of values) {
          c(world).flags[flag] = v;
          const lines = sceneFor(world, scene, band)!.lines;
          expect(lines.length, `${scene} ${band} ${flag}=${v}`).toBe(plain.lines.length + 1);
          const extra = lines.find((l) => !plain.lines.some((p) => p.text === l.text))!;
          expect(extra.text.length).toBeLessThanOrEqual(160);
          if (band === 'sprout') expect(extra.text.split(/\s+/).length).toBeLessThanOrEqual(14);
          if (band === 'reader') expect(extra.text.split(/\s+/).length).toBeLessThanOrEqual(30);
          added.add(extra.text);
        }
        // Each value reads differently.
        expect(added.size).toBe(values.length);
        delete c(world).flags[flag];
      }
    });
  }

  it('leaves the gate alone when Open took it away', () => {
    const { world } = campaignWorld();
    c(world).flags.letThemGo = true;
    const open = sceneFor(world, 's10-letter')!.lines.length;
    c(world).flags['s4-gate'] = 'note';
    expect(sceneFor(world, 's10-letter')!.lines.length).toBe(open);
  });
});

describe('c10-wisp names the stone’s bearer (review SR-20261022-54)', () => {
  it('in main and reader, and leaves sprout alone', () => {
    for (const band of ['main', 'sprout', 'reader'] as const) {
      const { world } = campaignWorld();
      const plain = sceneFor(world, 'c10-wisp', band)!.lines.map((l) => l.text);
      for (const [bearer, name] of [
        ['sable', 'Sable'],
        ['moss', 'Moss'],
      ] as const) {
        c(world).flags.stoneBearer = bearer;
        const lines = sceneFor(world, 'c10-wisp', band)!.lines.map((l) => l.text);
        const named = lines.filter((t) => t.startsWith(`In the shallows, ${name} stands`));
        if (band === 'sprout') expect(lines).toEqual(plain);
        else expect(named, `${band} ${bearer}`).toHaveLength(1);
      }
    }
  });
});
