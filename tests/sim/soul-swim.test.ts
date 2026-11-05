import { describe, expect, it } from 'vitest';
import { evolve, hatch } from '../../src/sim/lifecycle';
import { swimFactor, swimSpot } from '../../src/sim/swim-soul';
import { GROVE } from '../../src/config/tuning';
import { createWorld, stepWorld } from '../../src/sim/world';
import type { Personality } from '../../src/sim/types';

// R0582 (SOUL-65), lane A r11: the swim share by type and personality, over 30 sim minutes
// with the Keeper beside it half of each minute (as personality-distinct runs it).
function swimShare(p: Personality, swimType: boolean, seed: number): number {
  const w = createWorld(seed, 0);
  const n = w.nubbins[0]!;
  w.nubbins = [n];
  hatch(n, [], 0);
  evolve(n, [], w);
  n.personality = p;
  if (swimType) n.typeLean.swim = 80;
  else n.typeLean.swim = 0;
  let swim = 0;
  const steps = 30 * 600;
  for (let t = 0; t < steps; t++) {
    n.needs.hunger = 1;
    n.needs.energy = 1;
    w.keeper.pos = t % 600 < 300 ? { x: n.pos.x + 1.5, z: n.pos.z } : { x: 0, z: -30 };
    stepWorld(w, 100);
    if (n.behavior.state === 'swim') swim++;
  }
  return swim / steps;
}

describe('R0582 swim share', () => {
  const ps: Personality[] = ['cheerful', 'curious', 'gentle'];
  const mean = (p: Personality, type: boolean): number =>
    [61, 62].map((s) => swimShare(p, type, s)).reduce((a, b) => a + b) / 2;

  it('a non-swim Nubbin swims 5-15% of the time, a swim type 25-40%', () => {
    for (const p of ps) {
      const plain = mean(p, false);
      expect(plain, p).toBeGreaterThanOrEqual(0.05);
      expect(plain, p).toBeLessThanOrEqual(0.15);
    }
    // Bold and mischievous swim half as much again; still not pond-bound.
    for (const p of ['bold', 'mischievous'] as const) expect(mean(p, false), p).toBeLessThan(0.22);
    const typed = mean('cheerful', true);
    expect(typed).toBeGreaterThanOrEqual(0.25);
    expect(typed).toBeLessThanOrEqual(0.4);
  }, 120_000);

  it('a swim lean quadruples the weight; a shy one wades at the rim', () => {
    const w = createWorld(1, 0);
    const n = w.nubbins[0]!;
    n.typeLean.swim = 50;
    expect(swimFactor(n)).toBe(4);
    n.typeLean.swim = 0;
    expect(swimFactor(n)).toBe(1);
    n.personality = 'shy';
    const s = swimSpot(n, 0)!;
    const d = Math.hypot(s.x - GROVE.pond.x, s.z - GROVE.pond.z);
    expect(d).toBeGreaterThan(GROVE.pond.r - 1);
    n.personality = 'bold';
    expect(swimSpot(n, 0)).toBeNull();
  });
});
