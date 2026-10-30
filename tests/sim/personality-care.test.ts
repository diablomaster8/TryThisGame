import { describe, expect, it } from 'vitest';
import { fortune } from '../../src/sim/kindergarten';
import { evolve, hatch } from '../../src/sim/lifecycle';
import { interact } from '../../src/sim/keeper';
import { Rng } from '../../src/sim/rng';
import { createWorld } from '../../src/sim/world';
import { NEEDS } from '../../src/config/tuning';

describe('R0526 the fortune teller', () => {
  it('reads the personality that evolution then locks, for 50 seeded care histories', () => {
    const rng = Rng.fromSeed('fortune-50');
    for (let i = 0; i < 50; i++) {
      const w = createWorld(100 + i, 0);
      const n = w.nubbins[0]!;
      hatch(n, [], 0);
      n.childCare.pets = rng.int(0, 14);
      n.childCare.throws = rng.int(0, 8);
      n.childCare.feeds = rng.int(0, 9);
      n.childCare.touches = rng.int(0, 6);
      const said = fortune(n).personality;
      evolve(n, [], w);
      expect(n.personality).toBe(said);
    }
  });
});

describe('R0530 every kind of care counts', () => {
  it('a child that only gets hugs grows up cheerful, not shy', () => {
    const w = createWorld(8, 0);
    const n = w.nubbins[0]!;
    hatch(n, [], 0);
    for (let i = 0; i < 12; i++) {
      w.timeMs += NEEDS.petCooldownMs + 10;
      interact(w, n, 'hug', []);
    }
    expect(n.childCare.pets).toBe(0);
    expect(n.childCare.touches).toBe(12);
    evolve(n, [], w);
    expect(n.personality).toBe('cheerful');
  });

  it('a flurry of taps inside the cooldown is one act of care; tuck-ins lean lazy', () => {
    const w = createWorld(8, 0);
    const n = w.nubbins[0]!;
    hatch(n, [], 0);
    for (let i = 0; i < 5; i++) interact(w, n, 'tickle', []);
    expect(n.childCare.touches).toBe(1);
    for (let i = 0; i < 6; i++) {
      w.timeMs += NEEDS.petCooldownMs + 10;
      interact(w, n, 'tuckIn', []);
    }
    evolve(n, [], w);
    expect(n.personality).toBe('lazy');
  });
});

describe('R0531 the personality locks in, with a reason', () => {
  it('evolving pushes personalityLocked with the care that shaped it', () => {
    const w = createWorld(9, 0);
    const n = w.nubbins[0]!;
    hatch(n, [], 0);
    n.childCare.pets = 11;
    const events: Parameters<typeof evolve>[1] = [];
    evolve(n, events, w);
    const e = events.find((x) => x.kind === 'personalityLocked');
    expect(e).toMatchObject({ personality: 'cheerful', cause: 'pets' });
  });
});
