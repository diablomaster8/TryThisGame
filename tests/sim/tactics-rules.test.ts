import { describe, expect, it } from 'vitest';
import type { BattleContext } from '../../src/sim/battle/types';
import { GROVE } from '../../src/config/tuning';
import { BATTLE_MAPS } from '../../src/config/battle-maps';
import { JOB_TEXT, OBJECTIVE_TEXT, TERRAIN_TEXT } from '../../src/config/strings-tactics';
import { SPECIES } from '../../src/sim/species';
import type { AlignmentBand, Nubbin, NubbinType } from '../../src/sim/types';
import '../../src/sim/battle/tactics/ai';
import {
  createTactics,
  hitMult,
  tacticsAct,
  unitOf,
  type TacticsSetup,
  type UnitSeed,
} from '../../src/sim/battle/tactics/engine';
import {
  JOB_IDS,
  jobFor,
  jobOfNubbin,
  jobOfSpecies,
  layerOf,
} from '../../src/sim/battle/tactics/jobs';
import { blocks, mapFromRows, tileAt } from '../../src/sim/battle/tactics/map';
import { mapFromField } from '../../src/sim/battle/tactics/map-field';
import { chipOf } from '../../src/sim/battle/tactics/objectives';
import { reachable } from '../../src/sim/battle/tactics/path';
import {
  attackTerrain,
  flutterBonus,
  hiddenFrom,
  inLantern,
  reflectOf,
  stepCost,
  terrainOf,
} from '../../src/sim/battle/tactics/terrain';
import { unitFromLevels } from '../../src/sim/battle/tactics/units';
import { moveById } from '../../src/sim/battle/moves';
import type { GridMap, Objective } from '../../src/sim/battle/tactics/types';

const ctx: BattleContext = { kind: 'dojo', tier: 1, ids: [] };
const unit = (id: string, side: 0 | 1, at: { x: number; y: number }, more = {}) =>
  unitFromLevels({ id, side, species: 'chao', level: 20, at, type: 'normal', ...more });
const bout = (
  map: GridMap,
  allies: UnitSeed[],
  foes: UnitSeed[],
  extra: Partial<TacticsSetup> = {},
) => createTactics({ seed: 3, map, allies, foes, context: ctx, ai: [null, null], ...extra });

describe('field maps (R0244)', () => {
  it('marks the cottage blocked and never paths through it', () => {
    const c = GROVE.buildings.cottage;
    const m = mapFromField(null, 'cottage-test', { x: c.x, z: c.z }, 10);
    expect(blocks(tileAt(m, 4, 4)) || blocks(tileAt(m, 5, 5))).toBe(true);
    for (let y = 0; y < m.h; y++)
      for (let x = 0; x < m.w; x++) {
        if (blocks(tileAt(m, x, y))) continue;
        const r = reachable(m, { x, y, move: 12, jump: 4, swimmer: true }, () => undefined);
        for (let i = 0; i < r.cost.length; i++)
          if (r.cost[i] !== Infinity) expect(blocks(m.tiles[i]!)).toBe(false);
      }
  });

  it('authored maps win over the field', () => {
    const m = mapFromField(null, 'corvin-garden', { x: 0, z: 0 }, 10);
    expect(m.h).toBe(BATTLE_MAPS['corvin-garden']!.rows.length);
  });
});

describe('terrain (R0249)', () => {
  const m = mapFromRows(['."=m,~', 'L.s*T.', '......']);
  const bonk = moveById('bonk')!;
  const splash = { ...bonk, kind: 'splash' as const, type: 'swim' as const };

  it('grass does nothing', () => {
    expect(terrainOf(m, 5, 2)).toBe('grass');
    expect(stepCost(m, 5, 2, false)).toBe(2);
    expect(attackTerrain(m, 5, 2, bonk, 'sun')).toBe(1);
  });
  it('tall grass: Flutter and hidden from far reach', () => {
    expect(flutterBonus(m, 1, 0)).toBeCloseTo(0.1);
    expect(hiddenFrom(m, 1, 0, 4)).toBe(true);
    expect(hiddenFrom(m, 1, 0, 3)).toBe(false);
  });
  it('path costs half, mud two', () => {
    expect(stepCost(m, 2, 0, false)).toBe(1);
    expect(stepCost(m, 3, 0, false)).toBe(4);
  });
  it('shallow boosts Swim moves and soaks non-Swim walkers', () => {
    expect(attackTerrain(m, 4, 0, splash, 'none')).toBeCloseTo(1.1);
    const s = bout(m, [unit('a', 0, { x: 3, y: 2 })], [unit('b', 1, { x: 0, y: 2 })]);
    const a = unitOf(s, 'a')!;
    s.active = 'a';
    s.moved = false;
    s.acted = false;
    a.x = 4;
    a.y = 1;
    a.c.major = null;
    tacticsAct(s, { k: 'move', x: 4, y: 0 });
    expect(unitOf(s, 'a')!.c.major?.id).toBe('soggy');
  });
  it('deep water is for swimmers only', () => {
    expect(stepCost(m, 5, 0, false)).toBeNull();
    expect(stepCost(m, 5, 0, true)).toBe(4);
  });
  it('lantern light boosts Sun moves and wakes the drowsy', () => {
    expect(inLantern(m, 1, 1)).toBe(true);
    expect(terrainOf(m, 1, 2)).toBe('light');
    expect(attackTerrain(m, 1, 1, bonk, 'sun')).toBeCloseTo(1.1);
    expect(inLantern(m, 0, 1, { '0,1': false })).toBe(false);
  });
  it('shade boosts Moon moves', () => {
    expect(attackTerrain(m, 2, 1, bonk, 'moon')).toBeCloseTo(1.1);
    expect(attackTerrain(m, 2, 1, bonk, 'none')).toBe(1);
  });
  it('crystal reflects a quarter of splash damage', () => {
    expect(reflectOf(m, 3, 1, splash, 20)).toBe(5);
    expect(reflectOf(m, 3, 1, bonk, 20)).toBe(0);
  });
  it('a fruit tree drops a fruit when shaken', () => {
    const s = bout(m, [unit('a', 0, { x: 5, y: 1 })], [unit('b', 1, { x: 0, y: 2 })]);
    s.active = 'a';
    s.acted = false;
    expect(tacticsAct(s, { k: 'shake', x: 4, y: 1 })).toBe(true);
    expect(s.log.some((e) => e.k === 'fruit')).toBe(true);
  });
  it('every kind has a card name and an icon', () => {
    for (const k of Object.keys(TERRAIN_TEXT)) {
      const t = TERRAIN_TEXT[k as keyof typeof TERRAIN_TEXT];
      expect(t.name.length).toBeGreaterThan(0);
      expect(t.icon.length).toBeGreaterThan(0);
    }
  });
});

describe('jobs (R0248)', () => {
  it('every form maps to a job and a layer', () => {
    const types: NubbinType[] = ['normal', 'swim', 'fly', 'run', 'power'];
    const bands: AlignmentBand[] = ['sun', 'moon', 'neutral'];
    for (const type of types)
      for (const band of bands) {
        const n = {
          species: 'chao',
          stage: 'adult',
          eternal: null,
          form: { band, type, second: null, leanAtEvolution: {} },
          lean: { normal: 0, swim: 0, fly: 0, run: 0, power: 0, [type]: 100 },
          stats: {},
        } as unknown as Nubbin;
        const j = jobOfNubbin(n);
        expect(JOB_IDS).toContain(j.job);
        expect(j.layer).toBe(layerOf(band));
      }
    expect(jobFor({ child: true, type: 'power', eternal: false })).toBe('tumbler');
    expect(jobFor({ child: false, type: 'power', eternal: true })).toBe('lanternKeeper');
  });

  it('every species stage maps to a job; champions get a slot', () => {
    for (const sp of SPECIES) {
      const j = jobOfSpecies(sp.id);
      expect(JOB_IDS).toContain(j.job);
      expect(j.extraSlot).toBe(sp.stage === 'champion' || sp.stage === 'final');
    }
    for (const id of JOB_IDS) expect(JOB_TEXT[id].icon.length).toBeGreaterThan(0);
  });

  it('a Dasher hits backs harder; a Bonker shrugs a fifth', () => {
    const open = mapFromRows(['....']);
    const s = bout(
      open,
      [unit('a', 0, { x: 0, y: 0 }, { job: 'dasher' })],
      [unit('b', 1, { x: 1, y: 0 }, { job: 'bonker' })],
    );
    const a = unitOf(s, 'a')!;
    const b = unitOf(s, 'b')!;
    b.face = 'e';
    expect(hitMult(s, a, b, moveById('bonk')!).mult).toBeCloseTo(1.5 / 1.2);
  });
});

describe('objectives (R0251)', () => {
  const open = mapFromRows(['L......', '.......', '...p...', '......X', 'T......']);
  const play = (o: Objective, script: (s: ReturnType<typeof bout>) => void) => {
    const s = bout(
      open,
      [unit('a', 0, { x: 1, y: 1 }), unit('a2', 0, { x: 1, y: 3 })],
      [unit('b', 1, { x: 6, y: 1 }), unit('b2', 1, { x: 5, y: 4 })],
      { objective: o },
    );
    script(s);
    return s;
  };
  const waitOut = (s: ReturnType<typeof bout>, n: number) => {
    for (let i = 0; i < n && !s.result; i++) tacticsAct(s, { k: 'wait', face: 's' });
  };

  it('tuckerAll: win and fail', () => {
    const win = play({ kind: 'tuckerAll' }, (s) =>
      s.units.filter((u) => u.c.side === 1).forEach((u) => (u.c.hp = 0)),
    );
    waitOut(win, 1);
    expect(win.result?.winner).toBe(0);
    const lose = play({ kind: 'tuckerAll' }, (s) =>
      s.units.filter((u) => u.c.side === 0).forEach((u) => (u.c.hp = 0)),
    );
    waitOut(lose, 1);
    expect(lose.result?.winner).toBe(1);
  });

  it('calmBoss: full Calm wins; a tuckered party fails', () => {
    const s = play({ kind: 'calmBoss', target: 'b' }, (s) => (unitOf(s, 'b')!.c.calm = 100));
    waitOut(s, 1);
    expect(s.result).toEqual({ winner: 0, reason: 'objective' });
    const f = play({ kind: 'calmBoss', target: 'b' }, (s) =>
      s.units.filter((u) => u.c.side === 0).forEach((u) => (u.c.hp = 0)),
    );
    waitOut(f, 1);
    expect(f.result).toEqual({ winner: 1, reason: 'failed' });
  });

  it('escort and reach: standing on the goal wins', () => {
    const s = play({ kind: 'reach', goal: { x: 6, y: 3 } }, (s) => {
      const a = unitOf(s, 'a')!;
      a.x = 6;
      a.y = 3;
    });
    waitOut(s, 1);
    expect(s.result?.reason).toBe('objective');
    const e = play({ kind: 'escort', target: 'a2', goal: { x: 6, y: 3 } }, () => {});
    waitOut(e, 30);
    expect(e.result).toBeNull();
    const a2 = unitOf(e, 'a2')!;
    a2.x = 6;
    a2.y = 3;
    waitOut(e, 1);
    expect(e.result?.reason).toBe('objective');
  });

  it('holdLanterns: kept lit wins, blown out fails', () => {
    const s = play({ kind: 'holdLanterns', count: 1, rounds: 2 }, () => {});
    waitOut(s, 40);
    expect(s.result?.winner).toBe(0);
    const f = play(
      { kind: 'holdLanterns', count: 1, rounds: 5 },
      (s) => (s.progress.lit['0,0'] = false),
    );
    waitOut(f, 1);
    expect(f.result).toEqual({ winner: 1, reason: 'failed' });
    expect(chipOf(s).need).toBe(2);
  });

  it('gather: first to K fruit', () => {
    const s = play({ kind: 'gather', count: 1 }, (s) => s.fruit.push({ x: 2, y: 1 }));
    const a = unitOf(s, s.active)!;
    s.fruit = [{ x: a.x + (a.c.side === 0 ? 1 : -1), y: a.y }];
    tacticsAct(s, { k: 'move', x: s.fruit[0]!.x, y: s.fruit[0]!.y });
    expect(s.result?.winner).toBe(a.c.side === 0 ? 0 : 1);
    expect(s.result?.reason).toBe(a.c.side === 0 ? 'objective' : 'failed');
  });

  it('protectPlot: three foe turns on the plot fail; surviving wins', () => {
    const f = play({ kind: 'protectPlot', rounds: 50 }, (s) => {
      const b = unitOf(s, 'b')!;
      b.x = 3;
      b.y = 2;
    });
    waitOut(f, 30);
    expect(f.result).toEqual({ winner: 1, reason: 'failed' });
    const w = play({ kind: 'protectPlot', rounds: 2 }, () => {});
    waitOut(w, 40);
    expect(w.result?.winner).toBe(0);
  });

  it('surviveRounds: lasting N rounds wins', () => {
    const s = play({ kind: 'surviveRounds', rounds: 3 }, () => {});
    waitOut(s, 60);
    expect(s.result).toEqual({ winner: 0, reason: 'objective' });
    expect(OBJECTIVE_TEXT.surviveRounds.fail.length).toBeGreaterThan(0);
  });
});
