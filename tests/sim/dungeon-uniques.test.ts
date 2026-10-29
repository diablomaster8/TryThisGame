import { describe, expect, it } from 'vitest';
import { ACTS, actStartDepth } from '../../src/config/dungeon-acts';
import { UNIQUES } from '../../src/config/dungeon-foes';
import { UNIQUE_TEXT } from '../../src/config/strings-dungeon';
import { WALL, type Floor } from '../../src/sim/dungeon';
import { actFloor } from '../../src/sim/dungeon-acts';
import { uniqueBeaten } from '../../src/sim/dungeon-uniques';
import { hatch } from '../../src/sim/lifecycle';
import { deserialize, serialize } from '../../src/sim/save';
import type { SimEvent } from '../../src/sim/types';
import { applyCommand, createWorld } from '../../src/sim/world';

// Lane B round 4: the named uniques (R0156).

function reach(f: Floor): Uint8Array {
  const seen = new Uint8Array(f.cols * f.rows);
  const q = [f.stairsUp];
  seen[f.stairsUp.y * f.cols + f.stairsUp.x] = 1;
  for (let i = 0; i < q.length; i++) {
    const c = q[i]!;
    for (const [dx, dy] of [
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1],
    ] as const) {
      const x = c.x + dx;
      const y = c.y + dy;
      if (x < 0 || y < 0 || x >= f.cols || y >= f.rows) continue;
      const k = y * f.cols + x;
      if (seen[k] || f.cells[k] === WALL) continue;
      seen[k] = 1;
      q.push({ x, y });
    }
  }
  return seen;
}

describe('named uniques (R0156)', () => {
  it('have unique, short names and a caption, three per act, never on a boss level', () => {
    const names = UNIQUES.map((u) => UNIQUE_TEXT[u.id]?.name ?? '');
    expect(new Set(names).size).toBe(UNIQUES.length);
    for (const n of names) {
      expect(n.length).toBeGreaterThan(0);
      expect(n.length).toBeLessThanOrEqual(22);
    }
    for (const u of UNIQUES) expect(UNIQUE_TEXT[u.id]!.line.length).toBeLessThanOrEqual(100);
    ACTS.forEach((act, i) => {
      const mine = UNIQUES.filter((u) => u.act === i);
      expect(mine).toHaveLength(3);
      for (const u of mine) expect(u.level).toBeLessThan(act.levels.length);
    });
  });

  it('every unique spawns on its level, reachable, in every seed', { timeout: 60_000 }, () => {
    for (let s = 1; s <= 30; s++) {
      const seed = s * 7_919;
      for (const u of UNIQUES) {
        const f = actFloor(seed, u.act, actStartDepth(u.act) + u.level - 1, 4);
        const p = f.packs?.find((x) => x.unique === u.id);
        expect(p, `${u.id} seed ${seed}`).toBeDefined();
        expect(p!.kind).toBe('unique');
        expect(p!.members[0]!.mods).toEqual(u.mods);
        expect(p!.members).toHaveLength(1 + u.minions);
        expect(reach(f)[p!.cell.y * f.cols + p!.cell.x]).toBe(1);
        expect(new Set(f.packs!.map((x) => x.id)).size).toBe(f.packs!.length);
      }
    }
  });

  it('pays its bonus on the first win only, and the record survives a save', () => {
    const world = createWorld(5, 0);
    for (const n of world.nubbins) hatch(n, [], 0);
    applyCommand(world, { kind: 'enterAct', act: 0 }, []);
    const run = world.dungeon!;
    const f = actFloor(run.seed, 0, actStartDepth(0), 4);
    const pack = f.packs!.find((p) => p.unique === 'sir-snorts')!;
    const shells = world.inventory.shells;
    const events: SimEvent[] = [];
    expect(uniqueBeaten(world, run, pack, events)).toBe(40);
    expect(uniqueBeaten(world, run, pack, events)).toBe(0);
    expect(world.inventory.shells).toBe(shells + 40);
    expect(events.map((e) => e.kind)).toEqual(['uniqueBeaten', 'uniqueBeaten']);
    const back = deserialize(serialize(world, 0)).world;
    expect(back.hollow.uniquesBeaten).toEqual(['sir-snorts']);
  });
});
