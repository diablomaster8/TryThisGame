import { describe, expect, it } from 'vitest';
import { REGION_WEATHER } from '../../src/config/region-weather';
import { regionSeason, regionSpell } from '../../src/sim/region-weather';

describe('seasons and weather per region (R0094)', () => {
  it('the same seed gives the same sequence per region, and regions differ', () => {
    const run = (seed: number, region: 'peaks' | 'shore' | 'wood') =>
      Array.from({ length: 40 }, (_, n) => regionSpell(seed, region, n));
    expect(run(11, 'peaks')).toEqual(run(11, 'peaks'));
    expect(run(11, 'wood')).not.toEqual(run(11, 'peaks'));
    expect(run(12, 'peaks')).not.toEqual(run(11, 'peaks'));
  });

  it('the peaks are winter in July and snow more often than not', () => {
    expect(regionSeason('peaks', 'summer')).toBe('winter');
    const kinds = Array.from({ length: 400 }, (_, n) => regionSpell(5, 'peaks', n)!.kind);
    const snow = kinds.filter((k) => k === 'snow').length / kinds.length;
    expect(snow).toBeGreaterThan(0.5);
    expect(snow).toBeLessThan(0.7);
  });

  it('the shore never snows and has its fog in the morning; the Grove keeps the sim weather', () => {
    const morning = Array.from({ length: 300 }, (_, n) => regionSpell(3, 'shore', n, 7)!.kind);
    const noon = Array.from({ length: 300 }, (_, n) => regionSpell(3, 'shore', n, 13)!.kind);
    expect(morning.includes('snow') || noon.includes('snow')).toBe(false);
    expect(morning.filter((k) => k === 'fog').length).toBeGreaterThan(50);
    expect(noon.includes('fog')).toBe(false);
    expect(regionSpell(3, 'grove', 0)).toBeNull();
    expect(regionSeason('grove', 'autumn')).toBe('autumn');
    expect(REGION_WEATHER.wood?.sheltered).toBe(true);
  });
});
