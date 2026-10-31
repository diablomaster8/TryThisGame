import { describe, expect, it } from 'vitest';
import { evolve, hatch } from '../../src/sim/lifecycle';
import { createWorld, stepWorld } from '../../src/sim/world';
import type { Nubbin, SimEvent, World } from '../../src/sim/types';

// R0542 (SOUL-24), the r9 half: a Sun adult carries fruit to a hungry child; a Moon adult
// stashes fruit by a tree and sits on it. No fruit is ever lost.

function grove(seed: number, band: 'sun' | 'moon'): { w: World; a: Nubbin; kid: Nubbin } {
  const w = createWorld(seed, 0);
  const base = w.nubbins[0]!;
  const a: Nubbin = structuredClone(base);
  a.id = 'a';
  hatch(a, [], 0);
  evolve(a, [], w);
  a.form = { ...a.form!, band };
  a.personality = 'cheerful';
  const kid: Nubbin = structuredClone(base);
  kid.id = 'kid';
  kid.seed += 5;
  hatch(kid, [], 0);
  w.nubbins = [a, kid];
  a.pos = { x: 0, z: 4 };
  kid.pos = { x: 6, z: 6 };
  w.items = w.items.filter((i) => i.kind !== 'fruit');
  w.items.push({
    id: 'f1',
    kind: 'fruit',
    pos: { x: -2, z: 4 },
    y: 0,
    vel: { x: 0, y: 0, z: 0 },
    flavor: 'power',
  });
  return { w, a, kid };
}

const fruitCount = (w: World): number =>
  w.items.filter((i) => i.kind === 'fruit').length +
  w.nubbins.filter((n) => /^(shareRun|hoardRun|snatchRun):/.test(n.behavior.itemId ?? '')).length;

describe('R0542 share and hoard', () => {
  it('a Sun adult brings a hungry child a fruit within 60 s in most seeds', () => {
    let ok = 0;
    for (let s = 1; s <= 10; s++) {
      const { w, a, kid } = grove(s, 'sun');
      let shared = false;
      for (let t = 0; t < 600 && !shared; t++) {
        a.needs.hunger = 1;
        a.needs.energy = 1;
        kid.needs.energy = 1;
        kid.needs.hunger = 0.45; // peckish, not yet hunting for food itself
        kid.pos = { x: 6, z: 6 };
        for (const e of stepWorld(w, 100) as SimEvent[])
          if (e.kind === 'sharedFruit') shared = true;
        expect(fruitCount(w)).toBe(1);
      }
      if (shared) {
        ok++;
        const f = w.items.find((i) => i.kind === 'fruit')!;
        expect(Math.hypot(f.pos.x - kid.pos.x, f.pos.z - kid.pos.z)).toBeLessThan(2.5);
        expect(f.flavor).toBe('power');
      }
    }
    expect(ok).toBeGreaterThanOrEqual(8);
  });

  it('a Moon adult hoards a fruit by a tree and sits on it, and none is lost', () => {
    let hoarded = 0;
    for (let s = 1; s <= 10; s++) {
      const { w, a, kid } = grove(s, 'moon');
      kid.pos = { x: 30, z: 30 };
      // Trees drop more fruit as it runs; nobody eats (all fed), so the count never falls.
      let prev = fruitCount(w);
      for (let t = 0; t < 3000; t++) {
        a.needs.hunger = 1;
        a.needs.energy = 1;
        kid.needs.hunger = 1;
        stepWorld(w, 100);
        expect(fruitCount(w)).toBeGreaterThanOrEqual(prev);
        prev = fruitCount(w);
        if (a.behavior.itemId === 'hoardSit') {
          hoarded++;
          const near = w.items.some(
            (i) => i.kind === 'fruit' && Math.hypot(i.pos.x - a.pos.x, i.pos.z - a.pos.z) < 1,
          );
          expect(near).toBe(true);
          break;
        }
      }
    }
    expect(hoarded).toBeGreaterThanOrEqual(3);
  });
});
