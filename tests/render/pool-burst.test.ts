import { describe, expect, it, vi } from 'vitest';
import { Group } from 'three';

// R0456 (lane D r10): while the loading veil is up, a look whose rig is still compiling is
// not built again every frame (the Keeper's look used to come out with ten spare rigs).
vi.mock('../../src/samples/species', () => ({
  buildSpecies: () => ({ group: new Group() }),
}));
vi.mock('../../src/render3d/looks', () => ({ specForKey: () => ({}), tintMods: () => [] }));
vi.mock('../../src/render3d/toon-outline', () => ({ addOutlines: () => {} }));

const { CreaturePool } = await import('../../src/render3d/creature-pool');

async function poolWithSurfaces() {
  const { BufferGeometry } = await import('three');
  const pool = new CreaturePool();
  (pool as unknown as { farm: unknown }).farm = {
    surfaces: () => Promise.resolve([new BufferGeometry()]),
    surfaceCount: () => 1,
    forget: () => {},
    dispose: () => {},
    holdWrites: false,
    saveSoon: () => {},
  };
  let builds = 0;
  const done: Array<() => void> = [];
  pool.compile = () => {
    builds++;
    return new Promise<void>((r) => done.push(r));
  };
  return { pool, builds: () => builds, done };
}

describe('creature pool burst', () => {
  it('builds one rig a look per creature waiting, not one a frame', async () => {
    const { pool, builds } = await poolWithSurfaces();
    const look = { key: 'variant:child', height: 1 };
    pool.frame();
    expect(pool.acquire(look)).toBeNull();
    await Promise.resolve();
    await Promise.resolve();
    for (let f = 0; f < 10; f++) {
      pool.frame();
      expect(pool.acquire(look)).toBeNull();
    }
    expect(builds()).toBe(1);
  });

  it('two creatures of one look get two rigs', async () => {
    const { pool, builds } = await poolWithSurfaces();
    const look = { key: 'variant:child', height: 1 };
    pool.frame();
    pool.acquire(look);
    await Promise.resolve();
    await Promise.resolve();
    for (let f = 0; f < 5; f++) {
      pool.frame();
      pool.acquire(look);
      pool.acquire(look);
    }
    expect(builds()).toBe(2);
  });

  it('a finished compile hands its rig to the next ask', async () => {
    const { pool, done } = await poolWithSurfaces();
    const look = { key: 'variant:child', height: 1 };
    pool.frame();
    pool.acquire(look);
    await Promise.resolve();
    await Promise.resolve();
    pool.frame();
    expect(pool.acquire(look)).toBeNull();
    done[0]!();
    await Promise.resolve();
    await Promise.resolve();
    pool.frame();
    expect(pool.acquire(look)).not.toBeNull();
  });
});
