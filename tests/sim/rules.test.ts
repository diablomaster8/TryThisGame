import { describe, expect, it } from 'vitest';
import { LIFECYCLE, NEEDS, STATS } from '../../src/config/tuning';
import { bandOf, childHint, nudgeAlignment, winningType } from '../../src/sim/alignment';
import { decayNeeds, moodOf, applyPet, applyDrop } from '../../src/sim/needs';
import { advanceStage } from '../../src/sim/lifecycle';
import { createEgg } from '../../src/sim/nubbin';
import { Rng } from '../../src/sim/rng';
import { addPoints, levelOf, MAX_POINTS, rollGrade } from '../../src/sim/stats';
import type { Nubbin, SimEvent } from '../../src/sim/types';

function child(): Nubbin {
  const n = createEgg('n1', { x: 0, z: 0 }, Rng.fromSeed(1));
  n.stage = 'child';
  n.behavior.state = 'sit';
  return n;
}

describe('stats', () => {
  it('applies grade multipliers', () => {
    for (const [grade, mult] of Object.entries(STATS.gradeMultiplier)) {
      const stat = { points: 0, grade: grade as keyof typeof STATS.gradeMultiplier };
      addPoints(stat, 100);
      expect(stat.points).toBeCloseTo(100 * mult);
    }
  });

  it('caps at level 99', () => {
    const stat = { points: 0, grade: 'S' as const };
    addPoints(stat, 1_000_000);
    expect(stat.points).toBe(MAX_POINTS);
    expect(levelOf(stat.points)).toBe(99);
    expect(levelOf(250)).toBe(2);
  });

  it('rolls grades weighted toward the low end', () => {
    const rng = Rng.fromSeed(3);
    const counts: Record<string, number> = {};
    for (let i = 0; i < 3000; i++) {
      const g = rollGrade(rng);
      counts[g] = (counts[g] ?? 0) + 1;
    }
    expect(counts.E ?? 0).toBeGreaterThan(counts.S ?? 0);
    expect(counts.D ?? 0).toBeGreaterThan(counts.A ?? 0);
  });
});

describe('needs', () => {
  it('hunger runs from full to starving in 20 minutes', () => {
    const n = child();
    decayNeeds(n, NEEDS.hungerFullToStarvingMs / 2);
    expect(n.needs.hunger).toBeCloseTo(0.5);
    decayNeeds(n, NEEDS.hungerFullToStarvingMs / 2);
    expect(n.needs.hunger).toBe(0);
  });

  it('energy lasts 40 minutes and naps refill it', () => {
    const n = child();
    decayNeeds(n, NEEDS.energyFullToEmptyMs);
    expect(n.needs.energy).toBe(0);
    n.behavior.state = 'nap';
    decayNeeds(n, NEEDS.napMs);
    expect(n.needs.energy).toBe(1);
  });

  it('petting and dropping move happiness and affection', () => {
    const n = child();
    applyPet(n);
    expect(n.needs.happiness).toBe(NEEDS.happinessStart + NEEDS.petHappiness);
    expect(n.needs.affection).toBe(NEEDS.affectionStart + NEEDS.petAffection);
    applyDrop(n);
    expect(n.needs.happiness).toBe(NEEDS.happinessStart + NEEDS.petHappiness + NEEDS.dropHappiness);
  });

  it('clamps happiness to the -100..100 range', () => {
    const n = child();
    for (let i = 0; i < 100; i++) applyDrop(n);
    expect(n.needs.happiness).toBe(NEEDS.happinessMin);
    expect(n.needs.affection).toBe(NEEDS.affectionMin);
  });

  it('reports moods', () => {
    const n = child();
    expect(moodOf(n)).toBe('content');
    n.needs.hunger = 0.1;
    expect(moodOf(n)).toBe('hungry');
    n.needs.hunger = 1;
    n.needs.happiness = 60;
    expect(moodOf(n)).toBe('happy');
  });
});

describe('alignment and type lean', () => {
  it('nudges 0.01 toward the active Keeper and clamps', () => {
    const n = child();
    nudgeAlignment(n, 'sun');
    expect(n.alignment).toBeCloseTo(0.01);
    for (let i = 0; i < 200; i++) nudgeAlignment(n, 'moon');
    expect(n.alignment).toBe(-1);
  });

  it('bands at ±0.5', () => {
    expect(bandOf(0.51)).toBe('sun');
    expect(bandOf(0.5)).toBe('neutral');
    expect(bandOf(-0.51)).toBe('moon');
    expect(childHint(0.2)).toBe('sun');
    expect(childHint(0)).toBe('neutral');
  });

  it('picks the leading type only with a 15% lead', () => {
    expect(winningType({ normal: 0, swim: 100, fly: 50, run: 0, power: 0 })).toBe('swim');
    expect(winningType({ normal: 0, swim: 100, fly: 90, run: 0, power: 0 })).toBe('normal');
    expect(winningType({ normal: 0, swim: 115, fly: 100, run: 0, power: 0 })).toBe('swim');
    expect(winningType({ normal: 0, swim: 0, fly: 0, run: 0, power: 0 })).toBe('normal');
  });
});

describe('lifecycle timers', () => {
  it('child → cocoon → adult on the tuned durations', () => {
    const n = child();
    const events: SimEvent[] = [];
    advanceStage(n, LIFECYCLE.childMs - 1, events);
    expect(n.stage).toBe('child');
    advanceStage(n, 1, events);
    expect(n.stage).toBe('cocoon');
    advanceStage(n, LIFECYCLE.cocoonMs, events);
    expect(n.stage).toBe('adult');
    expect(n.form).toMatchObject({ band: 'neutral', type: 'normal', second: null });
    expect(events.some((e) => e.kind === 'evolved')).toBe(true);
  });

  it('evolution uses alignment band and type lean', () => {
    const n = child();
    n.alignment = 0.9;
    n.typeLean.fly = 200;
    advanceStage(n, LIFECYCLE.childMs + LIFECYCLE.cocoonMs, []);
    expect(n.form).toMatchObject({ band: 'sun', type: 'fly' });
  });
});
