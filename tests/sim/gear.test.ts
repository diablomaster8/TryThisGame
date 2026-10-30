import { describe, expect, it } from 'vitest';
import { RARITIES } from '../../src/config/dungeon-loot';
import { DUNGEON, SIM } from '../../src/config/tuning';
import { cellCentre, runFloor } from '../../src/sim/dungeon';
import {
  effectiveMf,
  ensureGear,
  gearStat,
  keepGear,
  rollDrops,
  rollGear,
  rollRarity,
} from '../../src/sim/gear';
import { hatch } from '../../src/sim/lifecycle';
import { Rng } from '../../src/sim/rng';
import { deserialize, SAVE_VERSION, serialize } from '../../src/sim/save';
import type { GearItem, SimEvent, World } from '../../src/sim/types';
import { applyCommand, createWorld, stepWorld } from '../../src/sim/world';

// R0163 (rarity tiers and drop tables) and R0164 (Keeper and Nubbin gear slots).

function world(): World {
  const w = createWorld(4, 0);
  const events: SimEvent[] = [];
  for (const n of w.nubbins) hatch(n, events, 0);
  return w;
}

function piece(w: World, base: string, slot: string, affixes: GearItem['affixes'] = []): GearItem {
  const g = ensureGear(w);
  const item: GearItem = { id: `g${g.next++}`, base, slot, rarity: 'shiny', level: 1, affixes };
  keepGear(w, item);
  return item;
}

describe('loot rarity (R0163)', () => {
  it('hits the table rates within 10% over 100k rolls at act I, level 5', () => {
    const rng = new Rng(77);
    const counts: Record<string, number> = {};
    const n = 100_000;
    for (let i = 0; i < n; i++) {
      const r = rollRarity(rng, 0);
      counts[r] = (counts[r] ?? 0) + 1;
    }
    for (const r of RARITIES.filter((x) => x.rate > 0)) {
      const got = (counts[r.id] ?? 0) / n;
      expect(Math.abs(got - r.rate) / r.rate).toBeLessThan(0.1);
    }
  });

  it('magic find raises the rare tiers with diminishing returns', () => {
    expect(effectiveMf(250, true)).toBe(125);
    expect(effectiveMf(1000, true)).toBeLessThan(250);
    expect(effectiveMf(100, false)).toBe(100);
    const rare = (mf: number) => {
      const rng = new Rng(5);
      let k = 0;
      for (let i = 0; i < 50_000; i++) if (rollRarity(rng, mf) === 'legendary') k++;
      return k;
    };
    expect(rare(300)).toBeGreaterThan(rare(0) * 1.5);
  });

  it('every tier has its own shape', () => {
    expect(new Set(RARITIES.map((r) => r.glyph)).size).toBe(RARITIES.length);
  });

  it('a pack table drops gear into the satchel with item ids that never repeat', () => {
    const w = world();
    const events: SimEvent[] = [];
    for (let i = 0; i < 200; i++) rollDrops(w, new Rng(i + 1), 'pack-champion', 6, events);
    const items = w.gear!.items;
    expect(items.length).toBeGreaterThan(0);
    expect(new Set(items.map((x) => x.id)).size).toBe(items.length);
    expect(events.some((e) => e.kind === 'gearFound')).toBe(true);
    const fancy = rollGear(w, new Rng(9), 10, 0, 'fancy');
    expect(fancy.affixes.length).toBeGreaterThanOrEqual(3);
  });
});

describe('gear slots (R0164)', () => {
  it('each worn Keeper piece changes its stated stat; a Nubbin piece only fits a Nubbin', () => {
    const w = world();
    const events: SimEvent[] = [];
    const satchel = piece(w, 'satchel', 'satchel');
    const lantern = piece(w, 'lantern', 'lantern', [{ id: 'owl', value: 2 }]);
    const gloves = piece(w, 'gloves', 'gloves', [{ id: 'sunny', value: 2 }]);
    const charm = piece(w, 'charm', 'charm', [{ id: 'lucky', value: 10 }]);
    expect(gearStat(w, 'pickup')).toBe(0);
    for (const it of [satchel, lantern, gloves])
      applyCommand(w, { kind: 'equipGear', itemId: it.id, nubbinId: null }, events);
    expect(gearStat(w, 'pickup')).toBeCloseTo(0.2);
    expect(gearStat(w, 'explore')).toBeCloseTo(3);
    expect(gearStat(w, 'shells')).toBeCloseTo(3);
    // A charm is a Nubbin slot.
    applyCommand(w, { kind: 'equipGear', itemId: charm.id, nubbinId: null }, events);
    expect(gearStat(w, 'mf')).toBe(0);
    const nub = w.nubbins[0]!.id;
    applyCommand(w, { kind: 'equipGear', itemId: charm.id, nubbinId: nub }, events);
    expect(gearStat(w, 'mf', nub)).toBeCloseTo(15);
    applyCommand(w, { kind: 'unequipGear', itemId: satchel.id }, events);
    expect(gearStat(w, 'pickup')).toBe(0);
  });

  it('gloves add Shells to every handful picked up in the Hollow', () => {
    const take = (gloves: boolean) => {
      const w = world();
      const events: SimEvent[] = [];
      if (gloves) {
        const it = piece(w, 'gloves', 'gloves');
        applyCommand(w, { kind: 'equipGear', itemId: it.id, nubbinId: null }, events);
      }
      applyCommand(w, { kind: 'enterDungeon', daily: false }, events);
      const f = runFloor(w)!;
      const loot = f.loot.find((l) => l.kind === 'shells')!;
      w.dungeon!.strays = [];
      w.dungeon!.packs = [];
      w.keeper.pos = cellCentre(f, loot.cell);
      const out = stepWorld(w, SIM.stepMs);
      const e = out.find((x) => x.kind === 'dungeonFound');
      return e?.kind === 'dungeonFound' ? e.amount : -1;
    };
    expect(take(true)).toBe(take(false) + 1);
    expect(DUNGEON.pickupRadius).toBeGreaterThan(0);
  });
});

describe('save version 11', () => {
  it('migrates a version-10 save to an empty satchel and keeps worn gear through a reload', () => {
    expect(SAVE_VERSION).toBe(11);
    const w = world();
    const old = JSON.parse(serialize(w, 0)) as { version: number; world: Record<string, unknown> };
    old.version = 10;
    delete old.world.gear;
    const back = deserialize(JSON.stringify(old)).world;
    expect(back.gear).toEqual({ items: [], keeper: {}, nubbins: {}, next: 1 });
    const it = piece(back, 'boots', 'boots', [{ id: 'bouncy', value: 0.04 }]);
    applyCommand(back, { kind: 'equipGear', itemId: it.id, nubbinId: null }, []);
    const again = deserialize(serialize(back, 0)).world;
    expect(again.gear!.keeper.boots).toBe(it.id);
    expect(gearStat(again, 'speed')).toBeCloseTo(0.09);
  });
});
