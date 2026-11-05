import { describe, expect, it } from 'vitest';
import { regionSkyAt } from '../../src/sim/region-weather-live';

const MIN = 60_000;

describe('the live sky of a region (R0094)', () => {
  it('the same seed and time give the same sky; a later time can differ', () => {
    const at = (t: number) => regionSkyAt(9, 'wood', t, 12, 'summer');
    expect(at(40 * MIN)).toEqual(at(40 * MIN));
    const kinds = new Set(Array.from({ length: 60 }, (_, i) => at(i * 9 * MIN)!.kind));
    expect(kinds.size).toBeGreaterThan(1);
  });

  it('is cheap and stable for a week away, and rewinding restarts the walk', () => {
    const a = regionSkyAt(3, 'wood', 7 * 24 * 60 * MIN, 12, 'summer');
    const b = regionSkyAt(3, 'wood', 5 * MIN, 12, 'summer');
    const c = regionSkyAt(3, 'wood', 7 * 24 * 60 * MIN, 12, 'summer');
    expect(b).not.toBeNull();
    expect(c).toEqual(a);
  });

  it('the Grove has none; the peaks show snow in July; the Wood is drier under its canopy', () => {
    expect(regionSkyAt(1, 'grove', 0, 12, 'summer')).toBeNull();
    const peaks = Array.from({ length: 80 }, (_, i) =>
      regionSkyAt(1, 'peaks', i * 11 * MIN, 12, 'summer')!,
    );
    expect(peaks.every((p) => p.season === 'winter')).toBe(true);
    expect(peaks.some((p) => p.draw === 'snow')).toBe(true);
    const wood = Array.from({ length: 200 }, (_, i) =>
      regionSkyAt(2, 'wood', i * 8 * MIN, 12, 'summer')!,
    );
    const rain = wood.filter((w) => w.kind === 'rain');
    expect(rain.length).toBeGreaterThan(0);
    expect(Math.max(...rain.map((r) => r.intensity))).toBeLessThanOrEqual(0.5);
    expect(wood.some((w) => w.fog > 0)).toBe(true);
  });
});
