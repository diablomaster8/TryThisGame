import { describe, expect, it } from 'vitest';
import {
  GEAR_EFFECTS,
  KEY_DROPS,
  SET_PIECES,
  SETS,
  STASH,
} from '../../src/config/dungeon-items-r8';
import { NEEDS } from '../../src/config/tuning';
import { charmKey, chainFor, itemExtraStat } from '../../src/sim/dungeon-charms';
import {
  bravePower,
  gearSpeedMul,
  shakeFruitBonus,
  stepGearNeeds,
} from '../../src/sim/dungeon-gear-effects';
import { noteKeyWin } from '../../src/sim/dungeon-keys';
import { collectibleIds, setBonus } from '../../src/sim/dungeon-sets';
import { canReachStash, filterStash, stashMove, tabCounts } from '../../src/sim/dungeon-stash';
import { mixWheelbarrow } from '../../src/sim/dungeon-wheelbarrow';
import {
  ensureGear,
  equipGear,
  gearStat,
  keepGear,
  rollGear,
  stashTabCount,
} from '../../src/sim/gear';
import { hatch } from '../../src/sim/lifecycle';
import { keeperSpeedMultiplier } from '../../src/sim/perks';
import { Rng } from '../../src/sim/rng';
import { deserialize, serialize } from '../../src/sim/save';
import type { BarrowSlot, GearItem, SimEvent, World } from '../../src/sim/types';
import { applyCommand, createWorld } from '../../src/sim/world';

// Lane B round 8, items: R0164 gear effects, R0174 stash tabs, R0173 charms, R0177 the
// wheelbarrow, R0183 the key set, R0172 sets and uniques.

function world(): World {
  const w = createWorld(4, 0);
  const events: SimEvent[] = [];
  for (const n of w.nubbins) hatch(n, events, 0);
  return w;
}

function piece(w: World, slot: string, extra: Partial<GearItem> = {}): GearItem {
  const g = ensureGear(w);
  const item: GearItem = {
    id: `g${g.next++}`,
    base: slot,
    slot,
    rarity: 'plain',
    level: 1,
    affixes: [],
    ...extra,
  };
  keepGear(w, item);
  return item;
}

const charm = (key: string): BarrowSlot => ({ kind: 'charm', key });
const item = (id: string): BarrowSlot => ({ kind: 'item', id });

describe('gear effects the sim reads (R0164)', () => {
  it('boots speed up the Keeper and Bouncy adds to it', () => {
    const w = world();
    const base = keeperSpeedMultiplier(w, false, 1.6);
    const b = piece(w, 'boots', { affixes: [{ id: 'bouncy', value: 0.04 }] });
    equipGear(w, b.id, null);
    expect(gearSpeedMul(w)).toBeCloseTo(1.09);
    expect(keeperSpeedMultiplier(w, false, 1.6)).toBeCloseTo(base * 1.09);
  });

  it('Snug lifts a Nubbin’s happiness, Naps saves energy', () => {
    const w = world();
    const n = w.nubbins[0]!;
    const b = piece(w, 'bracelet', {
      affixes: [
        { id: 'snug', value: 2 },
        { id: 'naps', value: 5 },
      ],
    });
    equipGear(w, b.id, n.id);
    n.needs.happiness = 0;
    n.needs.energy = 0.5;
    n.behavior.state = 'wander';
    const w2 = world();
    const m = w2.nubbins[0]!;
    m.needs.happiness = 0;
    m.needs.energy = 0.5;
    m.behavior.state = 'wander';
    stepGearNeeds(w, n, 60_000);
    expect(n.needs.happiness).toBeCloseTo(2 * GEAR_EFFECTS.snugPerMinute);
    const saved = 5 * GEAR_EFFECTS.napsPerPoint;
    expect(n.needs.energy).toBeCloseTo(0.5 + (60_000 / NEEDS.energyFullToEmptyMs) * saved);
    stepGearNeeds(w2, m, 60_000);
    expect(m.needs.happiness).toBe(0);
  });

  it('Brave adds fight weight and Crumbs an extra fruit on a shake', () => {
    const w = world();
    const n = w.nubbins[0]!;
    expect(bravePower(w, [n.id])).toBe(0);
    const b = piece(w, 'bracelet', { affixes: [{ id: 'brave', value: 2 }] });
    equipGear(w, b.id, n.id);
    expect(bravePower(w, [n.id])).toBeCloseTo(2 + 1); // the bracelet's base is bravery 1 too
    const gl = piece(w, 'gloves', { affixes: [{ id: 'crumbs', value: 0.3 }] });
    equipGear(w, gl.id, null);
    expect(shakeFruitBonus(w, () => 0.1)).toBe(1);
    expect(shakeFruitBonus(w, () => 0.9)).toBe(0);
  });
});

describe('the stash: tabs, search, the cottage chest (R0174)', () => {
  it('fills tabs in order, never drops past the last, and round-trips export/import', () => {
    const w = world();
    expect(stashTabCount(w)).toBe(STASH.tabs);
    w.hollow.bossChests = [0];
    expect(stashTabCount(w)).toBe(STASH.tabs + 1);
    const total = STASH.perTab * stashTabCount(w) + 7;
    const g = ensureGear(w);
    for (let i = 0; i < total + 40; i++) piece(w, 'boots');
    expect(g.items.length + (g.stash?.length ?? 0)).toBe(total + 40);
    const counts = tabCounts(w);
    expect(counts.slice(0, -1).every((c) => c === STASH.perTab)).toBe(true);
    expect(counts[counts.length - 1]).toBe(STASH.perTab + 7);
    const back = deserialize(serialize(w, 0)).world;
    expect(back.gear?.stash).toEqual(w.gear?.stash);
  });

  it('moves between tabs only into room, and filters by tab, slot and words', () => {
    const w = world();
    const a = piece(w, 'boots');
    const b = piece(w, 'lantern');
    w.location = 'grove';
    const c = w.keeper.pos;
    c.x = -7;
    c.z = 14;
    expect(canReachStash(w)).toBe(true);
    applyCommand(w, { kind: 'stashPut', itemId: a.id }, []);
    applyCommand(w, { kind: 'stashPut', itemId: b.id }, []);
    expect(w.gear!.stash!.map((x) => x.id)).toEqual([a.id, b.id]);
    expect(stashMove(w, b.id, 2)).toBe(true);
    expect(stashMove(w, b.id, 99)).toBe(false);
    const tabOf = (x: GearItem) => x.tab ?? 0;
    const name = (x: GearItem) => x.slot;
    const s = w.gear!.stash!;
    expect(filterStash(s, { tab: 2, slot: null, query: '' }, tabOf, name)).toEqual([b]);
    expect(filterStash(s, { tab: null, slot: 'boots', query: '' }, tabOf, name)).toEqual([a]);
    expect(filterStash(s, { tab: null, slot: null, query: 'LANT' }, tabOf, name)).toEqual([b]);
    // Away from the cottage the chest does not open.
    c.x = 30;
    expect(canReachStash(w)).toBe(false);
    const d = piece(w, 'gloves');
    applyCommand(w, { kind: 'stashPut', itemId: d.id }, []);
    expect(w.gear!.items.some((x) => x.id === d.id)).toBe(true);
  });
});

describe('charms in sockets (R0173)', () => {
  it('the exact chain order in the right slot makes the named piece; any other order does not', () => {
    const w = world();
    const g = ensureGear(w);
    g.charms = { [charmKey('feather', 1)]: 2, [charmKey('sunbeam', 1)]: 1 };
    const boots = piece(w, 'boots', { sockets: 3 });
    const events: SimEvent[] = [];
    for (const k of ['feather:1', 'feather:1', 'sunbeam:1'])
      applyCommand(w, { kind: 'socketCharm', itemId: boots.id, charm: k }, events);
    expect(boots.chain).toBe('zephyr-boots');
    expect(events.some((e) => e.kind === 'hollowItems' && e.what === 'chain')).toBe(true);
    // Out again: free, back to the pouch, the chain comes undone.
    applyCommand(w, { kind: 'unsocketCharms', itemId: boots.id }, []);
    expect(boots.chain).toBeUndefined();
    expect(g.charms['feather:1']).toBe(2);
    for (const k of ['sunbeam:1', 'feather:1', 'feather:1'])
      applyCommand(w, { kind: 'socketCharm', itemId: boots.id, charm: k }, []);
    expect(boots.chain).toBeUndefined();
    expect(chainFor(boots)).toBeUndefined();
    // Same order in another slot: no chain either.
    const gloves = piece(w, 'gloves', {
      sockets: 3,
      socketed: ['feather:1', 'feather:1', 'sunbeam:1'],
    });
    expect(chainFor(gloves)).toBeUndefined();
  });

  it('charms add Keeper stats in Keeper pieces and Nubbin stats in Nubbin pieces, by grade', () => {
    const boots: GearItem = {
      id: 'x',
      base: 'boots',
      slot: 'boots',
      rarity: 'plain',
      level: 1,
      affixes: [],
      sockets: 1,
      socketed: ['feather:2'],
    };
    expect(itemExtraStat(boots, 'speed')).toBeCloseTo(0.1);
    const band = { ...boots, slot: 'bracelet', base: 'bracelet', socketed: ['feather:3'] };
    expect(itemExtraStat(band, 'energy')).toBe(3);
    expect(itemExtraStat(band, 'speed')).toBe(0);
  });

  it('a socket never takes a charm that is not in the pouch, nor past its sockets', () => {
    const w = world();
    const it = piece(w, 'boots', { sockets: 1 });
    applyCommand(w, { kind: 'socketCharm', itemId: it.id, charm: 'acorn:1' }, []);
    expect(it.socketed).toBeUndefined();
    ensureGear(w).charms = { 'acorn:1': 2 };
    applyCommand(w, { kind: 'socketCharm', itemId: it.id, charm: 'acorn:1' }, []);
    applyCommand(w, { kind: 'socketCharm', itemId: it.id, charm: 'acorn:1' }, []);
    expect(it.socketed).toEqual(['acorn:1']);
    expect(w.gear!.charms!['acorn:1']).toBe(1);
  });

  it('sockets only roll on Plain and Shiny pieces', () => {
    const w = world();
    const rng = new Rng(3);
    let socketed = 0;
    for (let i = 0; i < 400; i++) {
      const it = rollGear(w, rng, 3);
      if (it.sockets) {
        socketed++;
        expect(['plain', 'shiny']).toContain(it.rarity);
        expect(it.sockets).toBeLessThanOrEqual(3);
      }
    }
    expect(socketed).toBeGreaterThan(50);
  });
});

function barrowWorld(): World {
  const w = world();
  w.hollow.camp.questsPaid.push(1);
  return w;
}

describe("the Gardener's Wheelbarrow (R0177)", () => {
  it('stays shut until the Act II quest', () => {
    const w = world();
    ensureGear(w).charms = { 'acorn:1': 3 };
    const r = mixWheelbarrow(
      w,
      [charm('acorn:1'), charm('acorn:1'), charm('acorn:1')],
      new Rng(1),
      [],
    );
    expect(r.ok).toBe(false);
    expect(w.gear!.charms!['acorn:1']).toBe(3);
  });

  it('3 charms of a grade → 1 of the next', () => {
    const w = barrowWorld();
    ensureGear(w).charms = { 'acorn:1': 4 };
    const r = mixWheelbarrow(
      w,
      [charm('acorn:1'), charm('acorn:1'), charm('acorn:1')],
      new Rng(1),
      [],
    );
    expect(r).toMatchObject({ ok: true, recipe: 'charm-up', out: 'acorn:2' });
    expect(w.gear!.charms).toEqual({ 'acorn:1': 1, 'acorn:2': 1 });
    expect(w.gear!.recipes).toEqual(['charm-up']);
  });

  it('3 Shiny pieces of a slot → 1 Fancy of that slot', () => {
    const w = barrowWorld();
    const ids = [1, 2, 3].map(() => piece(w, 'lantern', { rarity: 'shiny' }).id);
    const r = mixWheelbarrow(w, ids.map(item), new Rng(4), []);
    expect(r.recipe).toBe('shiny-to-fancy');
    const made = w.gear!.items.find((x) => x.id === r.out)!;
    expect(made.rarity).toBe('fancy');
    expect(made.slot).toBe('lantern');
    expect(w.gear!.items.length).toBe(1);
  });

  it('Fancy + perfect charm rerolls; Plain + 3 Acorns adds a socket', () => {
    const w = barrowWorld();
    ensureGear(w).charms = { 'moonbeam:3': 1, 'acorn:1': 2, 'acorn:2': 1 };
    const f = piece(w, 'gloves', { rarity: 'fancy', affixes: [{ id: 'sunny', value: 1 }] });
    const r = mixWheelbarrow(w, [item(f.id), charm('moonbeam:3')], new Rng(9), []);
    expect(r.recipe).toBe('reroll');
    expect(f.affixes.length).toBeGreaterThanOrEqual(3);
    const p = piece(w, 'boots');
    const s = mixWheelbarrow(
      w,
      [item(p.id), charm('acorn:1'), charm('acorn:1'), charm('acorn:2')],
      new Rng(9),
      [],
    );
    expect(s.recipe).toBe('add-socket');
    expect(p.sockets).toBe(1);
    expect(w.gear!.charms).toEqual({});
  });

  it('6 essences of a type → a critter of that type', () => {
    const w = barrowWorld();
    w.inventory.essences.swim = 6;
    const r = mixWheelbarrow(
      w,
      new Array(6).fill(0).map(() => ({ kind: 'essence', type: 'swim' }) as BarrowSlot),
      new Rng(2),
      [],
    );
    expect(r.recipe).toBe('essence-critter');
    expect(w.inventory.essences.swim).toBe(0);
    expect(w.inventory.critters[r.out!]).toBe(1);
  });

  it('set piece + 3 perfect charms → a set piece not owned', () => {
    const w = barrowWorld();
    ensureGear(w).charms = { 'pebble:3': 3 };
    const owned = piece(w, 'boots', { rarity: 'set', setPiece: 'gran-wellies' });
    piece(w, 'gloves', { rarity: 'set', setPiece: 'gran-gloves' });
    const r = mixWheelbarrow(
      w,
      [item(owned.id), charm('pebble:3'), charm('pebble:3'), charm('pebble:3')],
      new Rng(5),
      [],
    );
    expect(r.recipe).toBe('set-swap');
    const made = w.gear!.items.find((x) => x.id === r.out)!;
    expect(['gran-wellies', 'gran-gloves']).not.toContain(made.setPiece);
    expect(w.gear!.found![made.setPiece!]).toBeDefined();
  });

  it('an unknown mix returns everything untouched', () => {
    const w = barrowWorld();
    ensureGear(w).charms = { 'acorn:1': 1, 'berry:2': 1 };
    w.inventory.essences.fly = 2;
    const p = piece(w, 'scarf', { rarity: 'shiny' });
    const before = JSON.stringify({ g: w.gear, inv: w.inventory });
    const events: SimEvent[] = [];
    const r = mixWheelbarrow(
      w,
      [item(p.id), charm('acorn:1'), charm('berry:2'), { kind: 'essence', type: 'fly' }],
      new Rng(1),
      events,
    );
    expect(r.ok).toBe(false);
    expect(JSON.stringify({ g: w.gear, inv: w.inventory })).toBe(before);
    expect(events).toEqual([{ kind: 'hollowItems', what: 'noMix', id: '' }]);
    // Asking for more than is owned is also no mix.
    expect(
      mixWheelbarrow(w, [charm('acorn:1'), charm('acorn:1'), charm('acorn:1')], new Rng(1), []).ok,
    ).toBe(false);
  });
});

describe('the key set (R0183)', () => {
  it('never drops on Cosy, and the pity counter makes each key certain by win 10', () => {
    const w = world();
    expect(noteKeyWin(w, 'captain-crumbs', new Rng(1), [])).toBeNull();
    w.hollow.difficulty = 'brisk';
    for (const source of ['captain-crumbs', 'fluffhotep', 'yeti-spaghetti']) {
      for (let seed = 0; seed < 50; seed++) {
        const v = world();
        v.hollow.difficulty = 'wild';
        let wins = 0;
        let got = null;
        const rng = new Rng(seed * 31 + 7);
        while (!got) {
          wins++;
          rng.next();
          got = noteKeyWin(v, source, rng, []);
        }
        expect(wins).toBeLessThanOrEqual(KEY_DROPS.pity);
      }
    }
  });

  it('all three keys in the wheelbarrow open the Pillow Fort', () => {
    const w = barrowWorld();
    ensureGear(w).keys = { giggles: 1, yawns: 1, brrr: 1 };
    const events: SimEvent[] = [];
    applyCommand(
      w,
      {
        kind: 'wheelbarrowMix',
        slots: [
          { kind: 'key', id: 'giggles' },
          { kind: 'key', id: 'yawns' },
          { kind: 'key', id: 'brrr' },
        ],
      },
      events,
    );
    expect(w.gear!.pillowFort).toBe('open');
    expect(events.some((e) => e.kind === 'hollowItems' && e.what === 'fort')).toBe(true);
  });
});

describe('sets and uniques (R0172)', () => {
  it('each set bonus applies at its piece count', () => {
    for (const set of SETS) {
      const w = world();
      const nub = w.nubbins[0]!.id;
      let worn = 0;
      for (const id of set.pieces) {
        const it = piece(w, 'x', { rarity: 'set', setPiece: id });
        // Sets span Keeper and Nubbin slots: wear each where it fits.
        const slot = SET_PIECES.find((p) => p.id === id)!.slot;
        it.slot = slot;
        it.base = slot;
        const ok = equipGear(w, it.id, null) || equipGear(w, it.id, nub);
        expect(ok).toBe(true);
        worn++;
        for (const b of set.bonuses) {
          const want = set.bonuses
            .filter((x) => x.stat === b.stat && worn >= x.at)
            .reduce((a, x) => a + x.value, 0);
          expect(setBonus(w, b.stat)).toBeCloseTo(want);
        }
      }
    }
  });

  it('every set piece and unique can drop from an ordinary Cosy roll', () => {
    const w = world();
    const rng = new Rng(11);
    const seen = new Set<string>();
    for (let i = 0; i < 4000 && seen.size < collectibleIds().length; i++) {
      const it = rollGear(w, rng, 2, 0, i % 2 ? 'set' : 'legendary');
      const id = it.setPiece ?? it.unique;
      if (id) seen.add(id);
    }
    expect(seen.size).toBe(collectibleIds().length);
    expect(Object.keys(w.gear!.found!).length).toBe(collectibleIds().length);
  });

  it('a unique adds its fixed stats through gearStat', () => {
    const w = world();
    const it = piece(w, 'boots', { rarity: 'legendary', unique: 'puddle-jumpers' });
    equipGear(w, it.id, null);
    expect(gearStat(w, 'speed')).toBeCloseTo(0.05 + 0.12);
  });
});
