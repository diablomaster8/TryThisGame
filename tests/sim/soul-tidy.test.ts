import { describe, expect, it } from 'vitest';
import { TIDY } from '../../src/config/tuning-soul-r10';
import { evolve, hatch } from '../../src/sim/lifecycle';
import { toyCorner } from '../../src/sim/tidy';
import { createWorld, stepWorld } from '../../src/sim/world';
import type { Nubbin, World } from '../../src/sim/types';

// R0542 (SOUL-24), the r10 half: a Sun adult pushes a stray toy back to the toy corner; a
// Moon one never does.

function grove(seed: number, band: 'sun' | 'moon'): { w: World; a: Nubbin } {
  const w = createWorld(seed, 0);
  const a = w.nubbins[0]!;
  hatch(a, [], 0);
  evolve(a, [], w);
  a.form = { ...a.form!, band };
  a.personality = 'cheerful';
  w.nubbins = [a];
  a.pos = { x: 2, z: 4 };
  w.items = w.items.filter((i) => i.kind !== 'toy');
  w.items.push({ id: 't1', kind: 'toy', pos: { x: 0, z: 4 }, y: 0, vel: { x: 0, y: 0, z: 0 } });
  return { w, a };
}

function run(w: World, a: Nubbin, minutes: number): boolean {
  const corner = toyCorner(w);
  for (let t = 0; t < minutes * 600; t++) {
    a.needs.hunger = 1;
    a.needs.energy = 1;
    stepWorld(w, 100);
    const toy = w.items.find((i) => i.id === 't1')!;
    if (Math.hypot(toy.pos.x - corner.x, toy.pos.z - corner.z) < TIDY.nearSpot) return true;
  }
  return false;
}

describe('R0542 tidy', () => {
  it('a Sun adult tidies a stray toy home within 3 minutes in at least 8 of 10 seeds', () => {
    let tidied = 0;
    for (let s = 1; s <= 10; s++) {
      const { w, a } = grove(s, 'sun');
      if (run(w, a, 3)) tidied++;
    }
    expect(tidied).toBeGreaterThanOrEqual(8);
  }, 60_000);

  it('a Moon adult leaves it where it lies', () => {
    for (let s = 1; s <= 3; s++) {
      const { w, a } = grove(s, 'moon');
      expect(run(w, a, 3)).toBe(false);
    }
  }, 60_000);
});
