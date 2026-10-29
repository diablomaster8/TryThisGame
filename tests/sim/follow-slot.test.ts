// MOVE-48: a partner following the Keeper round the Grove makes for a slot behind it and
// keeps a polite distance, rather than walking into the Keeper's own spot.
import { describe, expect, it } from 'vitest';
import { EGG, SIM } from '../../src/config/tuning';
import { Rng } from '../../src/sim/rng';
import { applyCommand, createWorld, stepWorld } from '../../src/sim/world';

describe('following partners (MOVE-48)', () => {
  it('two partners seldom stand inside the Keeper over five minutes of walking', () => {
    const w = createWorld(12, 0);
    for (let i = 0; i < EGG.hatchMs / SIM.stepMs + 5; i++) stepWorld(w, SIM.stepMs);
    const [a, b] = w.nubbins;
    w.nubbins = [a!, b!];
    w.partners = [a!.id, b!.id];
    for (const n of w.nubbins) n.stage = 'adult';
    const r = new Rng(99);
    let inside = 0;
    let steps = 0;
    for (let i = 0; i < (5 * 60_000) / SIM.stepMs; i++) {
      if (i % 60 === 0)
        applyCommand(
          w,
          { kind: 'moveKeeperTo', pos: { x: r.float(-12, 12), z: r.float(-30, -14) } },
          [],
        );
      for (const n of w.nubbins) {
        n.needs.hunger = 1;
        n.needs.energy = 1;
      }
      stepWorld(w, SIM.stepMs);
      for (const n of w.nubbins) {
        steps++;
        if (Math.hypot(n.pos.x - w.keeper.pos.x, n.pos.z - w.keeper.pos.z) < 0.5) inside++;
      }
    }
    expect(inside / steps).toBeLessThan(0.01);
  });
});
