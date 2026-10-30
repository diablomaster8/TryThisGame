import { describe, expect, it } from 'vitest';
import { INPUT } from '../../src/config/tuning';
import { ShakeDetector } from '../../src/input/shake';

/** A synthetic drag: `swings` swings of `amp` px each, sampled every `stepPx`, over `ms`. */
function wave(amp: number, swings: number, ms: number, stepPx = 4): Array<[number, number]> {
  const out: Array<[number, number]> = [];
  let x = 200;
  let dir = 1;
  const steps = Math.ceil(amp / stepPx) * swings;
  for (let i = 0; i < steps; i++) {
    x += dir * stepPx;
    if ((i + 1) % Math.ceil(amp / stepPx) === 0) dir = -dir;
    out.push([x, (i * ms) / steps]);
  }
  return out;
}

describe('TECH-16: the shake gesture', () => {
  // Touch, mouse and pen all reach the detector as clientX samples; touch browsers that
  // leave movementX at 0 no longer matter. Coarse touch samples, fine mouse, pen in between.
  for (const [type, step] of [
    ['touch', 8],
    ['mouse', 2],
    ['pen', 4],
  ] as const) {
    it(`fires at ${INPUT.shakeReversalsPerSecond} reversals a second (${type})`, () => {
      const s = new ShakeDetector();
      s.reset(200);
      const fired = wave(30, INPUT.shakeReversalsPerSecond + 1, 900, step).filter(([x, t]) =>
        s.feed(x, t),
      );
      expect(fired.length).toBe(1);
    });
  }

  it('ignores small wobbles and slow sweeps', () => {
    const wobble = new ShakeDetector();
    wobble.reset(200);
    expect(wave(8, 12, 900, 2).some(([x, t]) => wobble.feed(x, t))).toBe(false);
    const slow = new ShakeDetector();
    slow.reset(200);
    expect(wave(40, 5, 5000, 4).some(([x, t]) => slow.feed(x, t))).toBe(false);
  });
});
