import { lifespanMs } from '../../src/sim/slips';
import { describe, expect, it } from 'vitest';
import { EGG, LIFECYCLE, REBIRTH, SIM } from '../../src/config/tuning';
import { eternalBandFor } from '../../src/sim/lifecycle';
import { catchUp } from '../../src/sim/offline';
import { createEgg } from '../../src/sim/nubbin';
import { Rng } from '../../src/sim/rng';
import type { Command, Nubbin, SimEvent, World } from '../../src/sim/types';
import { applyCommand, createWorld, stepWorld } from '../../src/sim/world';

const HOUR = 3_600_000;
const DAY = 24 * HOUR;

function run(world: World, steps: number, cmds: Command[] = []): SimEvent[] {
  const events: SimEvent[] = [];
  for (const c of cmds) applyCommand(world, c, events);
  for (let i = 0; i < steps; i++) events.push(...stepWorld(world, SIM.stepMs));
  return events;
}

/** Run the sim for `ms` at ×1000 fidelity: fixed steps, no frame cap. */
function runMs(world: World, ms: number): SimEvent[] {
  return run(world, Math.ceil(ms / SIM.stepMs));
}

function solo(seed = 3): { w: World; n: Nubbin } {
  const w = createWorld(seed, 0);
  w.nubbins = [w.nubbins[0]!];
  return { w, n: w.nubbins[0]! };
}

/** Keep a Nubbin loved: full needs, high happiness and affection, so it is reborn. */
function keepLoved(n: Nubbin): void {
  n.needs.hunger = 1;
  n.needs.energy = 1;
  n.needs.happiness = 80;
  n.needs.affection = 90;
}

const LIFE_MS = EGG.hatchMs + LIFECYCLE.childMs + LIFECYCLE.cocoonMs + LIFECYCLE.adultMs;

describe('a full life at ×1000', () => {
  it('egg → adult → rebirth → adult keeps name, 10% of points, grades and affection', () => {
    const { w, n } = solo();
    const name = n.name;
    // Loved from the start.
    const loveLoop = (ms: number) => {
      const chunk = 10 * 60_000;
      let left = ms;
      while (left > 0) {
        keepLoved(n);
        const step = Math.min(chunk, left);
        runMs(w, step);
        left -= step;
      }
    };
    loveLoop(EGG.hatchMs + LIFECYCLE.childMs + LIFECYCLE.cocoonMs + 1000);
    expect(n.stage).toBe('adult');
    n.stats.swim.points = 1000;
    n.stats.fly.points = 200;
    const gradeBefore = {
      ...Object.fromEntries(Object.entries(n.stats).map(([k, v]) => [k, v.grade])),
    };

    const events: SimEvent[] = [];
    const chunk = 10 * 60_000;
    const total = LIFECYCLE.adultMs + LIFECYCLE.cocoonMs + 1000;
    for (let t = 0; t < total; t += chunk) {
      keepLoved(n);
      events.push(...runMs(w, Math.min(chunk, total - t)));
    }
    expect(events.some((e) => e.kind === 'cocoonStarted' && e.cocoon === 'rebirth')).toBe(true);
    expect(events.some((e) => e.kind === 'reborn')).toBe(true);
    expect(w.nubbins).toHaveLength(1);
    expect(n.stage).toBe('egg');
    expect(n.name).toBe(name);
    expect(n.rebirths).toBe(1);
    // Fly was never trained, so exactly 10 % stays; Swim grew a little from pond time.
    expect(n.stats.fly.points).toBe(Math.floor(200 * REBIRTH.keepPointsFraction));
    expect(n.stats.swim.points).toBeGreaterThanOrEqual(100);
    expect(n.stats.swim.points).toBeLessThan(1000);
    for (const [k, g] of Object.entries(gradeBefore)) {
      expect(n.stats[k as keyof typeof n.stats].grade).toBe(g);
    }
    expect(n.needs.affection).toBe(90);
    expect(n.form).toBeNull();

    // Hatches again and greets with a heart, then grows up once more.
    let hatched = false;
    for (let i = 0; i < EGG.hatchMs / SIM.stepMs + 10 && !hatched; i++) {
      hatched = stepWorld(w, SIM.stepMs).some((e) => e.kind === 'hatched');
    }
    expect(hatched).toBe(true);
    expect(n.behavior.reaction).toBe('love');
    runMs(w, 1000);
    expect(n.behavior.reaction).toBe('love'); // the greeting lasts a couple of seconds
    loveLoop(LIFECYCLE.childMs + LIFECYCLE.cocoonMs + 1000);
    expect(n.stage).toBe('adult');
    expect(n.rebirths).toBe(1);
    expect(n.name).toBe(name);
  });

  it('an unloved adult departs and leaves a memorial flower', () => {
    const { w, n } = solo(5);
    runMs(w, EGG.hatchMs + LIFECYCLE.childMs + LIFECYCLE.cocoonMs + 1000);
    expect(n.stage).toBe('adult');
    n.needs.affection = 5;
    n.happinessSum = -50 * 10;
    n.happinessSamples = 10;
    n.needs.hunger = 1;
    const id = n.id;
    const events: SimEvent[] = [];
    const chunk = 10 * 60_000;
    for (let t = 0; t < LIFECYCLE.adultMs + LIFECYCLE.cocoonMs + 1000; t += chunk) {
      n.needs.hunger = 1;
      n.needs.energy = 1;
      n.needs.happiness = -50;
      events.push(...runMs(w, chunk));
    }
    expect(events.some((e) => e.kind === 'cocoonStarted' && e.cocoon === 'depart')).toBe(true);
    expect(events.some((e) => e.kind === 'departed')).toBe(true);
    expect(w.nubbins.find((x) => x.id === id)).toBeUndefined();
    expect(w.memorials).toHaveLength(1);
    expect(w.memorials[0]?.name).toBe(n.name);
  });

  it('runs a whole life quickly (sim time 6+ hours in under 3 s)', () => {
    const { w, n } = solo(8);
    const start = performance.now();
    const chunk = 10 * 60_000;
    for (let t = 0; t < LIFE_MS + LIFECYCLE.cocoonMs + 1000; t += chunk) {
      keepLoved(n);
      runMs(w, chunk);
    }
    expect(performance.now() - start).toBeLessThan(3000);
    expect(n.rebirths).toBe(1);
  });
});

describe('Eternal', () => {
  const base = () => {
    const n = createEgg('e', { x: 0, z: 0 }, Rng.fromSeed(1));
    n.rebirths = 2;
    return n;
  };

  it('happens only with 2+ rebirths, Normal type and a strong or balanced alignment', () => {
    const n = base();
    n.alignment = 0.9;
    expect(eternalBandFor(n, 'normal')).toBe('sun');
    n.alignment = -0.9;
    expect(eternalBandFor(n, 'normal')).toBe('moon');
    n.alignment = 0.05;
    expect(eternalBandFor(n, 'normal')).toBe('neutral');
    n.alignment = -0.1;
    expect(eternalBandFor(n, 'normal')).toBe('neutral');
  });

  it('never happens otherwise', () => {
    const n = base();
    n.alignment = 0.9;
    expect(eternalBandFor(n, 'swim')).toBeNull();
    n.alignment = 0.8;
    expect(eternalBandFor(n, 'normal')).toBeNull();
    n.alignment = 0.11;
    expect(eternalBandFor(n, 'normal')).toBeNull();
    n.alignment = 0.5;
    expect(eternalBandFor(n, 'normal')).toBeNull();
    n.rebirths = 1;
    n.alignment = 0.9;
    expect(eternalBandFor(n, 'normal')).toBeNull();
  });

  it('an Eternal never ages past the end-of-life check', () => {
    const { w, n } = solo(11);
    n.rebirths = 2;
    n.alignment = 0.95;
    const events = runMs(w, EGG.hatchMs + LIFECYCLE.childMs + LIFECYCLE.cocoonMs + 1000);
    expect(events.some((e) => e.kind === 'eternal' && e.band === 'sun')).toBe(true);
    expect(n.eternal).toBe('sun');
    expect(n.form?.type).toBe('normal');
    const later: SimEvent[] = [];
    const chunk = 10 * 60_000;
    for (let t = 0; t < LIFECYCLE.adultMs + HOUR; t += chunk) {
      n.needs.hunger = 1;
      later.push(...runMs(w, chunk));
    }
    expect(n.stage).toBe('adult');
    expect(later.some((e) => e.kind === 'cocoonStarted')).toBe(false);
    expect(w.nubbins).toHaveLength(1);
  });
});

describe('end of life while away', () => {
  function adultNearEnd(seed: number): { w: World; n: Nubbin } {
    const { w, n } = solo(seed);
    runMs(w, EGG.hatchMs + LIFECYCLE.childMs + LIFECYCLE.cocoonMs + 1000);
    n.stageMs = LIFECYCLE.adultMs - 30 * 60_000; // 30 minutes left
    n.needs.affection = 5;
    n.happinessSum = -500;
    n.happinessSamples = 10;
    return { w, n };
  }

  it('with departures off, nobody departs during catch-up and the Nubbin waits', () => {
    const { w, n } = adultNearEnd(21);
    w.settings.offlineAging.mode = 'indefinite';
    w.settings.offlineAging.allowOfflineDepartures = false;
    const report = catchUp(w, 7 * DAY, 0);
    expect(report.events.some((e) => e.kind === 'departed')).toBe(false);
    expect(report.events.some((e) => e.kind === 'awaitingKeeper')).toBe(true);
    expect(w.nubbins).toHaveLength(1);
    expect(n.awaitingKeeper).toBe(true);
    expect(n.stageMs).toBe(lifespanMs(n)); // frozen there (slips may have trimmed the span)
    expect(n.stage).toBe('adult');
    // Live play resumes: the check runs with the cocoon on screen.
    n.needs.hunger = 1;
    const live = runMs(w, 1000);
    expect(live.some((e) => e.kind === 'cocoonStarted' && e.cocoon === 'depart')).toBe(true);
    const after = runMs(w, LIFECYCLE.cocoonMs + 1000);
    expect(after.some((e) => e.kind === 'departed')).toBe(true);
    expect(w.memorials).toHaveLength(1);
  });

  it('a waiting Nubbin that is loved before the check is reborn instead', () => {
    const { w, n } = adultNearEnd(22);
    w.settings.offlineAging.mode = 'indefinite';
    catchUp(w, DAY, 0);
    expect(n.awaitingKeeper).toBe(true);
    keepLoved(n);
    n.happinessSum = 80 * 10;
    n.happinessSamples = 10;
    const live = runMs(w, 1000);
    expect(live.some((e) => e.kind === 'cocoonStarted' && e.cocoon === 'rebirth')).toBe(true);
  });

  it('with departures on, departures happen during catch-up and are reported', () => {
    const { w } = adultNearEnd(23);
    w.settings.offlineAging.mode = 'indefinite';
    w.settings.offlineAging.allowOfflineDepartures = true;
    const report = catchUp(w, DAY, 0);
    expect(report.events.some((e) => e.kind === 'departed')).toBe(true);
    expect(w.nubbins).toHaveLength(0);
    expect(w.memorials).toHaveLength(1);
  });

  it('rebirths always happen during catch-up, even with departures off', () => {
    const { w, n } = adultNearEnd(24);
    keepLoved(n);
    n.happinessSum = 80 * 10;
    n.happinessSamples = 10;
    w.settings.offlineAging.mode = 'indefinite';
    w.settings.offlineAging.allowOfflineDepartures = false;
    const report = catchUp(w, 2 * HOUR, 0);
    expect(report.events.some((e) => e.kind === 'reborn')).toBe(true);
    expect(n.rebirths).toBe(1);
  });
});
