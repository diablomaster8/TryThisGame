import { describe, expect, it } from 'vitest';
import { RARE_CRITTER_DROP } from '../../src/config/tuning-look';
import { ALL_CRITTERS, RARE_CRITTERS, WILD_CRITTERS } from '../../src/sim/critters';
import { critterFind } from '../../src/sim/dungeon';
import { Rng } from '../../src/sim/rng';

describe('rare critters (R0402)', () => {
  it('flags the phoenix and the dragon rare and leaves them out of the wild', () => {
    expect(RARE_CRITTERS.map((c) => c.id)).toEqual(['phoenix', 'dragon']);
    for (const c of RARE_CRITTERS) {
      expect(c.rare).toBe(true);
      expect(WILD_CRITTERS.some((w) => w.id === c.id)).toBe(false);
      expect(ALL_CRITTERS.some((a) => a.id === c.id)).toBe(true);
    }
  });

  it('never drops a rare one on the first floor, and drops them at the set rate below it', () => {
    const rng = new Rng(7);
    for (let i = 0; i < 300; i++) expect(critterFind(rng, 1, 'deer')).toBe('deer');
    let rare = 0;
    const seen = new Set<string>();
    const n = 4000;
    for (let i = 0; i < n; i++) {
      const id = critterFind(rng, 3, 'deer');
      if (id !== 'deer') {
        rare++;
        seen.add(id);
      }
    }
    expect(rare / n).toBeGreaterThan(RARE_CRITTER_DROP.chance * 0.7);
    expect(rare / n).toBeLessThan(RARE_CRITTER_DROP.chance * 1.3);
    expect([...seen].sort()).toEqual(['dragon', 'phoenix']);
  });
});
