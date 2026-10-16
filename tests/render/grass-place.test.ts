import { describe, expect, it } from 'vitest';
import { GROVE3D } from '../../src/config/tuning';
import { groveGrassField } from '../../src/render3d/grass-field';
import { placeGrass } from '../../src/samples/grass-place';

// The 3D Grove places its grass in a worker. The checksum is the meadow the page-side loop
// placed before the move (checked tuft for tuft against it), so the first frame stays the same.
describe('grass placement', () => {
  it('places the same meadow as before the worker move', () => {
    const p = placeGrass(groveGrassField());
    expect(p.matrices).toHaveLength(2);
    for (const m of p.matrices) expect(m.length).toBe(GROVE3D.grassCount * 16);
    let h = 0;
    for (const a of [...p.matrices, ...p.colours])
      for (const v of a) h = (h * 31 + Math.round(v * 1e4)) | 0;
    expect(h).toBe(220861559);
  });
});
