import { describe, expect, it } from 'vitest';
import { NEEDS } from '../../src/config/tuning';
import { evolve, hatch } from '../../src/sim/lifecycle';
import { createWorld, stepWorld } from '../../src/sim/world';
import type { Nubbin, SimEvent, World } from '../../src/sim/types';

// R0545 (SOUL-27): a mischievous adult snatches a hungry child's fruit, never a starving one's.

function pair(seed: number): { w: World; thief: Nubbin; kid: Nubbin } {
  const w = createWorld(seed, 0);
  const base = w.nubbins[0]!;
  const thief: Nubbin = structuredClone(base);
  thief.id = 'thief';
  thief.seed = seed * 13 + 1;
  hatch(thief, [], 0);
  evolve(thief, [], w);
  thief.personality = 'mischievous';
  const kid: Nubbin = structuredClone(base);
  kid.id = 'kid';
  kid.seed = seed * 13 + 2;
  hatch(kid, [], 0);
  w.nubbins = [thief, kid];
  return { w, thief, kid };
}

/** Ten minutes with the child hungry and a fruit dropped near both now and then. */
function run(seed: number, kidHunger: number): number {
  const { w, thief, kid } = pair(seed);
  let snatches = 0;
  for (let t = 0; t < 10 * 600; t++) {
    thief.needs.hunger = 1;
    thief.needs.energy = 1;
    kid.needs.energy = 1;
    if (kid.behavior.state !== 'eat') kid.needs.hunger = kidHunger;
    // Keep them close together, and a fruit a few steps off.
    if (t % 200 === 0) {
      thief.pos = { x: kid.pos.x + 1.5, z: kid.pos.z };
      if (!w.items.some((i) => i.kind === 'fruit'))
        w.items.push({
          id: `f${t}`,
          kind: 'fruit',
          pos: { x: kid.pos.x + 2.5, z: kid.pos.z + 1.5 },
          y: 0,
        } as World['items'][number]);
    }
    for (const e of stepWorld(w, 100) as SimEvent[]) if (e.kind === 'snatched') snatches++;
  }
  return snatches;
}

describe('R0545 fruit snatching', () => {
  it('a mischievous adult snatches a hungry child’s fruit at least once in 10 seeds', () => {
    let total = 0;
    for (let s = 1; s <= 10; s++) total += run(s, 0.3);
    expect(total).toBeGreaterThanOrEqual(1);
  }, 60_000);

  it('never from a starving child', () => {
    let total = 0;
    for (let s = 1; s <= 10; s++) total += run(s, NEEDS.starvingThreshold * 0.5);
    expect(total).toBe(0);
  }, 60_000);

  it('the thief eats it after its run, and the child thinks less of it', () => {
    for (let s = 1; s <= 10; s++) {
      const { w, thief, kid } = pair(s);
      kid.friends = { thief: 40 };
      let ate = false;
      let snatched = false;
      for (let t = 0; t < 10 * 600 && !ate; t++) {
        thief.needs.hunger = 0.95;
        thief.needs.energy = 1;
        kid.needs.energy = 1;
        if (kid.behavior.state !== 'eat') kid.needs.hunger = 0.3;
        if (t % 200 === 0) {
          thief.pos = { x: kid.pos.x + 1.5, z: kid.pos.z };
          if (!w.items.some((i) => i.kind === 'fruit'))
            w.items.push({
              id: `f${t}`,
              kind: 'fruit',
              pos: { x: kid.pos.x + 2.5, z: kid.pos.z + 1.5 },
              y: 0,
            } as World['items'][number]);
        }
        for (const e of stepWorld(w, 100) as SimEvent[]) {
          if (e.kind === 'snatched') snatched = true;
          if (snatched && e.kind === 'ate' && e.nubbinId === 'thief') ate = true;
        }
      }
      if (!snatched) continue;
      expect(ate).toBe(true);
      expect(kid.friends?.['thief'] ?? 0).toBeLessThan(40);
      return;
    }
    throw new Error('no snatch in 10 seeds');
  }, 60_000);
});
