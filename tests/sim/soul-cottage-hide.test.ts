import { describe, expect, it } from 'vitest';
import { EDU_SOUL } from '../../src/config/tuning-fun-r7';
import { TRUST } from '../../src/config/tuning';
import { cottageWindow } from '../../src/sim/cottage-hide';
import { createEdu } from '../../src/sim/edu';
import { hatch } from '../../src/sim/lifecycle';
import { applyCommand, createWorld, stepWorld } from '../../src/sim/world';
import type { Nubbin, SimEvent, World } from '../../src/sim/types';

// R0527 (SOUL-09), the r10 half: in the Learning Grove, a Nubbin left at the trust floor
// hides in the cottage (never runs away), and a tap on the door coaxes it out with a hug.

function edu(seed: number): { w: World; n: Nubbin } {
  const w = createWorld(seed, 0);
  w.edu = createEdu(5);
  const n = w.nubbins[0]!;
  w.nubbins = [n];
  hatch(n, [], 0);
  n.trust = EDU_SOUL.trustFloor;
  return { w, n };
}

function sulk(w: World, n: Nubbin, ms: number, offline = false): SimEvent[] {
  const events: SimEvent[] = [];
  for (let t = 0; t < ms / 100; t++) {
    n.needs.hunger = 1;
    n.needs.energy = 1;
    n.trust = EDU_SOUL.trustFloor;
    events.push(...stepWorld(w, 100, undefined, offline));
  }
  return events;
}

describe('R0527 cottage hiding in the Learning Grove', () => {
  it('at the floor for the running-away time, it hides at the cottage window', () => {
    const { w, n } = edu(3);
    const events = sulk(w, n, TRUST.runawayAfterMs + 90_000);
    expect(events.some((e) => e.kind === 'cottageHid')).toBe(true);
    expect(events.some((e) => e.kind === 'ranAway')).toBe(false);
    expect(n.cottageHide).toBe(true);
    expect(w.nubbins).toContain(n);
    const win = cottageWindow(w);
    expect(Math.hypot(n.pos.x - win.x, n.pos.z - win.z)).toBeLessThan(1.5);
  }, 60_000);

  it('a tap on the door coaxes it out with a hug and some trust', () => {
    const { w, n } = edu(4);
    sulk(w, n, TRUST.runawayAfterMs + 30_000);
    expect(n.cottageHide).toBe(true);
    const events: SimEvent[] = [];
    const before = n.trust;
    applyCommand(w, { kind: 'coaxOut' }, events);
    expect(n.cottageHide).toBeUndefined();
    expect(n.trust).toBeGreaterThan(before);
    expect(events.some((e) => e.kind === 'coaxedOut' && e.coaxed)).toBe(true);
    expect(n.behavior.reaction).toBe('love');
  }, 60_000);

  it('never while catching up, and never outside the Learning Grove', () => {
    const { w, n } = edu(5);
    sulk(w, n, TRUST.runawayAfterMs + 30_000, true);
    expect(n.cottageHide).toBeUndefined();
    const plain = createWorld(5, 0);
    const m = plain.nubbins[0]!;
    plain.nubbins = [m];
    hatch(m, [], 0);
    m.trust = EDU_SOUL.trustFloor;
    sulk(plain, m, TRUST.runawayAfterMs + 30_000);
    expect(m.cottageHide).toBeUndefined();
  }, 60_000);
});
