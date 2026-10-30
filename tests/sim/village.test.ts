import { describe, expect, it } from 'vitest';
import { SIM } from '../../src/config/tuning';
import { VILLAGE, villageColliders } from '../../src/config/region-village';
import { obstacles } from '../../src/sim/obstacles';
import { villageBuildings, villageDressing, villageRecruits } from '../../src/sim/village';
import type { World } from '../../src/sim/types';
import { createWorld, stepWorld } from '../../src/sim/world';

/** R0095 (WORLD-32): the village square grows with prosperity. */
function at(prosperity: number, recruits = 0): World {
  const world = createWorld(5, 0);
  stepWorld(world, SIM.stepMs);
  world.town.prosperity = prosperity;
  const roles = ['stall', 'gym', 'attendant', 'fortune', 'festival', 'guard'] as const;
  for (let i = 0; i < recruits; i++)
    world.town.recruits.push({ name: `R${i}`, species: 'nubbin', role: roles[i % 6]!, atMs: 0 });
  return world;
}

describe('the village square (R0095)', () => {
  it('stands 0, 2 and 5 service buildings at prosperity 0, 40 and 100', () => {
    expect(villageBuildings(at(0))).toHaveLength(0);
    expect(villageBuildings(at(40)).map((b) => b.id)).toEqual(['stall', 'gym']);
    expect(villageBuildings(at(100))).toHaveLength(5);
  });

  it('hangs one dressing set per 20 prosperity', () => {
    expect(villageDressing(at(0))).toBe(0);
    expect(villageDressing(at(39))).toBe(1);
    expect(villageDressing(at(100))).toBe(VILLAGE.dressing.length);
    expect(villageDressing(at(120))).toBe(VILLAGE.dressing.length);
  });

  it('gives every recruit a place by its loop, the same after a reload, clear of buildings', () => {
    const world = at(100, 8);
    const a = villageRecruits(world, 12_345);
    const b = villageRecruits(JSON.parse(JSON.stringify(world)) as World, 12_345);
    expect(a).toEqual(b);
    expect(a).toHaveLength(8);
    for (const r of a) {
      expect(Number.isFinite(r.pos.x) && Number.isFinite(r.pos.z)).toBe(true);
      // Within the square's reach, and never inside a building's footprint.
      expect(Math.hypot(r.pos.x - VILLAGE.square.x, r.pos.z - VILLAGE.square.z)).toBeLessThan(
        VILLAGE.square.r + 1,
      );
      for (const bd of VILLAGE.buildings) {
        const dx = r.pos.x - bd.x;
        const dz = r.pos.z - bd.z;
        const lx = dx * Math.cos(bd.yaw) - dz * Math.sin(bd.yaw);
        const lz = dx * Math.sin(bd.yaw) + dz * Math.cos(bd.yaw);
        expect(Math.abs(lx) < bd.hw && Math.abs(lz) < bd.hd).toBe(false);
      }
    }
  });

  it('blocks walkers only at buildings that stand', () => {
    const ids = (w: World) => obstacles(w).map((c) => c.id);
    const village = villageColliders().map((c) => c.id);
    expect(ids(at(0)).filter((id) => village.includes(id))).toEqual([]);
    expect(ids(at(40)).filter((id) => village.includes(id))).toEqual([
      'village-stall',
      'village-gym',
    ]);
    expect(ids(at(100)).filter((id) => village.includes(id))).toHaveLength(5);
  });
});
