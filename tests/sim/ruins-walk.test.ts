import { describe, expect, it } from 'vitest';
import { SIM } from '../../src/config/tuning';
import { ledgeAt } from '../../src/sim/region-moves';
import { checkJumpRoutes } from '../../src/sim/regions-jump';
import type { SimEvent, World } from '../../src/sim/types';
import { applyCommand, createWorld, stepWorld } from '../../src/sim/world';

/** R13 lane D (WORLD-37): the ruins' colonnade-tops walk, climbed by single jumps. */
function run(w: World, steps: number): SimEvent[] {
  const ev: SimEvent[] = [];
  for (let i = 0; i < steps; i++) ev.push(...stepWorld(w, SIM.stepMs));
  return ev;
}

describe('the colonnade tops (WORLD-37)', () => {
  it('the routes meet the jump metrics and have a walking way round', () => {
    expect(checkJumpRoutes()).toEqual([]);
  });
  it('the parapet stands at 4.2 u and the steps climb to it', () => {
    expect(ledgeAt('ruins', -13, -10.6)).toBe(4.2);
    expect(ledgeAt('ruins', 13, -10.6)).toBe(4.2);
    expect(ledgeAt('ruins', 25, -10.6)).toBe(2.4);
    expect(ledgeAt('ruins', 0, -10.6)).toBeNull();
  });
  it('hopping east along the west steps reaches the parapet', () => {
    const w = createWorld(7, 0);
    w.location = 'region:ruins';
    w.keeper.pos = { x: -27, z: -10.6 };
    w.keeper.moveTarget = null;
    run(w, 3);
    applyCommand(w, { kind: 'keeperInput', input: { x: 1, z: 0 } }, []);
    let top = 0;
    for (let i = 0; i < 160; i++) {
      if (w.keeper.grounded) applyCommand(w, { kind: 'jump', down: true }, []);
      run(w, 1);
      top = Math.max(top, w.keeper.y);
    }
    expect(top).toBeGreaterThanOrEqual(4.2);
    expect(w.keeper.pos.x).toBeGreaterThan(-24);
  });
});
