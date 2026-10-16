import { describe, expect, it } from 'vitest';
import { seen } from '../../src/sim/story-state';
import { spawnNpc } from '../../src/sim/npcs';
import { applyCommand } from '../../src/sim/world';
import { c } from './campaign-driver';
import { begun, expectStoryDone, runUntil, status } from './side-driver';

/**
 * The side stories of chapters 3 to 5. For each: it is not open before its window, it
 * opens inside it, an ignored story closes unfinished when the window ends, and a played
 * story runs to its end with its flags and keepsakes.
 */
describe('early side stories: windows', () => {
  it('S21 opens the morning after c3-open and closes unfinished at chapter 6', () => {
    const r = runUntil((w) => seen(c(w), 'c3-open'));
    expect(status(r, 's21')).toBeUndefined();
    runUntil((w) => status(r, 's21') !== undefined || c(w).chapter >= 4, [], {}, r);
    expect(status(r, 's21')).toBe('open');
    runUntil(begun(6), [], {}, r);
    expect(status(r, 's21')).toBe('closed');
    expect(c(r.world).flags.s21Done).toBeUndefined();
  });

  it('S25 opens after c3-open and closes unfinished when chapter 9 opens', () => {
    const r = runUntil((w) => c(w).chapter >= 3 && c(w).step >= 1);
    runUntil((w) => status(r, 's25') !== undefined || c(w).chapter >= 4, [], {}, r);
    expect(status(r, 's25')).toBe('open');
    runUntil(begun(9), [], {}, r);
    expect(status(r, 's25')).toBe('closed');
  });

  it('S2 opens the first morning of chapter 3 and closes without wisp at chapter 8', () => {
    const r = runUntil((w) => seen(c(w), 'c3-open'));
    expect(status(r, 's2')).toBeUndefined();
    runUntil((w) => status(r, 's2') !== undefined || c(w).chapter >= 4, [], {}, r);
    expect(status(r, 's2')).toBe('open');
    runUntil(begun(8), [], {}, r);
    expect(status(r, 's2')).toBe('closed');
    expect(c(r.world).flags.wisp).toBeUndefined();
  });

  it('S1 and S3 open at Lantern Night; S1 closes at chapter 10, S3 at chapter 12', () => {
    const r = runUntil((w) => seen(c(w), 'c4-open'));
    expect(status(r, 's1')).toBeUndefined();
    expect(status(r, 's3')).toBeUndefined();
    runUntil((w) => seen(c(w), 'c4-close'), [], {}, r);
    runUntil(() => status(r, 's1') === 'open' && status(r, 's3') === 'open', [], {}, r);
    runUntil(begun(10), [], {}, r);
    expect(status(r, 's1')).toBe('closed');
    expect(status(r, 's3')).toBe('open');
    runUntil(begun(12), [], {}, r);
    expect(status(r, 's3')).toBe('closed');
  });

  it('S29 opens the morning after Lantern Night and closes when chapter 8 opens', () => {
    const r = runUntil((w) => seen(c(w), 'c4-close'));
    expect(status(r, 's29')).toBeUndefined();
    runUntil((w) => status(r, 's29') !== undefined || c(w).chapter >= 6, [], {}, r);
    expect(status(r, 's29')).toBe('open');
    runUntil(begun(8), [], {}, r);
    expect(status(r, 's29')).toBe('closed');
  });

  it('S4 waits for Fossil’s farewell; S11 and S15 take chapter 5 mornings; all close at 8', () => {
    const r = runUntil((w) => seen(c(w), 'c5-open'));
    expect(status(r, 's4')).toBeUndefined();
    runUntil(() => status(r, 's11') === 'open' && status(r, 's15') === 'open', [], {}, r);
    const s11 = c(r.world).side.s11!;
    const s15 = c(r.world).side.s15!;
    const s5 = c(r.world).side.s5!;
    const day = (ms: number) => Math.floor(ms / 120_000);
    expect(day(s11.openedMs)).not.toBe(day(s5.openedMs));
    expect(day(s15.openedMs)).not.toBe(day(s5.openedMs));
    expect(day(s15.openedMs)).not.toBe(day(s11.openedMs));
    runUntil((w) => seen(c(w), 'c6-open'), [], {}, r);
    runUntil((w) => status(r, 's4') !== undefined || c(w).chapter >= 7, [], {}, r);
    expect(status(r, 's4')).toBe('open');
    runUntil(begun(8), [], {}, r);
    for (const id of ['s4', 's11', 's15']) expect(status(r, id), id).toBe('closed');
  });
});

describe('early side stories: full runs', () => {
  it('S21 runs to its end', () => {
    expectStoryDone('s21', {}, begun(6));
  });

  it('S25 runs to its end; the kept toy plays the kept variants', () => {
    const r = expectStoryDone('s25', { 's25-bundle': 'kept' }, begun(9));
    const seenIds = c(r.world).seen;
    expect(seenIds).toContain('s25-shed-kept');
    expect(seenIds).toContain('s25-line');
    expect(seenIds).toContain('s25-falls-kept');
    expect(seenIds).not.toContain('s25-shed');
  });

  it('S2 runs to its end and sets wisp from the night choice', () => {
    const r = expectStoryDone('s2', { 's2-night': 'driven' }, begun(8));
    expect(['spared', 'driven', 'sable']).toContain(c(r.world).flags.wisp);
    const complete = c(r.world).seen.filter((s) => s.startsWith('s2-complete'));
    expect(complete).toHaveLength(1);
  });

  it('S1 runs to its end after chapter 9 closes', () => {
    const r = expectStoryDone('s1', {}, begun(11));
    expect(c(r.world).seen.indexOf('s1-cinder')).toBeGreaterThan(
      c(r.world).seen.indexOf('c9-close'),
    );
  });

  it('S3 asks one Keeper of each side and holds its Moot in chapter 11', () => {
    // Nobody presses "Do it": the first step is met by talking to a Sun and a Moon Keeper.
    const r = runUntil((w) => c(w).side.s3?.stage === 'check');
    expect(c(r.world).side.s3?.step).toBe(0);
    for (const trainer of ['fern', 'dusty']) {
      const npc = r.world.npcs.find((n) => n.trainer === trainer) ?? spawnNpc(r.world, trainer);
      r.world.keeper.pos = { ...npc.pos };
      applyCommand(r.world, { kind: 'talk', npcId: npc.id }, r.events);
    }
    expect(c(r.world).flags['s3-asked-sun']).toBe(true);
    expect(c(r.world).flags['s3-asked-moon']).toBe(true);
    runUntil((w) => c(w).side.s3!.step >= 1, [], {}, r);
    expectStoryDone('s3', {}, begun(13), r);
    const seenIds = c(r.world).seen;
    expect(seenIds.indexOf('s3-stands')).toBeGreaterThan(seenIds.indexOf('c5-open'));
    expect(seenIds.indexOf('s3-moot')).toBeGreaterThan(seenIds.indexOf('c11-open'));
  });

  it('S29 runs to its end with the gift’s variants', () => {
    const r = expectStoryDone('s29', { 's29-lessons-done': 'bell' }, begun(8));
    const seenIds = c(r.world).seen;
    if (c(r.world).flags['s29-gift'] === 'bell') {
      expect(seenIds).toContain('s29-night-bell');
      expect(seenIds).toContain('s29-ford-bell');
    }
    expect(seenIds.indexOf('s29-dusk')).toBeGreaterThan(seenIds.indexOf('c5-open'));
    expect(seenIds.indexOf('s29-low-river')).toBeGreaterThan(seenIds.indexOf('c6-close'));
  });

  it('S4, S11 and S15 run to their ends before chapter 8', () => {
    for (const id of ['s4', 's11', 's15']) expectStoryDone(id, {}, begun(8));
  });
});
