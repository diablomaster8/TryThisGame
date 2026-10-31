import { describe, expect, it } from 'vitest';
import { BEHAVIOR } from '../../src/config/tuning';
import { setAnticsLive } from '../../src/sim/antics';
import { eat } from '../../src/sim/behavior';
import { evolve, hatch } from '../../src/sim/lifecycle';
import { eatFlavour, swimPace } from '../../src/sim/state-flavour';
import { createWorld, stepWorld } from '../../src/sim/world';
import type { Nubbin, Personality, SimEvent, World } from '../../src/sim/types';

// R0558 (SOUL-41), the sim side: eating, napping and swimming by personality.

function one(seed: number, p: Personality): { w: World; n: Nubbin } {
  const w = createWorld(seed, 0);
  const n = w.nubbins[0]!;
  w.nubbins = [n];
  hatch(n, [], 0);
  evolve(n, [], w);
  n.personality = p;
  return { w, n };
}

describe('R0558 personality-flavoured states', () => {
  it('a glutton gulps its fruit quickly, then burps', () => {
    const { w, n } = one(1, 'cheerful');
    n.earnedTrait = 'glutton';
    setAnticsLive(true);
    const events: SimEvent[] = [];
    n.needs.hunger = 0.5;
    eat(n, w.timeMs, events);
    expect(n.behavior.itemId).toBe('gulp');
    expect(n.behavior.untilMs - n.behavior.sinceMs).toBeLessThan(BEHAVIOR.eatMs);
    let burped = false;
    for (let t = 0; t < 100 && !burped; t++)
      for (const e of stepWorld(w, 100)) if (e.kind === 'burp') burped = true;
    expect(burped).toBe(true);
  });

  it('a shy one nibbles (slower), a lazy one lies down to eat', () => {
    setAnticsLive(true);
    const shy = one(2, 'shy').n;
    const lazy = one(2, 'lazy').n;
    shy.earnedTrait = 'brave';
    lazy.earnedTrait = 'brave';
    expect(eatFlavour(shy)?.itemId).toBe('nibble');
    expect(eatFlavour(shy)!.scale).toBeGreaterThan(1);
    expect(eatFlavour(lazy)?.itemId).toBe('lieEat');
  });

  it('a tired shy one walks to a tree to nap; a lazy one naps where it is', () => {
    for (const p of ['shy', 'lazy'] as const) {
      const { w, n } = one(3, p);
      const tree = w.trees[0]!.pos;
      n.pos = { x: tree.x + 5, z: tree.z };
      n.behavior.state = 'sit';
      n.behavior.untilMs = w.timeMs + 60_000;
      const start = { ...n.pos };
      for (let t = 0; t < 150 && (n.behavior.state as string) !== 'nap'; t++) {
        n.needs.energy = 0;
        n.needs.hunger = 1;
        stepWorld(w, 100);
      }
      expect(n.behavior.state).toBe('nap');
      const toTree = Math.hypot(n.pos.x - tree.x, n.pos.z - tree.z);
      if (p === 'shy') expect(toTree).toBeLessThan(2);
      else expect(Math.hypot(n.pos.x - start.x, n.pos.z - start.z)).toBeLessThan(0.5);
    }
  });

  it('nothing changes while catching up on time away', () => {
    const { n } = one(5, 'shy');
    setAnticsLive(false);
    expect(eatFlavour(n)).toBeNull();
    expect(swimPace({ ...n, personality: 'lazy' })).toBe(1);
    setAnticsLive(true);
  });
});
