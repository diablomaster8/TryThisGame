import { describe, expect, it } from 'vitest';
import { REGIONS } from '../../src/config/regions';
import { BIOME_BEDS } from '../../src/config/tuning-r9d4';
import { biomeBedNow, setBiomeBed } from '../../src/platform/biome-beds';

describe('biome sound beds (R0139)', () => {
  it('every region has a bed for its biome, cross-faded over 1.5 s', () => {
    for (const r of Object.values(REGIONS)) expect(BIOME_BEDS.beds[r.biome], r.id).toBeDefined();
    expect(BIOME_BEDS.crossfadeSec).toBe(1.5);
  });

  it('two beds overlapping at full never come near clipping', () => {
    const peak = (b: (typeof BIOME_BEDS.beds)['meadow']): number =>
      b.noise.gain + b.lfo.depth + (b.tone ? b.tone.gain + b.tone.pulseDepth : 0);
    const loudest = Math.max(...Object.values(BIOME_BEDS.beds).map(peak));
    expect(loudest * 2).toBeLessThan(0.25);
  });

  it('builds and plays nothing before the first tap unlocks sound', () => {
    setBiomeBed('meadow');
    expect(biomeBedNow()).toBeNull();
  });
});
