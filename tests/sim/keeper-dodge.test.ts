import { describe, expect, it } from 'vitest';
import { hatch } from '../../src/sim/lifecycle';
import { stepKeeperDodge } from '../../src/sim/keeper-dodge';
import { createWorld } from '../../src/sim/world';

// R0299 (FUN-10): a running Keeper's hard turn beside a Nubbin is a little hop.

function setup() {
  const w = createWorld(4, 0);
  const n = w.nubbins[0]!;
  hatch(n, [], 0);
  n.pos = { x: w.keeper.pos.x + 0.6, z: w.keeper.pos.z };
  w.keeper.running = true;
  w.keeper.grounded = true;
  w.keeper.facing = 0;
  stepKeeperDodge(w);
  return w;
}

describe('Keeper dodge hop', () => {
  it('hops on a hard turn next to a Nubbin, then not again inside the cooldown', () => {
    const w = setup();
    w.timeMs += 100;
    w.keeper.facing = 1.6;
    expect(stepKeeperDodge(w)).toBe(true);
    expect(w.keeper.bufferMs).toBeGreaterThan(0);
    w.timeMs += 100;
    w.keeper.facing = 0;
    expect(stepKeeperDodge(w)).toBe(false);
  });

  it('a gentle turn, a walk, or nobody near: no hop', () => {
    const w = setup();
    w.timeMs += 100;
    w.keeper.facing = 0.3;
    expect(stepKeeperDodge(w)).toBe(false);
    w.keeper.running = false;
    w.timeMs += 100;
    w.keeper.facing = 2;
    expect(stepKeeperDodge(w)).toBe(false);
    w.keeper.running = true;
    w.nubbins[0]!.pos = { x: w.keeper.pos.x + 5, z: w.keeper.pos.z };
    w.timeMs += 100;
    w.keeper.facing = 0;
    expect(stepKeeperDodge(w)).toBe(false);
  });
});
