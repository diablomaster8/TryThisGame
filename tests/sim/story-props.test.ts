import { describe, expect, it } from 'vitest';
import { STORY_PROPS } from '../../src/config/tuning';
import { STORY_PROP_NAMES } from '../../src/config/strings';
import { grantRewards } from '../../src/sim/story-rewards';
import { storyPropMeets, visibleStoryProps } from '../../src/sim/story-props';
import { GROVE_SIDE_STORIES, sideStory } from '../../src/sim/story-scenes';
import { applyCommand } from '../../src/sim/world';
import { c, campaignWorld } from './campaign-driver';
import { runUntil, status } from './side-driver';

describe('story props', () => {
  it('every prop has a name and meets at least one real step check', () => {
    const checks = GROVE_SIDE_STORIES.flatMap((q) => q.steps.map((s) => s.check.split(':')));
    for (const p of STORY_PROPS) {
      expect(STORY_PROP_NAMES[p.id], p.id).toBeTruthy();
      if (p.meets.length === 0) continue;
      expect(
        checks.some((tokens) => storyPropMeets(p.id, tokens)),
        `${p.id} meets a check`,
      ).toBe(true);
    }
  });

  it('nothing stands outside the campaign; the fixed props stand once it starts', () => {
    const { world } = campaignWorld();
    const ids = visibleStoryProps(world).map((p) => p.id);
    for (const id of ['flat-stone', 'hazels-bench', 'lantern-shed', 'old-barn'])
      expect(ids).toContain(id);
    for (const id of ['old-trowel', 'hazels-lantern', 'corvins-chair', 'sunrise-shelf'])
      expect(ids).not.toContain(id);
    world.location = 'hollow';
    expect(visibleStoryProps(world)).toEqual([]);
  });

  it('the trowel appears with Fossil’s walk and goes once Hazel has it', () => {
    const { world } = campaignWorld();
    grantRewards(world, c(world), sideStory('s5')!, []);
    expect(visibleStoryProps(world).map((p) => p.id)).toContain('old-trowel');
    c(world).side.s10 = {
      status: 'open',
      step: 1,
      stage: 'wait',
      pending: null,
      openedMs: 0,
      sinceMs: 0,
      acted: false,
    };
    expect(visibleStoryProps(world).map((p) => p.id)).not.toContain('old-trowel');
  });

  it('a tap on the walled-garden door meets S26’s find-the-door step', () => {
    const r = runUntil(
      (w) => c(w).side.s26?.step === 2 && c(w).side.s26?.stage === 'check',
      ['s26'],
    );
    expect(status(r, 's26')).toBe('open');
    const ids = visibleStoryProps(r.world).map((p) => p.id);
    expect(ids).toContain('walled-garden-door');
    expect(ids).not.toContain('hush-bench');
    applyCommand(r.world, { kind: 'storyProp', prop: 'flat-stone' }, r.events);
    expect(c(r.world).side.s26!.acted).toBe(false);
    applyCommand(r.world, { kind: 'storyProp', prop: 'walled-garden-door' }, r.events);
    expect(c(r.world).side.s26!.acted).toBe(true);
    runUntil((w) => (c(w).side.s26?.step ?? 0) >= 3, [], {}, r);
    expect(visibleStoryProps(r.world).map((p) => p.id)).toContain('hush-bench');
  });
});
