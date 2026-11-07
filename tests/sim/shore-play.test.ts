import { describe, expect, it } from 'vitest';
import { GATE_LEVEL } from '../../src/config/region-wild';
import { SHORE_CASTLES, SHORE_FOLK } from '../../src/config/region-shore';
import { REGIONS } from '../../src/config/regions';
import { SIM } from '../../src/config/tuning';
import { SHORE_PLAY } from '../../src/config/tuning-more/world-region-content';
import { hatch } from '../../src/sim/lifecycle';
import { setPartner } from '../../src/sim/partners';
import { keeperArea, offeredAt } from '../../src/sim/quest-offers';
import { castleStands } from '../../src/sim/shore-play';
import { layoutOf, standsIn } from '../../src/sim/region-walk';
import type { SimEvent, World } from '../../src/sim/types';
import { applyCommand, createWorld, stepWorld } from '../../src/sim/world';

/** R13 lane D (WORLD-35): the shore's castles, folk and signpost. */
function run(w: World, steps: number, ev: SimEvent[] = []): SimEvent[] {
  for (let i = 0; i < steps; i++) ev.push(...stepWorld(w, SIM.stepMs));
  return ev;
}

function shore(): World {
  const w = createWorld(41, 0);
  const e = REGIONS.grove.exits.find((x) => x.to === 'shore')!;
  applyCommand(w, { kind: 'travel', exit: e.id }, []);
  expect(w.location).toBe('region:shore');
  return w;
}

describe('the shore play (WORLD-35)', () => {
  it('a Power partner flattens a castle, shells come out, and it is rebuilt later', () => {
    const w = shore();
    const n = w.nubbins[0]!;
    hatch(n, [], w.timeMs);
    n.stats.power.points = GATE_LEVEL * 100;
    setPartner(w, 0, n.id);
    const c = SHORE_CASTLES[0]!;
    w.keeper.pos = { x: c.x, z: c.z + 5 };
    n.pos = { x: c.x + 1, z: c.z + 1 };
    const before = w.inventory.shells;
    const ev: SimEvent[] = [];
    for (let i = 0; i < Math.ceil(SHORE_PLAY.knockMs / SIM.stepMs) + 5; i++) {
      n.pos = { x: c.x + 1, z: c.z + 1 };
      run(w, 1, ev);
    }
    expect(castleStands(w, 0)).toBe(false);
    expect(castleStands(w, 1)).toBe(true);
    expect(ev.filter((e) => e.kind === 'castleDown')).toHaveLength(1);
    expect(w.inventory.shells).toBe(before + SHORE_PLAY.shells);
    w.timeMs += SHORE_PLAY.rebuildMs;
    expect(castleStands(w, 0)).toBe(true);
  });

  it('a weak partner does nothing', () => {
    const w = shore();
    const n = w.nubbins[0]!;
    hatch(n, [], w.timeMs);
    setPartner(w, 0, n.id);
    const c = SHORE_CASTLES[0]!;
    n.pos = { x: c.x + 1, z: c.z + 1 };
    run(w, 60);
    expect(castleStands(w, 0)).toBe(true);
  });

  it('the folk greet a Keeper who walks up, once a minute', () => {
    const w = shore();
    const f = SHORE_FOLK[0]!;
    w.keeper.pos = { x: f.x, z: f.z + 1 };
    w.keeper.moveTarget = null;
    const ev = run(w, 20);
    expect(ev.filter((e) => e.kind === 'folkGreet')).toHaveLength(1);
  });

  it('shore quests are given at the signpost, not anywhere on the sand', () => {
    const w = shore();
    const sign = REGIONS.shore.pois.find((p) => p.id === 'shore-sign')!;
    w.keeper.pos = { x: sign.x, z: sign.z };
    expect(keeperArea(w)).toBe('shore/shore-sign');
    expect(
      offeredAt(
        { trigger: { where: 'x', area: { region: 'shore' } } } as never,
        'shore/shore-sign',
      ),
    ).toBe(true);
    w.keeper.pos = { x: 20, z: -12 };
    expect(keeperArea(w)).toBeNull();
  });
});

describe('the island ferry (WORLD-69)', () => {
  it('the west jetty rows out to the island and back, free', () => {
    const w = shore();
    const before = w.inventory.shells;
    applyCommand(w, { kind: 'travel', exit: 'shore-island' }, []);
    expect(Math.abs(w.keeper.pos.x + 10)).toBeLessThan(1);
    expect(w.keeper.pos.z).toBeGreaterThan(19);
    applyCommand(w, { kind: 'travel', exit: 'island-back' }, []);
    expect(w.keeper.pos.z).toBeLessThan(12);
    expect(w.inventory.shells).toBe(before);
  });
});

describe('the cart (WORLD-69)', () => {
  it('runs between the lane end and the ridge foot, both landings on walkable ground', () => {
    const w = createWorld(41, 0);
    applyCommand(w, { kind: 'travel', exit: 'grove-gate' }, []);
    applyCommand(w, { kind: 'travel', exit: 'lane-cart' }, []);
    expect(w.location).toBe('region:ridge');
    expect(w.keeper.pos).toEqual({ x: -18, z: 68 });
    const l = layoutOf('ridge')!;
    expect(standsIn(l, -18, 68, 0.4)).toBe(true);
    applyCommand(w, { kind: 'travel', exit: 'ridge-cart' }, []);
    expect(w.location).toBe('region:lane');
    expect(standsIn(layoutOf('lane')!, 6, 50, 0.4)).toBe(true);
  });
});
