import { describe, expect, it } from 'vitest';
import { DUNGEON, KEEPER, SIM } from '../../src/config/tuning';
import { astar, gridLineOfSight, stringPull } from '../../src/sim/astar';
import { cellAt, cellCentre, cellOf, FLOOR, runFloor, type Floor } from '../../src/sim/dungeon';
import { hatch } from '../../src/sim/lifecycle';
import { Rng } from '../../src/sim/rng';
import type { SimEvent } from '../../src/sim/types';
import { applyCommand, createWorld, stepWorld } from '../../src/sim/world';
import { bfs } from './dungeon-measure';

function grid(rows: string[]) {
  const width = rows[0]!.length;
  const height = rows.length;
  const open = (x: number, z: number) => rows[z]?.[x] === '.';
  return { width, height, open };
}

const xz = (i: number, w: number) => [i % w, Math.floor(i / w)] as const;

describe('astar', () => {
  it('finds the shortest path and goes round walls', () => {
    const g = grid(['.....', '.###.', '.....']);
    const p = astar(g.width, g.height, g.open, 0, 1, 4, 1)!;
    expect(p).not.toBeNull();
    expect(xz(p[0]!, g.width)).toEqual([0, 1]);
    expect(xz(p[p.length - 1]!, g.width)).toEqual([4, 1]);
    for (const i of p) expect(g.open(...xz(i, g.width))).toBe(true);
  });

  it('never cuts a wall corner diagonally', () => {
    // From (0,0) to (1,1) the diagonal squeezes past the wall at (1,0): not allowed.
    const g = grid(['.#', '..']);
    const p = astar(g.width, g.height, g.open, 0, 0, 1, 1)!;
    expect(p.map((i) => xz(i, g.width))).toEqual([
      [0, 0],
      [0, 1],
      [1, 1],
    ]);
    // Two diagonal walls with a gap only at the corner: no way through.
    const h = grid(['.#', '#.']);
    expect(astar(h.width, h.height, h.open, 0, 0, 1, 1)).toBeNull();
  });

  it('returns null when the goal is walled off, blocked, or past the cap', () => {
    const g = grid(['..#..', '..#..', '..#..']);
    expect(astar(g.width, g.height, g.open, 0, 0, 4, 0)).toBeNull();
    expect(astar(g.width, g.height, g.open, 0, 0, 2, 0)).toBeNull();
    const open = () => true;
    expect(astar(200, 200, open, 0, 0, 199, 199, { maxExpansions: 50 })).toBeNull();
    expect(astar(200, 200, open, 0, 0, 199, 199)).not.toBeNull();
  });

  it('string-pulls a path down to its turning points', () => {
    const g = grid(['.....', '####.', '.....']);
    const p = astar(g.width, g.height, g.open, 0, 0, 0, 2)!;
    const los = (ax: number, az: number, bx: number, bz: number) =>
      gridLineOfSight(g.open, ax, az, bx, bz);
    const pulled = stringPull(p, g.width, los).map((i) => xz(i, g.width));
    expect(pulled[0]).toEqual([0, 0]);
    expect(pulled[pulled.length - 1]).toEqual([0, 2]);
    expect(pulled.length).toBeLessThan(p.length);
    expect(pulled.length).toBeGreaterThanOrEqual(3);
  });
});

/** Dry cells the Keeper can reach from `from`, 8-connected without corner cutting. */
function dryReach(f: Floor, from: { x: number; y: number }): Array<{ x: number; y: number }> {
  const dry = (x: number, y: number) =>
    cellAt(f, x, y) === FLOOR ||
    f.crossings.some((c) => c.cells.some((q) => q.x === x && q.y === y));
  const seen = new Uint8Array(f.cols * f.rows);
  const out: Array<{ x: number; y: number }> = [];
  const stack = [from];
  seen[from.y * f.cols + from.x] = 1;
  while (stack.length) {
    const c = stack.pop()!;
    out.push(c);
    for (let dy = -1; dy <= 1; dy++)
      for (let dx = -1; dx <= 1; dx++) {
        const x = c.x + dx;
        const y = c.y + dy;
        if (!dry(x, y) || seen[y * f.cols + x]) continue;
        if (dx && dy && (!dry(x, c.y) || !dry(c.x, y))) continue;
        seen[y * f.cols + x] = 1;
        stack.push({ x, y });
      }
  }
  return out;
}

describe('Hollow tap-to-move', () => {
  it('arrives at every reachable tap: 12 seeds × 30 taps, party never stalls 2 s', () => {
    let taps = 0;
    let arrived = 0;
    let worstStallMs = 0;
    for (let seed = 1; seed <= 12; seed++) {
      const world = createWorld(seed, 0);
      const ev: SimEvent[] = [];
      for (const n of world.nubbins) hatch(n, ev, 0);
      applyCommand(world, { kind: 'enterDungeon', daily: false }, ev);
      const f = runFloor(world)!;
      const rng = new Rng(seed * 7919);
      const reach = dryReach(f, cellOf(f, world.keeper.pos));
      const stall = new Map<string, { at: { x: number; z: number }; ms: number }>();
      for (let t = 0; t < 30; t++) {
        const cell = reach[rng.int(0, reach.length - 1)]!;
        const goal = cellCentre(f, cell);
        applyCommand(world, { kind: 'moveKeeperTo', pos: goal }, ev);
        taps++;
        // Generous: twice the walk (by cells, so a mazy version-3 floor is not short-changed),
        // at least three times the straight line, plus a few seconds of detour.
        const d = Math.hypot(goal.x - world.keeper.pos.x, goal.z - world.keeper.pos.z);
        const here = cellOf(f, world.keeper.pos);
        const walk = bfs(f, here)[cell.y * f.cols + cell.x]! * DUNGEON.cell;
        const budget = (Math.max(d * 3, walk * 2) / KEEPER.speed) * 1000 + 4000;
        for (let ms = 0; ms < budget && world.keeper.moveTarget; ms += SIM.stepMs) {
          stepWorld(world, SIM.stepMs);
          for (const id of world.dungeon?.party ?? []) {
            const n = world.nubbins.find((x) => x.id === id)!;
            const far =
              Math.hypot(n.pos.x - world.keeper.pos.x, n.pos.z - world.keeper.pos.z) >
              DUNGEON.followDistance + 0.5;
            const s = stall.get(id);
            if (!far || n.behavior.state !== 'wander' || !s) {
              stall.set(id, { at: { ...n.pos }, ms: 0 });
            } else if (Math.hypot(n.pos.x - s.at.x, n.pos.z - s.at.z) > 0.25) {
              stall.set(id, { at: { ...n.pos }, ms: 0 });
            } else {
              s.ms += SIM.stepMs;
              worstStallMs = Math.max(worstStallMs, s.ms);
            }
          }
        }
        const end = Math.hypot(goal.x - world.keeper.pos.x, goal.z - world.keeper.pos.z);
        if (!world.keeper.moveTarget && end <= KEEPER.arriveRadius + 0.05) arrived++;
      }
    }
    expect(arrived).toBe(taps);
    expect(worstStallMs).toBeLessThan(2000);
    // Version-3 floors are bigger and mazier: the walks take longer to simulate.
  }, 30_000);
});
