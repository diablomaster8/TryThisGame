import { describe, expect, it } from 'vitest';
import { NEEDS } from '../../src/config/tuning';
import { FAV_SPOT } from '../../src/config/tuning-soul-r11';
import { soulLookKind } from '../../src/render/soul-looks';
import { favSpot } from '../../src/sim/fav-spot';
import { petNubbin } from '../../src/sim/keeper';
import { favouriteKeeper, fondGreet } from '../../src/sim/keeper-fondness';
import { evolve, hatch } from '../../src/sim/lifecycle';
import { applyCommand, createWorld, stepWorld } from '../../src/sim/world';
import type { Nubbin, Personality, World } from '../../src/sim/types';

// R0568 (SOUL-51) and R0569 (SOUL-52), lane A r11: a favourite Keeper and a favourite spot.
function adult(seed: number, p: Personality = 'cheerful'): { w: World; n: Nubbin } {
  const w = createWorld(seed, 0);
  const n = w.nubbins[0]!;
  w.nubbins = [n];
  hatch(n, [], 0);
  evolve(n, [], w);
  n.personality = p;
  return { w, n };
}

describe('R0568 favourite Keeper', () => {
  it('ten pets from the Sun Keeper: Sun is the favourite; the Moon Keeper gets a head tilt', () => {
    const { w, n } = adult(3);
    applyCommand(w, { kind: 'switchKeeper', alignment: 'sun' }, []);
    for (let i = 0; i < 10; i++) {
      w.timeMs += NEEDS.petCooldownMs + 10;
      petNubbin(w, n, []);
    }
    expect(favouriteKeeper(n)).toBe('sun');
    expect(fondGreet(n, w)).toBe(1.5);
    applyCommand(w, { kind: 'switchKeeper', alignment: 'moon' }, []);
    expect(fondGreet(n, w)).toBe(1);
    n.behavior.state = 'wander';
    n.behavior.untilMs = w.timeMs;
    w.keeper.pos = { x: n.pos.x + 2, z: n.pos.z };
    let tilted = false;
    for (let t = 0; t < 300 && !tilted; t++) {
      n.needs.hunger = 1;
      n.needs.energy = 1;
      stepWorld(w, 100);
      tilted = n.behavior.itemId === 'tiltHead';
    }
    expect(tilted).toBe(true);
    expect(soulLookKind(n)).toBe('tiltHead');
    // Once per switch: not again for the same Keeper.
    n.behavior.untilMs = w.timeMs;
    for (let t = 0; t < 100; t++) {
      stepWorld(w, 100);
      if (t > 25) expect(n.behavior.itemId).not.toBe('tiltHead');
    }
  });
});

describe('R0569 favourite spot', () => {
  it('rolled from the seed; a curious one moves on each sim day', () => {
    const { w, n } = adult(4, 'curious');
    const a = favSpot(n, w).id;
    let moved = false;
    for (let d = 1; d < 8 && !moved; d++) {
      w.timeMs = d * FAV_SPOT.curiousDayMs;
      moved = favSpot(n, w).id !== a;
    }
    expect(moved).toBe(true);
  });

  it('in a 30 min run it spends at least 20% of its wander time near its spot', () => {
    for (const seed of [21, 22, 23]) {
      const { w, n } = adult(seed);
      const at = favSpot(n, w).at;
      let wander = 0;
      let near = 0;
      for (let t = 0; t < 30 * 600; t++) {
        n.needs.hunger = 1;
        n.needs.energy = 1;
        w.keeper.pos = { x: -20, z: -20 };
        stepWorld(w, 100);
        if (n.behavior.state !== 'wander') continue;
        wander++;
        if (Math.hypot(n.pos.x - at.x, n.pos.z - at.z) < 4) near++;
      }
      expect(near / wander, `seed ${seed}`).toBeGreaterThanOrEqual(0.2);
    }
  }, 120_000);
});
