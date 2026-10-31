import { describe, expect, it } from 'vitest';
import { eduPhase, eduSessionPhase, eduYawnAct } from '../../src/sim/edu-session';
import { eduStartBreak, stepEdu } from '../../src/sim/edu';
import { Rng } from '../../src/sim/rng';
import { applyCommand, createWorld } from '../../src/sim/world';
import { summarize } from '../../src/platform/storage';
import { eduTagLabel } from '../../src/ui/kids-launch';

const MIN = 60_000;

describe('Lane E r9: the Learning Grove session arc (R0704)', () => {
  it('walks hello, main, care, second, wind-down at 23 min and goodnight at 25', () => {
    const at = (m: number) => eduPhase({ playedMs: m * MIN, sessionMinutes: 25 });
    expect(at(0)).toBe('hello');
    expect(at(5)).toBe('main');
    expect(at(12)).toBe('care');
    expect(at(18)).toBe('second');
    expect(at(22.9)).toBe('second');
    expect(at(23.1)).toBe('windDown');
    expect(at(25)).toBe('goodnight');
    expect(eduPhase({ playedMs: 0, sessionMinutes: 25 }, true)).toBe('goodnight');
  });

  it('a simulated 25-minute session reads its phase from live play, and the break is goodnight', () => {
    const t0 = new Date(2026, 9, 30, 10, 0).getTime();
    const w = createWorld(1, t0);
    expect(eduSessionPhase(w, t0)).toBeNull();
    applyCommand(w, { kind: 'eduStart', age: 4 }, []);
    for (let i = 0; i < 23.5 * 60 * 10; i++) stepEdu(w, 100, t0 + i * 100);
    expect(eduSessionPhase(w, t0 + 23.5 * MIN)).toBe('windDown');
    for (let i = 0; i < 1.5 * 60 * 10; i++) stepEdu(w, 100, t0 + 23.5 * MIN + i * 100);
    expect(eduSessionPhase(w, t0 + 25 * MIN)).toBe('goodnight');
    w.lastWallMs = t0 + 25 * MIN;
    eduStartBreak(w);
    expect(eduSessionPhase(w, t0 + 26 * MIN)).toBe('goodnight');
  });
});

describe('Lane E r9: the wind-down yawn (R0724)', () => {
  it('yawns only in the wind-down, and never draws the rng outside it', () => {
    const w = createWorld(1, 0);
    applyCommand(w, { kind: 'eduStart', age: 4 }, []);
    const n = w.nubbins[0]!;
    n.stage = 'child';
    const rng = new Rng(7);
    const before = rng.next();
    const rng2 = new Rng(7);
    expect(eduYawnAct(n, w, rng2)).toBeNull();
    expect(rng2.next()).toBe(before);
    w.edu!.playedMs = 24 * MIN;
    let yawns = 0;
    const r = new Rng(3);
    for (let i = 0; i < 200; i++) if (eduYawnAct(n, w, r)?.itemId === 'yawn') yawns++;
    expect(yawns).toBeGreaterThan(40);
    n.stage = 'egg';
    expect(eduYawnAct(n, w, r)).toBeNull();
  });
});

describe('Lane E r9: a child’s own Grove (R0696)', () => {
  it('keeps a listed icon and colour and ignores anything else', () => {
    const w = createWorld(1, 0);
    applyCommand(w, { kind: 'eduStart', age: 4 }, []);
    applyCommand(w, { kind: 'eduSetTag', icon: '🦊', colour: 'blue' }, []);
    expect(w.edu!.icon).toBe('🦊');
    expect(w.edu!.tagColour).toBe('blue');
    applyCommand(w, { kind: 'eduSetTag', icon: '<b>', colour: 'url(x)' }, []);
    expect(w.edu!.icon).toBe('🦊');
    expect(w.edu!.tagColour).toBe('blue');
    applyCommand(w, { kind: 'eduSetTag', icon: null, colour: null }, []);
    expect(w.edu!.icon).toBeUndefined();
  });

  it('summarises the name, icon and colour, and labels the slot with them', () => {
    const json = JSON.stringify({
      savedAtWallMs: 1,
      world: { nubbins: [], edu: { age: 4, childName: ' Maya ', icon: '🐰', tagColour: 'red' } },
    });
    const s = summarize(json)!;
    expect(s.eduName).toBe('Maya');
    expect(s.eduIcon).toBe('🐰');
    expect(s.eduColour).toBe('red');
    expect(eduTagLabel(s, 1)).toBe('🐰 Maya');
    expect(eduTagLabel({}, 2)).toBe('Grove 2');
    const old = summarize(JSON.stringify({ world: { nubbins: [], edu: { age: 4 } } }))!;
    expect(old.eduName).toBeUndefined();
  });
});
