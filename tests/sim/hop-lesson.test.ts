import { describe, expect, it } from 'vitest';
import { stepHopLesson } from '../../src/sim/hop-lesson';
import { deserialize, serialize } from '../../src/sim/save';
import { createWorld } from '../../src/sim/world';
import type { SimEvent, Vec2, World } from '../../src/sim/types';

// MOVE-58: the one-time hop lesson: shown once near the stream or a log, done on the first clear.

// A straight stretch of the outflow, and the way across it.
const a = { x: 8.2, z: 11.6 };
const b = { x: 9.5, z: 16 };
const mid = { x: (a.x + b.x) / 2, z: (a.z + b.z) / 2 };
const len = Math.hypot(b.x - a.x, b.z - a.z);
const across = { x: (b.z - a.z) / len, z: -(b.x - a.x) / len };
const bank = (s: number): Vec2 => ({ x: mid.x + across.x * s, z: mid.z + across.z * s });

function at(w: World, p: Vec2, grounded = true): SimEvent[] {
  w.keeper.pos = { ...p };
  w.keeper.grounded = grounded;
  const ev: SimEvent[] = [];
  stepHopLesson(w, ev);
  return ev;
}

const lessons = (ev: SimEvent[]) => ev.filter((e) => e.kind === 'hopLesson');

describe('the hop lesson (MOVE-58)', () => {
  it('shows once near the stream, not out in the meadow', () => {
    const w = createWorld(1, 0);
    expect(lessons(at(w, { x: -30, z: -30 }))).toEqual([]);
    expect(lessons(at(w, bank(-3)))).toEqual([
      { kind: 'hopLesson', stage: 'shown', near: 'stream' },
    ]);
    expect(w.hopLesson).toBe('shown');
    expect(lessons(at(w, bank(-2.5)))).toEqual([]);
  });

  it('a hop that lands on the same bank does not complete it; one across does, with a heart', () => {
    const w = createWorld(1, 0);
    at(w, bank(-3));
    // A hatched Nubbin close by, to cheer.
    const n = w.nubbins[0]!;
    n.stage = 'child';
    n.pos = bank(3);
    at(w, bank(-2.8), false);
    expect(lessons(at(w, bank(-2.2)))).toEqual([]);
    expect(w.hopLesson).toBe('shown');
    at(w, bank(-1.6), false);
    const ev = at(w, bank(1.7));
    expect(lessons(ev)).toEqual([{ kind: 'hopLesson', stage: 'done', near: null }]);
    expect(w.hopLesson).toBe('done');
    expect(ev.some((e) => e.kind === 'reaction' && e.reaction === 'love')).toBe(true);
  });

  it('never again once done, across a save and load', () => {
    const w = createWorld(1, 0);
    w.hopLesson = 'done';
    const back = deserialize(serialize(w, 0)).world;
    expect(lessons(at(back, bank(-3)))).toEqual([]);
    expect(back.hopLesson).toBe('done');
  });
});
