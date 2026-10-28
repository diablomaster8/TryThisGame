// SOUL-01: walking states give up instead of chasing an unreachable target forever. Six
// Nubbins and two toys (one sat inside a tree trunk, where colliders keep it out of reach)
// run for 20 sim minutes; no walk to a toy may pass 10 s, nor a walk to fruit 1.5× its longest
// possible walk.
import { describe, expect, it } from 'vitest';
import { BEHAVIOR, EGG, SIM } from '../../src/config/tuning';
import type { World } from '../../src/sim/types';
import { createWorld, stepWorld } from '../../src/sim/world';

function addToy(w: World, id: string, x: number, z: number): void {
  w.items.push({ id, kind: 'toy', pos: { x, z }, y: 0, vel: { x: 0, y: 0, z: 0 } });
}

describe('behavior stalls (SOUL-01)', () => {
  it('no Nubbin walks more than 10 s without arriving, and play sessions stay short', () => {
    const w = createWorld(31, 0);
    for (let i = 0; i < EGG.hatchMs / SIM.stepMs + 5; i++) stepWorld(w, SIM.stepMs);
    const base = w.nubbins[0]!;
    for (let i = 0; w.nubbins.length < 6; i++) {
      const c = structuredClone(base);
      c.id = `${base.id}-c${i}`;
      c.pos = { x: base.pos.x + (i % 2) * 1.5, z: base.pos.z + i * 0.8 };
      w.nubbins.push(c);
    }
    const tree = w.trees[0]!;
    addToy(w, 'toy-stuck', tree.pos.x, tree.pos.z);
    addToy(w, 'toy-free', base.pos.x + 2, base.pos.z + 2);

    // Time in the current attempt: a new state start (sinceMs) is a fresh walk.
    const walking = new Map<string, { since: number; ms: number }>();
    const playing = new Map<string, { since: number; ms: number }>();
    let worstWalk = 0;
    let worstFood = 0;
    let worstPlay = 0;
    const steps = (20 * 60_000) / SIM.stepMs;
    for (let i = 0; i < steps; i++) {
      stepWorld(w, SIM.stepMs);
      for (const n of w.nubbins) {
        const b = n.behavior;
        const toyWalk = (b.state === 'play' || b.state === 'fetch') && !!b.target;
        const approaching = toyWalk || b.state === 'findFood';
        const prev = walking.get(n.id);
        const walk = !approaching ? 0 : (prev?.since === b.sinceMs ? prev.ms : 0) + SIM.stepMs;
        walking.set(n.id, { since: b.sinceMs, ms: walk });
        if (toyWalk) worstWalk = Math.max(worstWalk, walk);
        else worstFood = Math.max(worstFood, walk);
        const last = playing.get(n.id);
        const play =
          b.state !== 'play' ? 0 : (last?.since === b.sinceMs ? last.ms : 0) + SIM.stepMs;
        playing.set(n.id, { since: b.sinceMs, ms: play });
        worstPlay = Math.max(worstPlay, play);
      }
    }
    expect(worstWalk).toBeLessThanOrEqual(10_000);
    // Fruit can be up to foodSearchRadius away, so its walk may take 1.5× that long, no more.
    expect(worstFood).toBeLessThanOrEqual(
      (BEHAVIOR.foodSearchRadius / BEHAVIOR.walkSpeed) * 1500 + SIM.stepMs,
    );
    expect(worstPlay).toBeLessThanOrEqual(BEHAVIOR.approachTimeoutMs + BEHAVIOR.playMs[1] + 1000);
    expect(worstPlay).toBeLessThan(15_000);
  });
});
