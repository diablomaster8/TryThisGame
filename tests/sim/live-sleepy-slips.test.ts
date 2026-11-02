import { describe, expect, it } from 'vitest';
import { EGG, SIM, SLIPS } from '../../src/config/tuning';
import type { SimEvent, World } from '../../src/sim/types';
import { applyCommand, createWorld, stepWorld } from '../../src/sim/world';

/**
 * Live sleepy slips (Maor, 2026-11-02): a free Nubbin lies down at the slip threshold, so a
 * long session no longer trims its life every energy cycle. Only being kept awake counts.
 */

const MIN = 60_000;
const HOUR = 60 * MIN;

function runMs(world: World, ms: number, events: SimEvent[] = []): SimEvent[] {
  for (let t = 0; t < ms; t += SIM.stepMs) events.push(...stepWorld(world, SIM.stepMs));
  return events;
}

const sleepy = (w: World): number =>
  w.nubbins.reduce((sum, n) => sum + n.slips.filter((s) => s.kind === 'sleepy').length, 0);

describe('live sleepy slips', () => {
  it('a 6 h live session at default care logs none', { timeout: 60_000 }, () => {
    const w = createWorld(11, 0);
    const events = runMs(w, 6 * HOUR);
    expect(w.nubbins.some((n) => n.stage === 'adult')).toBe(true);
    expect(events.some((e) => e.kind === 'napStarted')).toBe(true);
    expect(sleepy(w)).toBe(0);
  });

  it('still logs one when the Nubbin is kept awake', () => {
    const w = createWorld(12, 0);
    w.nubbins = [w.nubbins[0]!];
    runMs(w, EGG.hatchMs + 1000);
    const n = w.nubbins[0]!;
    n.needs.energy = SLIPS.sleepyEnergy / 2;
    n.needs.hunger = 1;
    applyCommand(w, { kind: 'grab', nubbinId: n.id }, []);
    expect(n.behavior.state).toBe('held');
    const events = runMs(w, SLIPS.afterMs + 1000);
    expect(events.some((e) => e.kind === 'slip' && e.slip === 'sleepy')).toBe(true);
    expect(sleepy(w)).toBe(1);
  });
});
