/**
 * Lane C round 10, agent C: the Story pace setting (R0614) and the goal skips under it (R0615).
 * Brisk shortens the story's waits; Story only skips each spine goal with the minimum world
 * change, the chapters still close, and the ending is a real one.
 */
import { describe, expect, it } from 'vitest';
import { SKIP } from '../../src/config/tuning';
import { ENDINGS } from '../../src/config/story';
import { FINAL_CHAPTER, endingFor } from '../../src/sim/campaign';
import { GOAL_SKIPS, skippableGoal, stepPlayable } from '../../src/sim/goal-skips';
import { paced } from '../../src/sim/story-pace';
import { RUNNER_STORIES, sideActable } from '../../src/sim/side-stories';
import type { SimEvent, StoryPace, World } from '../../src/sim/types';
import { applyCommand } from '../../src/sim/world';
import { c, campaignWorld, meetGoal, playScenes, sable, tick } from './campaign-driver';

function setPace(world: World, events: SimEvent[], pace: StoryPace): void {
  applyCommand(
    world,
    { kind: 'setSettings', settings: { ...world.settings, storyPace: pace } },
    events,
  );
}

/** Seconds of story time from chapter 2's opening to chapter 3's, meeting the goal at once. */
function chapterTwoSeconds(pace: StoryPace): number {
  const { world, events } = campaignWorld();
  setPace(world, events, pace);
  for (let s = 0; s < 4000 && c(world).chapter < 2; s++) {
    if (c(world).queue.length > 0) playScenes(world, events);
    else if (c(world).step === 1) meetGoal(world, events);
    tick(world, events, 1);
  }
  playScenes(world, events);
  const start = world.timeMs;
  for (let s = 0; s < 4000 && c(world).chapter < 3; s++) {
    if (c(world).queue.length > 0) playScenes(world, events);
    else if (c(world).step === 1) meetGoal(world, events);
    tick(world, events, 1);
  }
  expect(c(world).chapter).toBe(3);
  return (world.timeMs - start) / 1000;
}

describe('Story pace (R0614)', () => {
  it('Full keeps the waits; Brisk and Story only scale them by PACE.brisk', () => {
    const { world, events } = campaignWorld();
    expect(paced(world, 60_000)).toBe(60_000);
    setPace(world, events, 'brisk');
    expect(paced(world, 60_000)).toBe(15_000);
    setPace(world, events, 'story');
    expect(paced(world, 60_000)).toBe(15_000);
    // A goal is never skippable outside Story only.
    setPace(world, events, 'brisk');
    expect(skippableGoal(world)).toBeNull();
  });

  it('Brisk runs chapter 2 to 3 in less story time than Full', () => {
    const full = chapterTwoSeconds('full');
    const brisk = chapterTwoSeconds('brisk');
    // The hour a scene names is not shortened (Rest until covers it), so the ratio is
    // held to 35% here rather than 25%.
    // Measured 2026-10-30: full 210 s, brisk 66 s (31%); the rest is the closing's hour.
    expect(brisk / full).toBeLessThan(0.35);
  });
});

describe('Goal skips (R0615)', () => {
  it('chapter 7: Story only skips Sable’s trust to 45 and the chapter closes', () => {
    const { world, events } = campaignWorld();
    setPace(world, events, 'story');
    for (let g = 0; g < 6000 && c(world).chapter < 7; g++) {
      if (c(world).queue.length > 0) playScenes(world, events);
      else if (skippableGoal(world)) applyCommand(world, { kind: 'skipGoal' }, events);
      else {
        for (const id of RUNNER_STORIES)
          if (sideActable(world, c(world), id))
            applyCommand(world, { kind: 'sideAct', story: id }, events);
        tick(world, events, 2);
      }
    }
    expect(c(world).chapter).toBe(7);
    for (let g = 0; g < 600 && c(world).step < 1; g++) {
      playScenes(world, events);
      tick(world, events, 1);
    }
    expect(skippableGoal(world)).toBe('sableTrust45');
    applyCommand(world, { kind: 'skipGoal' }, events);
    expect(sable(world)!.trust).toBeGreaterThanOrEqual(45);
    expect(c(world).skipped?.sableTrust45).toBe(world.timeMs);
    for (let g = 0; g < 3000 && c(world).chapter === 7; g++) {
      playScenes(world, events);
      tick(world, events, 2);
    }
    expect(c(world).chapter).toBe(8);
  });

  it('every goal skipped in order still reaches a valid ending, within the Shells budget', () => {
    const { world, events } = campaignWorld();
    setPace(world, events, 'story');
    let gained = 0;
    for (let g = 0; g < 20000 && c(world).chapter <= FINAL_CHAPTER; g++) {
      if (c(world).queue.length > 0) {
        playScenes(world, events);
        continue;
      }
      if (skippableGoal(world)) {
        const before = world.inventory.shells;
        applyCommand(world, { kind: 'skipGoal' }, events);
        gained += world.inventory.shells - before;
        tick(world, events, 1);
        continue;
      }
      for (const id of RUNNER_STORIES)
        if (sideActable(world, c(world), id))
          applyCommand(world, { kind: 'sideAct', story: id }, events);
      tick(world, events, 5);
    }
    expect(c(world).chapter).toBeGreaterThan(FINAL_CHAPTER);
    expect(Object.keys(ENDINGS)).toContain(c(world).ending);
    expect(Object.keys(ENDINGS)).toContain(endingFor(world, c(world)));
    // The skips themselves add at most SKIP.maxShells over the run.
    expect(gained).toBeLessThanOrEqual(SKIP.maxShells);
    expect(Object.keys(c(world).skipped ?? {}).length).toBeGreaterThanOrEqual(8);
  });
});

describe('Playable steps (R0636)', () => {
  it('a micro-game or a watched verb plays; a give with no command is imagined', () => {
    expect(stepPlayable('carry:pie:bench')).toBe(true);
    expect(stepPlayable('talk:fern')).toBe(true);
    expect(stepPlayable('give:item:sun-fruit:sparks')).toBe(false);
  });

  it('choices are never skippable', () => {
    expect(GOAL_SKIPS.corvinChoice).toBeUndefined();
    expect(GOAL_SKIPS.finalChoice).toBeUndefined();
  });
});
