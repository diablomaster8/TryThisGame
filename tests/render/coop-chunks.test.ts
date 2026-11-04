import { describe, expect, it } from 'vitest';
import { WORLD_STREAM } from '../../src/config/tuning-world';
import { chunkKey, chunkOf, chunksAround } from '../../src/render/chunks';
import { secondKeeperApart, withSecondKeeper } from '../../src/render/coop-chunks';

describe('co-op chunk rings (R0140)', () => {
  const k1 = { x: 0, z: 0 };
  const base = chunksAround(chunkOf(k1.x, k1.z), WORLD_STREAM.rings);

  it('keeps both Keepers rings with no chunk twice', () => {
    const k2 = { x: 40, z: 0 };
    const all = withSecondKeeper(base, k2);
    const keys = all.map(chunkKey);
    expect(new Set(keys).size).toBe(keys.length);
    for (const c of base) expect(keys).toContain(chunkKey(c));
    for (const c of chunksAround(chunkOf(k2.x, k2.z), WORLD_STREAM.rings))
      expect(keys).toContain(chunkKey(c));
  });

  it('is just the first Keepers set when alone, and a close pair is not drawn twice', () => {
    expect(withSecondKeeper(base, null)).toEqual(base);
    expect(secondKeeperApart(k1, { x: 3, z: 1 })).toBe(false);
    expect(secondKeeperApart(k1, { x: 40, z: 0 })).toBe(true);
  });
});
