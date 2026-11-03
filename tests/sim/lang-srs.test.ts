import { describe, expect, it } from 'vitest';
import * as EDU from '../../src/content/edu';
import { LANG } from '../../src/config/tuning';
import { deserialize, serialize } from '../../src/sim/save';
import {
  dueWords,
  langWordsIn,
  peekSrsDay,
  pickDueWave,
  srsAnswer,
  srsDay,
  wordLearned,
} from '../../src/sim/lang';
import { registerEduContent } from '../../src/sim/story-scenes';
import type { SimEvent, World } from '../../src/sim/types';
import { applyCommand } from '../../src/sim/world';
import { campaignWorld } from './campaign-driver';

registerEduContent(EDU);

function world(): { w: World; events: SimEvent[]; ids: string[] } {
  const r = campaignWorld();
  applyCommand(r.world, { kind: 'eduStart', age: 4, band: 'sprout' }, r.events);
  const ids = ['he-shalom', 'he-toda', 'ja-arigatou'];
  for (const id of ids)
    applyCommand(r.world, { kind: 'langWord', word: id, how: 'heard' }, r.events);
  return { w: r.world, events: r.events, ids };
}

/** R0701: Leitner boxes for the language words, counted in days of play. */
describe('language spaced repetition (R0701)', () => {
  it('a word answered right on play-days 1, 2 and 4 reaches box 3 and counts as learned', () => {
    const { w } = world();
    const id = 'he-toda';
    expect(wordLearned(w, id)).toBe(false);
    srsAnswer(w, id, true, 1);
    expect(w.edu!.words[id]).toMatchObject({ box: 1, due: 2 });
    srsAnswer(w, id, true, 2);
    expect(w.edu!.words[id]).toMatchObject({ box: 2, due: 4 });
    srsAnswer(w, id, true, 4);
    expect(w.edu!.words[id]).toMatchObject({ box: 3, due: 8 });
    expect(wordLearned(w, id)).toBe(true);
    srsAnswer(w, id, true, 8);
    srsAnswer(w, id, true, 16);
    expect(w.edu!.words[id]!.box).toBe(LANG.srs.maxBox);
  });

  it('a wrong answer sends the word back to box 1, due the next play-day, losing nothing else', () => {
    const { w } = world();
    const id = 'he-shalom';
    for (const d of [1, 2, 4]) srsAnswer(w, id, true, d);
    const heard = w.edu!.words[id]!.heard;
    srsAnswer(w, id, false, 8);
    expect(w.edu!.words[id]).toMatchObject({ box: 1, due: 9, heard });
    expect(w.edu!.progress.letters.stars).toBe(0);
  });

  it('dueWords lists met words that are due, soonest first, ties by box then id', () => {
    const { w, ids } = world();
    expect(dueWords(w, 1)).toEqual([...ids].sort());
    srsAnswer(w, 'he-toda', true, 1); // due 2
    srsAnswer(w, 'he-shalom', true, 1);
    srsAnswer(w, 'he-shalom', true, 2); // due 4
    expect(dueWords(w, 1)).toEqual(['ja-arigatou']);
    expect(dueWords(w, 2)).toEqual(['ja-arigatou', 'he-toda']);
    expect(dueWords(w, 4)).toEqual(['ja-arigatou', 'he-toda', 'he-shalom']);
    // A word never heard is not in review, and an unknown id is ignored.
    applyCommand(w as unknown as World, { kind: 'langReview', word: 'no-such', right: true }, []);
    expect(dueWords(w, 99)).not.toContain('he-ori');
  });

  it('only days the child reviews count: a week away does not move the clock', () => {
    const { w, events } = world();
    const day0 = DAY(w, 0);
    applyCommand(w, { kind: 'langReview', word: 'he-toda', right: true }, events);
    expect(srsDay(w)).toBe(1);
    expect(w.edu!.words['he-toda']).toMatchObject({ box: 1, due: 2 });
    // The same day again: still day 1.
    applyCommand(w, { kind: 'langReview', word: 'he-shalom', right: true }, events);
    expect(w.edu!.srsDay).toBe(1);
    // A week passes with no play: the next review is day 2, so the word is simply due.
    w.lastWallMs = day0 + 7 * 86_400_000;
    expect(peekSrsDay(w)).toBe(2);
    expect(dueWords(w, peekSrsDay(w))).toContain('he-toda');
  });

  it('survives a save', () => {
    const { w } = world();
    srsAnswer(w, 'he-toda', true, 1);
    w.edu!.srsDay = 3;
    const back = deserialize(serialize(w, 0)).world;
    expect(back.edu!.words['he-toda']).toMatchObject({ box: 1, due: 2 });
    expect(back.edu!.srsDay).toBe(3);
    expect(langWordsIn).toBeDefined();
  });

  it('a due word makes the nearest free Nubbin wave, and nothing waves when none is due', () => {
    const { w, events } = world();
    const nub = w.nubbins[0];
    if (!nub) throw new Error('the campaign world has no Nubbin');
    nub.stage = 'child';
    nub.pos = { ...w.keeper.pos };
    const pick = pickDueWave(w, peekSrsDay(w));
    expect(pick?.nubbinId).toBe(nub.id);
    expect(dueWords(w, peekSrsDay(w))).toContain(pick!.word);
    const before = events.length;
    applyCommand(w, { kind: 'langDueWave', word: pick!.word }, events);
    const wave = events.slice(before).find((e) => e.kind === 'langReact');
    expect(wave).toMatchObject({ nubbinId: nub.id, word: pick!.word, gesture: 'wave' });
    // A word that is not the due one is ignored; with every word reviewed forward, none is due.
    const none = events.length;
    applyCommand(w, { kind: 'langDueWave', word: 'he-not-a-word' }, events);
    expect(events.length).toBe(none);
    for (const id of ['he-shalom', 'he-toda', 'ja-arigatou']) srsAnswer(w, id, true, 50);
    expect(pickDueWave(w, 50)).toBeNull();
  });
});

function DAY(w: World, n: number): number {
  w.lastWallMs = Date.UTC(2026, 10, 2 + n, 12);
  return w.lastWallMs;
}
