import { describe, expect, it } from 'vitest';
import { setAnticsLive } from '../../src/sim/antics';
import { evolve, hatch } from '../../src/sim/lifecycle';
import { festivalDay, seasonMoodActs } from '../../src/sim/season-moods';
import { eduStart } from '../../src/sim/edu';
import { lessonsWatched, calmEternalReactions } from '../../src/sim/old-soul';
import { gaitOf, gaitSpeed } from '../../src/sim/soul-gait';
import { COURSES, createRace, stepRace } from '../../src/sim/race';
import { cheerVoice, liesFlat, racerPersonality, startLook } from '../../src/sim/race-persona';
import { createEgg } from '../../src/sim/nubbin';
import { Rng } from '../../src/sim/rng';
import { createWorld, stepWorld } from '../../src/sim/world';
import { STAT_KEYS } from '../../src/sim/types';
import type { Nubbin, Personality, SimEvent, World } from '../../src/sim/types';

// R0590 season moods (lane A r11, G5).

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
    n.pos = { x: (i % 3) * 1.6 - 1.6, z: Math.floor(i / 3) * 1.6 + 4 };
    return n;
  });
  return w;
}

function run(w: World, steps: number, each?: (w: World) => void): void {
  for (let i = 0; i < steps; i++) {
    each?.(w);
    for (const n of w.nubbins) n.needs.hunger = 1;
    stepWorld(w, 100);
  }
}

const ps: Personality[] = ['cheerful', 'cheerful', 'cheerful', 'shy', 'lazy'];

describe('R0590 season moods', () => {
  it('winter huddles and summer pond parties show in a 20 min run', () => {
    setAnticsLive(true);
    const win = grove(5, ps);
    run(win, 12_000, (x) => {
      x.season = 'winter';
      x.weather = { kind: 'clear', untilMs: Infinity, intensity: 0 };
    });
    expect(seasonMoodActs(win).huddle ?? 0).toBeGreaterThan(0);
    const sum = grove(5, ps);
    run(sum, 12_000, (x) => {
      x.season = 'summer';
      x.weather = { kind: 'clear', untilMs: Infinity, intensity: 0 };
      for (const n of x.nubbins) if (n.pos.x < 0) n.pos = { x: 6, z: 12 };
    });
    expect(seasonMoodActs(sum).pondParty ?? 0).toBeGreaterThan(0);
  }, 90_000);

  it('cheerful ones dance in a ring on festival days, and only then', () => {
    setAnticsLive(true);
    const fest = grove(6, ps);
    fest.town.prosperity = 100;
    expect(festivalDay(fest)).toBe(true);
    run(fest, 12_000, (x) => {
      x.weather = { kind: 'clear', untilMs: Infinity, intensity: 0 };
      x.season = 'spring';
      x.town.prosperity = 100;
    });
    // Festival window is the first third of each 12 min period: some ring dances happen.
    expect(seasonMoodActs(fest).ringDance ?? 0).toBeGreaterThan(0);
    const none = grove(6, ps);
    expect(festivalDay(none)).toBe(false);
    run(none, 12_000, (x) => {
      x.weather = { kind: 'clear', untilMs: Infinity, intensity: 0 };
      x.season = 'spring';
    });
    expect(seasonMoodActs(none).ringDance ?? 0).toBe(0);
  }, 90_000);
});

describe('R0592 old souls', () => {
  it('an Eternal walks slowly and its reactions are calm stars', () => {
    setAnticsLive(true);
    const w = grove(7, ['cheerful', 'lazy']);
    const e = w.nubbins[0]!;
    e.eternal = 'neutral';
    expect(gaitOf(e).speed).toBeLessThan(gaitOf(w.nubbins[1]!).speed);
    e.behavior.state = 'wander';
    e.behavior.itemId = null;
    expect(gaitSpeed(e, 1000)).toBeLessThan(0.7);
    const ev: SimEvent[] = [
      { kind: 'reaction', nubbinId: e.id, reaction: 'love' },
      { kind: 'reaction', nubbinId: w.nubbins[1]!.id, reaction: 'love' },
    ];
    calmEternalReactions(w, ev);
    expect(ev[0]).toMatchObject({ calm: true });
    expect((ev[1] as { calm?: boolean }).calm).toBeUndefined();
  });

  it('a child near an Eternal sometimes sits and watches it', () => {
    setAnticsLive(true);
    const w = grove(8, ['cheerful', 'lazy']);
    const [e, kid] = w.nubbins as [Nubbin, Nubbin];
    e.eternal = 'neutral';
    kid.stage = 'child';
    kid.personality = null;
    e.pos = { x: 0, z: 0 };
    run(w, 3000, () => {
      kid.stage = 'child';
      kid.stageMs = 1000;
    });
    expect(lessonsWatched(w)).toBeGreaterThan(0);
  }, 60_000);

  it('a plain adult has no teach act', () => {
    setAnticsLive(true);
    const w = grove(8, ['cheerful', 'lazy']);
    const [, kid] = w.nubbins as [Nubbin, Nubbin];
    kid.stage = 'child';
    run(w, 1500, () => {
      kid.stage = 'child';
    });
    expect(lessonsWatched(w)).toBe(0);
  }, 60_000);
});

describe('R0567 Learning Grove behaviour', () => {
  it('no snatch or rivalry fires over 60 minutes in an edu world', () => {
    setAnticsLive(true);
    const w = grove(9, ['mischievous', 'mischievous', 'cheerful', 'shy']);
    eduStart(w, 5, []);
    for (const a of w.nubbins) for (const b of w.nubbins) if (a !== b) a.friends[b.id] = 5;
    const seen: SimEvent[] = [];
    for (let i = 0; i < 36_000; i++) {
      for (const n of w.nubbins) n.needs.hunger = 1;
      seen.push(...stepWorld(w, 100));
    }
    expect(seen.filter((e) => e.kind === 'rivalsMade' || e.kind === 'snatched')).toEqual([]);
    for (const n of w.nubbins) expect(Object.keys(n.rivals ?? {})).toEqual([]);
  }, 120_000);
});

describe('R0583 race and expedition personality', () => {
  function player(p: Personality): Nubbin {
    const n = createEgg('p', { x: 0, z: 0 }, Rng.fromSeed(2));
    n.stage = 'adult';
    n.name = 'Player';
    n.personality = p;
    for (const k of STAT_KEYS) n.stats[k].points = 3000;
    return n;
  }
  const finish = (p: Personality): number[] => {
    const race = createRace(COURSES[0]!, 1, player(p), 77);
    for (let i = 0; i < 20_000 && !race.finished; i++) stepRace(race, 100);
    return race.racers.map((r) => r.finishedAtMs ?? -1);
  };
  it('the same seed gives the same finishing times whatever the personality', () => {
    const base = finish('cheerful');
    for (const p of ['shy', 'mischievous', 'lazy'] as const) expect(finish(p)).toEqual(base);
  });
  it('start-line poses differ by personality, then end', () => {
    const kinds = (['cheerful', 'shy', 'mischievous', 'lazy'] as const).map(
      (p) => startLook(p, 500, false)?.kind,
    );
    expect(new Set(kinds).size).toBe(4);
    expect(startLook('lazy', 5000, false)).toBeNull();
    expect(startLook('shy', 500, true)).toMatchObject({ dx: 0, dy: 0 });
  });
  it('only the lazy one lies flat, and rivals get a personality from their id', () => {
    expect(liesFlat('lazy')).toBe(true);
    expect(liesFlat('cheerful')).toBe(false);
    const race = createRace(COURSES[0]!, 1, player('shy'), 77);
    expect(racerPersonality(race.racers[0]!)).toBe('shy');
    expect(racerPersonality(race.racers[1]!)).toBe(racerPersonality(race.racers[1]!));
    expect(cheerVoice('lazy')).not.toBe(cheerVoice('cheerful'));
  });
});
