import { describe, expect, it } from 'vitest';
import { BEACON_LANDMARKS } from '../../src/config/region-extras-r11d6';
import { neighbourBeacons } from '../../src/sim/beacons';
import { regionLocation } from '../../src/sim/region-walk';

describe('beacon landmarks (R0117)', () => {
  it('every drawn region has its beacon placed, and the Grove sees its built neighbours', () => {
    for (const r of ['grove', 'wood', 'shore', 'ridge', 'ruins', 'sunlands', 'moonlands'] as const)
      expect(BEACON_LANDMARKS[r].at, r).toBeDefined();
    const around = neighbourBeacons({ location: 'grove' });
    expect(around.map((b) => b.region)).toEqual(expect.arrayContaining(['wood', 'shore', 'ridge']));
    const wood = around.find((b) => b.region === 'wood')!;
    // The Wood's way lies to the north (-z): a bearing near pi.
    expect(Math.abs(Math.abs(wood.bearing) - Math.PI)).toBeLessThan(1);
    expect(
      neighbourBeacons({ location: regionLocation('wood') }).some((b) => b.region === 'grove'),
    ).toBe(true);
  });
});
