import { describe, expect, it } from 'vitest';
import { CAVE_MOUTH } from '../../src/config/grove-layout';
import { LITTLE_GROVE } from '../../src/config/tuning-world';
import { createEdu } from '../../src/sim/edu';
import { inLittleGrove } from '../../src/sim/little-grove';
import { applyCommand, createWorld, stepWorld } from '../../src/sim/world';

/** R0099: the Learning Grove keeps everyone inside its fenced 40 x 40 play area. */
describe('Learning Grove play area', () => {
  it('is 40 x 40 and leaves the Hollow mouth outside', () => {
    expect(LITTLE_GROVE.maxX - LITTLE_GROVE.minX).toBe(40);
    expect(LITTLE_GROVE.maxZ - LITTLE_GROVE.minZ).toBe(40);
    expect(inLittleGrove(CAVE_MOUTH)).toBe(false);
  });

  it('no command moves the Keeper outside it', () => {
    const w = createWorld(11, 0);
    w.edu = createEdu(4, 'sprout');
    const run = (steps: number) => {
      for (let i = 0; i < steps; i++) {
        stepWorld(w, 100);
        expect(inLittleGrove(w.keeper.pos)).toBe(true);
        for (const n of w.nubbins) expect(inLittleGrove(n.pos)).toBe(true);
      }
    };
    applyCommand(w, { kind: 'moveKeeperTo', pos: { x: 45, z: -45 } }, []);
    run(400);
    applyCommand(w, { kind: 'teleport', pos: { x: -40, z: 40 } }, []);
    run(5);
    applyCommand(w, { kind: 'setRunning', running: true }, []);
    w.keeper.input = { x: 0, z: -1 };
    run(300);
    applyCommand(w, { kind: 'moveKeeperTo', pos: CAVE_MOUTH }, []);
    run(300);
    expect(
      Math.hypot(w.keeper.pos.x - CAVE_MOUTH.x, w.keeper.pos.z - CAVE_MOUTH.z),
    ).toBeGreaterThan(1);
  });

  it('leaves the main game free to roam', () => {
    const w = createWorld(11, 0);
    applyCommand(w, { kind: 'teleport', pos: { x: -40, z: 40 } }, []);
    stepWorld(w, 100);
    expect(inLittleGrove(w.keeper.pos)).toBe(false);
  });
});
