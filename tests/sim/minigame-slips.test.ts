/**
 * A minigame is time spent with its Nubbin (review 2026-10-21, bug 21): while the HUD sends
 * `playingWith` for the runner, its slip timers start again, so no "felt lonely" or "was
 * hungry" slip lands mid-race; the other Nubbins still slip as before.
 */
import { describe, expect, it } from 'vitest';
import { SIM, SLIPS } from '../../src/config/tuning';
import { hatch } from '../../src/sim/lifecycle';
import type { SimEvent } from '../../src/sim/types';
import { applyCommand, createWorld, stepWorld } from '../../src/sim/world';

describe('slips during a minigame', () => {
  it('holds the runner’s slips and no one else’s', () => {
    const world = createWorld(1, 0);
    const [runner, other] = world.nubbins;
    hatch(runner!, [], 0);
    hatch(other!, [], 0);
    const events: SimEvent[] = [];
    const steps = Math.ceil(SLIPS.afterMs / SIM.stepMs) + 2;
    for (let i = 0; i < steps; i++) {
      for (const n of [runner!, other!]) {
        n.needs.hunger = 0.05;
        n.needs.energy = 1;
      }
      events.push(...stepWorld(world, SIM.stepMs));
      // The HUD sends this every refresh while the minigame is open.
      if (i % 2 === 0) applyCommand(world, { kind: 'playingWith', nubbinId: runner!.id }, events);
    }
    const slipped = events.filter((e) => e.kind === 'slip').map((e) => e.nubbinId);
    expect(slipped).not.toContain(runner!.id);
    expect(slipped).toContain(other!.id);
    expect(runner!.slipCount).toBe(0);
  });
});
