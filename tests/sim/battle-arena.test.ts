import { describe, expect, it } from 'vitest';
import { arenaAt, arenaBlocked, bounce, knockback, lunge } from '../../src/sim/battle/arena';
import { canStep, combatOf, sampleBoard } from '../../src/sim/battle/tactics/grid';
import { contact, obstacles } from '../../src/sim/obstacles';
import { createWorld } from '../../src/sim/world';

/** Arena edges and knockback (recs MOVE-62) and the grid's Jump and Move (MOVE-61). */
describe('the battle arena (MOVE-62)', () => {
  const world = createWorld(1, 0);
  const cottage = obstacles(world).find((c) => c.id === 'cottage')!;
  const centre = { x: cottage.x, z: cottage.z + 4 };
  const arena = arenaAt(world, centre);

  it('holds the cottage', () => {
    expect(cottage).toBeDefined();
    expect(arena.colliders).toContain(cottage);
  });

  it('a lunge across the cottage stops before it, never inside', () => {
    for (let i = 0; i < 24; i++) {
      const ang = (i / 24) * Math.PI * 2;
      const from = { x: cottage.x + Math.cos(ang) * 6, z: cottage.z + Math.sin(ang) * 6 };
      const to = { x: cottage.x - Math.cos(ang) * 6, z: cottage.z - Math.sin(ang) * 6 };
      if (arenaBlocked(arena, from)) continue;
      const end = lunge(arena, from, to);
      expect(contact(cottage, end.x, end.z, 0.4)).toBeNull();
      // Nowhere on the path walked is inside the cottage.
      for (let t = 0; t <= 1; t += 0.02) {
        const x = from.x + (end.x - from.x) * t;
        const z = from.z + (end.z - from.z) * t;
        expect(contact(cottage, x, z, 0.39)).toBeNull();
      }
    }
  });

  it('knockback slides along the cottage and the edge, and a thrown move bounces off', () => {
    for (let i = 0; i < 24; i++) {
      const ang = (i / 24) * Math.PI * 2;
      const p = { x: cottage.x + Math.cos(ang) * 5, z: cottage.z + Math.sin(ang) * 5 };
      if (arenaBlocked(arena, p)) continue;
      const end = knockback(arena, p, { x: -Math.cos(ang), z: -Math.sin(ang) }, 8);
      expect(arenaBlocked(arena, end, 0.39)).toBe(false);
      const fly = bounce(arena, p, { x: -Math.cos(ang) * 6, z: -Math.sin(ang) * 6 }, 3);
      expect(arenaBlocked(arena, fly.at, 0.19)).toBe(false);
    }
    const far = knockback(arena, centre, { x: 0, z: 1 }, 50);
    expect(Math.hypot(far.x - centre.x, far.z - centre.z)).toBeLessThanOrEqual(arena.r);
  });
});

describe('the tactical grid (MOVE-61)', () => {
  it('Jump and Move follow Run', () => {
    expect(combatOf({ swim: 0, fly: 0, run: 0, power: 0, stamina: 0 })).toEqual({
      jump: 1,
      move: 3,
    });
    expect(combatOf({ swim: 0, fly: 0, run: 99, power: 0, stamina: 0 })).toEqual({
      jump: 4,
      move: 6,
    });
  });

  it('samples a board into whole height levels', () => {
    const b = sampleBoard((x) => (x > 0 ? 1.1 : 0), 0, 0, 4);
    expect(b.heights).toEqual([0, 0, 2, 2, 0, 0, 2, 2, 0, 0, 2, 2, 0, 0, 2, 2]);
    expect(canStep(b, 1, 2, 1)).toBe(false);
    expect(canStep(b, 1, 2, 2)).toBe(true);
    expect(createWorld(1, 0).nubbins[0]!.combat).toBeUndefined();
  });
});
