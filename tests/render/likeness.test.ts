import { describe, expect, it } from 'vitest';
import { likenessOf } from '../../src/render/sprites/likeness';
import { speciesArt } from '../../src/render/sprites/species-art';
import { SPECIES } from '../../src/sim/species';

describe('likeness sheets (R0436)', () => {
  it('every species with generic art has a sheet with a plan, colours and parts', () => {
    let n = 0;
    for (const s of SPECIES) {
      if (!speciesArt(s.id)) continue;
      n++;
      const l = likenessOf(s.id)!;
      expect(l.silhouette).toHaveLength(3);
      expect(l.keyColours.length).toBeGreaterThanOrEqual(2);
      expect(l.keyColours.length).toBeLessThanOrEqual(4);
      expect(l.mustHave.length).toBeGreaterThan(0);
      expect(l.plan).toBe(speciesArt(s.id)!.plan);
    }
    expect(n).toBeGreaterThan(150);
  });
});
