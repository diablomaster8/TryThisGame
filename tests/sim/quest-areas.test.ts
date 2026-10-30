import { describe, expect, it } from 'vitest';
import { REGIONS, type RegionId } from '../../src/config/regions';
import { areaOf } from '../../src/content/where-map';
import { funQuests } from '../../src/sim/fun-quests';
import { offeredIn, questsInArea } from '../../src/sim/quest-areas';
import { SIDE_STORY_CONTENT } from '../../src/sim/side-story-content';
import { registerSideStories } from '../../src/sim/story-scenes';
import { createWorld } from '../../src/sim/world';

registerSideStories(SIDE_STORY_CONTENT);
const REGION_IDS = Object.keys(REGIONS) as RegionId[];
const allOpen = (): boolean => true;

/** R0101: fun quests are offered only in their own region (WORLD-05 tags). */
describe('quest gating by area', () => {
  it('with every region open, no fun quest is offered outside its area', () => {
    const quests = funQuests();
    expect(quests.length).toBeGreaterThanOrEqual(95);
    for (const q of quests) {
      const a = areaOf(q);
      expect(a, q.id).toBeDefined();
      const where = REGION_IDS.filter((r) => offeredIn(q, r, allOpen));
      if (a!.region in REGIONS) expect(where, q.id).toEqual([a!.region]);
      else expect(where.length, q.id).toBe(REGION_IDS.length);
    }
  });

  it('entering the shore offers only shore quests', () => {
    const offered = funQuests().filter((q) => offeredIn(q, 'shore', allOpen));
    expect(offered.length).toBeGreaterThan(0);
    for (const q of offered)
      expect(['shore', 'anywhere', 'story-world']).toContain(areaOf(q)!.region);
  });

  it('until a region can be walked to, its quests are offered from the Grove', () => {
    for (const q of funQuests()) {
      expect(offeredIn(q, 'grove'), q.id).toBe(true);
      const region = areaOf(q)!.region;
      if (region !== 'shore' && region !== 'anywhere' && region !== 'story-world')
        expect(offeredIn(q, 'shore'), q.id).toBe(false);
    }
  });

  it('lists what a region offers', () => {
    const w = createWorld(7, 0);
    const grove = questsInArea(w, 'grove');
    const total = grove.available.length + grove.active.length + grove.done.length;
    expect(total).toBeGreaterThanOrEqual(90);
    expect(questsInArea(w, 'shore').available).toEqual([]);
  });
});
