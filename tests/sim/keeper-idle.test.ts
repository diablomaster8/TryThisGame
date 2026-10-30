import { describe, expect, it } from 'vitest';
import { createWorld, stepWorld } from '../../src/sim/world';
import { keeperIdlePose } from '../../src/sim/keeper-idle';
import { sitWithBeat } from '../../src/render/sit-with';
import { KEEPER_IDLE, SIM } from '../../src/config/tuning';
import type { SimEvent, World } from '../../src/sim/types';

// R0352 (FUN-63) and R0355 (FUN-66): the idle Keeper's antics and rule three's sit.
// A live wall clock at local noon, so no bedtime gets in the way.
const NOON = new Date(2027, 4, 12, 12, 0, 0).getTime();
function hatched(): World {
  const w = createWorld(7, 0);
  for (const n of w.nubbins) {
    n.stage = 'child';
    n.stageMs = 0;
    n.needs.hunger = 1;
    n.needs.energy = 1;
    n.pos = { x: w.keeper.pos.x + 3, z: w.keeper.pos.z + 1 };
  }
  return w;
}

function run(w: World, ms: number, events: SimEvent[] = []): SimEvent[] {
  for (let t = 0; t < ms; t += SIM.stepMs)
    events.push(...stepWorld(w, SIM.stepMs, NOON + w.timeMs));
  return events;
}

describe('R0352 the idle Keeper', () => {
  it('reads the letter at 20 s, sits at 40 s, a Nubbin is on its way by 45 s and sits', () => {
    const w = hatched();
    run(w, 21_000);
    expect(keeperIdlePose(w)).toBe('letter');
    const events = run(w, 24_000);
    expect(keeperIdlePose(w)).toBe('sit');
    expect(events.some((e) => e.kind === 'keeperSat')).toBe(true);
    expect(w.keeper.sitWith).toBeDefined();
    run(w, 15_000, events);
    expect(events.some((e) => e.kind === 'sitBeside')).toBe(true);
    const n = w.nubbins.find((x) => x.id === w.keeper.sitWith)!;
    expect(n.behavior.state).toBe('sit');
  });

  it('never runs without a live wall clock (scripted runs and catch-up)', () => {
    const w = hatched();
    for (let t = 0; t < 45_000; t += SIM.stepMs) stepWorld(w, SIM.stepMs);
    expect(w.keeper.idleMs).toBeUndefined();
    expect(w.keeper.sitWith).toBeUndefined();
  });

  it('the sit earns rule-three affection, and moving ends it', () => {
    const w = hatched();
    run(w, 45_000);
    const n = w.nubbins.find((x) => x.id === w.keeper.sitWith)!;
    const before = n.needs.affection;
    run(w, 60_000);
    expect(n.needs.affection).toBeGreaterThan(before);
    w.keeper.input = { x: 1, z: 0 };
    run(w, 200);
    expect(w.keeper.sitWith).toBeUndefined();
    expect(keeperIdlePose(w)).toBeNull();
    expect(KEEPER_IDLE.sitMs).toBeLessThan(45_000);
  });
});

describe('R0355 sit-with gags', () => {
  it('a 30 s sit shows the lean, the doze and a snore bubble that pops', () => {
    const w = hatched();
    run(w, 60_000);
    const n = w.nubbins.find((x) => x.id === w.keeper.sitWith)!;
    const start = w.keeper.sitBesideMs!;
    const seen = { lean: false, doze: false, bubble: false, pop: false };
    for (let t = 0; t <= 30_000; t += 100) {
      const b = sitWithBeat(w, n, start + t);
      if (!b) continue;
      if (b.lean > 0) seen.lean = true;
      if (b.doze) seen.doze = true;
      if (b.bubble > 0) seen.bubble = true;
      if (b.bubbleN > 0 && b.bubble === 0) seen.pop = true;
    }
    expect(seen).toEqual({ lean: true, doze: true, bubble: true, pop: true });
  });
});
