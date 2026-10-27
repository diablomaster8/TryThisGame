/**
 * The Mr. Bean (Q21–Q30) fun-quest payoffs: each flag value adds exactly one line to a later
 * scene, in the main game and in both Learning Grove bands, and reads differently per value.
 */
import { describe, expect, it } from 'vitest';
import * as EDU from '../../src/content/edu';
import { registerEduContent, registerSideStories, sceneFor } from '../../src/sim/story-scenes';
import { SIDE_STORY_CONTENT } from '../../src/sim/side-story-content';
import { c, campaignWorld } from './campaign-driver';

registerSideStories(SIDE_STORY_CONTENT);
registerEduContent(EDU);

const CASES: Array<
  [scene: string, flag: string, values: Array<string | boolean>, quiet?: boolean[]]
> = [
  ['q26-share', 'q24-shared', [true]],
  ['q27-hall', 'q21-sniffer', [true]],
  ['q28-cleared', 'q21-scarf-swap', [true]],
  ['q28-fuse', 'q25-way', ['coax', 'show']],
  ['q28-complete', 'q26-jam-lettuce', [true]],
  ['q28-complete', 'q27-confessed', [true, false]],
  ['q29-handover', 'q28-asked-to-light', [true]],
  ['q29-roll', 'q23-pulled', [true]],
  ['q29-afternoon', 'q22-nubbin-help', [true]],
  ['q30-meet', 'q22-doubted', [true]],
  ['q30-grid', 'q28-objected', [true]],
  ['q30-race', 'q29-tweed-help', [true]],
  ['q30-complete', 'q30-warned', [true]],
];

describe('Mr. Bean choices pay off later', () => {
  for (const [scene, flag, values] of CASES) {
    it(`${flag} in ${scene}`, () => {
      for (const band of ['main', 'sprout', 'reader'] as const) {
        const { world } = campaignWorld();
        const plain = sceneFor(world, scene, band)!;
        expect(plain, `${scene} ${band}`).toBeDefined();
        const added = new Set<string>();
        for (const v of values) {
          c(world).flags[flag] = v;
          const played = sceneFor(world, scene, band)!;
          const lines = played.lines;
          played.lessons.forEach((l, i) =>
            expect(lines[l.after]?.text, `${scene} ${band} lesson ${i}`).toBe(
              plain.lines[plain.lessons[i]!.after]?.text,
            ),
          );
          expect(lines.length, `${scene} ${band} ${flag}=${v}`).toBe(plain.lines.length + 1);
          const extras = lines.filter((l) => !plain.lines.some((p) => p.text === l.text));
          expect(extras.length, `${scene} ${band} ${flag}=${v}`).toBe(1);
          for (const extra of extras) {
            expect(extra.text.length).toBeLessThanOrEqual(160);
            if (band === 'sprout') expect(extra.text.split(/\s+/).length).toBeLessThanOrEqual(14);
            if (band === 'reader') expect(extra.text.split(/\s+/).length).toBeLessThanOrEqual(30);
          }
          added.add(extras.map((l) => l.text).join(' | '));
        }
        expect(added.size).toBe(values.length);
        delete c(world).flags[flag];
      }
    });
  }

  it('leaves the scenes as written when the flags are unset or declined', () => {
    for (const band of ['main', 'sprout', 'reader'] as const) {
      const { world } = campaignWorld();
      for (const [scene, flag] of [
        ['q28-complete', 'q26-jam-lettuce'],
        ['q30-complete', 'q30-warned'],
      ] as const) {
        const plain = sceneFor(world, scene, band)!.lines;
        c(world).flags[flag] = false;
        expect(sceneFor(world, scene, band)!.lines).toEqual(plain);
      }
    }
  });
});
