import { describe, expect, it } from 'vitest';
import * as CAMPAIGN from '../../src/content/campaign';
import { CHAPTERS, SCENES, SPEAKERS } from '../../src/config/story';
import { SIDE_STORY_CONTENT } from '../../src/sim/side-story-content';
import { deserialize, serialize } from '../../src/sim/save';
import {
  GROVE_SIDE_STORIES,
  campaignContent,
  loadStoryScripts,
  registerCampaign,
  registerSideStories,
  sceneFor,
  sideStory,
} from '../../src/sim/story-scenes';
import { c, campaignWorld } from './campaign-driver';

// The campaign and side-story scripts are lazily loaded chunks; tests/setup-side-stories.ts
// registers them.
describe('the story chunks', () => {
  it('load once and registering again changes nothing', async () => {
    const count = GROVE_SIDE_STORIES.length;
    const scenes = SCENES.length;
    await loadStoryScripts();
    registerCampaign(campaignContent(CAMPAIGN));
    registerSideStories(SIDE_STORY_CONTENT);
    expect(SCENES.length).toBe(scenes);
    expect(scenes).toBe(CAMPAIGN.CAMPAIGN_SCENES.length);
    expect(CHAPTERS).toHaveLength(12);
    expect(SPEAKERS.wisp).toBeDefined();
    expect(sceneFor(campaignWorld().world, 'c1-letter')?.id).toBe('c1-letter');
    expect(GROVE_SIDE_STORIES.length).toBe(count);
    expect(count).toBe(SIDE_STORY_CONTENT.quests.length);
    expect(sideStory('s9')?.id).toBe('s9');
  });

  it('keeps a queued side-story scene through save and load', () => {
    expect(SCENES.some((s) => s.id === 's9-ask')).toBe(false);
    const { world } = campaignWorld();
    c(world).queue.push('s9-ask');
    const loaded = deserialize(serialize(world, 0)).world;
    expect(loaded.campaign?.queue).toContain('s9-ask');
    expect(sceneFor(loaded, 's9-ask')?.id).toBe('s9-ask');
  });
});
