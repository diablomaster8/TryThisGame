import { describe, expect, it } from 'vitest';
import { PERFORM } from '../../src/config/tuning';
import {
  doctorNotes,
  instrumentOf,
  nextReveal,
  payService,
  reading,
} from '../../src/sim/kindergarten';
import { hatch } from '../../src/sim/lifecycle';
import type { Nubbin, SimEvent, World } from '../../src/sim/types';
import { createWorld } from '../../src/sim/world';
import { doctorNoteText, fortuneLines } from '../../src/ui/kinder-text';

/** Lane A r10: the fortune teller (R0557), the doctor's notes (R0556), the instrument (R0525). */
function grown(): { world: World; a: Nubbin; b: Nubbin } {
  const world = createWorld(7, 0);
  const events: SimEvent[] = [];
  for (const n of world.nubbins) {
    hatch(n, events, 0);
    n.stage = 'adult';
    n.form = { band: 'neutral', type: 'normal', second: null, leanAtEvolution: { ...n.typeLean } };
    n.needs.hunger = 1;
    n.needs.energy = 1;
    n.needs.happiness = 20;
    n.needs.affection = 40;
    n.lastPetMs = 0;
  }
  world.timeMs = 60_000;
  const [a, b] = world.nubbins as [Nubbin, Nubbin];
  return { world, a, b };
}

describe('doctor notes (R0556)', () => {
  const cases: Array<[string, (w: World, a: Nubbin, b: Nubbin) => void, string, string]> = [
    ['hungry', (_w, a) => (a.needs.hunger = 0.1), 'hungry', 'favMystery'],
    ['tired', (_w, a) => (a.needs.energy = 0.1), 'tired', 'favMystery'],
    ['sad', (_w, a) => (a.needs.happiness = -40), 'sad', 'favMystery'],
    [
      'wary shadow',
      (_w, a) => {
        a.shadow = true;
        a.trust = 10;
      },
      'wary',
      'favMystery',
    ],
    [
      'no cuddle',
      (w, a) => {
        a.personality = 'cheerful';
        w.timeMs = 30 * 60_000;
      },
      'noHug',
      'favMystery',
    ],
    ['lonely', (_w, a) => (a.personality = 'lazy'), 'lonely', 'favMystery'],
    [
      'glad, fruit known',
      (_w, a, b) => {
        a.personality = 'lazy';
        a.friends = { [b.id]: 40 };
        b.friends = { [a.id]: 40 };
        a.needs.happiness = 80;
        a.tasteSeen = { yum: true };
      },
      'glad',
      'toyMystery',
    ],
    [
      'best buddy',
      (_w, a, b) => {
        a.personality = 'lazy';
        a.friends = { [b.id]: 80 };
        a.tasteSeen = { yum: true, toy: true };
      },
      'buddy',
      'blehMystery',
    ],
    [
      'sunward',
      (_w, a, b) => {
        a.personality = 'lazy';
        a.friends = { [b.id]: 40 };
        a.alignment = 0.8;
        a.tasteSeen = { yum: true, toy: true, bleh: true };
      },
      'sunward',
      'likesKnown',
    ],
    [
      'strong legs',
      (_w, a, b) => {
        a.personality = 'lazy';
        a.friends = { [b.id]: 40 };
        a.typeLean = { normal: 0, swim: 0, fly: 0, run: 40, power: 5 };
      },
      'lean',
      'favMystery',
    ],
  ];
  for (const [label, set, first, second] of cases) {
    it(`reads ${label}`, () => {
      const { world, a, b } = grown();
      // Only the patient and its friend: a third would change who is lonely.
      world.nubbins = [a, b];
      // Mostly calm sorts, so the cuddle note only shows where a case asks for it.
      a.personality ??= 'lazy';
      delete a.earnedTrait;
      set(world, a, b);
      const notes = doctorNotes(a, world);
      expect(notes.map((x) => x.id)).toEqual([first, second]);
      for (const note of notes) expect(doctorNoteText(note, a.name)).toContain(a.name);
    });
  }
});

describe('fortune teller (R0557)', () => {
  it('reads differently for different Nubbins and reveals one like a visit', () => {
    const { world, a, b } = grown();
    a.personality = 'cheerful';
    b.personality = 'shy';
    const la = fortuneLines(reading(a, world.timeMs));
    const lb = fortuneLines(reading(b, world.timeMs));
    expect(la).not.toEqual(lb);
    expect(la).toHaveLength(3);
    world.inventory.shells = 100;
    const events: SimEvent[] = [];
    expect(nextReveal(a)).toBe('yum');
    expect(payService(world, 'fortune', a, events)).toBe(true);
    expect(a.tasteSeen?.yum).toBe(true);
    expect(nextReveal(a)).toBe('toy');
    // The doctor never reveals anything.
    payService(world, 'doctor', a, events);
    expect(nextReveal(a)).toBe('toy');
    payService(world, 'fortune', a, events);
    payService(world, 'fortune', a, events);
    expect(nextReveal(a)).toBeNull();
    expect(fortuneLines(reading(a, world.timeMs))[2]).toMatch(/already know/);
  });

  it('turns its lines with the minute', () => {
    const { a } = grown();
    const seen = new Set<string>();
    for (let m = 0; m < 20; m++) seen.add(fortuneLines(reading(a, m * 60_000)).join('|'));
    expect(seen.size).toBeGreaterThan(1);
  });
});

describe('instrument (R0525)', () => {
  it('is one of the three and steady for the Nubbin', () => {
    const { a } = grown();
    expect(PERFORM.instruments).toContain(instrumentOf(a));
    a.lessons = { instrument: 1, instrumentKind: 2 };
    expect(instrumentOf(a)).toBe('trumpet');
  });
});
