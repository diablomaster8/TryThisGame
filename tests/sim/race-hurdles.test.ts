import { describe, expect, it } from 'vitest';
import { HURDLES } from '../../src/config/tuning-move-race';
import { SIM } from '../../src/config/tuning';
import {
  cheer,
  COURSES,
  createRace,
  hurdleCleanChance,
  hurdlePositions,
  stepRace,
  type RaceState,
} from '../../src/sim/race';
import { createEgg } from '../../src/sim/nubbin';
import { Rng } from '../../src/sim/rng';
import { STAT_KEYS, type Nubbin } from '../../src/sim/types';

function racer(run: number): Nubbin {
  const n = createEgg('p', { x: 0, z: 0 }, Rng.fromSeed(2));
  n.stage = 'adult';
  n.name = 'Player';
  for (const k of STAT_KEYS) n.stats[k].points = 0;
  n.stats.run.points = run * 100;
  return n;
}

const meadow2 = COURSES[0]!;
const cliffs3 = COURSES[1]!;

function clearRate(run: number, races: number): number {
  let cleared = 0;
  let total = 0;
  for (let seed = 1; seed <= races; seed++) {
    const race = createRace(meadow2, 2, racer(run), seed);
    while (!race.finished) stepRace(race, SIM.stepMs);
    cleared += race.racers[0]!.hurdlesCleared;
    total += race.hurdles.length;
  }
  return cleared / total;
}

describe('hurdles section', () => {
  it('appears on one tier-2 and one tier-3 course only', () => {
    const has = (r: RaceState) => r.course.sections.some((s) => s.kind === 'hurdles');
    expect(has(createRace(meadow2, 2, racer(10), 1))).toBe(true);
    expect(has(createRace(cliffs3, 3, racer(10), 1))).toBe(true);
    expect(has(createRace(meadow2, 1, racer(10), 1))).toBe(false);
    expect(has(createRace(meadow2, 3, racer(10), 1))).toBe(false);
    expect(has(createRace(cliffs3, 2, racer(10), 1))).toBe(false);
    expect(has(createRace(COURSES[2]!, 3, racer(10), 1))).toBe(false);
    expect(hurdlePositions(createRace(meadow2, 2, racer(10), 1).course)).toHaveLength(4);
  });

  it('a Run-60 Nubbin clears at least 90% and a Run-5 one about 55%', () => {
    const high = clearRate(60, 300);
    const low = clearRate(5, 300);
    expect(high).toBeGreaterThanOrEqual(0.9);
    expect(low).toBeGreaterThan(0.5);
    expect(low).toBeLessThan(0.6);
    const levels = { swim: 0, fly: 0, run: 60, power: 0, stamina: 0 };
    expect(hurdleCleanChance(levels)).toBeGreaterThan(0.9);
    expect(hurdleCleanChance({ ...levels, run: 5 })).toBeCloseTo(0.55, 1);
  });

  it('a stumble costs 0.4 s and shows dizzy, never ending the race', () => {
    const race = createRace(meadow2, 2, racer(0), 3);
    const p = race.racers[0]!;
    let stumbled = false;
    for (let i = 0; i < 6000 && !stumbled; i++) {
      stepRace(race, SIM.stepMs);
      stumbled = p.stumbleMs > 0;
    }
    expect(stumbled).toBe(true);
    expect(p.dizzyUntilMs).toBeGreaterThan(race.timeMs);
    const pos = p.pos;
    for (let i = 0; i < Math.floor(HURDLES.stumbleMs / SIM.stepMs) - 1; i++)
      stepRace(race, SIM.stepMs);
    expect(p.pos).toBe(pos);
    while (!race.finished) stepRace(race, SIM.stepMs);
    expect(p.finishedAtMs).not.toBeNull();
  });

  it('a cheer within 300 ms before a hurdle makes the jump clean', () => {
    // The cheer cooldown is 3 s, so one cheer covers the first hurdle only.
    let plainStumbles = 0;
    let cheeredStumbles = 0;
    for (let seed = 1; seed <= 60; seed++) {
      const plain = createRace(meadow2, 2, racer(0), seed);
      const timed = createRace(meadow2, 2, racer(0), seed);
      const firstAt = plain.hurdles[0]!;
      const stepUntilFirst = (r: RaceState, cheerNear: boolean): number => {
        const p = r.racers[0]!;
        while (p.hurdleNext === 0 && !r.finished) {
          if (cheerNear && firstAt - p.pos < 0.3 && firstAt - p.pos > 0) cheer(r);
          stepRace(r, SIM.stepMs);
        }
        return p.hurdlesCleared;
      };
      plainStumbles += 1 - stepUntilFirst(plain, false);
      cheeredStumbles += 1 - stepUntilFirst(timed, true);
    }
    expect(plainStumbles).toBeGreaterThan(10);
    expect(cheeredStumbles).toBe(0);
  });

  it('a cheer long before a hurdle gives no bonus', () => {
    let stumbles = 0;
    for (let seed = 1; seed <= 60; seed++) {
      const r = createRace(meadow2, 2, racer(0), seed);
      const p = r.racers[0]!;
      cheer(r); // at the start line, far from the hurdles
      while (p.hurdleNext === 0 && !r.finished) stepRace(r, SIM.stepMs);
      stumbles += 1 - p.hurdlesCleared;
    }
    expect(stumbles).toBeGreaterThan(10);
  });

  it('is deterministic for a seed', () => {
    const a = createRace(cliffs3, 3, racer(20), 9);
    const b = createRace(cliffs3, 3, racer(20), 9);
    while (!a.finished) stepRace(a, SIM.stepMs);
    while (!b.finished) stepRace(b, SIM.stepMs);
    expect(a.placements).toEqual(b.placements);
    expect(a.racers.map((r) => r.hurdlesCleared)).toEqual(b.racers.map((r) => r.hurdlesCleared));
  });
});
