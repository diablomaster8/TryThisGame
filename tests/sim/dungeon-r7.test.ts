import { afterEach, describe, expect, it } from 'vitest';
import { DUNGEON, SIM } from '../../src/config/tuning';
import { HOLLOW_R7 } from '../../src/config/tuning-dungeon';
import { cellCentre, isWalkable, runFloor } from '../../src/sim/dungeon';
import { setEncounterHandler, swimFamily } from '../../src/sim/dungeon-encounters';
import { hatch } from '../../src/sim/lifecycle';
import type { SimEvent, World } from '../../src/sim/types';
import { applyCommand, createWorld, stepWorld } from '../../src/sim/world';

// Lane B round 7: aggro telegraph and leash (R0200).

function underground(seed = 8): World {
  const world = createWorld(seed, 0);
  const events: SimEvent[] = [];
  for (const n of world.nubbins) hatch(n, events, 0);
  applyCommand(world, { kind: 'enterDungeon', daily: false }, events);
  world.dungeon!.graceUntilMs = 0;
  return world;
}

function step(world: World, ms: number): SimEvent[] {
  const out: SimEvent[] = [];
  for (let t = 0; t < ms; t += SIM.stepMs) out.push(...stepWorld(world, SIM.stepMs));
  return out;
}

afterEach(() => setEncounterHandler(null));

describe('aggro and leash (R0200)', () => {
  it('a walking Keeper who strolls into a pack is caught within 6 s', () => {
    for (const seed of [8, 9, 10]) {
      const world = underground(seed);
      const f = runFloor(world)!;
      const spec = f.packs![0]!;
      const home = cellCentre(f, spec.cell);
      const pack = world.dungeon!.packs!.find((p) => p.id === spec.id)!;
      // Start on open floor three cells off, in whichever direction has some.
      const off = [
        [3, 0],
        [-3, 0],
        [0, 3],
        [0, -3],
        [2, 2],
        [-2, -2],
      ].find(([dx, dy]) => isWalkable(f, spec.cell.x + dx!, spec.cell.y + dy!))!;
      world.keeper.pos = cellCentre(f, { x: spec.cell.x + off[0]!, y: spec.cell.y + off[1]! });
      pack.pos = { ...home };
      delete pack.asleep;
      world.keeper.running = false;
      world.keeper.moveTarget = { ...home };
      let caught = -1;
      setEncounterHandler(() => {
        caught = world.timeMs;
        return null;
      });
      const t0 = world.timeMs;
      for (let t = 0; t < 6000 && caught < 0; t += SIM.stepMs) stepWorld(world, SIM.stepMs);
      expect(caught).toBeGreaterThanOrEqual(0);
      expect(caught - t0).toBeLessThanOrEqual(6000);
    }
  });

  it('a running Keeper always gets away: the pack gives up after its chase and shows a "?"', () => {
    const world = underground();
    const f = runFloor(world)!;
    const spec = f.packs![0]!;
    const pack = world.dungeon!.packs!.find((p) => p.id === spec.id)!;
    const home = cellCentre(f, spec.cell);
    pack.pos = { ...home };
    world.keeper.pos = { x: home.x + 2 * DUNGEON.cell, z: home.z };
    setEncounterHandler(() => {
      throw new Error('caught');
    });
    step(world, 200);
    expect(pack.state).toBe('chase');
    // Run ahead of it: the Keeper's run is faster than the chase, so keep the gap it opens.
    let gap = 3;
    for (let t = 0; t < 9000; t += SIM.stepMs) {
      const dx = world.keeper.pos.x - pack.pos.x;
      const dz = world.keeper.pos.z - pack.pos.z;
      const d = Math.hypot(dx, dz) || 1;
      gap = Math.max(gap, d);
      world.keeper.pos = { x: pack.pos.x + (dx / d) * gap, z: pack.pos.z + (dz / d) * gap };
      stepWorld(world, SIM.stepMs);
      if (pack.state !== 'chase') break;
    }
    expect(pack.state).toBe('home');
    expect(pack.gaveUpMs).toBeDefined();
    // It doesn't turn straight round on the way home.
    world.keeper.pos = { ...pack.pos };
    world.keeper.pos.x += 0.5 * DUNGEON.cell;
    const later = step(world, HOLLOW_R7.aggro.ignoreMs - 500);
    expect(later.some((e) => e.kind === 'packNoticed')).toBe(false);
  });

  it('a Shy party Nubbin keeps the party a cell further from notice', () => {
    const at = (shy: boolean): boolean => {
      const world = underground();
      if (shy) for (const n of world.nubbins) n.personality = 'shy';
      const f = runFloor(world)!;
      const spec = f.packs![0]!;
      const home = cellCentre(f, spec.cell);
      const pack = world.dungeon!.packs!.find((p) => p.id === spec.id)!;
      pack.pos = { ...home };
      delete pack.asleep;
      world.keeper.pos = { x: home.x, z: home.z + (spec.aggroRadius - 0.5) * DUNGEON.cell };
      setEncounterHandler(() => null);
      const pos = { ...world.keeper.pos };
      let noticed = false;
      for (let t = 0; t < 400; t += SIM.stepMs) {
        world.keeper.pos = { ...pos };
        pack.pos = { ...home };
        noticed ||= stepWorld(world, SIM.stepMs).some((e) => e.kind === 'packNoticed');
      }
      return noticed;
    };
    expect(at(false)).toBe(true);
    expect(at(true)).toBe(false);
  });

  it('only swim-type families chase through water', () => {
    expect(swimFamily('penguinling')).toBe(true);
    expect(swimFamily('no-such-family')).toBe(false);
  });
});
