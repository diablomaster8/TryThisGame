import { describe, expect, it } from 'vitest';
import { openTraces, stepTraces } from '../../src/sim/regions-trace';
import type { SimEvent } from '../../src/sim/types';
import { createWorld } from '../../src/sim/world';

describe('looking at the Grove traces (R0090)', () => {
  it('walking up to one finds it once, even with no campaign, and it never returns', () => {
    const w = createWorld(3, 0);
    w.campaign = null;
    const before = openTraces(w).length;
    expect(before).toBeGreaterThanOrEqual(3);
    const ev: SimEvent[] = [];
    stepTraces(w, ev);
    expect(ev).toEqual([]);
    w.keeper.pos.x = 28;
    w.keeper.pos.z = 37;
    stepTraces(w, ev);
    expect(ev).toEqual([{ kind: 'traceFound', id: 'grove-trowel' }]);
    expect(openTraces(w).length).toBe(before - 1);
    w.timeMs += 30 * 24 * 3600 * 1000;
    stepTraces(w, ev);
    expect(ev.length).toBe(1);
  });
});
