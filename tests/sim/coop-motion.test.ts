import { describe, expect, it } from 'vitest';
import { GROVE } from '../../src/config/tuning';
import { KEEPER2 } from '../../src/config/tuning-move';
import { blocked } from '../../src/sim/obstacles';
import { keeperFooting } from '../../src/sim/keeper';
import { applyCommand, createWorld, stepWorld } from '../../src/sim/world';
import type { SimEvent, World } from '../../src/sim/types';

// MOVE-54: Keeper 2 moves by Keeper 1's rules: it collides, jumps, and keeps apart from Keeper 1.

function coop(): World {
  const w = createWorld(1, 0);
  w.nubbins = [];
  applyCommand(w, { kind: 'setCoop', active: true, trainer: 'nova' }, []);
  return w;
}

const steps = (w: World, n: number, ev: SimEvent[] = []): SimEvent[] => {
  for (let i = 0; i < n; i++) stepWorld(w, 100, ev);
  return ev;
};

describe('co-op Keeper 2 motion (MOVE-54)', () => {
  it('both Keepers jump; Keeper 2 rises and lands without Keeper 1 moving', () => {
    const w = coop();
    const k2 = w.keeper2!;
    const y1 = w.keeper.y;
    const g2 = k2.y;
    applyCommand(w, { kind: 'keeper2Jump', down: true }, []);
    let top2 = g2;
    for (let i = 0; i < 4; i++) {
      steps(w, 1);
      top2 = Math.max(top2, k2.y);
    }
    expect(top2 - g2).toBeGreaterThan(0.5);
    expect(w.keeper.y).toBeCloseTo(y1, 5);
    applyCommand(w, { kind: 'keeper2Jump', down: false }, []);
    steps(w, 10);
    expect(k2.grounded).toBe(true);
    expect(k2.y).toBeCloseTo(keeperFooting(w, k2.pos.x, k2.pos.z).y, 3);
    // And Keeper 1 jumps too, with Keeper 2 standing still.
    applyCommand(w, { kind: 'jump', down: true }, []);
    steps(w, 2);
    expect(w.keeper.y).toBeGreaterThan(y1 + 0.3);
    expect(k2.y).toBeCloseTo(g2, 3);
  });

  it("Keeper 2's jump events stay its own (no Keeper 1 dust or camera dip)", () => {
    const w = coop();
    applyCommand(w, { kind: 'keeper2Jump', down: true }, []);
    const ev = steps(w, 10);
    expect(ev.some((e) => e.kind === 'keeperJumped' || e.kind === 'keeperLanded')).toBe(false);
  });

  it('the Keepers cannot walk through each other', () => {
    const w = coop();
    const k2 = w.keeper2!;
    // Keeper 2 starts 1.5 to the east; walk it west into Keeper 1 and on for 3 s.
    k2.pos = { x: w.keeper.pos.x + 1.5, z: w.keeper.pos.z };
    applyCommand(w, { kind: 'keeper2Input', input: { x: -1, z: 0 } }, []);
    let closest = Infinity;
    for (let i = 0; i < 30; i++) {
      steps(w, 1);
      closest = Math.min(closest, Math.hypot(k2.pos.x - w.keeper.pos.x, k2.pos.z - w.keeper.pos.z));
    }
    expect(closest).toBeGreaterThan(KEEPER2.body * 2 - 0.05);
    // It pushed Keeper 1 along rather than passing it.
    expect(k2.pos.x).toBeGreaterThan(w.keeper.pos.x);
  });

  it('Keeper 2 stops at solids, as Keeper 1 does', () => {
    const w = coop();
    const k2 = w.keeper2!;
    const c = GROVE.buildings.cottage;
    k2.pos = { x: c.x, z: c.z + 6 };
    k2.y = keeperFooting(w, k2.pos.x, k2.pos.z).y;
    applyCommand(w, { kind: 'keeper2Input', input: { x: 0, z: -1 } }, []);
    for (let i = 0; i < 60; i++) {
      steps(w, 1);
      expect(blocked(k2.pos, w, 0.3)).toBe(false);
    }
  });
});
