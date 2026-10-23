import { describe, expect, it } from 'vitest';
import { runFloor } from '../../src/sim/dungeon';
import { deserialize, serialize, validateWorld } from '../../src/sim/save';
import { storyHome } from '../../src/sim/storyline';
import {
  BEETLE_FLOORS,
  BEETLE_STORY_SEED,
  isBeetleRun,
} from '../../src/sim/storyline-rules-beetle';
import type { SimEvent, World } from '../../src/sim/types';
import { applyCommand } from '../../src/sim/world';
import { c, storylineWorld, toChapter } from './storyline-driver';

/** K16: the Beetle Road's Hollow Below chapters are played on a real, seeded floor. */
describe('The Beetle Road on real floors', () => {
  function jump(world: World, events: SimEvent[], n: number): void {
    applyCommand(world, { kind: 'debugChapter', chapter: n }, events);
  }

  it('sends the below chapters to the dungeon and the rest to the Grove', () => {
    for (const n of [1, 2, 5]) expect(storyHome('beetle', n)).toBe('grove');
    for (const n of [3, 4, 6, 7, 8]) expect(storyHome('beetle', n)).toBe('dungeon');
  });

  it('puts chapter 3 on the story floor at its depth, the same floor every time', () => {
    const a = storylineWorld('beetle', 'marina');
    const b = storylineWorld('beetle', 'marina', 77);
    for (const { world, events } of [a, b]) {
      expect(toChapter(world, events, 1)).toBe(true);
      jump(world, events, 3);
      expect(world.location).toBe('dungeon');
      expect(isBeetleRun(world)).toBe(true);
      expect(world.dungeon!.seed).toBe(BEETLE_STORY_SEED);
      expect(world.dungeon!.depth).toBe(BEETLE_FLOORS[3]);
      expect(world.dungeon!.daily).toBeNull();
      expect(runFloor(world)).not.toBeNull();
    }
    const fa = runFloor(a.world)!;
    const fb = runFloor(b.world)!;
    expect(fa.rooms).toEqual(fb.rooms);
    expect(fa.stairsUp).toEqual(fb.stairsUp);
  });

  it('moves between domains and comes back up for a chapter played above', () => {
    const { world, events } = storylineWorld('beetle', 'marina');
    jump(world, events, 6);
    expect(world.dungeon!.depth).toBe(BEETLE_FLOORS[6]);
    jump(world, events, 7);
    expect(world.dungeon!.depth).toBe(BEETLE_FLOORS[7]);
    expect(world.hollow.best).toBeGreaterThanOrEqual(BEETLE_FLOORS[6]!);
    jump(world, events, 5);
    expect(world.location).toBe('grove');
    expect(world.dungeon).toBeNull();
    expect(c(world).chapter).toBe(5);
  });

  it('never cuts short a run of the Keeper’s own', () => {
    const { world, events } = storylineWorld('beetle', 'marina');
    applyCommand(world, { kind: 'enterDungeon', daily: false }, events);
    expect(world.location).toBe('dungeon');
    const seed = world.dungeon!.seed;
    jump(world, events, 3);
    expect(world.dungeon!.seed).toBe(seed);
  });

  it('restores the story floor from a save', () => {
    const { world, events } = storylineWorld('beetle', 'marina');
    jump(world, events, 4);
    const before = runFloor(world)!;
    const loaded = validateWorld(deserialize(serialize(world, 0)).world);
    expect(loaded.location).toBe('dungeon');
    expect(isBeetleRun(loaded)).toBe(true);
    expect(loaded.dungeon!.depth).toBe(BEETLE_FLOORS[4]);
    expect(loaded.keeper.pos).toEqual(world.keeper.pos);
    const after = runFloor(loaded)!;
    expect(after.rooms).toEqual(before.rooms);
    expect(after.stairsDown).toEqual(before.stairsDown);
  });
});
