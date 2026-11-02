import { describe, expect, it } from 'vitest';
import { EGG, GRACE, LIFECYCLE, NEEDS, REBIRTH, SIM } from '../../src/config/tuning';
import { holdEndOfLife, meetsRebirthBar, rebirthReadiness } from '../../src/sim/lifecycle';
import { applyPet, decayNeeds, graceFeed, inGrace } from '../../src/sim/needs';
import { catchUp } from '../../src/sim/offline';
import { deserialize, SAVE_VERSION, serialize } from '../../src/sim/save';
import { lifespanMs } from '../../src/sim/slips';
import type { Nubbin, SimEvent, World } from '../../src/sim/types';
import { createWorld, stepWorld } from '../../src/sim/world';

/**
 * The gentle life cycle (Maor, 2026-11-02): moods rest at mild content, catch-up naps
 * before a sleepy slip, the rebirth bar is lower, adults live a day, and a live check that
 * would end in a departure opens a last-day window where care counts extra.
 */

const MIN = 60_000;
const HOUR = 60 * MIN;
const DAY = 24 * HOUR;

function runMs(world: World, ms: number): SimEvent[] {
  const events: SimEvent[] = [];
  for (let t = 0; t < ms; t += SIM.stepMs) events.push(...stepWorld(world, SIM.stepMs));
  return events;
}

function solo(seed = 3): { w: World; n: Nubbin } {
  const w = createWorld(seed, 0);
  w.nubbins = [w.nubbins[0]!];
  return { w, n: w.nubbins[0]! };
}

/** An adult with `leftMs` of its life to go, under the rebirth bar. */
function unlovedAdult(seed: number, leftMs: number): { w: World; n: Nubbin } {
  const { w, n } = solo(seed);
  runMs(w, EGG.hatchMs + LIFECYCLE.childMs + LIFECYCLE.cocoonMs + 1000);
  expect(n.stage).toBe('adult');
  n.needs.affection = 5;
  n.happinessSum = 0;
  n.happinessSamples = 10 * 3600;
  n.stageMs = lifespanMs(n) - leftMs;
  return { w, n };
}

const has = (events: SimEvent[], kind: SimEvent['kind']): boolean =>
  events.some((e) => e.kind === kind);
const cocoon = (events: SimEvent[], kind: 'rebirth' | 'depart'): boolean =>
  events.some((e) => e.kind === 'cocoonStarted' && e.cocoon === kind);

describe('the resting mood', () => {
  it('drifts toward NEEDS.happinessRest from above and below, at the tuned rate', () => {
    const { n } = solo();
    n.needs.hunger = 1;
    n.needs.happiness = 60;
    decayNeeds(n, 10 * MIN);
    expect(n.needs.happiness).toBeCloseTo(60 - NEEDS.happinessDriftPerMinute * 10);
    for (const start of [80, -40, 0]) {
      n.needs.happiness = start;
      for (let i = 0; i < 24 * 60; i++) {
        n.needs.hunger = 1;
        decayNeeds(n, MIN);
      }
      expect(n.needs.happiness).toBe(NEEDS.happinessRest);
    }
  });

  it('a fed Nubbin left alone averages near the rest, which clears the lifetime bar', () => {
    expect(NEEDS.happinessRest).toBeGreaterThanOrEqual(REBIRTH.minLifetimeHappiness);
  });
});

describe('catch-up naps', () => {
  it('logs no sleepy slips a whole day away', () => {
    const { w, n } = solo(4);
    runMs(w, EGG.hatchMs + LIFECYCLE.childMs + LIFECYCLE.cocoonMs + 1000);
    const before = n.slips.filter((s) => s.kind === 'sleepy').length;
    w.settings.offlineAging.mode = 'indefinite';
    catchUp(w, DAY, 0);
    expect(n.slips.filter((s) => s.kind === 'sleepy').length).toBe(before);
  });
});

describe('the last day', () => {
  it('a live check under the bar opens the window instead of departing', () => {
    const { w, n } = unlovedAdult(41, 1000);
    const events = runMs(w, 2000);
    expect(has(events, 'graceStarted')).toBe(true);
    expect(cocoon(events, 'depart')).toBe(false);
    expect(inGrace(n)).toBe(true);
    expect(n.stage).toBe('adult');
    const age = n.ageMs;
    runMs(w, MIN);
    expect(n.ageMs).toBe(age); // the age waits with the window
  });

  it('care in the window can still bring it back', () => {
    const { w, n } = unlovedAdult(42, 1000);
    runMs(w, 2000);
    expect(inGrace(n)).toBe(true);
    const affection = n.needs.affection;
    n.needs.happiness = 60;
    applyPet(n);
    expect(n.needs.affection).toBe(affection + NEEDS.petAffection * GRACE.affectionScale);
    let events: SimEvent[] = [];
    for (let i = 0; i < 20 && !has(events, 'graceKept'); i++) {
      applyPet(n);
      graceFeed(n);
      events = runMs(w, 30_000);
    }
    expect(has(events, 'graceKept')).toBe(true);
    expect(cocoon(events, 'rebirth')).toBe(true);
    expect(inGrace(n)).toBe(false);
    const after = runMs(w, LIFECYCLE.cocoonMs + 1000);
    expect(has(after, 'reborn')).toBe(true);
    expect(w.memorials).toHaveLength(0);
  });

  it('departs gently when the window closes with the bar unmet', () => {
    const { w, n } = unlovedAdult(43, 1000);
    runMs(w, 2000);
    expect(inGrace(n)).toBe(true);
    const events = runMs(w, GRACE.windowMs + LIFECYCLE.cocoonMs + 2000);
    expect(has(events, 'graceKept')).toBe(false);
    expect(cocoon(events, 'depart')).toBe(true);
    expect(has(events, 'departed')).toBe(true);
    expect(w.memorials).toHaveLength(1);
  });

  it('only runs live: catch-up and a held away screen leave it where it was', () => {
    const { w, n } = unlovedAdult(44, 1000);
    runMs(w, 2000);
    const left = n.graceMs;
    w.settings.offlineAging.mode = 'indefinite';
    catchUp(w, 3 * HOUR, 0);
    expect(n.graceMs).toBe(left);
    expect(w.nubbins).toHaveLength(1);
    holdEndOfLife(w, true);
    runMs(w, MIN);
    expect(n.graceMs).toBe(left);
    holdEndOfLife(w, false);
    runMs(w, MIN);
    expect(n.graceMs).toBeLessThan(left!);
  });

  it('a Nubbin that waited while the Keeper was away gets its window live', () => {
    const { w, n } = unlovedAdult(45, 30 * MIN);
    w.settings.offlineAging.mode = 'indefinite';
    w.settings.offlineAging.allowOfflineDepartures = false;
    const report = catchUp(w, DAY, 0);
    expect(has(report.events, 'awaitingKeeper')).toBe(true);
    expect(n.awaitingKeeper).toBe(true);
    const live = runMs(w, 1000);
    expect(has(live, 'graceStarted')).toBe(true);
    expect(n.awaitingKeeper).toBe(false);
  });

  it('meets the bar exactly at the tuned thresholds', () => {
    const { w, n } = solo(46);
    n.happinessSamples = 100;
    n.happinessSum = REBIRTH.minLifetimeHappiness * 100;
    n.needs.affection = REBIRTH.minAffection;
    expect(meetsRebirthBar(n, w)).toBe(true);
    expect(rebirthReadiness(n, w)).toBe(1);
    n.needs.affection = REBIRTH.minAffection - 1;
    expect(meetsRebirthBar(n, w)).toBe(false);
    expect(rebirthReadiness(n, w)).toBeCloseTo((REBIRTH.minAffection - 1) / REBIRTH.minAffection);
  });
});

describe('the heads-up', () => {
  it('comes once, live, within the notice time of the end when under the bar', () => {
    const { w, n } = unlovedAdult(51, GRACE.noticeMs + 2000);
    expect(has(runMs(w, 1000), 'restSoon')).toBe(false);
    const events = runMs(w, 3000);
    expect(events.filter((e) => e.kind === 'restSoon')).toHaveLength(1);
    expect(n.restNoticed).toBe(true);
    expect(has(runMs(w, MIN), 'restSoon')).toBe(false);
  });

  it('stays quiet for a loved Nubbin', () => {
    const { w, n } = unlovedAdult(52, GRACE.noticeMs - 1000);
    n.needs.affection = 90;
    n.happinessSum = 80 * n.happinessSamples;
    expect(has(runMs(w, 2000), 'restSoon')).toBe(false);
  });
});

describe('save v14', () => {
  it('a v13 save loads with no window and no heads-up yet', () => {
    const { w } = unlovedAdult(61, HOUR);
    const raw = JSON.parse(serialize(w, 1)) as { version: number; world: World };
    raw.version = 13;
    for (const n of raw.world.nubbins as unknown as Record<string, unknown>[]) {
      delete n.graceMs;
      delete n.restNoticed;
    }
    const back = deserialize(JSON.stringify(raw));
    expect(SAVE_VERSION).toBeGreaterThanOrEqual(14);
    expect(back.version).toBe(SAVE_VERSION);
    expect(back.world.nubbins[0]!.graceMs).toBeNull();
    expect(back.world.nubbins[0]!.restNoticed).toBe(false);
  });

  it('a window under way survives a save', () => {
    const { w, n } = unlovedAdult(62, 1000);
    runMs(w, 2000);
    const left = n.graceMs;
    const back = deserialize(serialize(w, 1)).world.nubbins[0]!;
    expect(back.graceMs).toBe(left);
  });
});
