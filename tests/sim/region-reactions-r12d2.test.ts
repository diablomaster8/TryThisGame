import { describe, expect, it } from 'vitest';
import { BIOME_LEAN, BIOME_REACTIONS } from '../../src/config/region-wild';
import { REGIONS } from '../../src/config/regions';
import { REGION_SPECS } from '../../src/sim/region-walk';
import type { Personality } from '../../src/sim/types';

const PERSONALITIES: Personality[] = ['cheerful', 'shy', 'mischievous', 'lazy'];

describe('partner reactions, the 4 x 4 table (R0121)', () => {
  it('every biome of a drawn region has four distinct personality reactions and a lean', () => {
    const biomes = new Set(
      Object.keys(REGION_SPECS).map((r) => REGIONS[r as keyof typeof REGIONS].biome),
    );
    expect(biomes.size).toBeGreaterThanOrEqual(4);
    const lines = new Set<string>();
    for (const b of biomes) {
      const set = BIOME_REACTIONS[b];
      expect(set, b).toBeDefined();
      expect(BIOME_LEAN[b], b).toBeDefined();
      const here = PERSONALITIES.map((p) => set![p].line);
      expect(new Set(here).size, b).toBe(4);
      for (const l of here) {
        expect(lines.has(l), `${b}: ${l}`).toBe(false);
        lines.add(l);
      }
    }
  });
});
