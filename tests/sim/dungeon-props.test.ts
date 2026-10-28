import { describe, expect, it } from 'vitest';
import { DUNGEON } from '../../src/config/tuning';
import { floorOf, isWalkable, resolveDungeon, type Floor } from '../../src/sim/dungeon';
import { navMask } from '../../src/sim/dungeon-nav';
import { floorProps, propCells } from '../../src/sim/dungeon-props';
import { Rng } from '../../src/sim/rng';

// R0032: the landmark is solid and closes its nav cells.

function floorsWithLandmarks(): Floor[] {
  const out: Floor[] = [];
  for (let s = 1; out.length < 12 && s < 400; s++) {
    const f = floorOf(s * 7919, 2 + (s % 6));
    if (f.landmark && floorProps(f).some((p) => p.kind === 'landmark')) out.push(f);
  }
  return out;
}

/** Breadth-first reach over a mask from one cell. */
function reach(f: Floor, mask: Uint8Array, from: { x: number; y: number }): Uint8Array {
  const seen = new Uint8Array(f.cols * f.rows);
  const q = [from.y * f.cols + from.x];
  seen[q[0]!] = 1;
  for (let i = 0; i < q.length; i++) {
    const c = q[i]!;
    const x = c % f.cols;
    const y = (c - x) / f.cols;
    for (const [dx, dy] of [
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1],
    ] as const) {
      const nx = x + dx;
      const ny = y + dy;
      if (nx < 0 || ny < 0 || nx >= f.cols || ny >= f.rows) continue;
      const j = ny * f.cols + nx;
      if (seen[j] || !mask[j]) continue;
      seen[j] = 1;
      q.push(j);
    }
  }
  return seen;
}

describe('solid Hollow set pieces (R0032)', () => {
  const floors = floorsWithLandmarks();

  it('finds a dozen floors with a landmark to test on', () => {
    expect(floors.length).toBe(12);
  });

  it('a sweep of seeded positions leaves no body inside a prop', () => {
    const rng = new Rng(7);
    let inside = 0;
    for (const f of floors) {
      const props = floorProps(f);
      for (let i = 0; i < 300; i++) {
        // Half the probes aim straight at a prop, the rest anywhere open.
        const prop = props[rng.int(0, props.length - 1)]!;
        const p =
          i % 2
            ? {
                x: prop.x + (rng.next() - 0.5) * prop.r,
                z: prop.z + (rng.next() - 0.5) * prop.r,
              }
            : {
                x: (rng.next() - 0.5) * f.cols * DUNGEON.cell,
                z: (rng.next() - 0.5) * f.rows * DUNGEON.cell,
              };
        resolveDungeon(p, f, 0.35);
        resolveDungeon(p, f, 0.35);
        if (props.some((c) => Math.hypot(p.x - c.x, p.z - c.z) < c.r + 0.35 - 1e-6)) inside++;
      }
    }
    expect(inside).toBe(0);
  });

  it('closes the landmark to the walker without cutting off the stairs or the chest', () => {
    for (const f of floors) {
      const cells = propCells(f);
      expect(cells.length).toBeGreaterThan(0);
      const mask = navMask(f, true);
      for (const i of cells) expect(mask[i]).toBe(0);
      // Reach over the plain walkable cells, then over the nav mask with the landmark shut.
      const plain = new Uint8Array(f.cols * f.rows);
      for (let y = 0; y < f.rows; y++)
        for (let x = 0; x < f.cols; x++) plain[y * f.cols + x] = isWalkable(f, x, y) ? 1 : 0;
      const before = reach(f, plain, f.stairsUp);
      const after = reach(f, mask, f.stairsUp);
      for (const c of [f.stairsDown, f.chest]) {
        if (!c) continue;
        const k = c.y * f.cols + c.x;
        if (before[k] && mask[k]) expect(after[k]).toBe(1);
      }
    }
  });
});
