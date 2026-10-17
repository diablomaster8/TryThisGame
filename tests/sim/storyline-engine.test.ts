import { describe, expect, it } from 'vitest';
import type { Storyline } from '../../src/content/types';
import { SIM } from '../../src/config/tuning';
import { ENDINGS, SPEAKERS } from '../../src/config/story';
import { goalMet } from '../../src/sim/campaign';
import { deserialize, MIGRATIONS, SAVE_VERSION, serialize } from '../../src/sim/save';
import { registerStorylineRule } from '../../src/sim/storyline-rules';
import { checkMet } from '../../src/sim/storyline-checks';
import { chapterTitle, journalView } from '../../src/sim/storyline';
import { registerStorylines, sceneById } from '../../src/sim/story-scenes';
import type { SimEvent, World } from '../../src/sim/types';
import { applyCommand, createWorld, stepWorld } from '../../src/sim/world';
import { playScenes } from './campaign-driver';

/** A three-chapter storyline that exercises every part of the machine. */
const line = (who: string, text: string) => ({ who, text });
const TEST_LINE: Storyline = {
  id: 'test-line',
  code: 'T0',
  title: 'The Test Line',
  tagline: 'For the engine.',
  source: 'none',
  audience: 'all',
  speakers: [{ id: 't-guide', name: 'The Guide', kind: 'other' }],
  chapters: [
    {
      n: 1,
      title: 'Hatch',
      opening: { id: 't-c1-open', lines: [line('t-guide', 'Hatch one.')] },
      goal: 'stat:hatched:>=1',
      goalText: 'Hatch a Nubbin.',
      hint: 'Shake the egg.',
      closing: { id: 't-c1-close', lines: [line('narrator', 'It hatched.')] },
    },
    {
      n: 2,
      title: 'Walk',
      opening: { id: 't-c2-open', lines: [line('t-guide', 'Go to the shore.')] },
      goal: 'area:shore&act:wave',
      goalText: 'Reach the shore and wave.',
      hint: 'The journal has a button.',
      closing: {
        id: 't-c2-close',
        lines: [line('narrator', 'You waved.')],
        choices: [
          { id: 'kind', label: 'Kindly', set: { tone: 'kind' } },
          { id: 'curt', label: 'Curtly', set: { tone: 'curt' } },
        ],
      },
      beats: [
        { when: 'area:shore', scene: { id: 't-c2-beat', lines: [line('narrator', 'Waves.')] } },
      ],
    },
    {
      n: 3,
      title: 'Wait',
      opening: { id: 't-c3-open', lines: [line('t-guide', 'Wait a day.')] },
      goal: 'days:>=1',
      goalText: 'Let a story day pass.',
      hint: 'Time does it.',
      closing: { id: 't-c3-close', lines: [line('narrator', 'A day passed.')] },
    },
  ],
  endings: {
    warm: { title: 'Warm', how: 'Answer kindly at the shore.' },
    cool: { title: 'Cool', how: 'Answer curtly at the shore.' },
  },
  extra: [
    { id: 'end-test-line-warm', lines: [line('narrator', 'Warm end.')] },
    { id: 'end-test-line-cool', lines: [line('narrator', 'Cool end.')] },
  ],
};

registerStorylines([TEST_LINE]);
registerStorylineRule({
  id: 'test-line',
  areas: ['meadow', 'shore'],
  setup: (world) => {
    world.inventory.shells = 7;
  },
  endingFor: (_w, c) => (c.flags.tone === 'kind' ? 'warm' : 'cool'),
  actions: () => [{ id: 'ping', command: { kind: 'storyAct', label: 'ping' }, enabled: true }],
});

function start(): { world: World; events: SimEvent[] } {
  const world = createWorld(21, 0);
  const events: SimEvent[] = [];
  applyCommand(world, { kind: 'setTrainer', id: 'luna' }, events);
  applyCommand(world, { kind: 'storylineStart', id: 'test-line' }, events);
  return { world, events };
}

function tick(world: World, events: SimEvent[], seconds: number): void {
  const steps = Math.ceil((seconds * 1000) / SIM.stepMs);
  for (let i = 0; i < steps; i++) {
    for (const n of world.nubbins) {
      n.needs.hunger = 1;
      n.needs.energy = 1;
    }
    events.push(...stepWorld(world, SIM.stepMs));
  }
}

describe('storyline registry', () => {
  it('registers scenes, speakers and prefixed endings', () => {
    expect(sceneById('t-c1-open')).toBeDefined();
    expect(sceneById('end-test-line-warm')).toBeDefined();
    expect(SPEAKERS['t-guide']?.name).toBe('The Guide');
    expect(ENDINGS['test-line-warm']?.title).toBe('Warm');
  });
});

describe('storyline machine', () => {
  it('starts with the rule setup and the first opening', () => {
    const { world, events } = start();
    expect(world.campaign?.storyline).toBe('test-line');
    expect(world.campaign?.chapter).toBe(1);
    expect(world.inventory.shells).toBe(7);
    expect(events.some((e) => e.kind === 'storylineStarted')).toBe(true);
    tick(world, events, 1.1);
    expect(world.campaign?.queue[0]).toBe('t-c1-open');
    expect(chapterTitle(world.campaign, 1)).toBe('Hatch');
  });

  it('walks every chapter: counters, areas, acts, beats, days, then an ending by choice', () => {
    const { world, events } = start();
    tick(world, events, 1.1);
    playScenes(world, events);
    const c = world.campaign!;
    expect(c.step).toBe(1);
    expect(goalMet(world, c)).toBe(false);
    for (const n of world.nubbins)
      if (n.stage === 'egg') applyCommand(world, { kind: 'debugHatchNow', nubbinId: n.id }, events);
    tick(world, events, 1.1);
    expect(goalMet(world, c)).toBe(true);
    tick(world, events, 1.1);
    expect(c.queue[0]).toBe('t-c1-close');
    playScenes(world, events);
    expect(c.chapter).toBe(2);
    playScenes(world, events);
    expect(c.seen).toContain('t-c2-open');
    // Travel: the beat plays on arrival; the goal still waits for the act.
    applyCommand(world, { kind: 'storyArea', area: 'nowhere' }, events);
    expect(c.flags.area).toBeUndefined();
    applyCommand(world, { kind: 'storyArea', area: 'shore' }, events);
    expect(events.some((e) => e.kind === 'areaChanged')).toBe(true);
    tick(world, events, 1.1);
    expect(c.queue[0]).toBe('t-c2-beat');
    playScenes(world, events);
    expect(goalMet(world, c)).toBe(false);
    const view = journalView(world, c, false)!;
    expect(view.act).toBe('wave');
    expect(view.areas).toEqual(['meadow', 'shore']);
    expect(view.actions[0]?.id).toBe('ping');
    applyCommand(world, { kind: 'storyAct', label: 'wave' }, events);
    expect(goalMet(world, c)).toBe(true);
    tick(world, events, 1.1);
    playScenes(world, events, { 't-c2-close': 'curt' });
    expect(c.flags.tone).toBe('curt');
    expect(c.chapter).toBe(3);
    // Acts are cleared between chapters.
    expect(c.flags['act:wave']).toBeUndefined();
    playScenes(world, events);
    expect(goalMet(world, c)).toBe(false);
    tick(world, events, 121);
    expect(goalMet(world, c)).toBe(true);
    tick(world, events, 1.1);
    playScenes(world, events);
    expect(c.ending).toBe('cool');
    expect(c.chapter).toBe(4);
    expect(c.seen).toContain('end-test-line-cool');
    expect(events.some((e) => e.kind === 'ending' && e.ending === 'test-line-cool')).toBe(true);
    expect(journalView(world, c, false)?.ending).toBe('cool');
  });

  it('survives a save round trip and the v4 → v5 migration', () => {
    const { world, events } = start();
    tick(world, events, 1.1);
    const back = deserialize(serialize(world, 1)).world;
    expect(back.campaign?.storyline).toBe('test-line');
    expect(back.campaign?.queue).toEqual(['t-c1-open']);
    const old = JSON.parse(serialize(world, 1)) as {
      version: number;
      world: { campaign: Record<string, unknown> };
    };
    old.version = 4;
    delete old.world.campaign.storyline;
    const migrated = deserialize(JSON.stringify(old));
    expect(migrated.version).toBe(SAVE_VERSION);
    expect(migrated.world.campaign?.storyline).toBeNull();
    expect(MIGRATIONS.length).toBe(SAVE_VERSION - 1);
  });
});

describe('storyline checks', () => {
  it('reads comparisons, combinators and unknown keys safely', () => {
    const { world } = start();
    const c = world.campaign!;
    world.inventory.shells = 10;
    expect(checkMet(world, c, 'shells:>=10')).toBe(true);
    expect(checkMet(world, c, 'shells:>10')).toBe(false);
    expect(checkMet(world, c, 'shells:<=10&shells:=10')).toBe(true);
    expect(checkMet(world, c, 'shells:<5|shells:5')).toBe(true);
    expect(checkMet(world, c, 'nonsense:3')).toBe(false);
    expect(checkMet(world, c, 'any')).toBe(true);
    c.flags.tone = 'kind';
    expect(checkMet(world, c, 'flag:tone:kind')).toBe(true);
    expect(checkMet(world, c, 'flag:tone:curt')).toBe(false);
    expect(checkMet(world, c, 'count:hatched:1')).toBe(false);
    c.flags['n:hatched'] = 2;
    expect(checkMet(world, c, 'count:hatched:1')).toBe(true);
  });
});
