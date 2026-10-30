/** HOT-2: the frame-time log charges a long interval to the frame that caused it. */
import { describe, expect, it } from 'vitest';
import { FrameSpikes } from '../../src/platform/frame-spikes';

/** Run frames of `tick` ms inside the callback, each followed by `gap` ms of browser time. */
function run(
  log: FrameSpikes,
  frames: Array<{ tick: number; gap: number; slow?: 'draw' | 'sim' }>,
) {
  let t = 1000;
  for (const f of frames) {
    log.begin(t);
    log.lap('input', t + 0.2);
    log.lap(f.slow ?? 'update', t + f.tick);
    log.end(t + f.tick);
    t += f.tick + f.gap;
  }
  log.begin(t);
}

describe('FrameSpikes', () => {
  it('charges a slow callback to its own frame, with its sections', () => {
    const log = new FrameSpikes();
    const even = { tick: 4, gap: 12.7 };
    run(log, [even, even, { tick: 90, gap: 12.7, slow: 'sim' }, even, even]);
    expect(log.spikes).toHaveLength(1);
    const s = log.spikes[0]!;
    expect(s.deltaMs).toBeCloseTo(102.7);
    expect(s.tickMs).toBeCloseTo(90);
    expect(s.sections.sim).toBeCloseTo(89.8);
  });

  it('charges a long gap after the callback to browser time', () => {
    const log = new FrameSpikes();
    const even = { tick: 4, gap: 12.7 };
    run(log, [even, { tick: 4, gap: 250 }, even]);
    const s = log.spikes[0]!;
    expect(s.tickMs).toBeCloseTo(4);
    expect(s.outsideMs).toBeCloseTo(250);
  });

  it('summarises percentiles and long frames, and a rest is not a spike', () => {
    const log = new FrameSpikes();
    run(
      log,
      Array.from({ length: 99 }, () => ({ tick: 4, gap: 12.7 })),
    );

    log.rest();
    log.begin(9000); // a hidden tab later: no 7-second frame
    const s = log.summary();
    expect(s.frames).toBe(99);
    expect(s.p95).toBeCloseTo(16.7);
    expect(s.worst).toBeLessThan(17);
    expect(s.long).toBe(0);
  });
});
