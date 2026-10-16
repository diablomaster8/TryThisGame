import { describe, expect, it } from 'vitest';
import { SCENES } from '../../src/config/story';
import { SIDE_STORY_CONTENT } from '../../src/sim/side-story-content';
import { deserialize, serialize } from '../../src/sim/save';
import {
  GROVE_SIDE_STORIES,
  loadSideStories,
  registerSideStories,
  sceneFor,
  sideStory,
} from '../../src/sim/story-scenes';
import { c, campaignWorld } from './campaign-driver';

// The side-story scripts are a lazily loaded chunk; tests/setup-side-stories.ts registers it.
describe('the side-story chunk', () => {
  it('loads once and registering again changes nothing', async () => {
    const count = GROVE_SIDE_STORIES.length;
    await loadSideStories();
    registerSideStories(SIDE_STORY_CONTENT);
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
