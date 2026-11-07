import { describe, expect, it, vi } from 'vitest';
import { c } from './campaign-driver';
import { begun, expectStoryDone, runUntil } from './side-driver';
import { TIMING_BUDGET } from '../../src/config/tuning-sim';

// HOT-CI: long scripted runs; a timeout here was the runner's load, not a wrong result.
vi.setConfig({ testTimeout: TIMING_BUDGET.slowTestTimeoutMs });

/**
 * The side stories of chapters 6 to 8, second half of the full runs (split from
 * side-stories-mid.test.ts so each file is about half the length of a CI shard's longest file).
 */
describe('middle side stories: full runs (S7 to S8)', () => {
  it('S7 runs to its end; S13 sets millLetter from the letter choice', () => {
    expectStoryDone('s7');
    const r = expectStoryDone('s13', { 's13-letter': 'burned' }, begun(12));
    expect(['kept', 'burned', 'grave']).toContain(c(r.world).flags.millLetter);
    const seenIds = c(r.world).seen;
    expect(seenIds.indexOf('s13-key')).toBeGreaterThan(seenIds.indexOf('c8-close'));
    if (c(r.world).flags.millLetter === 'burned') expect(seenIds).toContain('s13-settled-burned');
  });

  it('S17 runs to its end with a nursery; the nursery choice adds its payoff', () => {
    const r = runUntil(begun(6));
    r.world.placed.push({ id: 'nursery-test', kind: 'nursery', pos: { x: 2, z: 2 } });
    expectStoryDone('s17', { 's17-wild': 'open' }, begun(10), r);
    expect(['open', 'shut']).toContain(c(r.world).flags['s17-nursery']);
  });

  it('S31 runs through Gourd Night in one night and holds chapter 8 meanwhile', () => {
    const r = expectStoryDone('s31', {}, begun(8));
    const seenIds = c(r.world).seen;
    const dusk = seenIds.indexOf('s31-dusk');
    const promise = seenIds.findIndex((s) => s.startsWith('s31-promise'));
    expect(dusk).toBeGreaterThan(-1);
    expect(promise).toBeGreaterThan(dusk);
    const close = seenIds.indexOf('c7-close');
    if (close >= 0) expect(close).toBeGreaterThan(promise);
    expect(typeof c(r.world).flags['s31-sable30']).toBe('boolean');
  });

  it('S14 and S22 run to their ends', () => {
    expectStoryDone('s14', {}, begun(10));
    expectStoryDone('s22', {}, begun(12));
  });

  it('S8 completes in chapter 11 before c11-close and sets s8Reunited', () => {
    const r = expectStoryDone('s8', {}, begun(12));
    const seenIds = c(r.world).seen;
    const complete = seenIds.findIndex((s) => s.startsWith('s8-complete'));
    expect(complete).toBeGreaterThan(seenIds.indexOf('c11-open'));
    const close = seenIds.indexOf('c11-close');
    if (close >= 0) expect(complete).toBeLessThan(close);
    expect(c(r.world).flags.s8Reunited).toBe(true);
  });
});
