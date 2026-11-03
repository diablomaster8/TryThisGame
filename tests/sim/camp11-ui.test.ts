/** Lane C round 11, helper ui: markers, ledger, recommender, beat cap, compare (sim/camp11.ts). */
import { describe, expect, it } from 'vitest';
import { C11_CHOICE_FLAGS } from '../../src/config/tuning';
import {
  areaMarks,
  beatAllowed,
  choicesOf,
  compareChoices,
  ledger,
  markKind,
  storyFirst,
} from '../../src/sim/camp11';
import { questBook } from '../../src/sim/quest-offers';
import { applyCommand } from '../../src/sim/world';
import { c, campaignWorld, playScenes, tick } from './campaign-driver';

function openAt3() {
  const { world, events } = campaignWorld();
  world.settings.questFlow = 'open';
  applyCommand(world, { kind: 'debugChapter', chapter: 3 }, events);
  playScenes(world, events);
  world.keeper.pos = { x: 0, z: -40 };
  tick(world, events, 400);
  playScenes(world, events);
  world.keeper.pos = { x: 12.4, z: -10.4 };
  world.keeper.moveTarget = null;
  tick(world, events, 2);
  return { world, events };
}

describe('quest markers (R0608)', () => {
  it('shows ! on the falls when Q1 is offered, and ◆ once it is pinned and under way', () => {
    const { world, events } = openAt3();
    const m = areaMarks(world)['grove/falls'];
    expect(m && markKind(m)).toBe('offer');
    expect(m?.offer).toContain('q01');
    applyCommand(world, { kind: 'questAccept', id: 'q01' }, events);
    tick(world, events, 2);
    const after = areaMarks(world)['grove/falls'];
    expect(after && markKind(after)).toBe('tracked');
    expect(questBook(world).tracked).toContain('q01');
  });
});

describe('the ledger (R0641)', () => {
  it('counts done quests and takes the leaf away only from a skipped quest', () => {
    const { world } = openAt3();
    const cs = c(world);
    cs.fun['q01'] = { status: 'done', step: 0 } as never;
    cs.fun['q02'] = { status: 'done', step: 0 } as never;
    questBook(world).skippedSteps = { q02: 1 };
    const l = ledger(world);
    expect(l.done).toBeGreaterThanOrEqual(2);
    expect(l.leaves.has('q01')).toBe(true);
    expect(l.leaves.has('q02')).toBe(false);
    expect(l.played).toBe(l.done - 1);
    expect(l.percent).toBeGreaterThan(0);
  });
});

describe('story first (R0663)', () => {
  it('names the spine chapter and finds an area for it', () => {
    const { world } = openAt3();
    const s = storyFirst(world);
    expect(s?.chapter).toBe(3);
    expect(s?.over).toBe(false);
  });
});

describe('arrival beats (R0651)', () => {
  it('caps beats: not busy, 10 s apart, a few an hour', () => {
    expect(beatAllowed([], 0, true)).toBe(false);
    expect(beatAllowed([], 0, false)).toBe(true);
    expect(beatAllowed([1000], 5000, false)).toBe(false);
    expect(beatAllowed([1000], 12_000, false)).toBe(true);
    const many = [0, 20_000, 40_000, 60_000, 80_000, 100_000];
    expect(beatAllowed(many, 200_000, false)).toBe(false);
    expect(beatAllowed(many, 4_000_000, false)).toBe(true);
  });
});

describe('branch compare (R0667)', () => {
  it('keeps signature choices and lists only the ones that differ', () => {
    const flag = C11_CHOICE_FLAGS[0]!;
    const a = choicesOf({ [flag]: 'walk', 'other-flag': 'x' });
    expect(a).toEqual({ [flag]: 'walk' });
    expect(compareChoices(a, { ...a })).toEqual([]);
    const d = compareChoices(a, { [flag]: 'asked' });
    expect(d).toEqual([{ flag, a: 'walk', b: 'asked' }]);
    expect(compareChoices(a, {})[0]).toEqual({ flag, a: 'walk', b: null });
  });
});
