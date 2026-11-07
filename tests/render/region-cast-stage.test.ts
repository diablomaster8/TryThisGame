import { describe, expect, it } from 'vitest';
import { MOON_GARDEN_PROPS, SUN_GARDEN_PROPS } from '../../src/config/region-sunmoon-gardens';
import { LANE_TRAINERS } from '../../src/config/region-lane';
import { markAt } from '../../src/config/stage-marks';
import { regionCastSpots, regionSeats } from '../../src/render/region-stage';
import { npcHere } from '../../src/render/scene-stage';
import { layoutOf, standsIn } from '../../src/sim/region-walk';
import { neighbourGarden, VISIT_GARDEN } from '../../src/sim/neighbourhood';
import { createWorld } from '../../src/sim/world';

/** R0101 (WORLD-43) and R0096/R0112 round 14: region cast staging, garden props, visit gardens. */
describe('region cast staging', () => {
  it('seats a scene cast on walkable ground round the Keeper, facing them', () => {
    for (const r of ['shore', 'wood', 'ridge', 'ruins'] as const) {
      const w = createWorld(7, 0);
      w.location = `region:${r}` as typeof w.location;
      const l = layoutOf(r)!;
      const ids = regionSeats(['you', 'narrator', 'fern', 'corvin', 'fern', 'moss']);
      expect(ids).toEqual(['fern', 'corvin']);
      const spots = regionCastSpots(w, ids);
      expect(spots.size).toBe(2);
      const [a, b] = [...spots.values()];
      expect(Math.hypot(a!.x - b!.x, a!.z - b!.z)).toBeGreaterThan(1);
      for (const s of spots.values()) {
        expect(Math.hypot(s.x - w.keeper.pos.x, s.z - w.keeper.pos.z)).toBeLessThan(4.5);
        expect(
          standsIn(l, s.x, s.z, 0.45) || !standsIn(l, w.keeper.pos.x, w.keeper.pos.z, 0.45),
        ).toBe(true);
      }
    }
  });
  it('shows a visiting Keeper in a region only while a scene names them', () => {
    expect(npcHere('region:shore', 'fern')).toBe(false);
    expect(npcHere('region:shore', 'fern', new Set(['fern']))).toBe(true);
    expect(npcHere('region:shore', 'corvin', new Set(['fern']))).toBe(false);
    expect(npcHere('grove', 'fern')).toBe(true);
    // The Grove's named marks mean nothing in a region.
    expect(markAt('region:shore', 'green')).toBeUndefined();
  });
});

describe('Nubbin garden props and visit gardens', () => {
  it('each land has two eight-piece gardens', () => {
    expect(SUN_GARDEN_PROPS).toHaveLength(16);
    expect(MOON_GARDEN_PROPS).toHaveLength(16);
    for (const p of [...SUN_GARDEN_PROPS, ...MOON_GARDEN_PROPS])
      expect(Math.abs(p.x)).toBeLessThan(40);
  });
  it('a neighbour garden spans past 8 u and stays inside +-16', () => {
    let wide = 0;
    for (const t of LANE_TRAINERS) {
      for (const n of neighbourGarden(t)) {
        expect(Math.abs(n.x)).toBeLessThanOrEqual(VISIT_GARDEN.halfW);
        if (Math.abs(n.x) > 8) wide++;
      }
    }
    expect(VISIT_GARDEN.halfW).toBeLessThanOrEqual(16);
    expect(wide).toBeGreaterThan(0);
  });
});
