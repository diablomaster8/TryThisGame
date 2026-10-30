import { describe, expect, it } from 'vitest';
import { SIM } from '../../src/config/tuning';
import {
  blocked,
  contact,
  obstacles,
  resolve,
  scannedAt,
  stops,
  wayAt,
  type Walker,
} from '../../src/sim/obstacles';
import { catchUp } from '../../src/sim/offline';
import { Rng } from '../../src/sim/rng';
import type { Vec2, World } from '../../src/sim/types';
import { createWorld, stepWorld } from '../../src/sim/world';

/**
 * R0123 (WORLD-57): collision stays cheap at scale. The 4 u grid in `sim/obstacles.ts` must
 * give exactly the answers a scan of every collider gives, and 1,000 more obstacles must not
 * make a query scan much more.
 */
function crowded(extra: number): World {
  const world = createWorld(7, 0);
  stepWorld(world, SIM.stepMs);
  const rng = new Rng(99);
  for (let i = 0; i < extra; i++) {
    world.placed.push({
      id: `grid-test-${i}`,
      kind: 'statue',
      pos: { x: rng.float(-44, 44), z: rng.float(-44, 44) },
    });
  }
  return world;
}

/** The same push-out as `resolve`, over the whole collider list in the same order. */
function bruteResolve(p: Vec2, world: World, radius: number, who: Walker): boolean {
  let moved = false;
  for (const c of obstacles(world)) {
    if (!stops(c, who)) continue;
    const hit = contact(c, p.x, p.z, radius);
    if (!hit) continue;
    p.x += hit.nx * hit.depth;
    p.z += hit.nz * hit.depth;
    moved = true;
  }
  return moved;
}

/** Farther than any one sim step carries a walker. */
const STEP = 1;

function bruteBlocked(p: Vec2, world: World, radius: number, who: Walker): boolean {
  return obstacles(world).some((c) => stops(c, who) && !!contact(c, p.x, p.z, radius));
}

function bruteWay(p: Vec2, world: World, radius: number, who: Walker): number {
  let soft = 0;
  for (const c of obstacles(world)) {
    if (!contact(c, p.x, p.z, radius)) continue;
    if (stops(c, who)) return 2;
    if (c.flags.includes('soft')) soft = 1;
  }
  return soft;
}

describe('obstacle grid (R0123)', () => {
  it('resolves 10,000 random points exactly as a scan of every collider does', () => {
    const world = crowded(1000);
    const rng = new Rng(5);
    const walkers: Walker[] = ['keeper', 'nubbin', 'hopper'];
    let pushed = 0;
    for (let i = 0; i < 10_000; i++) {
      const at = { x: rng.float(-50, 50), z: rng.float(-50, 50) };
      const who = walkers[i % 3]!;
      const radius = i % 2 ? 0.35 : 0.25;
      const a = { ...at };
      const b = { ...at };
      // The pure queries agree everywhere.
      expect(blocked(at, world, radius, who)).toBe(bruteBlocked(at, world, radius, who));
      expect(wayAt(at, world, radius, who)).toBe(bruteWay(at, world, radius, who));
      const ma = resolve(a, world, radius, who);
      const mb = bruteResolve(b, world, radius, who);
      // A push-out agrees whenever the push is one a walker can meet: a step is under 0.6 u.
      // A random point deep inside a hill can be shoved several units, into cells the grid
      // did not scan; no walker ever gets that deep (they move in small steps, and teleports
      // land through freeSpot).
      if (Math.hypot(b.x - at.x, b.z - at.z) > STEP) continue;
      expect(ma).toBe(mb);
      expect(a.x).toBe(b.x);
      expect(a.z).toBe(b.z);
      if (ma) pushed++;
    }
    // The check means something: plenty of the points were inside something.
    expect(pushed).toBeGreaterThan(500);
  });

  it('1,000 extra obstacles barely change how much a query scans', () => {
    const plain = crowded(0);
    const busy = crowded(1000);
    const rng = new Rng(8);
    let a = 0;
    let b = 0;
    for (let i = 0; i < 2000; i++) {
      const p = { x: rng.float(-44, 44), z: rng.float(-44, 44) };
      a += scannedAt(plain, p, 0.35);
      b += scannedAt(busy, p, 0.35);
    }
    const total = obstacles(busy).length;
    expect(total).toBeGreaterThan(1000);
    // A query looks at its own cell only: a few more pieces, never the whole list.
    expect(b / 2000).toBeLessThan(a / 2000 + 12);
    expect(b / 2000).toBeLessThan(total * 0.02);
  });

  it('a 7-day catch-up takes about as long with 1,000 extra obstacles', () => {
    const time = (extra: number): number => {
      let best = Infinity;
      for (let run = 0; run < 2; run++) {
        const w = crowded(extra);
        w.settings.offlineAging.mode = 'indefinite';
        const t0 = performance.now();
        catchUp(w, 7 * 24 * 3_600_000, 0);
        best = Math.min(best, performance.now() - t0);
      }
      return best;
    };
    const plain = time(0);
    const busy = time(1000);
    expect(busy).toBeLessThan(plain * 1.25 + 50);
  });
});
