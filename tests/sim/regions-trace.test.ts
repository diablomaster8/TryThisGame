import { describe, expect, it } from 'vitest';
import { WORLD_TRACES, WORLD_TRACES_FLAGS } from '../../src/content/world-traces';
import { REGIONS } from '../../src/config/regions';
import { examineTrace } from '../../src/sim/regions-trace';
import type { World } from '../../src/sim/types';
import { createWorld } from '../../src/sim/world';

describe('world traces (WORLD-26)', () => {
  it('sets its flag once, in the campaign only', () => {
    const w = createWorld(1, 0);
    w.campaign = null;
    expect(examineTrace(w, 'grove-trowel')).toBe(false);
    const campaign = { chapter: 1, step: 0, flags: {}, friendship: {} } as unknown as NonNullable<
      World['campaign']
    >;
    w.campaign = campaign;
    expect(examineTrace(w, 'grove-trowel')).toBe(true);
    expect(examineTrace(w, 'grove-trowel')).toBe(false);
    expect(campaign.flags['trace:grove-trowel']).toBe(true);
  });

  it('has three or more traces in each region it covers, placed inside laid-out ones', () => {
    const per = new Map<string, number>();
    for (const t of WORLD_TRACES) per.set(t.region, (per.get(t.region) ?? 0) + 1);
    for (const r of ['grove', 'wood', 'ruins', 'shore'])
      expect(per.get(r)).toBeGreaterThanOrEqual(3);
    for (const t of WORLD_TRACES.filter((q) => q.at)) {
      const s = REGIONS[t.region].size;
      expect(Math.abs(t.at!.x)).toBeLessThanOrEqual(s.w / 2);
      expect(Math.abs(t.at!.z)).toBeLessThanOrEqual(s.h / 2);
    }
    expect(WORLD_TRACES_FLAGS).toHaveLength(WORLD_TRACES.length);
  });
});
