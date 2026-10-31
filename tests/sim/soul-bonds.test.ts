import { describe, expect, it } from 'vitest';
import { FRIENDS } from '../../src/config/tuning';
import { RIVALS } from '../../src/config/tuning-soul-r10';
import { evolve, hatch } from '../../src/sim/lifecycle';
import { areRivals, compat, stepRivals, topRival } from '../../src/sim/rivals';
import { createWorld, stepWorld } from '../../src/sim/world';
import { setAnticsLive } from '../../src/sim/antics';
import type { Nubbin, Personality, SimEvent, World } from '../../src/sim/types';

// R0538 (SOUL-20): friendships depend on personality fit, and rivalries form and show.

function grove(seed: number, ps: Personality[]): World {
  const w = createWorld(seed, 0);
  const base = w.nubbins[0]!;
  w.nubbins = ps.map((p, i) => {
    const n: Nubbin = structuredClone(base);
    n.id = `n${i}`;
    n.seed = seed * 31 + i;
    hatch(n, [], 0);
    evolve(n, [], w);
    n.personality = p;
    n.pos = { x: (i % 3) * 3 - 3, z: Math.floor(i / 3) * 3 };
    return n;
  });
  return w;
}

const SIX: Personality[] = ['cheerful', 'shy', 'mischievous', 'lazy', 'cheerful', 'lazy'];

describe('R0538 friendships and rivalries', () => {
  it('fit decides how fast friendship grows', () => {
    const w = grove(1, ['cheerful', 'shy', 'mischievous', 'lazy']);
    const [c, s, m, l] = w.nubbins as [Nubbin, Nubbin, Nubbin, Nubbin];
    expect(compat(c, s)).toBeGreaterThan(compat(c, c));
    expect(compat(m, l)).toBeLessThan(1);
    expect(compat(c, s)).toBe(compat(s, c));
  });

  it('a 120 min day of six ends with 3–8 friendships and a rivalry, and rivals puff', () => {
    for (const seed of [1, 3, 5]) {
      const w = grove(seed, SIX);
      let puffs = 0;
      for (let t = 0; t < 120 * 600; t++)
        for (const e of stepWorld(w, 100)) if (e.kind === 'rivalPuff') puffs++;
      let friends = 0;
      let rivals = 0;
      for (const a of w.nubbins)
        for (const b of w.nubbins)
          if (a.id < b.id) {
            if ((a.friends[b.id] ?? 0) >= FRIENDS.buddyAt) friends++;
            if (areRivals(a, b)) rivals++;
          }
      expect(friends, `seed ${seed}`).toBeGreaterThanOrEqual(3);
      expect(friends, `seed ${seed}`).toBeLessThanOrEqual(8);
      expect(rivals, `seed ${seed}`).toBeGreaterThanOrEqual(1);
      expect(puffs, `seed ${seed}`).toBeGreaterThanOrEqual(1);
    }
  }, 120_000);

  it('rivals near each other long enough make up with a hug', () => {
    const w = grove(2, ['mischievous', 'lazy']);
    const [a, b] = w.nubbins as [Nubbin, Nubbin];
    a.rivals = { [b.id]: 35 };
    a.friends[b.id] = 5;
    b.friends[a.id] = 5;
    const events: SimEvent[] = [];
    setAnticsLive(true);
    for (
      let i = 0;
      i < RIVALS.makeUpMinutes * 60 + 5 && !events.some((e) => e.kind === 'madeUp');
      i++
    ) {
      for (const n of [a, b]) {
        n.behavior.state = 'sit';
        n.behavior.untilMs = Infinity;
      }
      w.timeMs += 1000;
      stepRivals(w, a, b, true, 1 / 60, events);
    }
    expect(events.some((e) => e.kind === 'madeUp')).toBe(true);
    expect(a.rivals?.[b.id] ?? 0).toBeLessThan(35);
    expect(a.friends[b.id]).toBeGreaterThanOrEqual(15);
    expect(a.behavior.itemId).toBe('makeUpHug');
    expect(topRival(w, a)).toBe(null);
  });

  it('no rivalry changes while catching up on time away', () => {
    const w = grove(4, ['mischievous', 'lazy']);
    const [a, b] = w.nubbins as [Nubbin, Nubbin];
    setAnticsLive(false);
    stepRivals(w, a, b, true, 60, []);
    setAnticsLive(true);
    expect(a.rivals).toBeUndefined();
    stepRivals(w, a, b, true, 1, []);
    expect(a.rivals?.[b.id] ?? 0).toBeGreaterThan(0);
  });
});
