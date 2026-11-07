import { describe, expect, it } from 'vitest';
import { GROVE } from '../../src/config/tuning';
import { ICE } from '../../src/config/tuning-more/world-edu-trail-ice';
import { ICE_Y, keeperOnIce, pondIsIce } from '../../src/sim/ice';
import { keeperFooting } from '../../src/sim/keeper';
import { createWorld, stepWorld } from '../../src/sim/world';

// R0118 (WORLD-51): the frozen pond is a surface to walk and slide on.
describe('frozen pond', () => {
  it('is ice only in a free-play winter at home', () => {
    const w = createWorld(5, 0);
    w.debugSeason = 'summer';
    expect(pondIsIce(w)).toBe(false);
    w.debugSeason = 'winter';
    expect(pondIsIce(w)).toBe(true);
    w.location = 'region:shore';
    expect(pondIsIce(w)).toBe(false);
  });

  it('holds the Keeper at the ice and lets it slide at x1.4 with low steering', () => {
    const cold = createWorld(5, 0);
    cold.debugSeason = 'winter';
    const k = cold.keeper;
    k.pos.x = GROVE.pond.x - GROVE.pond.r - 0.9;
    k.pos.z = GROVE.pond.z;
    k.grounded = true;
    expect(keeperFooting(cold, GROVE.pond.x, GROVE.pond.z).y).toBe(ICE_Y);
    k.input.x = 1;
    k.input.z = 0;
    for (let i = 0; i < 60; i++) stepWorld(cold, 100);
    // Walked clear across the pond rather than stopping at its shore.
    expect(k.pos.x).toBeGreaterThan(GROVE.pond.x);
    expect(ICE.speedMul).toBe(1.4);

    // Summer: the same walk stops at the shore.
    const warm = createWorld(5, 0);
    warm.debugSeason = 'summer';
    warm.keeper.pos.x = GROVE.pond.x - GROVE.pond.r - 0.9;
    warm.keeper.pos.z = GROVE.pond.z;
    warm.keeper.input.x = 1;
    for (let i = 0; i < 60; i++) stepWorld(warm, 100);
    expect(warm.keeper.pos.x).toBeLessThan(GROVE.pond.x);
    expect(keeperOnIce(warm)).toBe(false);
  }, 60000);
});
