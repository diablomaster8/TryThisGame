import { describe, expect, it } from 'vitest';
import { SIM } from '../../src/config/tuning';
import { COURSES, createRace, stepRace } from '../../src/sim/race';
import { createEgg } from '../../src/sim/nubbin';
import { Rng } from '../../src/sim/rng';
import { STAT_KEYS, type Nubbin, type StatKey } from '../../src/sim/types';
import { RaceWatch } from '../../src/ui/race-results';

function racer(levels: Partial<Record<StatKey, number>>, base = 30): Nubbin {
  const n = createEgg('p', { x: 0, z: 0 }, Rng.fromSeed(2));
  n.stage = 'adult';
  n.name = 'Player';
  for (const k of STAT_KEYS) n.stats[k].points = (levels[k] ?? base) * 100;
  return n;
}

function run(n: Nubbin, tier = 1): { tip: string | null; place: number } {
  const course = COURSES.find((c) => c.sections.some((s) => s.kind === 'swim'))!;
  const race = createRace(course, tier, n, 1234);
  const watch = new RaceWatch(race);
  while (!race.finished) {
    stepRace(race, SIM.stepMs);
    watch.observe(SIM.stepMs);
  }
  return { tip: watch.tip(), place: race.placements.indexOf(n.id) + 1 };
}

describe('race results tip', () => {
  it('names the swim when Swim is the weak stat', () => {
    const r = run(racer({ swim: 0 }, 60), 3);
    expect(r.place).toBeGreaterThan(1);
    expect(r.tip).toMatch(/swim/);
    expect(r.tip).toMatch(/Swim/);
  });

  it('still gives a tip on a win', () => {
    const r = run(racer({}, 99), 1);
    expect(r.place).toBe(1);
    expect(r.tip).toBeTruthy();
  });
});
