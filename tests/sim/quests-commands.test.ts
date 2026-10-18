import { describe, expect, it } from 'vitest';
import { SIM } from '../../src/config/tuning';
import { refreshQuests } from '../../src/sim/quests';
import { Rng } from '../../src/sim/rng';
import type { SimEvent } from '../../src/sim/types';
import { applyCommand, createWorld, stepWorld } from '../../src/sim/world';

describe('requests count events from commands', () => {
  it('a visit sent as a command advances the visit request on the next step', () => {
    const world = createWorld(3, 0);
    const events: SimEvent[] = [];
    // Force a board that includes the visit request.
    const rng = Rng.fromSeed(1);
    // Each kind is asked once, so clear the board until the visit request comes up.
    for (let i = 0; i < 10 && !world.quests.some((q) => q.template === 'visit'); i++) {
      for (const q of world.quests) q.claimed = true;
      refreshQuests(world, rng, events);
    }
    const quest = world.quests.find((q) => q.template === 'visit');
    expect(quest).toBeDefined();
    applyCommand(world, { kind: 'visit', trainer: 'fern' }, events);
    stepWorld(world, SIM.stepMs);
    expect(quest!.progress).toBe(1);
    applyCommand(world, { kind: 'visit', trainer: null }, events);
    stepWorld(world, SIM.stepMs);
    expect(world.location).toBe('grove');
  });

  it('buying an unknown item leaves the purse alone', () => {
    const world = createWorld(1, 0);
    const events: SimEvent[] = [];
    world.inventory.shells = 100;
    applyCommand(world, { kind: 'buy', item: 'hat:crown' as never }, events);
    expect(world.inventory.shells).toBe(100);
    expect(events.some((e) => e.kind === 'bought' && !e.ok)).toBe(true);
  });
});
