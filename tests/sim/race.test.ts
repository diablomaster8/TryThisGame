import { describe, expect, it } from 'vitest';
import { EGG, LIFECYCLE, RACE, SIM } from '../../src/config/tuning';
import { decidePersonality, idleMultipliers } from '../../src/sim/personality';
import {
  cheer,
  cheerReady,
  COURSES,
  courseLength,
  createRace,
  playerPlacement,
  prizeFor,
  sectionAt,
  statFor,
  stepRace,
} from '../../src/sim/race';
import { createEgg } from '../../src/sim/nubbin';
import { Rng } from '../../src/sim/rng';
import { STAT_KEYS, type Nubbin, type SimEvent } from '../../src/sim/types';
import { applyCommand, createWorld, stepWorld } from '../../src/sim/world';

function racer(level: number): Nubbin {
  const n = createEgg('p', { x: 0, z: 0 }, Rng.fromSeed(2));
  n.stage = 'adult';
  n.name = 'Player';
  for (const k of STAT_KEYS) n.stats[k].points = level * 100;
  return n;
}

function runRace(race: ReturnType<typeof createRace>, cheering = false): void {
  while (!race.finished) {
    if (cheering && cheerReady(race)) cheer(race);
    stepRace(race, SIM.stepMs);
  }
}

describe('courses', () => {
  it('has 3 courses built from the five section kinds', () => {
    expect(COURSES).toHaveLength(3);
    for (const c of COURSES) {
      expect(courseLength(c)).toBeGreaterThan(20);
      for (const s of c.sections)
        expect(['swim', 'fly', 'run', 'climb', 'stretch']).toContain(s.kind);
    }
    expect(statFor('climb')).toBe('power');
    expect(statFor('stretch')).toBe('stamina');
    const c = COURSES[0]!;
    expect(sectionAt(c, 0).index).toBe(0);
    expect(sectionAt(c, 15).index).toBe(1);
    expect(sectionAt(c, 999).index).toBe(c.sections.length - 1);
  });
});

describe('race', () => {
  it('is deterministic and has 4–8 rivals scaling with the tier', () => {
    for (let tier = 1; tier <= 3; tier++) {
      const a = createRace(COURSES[0]!, tier, racer(20), 7);
      const b = createRace(COURSES[0]!, tier, racer(20), 7);
      const [lo, hi] = RACE.rivals[tier - 1]!;
      expect(a.racers.length - 1).toBeGreaterThanOrEqual(lo);
      expect(a.racers.length - 1).toBeLessThanOrEqual(hi);
      runRace(a);
      runRace(b);
      expect(a.placements).toEqual(b.placements);
      expect(a.finished).toBe(true);
    }
  });

  it('stronger stats place better', () => {
    const weak = createRace(COURSES[1]!, 2, racer(2), 3);
    const strong = createRace(COURSES[1]!, 2, racer(95), 3);
    runRace(weak);
    runRace(strong);
    expect(playerPlacement(strong)).toBe(1);
    expect(playerPlacement(weak)).toBeGreaterThan(playerPlacement(strong));
  });

  it('stamina runs out into a rest and refills partly', () => {
    const race = createRace(COURSES[0]!, 1, racer(0), 1);
    const p = race.racers[0]!;
    let rested = false;
    for (let i = 0; i < 2000 && !rested; i++) {
      stepRace(race, SIM.stepMs);
      rested = p.restMs > 0;
    }
    expect(rested).toBe(true);
    const posAtRest = p.pos;
    for (let i = 0; i < RACE.restMs / SIM.stepMs; i++) stepRace(race, SIM.stepMs);
    expect(p.pos).toBe(posAtRest); // did not move while resting
    stepRace(race, SIM.stepMs);
    expect(p.stamina).toBeGreaterThan(0);
  });

  it('cheering boosts and respects the 3 s cooldown', () => {
    const race = createRace(COURSES[0]!, 1, racer(30), 5);
    expect(cheer(race)).toBe(true);
    expect(cheer(race)).toBe(false);
    for (let i = 0; i < RACE.cheerCooldownMs / SIM.stepMs; i++) stepRace(race, SIM.stepMs);
    expect(cheerReady(race)).toBe(true);
    const plain = createRace(COURSES[0]!, 1, racer(30), 5);
    const cheered = createRace(COURSES[0]!, 1, racer(30), 5);
    runRace(plain);
    runRace(cheered, true);
    const finish = (r: typeof plain) => r.racers[0]!.finishedAtMs ?? Infinity;
    expect(finish(cheered)).toBeLessThan(finish(plain));
  });

  it('pays prizes for the top three and records tier wins', () => {
    expect(prizeFor(1, 2)).toBe(40);
    expect(prizeFor(3, 1)).toBe(5);
    expect(prizeFor(4, 3)).toBe(0);
    const w = createWorld(1, 0);
    const events: SimEvent[] = [];
    applyCommand(
      w,
      { kind: 'raceResult', course: 'meadow', tier: 1, placement: 1, shells: 20, hat: 'crown' },
      events,
    );
    applyCommand(
      w,
      { kind: 'raceResult', course: 'meadow', tier: 2, placement: 2, shells: 20, hat: null },
      events,
    );
    expect(w.inventory.shells).toBe(40);
    expect(w.inventory.hats).toEqual(['crown']);
    expect(w.races.meadow).toBe(1); // second place does not unlock the next tier
  });

  it('always ends within the cap', () => {
    const race = createRace(COURSES[2]!, 3, racer(0), 9);
    runRace(race);
    expect(race.timeMs).toBeLessThanOrEqual(RACE.maxMs);
    expect(race.placements).toHaveLength(race.racers.length);
  });
});

describe('personality', () => {
  it('follows the childhood care rules in order', () => {
    expect(decidePersonality({ pets: 2, throws: 6, feeds: 0 })).toBe('mischievous');
    expect(decidePersonality({ pets: 12, throws: 1, feeds: 2 })).toBe('cheerful');
    expect(decidePersonality({ pets: 1, throws: 0, feeds: 1 })).toBe('shy');
    expect(decidePersonality({ pets: 3, throws: 1, feeds: 6 })).toBe('lazy');
    expect(decidePersonality({ pets: 5, throws: 1, feeds: 2 })).toBe('cheerful');
    expect(idleMultipliers('lazy').sit).toBeGreaterThan(idleMultipliers('cheerful').sit);
    expect(idleMultipliers(null)).toEqual({ greet: 1, play: 1, sit: 1, swim: 1 });
  });

  it('is locked in at evolution from pets, feeds and throws as a child', () => {
    const w = createWorld(5, 0);
    w.nubbins = [w.nubbins[0]!];
    const n = w.nubbins[0]!;
    for (let i = 0; i < EGG.hatchMs / SIM.stepMs + 2; i++) stepWorld(w, SIM.stepMs);
    // Throw it around a lot.
    for (let t = 0; t < 7; t++) {
      applyCommand(w, { kind: 'grab', nubbinId: n.id }, []);
      applyCommand(w, { kind: 'release', vel: { x: 6, z: 0 } }, []);
      for (let i = 0; i < 40; i++) stepWorld(w, SIM.stepMs);
    }
    expect(n.childCare.throws).toBe(7);
    expect(n.personality).toBeNull();
    for (let i = 0; i < (LIFECYCLE.childMs + LIFECYCLE.cocoonMs) / SIM.stepMs + 5; i++) {
      n.needs.hunger = 1;
      stepWorld(w, SIM.stepMs);
    }
    expect(n.stage).toBe('adult');
    expect(n.personality).toBe('mischievous');
  });
});
