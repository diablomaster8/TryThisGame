import { describe, expect, it } from 'vitest';
import { KEEPER2_PULL } from '../../src/config/tuning-more/world-backdrops';
import { applyCommand, createWorld, stepWorld } from '../../src/sim/world';

// R0140: Keeper 2 left far behind with an idle stick walks back; a held stick overrides it.
function far() {
  const w = createWorld(1, 0);
  w.nubbins = [];
  applyCommand(w, { kind: 'setCoop', active: true, trainer: 'nova' }, []);
  w.keeper.pos = { x: 0, z: 0 };
  w.keeper2!.pos = { x: 38, z: 0 };
  return w;
}
const dist = (w: ReturnType<typeof far>) =>
  Math.hypot(w.keeper2!.pos.x - w.keeper.pos.x, w.keeper2!.pos.z - w.keeper.pos.z);

describe('come-here pull (R0140)', () => {
  it('walks Keeper 2 back past the leash with an idle stick', () => {
    const w = far();
    const start = dist(w);
    expect(start).toBeGreaterThan(KEEPER2_PULL.leash);
    for (let i = 0; i < 200; i++) stepWorld(w, 100);
    expect(dist(w)).toBeLessThan(start - 10);
  });
  it('does nothing while the stick is held, or inside the leash', () => {
    const w = far();
    w.keeper2!.input = { x: 1, z: 0 };
    for (let i = 0; i < 30; i++) stepWorld(w, 100);
    expect(dist(w)).toBeGreaterThan(38);
    const n = far();
    // Just inside the leash, the idle Keeper 2 stays where it is.
    n.keeper2!.pos = { x: KEEPER2_PULL.leash - 1, z: 0 };
    for (let i = 0; i < 30; i++) stepWorld(n, 100);
    expect(dist(n)).toBeGreaterThan(KEEPER2_PULL.leash - 2);
  });
});
