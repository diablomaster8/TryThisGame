import { describe, expect, it } from 'vitest';
import { createEdu } from '../../src/sim/edu';
import { hatch } from '../../src/sim/lifecycle';
import { applyCommand, createWorld, stepWorld } from '../../src/sim/world';
import { THROW, TRUST } from '../../src/config/tuning';
import type { SimEvent, World } from '../../src/sim/types';

// R0527 (SOUL-09): in the Learning Grove a throw is a toss and catch; nobody turns Shadow
// or runs away. Outside it, nothing changes.
function throwFifty(w: World): SimEvent[] {
  const n = w.nubbins[0]!;
  const events: SimEvent[] = [];
  for (let i = 0; i < 50; i++) {
    n.behavior.state = 'held';
    w.keeper.carrying = null;
    applyCommand(w, { kind: 'grab', nubbinId: n.id }, events);
    applyCommand(w, { kind: 'release', vel: { x: THROW.minSpeed * 2, z: 0 } }, events);
    for (let t = 0; t < 40; t++) events.push(...stepWorld(w, 100));
  }
  // Then a long sulk, well past the running-away time.
  n.needs.hunger = 0.05;
  for (let t = 0; t < TRUST.runawayAfterMs / 100 + 600; t++) events.push(...stepWorld(w, 100));
  return events;
}

describe('R0527 kinder throws in the Learning Grove', () => {
  it('fifty throws: never Shadow, never runs away', () => {
    const w = createWorld(12, 0);
    w.edu = createEdu(5);
    const n = w.nubbins[0]!;
    hatch(n, [], 0);
    const events = throwFifty(w);
    expect(events.some((e) => e.kind === 'turnedShadow')).toBe(false);
    expect(w.nubbins.some((x) => x.id === n.id)).toBe(true);
    expect(n.shadow).toBe(false);
    expect(n.trust).toBeGreaterThanOrEqual(TRUST.shadowBelow);
  });

  it('outside the Learning Grove a throw still costs trust', () => {
    const w = createWorld(12, 0);
    const n = w.nubbins[0]!;
    hatch(n, [], 0);
    const before = n.trust;
    n.behavior.state = 'held';
    const events: SimEvent[] = [];
    applyCommand(w, { kind: 'grab', nubbinId: n.id }, events);
    applyCommand(w, { kind: 'release', vel: { x: THROW.minSpeed * 2, z: 0 } }, events);
    expect(n.trust).toBeLessThan(before);
  });
});
