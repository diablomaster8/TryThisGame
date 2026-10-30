import { describe, expect, it } from 'vitest';
import { evolve, hatch } from '../../src/sim/lifecycle';
import { likesOf } from '../../src/sim/likes';
import { favouredToy } from '../../src/sim/toy-soul';
import { createWorld, stepWorld } from '../../src/sim/world';
import type { Personality, ToyKind, World } from '../../src/sim/types';

// R0537 (SOUL-19): favourite toys and boredom. Two toys in the Grove for 120 sim minutes:
// play stops swallowing the day for every personality, and the favourite gets most of it.
const PS: Personality[] = ['cheerful', 'shy', 'mischievous', 'lazy'];

function toyAt(w: World, toy: ToyKind, x: number, z: number): void {
  w.items.push({
    id: `toy-${toy}`,
    kind: 'toy',
    pos: { x, z },
    y: 0,
    vel: { x: 0, y: 0, z: 0 },
    toy,
  });
}

function run(p: Personality): { play: number; fav: number } {
  const w = createWorld(77, 0);
  const n = w.nubbins[0]!;
  w.nubbins = [n];
  hatch(n, [], 0);
  evolve(n, [], w);
  n.personality = p;
  const fav = likesOf(n).toy;
  const other: ToyKind = fav === 'ball' ? 'blocks' : 'ball';
  // The favourite is the farther of the two.
  toyAt(w, other, n.pos.x + 2, n.pos.z);
  toyAt(w, fav, n.pos.x - 4, n.pos.z + 1);
  let play = 0;
  let onFav = 0;
  const steps = 120 * 600;
  for (let t = 0; t < steps; t++) {
    n.needs.hunger = 1;
    n.needs.energy = 1;
    w.keeper.pos = t % 600 < 300 ? { x: n.pos.x + 1.5, z: n.pos.z } : { x: 0, z: -30 };
    stepWorld(w, 100);
    if (n.behavior.state === 'play' && n.behavior.itemId?.startsWith('toy-')) {
      play++;
      if (n.behavior.itemId === `toy-${fav}`) onFav++;
    }
  }
  return { play: play / steps, fav: play ? onFav / play : 0 };
}

describe('R0537 favourite toys and boredom', () => {
  it('a favourite is chosen over a nearer plain toy, until it bores', () => {
    const w = createWorld(5, 0);
    const n = w.nubbins[0]!;
    const fav = likesOf(n).toy;
    toyAt(w, fav === 'ball' ? 'radio' : 'ball', n.pos.x + 1, n.pos.z);
    toyAt(w, fav, n.pos.x + 3, n.pos.z);
    expect(favouredToy(w, n, 0)?.toy.toy).toBe(fav);
    n.toyBoredom = { [`toy-${fav}`]: { v: 59, at: 0 } };
    expect(favouredToy(w, n, 0)?.toy.toy).not.toBe(fav);
    // Boredom fades by 0.2 a minute.
    expect(favouredToy(w, n, 300 * 60_000)?.toy.toy).toBe(fav);
  });

  it('a new toy is a novelty for ten minutes', () => {
    const w = createWorld(5, 0);
    const n = w.nubbins[0]!;
    const fav = likesOf(n).toy;
    toyAt(w, fav === 'ball' ? 'radio' : 'ball', n.pos.x + 1, n.pos.z);
    const k0 = favouredToy(w, n, 0)!.keen;
    w.items[0]!.bornMs = 0;
    expect(favouredToy(w, n, 60_000)!.keen).toBeCloseTo(k0 * 2);
    expect(favouredToy(w, n, 11 * 60_000)!.keen).toBeCloseTo(k0);
  });

  it('120 minutes with two toys: play 15–35% for each personality, favourite ≥ 50%', () => {
    for (const p of PS) {
      const r = run(p);
      expect(r.play, p).toBeGreaterThanOrEqual(0.15);
      expect(r.play, p).toBeLessThanOrEqual(0.35);
      expect(r.fav, p).toBeGreaterThanOrEqual(0.5);
    }
  }, 60_000);
});
