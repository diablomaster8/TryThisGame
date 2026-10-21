import { describe, expect, it } from 'vitest';
import { STORYLINE_DAWN, STORYLINE_DUSK } from '../../src/content/storyline-dawndusk';
import { SCANS } from '../../src/config/tuning';
import { goalMet } from '../../src/sim/campaign';
import { degenerate, degenerationTarget, isDegenerated, restore } from '../../src/sim/degeneration';
import { evolve, hatch, rebirth } from '../../src/sim/lifecycle';
import type { Nubbin, SimEvent, World } from '../../src/sim/types';
import { applyCommand, createWorld } from '../../src/sim/world';
import { c, settle, storylineWorld, toChapter } from './storyline-driver';

function belt(world: World, events: SimEvent[], tier: number): void {
  const n = world.nubbins.find((x) => x.stage !== 'egg') ?? world.nubbins[0]!;
  applyCommand(world, { kind: 'karateResult', nubbinId: n.id, won: true, tier, shells: 0 }, events);
}

/** Hatch, grow one Nubbin up, and reach the cause chapter with the reverted one still an egg. */
function toTheCause(world: World, events: SimEvent[]): string {
  expect(toChapter(world, events, 1)).toBe(true);
  for (const n of world.nubbins)
    applyCommand(world, { kind: 'debugHatchNow', nubbinId: n.id }, events);
  expect(toChapter(world, events, 2)).toBe(true);
  const grown = world.nubbins[0]!;
  grown.stage = 'adult';
  grown.ageMs = 5_000_000;
  grown.form = { band: 'sun', type: 'fly', second: null, leanAtEvolution: { ...grown.typeLean } };
  world.scans.puffbud = SCANS.full;
  expect(toChapter(world, events, 3)).toBe(true);
  // The reverting took the oldest grown one.
  expect(c(world).flags['dd-reverted']).toBe(grown.id);
  expect(grown.stage).toBe('egg');
  expect(isDegenerated(grown)).toBe(true);
  belt(world, events, 1);
  expect(toChapter(world, events, 4)).toBe(true);
  world.scans.zapling = SCANS.full;
  expect(goalMet(world, c(world))).toBe(false);
  applyCommand(world, { kind: 'convertScan', species: 'zapling' }, events);
  expect(goalMet(world, c(world))).toBe(true);
  expect(toChapter(world, events, 5)).toBe(true);
  belt(world, events, 2);
  // Chapter 6's opening carries the cause, so `finish` answers it with the choice.
  return grown.id;
}

function finish(world: World, events: SimEvent[], side: string, cause: string): string {
  expect(
    settle(world, events, () => c(world).chapter === 7 && c(world).step === 1, 40, {
      [`${side}-c6-open`]: cause,
    }),
  ).toBe(true);
  belt(world, events, 3);
  settle(world, events, () => c(world).ending !== null, 20);
  return c(world).ending ?? '';
}

describe('degeneration', () => {
  it('reverts a grown Nubbin to its own egg and can put it back while it is still that egg', () => {
    const world = createWorld(9, 0);
    const events: SimEvent[] = [];
    const n = world.nubbins[0]!;
    hatch(n, events, 0);
    n.stage = 'adult';
    n.ageMs = 1_000;
    n.form = { band: 'moon', type: 'run', second: null, leanAtEvolution: { ...n.typeLean } };
    n.stats.run.points = 777;
    expect(degenerate(world, n, events)).toBe(true);
    expect(n.stage).toBe('egg');
    expect(n.form).toBeNull();
    expect(n.stats.run.points).toBe(777);
    expect(n.rebirths).toBe(0);
    expect(degenerate(world, n, events)).toBe(false);
    expect(restore(n, events)).toBe(true);
    expect(n.stage).toBe('adult');
    expect(n.form?.type).toBe('run');
    expect(isDegenerated(n)).toBe(false);
    expect(events.filter((e) => e.kind === 'degenerated' || e.kind === 'restored').length).toBe(2);
    // Once it has hatched again there is nothing to put back.
    degenerate(world, n, events);
    n.stage = 'child';
    expect(restore(n, events)).toBe(false);
    expect(isDegenerated(n)).toBe(false);
  });
});

describe('S4 Dawn & Dusk', () => {
  it('has two mirrored halves with seven chapters and three endings each', () => {
    for (const s of [STORYLINE_DAWN, STORYLINE_DUSK]) {
      expect(s.chapters.length).toBe(7);
      for (const id of Object.keys(s.endings))
        expect(
          s.extra.some((x) => x.id === `end-${s.id}-${id}`),
          `${s.id} ${id}`,
        ).toBe(true);
    }
    expect(STORYLINE_DAWN.chapters[0]!.title).not.toBe(STORYLINE_DUSK.chapters[0]!.title);
  });

  it('Dawn: the real cause restores the reverted one and ends at First Light', () => {
    const { world, events } = storylineWorld('dawn', 'fern');
    expect(c(world).flags.side).toBe('dawn');
    const id = toTheCause(world, events);
    expect(finish(world, events, 'dawn', 'lamp')).toBe('half-day');
    expect(world.nubbins.find((n) => n.id === id)?.stage).toBe('adult');
    expect(c(world).seen).toContain('dawn-c6-restored');
  });

  it('Dusk: the wrong cause leaves the egg to hatch small again', () => {
    const { world, events } = storylineWorld('dusk', 'luna');
    const id = toTheCause(world, events);
    expect(finish(world, events, 'dusk', 'mist')).toBe('wrong-cause');
    expect(world.nubbins.find((n) => n.id === id)?.stage).toBe('egg');
    expect(c(world).seen).toContain('dusk-c6-wrong');
  });

  it('a half started after the other reached an ending sees the whole day', () => {
    const world = createWorld(31, 0);
    const events: SimEvent[] = [];
    applyCommand(world, { kind: 'setTrainer', id: 'luna' }, events);
    applyCommand(
      world,
      { kind: 'storylineStart', id: 'dusk', flags: { 'dd-other-done': true } },
      events,
    );
    toTheCause(world, events);
    expect(finish(world, events, 'dusk', 'bell')).toBe('whole-day');
  });
});

// Review 2026-10-21, Bug 4: degeneration must never make an Eternal egg or child, and a
// Nubbin that grows up a second time in one life gets no second grade upgrade.
describe('degeneration and the once-a-life rules', () => {
  function grownAdult(world: World): Nubbin {
    const n = world.nubbins[0]!;
    hatch(n, [], 0);
    n.stage = 'adult';
    n.ageMs = 1_000;
    n.form = { band: 'sun', type: 'normal', second: null, leanAtEvolution: { ...n.typeLean } };
    return n;
  }

  it('passes Eternals by: neither the target nor degenerate takes them', () => {
    const world = createWorld(9, 0);
    const n = grownAdult(world);
    n.eternal = 'sun';
    n.rebirths = 2;
    const events: SimEvent[] = [];
    expect(degenerationTarget(world)).toBeUndefined();
    expect(degenerate(world, n, events)).toBe(false);
    expect(n.stage).toBe('adult');
    expect(n.eternal).toBe('sun');
  });

  it('Dawn & Dusk chapter 3 skips an Eternal and reverts the next oldest', () => {
    const { world, events } = storylineWorld('dawn', 'fern');
    expect(toChapter(world, events, 1)).toBe(true);
    for (const n of world.nubbins)
      applyCommand(world, { kind: 'debugHatchNow', nubbinId: n.id }, events);
    expect(toChapter(world, events, 2)).toBe(true);
    const [eternal, other] = world.nubbins;
    for (const n of [eternal!, other!]) {
      n.stage = 'adult';
      n.form = { band: 'sun', type: 'fly', second: null, leanAtEvolution: { ...n.typeLean } };
    }
    eternal!.ageMs = 9_000_000;
    eternal!.eternal = 'neutral';
    eternal!.rebirths = 2;
    eternal!.form!.type = 'normal';
    other!.ageMs = 5_000_000;
    world.scans.puffbud = SCANS.full;
    expect(toChapter(world, events, 3)).toBe(true);
    expect(eternal!.stage).toBe('adult');
    expect(eternal!.eternal).toBe('neutral');
    expect(c(world).flags['dd-reverted']).toBe(other!.id);
    expect(other!.stage).toBe('egg');
  });

  it('a reverted adult that grows up again gets no second grade upgrade', () => {
    const world = createWorld(9, 0);
    const n = grownAdult(world);
    for (const s of Object.values(n.stats)) s.grade = 'C';
    n.stats.run.points = 900;
    n.gradeUpgrades = { run: 1 };
    n.stats.run.grade = 'B';
    expect(degenerate(world, n, [])).toBe(true);
    hatch(n, [], 0);
    const events: SimEvent[] = [];
    const upgraded = evolve(n, events, world);
    expect(upgraded).toBeNull();
    expect(n.stats.run.grade).toBe('B');
    expect(n.gradeUpgrades).toEqual({ run: 1 });
    // A new life after rebirth upgrades again.
    rebirth(n, []);
    hatch(n, [], 0);
    expect(evolve(n, [], world)).not.toBeNull();
  });

  it('a child that reverts and evolves still gets its first upgrade', () => {
    const world = createWorld(9, 0);
    const n = world.nubbins[0]!;
    hatch(n, [], 0);
    expect(degenerate(world, n, [])).toBe(true);
    hatch(n, [], 0);
    expect(evolve(n, [], world)).not.toBeNull();
  });

  it('evolve clears a stray Eternal flag when the rules are not met', () => {
    const world = createWorld(9, 0);
    const n = world.nubbins[0]!;
    hatch(n, [], 0);
    n.eternal = 'sun';
    n.rebirths = 0;
    evolve(n, [], world);
    expect(n.eternal).toBeNull();
  });
});
