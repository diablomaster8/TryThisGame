import { describe, expect, it } from 'vitest';
import { LIFECYCLE, SIM } from '../../src/config/tuning';
import { advanceStage, rebirth } from '../../src/sim/lifecycle';
import { catchUp, coarseStep } from '../../src/sim/offline';
import type { Nubbin, SimEvent, World } from '../../src/sim/types';
import { createWorld, stepWorld } from '../../src/sim/world';

// Being away must not be kinder or harsher than being watched (review 2026-10-18 B,
// Bugs 7 and 8).
const HOUR = 3_600_000;

function solo(seed = 7): { w: World; n: Nubbin } {
  const w = createWorld(seed, 0);
  w.nubbins = [w.nubbins[0]!];
  return { w, n: w.nubbins[0]! };
}

const upgrades = (n: Nubbin): number =>
  Object.values(n.gradeUpgrades).reduce((a, b) => a + (b ?? 0), 0);

describe('slips while away (Bug 7)', () => {
  it('a child nobody pets while the game is closed logs slips and is not well raised', () => {
    const { w, n } = solo();
    w.settings.offlineAging.mode = 'indefinite';
    const report = catchUp(w, 3 * HOUR, 0);
    expect(report.events.some((e) => e.kind === 'evolved')).toBe(true);
    expect(n.slipCount).toBeGreaterThan(0);
    expect(n.wellRaised).toBe(false);
  });

  it('rain while away is not a slip: the weather is not simulated then', () => {
    const { w, n } = solo();
    n.stage = 'child';
    n.needs.affection = 80;
    w.weather.kind = 'rain';
    for (let i = 0; i < 10; i++) coarseStep(w, SIM.coarseStepMs, []);
    expect(n.slips.some((s) => s.kind === 'wet')).toBe(false);
  });

  it('the well-raised bonus grade is recorded in gradeUpgrades', () => {
    const { w, n } = solo();
    n.stage = 'cocoon';
    n.cocoonKind = 'evolve';
    n.form = null;
    n.stageMs = 0;
    n.slipCount = 0;
    const events: SimEvent[] = [];
    advanceStage(n, LIFECYCLE.cocoonMs + 1, events, w, false);
    expect(events.some((e) => e.kind === 'wellRaised')).toBe(true);
    // One upgrade from evolution, one from the bonus.
    expect(upgrades(n)).toBe(2);
  });

  it('rebirth clears wellRaised, so the next childhood earns it again', () => {
    const { n } = solo();
    n.wellRaised = true;
    rebirth(n, []);
    expect(n.wellRaised).toBe(false);
  });
});

describe('lifetime happiness is weighted by time (Bug 8)', () => {
  it('a minute away weighs the same as a minute watched', () => {
    const live = solo(8);
    live.n.stage = 'child';
    const before = live.n.happinessSamples;
    for (let i = 0; i < 60_000 / SIM.stepMs; i++) stepWorld(live.w, SIM.stepMs);
    const liveWeight = live.n.happinessSamples - before;

    const away = solo(8);
    away.n.stage = 'child';
    const awayBefore = away.n.happinessSamples;
    coarseStep(away.w, 60_000, []);
    expect(away.n.happinessSamples - awayBefore).toBe(liveWeight);
  });
});
