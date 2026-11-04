import { describe, expect, it } from 'vitest';
import { SEASON_KEEPSAKE, SEASON_PROPS } from '../../src/config/tuning-r12d2';
import { regionMarks } from '../../src/sim/region-marks';
import { seasonSpots, stepSeasonProps } from '../../src/sim/region-season-props';
import { fits } from '../../src/sim/region-spots';
import { layoutOf, regionLocation } from '../../src/sim/region-walk';
import type { RegionId } from '../../src/config/regions';
import type { Season, SimEvent } from '../../src/sim/types';
import { createWorld } from '../../src/sim/world';

const SEASONS: Season[] = ['spring', 'summer', 'autumn', 'winter'];

describe('seasons in the drawn regions (R0118)', () => {
  it('each region sets out its season props on open ground, and the marks follow the season', () => {
    for (const [r, rules] of Object.entries(SEASON_PROPS)) {
      const l = layoutOf(r as RegionId)!;
      for (const s of SEASONS) {
        const rule = rules[s];
        if (!rule) continue;
        const spots = seasonSpots(r as RegionId, s);
        expect(spots.length, `${r} ${s}`).toBe(rule.n);
        for (const p of spots) expect(fits(l, p.x, p.z)).toBe(true);
      }
    }
    const w = createWorld(3, 0);
    w.location = regionLocation('wood');
    w.debugSeason = 'winter';
    expect(
      regionMarks(w)
        .filter((m) => m.kind === 'season')
        .every((m) => m.decor === 'snowman'),
    ).toBe(true);
    w.debugSeason = 'autumn';
    const a = regionMarks(w).filter((m) => m.kind === 'season');
    expect(a.length).toBe(4);
    expect(a.every((m) => m.decor === 'leafpile')).toBe(true);
  });

  it('the first prop of a season is a keepsake, once per region per season', () => {
    const w = createWorld(3, 0);
    w.location = regionLocation('wood');
    w.debugSeason = 'autumn';
    const p = seasonSpots('wood', 'autumn')[0]!;
    w.keeper.pos.x = p.x;
    w.keeper.pos.z = p.z;
    const ev: SimEvent[] = [];
    const shells = w.inventory.shells;
    stepSeasonProps(w, ev);
    stepSeasonProps(w, ev);
    expect(ev).toHaveLength(1);
    expect(w.inventory.shells).toBe(shells + SEASON_KEEPSAKE.shells);
    w.debugSeason = 'winter';
    const q = seasonSpots('wood', 'winter')[0]!;
    w.keeper.pos.x = q.x;
    w.keeper.pos.z = q.z;
    stepSeasonProps(w, ev);
    expect(ev).toHaveLength(2);
  });
});
