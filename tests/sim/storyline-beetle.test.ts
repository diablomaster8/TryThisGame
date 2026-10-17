import { describe, expect, it } from 'vitest';
import { STORYLINE_BEETLE } from '../../src/content/storyline-beetle';
import { goalMet } from '../../src/sim/campaign';
import { journalView } from '../../src/sim/storyline';
import type { SimEvent, World } from '../../src/sim/types';
import { applyCommand } from '../../src/sim/world';
import { c, settle, storylineWorld, toChapter } from './storyline-driver';

function win(world: World, events: SimEvent[]): void {
  const n = world.nubbins[0]!;
  applyCommand(
    world,
    { kind: 'karateResult', nubbinId: n.id, won: true, tier: 1, shells: 0 },
    events,
  );
}

function run(world: World, events: SimEvent[]): void {
  applyCommand(world, { kind: 'tankResult', shells: 10, wood: 1, stone: 1, won: true }, events);
}

/** Up to the fusion chapter, with two adult partners who are sure of the Keeper. */
function toTheFusion(world: World, events: SimEvent[]): void {
  expect(toChapter(world, events, 1)).toBe(true);
  applyCommand(world, { kind: 'joinTeam', team: 'dew' }, events);
  expect(toChapter(world, events, 2)).toBe(true);
  run(world, events);
  expect(toChapter(world, events, 3)).toBe(true);
  world.hollow.best = 2;
  expect(toChapter(world, events, 4)).toBe(true);
  // A win before the chapter opened does not count; one during it is the door.
  expect(c(world).flags['b-boss-1']).toBeUndefined();
  win(world, events);
  expect(c(world).flags['b-boss-1']).toBe(true);
  expect(toChapter(world, events, 5)).toBe(true);
  for (const n of world.nubbins) {
    applyCommand(world, { kind: 'debugHatchNow', nubbinId: n.id }, events);
    n.stage = 'adult';
    n.needs.affection = 100;
    n.trust = 90;
  }
  applyCommand(world, { kind: 'setPartner', slot: 0, nubbinId: world.nubbins[0]!.id }, events);
  applyCommand(world, { kind: 'setPartner', slot: 1, nubbinId: world.nubbins[1]!.id }, events);
}

function toTheEnd(world: World, events: SimEvent[], lever: 'stop' | 'keep'): string {
  expect(toChapter(world, events, 6)).toBe(true);
  run(world, events);
  run(world, events);
  world.hollow.best = 4;
  // Chapter 7's opening carries the lever; its goal is met as it plays.
  expect(
    settle(world, events, () => c(world).chapter === 8 && c(world).step === 1, 40, {
      'b-c7-open': lever,
    }),
  ).toBe(true);
  expect(c(world).flags['b-machine']).toBe(lever);
  win(world, events);
  settle(world, events, () => c(world).ending !== null, 20);
  return c(world).ending ?? '';
}

describe('S3 The Beetle Road', () => {
  it('is registered with eight chapters and three endings whose scenes exist', () => {
    expect(STORYLINE_BEETLE.chapters.length).toBe(8);
    for (const id of Object.keys(STORYLINE_BEETLE.endings))
      expect(
        STORYLINE_BEETLE.extra.some((s) => s.id === `end-beetle-${id}`),
        id,
      ).toBe(true);
  });

  it('fuses two partners on the road and ends Two As One under an open sky', () => {
    const { world, events } = storylineWorld('beetle', 'marina');
    toTheFusion(world, events);
    const view = journalView(world, c(world), false)!;
    expect(view.actions[0]).toMatchObject({ id: 'fuse', enabled: true });
    expect(goalMet(world, c(world))).toBe(false);
    applyCommand(world, { kind: 'fuse' }, events);
    expect(world.nubbins.length).toBe(1);
    expect(goalMet(world, c(world))).toBe(true);
    settle(world, events, () => c(world).seen.includes('b-c5-fused'), 10);
    expect(c(world).flags['b-fusion']).toBe('fused');
    expect(toTheEnd(world, events, 'stop')).toBe('two-as-one');
  });

  it('lets the Keeper refuse the fusion and ends under the open sky', () => {
    const { world, events } = storylineWorld('beetle', 'marina');
    toTheFusion(world, events);
    applyCommand(world, { kind: 'storyAct', label: 'refuse-the-fusion' }, events);
    settle(world, events, () => c(world).seen.includes('b-c5-refused'), 10);
    expect(c(world).flags['b-fusion']).toBe('refused');
    expect(world.nubbins.length).toBe(2);
    expect(toTheEnd(world, events, 'stop')).toBe('open-sky');
  });

  it('ends in steady rain when the machine is left running', () => {
    const { world, events } = storylineWorld('beetle', 'marina');
    toTheFusion(world, events);
    applyCommand(world, { kind: 'storyAct', label: 'refuse-the-fusion' }, events);
    expect(toTheEnd(world, events, 'keep')).toBe('steady-rain');
  });
});
