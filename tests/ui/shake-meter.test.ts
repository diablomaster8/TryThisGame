import { describe, expect, it } from 'vitest';
import { SHAKE_METER_TEXT } from '../../src/config/strings-r8d';
import { INPUT } from '../../src/config/tuning';
import { ShakeDetector } from '../../src/input/shake';
import { meterDots, shakingEgg } from '../../src/ui/shake-meter';
import type { World } from '../../src/sim/types';

/** TECH-16: the shake meter's dots follow the detector, and it shows only for a held egg. */
describe('shake meter', () => {
  it('fills one dot per counted swing, out of the swings a shake needs', () => {
    const of = INPUT.shakeReversalsPerSecond;
    expect(SHAKE_METER_TEXT.meter(0, of)).toBe(`Shake! ${'○'.repeat(of)}`);
    expect(SHAKE_METER_TEXT.meter(2, of)).toBe(`Shake! ●●${'○'.repeat(of - 2)}`);
    expect(SHAKE_METER_TEXT.meter(99, of)).toBe(`Shake! ${'●'.repeat(of)}`);
    expect(meterDots(1, true)).toBe(of);
    expect(meterDots(of + 3, false)).toBe(of);
  });

  it('reads the detector: swings so far, back to empty after a shake lands', () => {
    const d = new ShakeDetector();
    d.reset(200);
    let x = 200;
    let t = 0;
    let fired = false;
    const seen: number[] = [];
    for (let swing = 0; swing < INPUT.shakeReversalsPerSecond + 1 && !fired; swing++) {
      const dir = swing % 2 === 0 ? 1 : -1;
      for (let i = 0; i < 6; i++) {
        x += dir * 5;
        t += 10;
        if (d.feed(x, t)) fired = true;
      }
      seen.push(d.progress(t));
    }
    expect(fired).toBe(true);
    expect(Math.max(...seen)).toBeGreaterThan(0);
    expect(d.progress(t)).toBe(0);
  });

  it('shows only for an egg held by a drag that is not ready yet', () => {
    const egg = (state: string, stage: string, ms: number) =>
      ({ id: 'a', behavior: { state }, stage, hatchRemainingMs: ms }) as never;
    const w = (n: never) => ({ nubbins: [n] }) as unknown as World;
    expect(shakingEgg(w(egg('held', 'egg', 1000)))).not.toBeNull();
    expect(shakingEgg(w(egg('carried', 'egg', 1000)))).toBeNull();
    expect(shakingEgg(w(egg('held', 'egg', 0)))).toBeNull();
    expect(shakingEgg(w(egg('held', 'child', 1000)))).toBeNull();
  });
});
