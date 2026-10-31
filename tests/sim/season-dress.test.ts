import { describe, expect, it } from 'vitest';
import { freeIce, seasonHere } from '../../src/render/grove-season';
import { SIM } from '../../src/config/tuning';
import { applyCommand, createWorld, stepWorld } from '../../src/sim/world';

describe('seasons dress the Grove (R0118)', () => {
  it('the debug season holds across steps and Calendar lets the clock back', () => {
    const world = createWorld(7, Date.UTC(2026, 6, 1));
    const cal = world.season;
    for (const s of ['spring', 'summer', 'autumn', 'winter'] as const) {
      applyCommand(world, { kind: 'debugSeason', season: s }, []);
      stepWorld(world, SIM.stepMs, Date.UTC(2026, 6, 1));
      expect(world.season).toBe(s);
    }
    applyCommand(world, { kind: 'debugSeason', season: null }, []);
    stepWorld(world, SIM.stepMs, Date.UTC(2026, 6, 1));
    expect(world.season).toBe(cal);
    expect(world.debugSeason).toBeUndefined();
  });

  it("the forced season holds over a campaign's chapter season", () => {
    const world = createWorld(8, Date.UTC(2026, 6, 1));
    applyCommand(world, { kind: 'campaignStart' }, []);
    applyCommand(world, { kind: 'debugSeason', season: 'winter' }, []);
    for (let i = 0; i < 20; i++) stepWorld(world, SIM.stepMs, Date.UTC(2026, 6, 1));
    expect(world.season).toBe('winter');
  });

  it("free play wears the world's season at home; a campaign's own season wins", () => {
    const w = { season: 'winter' as const };
    expect(seasonHere(w, null, 'none', 0, 'grove')).toEqual({
      season: 'winter',
      strength: 1,
      free: true,
    });
    expect(freeIce(seasonHere(w, null, 'none', 0, 'grove'))).toBe(true);
    expect(seasonHere(w, null, 'none', 0, 'dungeon')).toBeNull();
    const staged = seasonHere(w, { season: 'spring' }, 'none', 0, 'grove');
    expect(staged).toMatchObject({ season: 'spring', free: false });
    expect(freeIce(staged)).toBe(false);
    // The debug panel's forced season wins over a campaign's, at home only.
    const forced = { season: 'spring' as const, debugSeason: 'winter' as const };
    expect(seasonHere(forced, { season: 'spring' }, 'hazel', 3, 'grove')).toMatchObject({
      season: 'winter',
      free: true,
    });
    expect(seasonHere(forced, null, 'none', 0, 'dungeon')).toBeNull();
  });
});
