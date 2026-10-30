import { describe, expect, it } from 'vitest';
import { hatch } from '../../src/sim/lifecycle';
import { decidePersonality, idleMultipliers, leaningPersonality } from '../../src/sim/personality';
import { createWorld, stepWorld } from '../../src/sim/world';
import type { Nubbin, World } from '../../src/sim/types';

// R0523 (SOUL-03): a child leans toward a personality as it is cared for, its idle odds
// follow the leaning at half strength, and the leaning is the one that locks.
function oneChild(seed: number): { w: World; n: Nubbin } {
  const w = createWorld(seed, 0);
  const n = w.nubbins[0]!;
  w.nubbins = [n];
  hatch(n, [], 0);
  return { w, n };
}

/** Sim seconds spent greeting over `minutes`, the Keeper standing close by. */
function greetSeconds(w: World, n: Nubbin, minutes: number): number {
  let greet = 0;
  for (let t = 0; t < minutes * 600; t++) {
    n.needs.hunger = 1;
    n.needs.energy = 1;
    w.keeper.pos = { x: n.pos.x + 1.5, z: n.pos.z };
    stepWorld(w, 100);
    if (n.behavior.state === 'greet') greet += 0.1;
  }
  return greet;
}

describe('R0523 leaning personality', () => {
  it('shows nothing at first, then the leaning the care points to', () => {
    const { n } = oneChild(3);
    expect(leaningPersonality(n)).toBeNull();
    n.childCare.pets = 10;
    expect(leaningPersonality(n)).toBe('cheerful');
    expect(leaningPersonality(n)).toBe(decidePersonality(n.childCare));
  });

  it('a child left alone leans shy after a while', () => {
    const { n } = oneChild(3);
    n.stageMs = 16 * 60_000;
    expect(leaningPersonality(n)).toBe('shy');
  });

  it('a child leaning counts at half strength', () => {
    const full = idleMultipliers('cheerful');
    const half = idleMultipliers('cheerful', 0.5);
    expect(half.greet).toBeCloseTo(1 + (full.greet - 1) / 2);
  });

  it('a well-petted child greets more than an untouched one over 20 minutes', () => {
    let petted = 0;
    let alone = 0;
    for (const seed of [5, 6, 7]) {
      const a = oneChild(seed);
      a.n.childCare.pets = 10;
      petted += greetSeconds(a.w, a.n, 20);
      const b = oneChild(seed);
      alone += greetSeconds(b.w, b.n, 20);
    }
    expect(petted).toBeGreaterThan(alone);
  });
});
