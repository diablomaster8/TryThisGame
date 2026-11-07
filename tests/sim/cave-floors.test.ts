import { describe, expect, it } from 'vitest';
import { CAVE_WAYS } from '../../src/config/tuning-r17d1';
import { REGIONS } from '../../src/config/regions';
import { SIM } from '../../src/config/tuning';
import { caveBack } from '../../src/sim/cave-entrances';
import { cellCentre, floorOfRun } from '../../src/sim/dungeon';
import { startCampaign } from '../../src/sim/campaign';
import { hatch } from '../../src/sim/lifecycle';
import { crossExits } from '../../src/sim/region-walk';
import type { SimEvent } from '../../src/sim/types';
import { applyCommand, createWorld, stepWorld } from '../../src/sim/world';

// R0115 (WORLD-38, R17 d1): real cave floors behind the paired `stairs` ways.
function ridgeWorld() {
  const world = createWorld(21, 0);
  const ev: SimEvent[] = [];
  for (const n of world.nubbins) hatch(n, ev, 0);
  applyCommand(world, { kind: 'travel', exit: 'grove-ridge' }, ev);
  expect(world.location).toBe('region:ridge');
  return world;
}

describe('cave floors (R0115)', () => {
  it('has a cave region way back for every cave way', () => {
    for (const [mouth, def] of Object.entries(CAVE_WAYS)) {
      const back = REGIONS.caves.exits.find((e) => e.id === def.back);
      expect(back, mouth).toBeDefined();
      expect(caveBack(def)).toBe(back);
    }
  });

  it('walking into the ice caves’ mouth raises the way, and it opens onto floor 1', () => {
    const world = ridgeWorld();
    const mouth = REGIONS.ridge.exits.find((e) => e.id === 'ridge-ice')!;
    world.keeper.pos = { x: 22, z: -57 };
    crossExits(world, []);
    world.keeper.pos = { x: mouth.rect.x + 2, z: mouth.rect.z + 3 };
    const ev: SimEvent[] = [];
    crossExits(world, ev);
    expect(ev.some((e) => e.kind === 'exitReached' && e.exit === 'ridge-ice')).toBe(true);
    applyCommand(world, { kind: 'travel', exit: 'ridge-ice' }, ev);
    expect(world.location).toBe('dungeon');
    const run = world.dungeon!;
    expect(run.cave).toMatchObject({ id: 'ice', from: 'ridge', floors: 2 });
    const f = floorOfRun(run);
    expect(f.stairsDown).not.toBeNull();
    expect(ev.some((e) => e.kind === 'dungeonEntered' && e.cave === 'ice')).toBe(true);
  });

  it('leaving by Leave puts the Keeper at the way’s pair, facing away from the mouth', () => {
    const world = ridgeWorld();
    const ev: SimEvent[] = [];
    applyCommand(world, { kind: 'travel', exit: 'ridge-ice' }, ev);
    const runsBefore = world.hollow.runs;
    applyCommand(world, { kind: 'leaveDungeon' }, ev);
    const back = REGIONS.caves.exits.find((e) => e.id === 'caves-ice')!;
    expect(world.location).toBe('region:ridge');
    expect(world.dungeon).toBeNull();
    expect(world.keeper.pos).toEqual(back.arrive);
    expect(world.keeper.facing).toBe(back.facing);
    // A small cave is not a Hollow trip.
    expect(world.hollow.runs).toBe(runsBefore);
    // Standing out in the open: no exit is raised until the Keeper walks in again.
    const again: SimEvent[] = [];
    crossExits(world, again);
    expect(again).toEqual([]);
  });

  it('goes down a floor, and the last floor’s stairs lead back out', () => {
    const world = ridgeWorld();
    const ev: SimEvent[] = [];
    applyCommand(world, { kind: 'travel', exit: 'ridge-ice' }, ev);
    const run = world.dungeon!;
    const down = (): void => {
      const f = floorOfRun(run);
      const c = f.stairsDown!;
      world.keeper.pos = cellCentre(f, c);
      applyCommand(world, { kind: 'dungeonGo', to: 'down' }, ev);
      for (let t = 0; t < 400; t += SIM.stepMs) stepWorld(world, SIM.stepMs);
    };
    down();
    expect(world.location).toBe('dungeon');
    expect(world.dungeon!.depth).toBe(2);
    down();
    expect(world.location).toBe('region:ridge');
    const back = REGIONS.caves.exits.find((e) => e.id === 'caves-ice')!;
    expect(world.keeper.pos).toEqual(back.arrive);
    expect(world.hollow.best).toBe(0);
  });

  it('keeps the ruins’ door shut until it thaws, then opens onto the door cave', () => {
    const world = createWorld(22, 0);
    const ev: SimEvent[] = [];
    for (const n of world.nubbins) hatch(n, ev, 0);
    applyCommand(world, { kind: 'travel', exit: 'grove-wood' }, ev);
    applyCommand(world, { kind: 'travel', exit: 'wood-ruins' }, ev);
    applyCommand(world, { kind: 'travel', exit: 'ruins-door' }, ev);
    expect(world.location).toBe('region:ruins');
    startCampaign(world, ev);
    world.campaign!.chapter = 10;
    applyCommand(world, { kind: 'travel', exit: 'ruins-door' }, ev);
    expect(world.location).toBe('dungeon');
    expect(world.dungeon!.cave).toMatchObject({ id: 'door', from: 'ruins', floors: 1 });
    applyCommand(world, { kind: 'leaveDungeon' }, ev);
    const back = REGIONS.caves.exits.find((e) => e.id === 'caves-door')!;
    expect(world.location).toBe('region:ruins');
    expect(world.keeper.pos).toEqual(back.arrive);
    expect(world.keeper.facing).toBe(back.facing);
  });
});
