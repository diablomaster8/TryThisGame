import { afterEach, describe, expect, it } from 'vitest';
import {
  minigameFrameMs,
  minigameNowMs,
  resetMinigameTime,
  useStillTime,
} from '../../src/minigames/frame-time';

describe('minigame frame time (R0455)', () => {
  afterEach(() => useStillTime(false));

  it('passes the browser time through when not still', () => {
    expect(minigameFrameMs(1234)).toBe(1234);
    expect(minigameFrameMs(5000)).toBe(5000);
  });

  it('steps exactly 1/60 s a frame under ?still, whatever the raw time says', () => {
    useStillTime();
    const a = [minigameFrameMs(10), minigameFrameMs(9000), minigameFrameMs(9001)];
    expect(a[0]).toBeCloseTo(1000 / 60);
    expect(a[2]).toBeCloseTo(3000 / 60);
    expect(minigameNowMs()).toBe(a[2]);
  });

  it('restarts when a screen opens, so a run frames the same every time', () => {
    useStillTime();
    const first = [minigameFrameMs(1), minigameFrameMs(2)];
    resetMinigameTime();
    const second = [minigameFrameMs(777), minigameFrameMs(99999)];
    expect(second).toEqual(first);
  });
});
