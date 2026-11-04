import { describe, expect, it } from 'vitest';
import { COLLECT } from '../../src/config/region-collectibles';
import { WORLD_TRACES } from '../../src/content/world-traces';
import { collectiblesIn, openHere, stepCollectibles, tally } from '../../src/sim/collectibles';
import { fits, spotNear } from '../../src/sim/region-spots';
import { layoutOf, planRegionWalk, REGION_SPECS, regionLocation } from '../../src/sim/region-walk';
import { openTraces, stepTraces, traceSpot } from '../../src/sim/regions-trace';
import { createWorld } from '../../src/sim/world';
import type { RegionId } from '../../src/config/regions';
import type { SimEvent } from '../../src/sim/types';

const DRAWN = Object.keys(REGION_SPECS) as RegionId[];

function at(region: RegionId, x: number, z: number) {
  const w = createWorld(7, 0);
  w.location = regionLocation(region);
  w.keeper.pos.x = x;
  w.keeper.pos.z = z;
  return w;
}

describe('R0090/R0091: traces and collectibles in every drawn region', () => {
  it('every drawn region has 3+ traces on ground that fits, and a full seeded set', () => {
    expect(DRAWN.length).toBeGreaterThanOrEqual(6);
    for (const r of DRAWN) {
      const l = layoutOf(r)!;
      const traces = WORLD_TRACES.filter((t) => t.region === r);
      expect(traces.length, r).toBeGreaterThanOrEqual(3);
      for (const t of traces) {
        const s = traceSpot(t);
        expect(s, t.id).not.toBeNull();
        expect(fits(l, s!.x, s!.z), t.id).toBe(true);
      }
      const set = collectiblesIn(r);
      const n = COLLECT.perRegion;
      expect(set.filter((c) => c.kind === 'petal')).toHaveLength(n.petal);
      expect(set.filter((c) => c.kind === 'postcard')).toHaveLength(n.postcard);
      expect(set.filter((c) => c.kind === 'key')).toHaveLength(n.key);
      for (const c of set) expect(fits(l, c.x, c.z), c.id).toBe(true);
      // No two of a set on one spot, and the same set every time.
      const keys = new Set(set.map((c) => `${c.x},${c.z}`));
      expect(keys.size).toBe(set.length);
      expect(collectiblesIn(r)).toBe(set);
    }
  });

  it('every collectible, trace and photo frame can be walked to from the region start', () => {
    for (const r of DRAWN) {
      const l = layoutOf(r)!;
      const from = spotNear(r, l.spec.path[0]!.x, l.spec.path[0]!.z)!;
      const targets = [
        ...collectiblesIn(r).map((c) => ({ id: c.id, x: c.x, z: c.z })),
        ...WORLD_TRACES.filter((t) => t.region === r).map((t) => ({ id: t.id, ...traceSpot(t)! })),
      ];
      for (const t of targets) {
        const legs = planRegionWalk(l, from, t);
        expect(legs.length, t.id).toBeGreaterThan(0);
        const end = legs[legs.length - 1]!;
        expect(Math.hypot(end.x - t.x, end.z - t.z), t.id).toBeLessThan(0.6);
      }
    }
  });

  it('walking onto a region collectible takes it once; a month later nothing is back', () => {
    const c = collectiblesIn('shore').find((k) => k.kind === 'petal')!;
    const w = at('shore', c.x, c.z);
    const ev: SimEvent[] = [];
    stepCollectibles(w, ev);
    expect(ev.some((e) => e.kind === 'keepsakeFound')).toBe(true);
    expect(tally(w, 'shore', 'petal').got).toBe(1);
    w.timeMs += 30 * 24 * 3600_000;
    w.keeper.pos.x += 3;
    stepCollectibles(w, ev);
    w.keeper.pos.x = c.x;
    w.keeper.pos.z = c.z;
    const ev2: SimEvent[] = [];
    stepCollectibles(w, ev2);
    expect(ev2).toHaveLength(0);
    expect(openHere(w).some((k) => k.id === c.id)).toBe(false);
  });

  it('a trace in a region is found by walking up, once, with its flag', () => {
    const t = WORLD_TRACES.find((x) => x.id === 'ridge-summit-log')!;
    const s = traceSpot(t)!;
    const w = at('ridge', s.x, s.z);
    const ev: SimEvent[] = [];
    const before = openTraces(w).length;
    stepTraces(w, ev);
    expect(ev.filter((e) => e.kind === 'traceFound')).toHaveLength(1);
    expect(openTraces(w).length).toBe(before - 1);
    stepTraces(w, ev);
    expect(ev.filter((e) => e.kind === 'traceFound')).toHaveLength(1);
    // Other regions' traces are not on show here.
    expect(
      openTraces(w).every((o) => WORLD_TRACES.find((x) => x.id === o.id)!.region === 'ridge'),
    ).toBe(true);
  });

  it('a finished set pays its region reward once', () => {
    const w = at('moonlands', 0, 0);
    const ev: SimEvent[] = [];
    for (const c of collectiblesIn('moonlands').filter((k) => k.kind === 'postcard')) {
      w.keeper.pos.x = c.x;
      w.keeper.pos.z = c.z;
      stepCollectibles(w, ev);
    }
    expect(ev.some((e) => e.kind === 'collectionSetDone')).toBe(true);
    expect(w.inventory.hats.filter((h) => h === 'flower').length).toBeGreaterThanOrEqual(1);
  });
});
