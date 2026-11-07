import { describe, expect, it } from 'vitest';
import { SNOWBALL } from '../../src/config/tuning-more/world-region-content';
import { SIM } from '../../src/config/tuning';
import { snowballs } from '../../src/sim/snowballs';
import { applyCommand, createWorld, stepWorld } from '../../src/sim/world';

/** R13 lane D (WORLD-36): snowballs on the ridge's snow. */
describe('snowballs', () => {
  it('fly an arc on the snow and land; nothing off the snow', () => {
    const w = createWorld(3, 0);
    w.location = 'region:ridge';
    w.keeper.pos = { x: 0, z: -20 };
    w.keeper.y = 7.5;
    w.keeper.facing = Math.PI;
    applyCommand(w, { kind: 'snowball' }, []);
    expect(snowballs(w)).toHaveLength(1);
    const z0 = snowballs(w)[0]!.z;
    stepWorld(w, SIM.stepMs);
    expect(snowballs(w)[0]!.z).toBeLessThan(z0);
    for (let i = 0; i < Math.ceil(SNOWBALL.flightMs / SIM.stepMs) + 2; i++)
      stepWorld(w, SIM.stepMs);
    expect(snowballs(w)).toHaveLength(0);
    w.keeper.pos = { x: 0, z: 30 };
    applyCommand(w, { kind: 'snowball' }, []);
    expect(snowballs(w)).toHaveLength(0);
  });
});
