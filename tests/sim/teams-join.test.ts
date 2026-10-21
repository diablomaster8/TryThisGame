import { describe, expect, it } from 'vitest';
import { applyCommand, createWorld } from '../../src/sim/world';
import type { SimEvent } from '../../src/sim/types';

// Review 2026-10-21, Bug 41: joining again must not wipe a team's points and rank.
describe('joinTeam', () => {
  it('is a no-op when the Keeper is already in a team', () => {
    const world = createWorld(1, 0);
    applyCommand(world, { kind: 'joinTeam', team: 'dawn' }, []);
    world.team!.points = 30;
    world.team!.rank = 2;
    const events: SimEvent[] = [];
    applyCommand(world, { kind: 'joinTeam', team: 'dusk' }, events);
    expect(world.team).toMatchObject({ id: 'dawn', points: 30, rank: 2 });
    expect(events.some((e) => e.kind === 'teamJoined')).toBe(false);
  });
});
