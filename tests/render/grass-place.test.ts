import { describe, expect, it } from 'vitest';
import { GROVE3D } from '../../src/config/tuning';
import { groveGrassField } from '../../src/render3d/grass-field';
import { placeGrass } from '../../src/samples/grass-place';

// The 3D Grove places its grass in a worker. The checksum pins the meadow, so a change to the
// placement is a choice, not an accident. It was the page-side loop's meadow (checked tuft for
// tuft) until 2026-10-18, when the field's edge started to fray into the painted ground; on
// 2026-10-19 the waterfall's cascade down the hill was kept clear (art pass 2).
describe('grass placement', () => {
  it('places the same meadow as before the worker move', () => {
    const p = placeGrass(groveGrassField());
    expect(p.matrices).toHaveLength(2);
    for (const m of p.matrices) expect(m.length).toBe(GROVE3D.grassCount * 16);
    let h = 0;
    for (const a of [...p.matrices, ...p.colours])
      for (const v of a) h = (h * 31 + Math.round(v * 1e4)) | 0;
    expect(h).toBe(1582240373);
  });
});
