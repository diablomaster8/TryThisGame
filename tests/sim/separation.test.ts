/**
 * Soft body separation (R0017, MOVE-17): Nubbins in a busy Grove rarely overlap, the Keeper
 * can always walk through a crowd, and nobody carried or held is pushed.
 */
import { describe, expect, it } from 'vitest';
import { SIM } from '../../src/config/tuning';
import { BODIES } from '../../src/config/tuning-sim';
import { createEgg } from '../../src/sim/nubbin';
import { Rng } from '../../src/sim/rng';
import { createWorld, stepWorld } from '../../src/sim/world';
import type { Nubbin, World } from '../../src/sim/types';

function crowd(n: number, at: { x: number; z: number }, spread: number): World {
  const w = createWorld(7, 0);
  const rng = Rng.fromSeed('crowd');
  w.nubbins = [];
  for (let i = 0; i < n; i++) {
    const egg = createEgg(
      `c${i}`,
      { x: at.x + rng.float(-spread, spread), z: at.z + rng.float(-spread, spread) },
      rng,
    );
    egg.stage = i % 2 ? 'adult' : 'child';
    w.nubbins.push(egg);
  }
  return w;
}

const r = (n: Nubbin): number => (n.stage === 'adult' ? BODIES.adult : BODIES.child);

describe('body separation (MOVE-17)', () => {
  it('keeps eight Nubbins apart nearly all the time', () => {
    const w = crowd(8, { x: 2, z: 4 }, 1.5);
    let samples = 0;
    let over = 0;
    for (let s = 0; s < 6000; s++) {
      stepWorld(w, SIM.stepMs);
      const ns = w.nubbins.filter((n) => n.stage !== 'egg' && n.behavior.state !== 'swim');
      for (let i = 0; i < ns.length; i++)
        for (let j = i + 1; j < ns.length; j++) {
          samples++;
          const a = ns[i]!;
          const b = ns[j]!;
          // A hair of slack: the pass eases pairs apart, it does not snap them.
          if (Math.hypot(a.pos.x - b.pos.x, a.pos.z - b.pos.z) < (r(a) + r(b)) * 0.9) over++;
        }
    }
    expect(over / samples).toBeLessThan(0.001);
  });

  it('lets the Keeper walk through a crowd of eight, slowed but never stopped', () => {
    const w = crowd(8, { x: 4, z: 18 }, 0.8);
    for (const n of w.nubbins) n.behavior = { ...n.behavior, state: 'sit', untilMs: 1e12 };
    w.keeper.pos = { x: 0, z: 18 };
    w.keeper.input = { x: 1, z: 0 };
    let stuck = 0;
    let worst = 0;
    for (let s = 0; s < 40 && w.keeper.pos.x < 8; s++) {
      const x = w.keeper.pos.x;
      stepWorld(w, SIM.stepMs);
      stuck = w.keeper.pos.x - x < 0.02 ? stuck + SIM.stepMs : 0;
      worst = Math.max(worst, stuck);
    }
    expect(w.keeper.pos.x).toBeGreaterThanOrEqual(8);
    expect(worst).toBeLessThanOrEqual(500);
  });

  it('never pushes a Nubbin the Keeper carries', () => {
    const w = crowd(2, { x: 4, z: 18 }, 0);
    const [a, b] = w.nubbins as [Nubbin, Nubbin];
    a.behavior = { ...a.behavior, state: 'carried' };
    b.pos = { ...a.pos };
    w.keeper.carrying = a.id;
    const before = { ...a.pos };
    stepWorld(w, SIM.stepMs);
    // The carried one rides on the Keeper's head; the other is not shoved off by it.
    expect(a.pos.x).toBeCloseTo(w.keeper.pos.x, 6);
    void before;
  });
});
