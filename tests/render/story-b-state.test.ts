import { beforeAll, describe, expect, it } from 'vitest';
import { STORY_B } from '../../src/config/tuning-b';
import { storyBState } from '../../src/render/story-b-state';
import { startCampaign } from '../../src/sim/campaign';
import { loadStoryScripts } from '../../src/sim/story-scenes';
import { createWorld } from '../../src/sim/world';

beforeAll(async () => {
  await loadStoryScripts();
});

function world(queue: string[], chapter: number) {
  const w = createWorld(1, 0);
  startCampaign(w, []);
  w.campaign!.queue = queue;
  w.campaign!.chapter = chapter;
  w.location = 'grove';
  return w;
}

describe('package b story state (C4, C6, C7, M9, M10, N7)', () => {
  it('shows the gate stuck and overgrown in chapter 1, and swung wide for Corvin', () => {
    const one = storyBState(world([], 1), null);
    expect(one.gate.openness).toBe(STORY_B.gate.stuck);
    expect(one.gate.overgrown).toBe(true);
    expect(one.gate.bare).toBe(false);
    const two = storyBState(world(['c2-corvin'], 2), null);
    expect(two.gate.openness).toBe(1);
    expect(two.gate.overgrown).toBe(true);
    expect(storyBState(world([], 2), null).gate.openness).toBe(0);
  });

  it('lets a scene’s own gate prop win', () => {
    expect(storyBState(world([], 1), { props: { gate: 'open' } }).gate.openness).toBe(1);
    expect(storyBState(world(['c2-corvin'], 2), { props: { gate: 'shut' } }).gate.openness).toBe(0);
  });

  it('roofs the Fold again chapter by chapter and never writes the world', () => {
    const w = world([], 1);
    w.campaign!.storyline = 'hundred';
    const before = JSON.stringify(w);
    const open = storyBState(w, null);
    expect(open.hundred).toBe(true);
    expect(open.ruin).toBe(3);
    expect(open.gate.bare).toBe(true);
    expect(open.sailsStopped).toBe(true);
    expect(open.jettyMended).toBe(false);
    expect(open.wheelTurns).toBe(false);
    w.campaign!.chapter = 10;
    const last = storyBState(w, null);
    expect(last.ruin).toBe(0);
    expect(last.wheelTurns).toBe(true);
    expect(last.jettyMended).toBe(true);
    w.campaign!.chapter = 1;
    expect(JSON.stringify(w)).toBe(before);
  });

  it('counts the days carved on the post from the clock, up to a hundred', () => {
    const w = world([], 1);
    w.campaign!.storyline = 'hundred';
    w.timeMs = 23 * 120_000 + 5;
    expect(storyBState(w, null).gate.tally).toBe(23);
    w.timeMs = 400 * 120_000;
    expect(storyBState(w, null).gate.tally).toBe(STORY_B.tally.max);
    expect(storyBState(world([], 1), null).gate.tally).toBe(0);
  });

  it('draws Dawn & Dusk’s houses only in that campaign', () => {
    const w = world([], 1);
    expect(storyBState(w, null).dawnDusk).toBe(false);
    w.campaign!.storyline = 'dawn';
    expect(storyBState(w, null).dawnDusk).toBe(true);
    w.campaign!.storyline = 'dusk';
    expect(storyBState(w, null).dawnDusk).toBe(true);
  });
});
