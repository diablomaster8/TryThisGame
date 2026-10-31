import { describe, expect, it } from 'vitest';
import { EGG } from '../../src/config/tuning';
import { crackStage } from '../../src/render/egg-crack-stage';

/** R0503 (TECH-62): five crack stages follow hatch progress; shaking moves them on. */
describe('egg crack stages', () => {
  const at = (hatchRemainingMs: number) => crackStage({ hatchRemainingMs });

  it('runs 0 to 5 with progress and is 5 in the last 5 s', () => {
    expect(at(EGG.hatchMs)).toBe(0);
    expect(at(EGG.hatchMs * 0.8)).toBe(1);
    expect(at(EGG.hatchMs * 0.5)).toBe(3);
    expect(at(EGG.hatchMs * 0.1)).toBe(5);
    expect(at(4000)).toBe(5);
    expect(at(EGG.hatchMs * 3)).toBe(0);
  });

  it('never goes back as the wait shrinks, and shakes step it on', () => {
    let last = 0;
    let shakesThatStepped = 0;
    for (let r = EGG.hatchMs; r >= 0; r -= EGG.shakeBonusMs) {
      const s = at(r);
      expect(s).toBeGreaterThanOrEqual(last);
      if (s > last) shakesThatStepped++;
      last = s;
    }
    expect(last).toBe(5);
    expect(shakesThatStepped).toBe(5);
  });
});
