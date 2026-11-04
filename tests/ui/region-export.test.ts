import { describe, expect, it } from 'vitest';
import { REGIONS } from '../../src/config/regions';
import { regionToTs } from '../../src/dev/region-export';

describe('region export (R0141)', () => {
  it('writes every exit and POI of the Grove, in stable id order', () => {
    const ts = regionToTs(REGIONS.grove);
    for (const x of REGIONS.grove.exits) expect(ts).toContain(`id: '${x.id}'`);
    for (const p of REGIONS.grove.pois) expect(ts).toContain(`id: '${p.id}'`);
    expect(ts).toBe(regionToTs(REGIONS.grove));
    expect(ts).toContain('GROVE_EXITS');
  });
});
