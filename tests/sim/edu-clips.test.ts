import { describe, expect, it } from 'vitest';
import {
  EDU_ANIMALS,
  EDU_CLIPS,
  EDU_PHONEMES,
  EDU_WORDS,
  animalClip,
  clipFile,
  firstSound,
  wordClip,
} from '../../src/config/edu';
import { EDU_RECORDED, resolveClip } from '../../src/platform/edu-audio';
import { EDU_RECIPES, recipeLength } from '../../src/platform/edu-synth';
import { makeRound } from '../../src/minigames/edu/games';
import { Rng } from '../../src/sim/rng';

describe('edu clips (R0675)', () => {
  it('every animal, picture word and first sound has a clip id that resolves', () => {
    for (const a of EDU_ANIMALS) expect(resolveClip(animalClip(a.name))).not.toBeNull();
    for (const w of EDU_WORDS) {
      expect(resolveClip(wordClip(w.word))).not.toBeNull();
      expect(resolveClip(`phoneme/${firstSound(w.word)}`)).not.toBeNull();
    }
    expect(EDU_PHONEMES.length).toBeGreaterThanOrEqual(20);
  });

  it('animals and phonemes have non-empty synth recipes', () => {
    for (const id of Object.keys(EDU_CLIPS).filter((i) => !i.startsWith('word/'))) {
      const r = EDU_RECIPES[id];
      expect(r?.length, id).toBeGreaterThan(0);
      expect(recipeLength(r!)).toBeLessThan(2);
    }
  });

  it('a recording overrides the synth, and a missing file path stays under public/audio/edu', () => {
    const id = animalClip('cow');
    expect(resolveClip(id)?.kind).toBe('synth');
    const rec = resolveClip(id, new Set([id]));
    expect(rec?.kind).toBe('file');
    expect(clipFile(id)).toBe('audio/edu/animals/cow.mp3');
    expect(resolveClip(wordClip('cat'))?.kind).toBe('speech');
    expect(resolveClip('animal/unicorn')).toBeNull();
    for (const id2 of EDU_RECORDED) expect(EDU_CLIPS[id2]).toBeDefined();
  });

  it('every sounds and animals round names a resolvable cueClip', () => {
    for (const band of ['sprout', 'reader'] as const) {
      for (const game of ['sounds', 'animals'] as const) {
        for (const age of [3, 4, 5, 6] as const) {
          const rng = new Rng(1234 + age);
          for (let i = 0; i < 60; i++) {
            const r = makeRound(game, age, rng, undefined, band);
            expect(r.cueClip, `${band} ${game} ${age} ${r.prompt}`).toBeTruthy();
            expect(resolveClip(r.cueClip!), r.cueClip).not.toBeNull();
            if (r.thenClip) expect(resolveClip(r.thenClip)).not.toBeNull();
          }
        }
      }
    }
  });
});
