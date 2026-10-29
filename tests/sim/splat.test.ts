import { describe, expect, it } from 'vitest';
import { SIM } from '../../src/config/tuning';
import { startThrow, updateBehavior } from '../../src/sim/behavior';
import { hatch } from '../../src/sim/lifecycle';
import { Rng } from '../../src/sim/rng';
import type { SimEvent } from '../../src/sim/types';
import { createWorld } from '../../src/sim/world';

// R0299 (FUN-10): a throw at a tree splats against the trunk and drops, with no extra harm.

describe('throw splat', () => {
  it('stops at the trunk, bonks once, and costs only the usual throw penalty', () => {
    const w = createWorld(6, 0);
    const n = w.nubbins[0]!;
    hatch(n, [], 0);
    w.nubbins = [n];
    const tree = w.trees[0]!;
    n.pos = { x: tree.pos.x - 3, z: tree.pos.z };
    const ev: SimEvent[] = [];
    startThrow(n, { x: 8, z: 0 }, w.timeMs, ev);
    const rng = new Rng(1);
    for (let i = 0; i < 40 && n.behavior.state === 'thrown'; i++) {
      w.timeMs += SIM.stepMs;
      updateBehavior(n, w, SIM.stepMs, rng, ev);
    }
    expect(ev.filter((e) => e.kind === 'bonked')).toHaveLength(1);
    expect(n.pos.x).toBeLessThan(tree.pos.x);
    expect(ev.some((e) => e.kind === 'landed')).toBe(true);
  });
});
