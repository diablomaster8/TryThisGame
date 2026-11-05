import { describe, expect, it } from 'vitest';
import { setAnticsLive } from '../../src/sim/antics';
import { cryFlavour, startCry } from '../../src/sim/cry-soul';
import { evolve, hatch } from '../../src/sim/lifecycle';
import { createWorld, stepWorld } from '../../src/sim/world';
import type { Nubbin, Personality, SimEvent, World } from '../../src/sim/types';

// R0558 (cry half) and R0581 (SOUL-64), lane A r11: crying by personality, brief cries,
// and friends who come over to comfort.
function pair(seed: number): { w: World; a: Nubbin; b: Nubbin } {
  const w = createWorld(seed, 0);
  for (const n of w.nubbins) {
    hatch(n, [], 0);
    evolve(n, [], w);
  }
  const [a, b] = w.nubbins as [Nubbin, Nubbin];
  w.nubbins = [a, b];
  a.pos = { x: -4, z: -2 };
  b.pos = { x: -1, z: -2 };
  a.friends[b.id] = 40;
  b.friends[a.id] = 40;
  w.keeper.pos = { x: 10, z: 10 };
  return { w, a, b };
}

describe('R0558 crying by personality', () => {
  it('shy sniffles, bold cries short, gentle walks to the Keeper', () => {
    setAnticsLive(true);
    const { w, a } = pair(3);
    const ways: Partial<Record<Personality, string>> = {
      shy: 'sniffle',
      bold: 'cryStomp',
      gentle: 'cryToKeeper',
      cheerful: 'cry',
    };
    for (const [p, id] of Object.entries(ways)) {
      a.personality = p as Personality;
      expect(cryFlavour(a, w).itemId).toBe(id);
    }
    a.personality = 'bold';
    startCry(a, w, 0, 3000);
    expect(a.behavior.untilMs).toBeLessThan(3000);
    a.personality = 'gentle';
    startCry(a, w, 0, 3000);
    expect(a.behavior.target).not.toBeNull();
  });
});

describe('R0581 comfort', () => {
  it('a crier with a friend near is comforted in at least 70% of seeds within 30 s', () => {
    let comforted = 0;
    const seeds = 20;
    for (let s = 0; s < seeds; s++) {
      const { w, a, b } = pair(100 + s);
      a.personality = 'shy';
      b.personality = 'cheerful';
      b.behavior.state = 'sit';
      b.behavior.untilMs = 60_000;
      setAnticsLive(true);
      startCry(a, w, w.timeMs, 3000);
      let ok = false;
      for (let t = 0; t < 300 && !ok; t++) {
        for (const n of w.nubbins) {
          n.needs.hunger = 1;
          n.needs.energy = 1;
        }
        const ev = stepWorld(w, 100) as SimEvent[];
        ok = ev.some((e) => e.kind === 'comforted' && e.markId === a.id);
      }
      if (ok) comforted++;
    }
    expect(comforted / seeds).toBeGreaterThanOrEqual(0.7);
  }, 60_000);

  it('a snatch victim and a third throw cry briefly', () => {
    setAnticsLive(true);
    const { w, a, b } = pair(5);
    a.behavior.state = 'wander';
    b.behavior.state = 'wander';
    const now = w.timeMs;
    a.recentCare = [
      { kind: 'throw', atMs: now },
      { kind: 'throw', atMs: now },
      { kind: 'throw', atMs: now },
    ];
    // Fed through the step's events, as the sim raises them.
    w.nubbins.forEach((n) => (n.needs.hunger = 1));
    const events: SimEvent[] = [
      { kind: 'landed', nubbinId: a.id },
      { kind: 'snatched', nubbinId: a.id, victimId: b.id },
    ];
    return import('../../src/sim/cry-soul').then(({ stepCrying }) => {
      stepCrying(w, events, false);
      expect(a.behavior.state).toBe('cry');
      expect(b.behavior.state).toBe('cry');
    });
  });
});
