import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { playSfxVoices } from '../../src/platform/audio-sfx';

/**
 * R0485 (TECH-43): `playSfxVoices` is pure: it turns a sound name into calls on two injected
 * voices, a tone and a noise burst. Every named sound must say something sensible through them.
 */

interface Tone {
  freq: number;
  start: number;
  dur: number;
  type?: string;
  gain?: number;
  slide?: number;
}
interface Burst {
  start: number;
  dur: number;
  gain: number;
  cutoff: number;
}

function voices(name: string): { tones: Tone[]; bursts: Burst[] } {
  const tones: Tone[] = [];
  const bursts: Burst[] = [];
  playSfxVoices(
    name as never,
    (freq, start, dur, type, gain, slide) =>
      tones.push({
        freq,
        start,
        dur,
        ...(type ? { type } : {}),
        ...(gain !== undefined ? { gain } : {}),
        ...(slide ? { slide } : {}),
      }),
    (start, dur, gain, cutoff) => bursts.push({ start, dur, gain, cutoff }),
  );
  return { tones, bursts };
}

const NAMES = (() => {
  const src = readFileSync('src/platform/audio.ts', 'utf8');
  const body = src.slice(src.indexOf('export type SoundName ='), src.indexOf('export const COMIC'));
  return [...body.matchAll(/\|\s*'([A-Za-z0-9]+)'/g)].map((m) => m[1]!);
})();

describe('playSfxVoices (TECH-43)', () => {
  it('says something for every sound the engine can ask for, with sane numbers', () => {
    const silent: string[] = [];
    for (const name of NAMES) {
      const { tones, bursts } = voices(name);
      if (tones.length + bursts.length === 0) silent.push(name);
      for (const t of tones) {
        expect(t.freq, name).toBeGreaterThan(0);
        expect(t.dur, name).toBeGreaterThan(0);
        expect(t.start, name).toBeGreaterThanOrEqual(0);
        if (t.gain !== undefined) expect(t.gain, name).toBeLessThanOrEqual(0.2);
        if (t.slide !== undefined) expect(t.slide, name).toBeGreaterThan(0);
      }
      for (const b of bursts) {
        expect(b.dur, name).toBeGreaterThan(0);
        expect(b.cutoff, name).toBeGreaterThan(0);
        expect(b.gain, name).toBeLessThanOrEqual(0.2);
      }
    }
    // A few sounds are voiced elsewhere (the engine plays them itself): none should be most.
    expect(silent.length).toBeLessThan(NAMES.length / 4);
  });

  it('keeps the slides sliding the way their names say, and the sneeze a whistle then a burst', () => {
    const down = voices('slideDown').tones[0]!;
    expect(down.slide!).toBeLessThan(down.freq);
    const up = voices('slideUp').tones[0]!;
    expect(up.slide!).toBeGreaterThan(up.freq);
    const sneeze = voices('sneeze');
    expect(sneeze.tones).toHaveLength(1);
    expect(sneeze.bursts).toHaveLength(1);
    expect(sneeze.bursts[0]!.start).toBeGreaterThanOrEqual(sneeze.tones[0]!.start);
  });

  it('is silent for a name it does not know', () => {
    const { tones, bursts } = voices('no-such-sound');
    expect(tones).toHaveLength(0);
    expect(bursts).toHaveLength(0);
  });
});
