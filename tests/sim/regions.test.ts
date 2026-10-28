import { describe, expect, it } from 'vitest';
import { REGIONS, REGION_ORDER } from '../../src/config/regions';
import { LANDMARKS, SIM } from '../../src/config/tuning';
import { regionOf, regionsFound, travelBlock } from '../../src/sim/regions';
import { deserialize, serialize } from '../../src/sim/save';
import type { SimEvent, World } from '../../src/sim/types';
import { applyCommand, createWorld, stepWorld } from '../../src/sim/world';

function run(world: World, steps: number): void {
  for (let i = 0; i < steps; i++) stepWorld(world, SIM.stepMs);
}

describe('region graph (WORLD-04)', () => {
  it('every exit leads to a declared region, and every built region has a way home', () => {
    for (const id of REGION_ORDER) {
      const r = REGIONS[id];
      expect(r.id).toBe(id);
      for (const e of r.exits) expect(REGIONS[e.to]).toBeDefined();
      if (r.built && id !== 'grove') expect(r.exits.some((e) => e.to === 'grove')).toBe(true);
    }
    expect(REGION_ORDER.length).toBe(Object.keys(REGIONS).length);
  });

  it('every Grove landmark is a POI of the Grove', () => {
    const ids = REGIONS.grove.pois.map((p) => p.landmark);
    for (const l of LANDMARKS) expect(ids).toContain(l.id);
  });

  it('a fresh or old save is in the Grove', () => {
    const world = createWorld(1, 0);
    expect(regionOf(world.location)).toBe('grove');
    delete world.regionsFound;
    expect(regionsFound(world)).toEqual(['grove']);
    expect(regionOf('dungeon')).toBe('hollow');
    expect(regionOf('visit:fern')).toBe('lane');
  });

  it('travel to the lane and back leaves the Grove’s Nubbins as if the Keeper stayed', () => {
    const stay = createWorld(7, 0);
    const go = createWorld(7, 0);
    run(stay, 600);
    run(go, 600);
    const events: SimEvent[] = [];
    applyCommand(go, { kind: 'travel', exit: 'grove-gate', sub: 'visit:fern' }, events);
    expect(go.location).toBe('visit:fern');
    expect(events.some((e) => e.kind === 'regionDiscovered' && e.region === 'lane')).toBe(true);
    applyCommand(go, { kind: 'travel', exit: 'lane-gate' }, events);
    expect(go.location).toBe('grove');
    // Same spot and heading as the Keeper who stayed, so only the trip itself can differ.
    stay.keeper.pos = { ...go.keeper.pos };
    stay.keeper.facing = go.keeper.facing;
    run(stay, 1200);
    run(go, 1200);
    expect(JSON.stringify(go.nubbins)).toBe(JSON.stringify(stay.nubbins));
    expect(regionsFound(go)).toEqual(['grove', 'lane']);
  });

  it('refuses unbuilt regions, the cave stairs and unknown exits, with a reason', () => {
    const world = createWorld(2, 0);
    expect(travelBlock(world, 'grove-cave')).toBe('use-entrance');
    expect(travelBlock(world, 'nowhere')).toBe('no-exit');
    expect(travelBlock(world, 'grove-gate')).toBe('no-place');
    const events: SimEvent[] = [];
    applyCommand(world, { kind: 'travel', exit: 'nowhere' }, events);
    expect(events).toContainEqual({ kind: 'travelRefused', exit: 'nowhere', reason: 'no-exit' });
    const shore = {
      ...REGIONS,
      grove: { ...REGIONS.grove, exits: [{ ...REGIONS.grove.exits[0]!, to: 'shore' as const }] },
    };
    expect(travelBlock(world, 'grove-gate', undefined, shore)).toBe('unbuilt');
  });

  it('export and import keep the region and what was found', () => {
    const world = createWorld(4, 0);
    applyCommand(world, { kind: 'travel', exit: 'grove-gate', sub: 'visit:fern' }, []);
    const back = deserialize(serialize(world, 0)).world;
    expect(regionOf(back.location)).toBe('lane');
    expect(regionsFound(back)).toEqual(['grove', 'lane']);
  });
});
