import { describe, expect, it } from 'vitest';
import { cycleNubbin, selectionSummary } from '../../src/ui/a11y-live';
import type { Nubbin, World } from '../../src/sim/types';

/** TECH-28: the spoken selection line, and Tab stepping through the Nubbins on the canvas. */
describe('selection for screen readers', () => {
  const nub = (o: Omit<Partial<Nubbin>, 'needs'> & { needs?: Partial<Nubbin['needs']> } = {}) =>
    ({
      id: 'a',
      name: 'Pebble',
      stage: 'child',
      hatchRemainingMs: 0,
      ...o,
      needs: { hunger: 1, energy: 1, happiness: 50, affection: 10, ...o.needs },
    }) as Nubbin;

  it('says name, stage, mood and pressing needs', () => {
    expect(selectionSummary(nub())).toBe('Pebble, child, happy');
    expect(selectionSummary(nub({ needs: { happiness: 10, hunger: 0.3 } }))).toBe(
      'Pebble, child, content, a little hungry',
    );
    expect(selectionSummary(nub({ needs: { happiness: -80, hunger: 0.05, energy: 0.1 } }))).toBe(
      'Pebble, child, sad, very hungry, sleepy',
    );
    expect(selectionSummary(nub({ stage: 'egg', hatchRemainingMs: 5000 }))).toBe('Pebble, egg');
    expect(selectionSummary(nub({ stage: 'egg', hatchRemainingMs: 0 }))).toBe(
      'Pebble, egg, ready to hatch',
    );
  });

  it('Tab steps forward, Shift+Tab back, and lets focus leave at either end', () => {
    const w = (selected: string | null) =>
      ({ nubbins: [{ id: 'a' }, { id: 'b' }, { id: 'c' }], selected }) as unknown as World;
    expect(cycleNubbin(w(null), false)).toBe('a');
    expect(cycleNubbin(w(null), true)).toBe('c');
    expect(cycleNubbin(w('a'), false)).toBe('b');
    expect(cycleNubbin(w('b'), true)).toBe('a');
    expect(cycleNubbin(w('c'), false)).toBeNull();
    expect(cycleNubbin(w('a'), true)).toBeNull();
    expect(cycleNubbin({ nubbins: [], selected: null } as unknown as World, false)).toBeNull();
  });
});
