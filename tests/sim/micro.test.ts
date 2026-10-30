import { describe, expect, it } from 'vitest';
import { packs } from '../tools/quest-packs';
import {
  balanceSetup,
  catchSetup,
  checkCovered,
  checkVerbs,
  climbSetup,
  escortSetup,
  exploreSetup,
  huntSetup,
  MICRO_BUILT,
  microFor,
  microSkipped,
  puzzleSetup,
  surviveSetup,
} from '../../src/sim/micro';

// R0294 (FUN-05): every check verb maps to a micro-game or a real command.

describe('micro-interaction kit', () => {
  it('covers every check verb in the content', () => {
    const missing = new Set<string>();
    for (const qs of Object.values(packs))
      for (const q of qs)
        for (const s of q.steps)
          if (!checkCovered(s.check)) for (const v of checkVerbs(s.check)) missing.add(v);
    expect([...missing]).toEqual([]);
  });

  it('maps the main verbs to their games', () => {
    expect(microFor('carry:pie:bench')).toBe('balance');
    expect(microFor('deliver:letter')).toBe('balance');
    expect(microFor('find:the-key')).toBe('hunt');
    expect(microFor('inspect:pa1-cabinet:lantern-shed')).toBe('hunt');
    expect(microFor('collect:shells:5')).toBe('catch');
    expect(microFor('karate:round')).toBe('survive');
    expect(microFor('talk:fern')).toBeNull();
    // R0292: the content's minigame checks play a micro-game by their second token.
    expect(microFor('minigame:sneak:s17-luna-garden')).toBe('escort');
    expect(microFor('minigame:mercy:pa4-toriel')).toBe('survive');
    expect(microFor('minigame:count:hand-melon:3')).toBe('hunt');
    expect(microFor('minigame:wiggle:pumpkin:3-beat')).toBe('climb');
  });

  it('seeds each game the same way twice, never with an impossible setup', () => {
    for (const seed of [1, 2, 3, 400]) {
      const h = huntSetup(seed);
      expect(h.hot).toHaveLength(3);
      expect(new Set(h.hot).size).toBe(3);
      expect(huntSetup(seed)).toEqual(h);
      expect(catchSetup(seed).lanes.every((l) => l >= 0 && l <= 2)).toBe(true);
      const b = balanceSetup(seed);
      expect(b.stack).toBeGreaterThanOrEqual(3);
      expect(b.stack).toBeLessThanOrEqual(5);
    }
  });

  it('builds all eight games with sane, repeatable setups (round 6)', () => {
    expect(MICRO_BUILT.size).toBe(8);
    for (const seed of [1, 2, 3, 400, 9999]) {
      const e = escortSetup(seed);
      expect(e.stops).toHaveLength(3);
      expect([...e.stops].sort()).toEqual(e.stops);
      expect(e.stops.every((x) => x > 0 && x < 1)).toBe(true);
      const c = climbSetup(seed);
      expect(c.steps).toBeGreaterThanOrEqual(6);
      const p = puzzleSetup(seed);
      expect([...p.order].sort()).toEqual([...Array(p.pieces).keys()]);
      expect(p.order.some((v, i) => v !== i)).toBe(true);
      expect(
        surviveSetup(seed)
          .swings.flat()
          .every((s) => s >= 0 && s <= 2),
      ).toBe(true);
      const x = exploreSetup(seed);
      expect(
        Math.abs(x.goal[0] - x.start[0]) + Math.abs(x.goal[1] - x.start[1]),
      ).toBeGreaterThanOrEqual(4);
      expect(exploreSetup(seed)).toEqual(x);
    }
  });

  it('skips the micro-games by default for Little Sprouts only', () => {
    expect(microSkipped({ settings: {}, edu: null })).toBe(false);
    expect(microSkipped({ settings: {}, edu: { band: 'sprout' } })).toBe(true);
    expect(microSkipped({ settings: {}, edu: { band: 'reader' } })).toBe(false);
    expect(microSkipped({ settings: { microSkip: false }, edu: { band: 'sprout' } })).toBe(false);
    expect(microSkipped({ settings: { microSkip: true }, edu: null })).toBe(true);
  });
});
