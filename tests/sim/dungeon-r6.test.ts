import { afterEach, describe, expect, it } from 'vitest';
import { ACTS } from '../../src/config/dungeon-acts';
import { LOOT } from '../../src/config/dungeon-loot';
import { SIM } from '../../src/config/tuning';
import { HOLLOW_R6 } from '../../src/config/tuning-dungeon';
import { cellCentre, enterDungeon, floorOfRun, runFloor } from '../../src/sim/dungeon';
import { actBossDepth, actFloor } from '../../src/sim/dungeon-acts';
import {
  autoResolve,
  finishEncounter,
  setEncounterHandler,
  type EncounterOutcome,
} from '../../src/sim/dungeon-encounters';
import { basketPrice, basketRarity, gambleBasket } from '../../src/sim/dungeon-gamble';
import { clockText } from '../../src/sim/dungeon-log';
import { bankSack, tumbleHome } from '../../src/sim/dungeon-sack';
import { isStrayKing, kingHat } from '../../src/sim/dungeon-strays';
import { goToLevel } from '../../src/sim/dungeon-travel';
import { enterTown } from '../../src/sim/dungeon-zones';
import { serviceHere } from '../../src/sim/dungeon-towns';
import { ensureGear, keepGear, rollDrops, rollGear } from '../../src/sim/gear';
import { hatch } from '../../src/sim/lifecycle';
import { Rng } from '../../src/sim/rng';
import { deserialize, MIGRATIONS, SAVE_VERSION, serialize } from '../../src/sim/save';
import type { DungeonStray, SimEvent, World } from '../../src/sim/types';
import { applyCommand, createWorld, stepWorld } from '../../src/sim/world';

// Lane B round 6: boss floors (R0160), the sack and stash (R0175, R0174), the tumble home
// (R0362), the Mystery Basket (R0176), warm losses (R0180), sleepy packs (R0203), roster-free
// seeds (R0186), today's results and tuning stats (R0185, R0211), the Stray King (R0326),
// deterministic replay (R0209) and save version 12.

function keeperWorld(seed = 5, extra = 0): World {
  const world = createWorld(seed, 0);
  const events: SimEvent[] = [];
  for (let i = 0; i < extra; i++) world.nubbins.push({ ...world.nubbins[0]!, id: `x${i}` });
  for (const n of world.nubbins) hatch(n, events, 0);
  return world;
}

function step(world: World, ms: number): SimEvent[] {
  const out: SimEvent[] = [];
  for (let t = 0; t < ms; t += SIM.stepMs) out.push(...stepWorld(world, SIM.stepMs));
  return out;
}

/** A quiet act run: no packs, strays or grace in the way. */
function actRun(world: World, act = 0): World {
  applyCommand(world, { kind: 'enterAct', act }, []);
  const run = world.dungeon!;
  run.packs = [];
  run.strays = [];
  run.graceUntilMs = 0;
  return world;
}

/** Every gear piece the Keeper owns, banked or not. */
function owned(world: World): number {
  const g = ensureGear(world);
  return g.items.length + (g.stash?.length ?? 0) + (world.dungeon?.sack?.length ?? 0);
}

describe('boss floors (R0160)', () => {
  afterEach(() => setEncounterHandler(null));

  it('puts every act boss on its arena piece, in every seed tried', () => {
    for (let act = 0; act < ACTS.length; act++)
      for (let s = 1; s <= 12; s++) {
        const seed = s * 104729 + act;
        const f = actFloor(seed, act, actBossDepth(act), 4);
        expect(f.layout!.pieces.some((p) => p.role === 'boss')).toBe(true);
        const boss = f.packs!.find((p) => p.kind === 'boss')!;
        expect(boss).toBeDefined();
        expect(f.layout!.boss).not.toBeNull();
        expect(boss.cell).toEqual(f.layout!.boss);
      }
  });

  it('the first win sets the flag, opens the next act’s waypoint and drops a Legendary once', () => {
    setEncounterHandler(autoResolve);
    const world = keeperWorld();
    applyCommand(world, { kind: 'enterAct', act: 0 }, []);
    const run = world.dungeon!;
    goToLevel(world, run, actBossDepth(0), 'up', []);
    const f = runFloor(world)!;
    run.packs = run.packs!.filter((p) => p.id === 'pack-boss');
    const before = ensureGear(world).items.length;
    const events: SimEvent[] = [];
    run.encounter = { packId: 'pack-boss' };
    finishEncounter(world, f, 'won', events);
    expect(world.hollow.acts[0]!.bossDefeated).toBe(true);
    const party = events.find((e) => e.kind === 'bossCelebration');
    expect(party).toMatchObject({ act: 0, next: `${ACTS[1]!.id}.town` });
    expect(world.hollow.waypoints).toContain(`${ACTS[1]!.id}.town`);
    const items = ensureGear(world).items;
    expect(items.length).toBe(before + 1);
    expect(items.some((x) => x.rarity === HOLLOW_R6.bossChestRarity)).toBe(true);
    // Beating it again gives no second big chest.
    run.packs[0]!.state = 'idle';
    run.encounter = { packId: 'pack-boss' };
    const again: SimEvent[] = [];
    finishEncounter(world, f, 'won', again);
    expect(again.some((e) => e.kind === 'bossCelebration')).toBe(false);
  });

  it('a boss loss costs nothing and rests the party fully', () => {
    const world = keeperWorld();
    applyCommand(world, { kind: 'enterAct', act: 0 }, []);
    const run = world.dungeon!;
    goToLevel(world, run, actBossDepth(0), 'up', []);
    const f = runFloor(world)!;
    for (const n of world.nubbins) n.needs.energy = 0.1;
    const shells = world.inventory.shells;
    run.encounter = { packId: 'pack-boss' };
    finishEncounter(world, f, 'lost', []);
    expect(world.inventory.shells).toBe(shells);
    for (const id of run.party)
      expect(world.nubbins.find((n) => n.id === id)!.needs.energy).toBe(1);
  });
});

describe('the sack, the stash and the tumble (R0175, R0174, R0362)', () => {
  it('gear found underground rides in the sack and banks at home with a haul card', () => {
    const world = actRun(keeperWorld());
    const events: SimEvent[] = [];
    for (let i = 0; i < 40; i++) rollDrops(world, new Rng(i + 1), 'pack-boss', 4, events);
    const sack = world.dungeon!.sack!.length;
    expect(sack).toBeGreaterThan(0);
    expect(ensureGear(world).items.length).toBe(0);
    const left: SimEvent[] = [];
    applyCommand(world, { kind: 'leaveDungeon' }, left);
    expect(left).toContainEqual({ kind: 'haulBanked', items: sack, where: 'home' });
    expect(owned(world)).toBe(sack);
    // An empty trip still shows the card.
    actRun(world);
    const empty: SimEvent[] = [];
    applyCommand(world, { kind: 'leaveDungeon' }, empty);
    expect(empty).toContainEqual({ kind: 'haulBanked', items: 0, where: 'home' });
  });

  it('no path reduces what is owned: losses, the stash overflow, camps and portals', () => {
    const world = actRun(keeperWorld());
    const run = world.dungeon!;
    const f = runFloor(world)!;
    let last = 0;
    const check = () => {
      const now = owned(world);
      expect(now).toBeGreaterThanOrEqual(last);
      last = now;
    };
    for (let i = 0; i < 60; i++) {
      rollDrops(world, new Rng(i + 7), 'pack-boss', 3, []);
      check();
      if (i % 7 === 0) {
        run.encounter = { packId: 'nobody' };
        finishEncounter(world, f, 'lost' as EncounterOutcome, []);
        check();
      }
      if (i % 11 === 0) {
        bankSack(world, run, 'waypoint', []);
        check();
      }
    }
    // Way past the satchel's size: the overflow went to the stash, none dropped.
    expect(ensureGear(world).items.length).toBeLessThanOrEqual(LOOT.carry);
    for (let i = 0; i < LOOT.carry + 10; i++) keepGear(world, rollGear(world, new Rng(i), 3));
    check();
    expect(ensureGear(world).stash!.length).toBeGreaterThan(0);
    // The stash survives export and import exactly.
    const back = deserialize(serialize(world, 0)).world;
    expect(back.gear!.stash).toEqual(world.gear!.stash);
    // Taking one out moves it, only while the satchel has room.
    const g = ensureGear(world);
    const id = g.stash![0]!.id;
    applyCommand(world, { kind: 'stashTake', itemId: id }, []);
    expect(g.stash!.some((x) => x.id === id)).toBe(g.items.length >= LOOT.carry);
  });

  it('a camp banks the sack', () => {
    const world = keeperWorld();
    world.hollow.acts = [{ bossDefeated: true, deepest: 3 }];
    enterTown(world, 1, new Rng(2), []);
    const run = world.dungeon!;
    run.sack = [rollGear(world, new Rng(1), 3)];
    const events = step(world, 200);
    expect(events).toContainEqual({ kind: 'haulBanked', items: 1, where: 'camp' });
    expect(run.sack).toBeUndefined();
  });

  it('forcing every party Nubbin to zero energy tumbles home with half the sack', () => {
    const world = actRun(keeperWorld());
    const run = world.dungeon!;
    run.sack = Array.from({ length: 6 }, (_, i) => rollGear(world, new Rng(i), 2));
    for (const id of run.party) world.nubbins.find((n) => n.id === id)!.needs.energy = 0;
    const events = step(world, 100);
    expect(events).toContainEqual({ kind: 'tumbleHome', kept: 3, camp: 3 });
    expect(world.location).toBe('grove');
    expect(ensureGear(world).items.length).toBe(3);
    expect(ensureGear(world).stash!.length).toBe(3);
    expect(tumbleHome(world, [])).toBe(false);
  });
});

describe('the Mystery Basket (R0176)', () => {
  it('holds its odds over 100k rolls within ±1%, never Plain', () => {
    const rng = new Rng(42);
    const counts: Record<string, number> = {};
    const n = 100_000;
    for (let i = 0; i < n; i++) {
      const r = basketRarity(rng);
      counts[r] = (counts[r] ?? 0) + 1;
    }
    expect(counts.plain).toBeUndefined();
    for (const [id, p] of Object.entries(HOLLOW_R6.basketOdds))
      expect(Math.abs((counts[id] ?? 0) / n - p)).toBeLessThan(0.01);
  });

  it('sells only at a camp vendor, for the act’s price, and sinks the Shells', () => {
    const world = keeperWorld();
    world.hollow.acts = [{ bossDefeated: true, deepest: 3 }];
    enterTown(world, 1, new Rng(2), []);
    expect(gambleBasket(world, 'boots', new Rng(1), [])).toBeNull();
    // Stand at the vendor.
    const f = runFloor(world)!;
    let found = false;
    for (let y = 0; y < f.rows && !found; y++)
      for (let x = 0; x < f.cols && !found; x++) {
        world.keeper.pos = cellCentre(f, { x, y });
        found = serviceHere(world)?.kind === 'vendor';
      }
    expect(found).toBe(true);
    world.inventory.shells = 1000;
    const events: SimEvent[] = [];
    applyCommand(world, { kind: 'gambleBasket', slot: 'boots' }, events);
    expect(world.inventory.shells).toBe(1000 - basketPrice(1));
    const opened = events.find((e) => e.kind === 'basketOpened');
    expect(opened).toMatchObject({ ok: true, price: basketPrice(1) });
    if (opened?.kind === 'basketOpened') {
      expect(opened.item!.slot).toBe('boots');
      expect(opened.item!.rarity).not.toBe('plain');
    }
    world.inventory.shells = 3;
    const poor: SimEvent[] = [];
    applyCommand(world, { kind: 'gambleBasket', slot: 'boots' }, poor);
    expect(poor).toContainEqual({ kind: 'basketOpened', ok: false, price: basketPrice(1) });
    expect(world.inventory.shells).toBe(3);
  });
});

describe('warm losses and sleepy packs (R0180, R0203)', () => {
  it('a loss rests the party to half and offers a sneak after the third', () => {
    const world = actRun(keeperWorld());
    const run = world.dungeon!;
    const f = runFloor(world)!;
    const spec = f.packs!.find((p) => p.kind === 'normal')!;
    run.packs = [
      { id: spec.id, pos: cellCentre(f, spec.cell), state: 'idle', target: null, noticedMs: -1 },
    ];
    const inv = JSON.stringify(world.inventory);
    for (const n of world.nubbins) n.needs.energy = 0.05;
    const offers: SimEvent[] = [];
    for (let i = 0; i < 3; i++) {
      applyCommand(world, { kind: 'packSneak', packId: spec.id }, offers);
      expect(offers.some((e) => e.kind === 'sneakPast')).toBe(false);
      run.encounter = { packId: spec.id };
      finishEncounter(world, f, 'lost', offers);
      expect(offers.filter((e) => e.kind === 'sneakOffer').length).toBe(i === 2 ? 1 : 0);
    }
    expect(JSON.stringify(world.inventory)).toBe(inv);
    for (const id of run.party)
      expect(world.nubbins.find((n) => n.id === id)!.needs.energy).toBe(HOLLOW_R6.lossEnergy);
    applyCommand(world, { kind: 'packSneak', packId: spec.id }, offers);
    expect(offers.some((e) => e.kind === 'sneakPast')).toBe(true);
    // The pack looks away: standing right on it starts nothing for a while.
    run.graceUntilMs = 0;
    world.keeper.pos = { ...run.packs[0]!.pos };
    expect(step(world, 3000).some((e) => e.kind === 'encounterStarted')).toBe(false);
  });

  it('walking past a sleeping pack keeps it asleep with a tiptoe bonus; running wakes it', () => {
    for (const running of [false, true]) {
      const world = actRun(keeperWorld());
      for (const n of world.nubbins) n.personality = 'cheerful';
      const run = world.dungeon!;
      const f = runFloor(world)!;
      const spec = f.packs!.find((p) => p.kind === 'normal')!;
      const at = cellCentre(f, spec.cell);
      run.packs = [
        { id: spec.id, pos: { ...at }, state: 'idle', target: null, noticedMs: -1, asleep: true },
      ];
      world.keeper.pos = { x: at.x + 1.5, z: at.z };
      world.keeper.running = running;
      const shells = world.inventory.shells;
      const events = step(world, 300);
      if (running) {
        expect(events.some((e) => e.kind === 'packWoke')).toBe(true);
        expect(run.packs[0]!.asleep).toBeUndefined();
      } else {
        expect(events.filter((e) => e.kind === 'tiptoe').length).toBe(1);
        expect(run.packs[0]!.asleep).toBe(true);
        expect(world.inventory.shells).toBe(shells + HOLLOW_R6.tiptoeShells);
      }
    }
  });

  it('about a fifth of normal packs start asleep', () => {
    let normal = 0;
    let asleep = 0;
    for (let s = 1; s <= 40; s++) {
      const world = createWorld(s, 0);
      enterDungeon(world, false, new Rng(s), []);
      const run = world.dungeon!;
      const f = floorOfRun(run);
      for (const p of run.packs ?? []) {
        if (f.packs!.find((x) => x.id === p.id)?.kind !== 'normal') continue;
        normal++;
        if (p.asleep) asleep++;
      }
    }
    expect(normal).toBeGreaterThan(30);
    expect(asleep / normal).toBeGreaterThan(0.08);
    expect(asleep / normal).toBeLessThan(0.35);
  });
});

describe('roster-free seeds and today’s results (R0186, R0185, R0211)', () => {
  it('rosters of 1 and 7 opening the same daily chest get the same Shells', () => {
    const shells = [1, 7].map((size) => {
      const world = keeperWorld(9, size - 2);
      world.nubbins.length = size;
      world.lastWallMs = Date.UTC(2026, 9, 29, 12);
      enterDungeon(world, true, new Rng(1), []);
      const f = runFloor(world)!;
      world.dungeon!.strays = [];
      world.dungeon!.packs = [];
      const before = world.inventory.shells;
      applyCommand(world, { kind: 'dungeonGo', to: 'chest' }, []);
      world.keeper.pos = cellCentre(f, f.chest!);
      step(world, 200);
      return world.inventory.shells - before;
    });
    expect(shells[0]).toBeGreaterThan(0);
    expect(shells[0]).toBe(shells[1]);
  });

  it('today’s deepest, time and finds update, and the stats survive a reload', () => {
    const world = keeperWorld();
    world.lastWallMs = Date.UTC(2026, 9, 29, 12);
    applyCommand(world, { kind: 'enterDungeon', daily: true }, []);
    const run = world.dungeon!;
    run.packs = [];
    run.strays = [];
    step(world, 5000);
    applyCommand(world, { kind: 'dungeonGo', to: 'down' }, []);
    world.keeper.pos = { ...run.pendingPos! };
    step(world, 200);
    expect(run.depth).toBe(2);
    run.haul.items = 4;
    applyCommand(world, { kind: 'leaveDungeon' }, []);
    const t = world.hollow.today!;
    expect(t.deepest).toBe(2);
    expect(t.bestMs).toBeGreaterThan(4000);
    expect(t.finds).toBe(4);
    expect(world.hollow.stats!.levelMs.length).toBe(1);
    expect(world.hollow.stats!.fights).toEqual([0]);
    const back = deserialize(serialize(world, 0)).world;
    expect(back.hollow.stats).toEqual(world.hollow.stats);
    expect(back.hollow.today).toEqual(world.hollow.today);
    expect(clockText(372_000)).toBe('6:12');
  });
});

describe('the Stray King (R0326)', () => {
  it('is about one stray in twelve, and calming or feeding it leaves a hat once', () => {
    let kings = 0;
    for (let i = 0; i < 1200; i++) if (isStrayKing(i, 1 + (i % 5), `stray-${i % 3}`)) kings++;
    expect(kings / 1200).toBeGreaterThan(0.05);
    expect(kings / 1200).toBeLessThan(0.13);
    const world = keeperWorld();
    const s: DungeonStray = {
      id: 'stray-0',
      pos: { x: 0, z: 0 },
      target: null,
      cooldownMs: 0,
      king: true,
    };
    const events: SimEvent[] = [];
    kingHat(world, s, events);
    expect(world.inventory.hats.length).toBe(1);
    expect(events[0]).toMatchObject({ kind: 'strayKing' });
    kingHat(world, { ...s, king: undefined } as never, events);
    expect(world.inventory.hats.length).toBe(1);
  });
});

describe('co-op hooks (R0209)', () => {
  it('replays a Hollow level identically from the same seed and inputs', () => {
    const play = () => {
      setEncounterHandler(autoResolve);
      const world = keeperWorld(21);
      applyCommand(world, { kind: 'enterAct', act: 0 }, []);
      const f = runFloor(world)!;
      for (let i = 0; i < 6; i++) {
        const target = cellCentre(f, f.rooms[i % f.rooms.length]!);
        world.keeper.moveTarget = target;
        step(world, 4000);
      }
      setEncounterHandler(null);
      return serialize(world, 0);
    };
    expect(play()).toBe(play());
  });
});

describe('save version 12', () => {
  it('migrates a version-11 save: an empty stash, beaten bosses counted as paid', () => {
    expect(SAVE_VERSION).toBeGreaterThanOrEqual(12);
    const world = keeperWorld();
    world.hollow.acts = [
      { bossDefeated: true, deepest: 3 },
      { bossDefeated: false, deepest: 1 },
    ];
    ensureGear(world);
    const old = JSON.parse(serialize(world, 0));
    old.version = 11;
    delete old.world.gear.stash;
    delete old.world.hollow.bossChests;
    delete old.world.hollow.today;
    delete old.world.hollow.stats;
    expect(MIGRATIONS.length).toBeGreaterThanOrEqual(11);
    const back = deserialize(JSON.stringify(old)).world;
    expect(back.gear!.stash).toEqual([]);
    expect(back.hollow.bossChests).toEqual([0]);
    expect(back.hollow.today).toEqual({ day: '', deepest: 0, bestMs: 0, finds: 0 });
    expect(back.hollow.stats!.levelMs).toEqual([]);
  });
});
