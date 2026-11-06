import { describe, expect, it } from 'vitest';
import { EDU_SPELL_TIERS, EDU_SPELL_WORDS, patternErrors } from '../../src/config/edu-reader';
import { EDU_CLIPS, EDU_READER_WORDS, wordClip } from '../../src/config/edu';
import { makeRound } from '../../src/minigames/edu/games';
import { readerMathsRound } from '../../src/minigames/edu/reader-games';
import { Rng } from '../../src/sim/rng';

describe('R0716 reader band content', () => {
  it('spelling has at least 150 words in 4 tiers, every one with plausible errors', () => {
    expect(EDU_SPELL_TIERS).toHaveLength(4);
    expect(EDU_SPELL_WORDS.length + EDU_READER_WORDS.length).toBeGreaterThanOrEqual(150);
    for (const w of EDU_SPELL_WORDS) {
      expect(patternErrors(w).length, w).toBeGreaterThanOrEqual(3);
      expect(EDU_CLIPS[wordClip(w)], w).toBeDefined();
    }
  });

  it('no round repeats within 10 rounds in any reader game', () => {
    for (const game of ['counting', 'letters', 'sounds'] as const) {
      for (let seed = 1; seed <= 20; seed++) {
        const rng = Rng.fromSeed(seed);
        const used = new Set<string>();
        const prompts: string[] = [];
        for (let i = 0; i < 10; i++) {
          const r = makeRound(game, 6, rng, undefined, 'reader', used);
          const o = r.options[r.answer]!;
          prompts.push(`${r.prompt}|${JSON.stringify(o)}`);
        }
        expect(new Set(prompts).size).toBe(10);
      }
    }
  });

  it('maths rounds have exactly one right option and distinct options', () => {
    const rng = Rng.fromSeed(5);
    for (let i = 0; i < 400; i++) {
      const r = readerMathsRound(rng);
      const keys = r.options.map((o) => JSON.stringify(o));
      expect(new Set(keys).size).toBe(keys.length);
      expect(r.answer).toBeGreaterThanOrEqual(0);
      expect(r.answer).toBeLessThan(r.options.length);
    }
  });
});
