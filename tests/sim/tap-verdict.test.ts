/**
 * R0035 (lane A r10): the unreachable-tap verdict the tap markers read for their ✕ / ⤒
 * variants. A tap inside the dojo leaves a 'cant' verdict where it landed; a reachable tap
 * leaves none; the verdict matches the event's jump flag.
 */
import { describe, expect, it } from 'vitest';
import { SIM } from '../../src/config/tuning';
import { tapVerdict } from '../../src/sim/keeper';
import { applyCommand, createWorld, stepWorld } from '../../src/sim/world';
import type { SimEvent } from '../../src/sim/types';

describe('tap verdict (MOVE-35 markers)', () => {
  it('a tap inside the dojo leaves a ✕ verdict at the tap', () => {
    const w = createWorld(1, 0);
    w.nubbins = [];
    w.keeper.pos = { x: 12, z: 2 };
    expect(tapVerdict(w)).toBeUndefined();
    applyCommand(w, { kind: 'moveKeeperTo', pos: { x: 18, z: -4 } }, []);
    const ev: SimEvent[] = [];
    for (let s = 0; s < 400 && w.keeper.moveTarget; s++) ev.push(...stepWorld(w, SIM.stepMs));
    const v = tapVerdict(w);
    expect(v).toBeDefined();
    expect(v!.kind).toBe('cant');
    expect(v!.at).toEqual({ x: 18, z: -4 });
    const e = ev.find((x) => x.kind === 'moveUnreachable');
    if (e?.kind !== 'moveUnreachable') throw new Error('no event');
    expect(e.jump).toBe(v!.kind === 'jump');
  });

  it('a reachable tap leaves no verdict', () => {
    const w = createWorld(1, 0);
    w.nubbins = [];
    w.keeper.pos = { x: 12, z: 2 };
    applyCommand(w, { kind: 'moveKeeperTo', pos: { x: 16, z: 1 } }, []);
    for (let s = 0; s < 400 && w.keeper.moveTarget; s++) stepWorld(w, SIM.stepMs);
    expect(tapVerdict(w)).toBeUndefined();
  });
});
