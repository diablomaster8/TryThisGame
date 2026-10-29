import { describe, expect, it } from 'vitest';
import { SIM } from '../../src/config/tuning';
import { HOP_COURSE } from '../../src/config/tuning-move';
import { cosmetic } from '../../src/config/cosmetics';
import { hopCourseRun, hopMedal, stepHopCourse } from '../../src/sim/hop-course';
import { keeperFooting } from '../../src/sim/keeper';
import type { SimEvent, World } from '../../src/sim/types';
import { createWorld } from '../../src/sim/world';

// MOVE-63: the hop course: opens after the hop lesson, runs flag to flag, gives the hat once.

function standOn(w: World, p: { x: number; z: number }): void {
  w.keeper.pos = { ...p };
  w.keeper.y = keeperFooting(w, p.x, p.z).y;
}

function step(w: World, ev: SimEvent[]): void {
  w.timeMs += SIM.stepMs;
  stepHopCourse(w, ev);
}

function runCourse(w: World, ev: SimEvent[]): void {
  standOn(w, HOP_COURSE.start);
  step(w, ev);
  for (const f of HOP_COURSE.flags) {
    standOn(w, { x: f.x + 3, z: f.z });
    for (let i = 0; i < 30; i++) step(w, ev);
    standOn(w, f);
    step(w, ev);
  }
}

describe('hop course (MOVE-63)', () => {
  it('stays shut until the hop lesson is done', () => {
    const w = createWorld(2, 0);
    const ev: SimEvent[] = [];
    standOn(w, HOP_COURSE.start);
    step(w, ev);
    expect(hopCourseRun(w)).toBeNull();
    expect(ev).toEqual([]);
  });

  it('every flag stands on dry ground or a top, never in the water', () => {
    const w = createWorld(2, 0);
    for (const f of [HOP_COURSE.start, ...HOP_COURSE.flags])
      expect(keeperFooting(w, f.x, f.z).on).not.toBe('water');
  });

  it('records a run, its ghost and the medal, and gives the hat only once', () => {
    const w = createWorld(2, 0);
    w.hopLesson = 'done';
    const ev: SimEvent[] = [];
    runCourse(w, ev);
    const done = ev.filter((e) => e.kind === 'hopCourse' && e.stage === 'finish');
    expect(done).toHaveLength(1);
    const fin = done[0]!;
    if (fin.kind !== 'hopCourse' || fin.stage !== 'finish') throw new Error('no finish');
    expect(ev.filter((e) => e.kind === 'hopCourse' && e.stage === 'flag')).toHaveLength(
      HOP_COURSE.flags.length - 1,
    );
    expect(fin.ms).toBe(HOP_COURSE.flags.length * 31 * SIM.stepMs);
    expect(fin.ghost.length).toBe((fin.ms / SIM.stepMs) * 3);
    expect(fin.hat).toBe(true);
    expect(hopMedal(fin.ms)).toBe('gold');
    expect(w.inventory.hats.filter((h) => h === HOP_COURSE.hat)).toHaveLength(1);
    // Finishing on the start flag does not start another run until the Keeper steps off.
    step(w, ev);
    expect(hopCourseRun(w)).toBeNull();
    const ev2: SimEvent[] = [];
    standOn(w, { x: 10, z: 0 });
    step(w, ev2);
    runCourse(w, ev2);
    const again = ev2.find((e) => e.kind === 'hopCourse' && e.stage === 'finish');
    expect(again && again.kind === 'hopCourse' && again.stage === 'finish' && again.hat).toBe(
      false,
    );
    expect(w.inventory.hats.filter((h) => h === HOP_COURSE.hat)).toHaveLength(1);
    expect(cosmetic(HOP_COURSE.hat)?.slot).toBe('hat');
  });

  it('a flag up on a rock needs the rock top, and a run gives up in time', () => {
    const w = createWorld(2, 0);
    w.hopLesson = 'done';
    const ev: SimEvent[] = [];
    standOn(w, HOP_COURSE.start);
    step(w, ev);
    const rock = HOP_COURSE.flags[0];
    w.keeper.pos = { x: rock.x + 0.8, z: rock.z };
    w.keeper.y = 0;
    step(w, ev);
    expect(hopCourseRun(w)?.next).toBe(0);
    for (let t = 0; t <= HOP_COURSE.giveUpMs; t += SIM.stepMs) step(w, ev);
    expect(hopCourseRun(w)).toBeNull();
    expect(ev.some((e) => e.kind === 'hopCourse' && e.stage === 'gaveUp')).toBe(true);
  });
});
