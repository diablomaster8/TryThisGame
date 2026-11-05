import { describe, expect, it } from 'vitest';
import { REGIONS } from '../../src/config/regions';
import { rideSeen } from '../../src/sim/regions';
import type { World } from '../../src/sim/types';
import { applyCommand, createWorld } from '../../src/sim/world';

/** R12 lane D (WORLD-69): the ferry between the shore and the Moon lands. */
function toShore(w: World): void {
  const e = REGIONS.grove.exits.find((x) => x.to === 'shore')!;
  applyCommand(w, { kind: 'travel', exit: e.id }, []);
  expect(w.location).toBe('region:shore');
}

describe('the ferry (WORLD-69)', () => {
  it('is shut until the Moon lands open, then arrives on their jetty and is seen once', () => {
    const w = createWorld(3, 0);
    toShore(w);
    const ev: { kind: string }[] = [];
    applyCommand(w, { kind: 'travel', exit: 'shore-ferry' }, ev as never);
    expect(w.location).toBe('region:shore');
    expect(ev.some((e) => e.kind === 'travelRefused')).toBe(true);
    expect(rideSeen(w, 'ferry')).toBe(false);
    w.unlocks.moonGrove = true;
    applyCommand(w, { kind: 'travel', exit: 'shore-ferry' }, []);
    expect(w.location).toBe('region:moonlands');
    const ferry = REGIONS.shore.exits.find((e) => e.id === 'shore-ferry')!;
    expect(w.keeper.pos).toEqual(ferry.arrive);
    expect(rideSeen(w, 'ferry')).toBe(true);
    applyCommand(w, { kind: 'travel', exit: 'moon-ferry' }, []);
    expect(w.location).toBe('region:shore');
  });

  it("both ends are rides, and each arrival sits outside the other end's box", () => {
    for (const [from, id] of [
      ['shore', 'shore-ferry'],
      ['moonlands', 'moon-ferry'],
    ] as const) {
      const e = REGIONS[from].exits.find((x) => x.id === id)!;
      expect(e.kind).toBe('vehicle');
      expect(e.ride).toBe('ferry');
      const back = REGIONS[e.to].exits.find((x) => x.kind === 'vehicle' && x.to === from)!;
      const a = e.arrive;
      const r = back.rect;
      expect(a.x >= r.x && a.x <= r.x + r.w && a.z >= r.z && a.z <= r.z + r.h).toBe(false);
    }
  });
});
