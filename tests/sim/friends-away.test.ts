import { describe, expect, it } from 'vitest';
import { depart, hatch } from '../../src/sim/lifecycle';
import { createWorld, stepWorld } from '../../src/sim/world';
import type { World } from '../../src/sim/types';

// R0539 (SOUL-21): friends away fade slowly, and a departed buddy's flower gets visits.
function pair(): World {
  const w = createWorld(31, 0);
  for (const n of w.nubbins) hatch(n, [], 0);
  const [a, b] = w.nubbins;
  a!.friends = { [b!.id]: 50 };
  b!.friends = { [a!.id]: 50 };
  return w;
}

function keepWell(w: World): void {
  for (const n of w.nubbins) {
    n.needs.hunger = 1;
    n.needs.energy = 1;
    n.needs.happiness = 60;
  }
}

describe('R0539 friends away', () => {
  it('a friendship survives a 10-minute trip away', () => {
    const w = pair();
    const [a, b] = w.nubbins;
    w.nubbins = [a!];
    for (let t = 0; t < 10 * 600; t++) {
      keepWell(w);
      stepWorld(w, 100);
    }
    expect(a!.friends[b!.id]).toBeGreaterThan(0);
    w.nubbins.push(b!);
  });

  it('after a departure the friend visits the flower within 2 hours', () => {
    const w = pair();
    const [a, b] = w.nubbins;
    depart(b!, [], w);
    let visited = false;
    for (let t = 0; t < 2 * 60 * 600 && !visited; t++) {
      keepWell(w);
      stepWorld(w, 100);
      if (a!.behavior.state === 'perform' && a!.behavior.itemId === 'visitFlower') visited = true;
    }
    expect(a!.remembered?.[0]?.name).toBe(b!.name);
    expect(visited).toBe(true);
  });
});
