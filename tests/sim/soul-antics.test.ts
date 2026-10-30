import { describe, expect, it } from 'vitest';
import { eat } from '../../src/sim/behavior';
import { evolve, hatch } from '../../src/sim/lifecycle';
import { createWorld, stepWorld } from '../../src/sim/world';
import type { Nubbin, Personality, SimEvent, World } from '../../src/sim/types';

// R0544 (SOUL-26): antics happen on their own, in several kinds, and never while away.
function grove(seed: number): World {
  const w = createWorld(seed, 0);
  const base = w.nubbins[0]!;
  const ps: Array<[Personality, boolean]> = [
    ['cheerful', true],
    ['mischievous', true],
    ['cheerful', false],
    ['shy', false],
    ['lazy', false],
    ['mischievous', false],
  ];
  w.nubbins = ps.map(([p, adult], i) => {
    const n: Nubbin = structuredClone(base);
    n.id = `n${i}`;
    n.seed = seed * 7 + i;
    n.pos = { x: -6 + i * 2.5, z: 6 };
    hatch(n, [], 0);
    if (adult) evolve(n, [], w);
    n.personality = adult ? p : null;
    if (!adult) n.childCare.pets = p === 'cheerful' ? 20 : 0;
    if (!adult && p === 'mischievous') n.childCare.throws = 10;
    return n;
  });
  // Flowers in the middle of where they walk.
  for (let i = 0; i < 4; i++)
    w.placed.push({ id: `fb${i}`, kind: 'flowerbed', pos: { x: -4 + i * 3, z: 7 } });
  w.keeper.pos = { x: 0, z: 2 };
  return w;
}

describe('R0544 antics', () => {
  it('30 minutes with 6 Nubbins: at least 15 antics of at least 3 kinds', () => {
    const w = grove(5);
    const kinds: Record<string, number> = {};
    for (let t = 0; t < 30 * 600; t++) {
      for (const n of w.nubbins) {
        n.needs.hunger = 1;
        n.needs.energy = 1;
      }
      for (const e of stepWorld(w, 100) as SimEvent[])
        if (e.kind === 'antic') kinds[e.antic] = (kinds[e.antic] ?? 0) + 1;
    }
    const total = Object.values(kinds).reduce((a, b) => a + b, 0);
    expect(total, JSON.stringify(kinds)).toBeGreaterThanOrEqual(15);
    expect(Object.keys(kinds).length, JSON.stringify(kinds)).toBeGreaterThanOrEqual(3);
  }, 60_000);

  it('two fruits inside a minute bring the hiccups', () => {
    const w = grove(6);
    const n = w.nubbins[3]!;
    const ev: SimEvent[] = [];
    eat(n, w.timeMs, ev);
    w.timeMs += 10_000;
    eat(n, w.timeMs, ev);
    let hic = false;
    for (let t = 0; t < 100 && !hic; t++)
      hic = (stepWorld(w, 100) as SimEvent[]).some(
        (e) => e.kind === 'antic' && e.antic === 'hiccup' && e.nubbinId === n.id,
      );
    expect(hic).toBe(true);
  });

  it('none fire while catching up on time away', () => {
    const w = grove(5);
    let any = false;
    for (let t = 0; t < 5 * 600 && !any; t++)
      any = (stepWorld(w, 100, undefined, true) as SimEvent[]).some((e) => e.kind === 'antic');
    expect(any).toBe(false);
    // And live play brings them back.
    stepWorld(w, 100);
  });
});

describe('R0593 liveliness and R0575 catch-up', () => {
  const rate = (l: 'calm' | 'normal' | 'lively'): number => {
    const w = grove(5);
    w.settings.liveliness = l;
    let count = 0;
    for (let t = 0; t < 20 * 600; t++) {
      for (const n of w.nubbins) n.needs.hunger = n.needs.energy = 1;
      for (const e of stepWorld(w, 100) as SimEvent[]) if (e.kind === 'antic') count++;
    }
    return count;
  };

  it('the antic rate scales roughly with the setting', () => {
    const calm = rate('calm');
    const normal = rate('normal');
    const lively = rate('lively');
    expect(calm).toBeLessThan(normal);
    expect(lively).toBeGreaterThan(normal);
    expect(lively / Math.max(1, calm)).toBeGreaterThan(1.8);
  }, 60_000);

  it('no soul acts start while catching up', () => {
    const w = grove(8);
    w.phase = 'dusk';
    w.nubbins[2]!.moody = 'grumpy';
    const acts = new Set<string>();
    for (let t = 0; t < 5 * 600; t++) {
      for (const n of w.nubbins) n.needs.hunger = n.needs.energy = 1;
      stepWorld(w, 100, undefined, true);
      for (const n of w.nubbins) if (n.behavior.itemId) acts.add(n.behavior.itemId.split(':')[0]!);
    }
    for (const a of ['fireflies', 'harrumph', 'prank', 'comfort', 'trip', 'chaseTail'])
      expect(acts.has(a), a).toBe(false);
  });
});
