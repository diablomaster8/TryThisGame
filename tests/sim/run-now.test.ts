/**
 * R0042 (lane A r10): `keeperRunningNow`, which the 3D Keeper reads to swing its arms wider,
 * is on for the Run toggle and for an Auto-run tap walk, and off for a short tap walk.
 */
import { describe, expect, it } from 'vitest';
import { SIM } from '../../src/config/tuning';
import { keeperRunningNow } from '../../src/sim/keeper';
import { applyCommand, createWorld, stepWorld } from '../../src/sim/world';

function world() {
  const w = createWorld(1, 0);
  w.nubbins = [];
  w.keeper.pos = { x: 12, z: 2 };
  return w;
}

describe('keeperRunningNow (MOVE-42)', () => {
  it('follows the Run toggle', () => {
    const w = world();
    expect(keeperRunningNow(w)).toBe(false);
    w.keeper.running = true;
    expect(keeperRunningNow(w)).toBe(true);
  });

  it('is on for a long Auto-run tap walk, off for a short one', () => {
    const w = world();
    w.settings.autoRun = true;
    applyCommand(w, { kind: 'moveKeeperTo', pos: { x: 13.5, z: 2 } }, []);
    stepWorld(w, SIM.stepMs);
    expect(keeperRunningNow(w)).toBe(false);
    const far = world();
    far.settings.autoRun = true;
    applyCommand(far, { kind: 'moveKeeperTo', pos: { x: 0, z: 10 } }, []);
    stepWorld(far, SIM.stepMs);
    expect(far.keeper.moveTarget).not.toBeNull();
    expect(keeperRunningNow(far)).toBe(true);
  });
});
