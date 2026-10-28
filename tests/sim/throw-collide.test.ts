/**
 * Thrown bodies collide (R0033, MOVE-33): an egg thrown at the cottage from 32 angles ends
 * outside its footprint every time, and a thrown Nubbin bonks off it dizzy.
 */
import { describe, expect, it } from 'vitest';
import { GROVE_COLLIDERS } from '../../src/config/grove-layout';
import { SIM } from '../../src/config/tuning';
import { contact } from '../../src/sim/obstacles';
import { stepWorld, createWorld } from '../../src/sim/world';
import type { Nubbin, SimEvent, World } from '../../src/sim/types';

const COTTAGE = GROVE_COLLIDERS.find((c) => c.id === 'cottage')!;

/** Throw `n` from 4.5 u out at `a`, straight at the cottage's middle, 1 u up. */
function throwAt(w: World, n: Nubbin, a: number): SimEvent[] {
  const from = { x: COTTAGE.x + Math.cos(a) * 4.5, z: COTTAGE.z + Math.sin(a) * 4.5 };
  n.pos = from;
  n.y = 1;
  n.vel = { x: -Math.cos(a) * 6, y: 2, z: -Math.sin(a) * 6 };
  n.behavior.state = 'thrown';
  const ev: SimEvent[] = [];
  for (let s = 0; s < 60 && n.behavior.state === 'thrown'; s++)
    ev.push(...stepWorld(w, SIM.stepMs));
  for (let s = 0; s < 3; s++) ev.push(...stepWorld(w, SIM.stepMs));
  return ev;
}

describe('thrown bodies collide (MOVE-33)', () => {
  it('an egg thrown at the cottage from 32 angles ends outside it', () => {
    const inside: number[] = [];
    for (let i = 0; i < 32; i++) {
      const w = createWorld(1, 0);
      const egg = w.nubbins[0]!;
      w.nubbins = [egg];
      throwAt(w, egg, (i / 32) * Math.PI * 2);
      if (contact(COTTAGE, egg.pos.x, egg.pos.z, 0)) inside.push(i);
    }
    expect(inside).toEqual([]);
  });

  it('a thrown Nubbin bonks off the cottage, dizzy', () => {
    const w = createWorld(1, 0);
    const n = w.nubbins[0]!;
    w.nubbins = [n];
    n.stage = 'child';
    const ev = throwAt(w, n, 0);
    expect(contact(COTTAGE, n.pos.x, n.pos.z, 0)).toBeNull();
    expect(ev.some((e) => e.kind === 'reaction' && e.reaction === 'dizzy')).toBe(true);
  });
});
