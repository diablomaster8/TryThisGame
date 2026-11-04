/** Round 12 lane C (R0635, R0620): the per-quest minutes override, and the sprout recap speech. */
import { describe, expect, it } from 'vitest';
import { QUEST_OFFERS } from '../../src/config/tuning';
import { fitLength, fitProgress, questMinutes } from '../../src/sim/quest-minutes';
import { questLength } from '../../src/sim/camp11';
import { sideStory } from '../../src/sim/story-scenes';
import { RUNNER_STORIES } from '../../src/sim/side-stories';
import { recapSpeech } from '../../src/ui/recap';
import type { Game } from '../../src/game';

describe('quest minutes override', () => {
  it('falls back to the default per step without an override', () => {
    const id = RUNNER_STORIES.find((q) => sideStory(q)?.minutes === undefined)!;
    const len = questLength(id)!;
    expect(fitLength(id, len)).toEqual(len);
    expect(len.minutes).toBe(Math.max(1, len.of * QUEST_OFFERS.minutesPerStep));
  });

  it("scales a quest's own figure to the steps left", () => {
    const id = RUNNER_STORIES[0]!;
    const q = sideStory(id)!;
    const was = q.minutes;
    q.minutes = 20;
    try {
      expect(questMinutes(id, 4, 4, 99)).toBe(20);
      expect(questMinutes(id, 1, 4, 99)).toBe(5);
      expect(fitProgress(id, { step: 3, of: 4, minutesLeft: 99 })!.minutesLeft).toBe(10);
      expect(fitLength(id, { of: 4, minutes: 12 })!.minutes).toBe(20);
    } finally {
      if (was === undefined) delete q.minutes;
      else q.minutes = was;
    }
  });
});

describe('recap read-aloud', () => {
  const blocks = { spine: ['a'], lines: ['b'], quests: ['c'] };
  const game = (edu: unknown): Game => ({ world: { edu } }) as unknown as Game;
  it('reads only in sprout with read-aloud on', () => {
    expect(recapSpeech(game({ band: 'sprout', readAloud: true }), blocks)).toEqual(['a', 'b', 'c']);
    expect(recapSpeech(game({ band: 'sprout', readAloud: false }), blocks)).toEqual([]);
    expect(recapSpeech(game({ band: 'reader', readAloud: true }), blocks)).toEqual([]);
    expect(recapSpeech(game(undefined), blocks)).toEqual([]);
  });
});
