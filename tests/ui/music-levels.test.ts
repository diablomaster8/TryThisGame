import { describe, expect, it } from 'vitest';
import { SONG_NAMES } from '../../src/platform/audio';
import { trimmedSongLevelDb } from '../../src/platform/mix-level';
import { SONG_LEVEL, SONG_TRIM_DB } from '../../src/config/tuning-r8d-audio';

/** R0507 (TECH-64): the songs sit level once trimmed (an estimate from the score, not LUFS). */
describe('music levels', () => {
  it('every song has a trim within the cap', () => {
    for (const s of SONG_NAMES) {
      expect(SONG_TRIM_DB[s], s).toBeTypeOf('number');
      expect(Math.abs(SONG_TRIM_DB[s]!), s).toBeLessThanOrEqual(SONG_LEVEL.maxTrimDb);
    }
  });

  it('every trimmed song sits within tolerance of its target', () => {
    for (const s of SONG_NAMES) {
      const target = SONG_LEVEL.targetDb + (SONG_LEVEL.offsetDb[s] ?? 0);
      expect(Math.abs(trimmedSongLevelDb(s) - target), s).toBeLessThanOrEqual(
        SONG_LEVEL.toleranceDb,
      );
    }
  });

  it('the night and sorrow pieces sit 2 dB under the rest', () => {
    expect(SONG_LEVEL.offsetDb.night).toBe(-2);
    expect(SONG_LEVEL.offsetDb.sorrow).toBe(-2);
  });
});
