import { describe, expect, it } from 'vitest';
import type { BattleContext } from '../../src/sim/battle/types';
import '../../src/sim/battle/tactics/ai';
import {
  advance,
  createTactics,
  movesOf,
  reachOf,
  tacticsAct,
  unitOf,
  type UnitSeed,
} from '../../src/sim/battle/tactics/engine';
import { keeperSeed } from '../../src/sim/battle/tactics/keeper-unit';
import { mapFromRows } from '../../src/sim/battle/tactics/map';
import { unitFromLevels } from '../../src/sim/battle/tactics/units';

const ctx: BattleContext = { kind: 'dojo', tier: 1, ids: [] };
const unit = (id: string, side: 0 | 1, at: { x: number; y: number }): UnitSeed =>
  unitFromLevels({ id, side, species: 'chao', level: 20, at, type: 'normal' });
const open = mapFromRows(['........', '........', '........', '........', '........']);

describe('the Keeper on the grid (R0266)', () => {
  it('the AI never picks the Keeper as a target, over many seeded bouts', () => {
    for (let seed = 1; seed <= 25; seed++) {
      const s = createTactics({
        seed,
        map: open,
        allies: [
          unit('a', 0, { x: 0, y: 0 }),
          unit('b', 0, { x: 0, y: 4 }),
          keeperSeed({ x: 1, y: 2 }),
        ],
        foes: [unit('f', 1, { x: 7, y: 1 }), unit('g', 1, { x: 7, y: 3 })],
        context: ctx,
        ai: ['keeper', 'champion'],
      });
      advance(s);
      const keeperHp = unitOf(s, 'keeper')!.c.hp;
      const aimed = s.log.some((e) => 'to' in e && e.to === 'keeper');
      expect(aimed).toBe(false);
      expect(unitOf(s, 'keeper')!.c.hp).toBe(keeperHp);
      // The bout still ends once one side's Nubbins are tuckered; the Keeper doesn't count.
      expect(s.result).not.toBeNull();
    }
  });

  it('foes pass through the Keeper but never stop on it', () => {
    const s = createTactics({
      seed: 2,
      map: mapFromRows(['.....']),
      allies: [unit('a', 0, { x: 0, y: 0 }), keeperSeed({ x: 2, y: 0 })],
      foes: [unit('f', 1, { x: 1, y: 0 })],
      context: ctx,
      ai: [null, null],
    });
    s.active = 'f';
    s.moved = false;
    s.acted = false;
    const r = reachOf(s, unitOf(s, 'f')!);
    const ends = [...r.tiles].map((c) => `${c.x}`);
    expect(ends).toContain('3');
    expect(ends).not.toContain('2');
  });

  it('Snack toss heals a quarter and uses a snack; Whistle swaps two allies', () => {
    const s = createTactics({
      seed: 4,
      map: open,
      allies: [
        unit('a', 0, { x: 0, y: 0 }),
        unit('b', 0, { x: 3, y: 3 }),
        keeperSeed({ x: 1, y: 1 }),
      ],
      foes: [unit('f', 1, { x: 7, y: 4 })],
      context: ctx,
      ai: [null, null],
    });
    const k = unitOf(s, 'keeper')!;
    const a = unitOf(s, 'a')!;
    a.c.hp = Math.round(a.c.maxHp / 2);
    s.active = 'keeper';
    s.moved = false;
    s.acted = false;
    expect(movesOf(k)).toEqual(['keeper-snack', 'keeper-cheer']);
    const before = a.c.hp;
    expect(tacticsAct(s, { k: 'act', move: 'keeper-snack', x: 0, y: 0 })).toBe(true);
    expect(a.c.hp).toBeGreaterThan(before);
    expect(k.snacks).toBe(2);
    s.acted = false;
    expect(tacticsAct(s, { k: 'whistle', a: 'a', b: 'b' })).toBe(true);
    expect([a.x, a.y]).toEqual([3, 3]);
    expect([unitOf(s, 'b')!.x, unitOf(s, 'b')!.y]).toEqual([0, 0]);
    // Out of reach, or a foe, is refused.
    s.acted = false;
    expect(tacticsAct(s, { k: 'whistle', a: 'a', b: 'f' })).toBe(false);
  });
});
