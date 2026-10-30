import { describe, expect, it } from 'vitest';
import { countPhrase, makeRound, roundKey, type EduRound } from '../../src/minigames/edu/games';
import { EDU_AGES, EDU_GAMES, EDU_WORDS, firstSound } from '../../src/config/edu';
import { Rng } from '../../src/sim/rng';

/** R0684 (KIDS-16): the sprout rounds' answers and distractors. */
const byWord = new Map(EDU_WORDS.map((w) => [w.word, w]));
const label = (r: EduRound, i: number) => {
  const o = r.options[i];
  return o && o.kind === 'picture' ? o.label : '';
};

describe('sprout round answers (R0684)', () => {
  it('no rhyme or first-sound distractor sounds like the answer, over 5,000 rounds', () => {
    const rng = Rng.fromSeed(11);
    let checked = 0;
    for (let i = 0; i < 5000; i++) {
      const age = EDU_AGES[i % EDU_AGES.length]!;
      const r = makeRound('sounds', age, rng);
      const right = byWord.get(label(r, r.answer));
      if (!right) continue;
      const rhyme = r.prompt.startsWith('Which one rhymes');
      const first = r.prompt.startsWith('Which one starts like');
      if (!rhyme && !first) continue;
      checked++;
      r.options.forEach((_, k) => {
        if (k === r.answer) return;
        const w = byWord.get(label(r, k))!;
        if (rhyme) expect(w.rhyme, `${r.prompt} ${w.word}`).not.toBe(right.rhyme);
        else expect(firstSound(w.word), `${r.prompt} ${w.word}`).not.toBe(firstSound(right.word));
      });
    }
    expect(checked).toBeGreaterThan(1000);
  });

  it('cat, cake, car and kite share a first sound; snail, pail and whale rhyme', () => {
    expect(new Set(['cat', 'cake', 'car', 'kite'].map(firstSound)).size).toBe(1);
    const ail = EDU_WORDS.filter((w) => ['snail', 'pail', 'whale'].includes(w.word));
    expect(new Set(ail.map((w) => w.rhyme)).size).toBe(1);
  });

  it('the sum cue shows two groups, never the total', () => {
    const rng = Rng.fromSeed(5);
    for (let i = 0; i < 400; i++) {
      const r = makeRound('counting', 6, rng);
      if (!r.prompt.includes('altogether')) continue;
      expect(r.cue?.kind).toBe('sum');
    }
  });

  it('a five-round session never repeats a target', () => {
    for (const game of EDU_GAMES)
      for (const age of EDU_AGES) {
        // A tiny pool (three shapes at age 3) can only offer what it has.
        const all = new Set<string>();
        const probe = Rng.fromSeed(1);
        for (let k = 0; k < 400; k++) all.add(roundKey(makeRound(game, age, probe)));
        for (let s = 0; s < 20; s++) {
          const rng = Rng.fromSeed(100 + s);
          const used = new Set<string>();
          for (let k = 0; k < 5; k++) makeRound(game, age, rng, undefined, 'sprout', used);
          expect(used.size, `${game} age ${age}`).toBe(Math.min(5, all.size));
        }
      }
    // Readers too (spelling repeated words before).
    for (const game of ['letters', 'counting', 'sounds'] as const) {
      const rng = Rng.fromSeed(9);
      const used = new Set<string>();
      for (let k = 0; k < 5; k++) makeRound(game, 6, rng, undefined, 'reader', used);
      expect(used.size, game).toBe(5);
    }
    expect(roundKey(makeRound('colours', 4, Rng.fromSeed(1)))).toContain('|');
  });

  it('says "There is 1"', () => {
    expect(countPhrase(1)).toBe('There is 1');
    expect(countPhrase(3)).toBe('There are 3');
  });
});
