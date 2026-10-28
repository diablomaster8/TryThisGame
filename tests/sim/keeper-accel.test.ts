/**
 * The Keeper's ground feel (R0020, MOVE-20): speed builds and falls in about a tenth of a
 * second, a reversal at speed skids, and a tap walk eases into where it stops.
 */
import { describe, expect, it } from 'vitest';
import { KEEPER, SIM } from '../../src/config/tuning';
import { KEEPER_ACCEL } from '../../src/config/tuning-sim';
import { keeperFooting, updateKeeper } from '../../src/sim/keeper';
import { applyCommand, createWorld, stepWorld } from '../../src/sim/world';
import type { SimEvent, World } from '../../src/sim/types';

const SUB = 1000 / 60;

function open(): World {
  const w = createWorld(1, 0);
  w.nubbins = [];
  // Open meadow east of the Grove's heart, nothing near.
  w.keeper.pos = { x: 26, z: 18 };
  w.keeper.y = keeperFooting(w, 26, 18).y;
  return w;
}

/** Speed over one substep, in units per second. */
function stepSpeed(w: World, events: SimEvent[] = []): number {
  const p = { ...w.keeper.pos };
  updateKeeper(w, SUB, events);
  return Math.hypot(w.keeper.pos.x - p.x, w.keeper.pos.z - p.z) / (SUB / 1000);
}

describe('Keeper acceleration (MOVE-20)', () => {
  it('reaches 95% of walking speed within 140 ms and stops within 110 ms', () => {
    const w = open();
    w.keeper.input = { x: 1, z: 0 };
    let t = 0;
    while (stepSpeed(w) < KEEPER.speed * 0.95) t += SUB;
    expect(t + SUB).toBeLessThanOrEqual(140);
    for (let i = 0; i < 30; i++) stepSpeed(w);
    w.keeper.input = { x: 0, z: 0 };
    t = 0;
    while (stepSpeed(w) > 1e-6) t += SUB;
    expect(t).toBeLessThanOrEqual(110);
    // Standing still again, it no longer drifts.
    const p = { ...w.keeper.pos };
    stepWorld(w, SIM.stepMs);
    expect(w.keeper.pos).toEqual(p);
  });

  it('skids once on a sharp reversal at speed, and not on a gentle turn', () => {
    const w = open();
    w.keeper.input = { x: 1, z: 0 };
    for (let i = 0; i < 30; i++) stepSpeed(w);
    const ev: SimEvent[] = [];
    w.keeper.input = { x: 1, z: 1 };
    for (let i = 0; i < 10; i++) stepSpeed(w, ev);
    expect(ev.filter((e) => e.kind === 'keeperSkid')).toHaveLength(0);
    w.keeper.input = { x: -1, z: -0.2 };
    for (let i = 0; i < 20; i++) stepSpeed(w, ev);
    expect(ev.filter((e) => e.kind === 'keeperSkid')).toHaveLength(1);
  });

  it('eases a tap walk in over its last stretch and still arrives', () => {
    const w = open();
    const to = { x: w.keeper.pos.x + 4, z: w.keeper.pos.z };
    applyCommand(w, { kind: 'moveKeeperTo', pos: to }, []);
    const speeds: number[] = [];
    for (let i = 0; i < 200 && w.keeper.moveTarget; i++) speeds.push(stepSpeed(w));
    expect(w.keeper.moveTarget).toBeNull();
    expect(Math.hypot(w.keeper.pos.x - to.x, w.keeper.pos.z - to.z)).toBeLessThanOrEqual(
      KEEPER.arriveRadius + 1e-6,
    );
    // Full pace mid-walk, slower over the last `arriveEase` units.
    expect(Math.max(...speeds)).toBeCloseTo(KEEPER.speed, 5);
    expect(speeds[speeds.length - 1]!).toBeLessThan(KEEPER.speed * 0.6);
    expect(KEEPER_ACCEL.arriveEase).toBeGreaterThan(KEEPER.arriveRadius);
  });
});
