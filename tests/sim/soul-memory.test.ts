import { describe, expect, it } from 'vitest';
import { THROW } from '../../src/config/tuning';
import { CARE_MEMORY } from '../../src/config/tuning-soul-r10';
import { setAnticsLive } from '../../src/sim/antics';
import { rememberCare } from '../../src/sim/care-memory';
import { petNubbin } from '../../src/sim/keeper';
import { evolve, hatch } from '../../src/sim/lifecycle';
import { applyCommand, createWorld, stepWorld } from '../../src/sim/world';
import type { Nubbin, Personality, SimEvent, World } from '../../src/sim/types';

// R0541 (SOUL-23): a Nubbin remembers how it was treated: a throw and then walking up makes
// it flinch; three pets and walking off and back makes it run up and ask for more; fed by
// hand, it trails a Keeper with fruit. The memories fade.

function one(seed: number, p: Personality = 'cheerful'): { w: World; n: Nubbin } {
  const w = createWorld(seed, 0);
  const n = w.nubbins[0]!;
  w.nubbins = [n];
  hatch(n, [], 0);
  evolve(n, [], w);
  n.personality = p;
  return { w, n };
}

const far = (w: World, n: Nubbin) => ({ x: n.pos.x + 20, z: n.pos.z + 20 });

function steps(w: World, n: Nubbin, count: number, each?: () => void): SimEvent[] {
  const events: SimEvent[] = [];
  for (let t = 0; t < count; t++) {
    n.needs.hunger = 1;
    n.needs.energy = 1;
    each?.();
    events.push(...stepWorld(w, 100));
  }
  return events;
}

/** Keeper away until it idles, then walks up: what it does in the next two seconds. */
function walkUp(w: World, n: Nubbin): string[] {
  w.keeper.pos = far(w, n);
  steps(w, n, 300);
  for (let t = 0; t < 600 && n.behavior.state !== 'wander' && n.behavior.state !== 'sit'; t++)
    steps(w, n, 1);
  w.keeper.pos = { x: n.pos.x + 2, z: n.pos.z + 0.5 };
  const seen: string[] = [];
  steps(w, n, 20, () => {
    if (n.behavior.itemId) seen.push(n.behavior.itemId);
  });
  return seen;
}

describe('R0541 Nubbins remember how they were treated', () => {
  it('thrown, then walked up to: it flinches (in most seeds)', () => {
    let flinches = 0;
    for (const seed of [1, 2, 3, 4, 5]) {
      const { w, n } = one(seed);
      const ev: SimEvent[] = [];
      applyCommand(w, { kind: 'grab', nubbinId: n.id }, ev);
      applyCommand(w, { kind: 'release', vel: { x: THROW.minSpeed * 2, z: 0 } }, ev);
      expect(n.recentCare?.at(-1)?.kind).toBe('throw');
      if (walkUp(w, n).includes('flinch')) flinches++;
    }
    expect(flinches).toBeGreaterThanOrEqual(4);
  }, 60_000);

  it('a thrown shy one backs off a step as it flinches', () => {
    const { w, n } = one(2, 'shy');
    setAnticsLive(true);
    rememberCare(n, 'throw', w.timeMs);
    w.keeper.pos = far(w, n);
    steps(w, n, 50);
    n.behavior.state = 'sit';
    n.behavior.untilMs = w.timeMs + 60_000;
    w.keeper.pos = { x: n.pos.x + 2, z: n.pos.z };
    const x0 = n.pos.x;
    steps(w, n, 1);
    expect(n.behavior.itemId).toBe('flinch');
    expect(n.behavior.target!.x).toBeLessThan(x0);
  });

  it('three pets, walk away and back: it runs up and asks for more', () => {
    let asks = 0;
    for (const seed of [1, 2, 3, 4, 5]) {
      const { w, n } = one(seed);
      for (let i = 0; i < 3; i++) {
        w.keeper.pos = { x: n.pos.x + 1, z: n.pos.z };
        petNubbin(w, n, []);
        steps(w, n, 30);
      }
      if (walkUp(w, n).includes('askUp')) asks++;
    }
    expect(asks).toBeGreaterThanOrEqual(4);
  }, 60_000);

  it('fed by hand, it trails after a Keeper with fruit, and not one without', () => {
    const near = (fruit: number): number => {
      const { w, n } = one(7);
      setAnticsLive(true);
      rememberCare(n, 'feed', w.timeMs);
      w.inventory.fruit = fruit;
      let close = 0;
      steps(w, n, 600, () => {
        w.keeper.pos = { x: 4, z: 6 };
        if (Math.hypot(n.pos.x - 4, n.pos.z - 6) < 2.5) close++;
      });
      return close;
    };
    expect(near(3)).toBeGreaterThan(near(0) + 100);
  }, 60_000);

  it('the memory fades, and nothing is noted while catching up', () => {
    const { w, n } = one(3);
    setAnticsLive(true);
    rememberCare(n, 'throw', 0);
    rememberCare(n, 'pet', CARE_MEMORY.fadeMs + 1);
    expect(n.recentCare?.map((c) => c.kind)).toEqual(['pet']);
    setAnticsLive(false);
    rememberCare(n, 'throw', CARE_MEMORY.fadeMs + 2);
    setAnticsLive(true);
    expect(n.recentCare?.length).toBe(1);
    w.timeMs = CARE_MEMORY.fadeMs * 3;
    expect(walkUp(w, n)).not.toContain('flinch');
  }, 60_000);
});
