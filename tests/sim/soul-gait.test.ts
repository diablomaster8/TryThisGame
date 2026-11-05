import { describe, expect, it } from 'vitest';
import { soulLookKind, soulPose } from '../../src/render/soul-looks';
import { setAnticsLive } from '../../src/sim/antics';
import { evolve, hatch } from '../../src/sim/lifecycle';
import { gaitOf, gaitSpeed, meanderStep } from '../../src/sim/soul-gait';
import { createWorld } from '../../src/sim/world';
import type { Nubbin, Personality } from '../../src/sim/types';

// R0570 (SOUL-53), lane A r11: each personality wanders in its own gait.
function walker(p: Personality): Nubbin {
  const w = createWorld(2, 0);
  const n = w.nubbins[0]!;
  hatch(n, [], 0);
  evolve(n, [], w);
  n.personality = p;
  n.behavior.state = 'wander';
  n.behavior.itemId = null;
  n.behavior.sinceMs = 0;
  n.behavior.target = { x: n.pos.x + 20, z: n.pos.z };
  return n;
}

describe('R0570 gaits', () => {
  it('the first four cover different ground in 5 s and wear different looks', () => {
    setAnticsLive(true);
    const ps: Personality[] = ['cheerful', 'shy', 'mischievous', 'lazy'];
    const dist: Record<string, number> = {};
    for (const p of ps) {
      const n = walker(p);
      let d = 0;
      for (let t = 0; t < 5000; t += 100) d += gaitSpeed(n, t) * 0.1;
      dist[p] = d;
    }
    const vals = Object.values(dist).sort((a, b) => a - b);
    for (let i = 1; i < vals.length; i++) expect(vals[i]! / vals[i - 1]!).toBeGreaterThan(1.03);
    const looks = new Set(ps.map((p) => soulLookKind(walker(p))));
    expect(looks.size).toBe(4);
    // And the bodies differ at the same moment.
    const bodies = new Set(
      [...looks].map((k) => {
        const o = soulPose(k!, 130, 0.2, false);
        return `${o.sw.toFixed(3)}:${o.sh.toFixed(3)}:${o.dy.toFixed(3)}`;
      }),
    );
    expect(bodies.size).toBe(4);
  });

  it('only a dreamy one meanders; errands and catch-up walk plainly', () => {
    setAnticsLive(true);
    const d = walker('dreamy');
    const side = meanderStep(d, d.behavior.target!, 600, 100);
    expect(Math.abs(side.z)).toBeGreaterThan(0);
    expect(meanderStep(walker('bold'), { x: 20, z: 0 }, 600, 100)).toEqual({ x: 0, z: 0 });
    const errand = walker('lazy');
    errand.behavior.itemId = 'toNap';
    expect(gaitSpeed(errand, 0)).toBe(1);
    setAnticsLive(false);
    expect(gaitSpeed(walker('lazy'), 0)).toBe(1);
    setAnticsLive(true);
  });

  it('a child leans at half strength', () => {
    const w = createWorld(2, 0);
    const n = w.nubbins[0]!;
    hatch(n, [], 0);
    n.childCare.pets = 12;
    expect(gaitOf(n).speed).toBeCloseTo(1 + (1.15 - 1) * 0.5, 5);
  });
});
