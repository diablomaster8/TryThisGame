import { describe, expect, it } from 'vitest';
import { STORY } from '../../src/config/tuning';
import { sceneById } from '../../src/sim/story-scenes';
import { sideBefore, sideVariant, stepSideStories } from '../../src/sim/side-stories';
import { nextDawn } from '../../src/sim/story-state';
import type { CampaignState, Command, World } from '../../src/sim/types';
import { applyCommand } from '../../src/sim/world';
import { c, campaignWorld, moss } from './campaign-driver';

/**
 * Run 22's wiring (SR-20261027-1194, -1195, -1249): S24's variant scenes, S25's spring
 * coda and Moss's idle line, S26's three evenings, and the ambient scenes after S23, S24,
 * S28 and S29.
 */

/** A quiet campaign: nothing queued, no breather running. */
function quiet(): { world: World; cs: CampaignState } {
  const { world } = campaignWorld();
  const cs = c(world);
  cs.queue = [];
  cs.rest = null;
  return { world, cs };
}

/** Answer scene `id`, then clear the queue and the breather. */
function finish(world: World, id: string): void {
  applyCommand(world, { kind: 'sceneDone', scene: id, choice: null }, []);
  c(world).queue = [];
  c(world).rest = null;
}

/** Daytime, the morning after `ms`. */
const morningAfter = (ms: number): number => nextDawn(ms) + STORY.dayMs * 0.1;

/** The post-game: the ending has played, and it is daytime the morning after. */
function postGame(world: World, cs: CampaignState, ending = 'open'): void {
  cs.chapter = 13;
  cs.ending = ending;
  cs.seen.push(`end-${ending}-last`);
  cs.seenMs[`end-${ending}-last`] = world.timeMs;
  world.timeMs = morningAfter(world.timeMs);
  world.location = 'grove';
}

describe('S24 variants (SR-20261027-1194)', () => {
  const v = (world: World, scene: string) => sideVariant(world, c(world), 's24', scene);

  it('step 6: the bird keeps away from the Collector', () => {
    const { world, cs } = quiet();
    cs.ending = 'open';
    expect(v(world, 's24-bird')).toBe('s24-bird');
    cs.ending = 'collector';
    expect(v(world, 's24-bird')).toBe('s24-bird-collector');
    cs.flags.keptStone = true;
    expect(v(world, 's24-bird')).toBe('s24-bird-collector-kept');
  });

  it('step 12 done: the nest pays off the bird choice, Nova’s with the Collector', () => {
    const { world, cs } = quiet();
    for (const [ending, bird, want] of [
      ['open', 'fed', 's24-nest-fed'],
      ['open', 'waited', 's24-nest-waited'],
      ['collector', 'fed', 's24-nest-fed-collector'],
      ['collector', 'waited', 's24-nest-waited-collector'],
    ] as const) {
      cs.ending = ending;
      cs.flags['s24-bird'] = bird;
      expect(v(world, 's24-nest-fed')).toBe(want);
    }
  });

  it('step 14 done: the lights follow hazel and keptStone', () => {
    const { world, cs } = quiet();
    for (const [hazel, kept, want] of [
      ['secret', false, 's24-lights'],
      ['told', false, 's24-lights-told'],
      ['secret', true, 's24-lights-kept'],
      ['told', true, 's24-lights-told-kept'],
    ] as const) {
      cs.flags.hazel = hazel;
      cs.flags.keptStone = kept;
      expect(v(world, 's24-lights')).toBe(want);
    }
    delete cs.flags.hazel;
    cs.flags.keptStone = false;
    expect(v(world, 's24-lights')).toBe('s24-lights');
  });

  it('step 15: the tick follows what was left on the cairn', () => {
    const { world, cs } = quiet();
    expect(v(world, 's24-tick')).toBe('s24-tick');
    for (const [cairn, want] of [
      ['cup', 's24-tick'],
      ['scarf', 's24-tick-scarf'],
      ['book', 's24-tick-book'],
    ] as const) {
      cs.flags['s24-cairn'] = cairn;
      expect(v(world, 's24-tick')).toBe(want);
    }
  });

  it('every routed variant is written', () => {
    for (const id of [
      's24-bird-collector',
      's24-bird-collector-kept',
      's24-nest-waited',
      's24-nest-fed-collector',
      's24-nest-waited-collector',
      's24-lights-told',
      's24-lights-kept',
      's24-lights-told-kept',
      's24-tick-scarf',
      's24-tick-book',
      's24-lecture',
    ])
      expect(sceneById(id), id).toBeDefined();
  });

  it('the museum plays Fairweather’s lecture once, after S24 with S18', () => {
    const { world, cs } = quiet();
    const tap: Command = { kind: 'storyProp', prop: 'old-barn' };
    cs.flags.s24Done = true;
    applyCommand(world, tap, []);
    expect(cs.queue).not.toContain('s24-lecture');
    cs.flags.s18Done = true;
    applyCommand(world, tap, []);
    expect(cs.queue).toEqual(['s24-lecture']);
    finish(world, 's24-lecture');
    applyCommand(world, tap, []);
    expect(cs.queue).toEqual([]);
  });
});

describe('S25 spring coda and Moss (SR-20261027-1195)', () => {
  for (const name of ['button', 'bobble', 'mister'])
    for (const [toy, kind] of [
      ['gone', 'wild'],
      ['kept', 'coat'],
    ] as const)
      it(`plays s25-coda-${kind}-${name} once, the first post-game morning`, () => {
        const { world, cs } = quiet();
        cs.flags.s25Done = true;
        cs.flags['s25-name'] = name;
        cs.flags['s25-toy'] = toy;
        postGame(world, cs);
        stepSideStories(world, cs, []);
        const want = `s25-coda-${kind}-${name}`;
        expect(cs.queue[0]).toBe(want);
        finish(world, want);
        world.timeMs = morningAfter(world.timeMs);
        stepSideStories(world, cs, []);
        expect(cs.queue.filter((s) => s.startsWith('s25-coda'))).toEqual([]);
        expect(cs.seen.filter((s) => s.startsWith('s25-coda'))).toEqual([want]);
      });

  it('waits a day after S27’s spring, and never plays without s25Done', () => {
    const { world, cs } = quiet();
    cs.flags['s25-name'] = 'button';
    cs.flags['s25-toy'] = 'gone';
    cs.flags.s27Done = true;
    postGame(world, cs);
    stepSideStories(world, cs, []);
    expect(cs.queue[0]).toBe('s27-spring');
    finish(world, 's27-spring');
    stepSideStories(world, cs, []);
    expect(cs.queue.some((s) => s.startsWith('s25-coda'))).toBe(false);
    cs.queue = [];
    cs.flags.s25Done = true;
    stepSideStories(world, cs, []);
    expect(cs.queue.some((s) => s.startsWith('s25-coda'))).toBe(false);
    world.timeMs = morningAfter(world.timeMs);
    cs.queue = [];
    cs.rest = null;
    stepSideStories(world, cs, []);
    expect(cs.queue[0]).toBe('s25-coda-wild-button');
  });

  for (const [toy, want] of [
    ['kept', 's25-moss-kept'],
    ['gone', 's25-moss-gone'],
  ] as const)
    it(`the first Moss tap after S25 plays ${want}, once`, () => {
      const { world, cs } = quiet();
      const m = moss(world);
      expect(m).toBeDefined();
      const tap: Command = { kind: 'select', id: m!.id };
      cs.flags['s25-toy'] = toy;
      applyCommand(world, tap, []);
      expect(cs.queue).toEqual([]);
      cs.flags.s25Done = true;
      applyCommand(world, tap, []);
      expect(cs.queue).toEqual([want]);
      finish(world, want);
      applyCommand(world, tap, []);
      expect(cs.queue).toEqual([]);
    });
});

describe('scenes no rule played (SR-20261027-1249)', () => {
  it('S26 steps 6 to 8 open with the ramp or lift evening', () => {
    const { world, cs } = quiet();
    expect(sideBefore(world, cs, 's26', 5)).toEqual([]);
    for (const steps of ['ramp', 'lift']) {
      cs.flags['s26-steps'] = steps;
      expect(sideBefore(world, cs, 's26', 4)).toEqual([]);
      for (const n of [1, 2, 3]) {
        const want = `s26-${steps}-${n}`;
        expect(sideBefore(world, cs, 's26', 4 + n)).toEqual([want]);
        expect(sceneById(want), want).toBeDefined();
      }
      expect(sideBefore(world, cs, 's26', 8)).toEqual([]);
    }
  });

  it('Ember mentions the soup once, from chapter 11 after S23', () => {
    const { world, cs } = quiet();
    const npc = {
      id: 'npc-ember',
      trainer: 'ember',
      pos: { ...world.keeper.pos },
      facing: 0,
      target: null,
      waitMs: 0,
      home: { ...world.keeper.pos },
    };
    world.npcs = [npc];
    const talk: Command = { kind: 'talk', npcId: npc.id };
    cs.flags.s23Done = true;
    cs.chapter = 10;
    applyCommand(world, talk, []);
    expect(cs.queue).not.toContain('s23-ember-soup');
    cs.queue = [];
    cs.chapter = 11;
    applyCommand(world, talk, []);
    expect(cs.queue).toEqual(['s23-ember-soup']);
    finish(world, 's23-ember-soup');
    applyCommand(world, talk, []);
    expect(cs.queue).toEqual([]);
  });

  it('Byte’s news plays once at his house after S28', () => {
    const { world, cs } = quiet();
    const go: Command = { kind: 'visit', trainer: 'byte' };
    applyCommand(world, go, []);
    expect(cs.queue).toEqual([]);
    applyCommand(world, { kind: 'visit', trainer: null }, []);
    cs.flags.s28Done = true;
    applyCommand(world, go, []);
    expect(cs.queue).toEqual(['s28-byte-barks']);
  });

  it('Granny Brock’s knock plays once, the first Grove day after S29', () => {
    const { world, cs } = quiet();
    cs.flags.s29Done = true;
    cs.side.s29 = {
      status: 'done',
      step: 13,
      stage: 'complete',
      pending: null,
      openedMs: 0,
      sinceMs: world.timeMs,
      acted: false,
    };
    world.location = 'grove';
    cs.step = 1; // the chapter's opening has played
    stepSideStories(world, cs, []);
    expect(cs.queue).not.toContain('s29-brock-knock');
    world.timeMs = morningAfter(world.timeMs);
    stepSideStories(world, cs, []);
    expect(cs.queue).toContain('s29-brock-knock');
  });
});
