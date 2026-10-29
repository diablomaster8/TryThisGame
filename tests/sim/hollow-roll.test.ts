import { describe, expect, it } from 'vitest';
import { SIM } from '../../src/config/tuning';
import { cellCentre, CHASM, FLOOR, runFloor, type Floor } from '../../src/sim/dungeon';
import { keeperRoll } from '../../src/sim/keeper';
import { hatch } from '../../src/sim/lifecycle';
import type { SimEvent } from '../../src/sim/types';
import { applyCommand, createWorld, stepWorld } from '../../src/sim/world';

// Round 4 live bug: MOVE-64 turned a running jump toward the camera into a roll, and in the
// Hollow a roll does nothing, so a chasm faced toward the camera could not be jumped.

/** A dry cell with a chasm cell on its +z side (toward a camera at yaw 0). */
function lip(f: Floor): { x: number; y: number } | null {
  for (let y = 0; y < f.rows - 1; y++)
    for (let x = 0; x < f.cols; x++)
      if (f.cells[y * f.cols + x] === FLOOR && f.cells[(y + 1) * f.cols + x] === CHASM)
        return { x, y };
  return null;
}

describe('no roll in the Hollow', () => {
  it('a running jump toward the camera at a chasm lip jumps', () => {
    for (let seed = 8; seed < 40; seed++) {
      const world = createWorld(seed, 0);
      const events: SimEvent[] = [];
      for (const n of world.nubbins) hatch(n, events, 0);
      world.inventory.shells = 55;
      applyCommand(world, { kind: 'enterDungeon', daily: false }, events);
      const run = world.dungeon!;
      run.depth = 4;
      run.graceUntilMs = 1e12;
      const f = runFloor(world)!;
      const at = lip(f);
      if (!at) continue;
      const k = world.keeper;
      k.pos = cellCentre(f, at);
      stepWorld(world, SIM.stepMs);
      world.viewYaw = 0;
      k.input = { x: 0, z: 1 };
      k.running = true;
      k.grounded = true;
      const ev: SimEvent[] = [];
      applyCommand(world, { kind: 'jump', down: true }, ev);
      ev.push(...stepWorld(world, SIM.stepMs));
      expect(ev.some((e) => e.kind === 'keeperRolled')).toBe(false);
      expect(keeperRoll(world)).toBeNull();
      expect(ev.some((e) => e.kind === 'keeperJumped')).toBe(true);
      expect(k.grounded).toBe(false);
      return;
    }
    throw new Error('no floor with a chasm south of dry ground');
  });

  it('a roll command does nothing underground', () => {
    const world = createWorld(8, 0);
    const events: SimEvent[] = [];
    for (const n of world.nubbins) hatch(n, events, 0);
    world.inventory.shells = 55;
    applyCommand(world, { kind: 'enterDungeon', daily: false }, events);
    const ev: SimEvent[] = [];
    applyCommand(world, { kind: 'roll' }, ev);
    expect(ev.some((e) => e.kind === 'keeperRolled')).toBe(false);
  });
});
