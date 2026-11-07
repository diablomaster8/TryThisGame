import { describe, expect, it } from 'vitest';
import { SLIDE_FX } from '../../src/config/tuning-r16d1';
import { SnowSlideFx } from '../../src/render/snow-slide-fx';
import { regionLocation, stepRegionWalk } from '../../src/sim/region-walk';
import { createWorld } from '../../src/sim/world';

describe('snow slide fx (R0118)', () => {
  it('stays quiet at home and sprays at the spray rate while sliding on the ridge', () => {
    const fx = new SnowSlideFx();
    const home = createWorld(5, 0);
    expect(fx.tick(home, 0)).toBe(false);
    const w = createWorld(5, 0);
    w.location = regionLocation('ridge');
    w.keeper.pos = { x: -20, z: -50 };
    w.keeper.input = { x: 1, z: 0 };
    let puffs = 0;
    let now = 0;
    for (let i = 0; i < 20; i++) {
      stepRegionWalk(w, 100, []);
      now += 100;
      if (fx.tick(w, now)) puffs++;
    }
    expect(puffs).toBeGreaterThan(5);
    expect(puffs).toBeLessThanOrEqual(Math.ceil(2000 / SLIDE_FX.sprayMs));
  });
});
