import { describe, expect, it } from 'vitest';
import { EGG, LIFECYCLE, SIM } from '../../src/config/tuning';
import { allowedSpan, catchUp } from '../../src/sim/offline';
import { createWorld, stepWorld } from '../../src/sim/world';

const HOUR = 3_600_000;
const DAY = 24 * HOUR;

function hatched() {
  const w = createWorld(11, 0);
  for (let i = 0; i < EGG.hatchMs / SIM.stepMs + 1; i++) stepWorld(w, SIM.stepMs);
  return w;
}

describe('allowedSpan', () => {
  const base = { capHours: 8, allowOfflineDepartures: false };
  it('indefinite simulates the whole gap', () => {
    expect(allowedSpan(3 * DAY, { ...base, mode: 'indefinite' })).toBe(3 * DAY);
  });
  it('capped stops at the entered hours', () => {
    expect(allowedSpan(3 * DAY, { ...base, mode: 'capped' })).toBe(8 * HOUR);
    expect(allowedSpan(2 * HOUR, { ...base, mode: 'capped' })).toBe(2 * HOUR);
  });
  it('off simulates nothing', () => {
    expect(allowedSpan(3 * DAY, { ...base, mode: 'off' })).toBe(0);
  });
});

describe('catchUp', () => {
  it('mode off leaves the world untouched', () => {
    const w = hatched();
    w.settings.offlineAging.mode = 'off';
    const before = w.timeMs;
    const report = catchUp(w, 2 * DAY, 999);
    expect(report.simulatedMs).toBe(0);
    expect(w.timeMs).toBe(before);
    expect(w.lastWallMs).toBe(999);
  });

  it('capped simulates exactly the cap', () => {
    const w = hatched();
    w.settings.offlineAging.mode = 'capped';
    w.settings.offlineAging.capHours = 2;
    const before = w.timeMs;
    const report = catchUp(w, 2 * DAY, 0);
    expect(report.simulatedMs).toBe(2 * HOUR);
    expect(w.timeMs - before).toBe(2 * HOUR);
  });

  it('indefinite simulates the full gap and records evolutions', () => {
    const w = hatched();
    w.settings.offlineAging.mode = 'indefinite';
    const report = catchUp(w, 2 * HOUR, 0);
    expect(report.simulatedMs).toBe(2 * HOUR);
    expect(w.nubbins.every((n) => n.stage === 'adult')).toBe(true);
    expect(report.events.filter((e) => e.kind === 'evolved')).toHaveLength(2);
  });

  it('eggs hatch while away and are reported', () => {
    const w = createWorld(4, 0);
    w.settings.offlineAging.mode = 'indefinite';
    const report = catchUp(w, 10 * 60_000, 0);
    expect(report.events.filter((e) => e.kind === 'hatched')).toHaveLength(2);
  });

  it('a 7-day indefinite catch-up finishes in under 3 s and nobody starves', () => {
    const w = hatched();
    w.settings.offlineAging.mode = 'indefinite';
    const start = performance.now();
    catchUp(w, 7 * DAY, 0);
    expect(performance.now() - start).toBeLessThan(3000);
    for (const n of w.nubbins) {
      expect(n.needs.hunger).toBeGreaterThan(0);
      expect(n.stage).toBe('adult');
      expect(n.ageMs).toBeGreaterThan(LIFECYCLE.childMs);
    }
  });

  it('short gaps use fine steps and keep determinism with live stepping', () => {
    const a = hatched();
    const b = hatched();
    a.settings.offlineAging.mode = 'indefinite';
    catchUp(a, 60_000, 0);
    for (let i = 0; i < 600; i++) stepWorld(b, SIM.stepMs);
    expect(a.timeMs).toBe(b.timeMs);
    expect(a.rngState).toBe(b.rngState);
  });
});
