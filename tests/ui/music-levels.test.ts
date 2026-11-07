import { describe, expect, it } from 'vitest';
import { SONG_NAMES } from '../../src/platform/audio';
import {
  SONG_LEVEL,
  SONG_LUFS,
  SONG_MEASURED_LUFS,
  SONG_TRIM_DB,
} from '../../src/config/tuning-more/audio-mix';

/** R0507 (TECH-64): the songs sit level once trimmed (the levels are the `?audiolab` offline measurements in LUFS). */
describe('music levels', () => {
  it('every song has a trim within the cap', () => {
    for (const s of SONG_NAMES) {
      expect(SONG_TRIM_DB[s], s).toBeTypeOf('number');
      expect(Math.abs(SONG_TRIM_DB[s]!), s).toBeLessThanOrEqual(SONG_LEVEL.maxTrimDb);
    }
  });

  it('each song measured level sits within tolerance of its LUFS target', () => {
    for (const s of SONG_NAMES) {
      const target = SONG_LUFS.targetLufs + (SONG_LEVEL.offsetDb[s] ?? 0);
      expect(Math.abs(SONG_MEASURED_LUFS[s]! - target), s).toBeLessThanOrEqual(
        SONG_LUFS.toleranceLu,
      );
    }
  });

  it('the night and sorrow pieces sit 2 dB under the rest', () => {
    expect(SONG_LEVEL.offsetDb.night).toBe(-2);
    expect(SONG_LEVEL.offsetDb.sorrow).toBe(-2);
  });
});
