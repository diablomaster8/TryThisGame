import { BATTLE } from '../../src/config/tuning-battle';
import type { BattleContext } from '../../src/sim/battle/types';
import { describe, expect, it } from 'vitest';
import { floorOf } from '../../src/sim/dungeon';
import { Rng } from '../../src/sim/rng';
import { damageWith, moveDamage } from '../../src/sim/battle/damage';
import { moveById } from '../../src/sim/battle/moves';
import { aiTurn as suggestHook } from '../../src/sim/battle/tactics/ai';
import {
  createTactics,
  hitMult,
  movesOf,
  preview,
  pushUnit,
  reachOf,
  tacticsAct,
  turnStrip,
  unitOf,
  type TacticsSetup,
  type UnitSeed,
} from '../../src/sim/battle/tactics/engine';
import { facingMult, heightMult, sideOf } from '../../src/sim/battle/tactics/facing';
import {
  decodeMap,
  deployConnected,
  encodeMap,
  fromB64,
  mapFromFloor,
  mapFromRows,
  toB64,
} from '../../src/sim/battle/tactics/map';
import { canEnd, fallDamage, moveJump, reachable } from '../../src/sim/battle/tactics/path';
import { canAim, gridOf } from '../../src/sim/battle/tactics/range';
import { unitFromLevels } from '../../src/sim/battle/tactics/units';
import type { Dir, GridMap } from '../../src/sim/battle/tactics/types';

const ctx: BattleContext = { kind: 'dojo', tier: 1, ids: [] };

function bout(
  map: GridMap,
  allies: UnitSeed[],
  foes: UnitSeed[],
  extra: Partial<TacticsSetup> = {},
) {
  return createTactics({ seed: 7, map, allies, foes, context: ctx, ai: [null, null], ...extra });
}

const unit = (id: string, side: 0 | 1, at: { x: number; y: number }, more = {}) =>
  unitFromLevels({ id, side, species: 'chao', level: 20, at, type: 'normal', ...more });

describe('tactics maps (R0243)', () => {
  it('round-trips base64 and the serial map', () => {
    const b = new Uint8Array([0, 1, 2, 250, 4, 99, 7]);
    expect([...fromB64(toB64(b))]).toEqual([...b]);
    const m = mapFromRows(['..#', '.~.'], ['012', '000']);
    const back = decodeMap(encodeMap(m));
    expect([...back.tiles]).toEqual([...m.tiles]);
    expect([...back.height]).toEqual([...m.height]);
  });

  it('crops Hollow floors into connected maps, fast, over 500 seeds', () => {
    let worst = 0;
    let total = 0;
    const floors = Array.from({ length: 20 }, (_, i) => floorOf(1000 + i, 2 + (i % 4)));
    for (let seed = 0; seed < 500; seed++) {
      const floor = floors[seed % floors.length]!;
      const room = floor.rooms[seed % floor.rooms.length]!;
      const near = { x: room.x + 1, y: room.y + 1 };
      const t0 = performance.now();
      const m = mapFromFloor(floor, near, new Rng(seed), seed % 2 ? 14 : 16);
      const dt = performance.now() - t0;
      total += dt;
      worst = Math.max(worst, dt);
      expect(m.w).toBeGreaterThanOrEqual(8);
      expect(m.w).toBeLessThanOrEqual(16);
      expect(m.deploy.a.length).toBe(4);
      expect(m.deploy.b.length).toBe(4);
      expect(deployConnected(m, 1)).toBe(true);
      expect(Math.max(...m.height)).toBeLessThanOrEqual(4);
    }
    expect(total / 500).toBeLessThan(5);
  }, 60_000);
});

describe('movement, height and jump (R0245)', () => {
  const ledge = mapFromRows(['...'], ['002']);
  const walker = (jump: number, swimmer = false) => ({ x: 1, y: 0, move: 4, jump, swimmer });

  it('Jump 1 fails a 2-step ledge and Jump 2 climbs it', () => {
    expect(
      canEnd(
        reachable(ledge, walker(1), () => undefined),
        2,
        0,
      ),
    ).toBe(false);
    expect(
      canEnd(
        reachable(ledge, walker(2), () => undefined),
        2,
        0,
      ),
    ).toBe(true);
  });

  it('only a swimmer enters deep water, at 2 moves a tile', () => {
    const pool = mapFromRows(['.~~.']);
    const swim = reachable(pool, { x: 0, y: 0, move: 4, jump: 1, swimmer: true }, () => undefined);
    expect(canEnd(swim, 2, 0)).toBe(true);
    expect(canEnd(swim, 3, 0)).toBe(false); // 2 + 2 + 1 = 5 moves
    const dry = reachable(pool, { x: 0, y: 0, move: 4, jump: 1, swimmer: false }, () => undefined);
    expect(canEnd(dry, 1, 0)).toBe(false);
  });

  it('paths cost half and round once per route; mud costs two', () => {
    const lane = mapFromRows(['=======', 'mmmm...']);
    const r = reachable(lane, { x: 0, y: 0, move: 3, jump: 1, swimmer: false }, () => undefined);
    expect(canEnd(r, 6, 0)).toBe(true);
    const r2 = reachable(lane, { x: 0, y: 1, move: 3, jump: 1, swimmer: false }, () => undefined);
    expect(canEnd(r2, 1, 1)).toBe(true);
    expect(canEnd(r2, 2, 1)).toBe(false);
  });

  it('Move and Jump from Run and Fly, with Featherlight', () => {
    const L = { swim: 0, fly: 99, run: 99, power: 0, stamina: 0 };
    expect(moveJump(L, [])).toEqual({ move: 6, jump: 4 });
    expect(moveJump({ ...L, fly: 0, run: 0 }, [{ id: 'featherlight', full: true }])).toEqual({
      move: 3,
      jump: 2,
    });
  });

  it('a fall bumps 10% and never tuckers', () => {
    expect(fallDamage(3, 50, 100)).toBe(10);
    expect(fallDamage(2, 50, 100)).toBe(0);
    expect(fallDamage(4, 5, 100)).toBe(4);
    const cliff = mapFromRows(['....'], ['3300']);
    const s = bout(cliff, [unit('a', 0, { x: 0, y: 0 })], [unit('b', 1, { x: 1, y: 0 })]);
    const b = unitOf(s, 'b')!;
    b.c.hp = 2;
    pushUnit(s, 'a', 'b');
    expect(b.x).toBe(2);
    expect(b.c.hp).toBe(1);
    expect(b.c.major?.id).toBe('dizzy');
  });

  it('foes block the route; allies can be passed', () => {
    const lane = mapFromRows(['.....']);
    const r = reachable(lane, { x: 0, y: 0, move: 4, jump: 1, swimmer: false }, (x) =>
      x === 1 ? 1 : undefined,
    );
    expect(canEnd(r, 2, 0)).toBe(false);
    const r2 = reachable(lane, { x: 0, y: 0, move: 4, jump: 1, swimmer: false }, (x) =>
      x === 1 ? 0 : undefined,
    );
    expect(canEnd(r2, 2, 0)).toBe(true);
    expect(canEnd(r2, 1, 0)).toBe(false);
  });
});

describe('CT turn order (R0246)', () => {
  const open = mapFromRows(['........', '........', '........', '........']);

  it('a Zip-20 unit acts twice as often as a Zip-10 one', () => {
    const fast = unit('fast', 0, { x: 0, y: 0 });
    const slow = unit('slow', 1, { x: 7, y: 3 });
    fast.c.zip = 20;
    slow.c.zip = 10;
    const s = bout(open, [fast], [slow]);
    const count = { fast: 0, slow: 0 };
    for (let t = 0; t < 300 && !s.result; t++) {
      count[s.active as 'fast' | 'slow'] += 1;
      tacticsAct(s, { k: 'wait', face: 's' });
    }
    expect(Math.abs(count.fast - 2 * count.slow)).toBeLessThanOrEqual(2);
  });

  it('Wait alone keeps 40 CT; moving and acting keep none', () => {
    const s = bout(open, [unit('a', 0, { x: 0, y: 0 })], [unit('b', 1, { x: 1, y: 0 })]);
    const u = unitOf(s, s.active)!;
    const other = s.units.find((v) => v !== u)!;
    other.ct = 100; // the next turn starts at once, so no tick adds CT in between
    tacticsAct(s, { k: 'wait', face: 's' });
    expect(u.ct).toBe(40);
    const s2 = bout(open, [unit('a', 0, { x: 0, y: 0 })], [unit('b', 1, { x: 1, y: 0 })]);
    const v = unitOf(s2, s2.active)!;
    const w = s2.units.find((x) => x !== v)!;
    expect(tacticsAct(s2, { k: 'act', move: 'bonk', x: w.x, y: w.y })).toBe(true);
    w.ct = 100;
    w.c.hp = Math.max(1, w.c.hp);
    tacticsAct(s2, { k: 'wait', face: 'e' });
    expect(v.ct).toBe(20);
  });

  it('a charged move hits whoever stepped into its tile', () => {
    const s = bout(open, [unit('a', 0, { x: 0, y: 1 })], [unit('b', 1, { x: 6, y: 1 })]);
    expect(gridOf({ ...moveById('pounce')!, power: 95 }).ct).toBe(3);
    s.charges.push({ by: 'a', move: 'bonk', x: 3, y: 1, left: 40 });
    const b = unitOf(s, 'b')!;
    b.x = 3;
    for (let t = 0; t < 20 && s.charges.length; t++) tacticsAct(s, { k: 'wait', face: 'w' });
    expect(s.charges).toHaveLength(0);
    expect(
      s.log.some((e) => (e.k === 'hit' || e.k === 'miss') && e.by === 'a' && e.to === 'b'),
    ).toBe(true);
  });

  it('the turn strip lists the next eight actors', () => {
    const s = bout(open, [unit('a', 0, { x: 0, y: 0 })], [unit('b', 1, { x: 7, y: 3 })]);
    const strip = turnStrip(s);
    expect(strip).toHaveLength(8);
    expect(strip[0]!.id).toBe(s.active);
  });

  it('a move can be undone until the unit acts', () => {
    const s = bout(open, [unit('a', 0, { x: 0, y: 0 })], [unit('b', 1, { x: 7, y: 3 })]);
    s.ai = [null, 'keeper'];
    const u = unitOf(s, s.active)!;
    const x0 = u.x;
    const to = reachOf(s, u).tiles[1]!;
    expect(tacticsAct(s, { k: 'move', x: to.x, y: to.y })).toBe(true);
    expect(tacticsAct(s, { k: 'undo' })).toBe(true);
    expect(u.x).toBe(x0);
    expect(tacticsAct(s, { k: 'move', x: to.x, y: to.y })).toBe(true);
    tacticsAct(s, { k: 'wait', face: 'n' });
    expect(tacticsAct(s, { k: 'undo' })).toBe(false);
  });
});

describe('facing and height (R0247)', () => {
  it('reads all four relative facings', () => {
    const t = { x: 2, y: 2 };
    const face: Dir = 'n';
    expect(sideOf({ x: 2, y: 1 }, t, face)).toBe('front');
    expect(sideOf({ x: 2, y: 3 }, t, face)).toBe('back');
    expect(sideOf({ x: 1, y: 2 }, t, face)).toBe('side');
    expect(sideOf({ x: 3, y: 2 }, t, face)).toBe('side');
    expect(facingMult('back')).toBe(1.35);
    expect(facingMult('back', true)).toBe(1.5);
    expect(facingMult('side')).toBe(1.15);
  });

  it('height deltas -3..+3 give ±8% a level', () => {
    const want = [-0.24, -0.16, -0.08, 0, 0.08, 0.16, 0.24];
    for (let dh = -3; dh <= 3; dh++) expect(heightMult(dh)).toBeCloseTo(1 + want[dh + 3]!, 10);
    expect(heightMult(5)).toBeCloseTo(1.24, 10);
  });

  it('the preview equals the resolved hit for the same roll', () => {
    const hill = mapFromRows(['....', '....'], ['2100', '0000']);
    const s = bout(hill, [unit('a', 0, { x: 0, y: 0 })], [unit('b', 1, { x: 1, y: 0 })]);
    s.active = 'a';
    s.acted = false;
    const a = unitOf(s, 'a')!;
    const b = unitOf(s, 'b')!;
    b.face = 'e'; // a stands behind it
    const def = moveById('bonk')!;
    const h = hitMult(s, a, b, def);
    expect(h.side).toBe('back');
    expect(h.dh).toBe(1);
    const shown = preview(s, 'bonk', b, 1.05)[0]!;
    expect(shown.dmg).toBe(damageWith(a.c, b.c, def, false, 1.05, h.mult).dmg);
    // Resolve with the same dice: land, crit, then the spread roll.
    const rng = new Rng(s.rngState);
    const lands = rng.chance(1);
    const crit = rng.chance(BATTLE.damage.critChance);
    const roll = rng.float(...BATTLE.damage.spread);
    const want = preview(s, 'bonk', b, roll)[0]!.dmg;
    const hp0 = b.c.hp;
    tacticsAct(s, { k: 'act', move: 'bonk', x: 1, y: 0 });
    expect(lands).toBe(true);
    if (!crit) expect(hp0 - b.c.hp).toBe(Math.min(hp0, want));
  });

  it('turn-mode damage is unchanged by the refactor', () => {
    const a = unit('a', 0, { x: 0, y: 0 }).c;
    const b = unit('b', 1, { x: 1, y: 0 }).c;
    const def = moveById('bonk')!;
    const r1 = new Rng(42);
    const got = moveDamage(r1, a, b, def);
    const r2 = new Rng(42);
    const crit = r2.chance(BATTLE.damage.critChance);
    expect(got.crit).toBe(crit);
    expect(got.dmg).toBe(damageWith(a, b, def, crit, r2.float(...BATTLE.damage.spread)).dmg);
  });
});

describe('ranged arcs and lines (R0250)', () => {
  const wall = mapFromRows(['.#..'], ['0100']);

  it('an arc clears a 1-height wall; a line shot is blocked', () => {
    const lob = gridOf({ ...moveById('bonk')!, kind: 'splash', target: 'foe' });
    expect(lob.shot).toBe('arc');
    expect(canAim(wall, { x: 0, y: 0 }, { x: 2, y: 0 }, lob, 1, false)).toBe(true);
    const line = { ...lob, shot: 'line' as const, aoe: 'line2' as const };
    expect(canAim(wall, { x: 0, y: 0 }, { x: 2, y: 0 }, line, 1, false)).toBe(false);
    const tall = mapFromRows(['.#..'], ['0300']);
    expect(canAim(tall, { x: 0, y: 0 }, { x: 2, y: 0 }, lob, 1, false)).toBe(false);
  });

  it('tall grass hides a unit beyond three tiles', () => {
    const grass = mapFromRows(['....."']);
    const lob = {
      ...gridOf({ ...moveById('bonk')!, kind: 'splash' }),
      range: [1, 6] as [number, number],
    };
    expect(canAim(grass, { x: 1, y: 0 }, { x: 5, y: 0 }, lob, 1, false)).toBe(false);
    expect(canAim(grass, { x: 2, y: 0 }, { x: 5, y: 0 }, lob, 1, false)).toBe(true);
  });

  it('two friends at 60 can call Together!, at 59 they cannot', () => {
    const open = mapFromRows(['.....', '.....']);
    const mk = (score: number) => {
      const a = unit('a', 0, { x: 0, y: 0 });
      const b = unit('b', 0, { x: 1, y: 1 });
      a.friends = { b: score };
      const s = bout(open, [a, b], [unit('f', 1, { x: 1, y: 0 })]);
      s.active = 'a';
      s.acted = false;
      unitOf(s, 'a')!.c.puff = 6;
      unitOf(s, 'b')!.c.puff = 6;
      return s;
    };
    const s60 = mk(60);
    const hp = unitOf(s60, 'f')!.c.hp;
    expect(tacticsAct(s60, { k: 'together', with: 'b', x: 1, y: 0 })).toBe(true);
    expect(s60.log.some((e) => e.k === 'combo')).toBe(true);
    expect(unitOf(s60, 'f')!.c.hp).toBeLessThanOrEqual(hp);
    expect(tacticsAct(mk(59), { k: 'together', with: 'b', x: 1, y: 0 })).toBe(false);
  });

  it('the AI calls Together! when a friend at 60 stands beside it', () => {
    const open = mapFromRows(['.....', '.....', '.....']);
    const a = unit('a', 0, { x: 0, y: 0 }, { type: 'run' });
    const b = unit('b', 0, { x: 1, y: 1 }, { type: 'power' });
    a.friends = { b: 90 };
    const s = bout(open, [a, b], [unit('f', 1, { x: 1, y: 0 })], { ai: ['champion', null] });
    s.active = 'a';
    s.acted = false;
    s.moved = false;
    unitOf(s, 'a')!.c.puff = 8;
    unitOf(s, 'b')!.c.puff = 8;
    suggestHook(s);
    expect(s.log.some((e) => e.k === 'combo')).toBe(true);
  });

  it('a champion species carries an extra grid move', () => {
    const u = unitFromLevels({ id: 'x', side: 1, species: 'chao', level: 10 });
    const s = bout(
      mapFromRows(['....']),
      [unit('a', 0, { x: 0, y: 0 })],
      [{ ...u, bonus: 'lullaby' }],
    );
    expect(movesOf(unitOf(s, 'x')!)).toContain('lullaby');
  });
});
