import { describe, expect, it } from 'vitest';
import { applyCommand } from '../../src/sim/world';
import { campaignWorld } from './campaign-driver';

describe('R0741 Nubbin keepsakes', () => {
  it('50 counting stars grant the abacus once, and not before', () => {
    const { world, events } = campaignWorld();
    applyCommand(world, { kind: 'eduStart', age: 5, band: 'sprout' }, events);
    for (let i = 0; i < 16; i++)
      applyCommand(world, { kind: 'eduResult', game: 'counting', stars: 3 }, events);
    expect(world.edu!.progress.counting.stars).toBe(48);
    expect(world.inventory.keepsakes).not.toContain('edu-abacus');
    applyCommand(world, { kind: 'eduResult', game: 'counting', stars: 3 }, events);
    applyCommand(world, { kind: 'eduResult', game: 'counting', stars: 3 }, events);
    expect(world.inventory.keepsakes.filter((k) => k === 'edu-abacus')).toHaveLength(1);
    expect(world.inventory.keepsakes).not.toContain('edu-book');
  });
});
