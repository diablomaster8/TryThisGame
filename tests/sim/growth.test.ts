import { describe, expect, it } from 'vitest';
import { CRITTERS, EGG, ESSENCES, LIFECYCLE, SIM } from '../../src/config/tuning';
import { WILD_CRITTERS, giveCritter, giveEssence, mainStatOf } from '../../src/sim/critters';
import { winningType } from '../../src/sim/alignment';
import { secondTypeFor, upgradeCandidate } from '../../src/sim/lifecycle';
import { createEgg } from '../../src/sim/nubbin';
import { Rng } from '../../src/sim/rng';
import { gradeMultiplier, levelOf } from '../../src/sim/stats';
import type { Command, Nubbin, SimEvent, World } from '../../src/sim/types';
import { applyCommand, createWorld, stepWorld } from '../../src/sim/world';

function child(): Nubbin {
  const n = createEgg('n1', { x: 0, z: 0 }, Rng.fromSeed(1));
  n.stage = 'child';
  n.behavior.state = 'sit';
  for (const s of Object.values(n.stats)) s.grade = 'C';
  return n;
}

function run(world: World, steps: number, cmds: Command[] = []): SimEvent[] {
  const events: SimEvent[] = [];
  for (const c of cmds) applyCommand(world, c, events);
  for (let i = 0; i < steps; i++) events.push(...stepWorld(world, SIM.stepMs));
  return events;
}

describe('critters', () => {
  it('has 24 wild species, 3 or more per type, each setting 2 to 4 slots', () => {
    expect(WILD_CRITTERS).toHaveLength(24);
    for (const type of ['swim', 'fly', 'run', 'power', 'normal'] as const) {
      expect(WILD_CRITTERS.filter((s) => s.type === type).length).toBeGreaterThanOrEqual(3);
    }
    for (const s of WILD_CRITTERS) {
      expect(s.parts.length, s.id).toBeGreaterThanOrEqual(2);
      expect(s.parts.length, s.id).toBeLessThanOrEqual(4);
    }
  });

  it('adds +30 to the main stat, +10 to one other, sets parts and nudges lean', () => {
    const n = child();
    const events: SimEvent[] = [];
    giveCritter(n, 'rabbit', Rng.fromSeed(3), events);
    expect(n.stats.run.points).toBeCloseTo(CRITTERS.mainStatPoints);
    const others = (['swim', 'fly', 'power', 'stamina'] as const).map((k) => n.stats[k].points);
    expect(others.filter((p) => p > 0)).toHaveLength(1);
    expect(Math.max(...others)).toBeCloseTo(CRITTERS.otherStatPoints);
    expect(n.parts.ears).toBe('rabbit-ears');
    expect(n.parts.tail).toBe('rabbit-tail');
    expect(n.typeLean.run).toBe(CRITTERS.leanNudge);
    expect(events[0]?.kind).toBe('critterGiven');
  });

  it('the newest critter wins a slot and parts carry into adulthood', () => {
    const n = child();
    giveCritter(n, 'rabbit', Rng.fromSeed(1), []);
    giveCritter(n, 'penguin', Rng.fromSeed(2), []);
    expect(n.parts.ears).toBe('rabbit-ears');
    expect(n.parts.legs).toBe('penguin-legs');
    expect(n.parts.arms).toBe('penguin-arms');
    const w = createWorld(1, 0);
    w.nubbins = [n];
    run(w, Math.ceil((LIFECYCLE.childMs + LIFECYCLE.cocoonMs) / SIM.stepMs) + 2);
    expect(n.stage).toBe('adult');
    expect(n.parts.legs).toBe('penguin-legs');
  });

  it('normal critters train Stamina and nudge lean toward Normal', () => {
    const n = child();
    giveCritter(n, 'sheep', Rng.fromSeed(1), []);
    expect(n.stats.stamina.points).toBeCloseTo(CRITTERS.mainStatPoints);
    expect(n.typeLean.normal).toBe(CRITTERS.leanNudge);
    expect(n.typeLean.swim + n.typeLean.fly + n.typeLean.run + n.typeLean.power).toBe(0);
    expect(mainStatOf('normal')).toBe('stamina');
  });

  it('a normal essence nudges lean toward Normal', () => {
    const n = child();
    giveEssence(n, 'normal', []);
    expect(n.typeLean.normal).toBe(ESSENCES.leanNudge);
  });

  it('Normal critters can win the lean, and no clear lead still ends Normal', () => {
    // Normal now competes like any type: Normal critters can win outright.
    const n = child();
    for (let i = 0; i < 4; i++) giveCritter(n, 'sheep', Rng.fromSeed(i), []);
    giveCritter(n, 'rabbit', Rng.fromSeed(9), []);
    expect(winningType(n.typeLean)).toBe('normal');
    // Two types neck and neck with no Normal lean still resolve to Normal.
    expect(winningType({ swim: 100, fly: 95, run: 0, power: 0, normal: 0 })).toBe('normal');
  });

  it('essences add +50 and nudge lean, no parts', () => {
    const n = child();
    giveEssence(n, 'fly', []);
    expect(n.stats.fly.points).toBeCloseTo(ESSENCES.statPoints);
    expect(n.typeLean.fly).toBe(ESSENCES.leanNudge);
    expect(Object.values(n.parts).every((p) => p === null)).toBe(true);
  });

  it('giving through the world spends inventory and moves alignment', () => {
    const w = createWorld(5, 0);
    run(w, EGG.hatchMs / SIM.stepMs + 2);
    const n = w.nubbins[0]!;
    w.inventory.critters.tiger = 1;
    w.inventory.essences.swim = 1;
    run(w, 1, [
      { kind: 'giveCritter', nubbinId: n.id, species: 'tiger' },
      { kind: 'giveEssence', nubbinId: n.id, type: 'swim' },
      { kind: 'giveCritter', nubbinId: n.id, species: 'tiger' }, // none left
    ]);
    expect(w.inventory.critters.tiger).toBe(0);
    expect(w.inventory.essences.swim).toBe(0);
    expect(n.parts.ears).toBe('tiger-ears');
    expect(n.stats.power.points).toBeCloseTo(
      CRITTERS.mainStatPoints * gradeMultiplier(n.stats.power.grade),
    );
    expect(n.alignment).toBeCloseTo(0.02);
  });
});

describe('evolution', () => {
  it('raises the highest-level non-S stat by one grade, permanently', () => {
    const n = child();
    n.stats.swim.points = 500;
    n.stats.fly.points = 900;
    n.stats.fly.grade = 'S';
    expect(upgradeCandidate(n)).toBe('swim');
    const w = createWorld(1, 0);
    w.nubbins = [n];
    const events = run(w, Math.ceil((LIFECYCLE.childMs + LIFECYCLE.cocoonMs) / SIM.stepMs) + 2);
    expect(n.stats.swim.grade).toBe('B');
    expect(n.gradeUpgrades.swim).toBe(1);
    const e = events.find((x) => x.kind === 'evolved');
    expect(e && e.kind === 'evolved' && e.upgraded).toBe('swim');
  });

  it('unlocks the Sun Grove on the first Sun adult, once', () => {
    const w = createWorld(1, 0);
    const a = child();
    const b = { ...child(), id: 'n2' };
    a.alignment = 0.9;
    b.alignment = 0.9;
    w.nubbins = [a, b];
    const events = run(w, Math.ceil((LIFECYCLE.childMs + LIFECYCLE.cocoonMs) / SIM.stepMs) + 2);
    expect(w.unlocks.sunGrove).toBe(true);
    expect(w.unlocks.moonGrove).toBe(false);
    const unlocks = events.filter((e) => e.kind === 'evolved' && e.groveUnlocked === 'sun');
    expect(unlocks).toHaveLength(1);
    run(w, 1, [{ kind: 'setGrove', grove: 'moon' }]);
    expect(w.grove).toBe('main');
    run(w, 1, [{ kind: 'setGrove', grove: 'sun' }]);
    expect(w.grove).toBe('sun');
  });

  it('second evolution follows the type trained most after evolving', () => {
    const n = child();
    n.typeLean.swim = 200;
    const w = createWorld(1, 0);
    w.nubbins = [n];
    run(w, Math.ceil((LIFECYCLE.childMs + LIFECYCLE.cocoonMs) / SIM.stepMs) + 2);
    expect(n.form?.type).toBe('swim');
    expect(secondTypeFor(n)).toBeNull();
    n.typeLean.power += 100;
    expect(secondTypeFor(n)).toBe('power');
    const events = run(w, Math.ceil(LIFECYCLE.secondEvolutionMs / SIM.stepMs) + 2);
    expect(n.form?.second).toBe('power');
    expect(events.some((e) => e.kind === 'secondEvolved')).toBe(true);
  });

  it('a scripted mix at ×100 produces the predicted adult form', () => {
    // 3 swim critters + 2 swim essences + lots of petting as the Sun Keeper → Sun Swim.
    const w = createWorld(42, 0);
    run(w, EGG.hatchMs / SIM.stepMs + 2);
    const n = w.nubbins[0]!;
    w.inventory.critters.penguin = 3;
    w.inventory.essences.swim = 2;
    w.inventory.essences.fly = 1;
    run(w, 1, [
      { kind: 'giveCritter', nubbinId: n.id, species: 'penguin' },
      { kind: 'giveCritter', nubbinId: n.id, species: 'penguin' },
      { kind: 'giveCritter', nubbinId: n.id, species: 'penguin' },
      { kind: 'giveEssence', nubbinId: n.id, type: 'swim' },
      { kind: 'giveEssence', nubbinId: n.id, type: 'swim' },
      { kind: 'giveEssence', nubbinId: n.id, type: 'fly' },
    ]);
    // Petting: kindness as the Sun Keeper, 60 times.
    for (let i = 0; i < 60; i++) {
      n.alignment = Math.min(1, n.alignment + 0.01);
    }
    expect(n.alignment).toBeCloseTo(0.66);
    // ×100: 100 sim seconds per real second; here just run the sim time.
    run(w, Math.ceil((LIFECYCLE.childMs + LIFECYCLE.cocoonMs) / SIM.stepMs) + 2);
    expect(n.stage).toBe('adult');
    expect(n.form?.band).toBe('sun');
    expect(n.form?.type).toBe('swim');
    expect(levelOf(n.stats.swim.points)).toBeGreaterThanOrEqual(1);
  });

  it('a balanced mix becomes Normal and a Moon-leaning one becomes Moon', () => {
    const w = createWorld(7, 0);
    run(w, EGG.hatchMs / SIM.stepMs + 2);
    const n = w.nubbins[0]!;
    n.typeLean.run = 100;
    n.typeLean.power = 95;
    n.alignment = -0.7;
    run(w, Math.ceil((LIFECYCLE.childMs + LIFECYCLE.cocoonMs) / SIM.stepMs) + 2);
    expect(n.form).toMatchObject({ band: 'moon', type: 'normal' });
  });
});
