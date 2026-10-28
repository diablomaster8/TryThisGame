/**
 * Layout lint (R0034, MOVE-34): two Keeper-stopping solids closer than a Keeper can pass
 * (1 u) must overlap or be joined in `SLIVER_JOINS`, so no sliver traps a tap. The pond
 * counts as a solid. Also: the dojo–hill 3 gap and the well's crack are walked through.
 */
import { describe, expect, it } from 'vitest';
import { GROVE_COLLIDERS, SLIVER_JOINS, type Collider } from '../../src/config/grove-layout';
import { GROVE, SIM } from '../../src/config/tuning';
import { colliderReach, colliderTopY, contact } from '../../src/sim/obstacles';
import { applyCommand, createWorld, stepWorld } from '../../src/sim/world';

const POND: Collider = {
  id: 'pond',
  x: GROVE.pond.x,
  z: GROVE.pond.z,
  yaw: 0,
  shape: { type: 'circle', r: GROVE.pond.r },
  top: 0,
  flags: ['solid'],
};

const solids = [
  ...GROVE_COLLIDERS.filter(
    (c) =>
      !c.flags.includes('soft') && !c.flags.includes('nubbinOnly') && !c.id.startsWith('join-'),
  ),
  POND,
];

/** 'overlap', 'sliver' (a free point within 0.5 of both) or 'clear'. */
function pair(a: Collider, b: Collider): 'overlap' | 'sliver' | 'clear' {
  const ra = colliderReach(a) + 0.5;
  const rb = colliderReach(b) + 0.5;
  const x0 = Math.max(a.x - ra, b.x - rb);
  const x1 = Math.min(a.x + ra, b.x + rb);
  const z0 = Math.max(a.z - ra, b.z - rb);
  const z1 = Math.min(a.z + ra, b.z + rb);
  let sliver = false;
  for (let x = x0; x <= x1; x += 0.1)
    for (let z = z0; z <= z1; z += 0.1) {
      const ia = !!contact(a, x, z, 0);
      const ib = !!contact(b, x, z, 0);
      if (ia && ib) return 'overlap';
      if (!ia && !ib && contact(a, x, z, 0.5) && contact(b, x, z, 0.5)) sliver = true;
    }
  return sliver ? 'sliver' : 'clear';
}

describe('layout lint (MOVE-34)', () => {
  it('leaves no sliver between solids', () => {
    const joined = new Set(SLIVER_JOINS.map(([a, b]) => `${a}|${b}`));
    const bad: string[] = [];
    for (let i = 0; i < solids.length; i++)
      for (let j = i + 1; j < solids.length; j++) {
        const a = solids[i]!;
        const b = solids[j]!;
        if (Math.hypot(a.x - b.x, a.z - b.z) > colliderReach(a) + colliderReach(b) + 1) continue;
        if (joined.has(`${a.id}|${b.id}`) || joined.has(`${b.id}|${a.id}`)) continue;
        if (pair(a, b) === 'sliver') bad.push(`${a.id}–${b.id}`);
      }
    expect(bad).toEqual([]);
  });

  it('every join names two colliders that exist', () => {
    for (const [a, b] of SLIVER_JOINS) {
      expect(
        GROVE_COLLIDERS.some((c) => c.id === a),
        a,
      ).toBe(true);
      expect(
        GROVE_COLLIDERS.some((c) => c.id === b),
        b,
      ).toBe(true);
    }
  });

  it.each([
    [
      { x: 12, z: 2 },
      { x: 17.4, z: 0.1 },
    ],
    [
      { x: 12, z: 2 },
      { x: 20.3, z: -0.6 },
    ],
    [
      { x: 24, z: -1 },
      { x: 16, z: 0 },
    ],
  ])('walks the dojo–hill 3 gap from %o to %o', (from, to) => {
    const w = createWorld(1, 0);
    w.nubbins = [];
    w.keeper.pos = { ...from };
    applyCommand(w, { kind: 'moveKeeperTo', pos: to }, []);
    for (let s = 0; s < 400 && w.keeper.moveTarget; s++) stepWorld(w, SIM.stepMs);
    expect(w.keeper.moveTarget).toBeNull();
    expect(Math.hypot(w.keeper.pos.x - to.x, w.keeper.pos.z - to.z)).toBeLessThan(0.6);
  });

  it('a tap into the well–shore crack ends at once at the nearest open point', () => {
    const w = createWorld(1, 0);
    w.nubbins = [];
    w.keeper.pos = { x: 0, z: 6 };
    applyCommand(w, { kind: 'moveKeeperTo', pos: { x: 2.4, z: 9.1 } }, []);
    let s = 0;
    for (; s < 400 && w.keeper.moveTarget; s++) stepWorld(w, SIM.stepMs);
    expect(s).toBeLessThan(60);
  });
  it('a join leaves a standable rock standable (the Keeper stays on top)', () => {
    const rock = GROVE_COLLIDERS.find((c) => c.id === 'wild-14')!;
    const w = createWorld(1, 0);
    w.nubbins = [];
    w.keeper.pos = { x: rock.x, z: rock.z };
    w.keeper.y = colliderTopY(rock);
    w.keeper.grounded = true;
    for (let s = 0; s < 10; s++) stepWorld(w, SIM.stepMs);
    expect(Math.hypot(w.keeper.pos.x - rock.x, w.keeper.pos.z - rock.z)).toBeLessThan(0.05);
    expect(w.keeper.y).toBeCloseTo(colliderTopY(rock), 2);
  });
});
