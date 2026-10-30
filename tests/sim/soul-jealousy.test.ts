import { describe, expect, it } from 'vitest';
import { evolve, hatch } from '../../src/sim/lifecycle';
import { petNubbin } from '../../src/sim/keeper';
import { createWorld, stepWorld } from '../../src/sim/world';
import type { Nubbin, Personality, SimEvent } from '../../src/sim/types';

// R0560 (SOUL-43): petting one in a group of four draws a jealous response in ≥60% of trials.

const PS: Personality[] = ['cheerful', 'cheerful', 'mischievous', 'shy'];

describe('R0560 jealousy', () => {
  it('petting one of four draws at least one jealous response in 60% of trials', () => {
    let hits = 0;
    const trials = 20;
    const kinds = new Set<string>();
    for (let i = 0; i < trials; i++) {
      const w = createWorld(100 + i, 0);
      const base = w.nubbins[0]!;
      w.nubbins = PS.map((p, j) => {
        const n: Nubbin = structuredClone(base);
        n.id = `n${j}`;
        n.seed = i * 10 + j;
        n.pos = { x: j * 1.5, z: 3 };
        hatch(n, [], 0);
        evolve(n, [], w);
        n.personality = p;
        n.behavior.state = 'sit';
        n.behavior.untilMs = 60_000;
        return n;
      });
      w.timeMs = 5000 + i * 7000;
      w.keeper.pos = { x: 0, z: 4.5 };
      const ev: SimEvent[] = [];
      petNubbin(w, w.nubbins[0]!, ev);
      const jealous = ev.filter((e) => e.kind === 'jealous');
      if (jealous.length) hits++;
      for (const n of w.nubbins.slice(1)) if (n.behavior.itemId) kinds.add(n.behavior.itemId);
      // The petted one is never its own rival, and a nudge lands.
      expect(jealous.every((e) => e.kind === 'jealous' && e.nubbinId !== 'n0')).toBe(true);
      for (let t = 0; t < 40; t++) stepWorld(w, 100);
    }
    expect(hits / trials).toBeGreaterThanOrEqual(0.6);
    expect(kinds.has('askUp') || kinds.has('watchJealous') || kinds.has('nudge:n0')).toBe(true);
  });

  it('a mischievous nudge shoves the petted one a little aside', () => {
    for (let i = 0; i < 40; i++) {
      const w = createWorld(7, 0);
      const base = w.nubbins[0]!;
      const a: Nubbin = structuredClone(base);
      a.id = 'a';
      a.pos = { x: 0, z: 3 };
      const m: Nubbin = structuredClone(base);
      m.id = 'm';
      m.pos = { x: 2, z: 3 };
      for (const n of [a, m]) {
        hatch(n, [], 0);
        evolve(n, [], w);
        n.behavior.state = 'sit';
        n.behavior.untilMs = 600_000;
      }
      m.personality = 'mischievous';
      w.nubbins = [a, m];
      w.timeMs = 1000 * (i + 1);
      w.keeper.pos = { x: 0, z: 4.2 };
      petNubbin(w, a, []);
      if (!m.behavior.itemId?.startsWith('nudge:')) continue;
      const before = { ...a.pos };
      for (let t = 0; t < 30; t++) stepWorld(w, 100);
      expect(Math.hypot(a.pos.x - before.x, a.pos.z - before.z)).toBeGreaterThan(0.1);
      return;
    }
    throw new Error('no nudge in 40 tries');
  });
});
