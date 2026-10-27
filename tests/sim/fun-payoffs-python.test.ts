/**
 * The Python pack's (Q1–Q20) choice payoffs: each value of an unread fun-quest flag adds one
 * line to a later scene of the same pack, in the main game and in both Learning Grove bands.
 * A payoff whose anchor line is missing would fail silently in play, so every anchor is
 * checked here, on every variant scene that carries one.
 */
import { describe, expect, it } from 'vitest';
import * as EDU from '../../src/content/edu';
import { registerEduContent, registerSideStories, sceneFor } from '../../src/sim/story-scenes';
import { SIDE_STORY_CONTENT } from '../../src/sim/side-story-content';
import { c, campaignWorld } from './campaign-driver';

registerSideStories(SIDE_STORY_CONTENT);
registerEduContent(EDU);

const CASES: Array<[scene: string, flag: string, values: Array<string | boolean>]> = [
  ['q01-complete', 'q01-chanted', [true]],
  ['q01-complete', 'q01-imaginary-path', [true]],
  ['q02-complete', 'q02-asked-round', [true]],
  ['q02-complete', 'q02-gentle', [true]],
  ['q18-intro', 'q02-verdict', ['even', 'lost']],
  ['q03-complete', 'q03-guessed', [true]],
  ['q04-complete', 'q04-shrugged', [true]],
  ['q04-complete-kept', 'q04-shrugged', [true]],
  ['q04-complete-shared', 'q04-shrugged', [true]],
  ['q20-trees', 'q04-thanked-gullwick', [true]],
  ['q05-complete', 'q05-tried', [true]],
  ['q17-learned', 'q05-practised', [true]],
  ['q16-complete', 'q07-said-small', [true]],
  ['q08-complete', 'q08-read-minutes', [true]],
  ['q09-complete', 'q09-walked-faster', [true]],
  ['q09-complete-themselves', 'q09-walked-faster', [true]],
  ['q09-complete-pebble', 'q09-walked-faster', [true]],
  ['q12-evidence', 'q10-stubborn', [true]],
  ['q10-complete', 'q10-walked-off', [true]],
  ['q12-complete', 'q10-tipped', [true]],
  ['q11-complete', 'q11-nudged', [true]],
  ['q11-complete', 'q11-stepped-back', [true]],
  ['q14-complete', 'q12-waited', [true]],
  ['q15-intro', 'q12-brother', [true]],
  ['q13-complete', 'q13-practised', [true]],
  ['q19-race', 'q13-copied-nubbin', [true]],
  ['q14-complete', 'q14-held-cushion', [true]],
  ['q14-complete', 'q14-volunteered', [true]],
  ['q19-ready', 'q14-keeper-napped', [true]],
  ['q18-pineapple', 'q15-peeked', [true]],
  ['q18-intro', 'q15-stocked', [true, false]],
  ['q16-complete', 'q16-agreed', [true]],
  ['q16-complete', 'q16-complained', [true]],
  ['q17-complete', 'q17-asked-fish', [true]],
  ['q17-complete', 'q17-kept-time', [true]],
  ['q18-complete', 'q18-knew-peel', [true]],
  ['q19-complete', 'q18-sunglasses-off', [true]],
  ['q19-complete', 'q19-turned-bunty', [true]],
  ['q19-complete', 'q19-straight-face', [true]],
  ['q19-complete', 'q19-bunty-prize', [true]],
  ['q20-complete', 'q20-asked-three', [true]],
];

describe('Python pack choices pay off later', () => {
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
          // Every lesson still follows the line it was written for.
          played.lessons.forEach((l, i) =>
            expect(lines[l.after]?.text, `${scene} ${band} lesson ${i}`).toBe(
              plain.lines[plain.lessons[i]!.after]?.text,
            ),
          );
          expect(lines.length, `${scene} ${band} ${flag}=${String(v)}`).toBe(
            plain.lines.length + 1,
          );
          const extras = lines.filter((l) => !plain.lines.some((p) => p.text === l.text));
          expect(extras.length, `${scene} ${band} ${flag}=${String(v)}`).toBe(1);
          const extra = extras[0]!;
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
});
