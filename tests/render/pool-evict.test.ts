import { describe, expect, it, vi } from 'vitest';
import { CreaturePool, evictionOrder, sculptRetryMs } from '../../src/render3d/creature-pool';

// The 3D creature pool frees old looks by recency instead of growing for ever (review
// 2026-10-18 B, Bug 14).
describe('creature pool eviction', () => {
  const used = new Map([
    ['child', 5],
    ['first-sun-swim', 2],
    ['look-fox', 9],
    ['visit-a', 1],
  ]);

  it('frees nothing under the cap', () => {
    expect(
      evictionOrder(
        [
          ['child', 2],
          ['look-fox', 1],
        ],
        used,
        3,
      ),
    ).toEqual([]);
  });

  it('frees the least recently used keys first, a key at a time', () => {
    const items = [
      ['child', 2],
      ['first-sun-swim', 3],
      ['look-fox', 1],
      ['visit-a', 2],
    ] as const;
    // 8 items, cap 4: visit-a (2) then first-sun-swim (3) go; child and look-fox stay.
    expect(evictionOrder(items, used, 4)).toEqual(['visit-a', 'first-sun-swim']);
  });

  it('a key never used counts as oldest', () => {
    expect(
      evictionOrder(
        [
          ['new', 1],
          ['child', 1],
        ],
        used,
        1,
      ),
    ).toEqual(['new']);
  });
});

// Review 2026-10-24: a look whose sculpt fails is not asked for again every frame.
describe('creature pool sculpt retries', () => {
  it('back off from 1 s, doubling, to a 60 s cap', () => {
    expect([1, 2, 3, 6, 7, 20].map(sculptRetryMs)).toEqual([1000, 2000, 4000, 32000, 60000, 60000]);
  });

  it('asks once per backoff and warns once', async () => {
    const pool = new CreaturePool();
    let asks = 0;
    (pool as unknown as { farm: unknown }).farm = {
      surfaces: () => {
        asks++;
        return Promise.reject(new Error('worker died'));
      },
      surfaceCount: () => 1,
      dispose: () => {},
    };
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const look = { key: 'variant:broken', height: 1 };
    for (let i = 0; i < 5; i++) {
      expect(pool.acquire(look)).toBeNull();
      await Promise.resolve();
      await Promise.resolve();
    }
    expect(asks).toBe(1);
    expect(warn).toHaveBeenCalledTimes(1);
    warn.mockRestore();
  });
});

// R0081 round 9: a hidden page drops the surfaces of looks no rig is using, and keeps the
// ones on screen (their stand-ins read them).
describe('creature pool trim', () => {
  it('drops unused looks and keeps the ones lent out', async () => {
    const { BufferGeometry, Group } = await import('three');
    const pool = new CreaturePool();
    const made: Record<string, InstanceType<typeof BufferGeometry>> = {};
    (pool as unknown as { farm: unknown }).farm = {
      surfaces: (key: string) => Promise.resolve([(made[key] = new BufferGeometry())]),
      surfaceCount: () => 1,
      forget: () => {},
      dispose: () => {},
    };
    for (const key of ['look-a', 'look-b']) expect(pool.acquire({ key, height: 1 })).toBeNull();
    await Promise.resolve();
    await Promise.resolve();
    expect(pool.isReady('look-a') && pool.isReady('look-b')).toBe(true);
    const group = new Group();
    group.userData.lookKey = 'look-a';
    const rig = { group } as unknown as Parameters<CreaturePool['release']>[1];
    pool.release('look-a', rig);
    expect(pool.acquire({ key: 'look-a', height: 1 })).toBe(rig);
    const freed = vi.spyOn(made['look-b']!, 'dispose');
    pool.trim();
    expect(pool.isReady('look-a')).toBe(true);
    expect(pool.isReady('look-b')).toBe(false);
    expect(freed).toHaveBeenCalled();
  });
});
