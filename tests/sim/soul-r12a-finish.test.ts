import { describe, expect, it } from 'vitest';
import { WEATHER_PLAY } from '../../src/config/tuning-more/soul-ambient-games';
import { RACE_PERSONA } from '../../src/config/tuning-more/soul-old-souls';
import { chaseLook } from '../../src/render/ambient-look';
import { FrameGovernor } from '../../src/render3d/governor';
import { setAnticsLive } from '../../src/sim/antics';
import { ALBUM_IDS, albumIdOf, sawAntic } from '../../src/sim/antic-album';
import { evolve, hatch } from '../../src/sim/lifecycle';
import { createEgg } from '../../src/sim/nubbin';
import { COURSES, createRace, stepRace } from '../../src/sim/race';
import { countLabel, inCountdown, lineClock, startLook } from '../../src/sim/race-persona';
import { Rng } from '../../src/sim/rng';
import { shyTurnAway } from '../../src/sim/state-flavour';
import { ballAt, snowballsOf } from '../../src/sim/weather-play';
import {
  STAT_KEYS,
  type Nubbin,
  type Personality,
  type SimEvent,
  type World,
} from '../../src/sim/types';
import { createWorld, stepWorld } from '../../src/sim/world';

// Lane A round 12: SOUL presentation leftovers (R0562, R0555, R0558, R0585, R0583, R0564).

function grove(seed: number, ps: Personality[]): World {
  const w = createWorld(seed, 0);
  const base = w.nubbins[0]!;
  w.nubbins = ps.map((p, i) => {
    const n: Nubbin = structuredClone(base);
    n.id = `n${i}`;
    n.seed = seed * 31 + i;
    hatch(n, [], 0);
    evolve(n, [], w);
    n.personality = p;
    n.pos = { x: (i % 3) * 1.6 - 1.6, z: Math.floor(i / 3) * 1.6 };
    n.needs.hunger = 1;
    return n;
  });
  return w;
}

describe('R0562 snowball arc', () => {
  it('lobs from the thrower to the friend, peaking mid-way', () => {
    const b = { fromX: 0, fromZ: 0, toX: 4, toZ: 2, startMs: 1000, endMs: 2000 };
    expect(ballAt(b, 1000).y).toBeCloseTo(0.5);
    expect(ballAt(b, 2000)).toMatchObject({ x: 4, z: 2 });
    expect(ballAt(b, 1500).y).toBeCloseTo(0.5 + WEATHER_PLAY.lobHeight);
    expect(ballAt(b, 1500).x).toBeCloseTo(2);
  });

  it('a snowball is in the air during a snow day with friends', () => {
    setAnticsLive(true);
    let seen = 0;
    for (const seed of [4, 5, 6]) {
      const w = grove(seed, ['lazy', 'cheerful', 'curious', 'shy']);
      for (let i = 0; i < 12_000 && !seen; i++) {
        w.season = 'winter';
        w.weather = { kind: 'snow', untilMs: Infinity, intensity: 0.8 };
        for (const n of w.nubbins) n.needs.hunger = 1;
        stepWorld(w, 100);
        seen += snowballsOf(w).length;
      }
      if (seen) break;
    }
    expect(seen).toBeGreaterThan(0);
  }, 90_000);
});

describe('R0555 concert in the album', () => {
  it('has pages for the group games and the concert', () => {
    for (const id of ['concert', 'ringDance', 'snowball', 'tagRun', 'seekCount', 'gatherJam'])
      expect(ALBUM_IDS).toContain(id);
  });

  it('stamps a group game once, and an ordinary act as before', () => {
    const w = createWorld(7, 0);
    const n = w.nubbins[0]!;
    hatch(n, [], 0);
    const ev: SimEvent[] = [];
    n.behavior.itemId = 'ringDance';
    expect(albumIdOf(w, n)).toBe('ringDance');
    expect(sawAntic(w, n, ev)).toBe('ringDance');
    expect(sawAntic(w, n, ev)).toBeNull();
  });
});

describe('R0558 shy nibble turns away', () => {
  it('faces directly away from the nearest other Nubbin', () => {
    setAnticsLive(true);
    const w = grove(3, ['shy', 'cheerful']);
    const [a, b] = w.nubbins as [Nubbin, Nubbin];
    a.pos = { x: 0, z: 0 };
    b.pos = { x: 3, z: 0 };
    w.keeper.pos = { x: 40, z: 40 };
    expect(shyTurnAway(a, w)).toBeCloseTo(Math.atan2(-3, 0));
  });

  it('keeps its facing when nobody is near', () => {
    setAnticsLive(true);
    const w = grove(3, ['shy', 'cheerful']);
    const [a, b] = w.nubbins as [Nubbin, Nubbin];
    a.pos = { x: 0, z: 0 };
    b.pos = { x: 30, z: 30 };
    w.keeper.pos = { x: -40, z: 40 };
    expect(shyTurnAway(a, w)).toBeNull();
  });
});

describe('R0585 governor and reduced motion', () => {
  it('sheds ambient critters as soon as the scale drops', () => {
    const g = new FrameGovernor(1.5);
    expect(g.shedAmbient).toBe(false);
    for (let i = 0; i < 400; i++) g.sample(45 * (g.ratio / 1.5) ** 2);
    expect(g.ratio).toBeLessThan(1.5);
    expect(g.shedAmbient).toBe(true);
  });

  it('a chase under reduced motion has no hop and no turning', () => {
    const w = grove(2, ['cheerful']);
    const n = w.nubbins[0]!;
    for (const id of ['chaseFlutter', 'catchFlutter', 'tagRun', 'snowball']) {
      n.behavior.state = 'perform';
      n.behavior.itemId = id;
      n.behavior.sinceMs = 0;
      const look = chaseLook(n, 450, true);
      if (look) {
        expect(look.dy).toBe(0);
        expect(look.turn).toBe(0);
      }
    }
  });
});

describe('R0583 pre-race countdown', () => {
  function runner(): Nubbin {
    const n = createEgg('p', { x: 0, z: 0 }, Rng.fromSeed(2));
    n.stage = 'adult';
    for (const k of STAT_KEYS) n.stats[k].points = 3000;
    return n;
  }
  const finish = (hold: boolean, p: Personality): number[] => {
    const n = runner();
    n.personality = p;
    const race = createRace(COURSES[0]!, 1, n, 5);
    if (hold) race.countdownMs = race.countdownTotalMs = RACE_PERSONA.countdownMs;
    let guard = 0;
    while (!race.finished && guard++ < 100_000) stepRace(race, 100);
    return race.racers.map((r) => r.finishedAtMs ?? -1);
  };

  it('holds the field, and the finishing times do not change with it or the personality', () => {
    const plain = finish(false, 'cheerful');
    expect(finish(true, 'cheerful')).toEqual(plain);
    expect(finish(true, 'lazy')).toEqual(plain);
    expect(finish(true, 'shy')).toEqual(plain);
  });

  it('nobody moves during the count and the poses play through it', () => {
    const race = createRace(COURSES[0]!, 1, runner(), 5);
    race.countdownMs = race.countdownTotalMs = RACE_PERSONA.countdownMs;
    stepRace(race, 1000);
    expect(race.timeMs).toBe(0);
    expect(race.racers.every((r) => r.pos === 0)).toBe(true);
    expect(inCountdown(race)).toBe(true);
    expect(startLook('cheerful', lineClock(race), false)).not.toBeNull();
    expect(countLabel(race)).toBe('2');
    for (let i = 0; i < 20; i++) stepRace(race, 100);
    expect(inCountdown(race)).toBe(false);
    expect(startLook('cheerful', lineClock(race), false)).toBeNull();
    expect(race.timeMs).toBeGreaterThan(0);
  });
});
