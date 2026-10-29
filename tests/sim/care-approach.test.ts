import { describe, expect, it } from 'vitest';
import { keeperFooting, updateKeeper } from '../../src/sim/keeper';
import { blocked } from '../../src/sim/obstacles';
import { Rng } from '../../src/sim/rng';
import { applyCommand, createWorld } from '../../src/sim/world';
import type { SimEvent, World } from '../../src/sim/types';

// MOVE-59: a Pet walk stops where the Nubbin stays in view: behind it from the camera.

/** Whether the Keeper's body hides the Nubbin: nearer the camera and overlapping on screen. */
function covers(w: World, yaw: number): boolean {
  const n = w.nubbins[0]!;
  const dx = w.keeper.pos.x - n.pos.x;
  const dz = w.keeper.pos.z - n.pos.z;
  const toward = dx * Math.sin(yaw) + dz * Math.cos(yaw);
  const across = dx * Math.cos(yaw) - dz * Math.sin(yaw);
  return toward > 0 && Math.abs(across) < 0.55;
}

function petWalk(seed: number): { covered: boolean; petted: boolean } {
  const rng = new Rng(seed * 7919);
  const w = createWorld(seed, 0);
  w.nubbins = w.nubbins.slice(0, 1);
  const n = w.nubbins[0]!;
  n.stage = 'child';
  // A Nubbin sitting still somewhere open, the Keeper a few units off, a random view yaw.
  const spot = () => ({ x: rng.float(-20, 20), z: rng.float(-20, 20) });
  let p = spot();
  while (blocked(p, w, 1.6) || keeperFooting(w, p.x, p.z).on === 'water') p = spot();
  n.pos = { ...p };
  n.behavior.state = 'sit';
  n.behavior.sinceMs = 0;
  const a = rng.float(0, Math.PI * 2);
  const kp = { x: p.x + Math.sin(a) * rng.float(3, 7), z: p.z + Math.cos(a) * rng.float(3, 7) };
  w.keeper.pos = blocked(kp, w, 0.5) ? { x: p.x + 3, z: p.z } : kp;
  w.keeper.y = keeperFooting(w, w.keeper.pos.x, w.keeper.pos.z).y;
  const yaw = (Math.floor(rng.float(0, 8)) * Math.PI) / 4;
  applyCommand(w, { kind: 'viewYaw', yaw }, []);
  applyCommand(w, { kind: 'pet', nubbinId: n.id }, []);
  const ev: SimEvent[] = [];
  for (let i = 0; i < 600 && w.keeper.intent; i++) {
    n.pos = { ...p };
    updateKeeper(w, 1000 / 60, ev);
  }
  return {
    covered: covers(w, yaw),
    petted: !w.keeper.intent && !ev.some((e) => e.kind === 'cantReach'),
  };
}

describe('care walks stop with the Nubbin in view (MOVE-59)', () => {
  it('after a Pet walk the Keeper does not cover the Nubbin in 95% or more of random cases', () => {
    let covered = 0;
    let petted = 0;
    const N = 80;
    for (let s = 1; s <= N; s++) {
      const r = petWalk(s);
      if (r.covered) covered++;
      if (r.petted) petted++;
    }
    expect(petted).toBeGreaterThanOrEqual(N * 0.95);
    expect(covered / N).toBeLessThanOrEqual(0.05);
  });
});
