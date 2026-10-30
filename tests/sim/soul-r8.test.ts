import { describe, expect, it } from 'vitest';
import { eat } from '../../src/sim/behavior';
import { stepCurfew } from '../../src/sim/curfew';
import { interact } from '../../src/sim/keeper';
import { evolve, hatch } from '../../src/sim/lifecycle';
import { likesOf, tasteOf } from '../../src/sim/likes';
import { dayPhase, napScale, stepMoody } from '../../src/sim/soul-idle';
import { setWeather } from '../../src/sim/weather';
import { Rng } from '../../src/sim/rng';
import { createWorld, stepWorld } from '../../src/sim/world';
import {
  FLAVORS,
  type Nubbin,
  type Personality,
  type SimEvent,
  type World,
} from '../../src/sim/types';

function adultWorld(seed: number, p: Personality = 'cheerful'): { w: World; n: Nubbin } {
  const w = createWorld(seed, 0);
  const n = w.nubbins[0]!;
  w.nubbins = [n];
  hatch(n, [], 0);
  evolve(n, [], w);
  n.personality = p;
  return { w, n };
}

describe('R0536 favourite and disliked fruit', () => {
  it('rolls from the seed: a favourite, a different dislike, never a disliked plain', () => {
    for (let s = 0; s < 200; s++) {
      const l = likesOf({ seed: s });
      expect(l.dislike).not.toBe(l.fruit);
      expect(FLAVORS).toContain(l.dislike);
      expect(likesOf({ seed: s })).toEqual(l);
    }
    const favs = new Set(Array.from({ length: 200 }, (_, s) => likesOf({ seed: s }).fruit));
    expect(favs.size).toBe(8);
  });

  it('a favourite and a dislike react differently, change happiness only, and reveal once', () => {
    const { n } = adultWorld(3);
    const l = likesOf(n);
    const fav = l.fruit === 'plain' ? undefined : l.fruit;
    const events: SimEvent[] = [];
    n.needs.happiness = 0;
    eat(n, 0, events, fav);
    const yum = n.needs.happiness;
    expect(events).toContainEqual({
      kind: 'fruitTaste',
      nubbinId: n.id,
      taste: 'yum',
      first: true,
    });
    expect(n.tasteSeen?.yum).toBe(true);
    // A second favourite is not news.
    eat(n, 1, events, fav);
    expect(events.filter((e) => e.kind === 'fruitTaste' && e.first)).toHaveLength(1);
    // The same Nubbin, the same fruit points, either way.
    const { n: m } = adultWorld(3);
    m.needs.happiness = 0;
    const before = m.stats.stamina.points;
    eat(m, 0, events, l.dislike);
    expect(m.stats.stamina.points - before).toBeGreaterThan(0);
    expect(tasteOf(m, l.dislike)).toBe('bleh');
    expect(m.needs.happiness).toBeLessThan(yum);
    expect(m.tasteSeen?.bleh).toBe(true);
  });

  it('a hungry Nubbin leaves a disliked fruit until it is starving', () => {
    const { w, n } = adultWorld(4);
    const l = likesOf(n);
    w.items = [
      {
        id: 'f1',
        kind: 'fruit',
        pos: { x: n.pos.x + 2, z: n.pos.z },
        y: 0,
        vel: { x: 0, y: 0, z: 0 },
        flavor: l.dislike,
      },
    ];
    n.behavior.state = 'sit';
    n.behavior.untilMs = 1e9;
    n.needs.hunger = 0.2;
    stepWorld(w, 100);
    expect(n.behavior.state).not.toBe('findFood');
    n.needs.hunger = 0.05;
    stepWorld(w, 100);
    expect(n.behavior.state, JSON.stringify(n.behavior)).toBe('findFood');
  });
});

describe('R0532 the moody looks change behaviour', () => {
  it('a grumpy adult refuses high fives 30% (±5) of the time', () => {
    const { w, n } = adultWorld(9);
    n.moody = 'grumpy';
    let refused = 0;
    const tries = 1000;
    for (let i = 0; i < tries; i++) {
      const events: SimEvent[] = [];
      interact(w, n, 'highFive', events);
      if (events.some((e) => e.kind === 'highFiveRefused')) refused++;
    }
    expect(refused / tries).toBeGreaterThan(0.25);
    expect(refused / tries).toBeLessThan(0.35);
    // A plain adult never refuses.
    n.moody = null;
    const events: SimEvent[] = [];
    for (let i = 0; i < 100; i++) interact(w, n, 'highFive', events);
    expect(events.some((e) => e.kind === 'highFiveRefused')).toBe(false);
  });

  it('half an hour of contentment clears the look, and a bad patch resets the time', () => {
    const { w, n } = adultWorld(9);
    n.moody = 'sleepy';
    expect(napScale(n)).toBeGreaterThan(1);
    const events: SimEvent[] = [];
    n.needs.happiness = 60;
    for (let t = 0; t < 20 * 60; t++) stepMoody(w, 1000, events);
    n.needs.happiness = 10;
    stepMoody(w, 1000, events);
    expect(n.moodyCalmMs).toBe(0);
    n.needs.happiness = 60;
    for (let t = 0; t < 29 * 60; t++) stepMoody(w, 1000, events);
    expect(n.moody).toBe('sleepy');
    for (let t = 0; t < 61; t++) stepMoody(w, 1000, events);
    expect(n.moody).toBeNull();
    expect(events).toContainEqual({ kind: 'moodyCleared', nubbinId: n.id, was: 'sleepy' });
  });

  it('a grumpy Nubbin harrumphs with its back to the Keeper', () => {
    const { w, n } = adultWorld(12);
    n.moody = 'grumpy';
    let seen = false;
    for (let t = 0; t < 6000 && !seen; t++) {
      n.needs.hunger = 1;
      n.needs.energy = 1;
      stepWorld(w, 100);
      if (n.behavior.state === 'sit' && n.behavior.itemId === 'harrumph') {
        seen = true;
        const toKeeper = Math.atan2(w.keeper.pos.x - n.pos.x, w.keeper.pos.z - n.pos.z);
        const d = Math.abs(((n.facing - toKeeper + 3 * Math.PI) % (2 * Math.PI)) - Math.PI);
        expect(d).toBeGreaterThan(Math.PI - 0.3);
      }
    }
    expect(seen).toBe(true);
  });
});

/** Idle choices by their act over a run with the phase held: counts per itemId. */
function phaseRun(phase: NonNullable<World['phase']>): {
  total: number;
  acts: Record<string, number>;
} {
  const acts: Record<string, number> = {};
  let total = 0;
  for (const p of ['cheerful', 'shy', 'mischievous', 'lazy'] as const) {
    const { w, n } = adultWorld(21, p);
    w.phase = phase;
    let since = -1;
    for (let t = 0; t < 20 * 600; t++) {
      n.needs.hunger = 1;
      n.needs.energy = 1;
      stepWorld(w, 100);
      if (n.behavior.sinceMs !== since) {
        since = n.behavior.sinceMs;
        total++;
        const k = n.behavior.itemId ?? n.behavior.state;
        acts[k] = (acts[k] ?? 0) + 1;
      }
    }
  }
  return { total, acts };
}

describe('R0535 time of day', () => {
  it('the curfew clock sets the phase by the daylight hours', () => {
    expect(dayPhase(6)).toBe('dawn');
    expect(dayPhase(12)).toBe('day');
    expect(dayPhase(19.5)).toBe('dusk');
    expect(dayPhase(23)).toBe('night');
    expect(dayPhase(3)).toBe('night');
    const w = createWorld(1, 0);
    stepCurfew(w, 100, Date.UTC(2026, 9, 30, 19, 30), []);
    expect(w.phase).toBe('dusk');
  });

  it('at 19:30 dusk quirks are at least 10% of idle choices, and none at noon', () => {
    const dusk = phaseRun('dusk');
    expect((dusk.acts.fireflies ?? 0) / dusk.total).toBeGreaterThanOrEqual(0.1);
    const noon = phaseRun('day');
    expect(noon.acts.fireflies ?? 0).toBe(0);
    expect(noon.acts.stargaze ?? 0).toBe(0);
    expect(noon.acts.stretch ?? 0).toBe(0);
  }, 60_000);
});

describe('R0534 rain by personality', () => {
  it('half or more stay within 8 units of the Keeper; sheltering never passes half', () => {
    const w = createWorld(31, 0);
    const base = w.nubbins[0]!;
    const ps: Personality[] = ['cheerful', 'shy', 'mischievous', 'lazy', 'cheerful', 'shy'];
    w.nubbins = ps.map((p, i) => {
      const n: Nubbin = structuredClone(base);
      n.id = `n${i}`;
      n.seed = 100 + i;
      n.pos = { x: -10 + i * 4, z: 8 };
      hatch(n, [], 0);
      evolve(n, [], w);
      n.personality = p;
      n.typeLean.swim = 0;
      if (n.form) n.form = { ...n.form, type: 'run' };
      return n;
    });
    // The Keeper by the first tree.
    w.keeper.pos = { x: -6, z: -3 };
    const events: SimEvent[] = [];
    setWeather(w, 'rain', new Rng(2), events, 30 * 60_000);
    let near = 0;
    let samples = 0;
    let maxShelter = 0;
    for (let t = 0; t < 3 * 600; t++) {
      for (const n of w.nubbins) {
        n.needs.hunger = 1;
        n.needs.energy = 1;
      }
      stepWorld(w, 100);
      const shelter = w.nubbins.filter((n) => n.behavior.state === 'shelter').length;
      maxShelter = Math.max(maxShelter, shelter);
      if (t > 600 && t % 50 === 0) {
        samples++;
        const k = w.keeper.pos;
        const inView = w.nubbins.filter((n) => Math.hypot(n.pos.x - k.x, n.pos.z - k.z) <= 8);
        if (inView.length >= w.nubbins.length / 2) near++;
      }
    }
    expect(maxShelter).toBeLessThanOrEqual(3);
    expect(near / samples).toBeGreaterThanOrEqual(0.5);
  }, 30_000);
});
