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

const CASES: Array<[scene: string, flag: string, values: Array<string | true>]> = [
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
