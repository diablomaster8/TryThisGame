import { describe, expect, it } from 'vitest';
import { SIM } from '../../src/config/tuning';
import { queueQuestEvents } from '../../src/sim/quests';
import { MISSION_COUNT } from '../../src/sim/teams';
import type { SimEvent } from '../../src/sim/types';
import { applyCommand, createWorld, stepWorld } from '../../src/sim/world';

// No daily or repeatable chores: every reward is one-time (review 2026-10-18 B, Bug 3).
const DAY = 86_400_000;
const day = (n: number) => Date.UTC(2026, 9, 1, 12) + n * DAY;

describe('the request board is one-time, not daily', () => {
  it('a new real day does not replace the open requests', () => {
    const world = createWorld(3, 0);
    stepWorld(world, SIM.stepMs, day(0));
    const first = world.quests.map((q) => q.id);
    expect(first).toHaveLength(3);
    stepWorld(world, SIM.stepMs, day(1));
    stepWorld(world, SIM.stepMs, day(9));
    expect(world.quests.map((q) => q.id)).toEqual(first);
  });

  it('each request is offered once, ever, however many days pass', () => {
    const world = createWorld(5, 0);
    const offered: string[] = [];
    let shells = 0;
    for (let d = 0; d < 60; d++) {
      stepWorld(world, SIM.stepMs, day(d));
      for (const q of world.quests) {
        if (q.claimed) continue;
        if (!offered.includes(q.id)) offered.push(q.id);
        q.progress = q.target;
        const events: SimEvent[] = [];
        applyCommand(world, { kind: 'claimQuest', id: q.id }, events);
        for (const e of events) if (e.kind === 'questClaimed') shells += e.shells;
      }
    }
    const templates = world.quests.map((q) => q.template);
    expect(new Set(templates).size).toBe(templates.length);
    expect(offered.length).toBe(templates.length);
    expect(offered.length).toBeLessThanOrEqual(15);
    // Bounded: a few hundred Shells in all, not 45-50 a day for ever.
    expect(shells).toBeLessThan(1500);
  });

  it('the Hollow request counts any descent, not only the shared cave', () => {
    const world = createWorld(3, 0);
    stepWorld(world, SIM.stepMs, day(0));
    // Put the Hollow request on the board by hand.
    const q = world.quests[0]!;
    q.template = 'hollow';
    q.progress = 0;
    queueQuestEvents(world, [{ kind: 'descended', depth: 2, daily: false }]);
    stepWorld(world, SIM.stepMs, day(0));
    expect(q.progress).toBe(1);
  });
});

describe('guard team missions are one-time, not weekly', () => {
  it('a new week does not bring a new mission', () => {
    const world = createWorld(1, 0);
    applyCommand(world, { kind: 'joinTeam', team: 'dusk' }, []);
    stepWorld(world, SIM.stepMs, day(0));
    const m = world.team!.mission;
    expect(m).not.toBeNull();
    stepWorld(world, SIM.stepMs, day(8));
    stepWorld(world, SIM.stepMs, day(30));
    expect(world.team!.mission).toBe(m);
  });

  it('finishing missions over many weeks pays out a fixed number of times', () => {
    const world = createWorld(1, 0);
    applyCommand(world, { kind: 'joinTeam', team: 'dawn' }, []);
    let done = 0;
    for (let week = 0; week < 40; week++) {
      const m = world.team!.mission;
      if (m && !m.done) m.progress = m.target;
      const events = stepWorld(world, SIM.stepMs, day(week * 7));
      done += events.filter((e) => e.kind === 'missionDone').length;
      stepWorld(world, SIM.stepMs, day(week * 7));
    }
    expect(done).toBe(MISSION_COUNT);
    expect(world.team!.points).toBeLessThanOrEqual(MISSION_COUNT * 10);
  });
});
