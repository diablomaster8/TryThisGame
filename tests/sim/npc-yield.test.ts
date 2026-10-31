/**
 * Visitors give way to Nubbins (R0017, MOVE-17): a wandering visitor that meets a standing
 * Nubbin on its way stops for about 600 ms, then walks round it and still arrives.
 */
import { describe, expect, it } from 'vitest';
import { NPC_MOVE } from '../../src/config/tuning-move-npc';
import { SIM } from '../../src/config/tuning';
import { createEgg } from '../../src/sim/nubbin';
import { spawnNpc, stepNpcs } from '../../src/sim/npcs';
import { Rng } from '../../src/sim/rng';
import { createWorld } from '../../src/sim/world';

describe('a visitor meets a Nubbin (R0017)', () => {
  it('pauses about 600 ms, then steps round and arrives', () => {
    const w = createWorld(7, 0);
    const rng = Rng.fromSeed('yield');
    const n = createEgg('n1', { x: 2.5, z: 4 }, rng);
    n.stage = 'child';
    w.nubbins = [n];
    w.npcs = [];
    w.keeper.pos = { x: -40, z: -40 };
    const npc = spawnNpc(w, 'yield-test');
    npc.pos = { x: 0, z: 4 };
    npc.waitMs = 0;
    const target = { x: 5, z: 4 };
    npc.target = target;
    let still = 0;
    let longestStill = 0;
    let nearest = Infinity;
    let arrivedAt = -1;
    for (let s = 0; s < 300 && arrivedAt < 0; s++) {
      w.timeMs += SIM.stepMs;
      const bx = npc.pos.x;
      const bz = npc.pos.z;
      stepNpcs(w, SIM.stepMs, rng);
      n.pos = { x: 2.5, z: 4 }; // the Nubbin stands its ground
      const moved = Math.hypot(npc.pos.x - bx, npc.pos.z - bz) > 1e-6;
      still = moved ? 0 : still + 1;
      longestStill = Math.max(longestStill, still);
      nearest = Math.min(nearest, Math.hypot(npc.pos.x - 2.5, npc.pos.z - 4));
      if (Math.hypot(npc.pos.x - target.x, npc.pos.z - target.z) < 0.35) arrivedAt = s;
    }
    const pauseSteps = NPC_MOVE.keeperPauseMs / SIM.stepMs;
    expect(longestStill).toBeGreaterThanOrEqual(pauseSteps - 1);
    expect(longestStill).toBeLessThanOrEqual(pauseSteps + 2);
    expect(nearest).toBeGreaterThan(0.45);
    expect(arrivedAt).toBeGreaterThan(0);
  });

  it('walks straight on when no Nubbin is in the way', () => {
    const w = createWorld(7, 0);
    w.nubbins = [];
    w.npcs = [];
    w.keeper.pos = { x: -40, z: -40 };
    const rng = Rng.fromSeed('yield');
    const npc = spawnNpc(w, 'yield-test');
    npc.pos = { x: 0, z: 4 };
    npc.target = { x: 5, z: 4 };
    let still = 0;
    for (let s = 0; s < 20; s++) {
      const bx = npc.pos.x;
      stepNpcs(w, SIM.stepMs, rng);
      if (npc.pos.x === bx) still++;
    }
    expect(still).toBe(0);
  });
});
