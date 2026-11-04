import { describe, expect, it } from 'vitest';
import { measure, soundNamesFromSource } from '../../src/dev/audiolab';

describe('audiolab measuring (R0507)', () => {
  it('reads a full-scale 997 Hz sine as about -3 LUFS and 0 dBFS', () => {
    const fs = 48000;
    const x = new Float32Array(fs);
    for (let i = 0; i < x.length; i++) x[i] = Math.sin((2 * Math.PI * 997 * i) / fs);
    const m = measure(x, fs)!;
    expect(m.peakDb).toBeCloseTo(0, 1);
    expect(m.lufs).toBeGreaterThan(-3.6);
    expect(m.lufs).toBeLessThan(-2.4);
  });
  it('reads silence as null and lists the sound names', () => {
    expect(measure(new Float32Array(100), 44100)).toBeNull();
    expect(soundNamesFromSource("export type SoundName = | 'a' | 'bC';")).toEqual(['a', 'bC']);
  });
});
