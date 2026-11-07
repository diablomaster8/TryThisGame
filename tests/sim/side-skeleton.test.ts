import { describe, expect, it, vi } from 'vitest';
import { SIDE_STORY_CONTENT } from '../../src/sim/side-story-content';
import { SIDE_STORY_SKELETON } from '../../src/sim/side-story-skeleton';
import { storyNeeds } from '../../src/story-chunks';
import { buildSideSkeleton } from '../tools/side-skeleton-build';
import { campaignWorld } from './campaign-driver';

// R0491 (TECH-50): the app boots the side stories from a skeleton and loads each file's
// scene text on demand.
describe('the side-story skeleton', () => {
  it('matches the scripts (regenerate with tests/tools/gen-side-skeleton.ts)', async () => {
    expect(SIDE_STORY_SKELETON).toEqual(JSON.parse(JSON.stringify(await buildSideSkeleton())));
  });

  it('covers every quest and variant scene the full content has', () => {
    const quests = Object.values(SIDE_STORY_SKELETON).flatMap((p) => p.quests.map((q) => q.id));
    expect(quests.sort()).toEqual(SIDE_STORY_CONTENT.quests.map((q) => q.id).sort());
    const variants = Object.values(SIDE_STORY_SKELETON).flatMap((p) => p.variants.map((s) => s.id));
    expect(variants.sort()).toEqual(SIDE_STORY_CONTENT.variants.map((s) => s.id).sort());
  });

  it('holds a scene back until its text loads, then plays it in full', async () => {
    // A fresh registry, as the app has it: the campaign, then the skeleton alone.
    vi.resetModules();
    const CAMPAIGN = await import('../../src/content/campaign');
    const reg = await import('../../src/sim/story-scenes');
    const { SIDE_STORY_SKELETON: skeleton } = await import('../../src/sim/side-story-skeleton');
    reg.registerCampaign(reg.campaignContent(CAMPAIGN));
    reg.registerSideSkeleton(skeleton);
    const { world } = campaignWorld();
    const s9 = reg.sideStory('s9');
    expect(s9?.steps[0]?.goal).toBe(
      SIDE_STORY_CONTENT.quests.find((q) => q.id === 's9')?.steps[0]?.goal,
    );
    expect(reg.sceneById('s9-ask')).toBeDefined();
    expect(reg.sideTextPending('s9-ask')).toBe(true);
    expect(reg.sceneFor(world, 's9-ask')).toBeUndefined();
    await reg.loadSideText(['s9']);
    expect(reg.sideTextPending('s9-ask')).toBe(false);
    expect(reg.sideStory('s9')).toBe(s9);
    expect(reg.sceneFor(world, 's9-ask')?.lines.length).toBeGreaterThan(0);
    expect(s9?.steps[0]?.hint).not.toBe('');
    // Another file's stories still wait for theirs.
    expect(reg.sideTextPending(reg.sideStory('s24')!.steps[0]!.scene.id)).toBe(true);
    vi.resetModules();
  });

  it('a save lists the quests under way and the queued scenes', () => {
    const json = JSON.stringify({
      world: {
        campaign: {
          queue: ['s9-ask'],
          side: { s9: { status: 'open' }, s2: { status: 'done' } },
          fun: { q01: { status: 'open' } },
        },
      },
    });
    expect(storyNeeds(json)?.side.sort()).toEqual(['q01', 's9', 's9-ask']);
  });
});
