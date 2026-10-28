/**
 * Unreachable taps (R0035, MOVE-35): a tap inside the dojo walks to the nearest reachable
 * point and says so once, with no jump hint (a jump would not get in either).
 */
import { describe, expect, it } from 'vitest';
import { SIM } from '../../src/config/tuning';
import { applyCommand, createWorld, stepWorld } from '../../src/sim/world';
import type { SimEvent } from '../../src/sim/types';

describe('unreachable taps (MOVE-35)', () => {
  it('a tap inside the dojo walks to its edge and reports it once', () => {
    const w = createWorld(1, 0);
    w.nubbins = [];
    w.keeper.pos = { x: 12, z: 2 };
    applyCommand(w, { kind: 'moveKeeperTo', pos: { x: 18, z: -4 } }, []);
    const ev: SimEvent[] = [];
    for (let s = 0; s < 400 && w.keeper.moveTarget; s++) ev.push(...stepWorld(w, SIM.stepMs));
    const said = ev.filter((e) => e.kind === 'moveUnreachable');
    expect(said).toHaveLength(1);
    const e = said[0]!;
    if (e.kind !== 'moveUnreachable') throw new Error('kind');
    expect(e.jump).toBe(false);
    expect(w.keeper.moveTarget).toBeNull();
    expect(Math.hypot(w.keeper.pos.x - e.nearest.x, w.keeper.pos.z - e.nearest.z)).toBeLessThan(
      0.6,
    );
  });

  it('a reachable tap says nothing', () => {
    const w = createWorld(1, 0);
    w.nubbins = [];
    w.keeper.pos = { x: 12, z: 2 };
    applyCommand(w, { kind: 'moveKeeperTo', pos: { x: 16, z: 1 } }, []);
    const ev: SimEvent[] = [];
    for (let s = 0; s < 400 && w.keeper.moveTarget; s++) ev.push(...stepWorld(w, SIM.stepMs));
    expect(ev.some((e) => e.kind === 'moveUnreachable')).toBe(false);
  });
});
