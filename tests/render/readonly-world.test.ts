import { describe, expect, it } from 'vitest';
import { deepFreeze, type ReadonlyWorld } from '../../src/render/readonly-world';
import { bigBubbles } from '../../src/render/emote-size';
import { WalkFollow } from '../../src/render/camera-follow';
import { memorialSpot } from '../../src/render/memorial-spot';
import { sitWithBeat, towardKeeper } from '../../src/render/sit-with';
import { firstLoopSpot } from '../../src/render-common/first-loop-ring';
import type { Memorial } from '../../src/sim/types';
import { stepWorld, createWorld } from '../../src/sim/world';

/** R0482: render code that takes ReadonlyWorld cannot write, and a frozen world still reads. */
describe('ReadonlyWorld', () => {
  it('refuses writes at compile time and at run time once frozen', () => {
    const w = createWorld(5, 0);
    for (let i = 0; i < 20; i++) stepWorld(w, 100, i * 100);
    const r: ReadonlyWorld = deepFreeze(w);
    // @ts-expect-error a renderer may not change the sim
    expect(() => (r.timeMs = 1)).toThrow();
    // @ts-expect-error nor push into its lists
    expect(() => r.nubbins.push(r.nubbins[0])).toThrow();
    expect(r.nubbins.length).toBeGreaterThan(0);
  });
});

/**
 * R0482: one render frame's worth of the pure view builders, on a deep-frozen world. A frozen
 * world throws a TypeError (modules are strict) on any write, so a view that sneaks one in
 * fails here even where the types let it through. The canvas parts of both renderers need a
 * browser and are covered by the Edge smoke runs; these are the sim-reading builders they call.
 */
describe('a frame on a frozen world', () => {
  it('reads without writing: bubbles, memorials, sit-with, the first-loop ring, walk follow', () => {
    const w = createWorld(9, 0);
    for (let i = 0; i < 40; i++) stepWorld(w, 100, i * 100);
    w.memorials.push({ id: 'm1', name: 'Pip', pos: { x: 3, z: 4 } } as Memorial);
    const n = w.nubbins[0]!;
    w.keeper.sitWith = n.id;
    w.keeper.sitBesideMs = 0;
    n.behavior.state = 'sit';
    w.keeper.moveTarget = { x: 5, z: 5 };
    const r: ReadonlyWorld = deepFreeze(w);
    expect(() => {
      bigBubbles(r);
      memorialSpot(r, r.memorials[0] as Memorial);
      for (const t of [0, 20_000, 60_000, 120_000]) sitWithBeat(r, n, t);
      towardKeeper(r, n);
      firstLoopSpot(r);
      const camera = { currentYaw: 0, rotate: () => undefined };
      const follow = new WalkFollow();
      for (let t = 0; t < 8000; t += 500) follow.update(r, camera, t, false);
    }).not.toThrow();
    expect(Object.isFrozen(w.nubbins[0])).toBe(true);
  });
});
