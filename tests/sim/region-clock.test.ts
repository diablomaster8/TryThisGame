import { describe, expect, it } from 'vitest';
import { REGIONS, regionHour } from '../../src/config/regions';
import { daylightAt } from '../../src/render/daylight';

describe('day and night per region (R0092)', () => {
  it('the Moon lands are night and the Sun lands noon, whatever the real hour', () => {
    for (const real of [0, 9, 12, 16, 21]) {
      expect(daylightAt(regionHour(REGIONS.moonlands.clock, real)).phase).toBe('night');
      expect(daylightAt(regionHour(REGIONS.sunlands.clock, real)).phase).toBe('day');
    }
  });

  it('the Grove, lane, village, shore and wood keep the real hour; the peaks run two ahead', () => {
    for (const id of ['grove', 'lane', 'village', 'shore', 'wood'] as const)
      expect(regionHour(REGIONS[id].clock, 15.5)).toBe(15.5);
    expect(regionHour(REGIONS.peaks.clock, 23)).toBe(1);
    expect(REGIONS.caves.clock).toBe('fixed');
  });
});
