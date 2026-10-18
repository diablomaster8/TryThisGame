import { describe, expect, it } from 'vitest';
import { evictionOrder } from '../../src/render3d/creature-pool';

// The 3D creature pool frees old looks by recency instead of growing for ever (review
// 2026-10-18 B, Bug 14).
describe('creature pool eviction', () => {
  const used = new Map([
    ['child', 5],
    ['first-sun-swim', 2],
    ['look-fox', 9],
    ['visit-a', 1],
  ]);

  it('frees nothing under the cap', () => {
    expect(
      evictionOrder(
        [
          ['child', 2],
          ['look-fox', 1],
        ],
        used,
        3,
      ),
    ).toEqual([]);
  });

  it('frees the least recently used keys first, a key at a time', () => {
    const items = [
      ['child', 2],
      ['first-sun-swim', 3],
      ['look-fox', 1],
      ['visit-a', 2],
    ] as const;
    // 8 items, cap 4: visit-a (2) then first-sun-swim (3) go; child and look-fox stay.
    expect(evictionOrder(items, used, 4)).toEqual(['visit-a', 'first-sun-swim']);
  });

  it('a key never used counts as oldest', () => {
    expect(
      evictionOrder(
        [
          ['new', 1],
          ['child', 1],
        ],
        used,
        1,
      ),
    ).toEqual(['new']);
  });
});
