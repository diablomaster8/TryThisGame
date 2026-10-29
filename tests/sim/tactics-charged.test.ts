import { describe, expect, it } from 'vitest';
import type { BattleContext } from '../../src/sim/battle/types';
import { aiTurn } from '../../src/sim/battle/tactics/ai';
import { CHARGED_MOVES, shapedTiles } from '../../src/sim/battle/tactics/charged';
import {
  chargeTiles,
  createTactics,
  movesOf,
  tacticsAct,
  unitOf,
  type UnitSeed,
} from '../../src/sim/battle/tactics/engine';
import { mapFromRows } from '../../src/sim/battle/tactics/map';
import type { GridMap, TacticsState } from '../../src/sim/battle/tactics/types';
import { unitFromLevels } from '../../src/sim/battle/tactics/units';

const ctx: BattleContext = { kind: 'dojo', tier: 1, ids: [] };
const unit = (id: string, side: 0 | 1, at: { x: number; y: number }, more = {}): UnitSeed =>
  unitFromLevels({ id, side, species: 'chao', level: 20, at, type: 'normal', ...more });
const bout = (map: GridMap, allies: UnitSeed[], foes: UnitSeed[]) =>
  createTactics({ seed: 11, map, allies, foes, context: ctx, ai: [null, null] });

/** Ends turns (facing north) until no charge is pending. */
function runCharges(s: TacticsState): void {
  for (let i = 0; i < 200 && s.charges.length && !s.result; i++)
    if (s.active) tacticsAct(s, { k: 'wait', face: 'n' });
}

describe('charged moves (R0267)', () => {
  it('has about eight, each winding up 10 to 30 ticks, grid only', () => {
    expect(CHARGED_MOVES.length).toBe(8);
    for (const m of CHARGED_MOVES) {
      expect(m.gridOnly).toBe(true);
      expect(m.grid.ct).toBeGreaterThanOrEqual(10);
      expect(m.grid.ct).toBeLessThanOrEqual(30);
    }
  });

  it('every job brings its charged move to the grid', () => {
    const s = bout(
      mapFromRows(['....']),
      [unit('a', 0, { x: 0, y: 0 })],
      [unit('f', 1, { x: 3, y: 0 })],
    );
    const a = unitOf(s, 'a')!;
    a.job = 'bonker';
    expect(movesOf(a)).toContain('mega-belly-flop');
  });

  it('a charge resolves on the right tick and hits whoever stands there then', () => {
    const map = mapFromRows(['.......', '.......', '.......']);
    const s = bout(
      map,
      [unit('a', 0, { x: 0, y: 1 })],
      [unit('f', 1, { x: 3, y: 1 }), unit('g', 1, { x: 6, y: 0 })],
    );
    s.active = 'a';
    s.acted = false;
    s.moved = false;
    const a = unitOf(s, 'a')!;
    a.job = 'bonker';
    a.c.puff = 9;
    expect(tacticsAct(s, { k: 'act', move: 'mega-belly-flop', x: 2, y: 1 })).toBe(true);
    const at = s.tick;
    expect(s.charges[0]!.left).toBe(20);
    // The dashed outline covers the ring round the target.
    expect(chargeTiles(s).length).toBe(9);
    // f steps into the ring, g stays clear.
    unitOf(s, 'f')!.x = 2;
    unitOf(s, 'f')!.y = 2;
    const hp = unitOf(s, 'f')!.c.hp;
    const ghp = unitOf(s, 'g')!.c.hp;
    tacticsAct(s, { k: 'wait', face: 'e' });
    runCharges(s);
    const hit = s.log.find((e) => e.k === 'hit' && e.move === 'mega-belly-flop');
    const miss = s.log.find((e) => e.k === 'miss' && e.by === 'a');
    expect(hit ?? miss).toBeTruthy();
    if (hit) expect(unitOf(s, 'f')!.c.hp).toBeLessThan(hp);
    expect(unitOf(s, 'g')!.c.hp).toBe(ghp);
    // Resolved 20 ticks after it was declared (one tick per CT step).
    expect(s.tick - at).toBeGreaterThanOrEqual(20);
    // Mega Belly Flop lands the user on its target tile.
    expect([unitOf(s, 'a')!.x, unitOf(s, 'a')!.y]).toEqual([2, 1]);
  });

  it('line4 runs four tiles and stops at a wall; scatter3 is the same every time', () => {
    const map = mapFromRows(['......', '...#..', '......']);
    const kazoo = CHARGED_MOVES.find((m) => m.id === 'kazoo-symphony')!;
    expect(shapedTiles(map, { x: 0, y: 0 }, { x: 1, y: 0 }, kazoo, 1)).toHaveLength(4);
    expect(shapedTiles(map, { x: 0, y: 1 }, { x: 1, y: 1 }, kazoo, 1)).toHaveLength(2);
    const snow = CHARGED_MOVES.find((m) => m.id === 'snowball-barrage')!;
    const one = shapedTiles(map, { x: 0, y: 0 }, { x: 3, y: 2 }, snow, 9);
    expect(one).toHaveLength(3);
    expect(shapedTiles(map, { x: 0, y: 0 }, { x: 3, y: 2 }, snow, 9)).toEqual(one);
  });

  it('a Keeper-level foe steps out of a charge outline', () => {
    const map = mapFromRows(['........', '........', '........']);
    const s = createTactics({
      seed: 3,
      map,
      allies: [unit('a', 0, { x: 0, y: 1 })],
      foes: [unit('f', 1, { x: 3, y: 1 })],
      context: ctx,
      ai: [null, 'keeper'],
    });
    s.charges = [{ by: 'a', move: 'mega-belly-flop', x: 3, y: 1, left: 30 }];
    unitOf(s, 'a')!.job = 'bonker';
    s.active = 'f';
    s.acted = false;
    s.moved = false;
    aiTurn(s);
    const f = unitOf(s, 'f')!;
    expect(Math.max(Math.abs(f.x - 3), Math.abs(f.y - 1))).toBeGreaterThan(1);
  });
});
