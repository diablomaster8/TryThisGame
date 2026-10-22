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

  it('queues the opening again on a jump to a chapter already begun', () => {
    const { world, events } = campaignWorld();
    const st = c(world);
    const first = st.queue[0]!;
    st.seen.push(...st.queue);
    st.queue = [];
    applyCommand(world, { kind: 'debugChapter', chapter: 1 }, events);
    expect(c(world).queue).toContain(first);
    for (const id of ['hundred', 'beetle', 'dawn', 'logged']) {
      const s = storylineWorld(id);
      const sc = c(s.world);
      applyCommand(s.world, { kind: 'debugChapter', chapter: 1 }, s.events);
      const open = sc.queue[0];
      expect(open, id).toBeDefined();
      sc.seen.push(...sc.queue);
      sc.queue = [];
      applyCommand(s.world, { kind: 'debugChapter', chapter: 1 }, s.events);
      expect(sc.queue, id).toContain(open);
    }
  });

  it('brings a storyline jump home to the Grove', () => {
    const { world, events } = storylineWorld('beetle');
    world.location = 'corvin';
    applyCommand(world, { kind: 'debugChapter', chapter: 3 }, events);
    expect(c(world).chapter).toBe(3);
    expect(world.location).toBe('grove');
  });
});
