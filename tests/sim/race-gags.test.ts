import { describe, expect, it } from 'vitest';
import { RIVAL_QUIRKS, rivalLabel } from '../../src/config/strings-fun-r6';
import { createEgg } from '../../src/sim/nubbin';
import { cheer, COURSES, createRace, stepRace } from '../../src/sim/race';
import { Rng } from '../../src/sim/rng';
import { STAT_KEYS, type Nubbin } from '../../src/sim/types';

// R0325 (FUN-36): butterfly stops for happy Nubbins, a cheer's snap, quirky rivals.

function runner(happiness: number): Nubbin {
  const n = createEgg('p', { x: 0, z: 0 }, Rng.fromSeed(2));
  n.stage = 'adult';
  n.name = 'Kiki';
  n.needs.happiness = happiness;
  for (const k of STAT_KEYS) n.stats[k].points = 3000;
  return n;
}

describe('race gags', () => {
  it('in 20 seeded races a happy Nubbin stops for a butterfly at least 3 times', () => {
    let stopped = 0;
    for (let seed = 1; seed <= 20; seed++) {
      const race = createRace(COURSES[seed % COURSES.length]!, 1, runner(80), seed);
      while (!race.finished) stepRace(race, 100);
      if ((race.racers.find((r) => r.isPlayer)!.gazes ?? 0) > 0) stopped++;
    }
    expect(stopped).toBeGreaterThanOrEqual(3);
  });

  it('a gloomy Nubbin never stops, and the stat rolls are as before', () => {
    const a = createRace(COURSES[0]!, 2, runner(10), 9);
    const b = createRace(COURSES[0]!, 2, runner(90), 9);
    expect(a.racers[0]!.gazeAt).toEqual([]);
    expect(a.racers.slice(1).map((r) => r.levels)).toEqual(b.racers.slice(1).map((r) => r.levels));
  });

  it('a cheer snaps a gazing Nubbin out of it with a "!"', () => {
    const race = createRace(COURSES[0]!, 1, runner(90), 3);
    const me = race.racers[0]!;
    me.gazeAt = [0];
    stepRace(race, 100);
    expect(me.gazeUntilMs).toBeGreaterThan(race.timeMs);
    expect(cheer(race)).toBe(true);
    expect(me.gazeUntilMs).toBe(race.timeMs);
    expect(me.perkUntilMs).toBeGreaterThan(race.timeMs);
  });

  it('every rival has a quirk from forty', () => {
    expect(RIVAL_QUIRKS).toHaveLength(40);
    const race = createRace(COURSES[0]!, 3, runner(50), 5);
    for (const r of race.racers.slice(1)) expect(rivalLabel(r.name, r.quirk)).toMatch(/, who /);
  });
});
