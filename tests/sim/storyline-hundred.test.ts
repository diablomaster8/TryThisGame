import { describe, expect, it } from 'vitest';
import { STORYLINE_HUNDRED } from '../../src/content/storyline-hundred';
import { STORY, STORYLINES, TOWN } from '../../src/config/tuning';
import { goalMet } from '../../src/sim/campaign';
import { lifespanMs } from '../../src/sim/slips';
import { storylines } from '../../src/sim/story-scenes';
import { journalView } from '../../src/sim/storyline';
import { addRecruit } from '../../src/sim/town';
import type { SimEvent, World } from '../../src/sim/types';
import { applyCommand } from '../../src/sim/world';
import { c, playScenes, settle, storylineWorld, tick, toChapter } from './storyline-driver';

function partner(world: World) {
  return world.nubbins.find((n) => n.id === c(world).flags.partnerId)!;
}

function recruitTo(world: World, events: SimEvent[], count: number): void {
  for (let i = world.town.recruits.length; i < count; i++)
    addRecruit(world, `Fold${i}`, 'puffbud', events);
}

/** Walk S1 to the hundredth day's opening, shaping the partner and the Fold on the way. */
function toTheLastDay(
  world: World,
  events: SimEvent[],
  shape: { recruits: number; moody: boolean },
): void {
  expect(toChapter(world, events, 1)).toBe(true);
  applyCommand(world, { kind: 'debugHatchNow', nubbinId: partner(world).id }, events);
  expect(toChapter(world, events, 2, { 'h-c1-close': 'slow' })).toBe(true);
  expect(c(world).flags['h-first-name']).toBe('slow');
  recruitTo(world, events, 1);
  expect(toChapter(world, events, 3)).toBe(true);
  recruitTo(world, events, 2);
  expect(toChapter(world, events, 4)).toBe(true);
  // The shore: travel first, then the swimmer settles.
  recruitTo(world, events, 3);
  expect(goalMet(world, c(world))).toBe(false);
  applyCommand(world, { kind: 'storyArea', area: 'shore' }, events);
  expect(world.wild.some((w) => w.patch === 'water')).toBe(true);
  expect(toChapter(world, events, 5)).toBe(true);
  expect(c(world).seen).toContain('h-c4-sand');
  // The cave is a Hollow run.
  applyCommand(world, { kind: 'storyArea', area: 'cave' }, events);
  expect(world.dungeon).not.toBeNull();
  applyCommand(world, { kind: 'leaveDungeon' }, events);
  expect(world.hollow.runs).toBe(1);
  expect(toChapter(world, events, 6)).toBe(true);
  const p = partner(world);
  p.stage = 'adult';
  p.form = { band: 'neutral', type: 'run', second: null, leanAtEvolution: { ...p.typeLean } };
  if (shape.moody) p.moody = 'grumpy';
  expect(toChapter(world, events, 7)).toBe(true);
  applyCommand(world, { kind: 'storyArea', area: 'mire' }, events);
  expect(world.location).toBe('corvin');
  expect(world.weather.kind).toBe('rain');
  recruitTo(world, events, 5);
  expect(toChapter(world, events, 8)).toBe(true);
  applyCommand(world, { kind: 'storyArea', area: 'mill' }, events);
  recruitTo(world, events, Math.max(5, Math.ceil(TOWN.unlocks.attendant / TOWN.perRecruit)));
  expect(toChapter(world, events, 9, { 'h-c8-close': 'lit' })).toBe(true);
  // The Hush: a dojo win in chapter 9, and only then.
  expect(c(world).flags['hush-beaten']).toBeUndefined();
  applyCommand(world, { kind: 'storyArea', area: 'mountain' }, events);
  settle(world, events, () => c(world).seen.includes('h-c9-mountain'), 5);
  applyCommand(
    world,
    { kind: 'karateResult', nubbinId: p.id, won: false, tier: 3, shells: 0 },
    events,
  );
  expect(c(world).flags['hush-beaten']).toBeUndefined();
  applyCommand(
    world,
    { kind: 'karateResult', nubbinId: p.id, won: true, tier: 3, shells: 0 },
    events,
  );
  expect(c(world).flags['hush-beaten']).toBe(true);
  expect(toChapter(world, events, 10)).toBe(true);
  recruitTo(world, events, shape.recruits);
}

function finish(world: World, events: SimEvent[]): string {
  tick(world, events, STORY.dayMs / 1000 + 1);
  settle(world, events, () => c(world).ending !== null, 10);
  playScenes(world, events);
  return c(world).ending ?? '';
}

describe('S1 The Hundred Days', () => {
  it('is registered with ten chapters and four endings whose scenes exist', () => {
    expect(storylines().some((s) => s.id === 'hundred')).toBe(true);
    expect(STORYLINE_HUNDRED.chapters.length).toBe(10);
    for (const id of Object.keys(STORYLINE_HUNDRED.endings))
      expect(
        STORYLINE_HUNDRED.extra.some((s) => s.id === `end-hundred-${id}`),
        id,
      ).toBe(true);
  });

  it('starts with one egg as the partner, its span stretched to the hundred days', () => {
    const { world } = storylineWorld('hundred');
    expect(world.nubbins.length).toBe(3); // the two starter eggs stay, plus the partner
    const p = partner(world);
    expect(p.stage).toBe('egg');
    expect(world.partners[0]).toBe(p.id);
    expect(p.spanScale).toBe(STORYLINES.hundredSpanScale);
    expect(lifespanMs(p)).toBeGreaterThan(14 * 86_400_000);
    expect(journalView(world, c(world), false)?.areas.length).toBe(6);
  });

  it('plays to the Fold with the bathhouse steaming', () => {
    const { world, events } = storylineWorld('hundred');
    toTheLastDay(world, events, { recruits: 6, moody: false });
    expect(finish(world, events)).toBe('the-fold');
    expect(c(world).seen).toContain('end-hundred-the-fold');
    expect(c(world).chapter).toBe(11);
  });

  it('plays to the Bright Fold at a full square', () => {
    const { world, events } = storylineWorld('hundred');
    toTheLastDay(world, events, { recruits: 10, moody: false });
    expect(finish(world, events)).toBe('bright-fold');
  });

  it('plays to the Quiet Fold when the square stays half empty', () => {
    const { world, events } = storylineWorld('hundred');
    toTheLastDay(world, events, { recruits: 5, moody: false });
    world.town.prosperity = TOWN.unlocks.gym;
    expect(finish(world, events)).toBe('quiet-fold');
  });

  it('plays to a Grey Lamp when the slips made the partner moody', () => {
    const { world, events } = storylineWorld('hundred');
    toTheLastDay(world, events, { recruits: 10, moody: true });
    expect(finish(world, events)).toBe('grey-fold');
  });

  // Run 8 (SR-20261023-430, 414): the naming choice gets Ida's reply on screen, which her
  // chapter 10 lines call back to, and her grave line at the Hush reads straight.
  it('answers the naming choice at once and keeps the chapter 10 callback for each', () => {
    const close = STORYLINE_HUNDRED.chapters[0]!.closing;
    for (const id of ['quick', 'slow']) {
      const choice = close.choices?.find((x) => x.id === id);
      expect(choice?.then?.[0]?.who, id).toBe('h-ida');
      const beats = STORYLINE_HUNDRED.chapters[9]!.beats ?? [];
      expect(
        beats.some((b) => b.when === `flag:h-first-name:${id}`),
        id,
      ).toBe(true);
    }
    const hush = STORYLINE_HUNDRED.chapters[8]!.closing.lines.map((l) => l.text).join(' ');
    expect(hush).toContain('nobody stood in front of it but me');
    expect(hush).not.toContain('I did.');
  });
});
