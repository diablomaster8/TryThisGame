import { describe, expect, it } from 'vitest';
import { MIGRATIONS, SAVE_VERSION, deserialize, serialize } from '../../src/sim/save';
import { grantRewards, hasKeepsake, storyTitles } from '../../src/sim/story-rewards';
import { rewardById, sideStory } from '../../src/sim/story-scenes';
import type { SimEvent } from '../../src/sim/types';
import { c, campaignWorld } from './campaign-driver';

describe('story rewards', () => {
  it('keeps every reward of a finished story once, and sets its flag rewards', () => {
    const { world } = campaignWorld();
    const quest = sideStory('s1')!;
    const events: SimEvent[] = [];
    grantRewards(world, c(world), quest, events);
    grantRewards(world, c(world), quest, events);
    const ids = quest.rewards.map((r) => r.id);
    expect(world.inventory.keepsakes).toEqual(ids);
    expect(events.filter((e) => e.kind === 'keepsake')).toHaveLength(ids.length);
    for (const r of quest.rewards) {
      expect(hasKeepsake(world, r.id)).toBe(true);
      if (r.kind === 'flag') expect(c(world).flags[r.id]).toBe(true);
      expect(rewardById(r.id)?.quest).toBe('s1');
    }
  });

  it('titles the stories give show beside the achievement titles', () => {
    const { world } = campaignWorld();
    const quest = sideStory('s3')!;
    grantRewards(world, c(world), quest, []);
    const titles = quest.rewards.filter((r) => r.kind === 'title').map((r) => r.label);
    expect(titles.length).toBeGreaterThan(0);
    expect(storyTitles(world, rewardById)).toEqual(titles);
  });

  it('keepsakes survive a save and load', () => {
    const { world } = campaignWorld();
    grantRewards(world, c(world), sideStory('s5')!, []);
    const loaded = deserialize(serialize(world, 0)).world;
    expect(loaded.inventory.keepsakes).toEqual(world.inventory.keepsakes);
    expect(loaded.campaign?.fun).toEqual({});
  });

  it('a version 3 save gains keepsakes and the fun-quest state', () => {
    const { world } = campaignWorld();
    const data = JSON.parse(serialize(world, 0)) as Record<string, unknown>;
    const w = data.world as Record<string, unknown>;
    delete (w.inventory as Record<string, unknown>).keepsakes;
    delete (w.campaign as Record<string, unknown>).fun;
    data.version = 3;
    const migrated = MIGRATIONS[2]!(data);
    expect(SAVE_VERSION).toBeGreaterThanOrEqual(4);
    expect((migrated.world as typeof w).inventory).toHaveProperty('keepsakes', []);
    expect((migrated.world as typeof w).campaign).toHaveProperty('fun', {});
    const loaded = deserialize(JSON.stringify(data)).world;
    expect(loaded.inventory.keepsakes).toEqual([]);
    expect(loaded.campaign?.fun).toEqual({});
  });
});
