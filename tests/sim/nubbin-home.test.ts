import { describe, expect, it } from 'vitest';
import { homeRegion, nubbinHere, nubbinsHere } from '../../src/sim/nubbin-home';
import { createWorld } from '../../src/sim/world';
import type { Nubbin } from '../../src/sim/types';

/** Lane C r10 agent D (R0594, CAMP-02): a line's Nubbin that stayed is shown only in its place. */
describe('Nubbin.home filters (R0594)', () => {
  it('maps every line home to its region, and the Grove to none', () => {
    expect(homeRegion(undefined)).toBeNull();
    expect(homeRegion('grove')).toBeNull();
    expect(homeRegion('fold')).toBe('fold');
    expect(homeRegion('server')).toBe('server');
    // The Beetle Road's cast stays on the road, which is the Hollow's region.
    expect(homeRegion('road')).toBe('hollow');
  });

  it('shows a Grove Nubbin everywhere and a Fold one only in the Fold', () => {
    const w = createWorld(3, 0);
    const [a] = w.nubbins;
    const b: Nubbin = { ...structuredClone(a!), id: 'nub-fold', home: 'fold' };
    w.nubbins.push(b);
    expect(nubbinsHere(w).map((n) => n.id)).not.toContain('nub-fold');
    expect(nubbinsHere(w)).toHaveLength(w.nubbins.length - 1);
    w.storyRegion = 'fold';
    expect(nubbinHere(w, b)).toBe(true);
    expect(nubbinHere(w, a!)).toBe(true);
    w.storyRegion = 'server';
    expect(nubbinHere(w, b)).toBe(false);
    delete w.storyRegion;
    delete b.home;
    expect(nubbinsHere(w)).toHaveLength(w.nubbins.length);
  });
});
