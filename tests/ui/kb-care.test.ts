import { describe, expect, it } from 'vitest';
import { cycleNubbin, nearestFirst } from '../../src/ui/a11y-live';
import type { World } from '../../src/sim/types';

/** TECH-72: Tab on the canvas picks Nubbins nearest the Keeper first. */
describe('keyboard care path', () => {
  const at = (id: string, x: number, z: number) => ({ id, pos: { x, z } });
  const w = (selected: string | null) =>
    ({
      keeper: { pos: { x: 0, z: 0 } },
      nubbins: [at('far', 9, 0), at('near', 1, 0), at('mid', 0, -4), at('tie', -1, 0)],
      selected,
    }) as unknown as World;

  it('orders by distance, list order breaking ties', () => {
    expect(nearestFirst(w(null)).map((n) => n.id)).toEqual(['near', 'tie', 'mid', 'far']);
  });

  it('steps nearest-first and lets focus leave at either end', () => {
    expect(cycleNubbin(w(null), false)).toBe('near');
    expect(cycleNubbin(w('near'), false)).toBe('tie');
    expect(cycleNubbin(w('mid'), false)).toBe('far');
    expect(cycleNubbin(w('far'), false)).toBeNull();
    expect(cycleNubbin(w(null), true)).toBe('far');
    expect(cycleNubbin(w('near'), true)).toBeNull();
  });
});
