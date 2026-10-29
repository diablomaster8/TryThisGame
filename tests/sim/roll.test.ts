import { describe, expect, it } from 'vitest';
import { ROLL } from '../../src/config/tuning-move';
import { keeperFooting, keeperRoll, updateKeeper } from '../../src/sim/keeper';
import { applyCommand, createWorld } from '../../src/sim/world';
import type { SimEvent, World } from '../../src/sim/types';

// MOVE-64: the Keeper's roll: 2 u in 0.35 s, cancellable into a jump, with a cooldown.

const SUB = 1000 / 60;

function open(): World {
  const w = createWorld(1, 0);
  w.nubbins = [];
  // Open meadow west of the start, facing west.
  w.keeper.pos = { x: -20, z: -2 };
  w.keeper.y = keeperFooting(w, -20, -2).y;
  w.keeper.facing = -Math.PI / 2;
  return w;
}

const sub = (w: World, n: number, ev: SimEvent[] = []): SimEvent[] => {
  for (let i = 0; i < n; i++) updateKeeper(w, SUB, ev);
  return ev;
};

describe('the roll (MOVE-64)', () => {
  it('travels 2 u in 0.35 s along its heading, then stops', () => {
    const w = open();
    const ev: SimEvent[] = [];
    applyCommand(w, { kind: 'roll' }, ev);
    expect(ev).toContainEqual({ kind: 'keeperRolled' });
    const x0 = w.keeper.pos.x;
    sub(w, Math.round(ROLL.ms / SUB) + 1);
    expect(keeperRoll(w)).toBeNull();
    expect(x0 - w.keeper.pos.x).toBeGreaterThan(ROLL.dist - 0.15);
    expect(x0 - w.keeper.pos.x).toBeLessThan(ROLL.dist + 0.15);
    expect(w.keeper.grounded).toBe(true);
  });

  it('a jump mid-roll cancels into the jump at once', () => {
    const w = open();
    applyCommand(w, { kind: 'roll' }, []);
    sub(w, 6);
    expect(keeperRoll(w)).not.toBeNull();
    const ev: SimEvent[] = [];
    applyCommand(w, { kind: 'jump', down: true }, ev);
    sub(w, 1, ev);
    expect(keeperRoll(w)).toBeNull();
    expect(ev.some((e) => e.kind === 'keeperJumped')).toBe(true);
    expect(w.keeper.grounded).toBe(false);
  });

  it('waits out its cooldown, and a running jump pulled toward the camera rolls', () => {
    const w = open();
    applyCommand(w, { kind: 'roll' }, []);
    sub(w, 30);
    w.timeMs += 100;
    const ev: SimEvent[] = [];
    applyCommand(w, { kind: 'roll' }, ev);
    expect(ev).toEqual([]);
    w.timeMs += ROLL.cooldownMs;
    // The camera at yaw 0 sits toward +z: pulling the stick that way, running, rolls.
    applyCommand(w, { kind: 'viewYaw', yaw: 0 }, []);
    w.keeper.running = true;
    w.keeper.input = { x: 0, z: 1 };
    applyCommand(w, { kind: 'jump', down: true }, ev);
    expect(ev).toContainEqual({ kind: 'keeperRolled' });
  });

  it('a Nubbin close by giggles', () => {
    const w = createWorld(1, 0);
    const n = w.nubbins[0]!;
    n.stage = 'child';
    n.pos = { x: w.keeper.pos.x + 1, z: w.keeper.pos.z };
    const ev: SimEvent[] = [];
    applyCommand(w, { kind: 'roll' }, ev);
    expect(ev.some((e) => e.kind === 'reaction' && e.nubbinId === n.id)).toBe(true);
  });
});
