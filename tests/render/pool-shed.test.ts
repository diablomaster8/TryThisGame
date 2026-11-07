import { describe, expect, it, vi } from 'vitest';
import { BufferGeometry, Float32BufferAttribute, Group } from 'three';

// R0456 (TECH-14, r12-d3): a person's look lets go of its CPU surfaces once its rig is built
// (one of each is ever on screen); a Nubbin look keeps them for the next hatchling.
vi.mock('../../src/render3d/art/species', () => ({
  buildSpecies: () => ({ group: new Group() }),
}));
vi.mock('../../src/render3d/looks', () => ({ specForKey: () => ({}), tintMods: () => [] }));
vi.mock('../../src/render3d/toon-outline', () => ({ addOutlines: () => {} }));

const { CreaturePool } = await import('../../src/render3d/creature-pool');

function surface(): BufferGeometry {
  const g = new BufferGeometry();
  g.setAttribute('position', new Float32BufferAttribute([0, 0, 0, 1, 1, 1, 2, 0, 1], 3));
  return g;
}

async function built(key: string) {
  const pool = new CreaturePool();
  const forgot: string[] = [];
  (pool as unknown as { farm: unknown }).farm = {
    surfaces: () => Promise.resolve([surface(), surface()]),
    surfaceCount: () => 2,
    forget: (k: string) => forgot.push(k),
    dispose: () => {},
    holdWrites: false,
    saveSoon: () => {},
  };
  const look = { key, height: 1 };
  pool.frame();
  pool.acquire(look);
  await Promise.resolve();
  await Promise.resolve();
  pool.frame();
  const rig = pool.acquire(look);
  pool.loaded();
  return { pool, rig, forgot };
}

describe('creature pool shed', () => {
  it("drops a villager's surfaces once its rig is out", async () => {
    const { pool, rig, forgot } = await built('keeper-sun~npc:marina');
    expect(rig).not.toBeNull();
    expect(pool.counts.looks).toBe(0);
    expect(forgot).toEqual(['keeper-sun~npc:marina']);
    // The coarse stand-in can still be placed from the kept shape.
    const shapes = (pool as unknown as { shapes: Map<string, unknown[]> }).shapes;
    expect(shapes.get('keeper-sun~npc:marina')).toHaveLength(2);
  });

  it("keeps a Nubbin look's surfaces for the next hatchling", async () => {
    const { pool, forgot } = await built('variant:child');
    expect(pool.counts.looks).toBe(1);
    expect(forgot).toEqual([]);
  });
});
