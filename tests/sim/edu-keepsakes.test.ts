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

describe('R0741 keepsakes as hats', () => {
  const earn = (world: ReturnType<typeof campaignWorld>['world'], events: never[]) => {
    applyCommand(world, { kind: 'eduStart', age: 5, band: 'sprout' }, events);
    for (let i = 0; i < 18; i++)
      applyCommand(world, { kind: 'eduResult', game: 'counting', stars: 3 }, events);
  };

  it('the abacus goes in the hat box and onto a bare-headed first Nubbin', () => {
    const { world, events } = campaignWorld();
    const first = world.nubbins[0]!;
    first.hat = null;
    earn(world, events as never[]);
    expect(world.inventory.keepsakes).toContain('edu-abacus');
    expect(world.inventory.hats).toContain('edu-abacus');
    expect(first.hat).toBe('edu-abacus');
  });

  it('never takes a hat the Nubbin already wears off', () => {
    const { world, events } = campaignWorld();
    const first = world.nubbins[0]!;
    first.hat = 'straw';
    earn(world, events as never[]);
    expect(world.inventory.hats).toContain('edu-abacus');
    expect(first.hat).toBe('straw');
  });
});
