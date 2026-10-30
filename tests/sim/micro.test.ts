import { describe, expect, it } from 'vitest';
import { packs } from '../tools/quest-packs';
import {
  balanceSetup,
  catchSetup,
  checkCovered,
  checkVerbs,
  huntSetup,
  microFor,
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
});
