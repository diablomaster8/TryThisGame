import { describe, expect, it } from 'vitest';
import { GROVE, KEEPER, SIM } from '../../src/config/tuning';
import { placeDecor } from '../../src/sim/decorate';
import { clearGroveRoute, groveLeg } from '../../src/sim/nav';
import { blocked } from '../../src/sim/obstacles';
import { Rng } from '../../src/sim/rng';
import { applyCommand, createWorld, stepWorld } from '../../src/sim/world';
import type { SimEvent, Vec2, World } from '../../src/sim/types';

// MOVE-06: tap-to-move in the Grove follows a real path, or is refused at once.

const inPond = (p: Vec2): boolean =>
  Math.hypot(p.x - GROVE.pond.x, p.z - GROVE.pond.z) < GROVE.pond.r + 0.5;

function bare(seed = 1): World {
  const w = createWorld(seed, 0);
  w.nubbins = [];
  return w;
}

/** Tap, then step until the Keeper stops; how far it walked, and where it ended. */
function tap(w: World, to: Vec2, maxSteps = 900): { walked: number; steps: number } {
  applyCommand(w, { kind: 'moveKeeperTo', pos: to }, []);
  let walked = 0;
  let steps = 0;
  for (; steps < maxSteps && w.keeper.moveTarget; steps++) {
    const a = { ...w.keeper.pos };
    stepWorld(w, SIM.stepMs);
    walked += Math.hypot(w.keeper.pos.x - a.x, w.keeper.pos.z - a.z);
  }
  return { walked, steps };
}

describe('Grove pathfinding (MOVE-06)', () => {
  it('reaches the spots where steering used to press for good', () => {
    for (const spot of [
      { x: 17.4, z: 0.1 },
      { x: 20.3, z: -0.6 },
      { x: 2.4, z: 9.1 },
    ]) {
      for (const from of [
        { x: 0, z: 4 },
        { x: 24, z: -12 },
        { x: 26, z: 8 },
      ]) {
        const w = bare();
        w.keeper.pos = { ...from };
        tap(w, spot);
        expect(w.keeper.moveTarget, `${from.x},${from.z} → ${spot.x},${spot.z}`).toBeNull();
      }
    }
  });

  it('arrives at every random open tap, on a short path', () => {
    const rng = new Rng(42);
    const w = bare();
    const ratios: number[] = [];
    let arrived = 0;
    let tries = 0;
    while (tries < 120) {
      const to = { x: (rng.next() * 2 - 1) * 40, z: (rng.next() * 2 - 1) * 40 };
      if (blocked(to, w, 0.35) || inPond(to)) continue;
      tries++;
      const from = { ...w.keeper.pos };
      const straight = Math.hypot(to.x - from.x, to.z - from.z);
      const { walked } = tap(w, to);
      const d = Math.hypot(w.keeper.pos.x - to.x, w.keeper.pos.z - to.z);
      if (w.keeper.moveTarget === null && d <= KEEPER.arriveRadius + 0.6) arrived++;
      if (straight > 4) ratios.push(walked / straight);
    }
    expect(arrived).toBe(tries);
    ratios.sort((a, b) => a - b);
    expect(ratios[Math.floor(ratios.length / 2)]!).toBeLessThanOrEqual(1.1);
  });

  it('refuses a care walk to somewhere shut in, straight away', () => {
    const w = createWorld(1, 0);
    const n = w.nubbins[0]!;
    n.stage = 'child';
    // A Nubbin in a closed fence pen: nothing the Keeper can reach is within arm's length.
    w.inventory.decor.fence = 16;
    const [cx, cz] = [-26, 0];
    for (const o of [-1.5, -0.5, 0.5, 1.5])
      for (const side of [-2, 2]) {
        expect(placeDecor(w, 'fence', { x: cx + o, z: cz + side }, [], 0)).toBe(true);
        expect(placeDecor(w, 'fence', { x: cx + side, z: cz + o }, [], Math.PI / 2)).toBe(true);
      }
    n.pos = { x: cx, z: cz };
    w.keeper.pos = { x: 0, z: 4 };
    const events: SimEvent[] = [];
    applyCommand(w, { kind: 'pet', nubbinId: n.id }, events);
    events.push(...stepWorld(w, SIM.stepMs));
    expect(events.some((e) => e.kind === 'cantReach')).toBe(true);
  });

  it('plans a path quickly', () => {
    const w = bare();
    groveLeg(w, { x: 0, z: 4 }, { x: 1, z: 4 }); // build the grid once
    const rng = new Rng(9);
    const times: number[] = [];
    // The first 20 plans warm the JIT up and are not timed.
    for (let i = 0; i < 80; i++) {
      const a = { x: (rng.next() * 2 - 1) * 40, z: (rng.next() * 2 - 1) * 40 };
      const b = { x: (rng.next() * 2 - 1) * 40, z: (rng.next() * 2 - 1) * 40 };
      clearGroveRoute(w);
      const t0 = performance.now();
      groveLeg(w, a, b);
      if (i >= 20) times.push(performance.now() - t0);
    }
    times.sort((x, y) => x - y);
    // About 2 ms at p95 alone on a desktop (MOVE-06); the bound leaves room for a loaded
    // CI runner sharing the CPU with the rest of the suite.
    expect(times[Math.floor(times.length / 2)]!).toBeLessThan(1.5);
    expect(times[Math.floor(times.length * 0.95)]!).toBeLessThan(10);
  });
});
