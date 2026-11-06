import { describe, expect, it } from 'vitest';
import { cosmetic } from '../../src/config/cosmetics';
import { ETERNAL_LOOK, evolve } from '../../src/sim/lifecycle';
import { createEgg } from '../../src/sim/nubbin';
import { Rng } from '../../src/sim/rng';
import type { SimEvent } from '../../src/sim/types';
import { createWorld } from '../../src/sim/world';

/** R0414 (LOOK-38): becoming Eternal unlocks the band's classic character look, once. */
function evolved(alignment: number, rebirths: number, lean: Partial<Record<string, number>> = {}) {
  const world = createWorld(5, 0);
  const n = createEgg('e', { x: 0, z: 0 }, Rng.fromSeed(1));
  n.rebirths = rebirths;
  n.alignment = alignment;
  Object.assign(n.typeLean, lean);
  const events: SimEvent[] = [];
  evolve(n, events, world);
  return { world, n, events };
}

const unlocks = (events: SimEvent[]) => events.filter((e) => e.kind === 'lookUnlocked');

describe('the Eternal looks', () => {
  it('registers all three as character looks', () => {
    for (const id of Object.values(ETERNAL_LOOK)) {
      expect(cosmetic(id)?.source).toBe('eternal');
      expect(id.startsWith('look-')).toBe(true);
    }
  });

  it.each([
    [0.95, 'sun', 'look-angel'],
    [-0.95, 'moon', 'look-devil'],
    [0.02, 'neutral', 'look-chaos'],
  ] as const)('an Eternal at alignment %s unlocks exactly %s', (alignment, band, look) => {
    const { world, n, events } = evolved(alignment, 2);
    expect(n.eternal).toBe(band);
    const found = unlocks(events);
    expect(found).toHaveLength(1);
    expect(found[0]).toMatchObject({ nubbinId: n.id, look });
    const added = world.inventory.hats.filter((h) => h.startsWith('look-'));
    expect(added).toEqual([look]);
  });

  it('never duplicates a look it already owns, and says nothing the second time', () => {
    const first = evolved(0.95, 2);
    const again = createEgg('f', { x: 0, z: 0 }, Rng.fromSeed(2));
    again.rebirths = 2;
    again.alignment = 0.95;
    const events: SimEvent[] = [];
    evolve(again, events, first.world);
    expect(again.eternal).toBe('sun');
    expect(unlocks(events)).toHaveLength(0);
    expect(first.world.inventory.hats.filter((h) => h === 'look-angel')).toHaveLength(1);
  });

  it('a Nubbin that does not become Eternal unlocks nothing', () => {
    for (const [alignment, rebirths, lean] of [
      [0.95, 1, {}],
      [0.5, 2, {}],
      [0.95, 2, { swim: 400 }],
    ] as const) {
      const { world, n, events } = evolved(alignment, rebirths, lean);
      expect(n.eternal).toBeNull();
      expect(unlocks(events)).toHaveLength(0);
      expect(world.inventory.hats.some((h) => h.startsWith('look-'))).toBe(false);
    }
  });

  it('works without a world (no unlock, no crash)', () => {
    const n = createEgg('g', { x: 0, z: 0 }, Rng.fromSeed(3));
    n.rebirths = 2;
    n.alignment = 0.95;
    const events: SimEvent[] = [];
    evolve(n, events);
    expect(n.eternal).toBe('sun');
    expect(unlocks(events)).toHaveLength(0);
  });
});
