import { describe, expect, it } from 'vitest';
import { EGG, SEASONS, SIM, SKILLS, TREES } from '../../src/config/tuning';
import { catchUp, coarseStep } from '../../src/sim/offline';
import { deserialize, serialize } from '../../src/sim/save';
import type { SimEvent, World } from '../../src/sim/types';
import { createWorld, fruitIntervalMs, stepWorld } from '../../src/sim/world';

// Review 2026-10-21, Bugs 36 and 37: time away must grow fruit at the live rate, and a
// Keeper intent saved mid-walk must not play out during catch-up or after a load.
function hatched(): World {
  const w = createWorld(11, 0);
  for (let i = 0; i < EGG.hatchMs / SIM.stepMs + 1; i++) stepWorld(w, SIM.stepMs);
  return w;
}

describe('catch-up fruit timing matches live play', () => {
  function afterOneDrop(w: World): number {
    const tree = w.trees[0]!;
    tree.fruitTimerMs = 1;
    coarseStep(w, SIM.coarseStepMs, [] as SimEvent[]);
    return tree.fruitTimerMs - (1 - SIM.coarseStepMs);
  }

  it('uses the plain interval outside autumn without Green Thumb', () => {
    const w = hatched();
    w.season = 'spring';
    expect(afterOneDrop(w)).toBeCloseTo(TREES.fruitIntervalMs);
  });

  it('autumn shortens the interval while away too', () => {
    const w = hatched();
    w.season = 'autumn';
    expect(fruitIntervalMs(w)).toBeCloseTo(TREES.fruitIntervalMs * SEASONS.autumn.fruitInterval);
    expect(afterOneDrop(w)).toBeCloseTo(fruitIntervalMs(w));
  });

  it('Green Thumb shortens it while away too', () => {
    const w = hatched();
    w.season = 'spring';
    w.skills.greenThumb = true;
    expect(afterOneDrop(w)).toBeCloseTo(TREES.fruitIntervalMs * SKILLS.greenThumbFruitInterval);
  });
});

describe('Keeper intents and catch-up', () => {
  it('a load clears a saved intent and walk target', () => {
    const w = hatched();
    const n = w.nubbins[0]!;
    w.keeper.intent = { kind: 'pet', nubbinId: n.id };
    w.keeper.moveTarget = { x: 3, z: 3 };
    const loaded = deserialize(serialize(w, 0)).world;
    expect(loaded.keeper.intent).toBeNull();
    expect(loaded.keeper.moveTarget).toBeNull();
  });

  it('catch-up never walks to or acts on an intent', () => {
    const w = hatched();
    const n = w.nubbins[0]!;
    n.pos = { x: w.keeper.pos.x + 6, z: w.keeper.pos.z };
    const start = { ...w.keeper.pos };
    const happiness = n.needs.happiness;
    w.keeper.intent = { kind: 'pet', nubbinId: n.id };
    const report = catchUp(w, 30_000, 30_000); // under a minute: fine steps only
    expect(report.simulatedMs).toBeGreaterThan(0);
    expect(w.keeper.pos).toEqual(start);
    expect(n.needs.happiness).toBeLessThanOrEqual(happiness);
  });
});
