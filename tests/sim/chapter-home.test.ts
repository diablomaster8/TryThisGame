import { describe, expect, it } from 'vitest';
import { hazelHome } from '../../src/sim/campaign';
import { storyHome } from '../../src/sim/storyline';
import { applyCommand } from '../../src/sim/world';
import { campaignWorld, c } from './campaign-driver';
import { storylineWorld } from './storyline-driver';

/**
 * Campaign graphics H1: a debug chapter jump lands in the chapter's home location, even
 * when it skips the chapter that would have moved there (9 to 11 skips 10's return home).
 */
describe('chapter home locations', () => {
  it('lists the Hollow for 8, Corvin for 9 and the Grove otherwise', () => {
    expect(hazelHome(8)).toBe('hollow');
    expect(hazelHome(9)).toBe('corvin');
    for (const n of [1, 2, 7, 10, 11, 12]) expect(hazelHome(n)).toBe('grove');
    expect(storyHome('hundred', 3)).toBe('grove');
  });

  it('moves with a jump from 9 straight to 11', () => {
    const { world, events } = campaignWorld();
    applyCommand(world, { kind: 'debugChapter', chapter: 9 }, events);
    expect(world.location).toBe('corvin');
    applyCommand(world, { kind: 'debugChapter', chapter: 11 }, events);
    expect(c(world).chapter).toBe(11);
    expect(world.location).toBe('grove');
    applyCommand(world, { kind: 'debugChapter', chapter: 8 }, events);
    expect(world.location).toBe('hollow');
  });

  it('brings a storyline jump home to the Grove', () => {
    const { world, events } = storylineWorld('beetle');
    world.location = 'corvin';
    applyCommand(world, { kind: 'debugChapter', chapter: 3 }, events);
    expect(c(world).chapter).toBe(3);
    expect(world.location).toBe('grove');
  });
});
