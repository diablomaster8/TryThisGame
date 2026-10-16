import { describe, expect, it } from 'vitest';
import { seen } from '../../src/sim/story-state';
import { c } from './campaign-driver';
import { begun, expectStoryDone, runUntil, status } from './side-driver';

/** The side stories of chapters 6 to 8: windows, then one full run each. */
describe('middle side stories: windows', () => {
  it('S12, S16, S18 and S30 open in chapter 6 after Fossil’s farewell', () => {
    const r = runUntil((w) => seen(c(w), 'c6-open'));
    for (const id of ['s16', 's18', 's30']) expect(status(r, id), id).toBeUndefined();
    runUntil((w) => seen(c(w), 'c7-close'), [], {}, r);
    for (const id of ['s12', 's16', 's18', 's30']) expect(status(r, id), id).toBe('open');
    runUntil(begun(9), [], {}, r);
    expect(status(r, 's16')).toBe('closed');
    expect(status(r, 's30')).toBe('closed');
    expect(status(r, 's12')).toBe('open');
    runUntil(begun(10), [], {}, r);
    expect(status(r, 's12')).toBe('closed');
    expect(status(r, 's18')).toBe('open');
    runUntil(begun(12), [], {}, r);
    expect(status(r, 's18')).toBe('closed');
  });

  it('S7, S13 and S31 open in chapter 7; S31 closes at 8, S13 at 12, S7 never', () => {
    const r = runUntil(begun(7));
    runUntil((w) => seen(c(w), 'c7-stillness'), [], {}, r);
    expect(status(r, 's31')).toBe('open');
    runUntil((w) => seen(c(w), 'c7-close'), [], {}, r);
    for (const id of ['s7', 's13']) expect(status(r, id), id).toBe('open');
    runUntil(begun(8), [], {}, r);
    expect(status(r, 's31')).toBe('closed');
    runUntil(begun(12), [], {}, r);
    expect(status(r, 's13')).toBe('closed');
    expect(c(r.world).flags.millLetter).toBeUndefined();
    expect(status(r, 's7')).toBe('open');
  });

  it('S17 needs a nursery placed before chapter 7’s first morning', () => {
    const r = runUntil(begun(8));
    expect(status(r, 's17')).toBeUndefined();
    const r2 = runUntil(begun(6));
    r2.world.placed.push({ id: 'nursery-test', kind: 'nursery', pos: { x: 2, z: 2 } });
    runUntil(begun(8), [], {}, r2);
    expect(status(r2, 's17')).toBe('open');
    runUntil(begun(10), [], {}, r2);
    expect(status(r2, 's17')).toBe('closed');
  });

  it('S14, S8 and S22 open in chapter 8; S14 closes at 10, S22 at 12, S8 at c12-open', () => {
    const r = runUntil((w) => seen(c(w), 'c8-close'));
    expect(status(r, 's22')).toBe('open');
    runUntil(begun(9), [], {}, r);
    expect(status(r, 's14')).toBe('open');
    expect(status(r, 's8')).toBe('open');
    runUntil(begun(10), [], {}, r);
    expect(status(r, 's14')).toBe('closed');
    runUntil(begun(12), [], {}, r);
    expect(status(r, 's22')).toBe('closed');
    runUntil((w) => seen(c(w), 'c12-open'), [], {}, r);
    expect(status(r, 's8')).toBe('closed');
  });
});

describe('middle side stories: full runs', () => {
  it('S12 and S16 run to their ends before chapter 9', () => {
    expectStoryDone('s12', {}, begun(10));
    expectStoryDone('s16', {}, begun(9));
  });

  it('S18 runs to its end; the centre case waits for chapter 9', () => {
    const r = expectStoryDone('s18', { 's18-heart': 'register' }, begun(12));
    const seenIds = c(r.world).seen;
    expect(seenIds.indexOf('s18-heart')).toBeGreaterThan(seenIds.indexOf('c9-open'));
    expect(seenIds.indexOf('s18-night')).toBeGreaterThan(seenIds.indexOf('c7-open'));
  });

  it('S30 runs to its end and its last day holds chapter 9', () => {
    const r = expectStoryDone('s30', {}, begun(9));
    const seenIds = c(r.world).seen;
    expect(seenIds.indexOf('s30-wall')).toBeGreaterThan(seenIds.indexOf('c7-stillness-3'));
    expect(seenIds.indexOf('s30-gone')).toBeGreaterThan(seenIds.indexOf('c8-open'));
    const complete = seenIds.findIndex((s) => s.startsWith('s30-complete'));
    expect(complete).toBeGreaterThan(-1);
    const c9 = seenIds.indexOf('c9-open');
    if (c9 >= 0) expect(complete).toBeLessThan(c9);
  });

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
