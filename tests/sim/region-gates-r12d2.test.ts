import { describe, expect, it } from 'vitest';
import { GATE_LEVEL, GATE_STAT } from '../../src/config/region-wild';
import { SIM } from '../../src/config/tuning';
import { setPartner } from '../../src/sim/partners';
import { hatch } from '../../src/sim/lifecycle';
import { closedGates, gateIsOpen, gatesOf } from '../../src/sim/region-gates';
import { fits } from '../../src/sim/region-spots';
import { layoutOf, regionLocation } from '../../src/sim/region-walk';
import type { RegionId } from '../../src/config/regions';
import type { SimEvent, World } from '../../src/sim/types';
import { createWorld, stepWorld } from '../../src/sim/world';

function run(w: World, steps: number): SimEvent[] {
  const ev: SimEvent[] = [];
  for (let i = 0; i < steps; i++) ev.push(...stepWorld(w, SIM.stepMs));
  return ev;
}

describe('the other three stat gates are live (R0110)', () => {
  it('all five kinds stand in some drawn region, on open ground off the path and the POIs', () => {
    const kinds = new Set<string>();
    for (const r of ['wood', 'shore', 'ridge', 'ruins', 'moonlands'] as RegionId[]) {
      const l = layoutOf(r)!;
      for (const g of gatesOf(r)) {
        kinds.add(g.kind);
        expect(fits(l, g.x, g.z) || r === 'wood', `${r} fits`).toBe(true);
        // A vine wall is a micro POI of its own, standing across its own optional cross-cut;
        // every other kind, and every other POI, keeps well clear, and no gate sits on a story path.
        for (const p of l.spec.pois)
          if (!(g.kind === 'vines' && p.id === g.id))
            expect(Math.hypot(p.x - g.x, p.z - g.z), `${r} ${p.id}`).toBeGreaterThan(5);
        if (g.kind !== 'vines')
          for (const p of l.spec.path)
            expect(Math.hypot(p.x - g.x, p.z - g.z), `${r} path`).toBeGreaterThan(5);
      }
    }
    expect([...kinds].sort()).toEqual(['boulder', 'deepWater', 'longRun', 'updraft', 'vines']);
  });

  it.each([
    ['shore', 'deepWater', 'swim'],
    ['ridge', 'updraft', 'fly'],
    ['ruins', 'longRun', 'run'],
    ['moonlands', 'boulder', 'power'],
  ] as const)(
    '%s: a partner with %s %s 25 opens it once and the reward lands once',
    (r, kind, stat) => {
      expect(GATE_STAT[kind]).toBe(stat);
      const w = createWorld(41, 0);
      const n = w.nubbins[0]!;
      hatch(n, [], w.timeMs);
      setPartner(w, 0, n.id);
      w.location = regionLocation(r);
      const g = gatesOf(r)[0]!;
      expect(closedGates(w)).toHaveLength(1);
      n.pos = { x: g.x + 2, z: g.z };
      w.keeper.pos = { x: g.x + 2.4, z: g.z };
      run(w, 60);
      expect(gateIsOpen(w, r, g.id)).toBe(false);
      n.stats[stat].points = GATE_LEVEL * 100;
      const shells = w.inventory.shells;
      const ev = run(w, 60);
      expect(ev.filter((e) => e.kind === 'gateOpened')).toHaveLength(1);
      expect(w.inventory.shells).toBe(shells + g.reward.shells!);
      expect(w.inventory.essences[g.reward.essence!]).toBe(1);
      run(w, 60);
      expect(w.inventory.shells).toBe(shells + g.reward.shells!);
      expect(closedGates(w)).toHaveLength(0);
    },
  );
});
