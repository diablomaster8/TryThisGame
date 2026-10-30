import { describe, expect, it } from 'vitest';
import { animalRound, makeRound, soundRound } from '../../src/minigames/edu/games';
import { Rng } from '../../src/sim/rng';

describe('R0713 (KIDS-45) varied Animals, phonics-only Sounds', () => {
  it('over 1,000 age-4 Animals rounds no single kind passes half', () => {
    const rng = Rng.fromSeed(42);
    const kinds: Record<string, number> = {};
    for (let i = 0; i < 1000; i++) {
      const p = animalRound(4, rng).prompt;
      const k = p.startsWith('Tap') ? 'name' : p.startsWith('Which one says') ? 'sound' : 'home';
      kinds[k] = (kinds[k] ?? 0) + 1;
    }
    expect(Object.keys(kinds).sort()).toEqual(['home', 'name', 'sound']);
    for (const n of Object.values(kinds)) expect(n).toBeLessThan(500);
  });

  it('Sounds never asks for an animal sound, at any age', () => {
    const rng = Rng.fromSeed(9);
    for (const age of [3, 4, 5, 6] as const)
      for (let i = 0; i < 300; i++) expect(soundRound(age, rng).prompt).not.toMatch(/says/);
  });
});

describe('R0712 (KIDS-44) hidden picture words', () => {
  it('sprout letter and sound rounds hide labels; readers and other games do not', () => {
    const rng = Rng.fromSeed(3);
    expect(makeRound('letters', 5, rng, undefined, 'sprout').hideLabels).toBe(true);
    expect(makeRound('sounds', 5, rng, undefined, 'sprout').hideLabels).toBe(true);
    expect(makeRound('animals', 5, rng, undefined, 'sprout').hideLabels).toBeUndefined();
    expect(makeRound('letters', 6, rng, undefined, 'reader').hideLabels).toBeUndefined();
  });
});
