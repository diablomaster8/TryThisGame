import { describe, expect, it } from 'vitest';
import { motifOf } from '../../src/platform/audio';

/** R0589 (lane A r11): each Nubbin's four-note motif is its own and stays the same. */
describe('Nubbin motifs (R0589)', () => {
  it('is four notes, stable per seed', () => {
    expect(motifOf(12345)).toHaveLength(4);
    expect(motifOf(12345)).toEqual(motifOf(12345));
  });
  it('differs between Nubbins', () => {
    const seen = new Set([1, 2, 3, 4, 5, 6, 7, 8].map((s) => motifOf(s * 7919).join(',')));
    expect(seen.size).toBeGreaterThanOrEqual(6);
  });
});
