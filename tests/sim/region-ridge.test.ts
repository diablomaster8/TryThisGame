import { describe, expect, it } from 'vitest';
import { REGIONS } from '../../src/config/regions';
import { regionLayout, walkableAt } from '../../src/config/region-layout';
import { RIDGE_SPEC } from '../../src/config/region-ridge';
import { SIM } from '../../src/config/tuning';
import { heightAt, terraceAt } from '../../src/sim/height';
import { planRegionWalk, seamlessOffset } from '../../src/sim/region-walk';
import { applyCommand, createWorld, stepWorld } from '../../src/sim/world';

// WORLD-36 (R11 d7): the ridge, a vertical region.
describe('the ridge (WORLD-36)', () => {
  const l = regionLayout(RIDGE_SPEC);
  const landing = REGIONS.grove.exits.find((e) => e.id === 'grove-ridge')!.arrive;

  it('climbs five terraces by the switchback only: every cliff is shut off the path', () => {
    expect(walkableAt(l, landing.x, landing.z)).toBe(true);
    // A cliff cell beside each ramp is not walkable; the ramp itself is.
    for (const [rampX, z] of [
      [14, 47],
      [-14, 19],
      [14, -9],
      [-14, -37],
    ] as const) {
      expect(walkableAt(l, rampX, z), `ramp ${rampX},${z}`).toBe(true);
      expect(walkableAt(l, -rampX, z), `cliff ${-rampX},${z}`).toBe(false);
    }
    for (const p of [
      { x: 0, z: -66 },
      { x: 22, z: -60 },
      { x: -18, z: 5 },
      { x: 22, z: -24 },
    ])
      expect(planRegionWalk(l, landing, p).length, `${p.x},${p.z}`).toBeGreaterThan(0);
  });

  it('answers the sim height field and terrace levels beyond the Grove', () => {
    expect(heightAt('region:ridge', 0, 70)).toBe(0);
    expect(heightAt('region:ridge', 0, -66)).toBe(10);
    expect(terraceAt('region:ridge', 0, 70)).toBe(0);
    expect(terraceAt('region:ridge', 0, 30)).toBe(1);
    expect(terraceAt('region:ridge', 0, -66)).toBe(4);
    expect(heightAt('region:shore', 0, 0)).toBe(0);
  });

  it('re-bases exactly across the east border, both ways', () => {
    const there = seamlessOffset(REGIONS.grove.exits.find((e) => e.id === 'grove-ridge')!);
    const back = seamlessOffset(REGIONS.ridge.exits.find((e) => e.id === 'ridge-stair')!);
    expect(there.x + back.x).toBeCloseTo(0);
    expect(there.z + back.z).toBeCloseTo(0);
  });

  it('walks from the summit down to the Grove in 45–60 s, rising and falling with the terraces', () => {
    const world = createWorld(12, 0);
    world.nubbins = [];
    world.keeper.pos = { x: 40, z: -24 };
    stepWorld(world, SIM.stepMs);
    world.keeper.input = { x: 1, z: 0 };
    for (let i = 0; i < 40 && world.location === 'grove'; i++) stepWorld(world, SIM.stepMs);
    world.keeper.input = { x: 0, z: 0 };
    expect(world.location).toBe('region:ridge');
    world.keeper.pos = { x: 0, z: -64 };
    stepWorld(world, SIM.stepMs);
    expect(world.keeper.y).toBe(10);
    applyCommand(world, { kind: 'moveKeeperTo', pos: { x: -31.9, z: 66 } }, []);
    let steps = 0;
    while (world.location !== 'grove' && steps < 1200) {
      stepWorld(world, SIM.stepMs);
      steps++;
    }
    const seconds = (steps * SIM.stepMs) / 1000;
    expect(world.location).toBe('grove');
    expect(seconds).toBeGreaterThanOrEqual(45);
    expect(seconds).toBeLessThanOrEqual(60);
  });
});
