import { describe, expect, it } from 'vitest';
import { evolve, hatch } from '../../src/sim/lifecycle';
import { createWorld, stepWorld } from '../../src/sim/world';
import type { Nubbin, SimEvent, World } from '../../src/sim/types';

// R0542 (SOUL-24): Sun Nubbins comfort the sad; Moon Nubbins say boo.
function scene(seed: number): { w: World; sun: Nubbin; moon: Nubbin; kid: Nubbin } {
  const w = createWorld(seed, 0);
  const base = w.nubbins[0]!;
  const make = (id: string, x: number): Nubbin => {
    const n: Nubbin = structuredClone(base);
    n.id = id;
    n.seed = seed * 10 + x;
    n.pos = { x, z: 6 };
    hatch(n, [], 0);
    return n;
  };
  const sun = make('sun', -4);
  const moon = make('moon', 4);
  const kid = make('kid', 0);
  for (const [n, a] of [
    [sun, 0.9],
    [moon, -0.9],
  ] as const) {
    n.alignment = a;
    evolve(n, [], w);
    n.personality = 'cheerful';
  }
  w.nubbins = [sun, moon, kid];
  w.items = [];
  w.keeper.pos = { x: 0, z: -30 };
  return { w, sun, moon, kid };
}

describe('R0542 Sun and Moon garden behaviour', () => {
  it('a Sun adult comforts a crying child within 60 s in at least 80% of seeds', () => {
    let ok = 0;
    const seeds = 20;
    for (let s = 1; s <= seeds; s++) {
      const { w, kid } = scene(s);
      let comforted = false;
      for (let t = 0; t < 600 && !comforted; t++) {
        // A starving child with no fruit about cries.
        kid.needs.hunger = 0.05;
        kid.needs.happiness = -50;
        for (const n of w.nubbins) if (n !== kid) n.needs.hunger = n.needs.energy = 1;
        const ev = stepWorld(w, 100) as SimEvent[];
        comforted = ev.some(
          (e) => e.kind === 'comforted' && e.nubbinId === 'sun' && e.markId === 'kid',
        );
      }
      if (comforted) ok++;
    }
    expect(ok / seeds).toBeGreaterThanOrEqual(0.8);
  });

  it('only a Sun Nubbin comforts; a Moon one pranks instead', () => {
    const { w, kid } = scene(3);
    const all: SimEvent[] = [];
    for (let t = 0; t < 3000; t++) {
      kid.needs.hunger = 1;
      kid.needs.energy = 1;
      for (const n of w.nubbins) n.needs.hunger = n.needs.energy = 1;
      all.push(...(stepWorld(w, 100) as SimEvent[]));
    }
    expect(all.some((e) => e.kind === 'comforted' && e.nubbinId === 'moon')).toBe(false);
    expect(all.some((e) => e.kind === 'pranked' && e.nubbinId === 'moon')).toBe(true);
    expect(all.some((e) => e.kind === 'pranked' && e.nubbinId === 'sun')).toBe(false);
  });
});
