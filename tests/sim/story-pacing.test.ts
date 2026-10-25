/**
 * Review 2026-10-24 fixes for the story engine: pacing between scenes, the season following
 * the chapters, every Keeper and scene guest present, nothing starting in the Hollow Below,
 * fun quests kept out of chapters 9 to 11 and spaced apart, the debug chapter jump, and the
 * Multiverse's plush lines.
 */
import { describe, expect, it } from 'vitest';
import type { Quest } from '../../src/content/types';
import { FUN, STORY } from '../../src/config/tuning';
import { lineNext, type StoryLine } from '../../src/sim/atlas';
import { multiverseLineLive, ownsPlush, PLUSH_FLAG } from '../../src/sim/multiverse-rules';
import { sceneGuests } from '../../src/sim/scene-cast';
import { freshLine } from '../../src/sim/side-saves';
import { sideStory } from '../../src/sim/story-scenes';
import { sceneTimeHolds } from '../../src/sim/story-state';
import { TRAINERS } from '../../src/sim/trainers';
import type { SimEvent, World } from '../../src/sim/types';
import { applyCommand } from '../../src/sim/world';
import { c, campaignWorld, playScenes, tick } from './campaign-driver';

const dayFrac = (w: World): number => (w.timeMs % STORY.dayMs) / STORY.dayMs;

/** Tick in one-second steps until `done` holds; the seconds it took, or -1. */
function until(w: World, e: SimEvent[], done: () => boolean, max = 600): number {
  for (let s = 0; s < max; s++) {
    if (done()) return s;
    tick(w, e, 1);
  }
  return done() ? max : -1;
}

/** Answer other scenes as they come, until `id` is at the head of the queue. */
function untilScene(w: World, e: SimEvent[], id: string, max = 900): number {
  for (let s = 0; s < max; s++) {
    const head = c(w).queue[0];
    if (head === id) return s;
    if (head) applyCommand(w, { kind: 'sceneDone', scene: head, choice: null }, e);
    tick(w, e, 1);
  }
  return -1;
}

/** A campaign at chapter 1's goal, the egg hatched and petted, the closing played. */
function afterHatch(): { world: World; events: SimEvent[] } {
  const { world, events } = campaignWorld();
  playScenes(world, events);
  c(world).stats.hatched = 1;
  c(world).stats.pets = 1;
  expect(until(world, events, () => c(world).queue[0] === 'c1-close')).toBeGreaterThanOrEqual(0);
  playScenes(world, events);
  return { world, events };
}

describe('pacing (item 1)', () => {
  it('a breath after the hatch, then chapter 2 opens in the morning its text names', () => {
    const { world, events } = afterHatch();
    const closedAt = world.timeMs;
    expect(until(world, events, () => c(world).queue[0] === 'c2-open')).toBeGreaterThan(0);
    expect(world.timeMs - closedAt).toBeGreaterThanOrEqual(STORY.breatherMs);
    expect(sceneTimeHolds(world.timeMs, 'c2-open')).toBe(true);
    expect(dayFrac(world)).toBeLessThan(STORY.morningEndsAt);
  });

  it('chapter 2 cannot be finished in seconds, and Corvin comes in the late afternoon', () => {
    const { world, events } = afterHatch();
    until(world, events, () => c(world).queue[0] === 'c2-open');
    playScenes(world, events);
    const opened = c(world).openedMs!;
    // Feed twice at once: the goal is met, but the closing waits.
    c(world).stats.feeds = 2;
    expect(untilScene(world, events, 'c2-corvin')).toBeGreaterThan(0);
    expect(world.timeMs - opened).toBeGreaterThanOrEqual(STORY.goalMinMs);
    const f = dayFrac(world);
    expect(f).toBeGreaterThanOrEqual(STORY.morningEndsAt);
    expect(f).toBeLessThan(STORY.duskAt);
  });

  it('a scene’s own follow-ups still play straight after it', () => {
    const { world, events } = campaignWorld();
    applyCommand(world, { kind: 'debugChapter', chapter: 7 }, events);
    expect(c(world).queue[0]).toBe('c7-open');
    applyCommand(world, { kind: 'sceneDone', scene: 'c7-open', choice: null }, events);
    expect(c(world).queue[0]).toBe('c7-stillness');
  });

  it('side stories wait out the gap after a campaign scene', () => {
    const { world, events } = afterHatch();
    const before = Object.keys(c(world).side).length;
    tick(world, events, STORY.breatherMs / 1000 - 5);
    // Nothing new has been queued during the breather.
    expect(c(world).queue).toEqual([]);
    expect(Object.values(c(world).side).every((s) => s.pending === null)).toBe(true);
    expect(Object.keys(c(world).side).length).toBeGreaterThanOrEqual(before);
  });
});

describe('the season follows the chapters (item 2)', () => {
  it('spring at the start, summer in chapter 3, winter for the Long Night', () => {
    const { world, events } = campaignWorld();
    expect(world.season).toBe('spring');
    applyCommand(world, { kind: 'debugChapter', chapter: 3 }, events);
    tick(world, events, 1.1);
    expect(world.season).toBe('summer');
    applyCommand(world, { kind: 'debugChapter', chapter: 8 }, events);
    tick(world, events, 1.1);
    expect(world.season).toBe('autumn');
    applyCommand(world, { kind: 'debugChapter', chapter: 10 }, events);
    tick(world, events, 1.1);
    expect(world.season).toBe('winter');
  });
});

describe('who is in the Grove (item 3)', () => {
  it('all ten valley Keepers, the player’s own pick included', () => {
    const { world, events } = campaignWorld('luna');
    for (const t of TRAINERS)
      expect(
        world.npcs.some((n) => n.trainer === t.id),
        t.id,
      ).toBe(true);
    // An old save without the picked Keeper's NPC gets it back.
    world.npcs = world.npcs.filter((n) => n.trainer !== 'luna');
    tick(world, events, 1.1);
    expect(world.npcs.some((n) => n.trainer === 'luna' && !n.guest)).toBe(true);
  });

  it('Corvin stands at the gate for his chapter 2 scene and leaves after it', () => {
    const { world, events } = campaignWorld();
    applyCommand(world, { kind: 'debugChapter', chapter: 2 }, events);
    playScenes(world, events);
    expect(world.npcs.some((n) => n.trainer === 'corvin')).toBe(false);
    c(world).queue.push('c2-corvin');
    tick(world, events, 1.1);
    const corvin = world.npcs.find((n) => n.trainer === 'corvin');
    expect(corvin?.guest).toBe(true);
    const k = world.keeper.pos;
    expect(Math.hypot(corvin!.pos.x - k.x, corvin!.pos.z - k.z)).toBeLessThan(4);
    applyCommand(world, { kind: 'sceneDone', scene: 'c2-corvin', choice: 'refuse' }, events);
    tick(world, events, 1.1);
    expect(world.npcs.some((n) => n.trainer === 'corvin')).toBe(false);
  });

  it('gives side-story visitors a body, never a Nubbin, the narrator or a memory', () => {
    const { world } = campaignWorld();
    const s9 = sideStory('s9')!;
    const corvinScene = [...s9.steps.flatMap((s) => [s.scene, s.done]), s9.complete].find((s) =>
      s?.lines.some((l) => l.who === 'corvin'),
    )!;
    expect(sceneGuests(world, corvinScene.id)).toContain('corvin');
    const s1 = sideStory('s1')!;
    for (const step of s1.steps) {
      const g = sceneGuests(world, step.scene.id);
      for (const who of ['moss', 'briar', 'hush', 'young-hazel', 'narrator', 'you'])
        expect(g).not.toContain(who);
    }
    // The valley Keepers are already here: never doubled.
    expect(sceneGuests(world, 'c2-open')).not.toContain('marina');
  });
});

describe('nothing starts in the Hollow Below (item 4)', () => {
  it('the chapter machine and the stories wait until the Keeper is back in the Grove', () => {
    const { world, events } = afterHatch();
    world.location = 'dungeon';
    tick(world, events, STORY.breatherMs / 1000 + STORY.dayMs / 1000 + 5);
    expect(c(world).chapter).toBe(1);
    expect(c(world).queue).toEqual([]);
    world.location = 'grove';
    expect(until(world, events, () => c(world).queue[0] === 'c2-open')).toBeGreaterThanOrEqual(0);
  });
});

describe('fun quests (item 7)', () => {
  it('no fun quest moves in chapters 9 to 11, not even a done scene', () => {
    const { world, events } = campaignWorld();
    applyCommand(world, { kind: 'debugChapter', chapter: 9 }, events);
    playScenes(world, events);
    const q = sideStory('q21')!;
    c(world).fun.q21 = {
      status: 'open',
      step: 0,
      stage: 'check',
      pending: null,
      openedMs: world.timeMs,
      sinceMs: world.timeMs,
      acted: true,
    };
    c(world).rest = null;
    tick(world, events, 5);
    expect(c(world).fun.q21!.stage).toBe('check');
    const fun = (id: string) => id.startsWith(`${q.id}-`);
    expect(c(world).queue.some(fun)).toBe(false);
  });

  it('a new offer waits a long gap after the last one opened', () => {
    const { world, events } = campaignWorld();
    applyCommand(world, { kind: 'debugChapter', chapter: 4 }, events);
    playScenes(world, events);
    c(world).stats.hatched = 1;
    c(world).openedMs = world.timeMs - FUN.offerAfterMs - 1;
    c(world).fun.q01 = {
      status: 'done',
      step: 1,
      stage: 'complete',
      pending: null,
      openedMs: world.timeMs - 10_000,
      sinceMs: world.timeMs - 10_000,
      acted: false,
    };
    c(world).rest = null;
    const count = () => Object.keys(c(world).fun).length;
    tick(world, events, (FUN.offerGapMs - 20_000) / 1000);
    expect(count()).toBe(1);
  });
});

describe('the debug chapter jump (item 8)', () => {
  it('jumps Hazel’s Grove even while a fun quest is open', () => {
    const { world, events } = campaignWorld();
    applyCommand(world, { kind: 'debugChapter', chapter: 3 }, events);
    playScenes(world, events);
    c(world).fun.q21 = {
      status: 'open',
      step: 0,
      stage: 'check',
      pending: null,
      openedMs: world.timeMs,
      sinceMs: world.timeMs,
      acted: false,
    };
    applyCommand(world, { kind: 'debugChapter', chapter: 6 }, events);
    expect(c(world).chapter).toBe(6);
    expect(c(world).queue[0]).toMatch(/^c6-open/);
  });
});

describe('the plush Nubbin in the Multiverse (item 6)', () => {
  const scene = {
    id: 'mv-ts99-scene',
    lines: [
      { who: 'narrator', text: 'Andy’s room is very quiet.' },
      { who: 'ts-plush', text: 'Mmf.' },
      { who: 'narrator', text: 'Your plush Nubbin waves from the toy box.' },
      { who: 'you', text: 'Hello, everyone.' },
    ],
  };
  const quest = {
    id: 'mv-ts99',
    code: 'TS99',
    title: 'Test',
    source: 'test',
    audience: 'adult',
    trigger: { where: '', when: '' },
    speakers: [],
    steps: [{ id: 'mv-ts99-s1', goal: '', hint: '', check: 'x', scene }],
    complete: { id: 'mv-ts99-complete', lines: [{ who: 'narrator', text: 'Done.' }] },
    rewards: [],
  } as unknown as Quest;
  const line: StoryLine = {
    id: 'TS',
    title: 'TS',
    quests: [quest],
    variants: [],
    lineLive: multiverseLineLive,
  };
  const shown = (owned: boolean) => {
    const ctx = { met: () => true, flags: { [PLUSH_FLAG]: owned }, grove: {} };
    const next = lineNext(line, freshLine(), ctx);
    return next.kind === 'scene' ? next.scene.lines.map((l) => l.who) : [];
  };

  it('skips the plush lines when the Grove never got the plush', () => {
    expect(shown(false)).toEqual(['narrator', 'you']);
  });

  it('keeps them when the Grove owns it', () => {
    expect(shown(true)).toEqual(['narrator', 'ts-plush', 'narrator', 'you']);
  });

  it('reads ownership from Q12’s keepsake, and touches no other line', () => {
    const { world } = campaignWorld();
    expect(ownsPlush(world)).toBe(false);
    world.inventory.keepsakes.push('plush-nubbin');
    expect(ownsPlush(world)).toBe(true);
    expect(multiverseLineLive('mv-e5-s1', { who: 'ts-plush', text: 'plush' }, {})).toBe(true);
  });
});
