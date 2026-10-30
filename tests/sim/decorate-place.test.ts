import { describe, expect, it } from 'vitest';
import { DECOR, GROVE } from '../../src/config/tuning';
import { decorCollider } from '../../src/config/grove-layout';
import { contact, obstacles } from '../../src/sim/obstacles';
import { placeDecor, placeRefusal } from '../../src/sim/decorate';
import { Rng } from '../../src/sim/rng';
import { riverDistance } from '../../src/sim/terrain';
import { createWorld } from '../../src/sim/world';
import type { DecorKind } from '../../src/sim/types';

// MOVE-05: nothing is placed inside a hill, a house, a rock, the stream or a walker.
const KINDS = Object.keys(DECOR.prices) as DecorKind[];

describe('decor placement (MOVE-05)', () => {
  for (const kind of KINDS) {
    it(`2,000 random ${kind} placements never overlap a collider or the water`, () => {
      const world = createWorld(3, 0);
      const rng = new Rng(kind.length * 97 + 1);
      const fixed = obstacles(world);
      const half = GROVE.size / 2;
      let placed = 0;
      for (let i = 0; i < 2000; i++) {
        const pos = { x: (rng.next() * 2 - 1) * half, z: (rng.next() * 2 - 1) * half };
        const yaw = Math.floor(rng.next() * 8) * (Math.PI / 4);
        if (placeRefusal(world, kind, pos, yaw)) continue;
        placed++;
        // Check the accepted footprint at random points, independently of the sampler.
        const mine = decorCollider('x', kind, pos.x, pos.z, yaw);
        for (let j = 0; j < 40; j++) {
          const p = { x: pos.x + (rng.next() * 2 - 1) * 3, z: pos.z + (rng.next() * 2 - 1) * 3 };
          const inMine = mine
            ? !!contact(mine, p.x, p.z, 0)
            : Math.hypot(p.x - pos.x, p.z - pos.z) < 0.2;
          if (!inMine) continue;
          for (const c of fixed)
            if (Math.hypot(c.x - p.x, c.z - p.z) < 12)
              expect(contact(c, p.x, p.z, 0), `${kind} in ${c.id}`).toBeNull();
          expect(riverDistance(p.x, p.z)).toBeGreaterThan(GROVE.river.width / 2);
        }
      }
      expect(placed).toBeGreaterThan(50);
    });
  }

  it('refuses a piece on the Keeper, so placing never has to move it', () => {
    const world = createWorld(3, 0);
    world.inventory.decor.statue = 1;
    const k = { ...world.keeper.pos };
    expect(placeRefusal(world, 'statue', k)).toBe('someone');
    const events: Parameters<typeof placeDecor>[3] = [];
    expect(placeDecor(world, 'statue', k, events)).toBe(false);
    expect(events.some((e) => e.kind === 'decorRefused')).toBe(true);
    expect(world.keeper.pos).toEqual(k);
  });

  it('refuses the cottage, a hill and the stream by reason', () => {
    const world = createWorld(3, 0);
    const c = GROVE.buildings.cottage;
    expect(placeRefusal(world, 'statue', { x: c.x + 1, z: c.z })).toBe('solid');
    const h = GROVE.hills[0];
    expect(placeRefusal(world, 'bench', { x: h.x, z: h.z })).toBe('solid');
    expect(placeRefusal(world, 'fence', { x: 11, z: 20 })).toBe('water');
  });

  it('R0003: refuses a piece on a planted crop', () => {
    const world = createWorld(3, 0);
    let at = { x: 0, z: 0 };
    for (let i = 0; i < 400 && placeRefusal(world, 'statue', at) !== null; i++)
      at = { x: (i % 20) * 2 - 20, z: Math.floor(i / 20) * 2 - 20 };
    expect(placeRefusal(world, 'statue', at)).toBe(null);
    world.plants.push({
      id: 'crop-1',
      kind: 'crop',
      flavor: 'run',
      pos: { ...at },
      plantedMs: 0,
      water: 1,
      stage: 1,
      fruitTimerMs: 0,
      ripe: false,
    });
    expect(placeRefusal(world, 'statue', at)).toBe('crop');
  });
});
