/**
 * The Avatar pack's (Q46–Q65) fun-quest choice payoffs from the fun-flags pass (2026-10-27):
 * each flag value adds one line to a later scene of the same pack, in the main game and in
 * both Learning Grove bands. A payoff whose anchor line is missing would fail silently in
 * play, so every anchor is checked here, per band. The older q46/q47/q48-truth/q55 cases
 * stay in choice-payoffs.test.ts.
 */
import { describe, expect, it } from 'vitest';
import * as EDU from '../../src/content/edu';
import { registerEduContent, registerSideStories, sceneFor } from '../../src/sim/story-scenes';
import { SIDE_STORY_CONTENT } from '../../src/sim/side-story-content';
import { c, campaignWorld } from './campaign-driver';

registerSideStories(SIDE_STORY_CONTENT);
registerEduContent(EDU);

const CASES: Array<[scene: string, flag: string, values: Array<string | boolean>]> = [
  ['q48-complete', 'q48-first', ['hollins', 'drays', 'together']],
  ['q49-party', 'q64-help', ['vouch', 'nudge', 'wave']],
  ['q55-act1', 'q47-sang', [true]],
  ['q55-act1', 'q53-laughed', [true]],
  ['q55-act1-done', 'q56-snacks', [true]],
  ['q56-bout', 'q53-nubbin-spar', [true]],
  ['q57-complete', 'q57-plan', ['clean', 'pipe', 'note']],
  ['q57-complete', 'q57-gave-fruit', [true]],
  ['q58-reading', 'q51-sip', [true]],
  ['q58-clouds', 'q52-whistle', [true]],
  ['q58-complete', 'q58-belief', ['believe', 'doubt', 'wait']],
  ['q58-complete', 'q58-cloud', ['warning', 'arrow']],
  ['q59-complete', 'q59-whistle', [true]],
  ['q61-trial', 'q48-story', ['detail', 'nod', 'cough']],
  ['q61-complete', 'q61-evidence', ['stone', 'map', 'kind']],
  ['q61-complete', 'q61-sweet', [true]],
  ['q61-complete', 'q57-legend', ['told', 'kept']],
  ['q62-sled', 'q60-home', ['carried', 'chose']],
  ['q62-complete', 'q62-huddle', [true]],
  ['q63-pet', 'q60-bait', [true]],
  ['q63-pet', 'q52-nubbin-leads', [true]],
  ['q63-pet-done', 'q46-bought-dented', [true]],
  ['q63-complete', 'q63-laughed', [true]],
  ['q64-ask-done', 'q61-tuk-lawyer', [true]],
  ['q64-ask-done', 'q59-told-off', [true]],
  ['q65-tiles', 'q50-first', ['jasmine', 'ginger']],
  ['q65-tiles-done', 'q64-advice', ['honest', 'kind', 'smile']],
  ['q65-game', 'q50-pell', ['jasmine', 'black', 'barley']],
  ['q65-complete', 'q50-pay', ['free', 'later', 'trade']],
  ['q65-complete', 'q65-credit', ['nubbin']],
];

describe('Avatar pack choices pay off later', () => {
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
