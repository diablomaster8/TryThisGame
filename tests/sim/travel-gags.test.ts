import { describe, expect, it } from 'vitest';
import { GROVE } from '../../src/config/tuning';
import { TRAVEL_GAGS } from '../../src/config/tuning-fun-r10';
import { hatch } from '../../src/sim/lifecycle';
import { ballPushAngle, ballSplash, rollWalk, stepStreamFloat } from '../../src/sim/travel-gags';
import type { SimEvent } from '../../src/sim/types';
import { createWorld } from '../../src/sim/world';

// R0293 (FUN-04): the travelling personality gags: roll, stream float, ball into the pond.

function adult(personality: 'lazy' | 'mischievous' | 'cheerful') {
  const w = createWorld(3, 0);
  const n = w.nubbins[0]!;
  hatch(n, [], 0);
  n.stage = 'adult';
  n.personality = personality;
  n.behavior.state = 'wander';
  return { w, n };
}

describe('travelling gags', () => {
  it('a lazy adult rolls about a third of its walks; a cheerful one never', () => {
    const { n } = adult('lazy');
    let rolls = 0;
    for (let i = 0; i < 1000; i++) {
      n.behavior.sinceMs = i * 1000;
      if (rollWalk(n)) rolls++;
    }
    expect(rolls).toBeGreaterThan(200);
    expect(rolls).toBeLessThan(400);
    n.personality = 'cheerful';
    for (let i = 0; i < 100; i++) {
      n.behavior.sinceMs = i * 1000;
      expect(rollWalk(n)).toBe(false);
    }
  });

  it('the stream carries a lazy Nubbin about a tile downstream, then lets it go', () => {
    const { w, n } = adult('lazy');
    const a = GROVE.river.outflow[1]!;
    const b = GROVE.river.outflow[2]!;
    let since = 0;
    for (; since < 100_000; since += 1000) {
      n.pos = { x: (a.x + b.x) / 2, z: (a.z + b.z) / 2 };
      n.behavior.sinceMs = since;
      if (stepStreamFloat(n, w, 100)) break;
    }
    n.pos = { x: (a.x + b.x) / 2, z: (a.z + b.z) / 2 };
    n.behavior.sinceMs = since + 1;
    // A fresh walk that floats.
    let floated = false;
    for (let s = since + 1; s < since + 100_000 && !floated; s += 1000) {
      n.behavior.sinceMs = s;
      floated = stepStreamFloat(n, w, 100);
    }
    expect(floated).toBe(true);
    const start = { ...n.pos };
    let steps = 0;
    while (stepStreamFloat(n, w, 100) && steps < 500) steps++;
    const moved = Math.hypot(n.pos.x - start.x, n.pos.z - start.z);
    expect(moved).toBeGreaterThan(TRAVEL_GAGS.floatTiles * 0.8);
    expect(moved).toBeLessThan(TRAVEL_GAGS.floatTiles * 1.2);
    // Downstream: the outflow runs away from the pond.
    expect(n.pos.z).toBeGreaterThan(start.z);
  });

  it('a mischievous Nubbin aims the ball at the pond; it splashes and bobs to the bank', () => {
    const { n } = adult('mischievous');
    const ball = { x: GROVE.pond.x + GROVE.pond.r + 1, z: GROVE.pond.z };
    let angle: number | null = null;
    for (let s = 0; s < 50_000 && angle === null; s += 1000) {
      n.behavior.sinceMs = s;
      angle = ballPushAngle(n, ball);
    }
    expect(angle).not.toBeNull();
    expect(Math.cos(angle!)).toBeLessThan(-0.99); // straight at the pond, to the west
    const events: SimEvent[] = [];
    const inPond = { x: GROVE.pond.x + 1, z: GROVE.pond.z };
    expect(ballSplash(n, inPond, events)).toBe(true);
    expect(events).toEqual([{ kind: 'ballSplash', nubbinId: n.id }]);
    const d = Math.hypot(inPond.x - GROVE.pond.x, inPond.z - GROVE.pond.z);
    expect(d).toBeGreaterThan(GROVE.pond.r);
    // Far from the pond, no aim.
    n.personality = 'cheerful';
    expect(ballPushAngle(n, ball)).toBeNull();
  });
});
