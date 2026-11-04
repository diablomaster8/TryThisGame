import { describe, expect, it } from 'vitest';
import { REGIONS } from '../../src/config/regions';
import { regionLayout, terraceHeight, walkableAt } from '../../src/config/region-layout';
import { MOON_SPEC, SUN_SPEC } from '../../src/config/region-sunmoon';
import { SIM } from '../../src/config/tuning';
import { borderEdge } from '../../src/sim/border';
import { planRegionWalk } from '../../src/sim/region-walk';
import type { SimEvent, World } from '../../src/sim/types';
import { applyCommand, createWorld, stepWorld } from '../../src/sim/world';

function run(world: World, steps: number, events: SimEvent[] = []): SimEvent[] {
  for (let i = 0; i < steps; i++) events.push(...stepWorld(world, SIM.stepMs));
  return events;
}

// WORLD-34 (R11 d7): the Sun and Moon lands as real places.
describe('the Sun and Moon lands (WORLD-34)', () => {
  it('keeps each gate shut until the first adult of that alignment unlocks it', () => {
    const world = createWorld(5, 0);
    world.nubbins = [];
    const ev: SimEvent[] = [];
    applyCommand(world, { kind: 'travel', exit: 'grove-sun' }, ev);
    expect(world.location).toBe('grove');
    expect(ev).toContainEqual({ kind: 'travelRefused', exit: 'grove-sun', reason: 'locked' });
    expect(borderEdge(-46, -6, world).kind).toBe('notYet');
    world.unlocks.sunGrove = true;
    expect(borderEdge(-46, -6, world).kind).toBe('exit');
    applyCommand(world, { kind: 'travel', exit: 'grove-sun' }, []);
    expect(world.location).toBe('region:sunlands');
    expect(world.keeper.pos).toEqual(REGIONS.grove.exits.find((e) => e.id === 'grove-sun')!.arrive);
  });

  it('walking into the locked gate says why once and stays home', () => {
    const world = createWorld(6, 0);
    world.nubbins = [];
    world.keeper.pos = { x: -40, z: 6 };
    run(world, 2);
    world.keeper.input = { x: -1, z: 0 };
    const ev = run(world, 40);
    expect(world.location).toBe('grove');
    expect(ev.filter((e) => e.kind === 'exitReached')).toHaveLength(0);
    expect(ev.filter((e) => e.kind === 'travelRefused')).toHaveLength(1);
  });

  it('climbs the Sun lands’ terraces only by the path’s steps, carried up their height', () => {
    const l = regionLayout(SUN_SPEC);
    const gate = { x: 0, z: 33 };
    expect(walkableAt(l, gate.x, gate.z)).toBe(true);
    // The wall between the lawn and the fountain terrace is not walkable off the steps.
    expect(walkableAt(l, 20, 16)).toBe(false);
    expect(walkableAt(l, 0, 16)).toBe(true);
    for (const p of [
      { x: 0, z: 2 },
      { x: 0, z: -27 },
      { x: 26, z: 2 },
      { x: -28, z: -28 },
    ])
      expect(planRegionWalk(l, gate, p).length, `${p.x},${p.z}`).toBeGreaterThan(0);
    expect(terraceHeight(SUN_SPEC, 30)).toBe(0);
    expect(terraceHeight(SUN_SPEC, 0)).toBe(1.4);
    expect(terraceHeight(SUN_SPEC, -30)).toBe(2.8);
    expect(terraceHeight(SUN_SPEC, 16)).toBeCloseTo(0.7);
    // Walked up the ramp, the Keeper rises with it.
    const world = createWorld(7, 0);
    world.nubbins = [];
    world.unlocks.sunGrove = true;
    applyCommand(world, { kind: 'travel', exit: 'grove-sun' }, []);
    applyCommand(world, { kind: 'moveKeeperTo', pos: { x: 0, z: 2.5 } }, []);
    run(world, 160);
    expect(world.keeper.pos.z).toBeLessThan(10);
    expect(world.keeper.y).toBeCloseTo(1.4);
  });

  it('rings the Moon lands’ lake with a walk, out along the jetty, and back through the gate', () => {
    const l = regionLayout(MOON_SPEC);
    const gate = { x: 0, z: 33 };
    expect(walkableAt(l, 0, -4)).toBe(false);
    for (const p of [
      { x: 0, z: 7 },
      { x: 0, z: -26 },
      { x: -28, z: 22 },
      { x: 28, z: -24 },
      { x: 28, z: 22 },
    ])
      expect(planRegionWalk(l, gate, p).length, `${p.x},${p.z}`).toBeGreaterThan(0);
    const world = createWorld(8, 0);
    world.nubbins = [];
    world.unlocks.moonGrove = true;
    applyCommand(world, { kind: 'travel', exit: 'grove-moon' }, []);
    expect(world.location).toBe('region:moonlands');
    applyCommand(world, { kind: 'moveKeeperTo', pos: { x: 0, z: 39 } }, []);
    const ev = run(world, 60);
    expect(ev.some((e) => e.kind === 'exitReached' && e.exit === 'moon-gate')).toBe(true);
  });
});
