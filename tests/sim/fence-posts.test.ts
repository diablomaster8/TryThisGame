/**
 * The path's fence posts are in the shared collider table (R0004, MOVE-01): every post both
 * views draw has a collider at its spot, every fence collider is a drawn post, and a laid
 * fence keeps a walker out of its posts while leaving the gaps between them open.
 */
import { describe, expect, it } from 'vitest';
import {
  FENCE_POSTS,
  fencePostCollider,
  fencePostSpots,
  GROVE_COLLIDERS,
} from '../../src/config/grove-layout';
import { contact } from '../../src/sim/obstacles';
import { fenceSpots } from '../../src/render/scenery';

describe('fence posts in the shared layout (R0004)', () => {
  it('draws exactly the posts the sim collides', () => {
    const drawn = fenceSpots();
    expect(drawn).toEqual(FENCE_POSTS.map((p) => ({ x: p.x, z: p.z })));
    const fence = GROVE_COLLIDERS.filter((c) => c.id.startsWith('fence-post-'));
    expect(fence.length).toBe(drawn.length);
    for (const p of drawn)
      expect(fence.some((c) => Math.hypot(c.x - p.x, c.z - p.z) < 1e-9)).toBe(true);
  });

  it('a laid path fence blocks at each post and leaves the gaps walkable', () => {
    const posts = fencePostSpots({ x: 0, z: 0 }, { x: 10, z: 0 });
    expect(posts.length).toBeGreaterThan(10);
    const cs = posts.map(fencePostCollider);
    for (const c of cs) expect(contact(c, c.x + 0.3, c.z, 0.35)).not.toBeNull();
    // Halfway between two neighbouring posts on one side, a Keeper (r 0.35) fits.
    const mid = { x: (posts[0]!.x + posts[2]!.x) / 2, z: (posts[0]!.z + posts[2]!.z) / 2 };
    expect(cs.some((c) => contact(c, mid.x, mid.z, 0.35) !== null)).toBe(false);
    expect(new Set(cs.map((c) => c.id)).size).toBe(cs.length);
  });
});
