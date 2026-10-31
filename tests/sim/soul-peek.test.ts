import { describe, expect, it } from 'vitest';
import { PEEK } from '../../src/config/tuning';
import { evolve, hatch } from '../../src/sim/lifecycle';
import { findHiding } from '../../src/sim/peek';
import { createWorld, stepWorld } from '../../src/sim/world';
import type { Nubbin, SimEvent, World } from '../../src/sim/types';

// R0543 (SOUL-25): a shy adult hides behind a tree as the Keeper approaches, and tapping the
// tree finds it.

function setup(seed: number): { w: World; n: Nubbin } {
  const w = createWorld(seed, 0);
  const n = w.nubbins[0]!;
  w.nubbins = [n];
  hatch(n, [], 0);
  evolve(n, [], w);
  n.personality = 'shy';
  return { w, n };
}

function hold(n: Nubbin): void {
  n.needs.hunger = 1;
  n.needs.energy = 1;
}

describe('R0543 shy peek', () => {
  it('hides behind the nearest tree on at least half of the approaches', () => {
    let approaches = 0;
    let hides = 0;
    for (const seed of [1, 2, 3, 4]) {
      const { w, n } = setup(seed);
      const tree = w.trees[0]!.pos;
      for (let i = 0; i < 6; i++) {
        // Somewhere near the tree, the Keeper far off; then the Keeper walks up.
        n.pos = { x: tree.x + 2.5, z: tree.z + 1 };
        n.behavior.state = 'sit';
        n.behavior.untilMs = w.timeMs + 60_000;
        w.keeper.pos = { x: tree.x + 20, z: tree.z + 20 };
        // Long enough apart that the last hide has rested.
        for (let t = 0; t < 500; t++) {
          hold(n);
          stepWorld(w, 100);
        }
        n.behavior.state = 'sit';
        n.behavior.untilMs = w.timeMs + 60_000;
        w.keeper.pos = { x: n.pos.x + 3, z: n.pos.z + 1.5 };
        approaches++;
        let hid = false;
        for (let t = 0; t < 10; t++) {
          hold(n);
          stepWorld(w, 100);
          if (n.behavior.itemId === 'peekTree') hid = true;
        }
        if (hid) hides++;
      }
    }
    expect(hides / approaches, `${hides}/${approaches}`).toBeGreaterThanOrEqual(0.5);
  });

  it('a cheerful one never hides', () => {
    const { w, n } = setup(5);
    n.personality = 'cheerful';
    const tree = w.trees[0]!.pos;
    n.pos = { x: tree.x + 2.5, z: tree.z + 1 };
    w.keeper.pos = { x: tree.x + 20, z: tree.z + 20 };
    stepWorld(w, 100);
    w.keeper.pos = { x: n.pos.x + 3, z: n.pos.z };
    for (let t = 0; t < 30; t++) stepWorld(w, 100);
    expect(n.behavior.itemId).not.toBe('peekTree');
  });

  it('tapping the tree finds it: a giggle, affection, trust, and a rest', () => {
    const { w, n } = setup(6);
    const tree = w.trees[0]!;
    n.pos = { x: tree.pos.x + 2.5, z: tree.pos.z + 1 };
    w.keeper.pos = { x: tree.pos.x + 20, z: tree.pos.z + 20 };
    n.behavior.state = 'sit';
    n.behavior.untilMs = w.timeMs + 60_000;
    stepWorld(w, 100);
    // Force the hide (the chance is tested above), then let it reach its spot.
    let tries = 0;
    while (n.behavior.itemId !== 'peekTree' && tries++ < 40) {
      w.keeper.pos = { x: tree.pos.x + 20, z: tree.pos.z + 20 };
      n.behavior.state = 'sit';
      stepWorld(w, 100);
      w.keeper.pos = { x: n.pos.x + 3, z: n.pos.z + 1 };
      stepWorld(w, 1000);
    }
    expect(n.behavior.itemId).toBe('peekTree');
    for (let t = 0; t < 80 && n.behavior.target; t++) stepWorld(w, 100);
    expect(n.behavior.target).toBeNull();
    // Behind the trunk, away from the Keeper.
    const k = w.keeper.pos;
    expect(Math.hypot(n.pos.x - k.x, n.pos.z - k.z)).toBeGreaterThan(
      Math.hypot(tree.pos.x - k.x, tree.pos.z - k.z),
    );
    const aff = n.needs.affection;
    const trust = n.trust;
    const ev: SimEvent[] = [];
    expect(findHiding(w, tree.id, ev)).toBe(true);
    expect(ev.some((e) => e.kind === 'peekFound')).toBe(true);
    expect(n.behavior.itemId).toBe('giggle');
    expect(n.needs.affection).toBeGreaterThan(aff);
    expect(n.trust ?? 0).toBeGreaterThanOrEqual(trust ?? 0);
    expect(n.peekAfterMs).toBe(w.timeMs + PEEK.cooldownMs);
    // Nobody behind another tree: the tap shakes as before.
    expect(findHiding(w, w.trees[1]!.id, [])).toBe(false);
  });
});

// Lane A r10 (R0543's leftover): a stranger walking up sets it off too.
describe('R0543 shy peek at a stranger', () => {
  it('hides from a visiting Keeper on at least half of the approaches, away from them', () => {
    let approaches = 0;
    let hides = 0;
    for (const seed of [1, 2, 3, 4]) {
      const { w, n } = setup(seed);
      const tree = w.trees[0]!.pos;
      const npc = {
        id: 'stranger',
        trainer: 'corvin',
        pos: { x: tree.x + 30, z: tree.z + 30 },
        facing: 0,
        target: null,
        waitMs: 1e9,
        home: { x: tree.x + 30, z: tree.z + 30 },
      } as unknown as World['npcs'][number];
      w.npcs = [npc];
      w.keeper.pos = { x: tree.x - 40, z: tree.z - 40 };
      for (let i = 0; i < 6; i++) {
        n.pos = { x: tree.x + 2.5, z: tree.z + 1 };
        n.behavior.state = 'sit';
        n.behavior.untilMs = w.timeMs + 60_000;
        npc.pos = { x: tree.x + 30, z: tree.z + 30 };
        for (let t = 0; t < 500; t++) {
          hold(n);
          stepWorld(w, 100);
        }
        n.behavior.state = 'sit';
        n.behavior.untilMs = w.timeMs + 60_000;
        npc.pos = { x: n.pos.x + 3, z: n.pos.z + 1.5 };
        npc.target = null;
        approaches++;
        let hid = false;
        for (let t = 0; t < 10; t++) {
          hold(n);
          stepWorld(w, 100);
          if (n.behavior.itemId === 'peekTree') {
            hid = true;
            // The hiding spot is on the far side of the tree from the stranger.
            const tgt = n.behavior.target;
            if (tgt)
              expect(Math.hypot(tgt.x - npc.pos.x, tgt.z - npc.pos.z)).toBeGreaterThan(
                Math.hypot(tree.x - npc.pos.x, tree.z - npc.pos.z),
              );
          }
        }
        if (hid) hides++;
      }
    }
    expect(hides / approaches, `${hides}/${approaches}`).toBeGreaterThanOrEqual(0.5);
  });
});
