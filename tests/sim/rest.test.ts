/** R0616 (CAMP-24): "Rest until …" waits honestly on the live clock for the story's hour. */
import { describe, expect, it } from 'vitest';
import { REST, SIM, STORY } from '../../src/config/tuning';
import { firstHolds, restOver, restWait, restWord } from '../../src/sim/rest';
import { GROVE_SIDE_STORIES } from '../../src/sim/story-scenes';
import { sceneTimeHolds } from '../../src/sim/story-state';
import type { SimEvent, World } from '../../src/sim/types';
import { applyCommand, stepWorld } from '../../src/sim/world';
import { c, campaignWorld, playScenes } from './campaign-driver';

/** Hazel's Grove with chapter 3 begun at first light: c3-open names the night. */
function waitingForNight(): { world: World; events: SimEvent[] } {
  const { world, events } = campaignWorld();
  applyCommand(world, { kind: 'debugChapter', chapter: 2 }, events);
  playScenes(world, events);
  applyCommand(world, { kind: 'debugChapter', chapter: 3 }, events);
  c(world).queue = [];
  c(world).rest = null;
  world.timeMs = Math.ceil(world.timeMs / STORY.dayMs) * STORY.dayMs + 1000;
  return { world, events };
}

describe('Rest until (R0616)', () => {
  it('names the hour a scene waits for and finds when it holds', () => {
    const at = firstHolds(0, (ms) => sceneTimeHolds(ms, 'c3-open'))!;
    expect(sceneTimeHolds(at, 'c3-open')).toBe(true);
    expect(sceneTimeHolds(at - REST.scanMs, 'c3-open')).toBe(false);
    expect(restWord(at, 0)).toBe('dusk');
    expect(restWord(STORY.dayMs * 1.01, 0)).toBe('dawn');
    expect(restWord(STORY.dayMs * 0.3, 0)).toBe('morning');
  });

  it('chapter 3 waiting for nightfall: resting at ×100 reaches c3-open in under 6 s of wall time', () => {
    const { world, events } = waitingForNight();
    const wait = restWait(world);
    expect(wait?.owner).toBe('hazel');
    expect(wait?.when).toBe('dusk');
    const egg = world.nubbins.find((n) => n.stage === 'egg');
    if (egg) applyCommand(world, { kind: 'debugHatchNow', nubbinId: egg.id }, events);
    const nub = world.nubbins.find((n) => n.stage !== 'egg' && n.id !== c(world).mossId)!;
    nub.needs.hunger = 1;
    const before = { t: world.timeMs, age: nub.ageMs, hunger: nub.needs.hunger };
    // At ×100 a wall second is 100 sim seconds: count the steps the rest takes.
    let steps = 0;
    while (!restOver(world, wait!.untilMs) && steps < 100_000) {
      events.push(...stepWorld(world, SIM.stepMs));
      steps++;
    }
    const wallS = (steps * SIM.stepMs) / REST.restScale / 1000;
    expect(wallS).toBeLessThanOrEqual(6);
    expect(c(world).queue).toContain('c3-open');
    // Nothing was skipped: the clock, the age and the needs all ran the same sim time.
    const ran = world.timeMs - before.t;
    expect(ran).toBe(steps * SIM.stepMs);
    expect(nub.ageMs - before.age).toBe(ran);
    expect(nub.needs.hunger).toBeLessThan(before.hunger);
  });

  it('nothing to rest for while a scene is queued, or in the vigil', () => {
    const { world } = waitingForNight();
    c(world).queue = ['c3-open'];
    expect(restWait(world)).toBeNull();
    c(world).queue = [];
    c(world).vigil = { progressMs: 0, waves: 0, lull: false, done: false };
    expect(restWait(world)).toBeNull();
    expect(restOver(world, Infinity)).toBe(true);
  });

  it('a tracked quest step that waits for dusk offers a rest too', () => {
    const { world } = waitingForNight();
    // Past the opening, in the goal phase: the spine waits for nothing but its goal.
    c(world).seen.push('c3-open');
    c(world).step = 1;
    const found = GROVE_SIDE_STORIES.flatMap((q) =>
      q.steps.map((s, i) => ({ id: q.id, i, check: s.check })),
    ).find((s) => s.check.startsWith('wait:') && s.check.split(':').includes('dusk'))!;
    expect(found).toBeDefined();
    const store = found.id.startsWith('q') ? c(world).fun : c(world).side;
    store[found.id] = {
      status: 'open',
      step: found.i,
      stage: 'check',
      pending: null,
      openedMs: world.timeMs,
      sinceMs: world.timeMs,
      acted: false,
    };
    world.questBook = {
      v: 1,
      entries: {},
      offer: null,
      tracked: [found.id],
      areas: {},
      here: null,
    };
    const wait = restWait(world);
    expect(wait?.owner).toBe(found.id);
    expect(wait?.when).toBe('dusk');
    expect(wait!.untilMs).toBeGreaterThan(world.timeMs);
  });
});
