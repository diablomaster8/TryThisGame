import { afterEach, describe, expect, it } from 'vitest';
import { championMod, type ChampionModId } from '../../src/config/dungeon-foes';
import { R10B4 } from '../../src/config/tuning-r10b4';
import { HOLLOW } from '../../src/config/tuning';
import { createBattle, type BattleState } from '../../src/sim/battle';
import { damageWith } from '../../src/sim/battle/damage';
import { afterModHit, dressFoeMods } from '../../src/sim/battle/hollow-mods';
import { moveOf } from '../../src/sim/battle/moves';
import { createTactics, tacticsAct, unitOf } from '../../src/sim/battle/tactics/engine';
import { mapFromRows } from '../../src/sim/battle/tactics/map';
import { unitFromLevels } from '../../src/sim/battle/tactics/units';
import { cellCentre, cellOf, runFloor } from '../../src/sim/dungeon';
import { actFloor } from '../../src/sim/dungeon-acts';
import { wireOf } from '../../src/sim/dungeon-bell-wire';
import {
  battleHandler,
  encounterSpec,
  finishEncounter,
  setEncounterHandler,
} from '../../src/sim/dungeon-encounters';
import { stepTraps } from '../../src/sim/dungeon-traps';
import { hatch } from '../../src/sim/lifecycle';
import { Rng } from '../../src/sim/rng';
import { STAT_KEYS, type SimEvent, type World } from '../../src/sim/types';
import { applyCommand, createWorld } from '../../src/sim/world';

// Lane B round 10, helper b4: the last champion modifiers (R0155), the tiers' Bell Wire
// chains, Immune to Tickles and fight scaling (R0179).

function world(): World {
  const w = createWorld(5, 0);
  const events: SimEvent[] = [];
  for (const n of w.nubbins) {
    hatch(n, events, 0);
    for (const k of STAT_KEYS) n.stats[k].points = 2000;
  }
  return w;
}

function bout(w: World, mods: ChampionModId[][], seed = 3): BattleState {
  return createBattle(
    w,
    {
      kind: 'encounter',
      tier: 1,
      ids: w.nubbins.map((n) => n.id),
      source: 'test',
      key: 'k',
      foes: mods.map((m) => ({
        species: 'zapling',
        level: 10,
        wild: true,
        ...(m.length ? { mods: m } : {}),
      })),
    },
    seed,
  )!;
}

const bonk = moveOf('bonk');

afterEach(() => setEncounterHandler(null));

describe('Copycat, Hiding and Immune to Tickles in the fight (R0155, R0179)', () => {
  it('Copycat echoes each hit at its weak share', () => {
    const w = world();
    const s = bout(w, [['copycat']]);
    const [ally, foe] = [s.sides[0][0]!, s.sides[1][0]!];
    const hp = ally.hp;
    afterModHit(s, new Rng(1), foe, ally, 20);
    expect(ally.hp).toBe(hp - Math.round(20 * championMod('copycat').effect.extraWeakAttack!));
    // An ally's hit on it is never echoed.
    const foeHp = foe.hp;
    afterModHit(s, new Rng(1), ally, foe, 20);
    expect(foe.hp).toBe(foeHp);
  });

  it('Hiding puffs away after it strikes, so the next hit on it lands at half', () => {
    const w = world();
    const s = bout(w, [['hiding']]);
    const [ally, foe] = [s.sides[0][0]!, s.sides[1][0]!];
    const plain = damageWith(ally, foe, bonk, false, 1).dmg;
    afterModHit(s, new Rng(1), foe, ally, 5);
    expect(foe.mod?.hidden).toBe(true);
    const hidden = damageWith(ally, foe, bonk, false, 1).dmg;
    expect(hidden).toBeLessThan(plain);
    expect(hidden).toBeCloseTo(plain * R10B4.mods.hiddenTaken, -1);
    // Struck, it comes out again.
    afterModHit(s, new Rng(1), ally, foe, hidden);
    expect(foe.mod?.hidden).toBeUndefined();
    expect(damageWith(ally, foe, bonk, false, 1).dmg).toBe(plain);
  });

  it('Immune to Tickles halves only its own type of move', () => {
    const w = world();
    const s = bout(w, [['tickleProof']]);
    const [ally, foe] = [s.sides[0][0]!, s.sides[1][0]!];
    expect(foe.mod?.proof).toBe(foe.type);
    const own = { ...bonk, type: foe.type };
    const other = { ...bonk, type: foe.type === 'power' ? 'swim' : 'power' } as typeof bonk;
    const plain = bout(w, [[]]).sides[1][0]!;
    expect(damageWith(ally, foe, own, false, 1).dmg).toBeLessThan(
      damageWith(ally, plain, own, false, 1).dmg,
    );
    expect(damageWith(ally, foe, other, false, 1).dmg).toBe(
      damageWith(ally, plain, other, false, 1).dmg,
    );
    // It is a Wild modifier: never in the rolled table, but named and drawn like the others.
    expect(championMod('tickleProof').name).toBe('Immune to Tickles');
  });
});

describe('Sparkly and Sticky on the tactics board (R0155)', () => {
  it('a struck Sparkly foe zaps back and a Sticky foe slows whoever it hits', () => {
    const board = mapFromRows(['.....', '.....', '.....']);
    const mk = (id: string, side: 0 | 1, x: number) =>
      unitFromLevels({ id, side, species: 'chao', level: 30, at: { x, y: 1 }, type: 'power' });
    const a = mk('a', 0, 1);
    const f = mk('f', 1, 2);
    dressFoeMods(f.c, ['sparkly', 'sticky'], [f.c], [a.c]);
    const s = createTactics({
      seed: 3,
      map: board,
      allies: [a],
      foes: [f],
      context: { kind: 'dojo', tier: 1, ids: [] },
      ai: [null, null],
    });
    s.active = 'a';
    s.acted = false;
    s.moved = false;
    const hp = unitOf(s, 'a')!.c.hp;
    for (let i = 0; i < 6 && !s.log.some((e) => e.k === 'hit'); i++) {
      s.active = 'a';
      s.acted = false;
      tacticsAct(s, { k: 'act', move: 'bonk', x: 2, y: 1 });
    }
    const hits = s.log.filter((e) => e.k === 'hit');
    expect(hits.some((e) => e.k === 'hit' && e.by === 'f' && e.to === 'a')).toBe(true);
    expect(unitOf(s, 'a')!.c.hp).toBeLessThan(hp);
    // Sticky: the foe's hit on the ally takes a Zip stage off it.
    afterModHit(s as unknown as BattleState, new Rng(1), f.c, a.c, 5);
    expect(a.c.moods.zip ?? 0).toBeLessThan(0);
  });
});

describe('Hollow tiers reach the fight (R0179)', () => {
  function underground(difficulty?: 'brisk' | 'wild'): World {
    const w = world();
    if (difficulty) {
      w.hollow.tiersOpen = ['brisk', 'wild'];
      w.hollow.difficulty = difficulty;
    }
    applyCommand(w, { kind: 'enterAct', act: 0 }, []);
    return w;
  }

  it('maps the tier’s FIGHT flag to the core and lifts the level cap on Brisk and Wild', () => {
    const levels: number[] = [];
    for (const tier of [undefined, 'brisk', 'wild'] as const) {
      const w = underground(tier);
      const run = w.dungeon!;
      expect(run.difficulty).toBe(tier);
      const f = runFloor(w)!;
      const pack = f.packs![0]!;
      for (const m of pack.members) m.level = 99;
      run.encounter = { packId: pack.id };
      const spec = encounterSpec(w, f, pack, cellOf(f, w.keeper.pos));
      expect(spec.fight).toBe(tier === 'wild' ? 'tactics' : tier ? 'standard' : 'gentle');
      expect(battleHandler(w, spec, new Rng(1), [])).toBeNull();
      const ctx = w.battle!.context;
      expect('difficulty' in ctx ? ctx.difficulty : undefined).toBe(
        tier === 'wild' ? 'spicy' : undefined,
      );
      if (tier === 'wild') expect(w.battle!.ai).toBe('champion');
      levels.push(w.battle!.sides[1][0]!.level);
    }
    expect(levels[1]! - levels[0]!).toBe(R10B4.tiers.boutLift.brisk);
    expect(levels[2]! - levels[0]!).toBe(R10B4.tiers.boutLift.wild);
  });

  it('a lost fight with a Snack Thief costs one fruit, never more, never below none', () => {
    const w = underground();
    const run = w.dungeon!;
    const f = runFloor(w)!;
    const pack = f.packs![0]!;
    const before = pack.members.map((m) => [...m.mods]);
    for (const m of pack.members) m.mods = ['snackThief'];
    w.inventory.fruit = 3;
    const out: SimEvent[] = [];
    run.encounter = { packId: pack.id };
    finishEncounter(w, f, 'lost', out);
    expect(w.inventory.fruit).toBe(3 - R10B4.mods.snack);
    expect(out).toContainEqual({ kind: 'partyGiggles', packId: pack.id, snack: 1 });
    w.inventory.fruit = 0;
    run.encounter = { packId: pack.id };
    const out2: SimEvent[] = [];
    finishEncounter(w, f, 'lost', out2);
    expect(w.inventory.fruit).toBe(0);
    expect(out2).toContainEqual({ kind: 'partyGiggles', packId: pack.id });
    pack.members.forEach((m, i) => (m.mods = before[i]!));
  });

  it('gives Wild floors Bell Wire chains and Immune to Tickles, Cosy and Brisk neither', () => {
    let wires = 0;
    for (let seed = 1; seed <= 12; seed++) {
      const cosy = actFloor(seed, 1, 6, 4, 'cosy');
      const wild = actFloor(seed, 1, 6, 4, 'wild');
      for (const f of [cosy, actFloor(seed, 1, 6, 4, 'brisk')]) {
        expect((f.traps ?? []).some((t) => t.wire !== undefined)).toBe(false);
        for (const p of f.packs ?? [])
          for (const m of p.members) expect(m.mods).not.toContain('tickleProof');
      }
      const wired = (wild.traps ?? []).filter((t) => t.wire !== undefined);
      wires += new Set(wired.map((t) => t.wire)).size;
      for (const t of wired) expect(wireOf(wild, t)).toHaveLength(R10B4.bellWire.bells);
      for (const p of wild.packs ?? [])
        if (p.kind === 'champion' || p.kind === 'elite')
          expect(p.members[0]!.mods).toContain('tickleProof');
      // Cosy floors keep their traps exactly.
      expect(JSON.stringify(cosy.traps)).toBe(
        JSON.stringify(actFloor(seed, 1, 6, 4, 'cosy').traps),
      );
    }
    expect(wires).toBeGreaterThan(8);
  });

  it('springing one wired bell rings the whole wire and calls more than one pack', () => {
    const w = underground('wild');
    const run = w.dungeon!;
    const f = runFloor(w)!;
    const wired = (f.traps ?? []).filter((t) => t.wire !== undefined);
    expect(wired.length).toBeGreaterThan(0);
    const bell = wired[0]!;
    // Every pack stands about, close to the wire.
    run.packs = (run.packs ?? []).map((p, i) => ({
      ...p,
      state: 'home' as const,
      pos: cellCentre(f, wireOf(f, bell)[i % R10B4.bellWire.bells]!.cell),
    }));
    run.graceUntilMs = 1e12;
    const k = w.keeper;
    k.pos = cellCentre(f, bell.cell);
    k.grounded = true;
    const out: SimEvent[] = [];
    stepTraps(w, run, f, HOLLOW.traps.rearmMs / 100, out);
    for (const t of wireOf(f, bell)) expect(run.trapsSprung?.some((s) => s.id === t.id)).toBe(true);
    expect(out).toContainEqual({ kind: 'trapSprung', trap: 'bell', wire: true });
    expect(out.filter((e) => e.kind === 'packNoticed').length).toBeGreaterThan(1);
  });
});
