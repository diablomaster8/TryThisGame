import { describe, expect, it } from 'vitest';
import { chirpNotes } from '../../src/platform/audio';
import { chirpVoice, PLAIN_VOICE } from '../../src/platform/chirp-voice';
import { CHIRP_VOICE } from '../../src/config/tuning-r8d-audio';

/** R0462 (TECH-65): each Nubbin chirps in its own voice, the same after a reload. */
describe('chirp voice', () => {
  it('two Nubbins of one species get different pitches, stable per id', () => {
    const a = chirpVoice('n-1', null);
    const b = chirpVoice('n-2', null);
    expect(a.pitch).not.toBeCloseTo(b.pitch, 3);
    expect(chirpVoice('n-1', null)).toEqual(a);
    expect(chirpNotes('chao', true, a)[0]![0]).not.toBeCloseTo(
      chirpNotes('chao', true, b)[0]![0],
      1,
    );
  });

  it('stays inside the tuning ranges for many ids', () => {
    for (let i = 0; i < 200; i++) {
      const v = chirpVoice(`nub-${i}`, null);
      expect(v.pitch).toBeGreaterThanOrEqual(CHIRP_VOICE.pitch[0]);
      expect(v.pitch).toBeLessThanOrEqual(CHIRP_VOICE.pitch[1]);
      expect(v.speed).toBeGreaterThanOrEqual(CHIRP_VOICE.speed[0]);
      expect(v.speed).toBeLessThanOrEqual(CHIRP_VOICE.speed[1]);
    }
  });

  it('personality shapes the voice', () => {
    const id = 'same-id';
    const plain = chirpVoice(id, null);
    expect(chirpVoice(id, 'cheerful').pitch).toBeGreaterThan(plain.pitch);
    expect(chirpVoice(id, 'cheerful').speed).toBeGreaterThan(plain.speed);
    expect(chirpVoice(id, 'lazy').pitch).toBeLessThan(plain.pitch);
    expect(chirpVoice(id, 'lazy').speed).toBeLessThan(plain.speed);
    const shy = chirpNotes('pocket', true, chirpVoice(id, 'shy'));
    const plainNotes = chirpNotes('pocket', true, plain);
    expect(shy.at(-1)![2]).toBeLessThan(plainNotes.at(-1)![2]);
    expect(shy[0]![4]).toBeLessThan(plainNotes[0]![4]);
    // Mischievous adds a rising trill note.
    const mis = chirpNotes('chao', true, chirpVoice(id, 'mischievous'));
    expect(mis.length).toBe(chirpNotes('chao', true, plain).length + 1);
    expect(mis.at(-1)![5]!).toBeGreaterThan(mis.at(-1)![0]);
  });

  it('the plain voice keeps the family chirp as it was', () => {
    expect(chirpNotes('chao', true, PLAIN_VOICE)[0]!.slice(0, 5)).toEqual([
      880,
      0,
      70,
      'sine',
      0.05,
    ]);
  });
});
