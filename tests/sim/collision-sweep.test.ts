/**
 * Headless collision sweep (R0039, MOVE-39), so art passes cannot bring back walk-throughs:
 * stick walks from an 8 u grid in 8 directions never put the Keeper's centre inside
 * anything that stops it, and 200 seeded taps arrive (at the target, or at the stand-in
 * for a shut-in one) at least 99% of the time. The Hollow's taps are swept in
 * `dungeon-nav.test.ts`. About 3 s alone; the 20 s timeouts only keep it steady when the
 * machine is busy.
 */
import { describe, expect, it } from 'vitest';
import { SIM } from '../../src/config/tuning';
import { keeperFooting, updateKeeper } from '../../src/sim/keeper';
import { blocked } from '../../src/sim/obstacles';
import { Rng } from '../../src/sim/rng';
import { applyCommand, createWorld, stepWorld } from '../../src/sim/world';
import type { Vec2, World } from '../../src/sim/types';

const SUB = 1000 / 60;
const EDGE = SIM.worldHalf - 2;

function bare(): World {
  const w = createWorld(1, 0);
  w.nubbins = [];
  return w;
}

function standAt(w: World, p: Vec2): void {
  w.keeper.pos = { ...p };
  w.keeper.y = keeperFooting(w, p.x, p.z).y;
  w.keeper.vy = 0;
  w.keeper.grounded = true;
  w.keeper.moveTarget = null;
  w.keeper.intent = null;
}

describe('collision sweep (MOVE-39)', () => {
  it('stick walks from an 8 u grid in 8 directions never end up inside a solid', () => {
    const w = bare();
    const inside: string[] = [];
    for (let x = -EDGE; x <= EDGE; x += 8)
      for (let z = -EDGE; z <= EDGE; z += 8) {
        if (blocked({ x, z }, w, 0.35)) continue;
        for (let d = 0; d < 8; d++) {
          const a = (d * Math.PI) / 4;
          standAt(w, { x, z });
          w.keeper.input = { x: Math.cos(a), z: Math.sin(a) };
          for (let s = 0; s < 90; s++) {
            updateKeeper(w, SUB, []);
            const k = w.keeper;
            if (blocked(k.pos, w, 0, 'keeper', k.y)) {
              inside.push(`${x},${z} dir ${d}: ${k.pos.x.toFixed(2)},${k.pos.z.toFixed(2)}`);
              break;
            }
          }
          w.keeper.input = { x: 0, z: 0 };
        }
      }
    expect(inside).toEqual([]);
  }, 20_000);

  it('99% of 200 seeded taps arrive', () => {
    const rng = new Rng(2710);
    const w = bare();
    const point = (): Vec2 => ({
      x: (rng.next() * 2 - 1) * (EDGE - 4),
      z: (rng.next() * 2 - 1) * (EDGE - 4),
    });
    let arrived = 0;
    const stuck: string[] = [];
    for (let i = 0; i < 200; i++) {
      let from = point();
      while (blocked(from, w, 0.4)) from = point();
      const to = point();
      standAt(w, from);
      applyCommand(w, { kind: 'moveKeeperTo', pos: to }, []);
      let s = 0;
      for (; s < 600 && w.keeper.moveTarget; s++) stepWorld(w, SIM.stepMs);
      if (!w.keeper.moveTarget) arrived++;
      else
        stuck.push(
          `${from.x.toFixed(1)},${from.z.toFixed(1)} → ${to.x.toFixed(1)},${to.z.toFixed(1)}`,
        );
    }
    expect(arrived, stuck.join('; ')).toBeGreaterThanOrEqual(198);
  }, 20_000);
});
