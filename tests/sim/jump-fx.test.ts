import { describe, expect, it } from 'vitest';
import { GROVE } from '../../src/config/tuning';
import { JUMP } from '../../src/config/tuning-sim';
import { keeperFooting, updateKeeper } from '../../src/sim/keeper';
import { applyCommand, createWorld } from '../../src/sim/world';
import type { SimEvent, World } from '../../src/sim/types';

// MOVE-21: the landing event carries how far the feet fell, for the plop and the sounds.

const SUB = 1000 / 60;

function standing(): World {
  const w = createWorld(1, 0);
  w.nubbins = [];
  const p = GROVE.keeperStart;
  w.keeper.pos = { x: p.x, z: p.z };
  w.keeper.y = keeperFooting(w, p.x, p.z).y;
  w.keeper.grounded = true;
  return w;
}

function land(w: World): Extract<SimEvent, { kind: 'keeperLanded' }> | undefined {
  const ev: SimEvent[] = [];
  for (let i = 0; i < 600; i++) {
    updateKeeper(w, SUB, ev);
    const l = ev.find((e) => e.kind === 'keeperLanded');
    if (l && l.kind === 'keeperLanded') return l;
  }
  return undefined;
}

describe('keeperLanded fall height (MOVE-21)', () => {
  it('a flat jump lands with a fall of about the jump height', () => {
    const w = standing();
    applyCommand(w, { kind: 'jump', down: true }, []);
    const l = land(w);
    expect(l).toBeDefined();
    expect(l!.fall).toBeGreaterThan(JUMP.height - 0.1);
    expect(l!.fall).toBeLessThan(JUMP.height + 0.01);
  });

  it('a drop from 3 u up reports a fall over 2 u (a plop)', () => {
    const w = standing();
    w.keeper.y += 3;
    w.keeper.grounded = false;
    w.keeper.vy = 0;
    const l = land(w);
    expect(l!.fall).toBeGreaterThan(2);
  });
});
