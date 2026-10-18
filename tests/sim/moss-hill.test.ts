import { describe, expect, it } from 'vitest';
import { EGG } from '../../src/config/tuning';
import { hasRoom, mossOnHill, mossSeat, rosterCap, rosterNubbins } from '../../src/sim/roster';
import { tradeAway } from '../../src/sim/share';
import { applyCommand } from '../../src/sim/world';
import { c, campaignWorld, moss, tick } from './campaign-driver';

/**
 * Review B, minor bugs 23 and 24: Moss keeps to the western hill and out of the roster until
 * the story brings him down, the story's own Nubbins are never traded, and he never pushes
 * the roster past its cap.
 */

describe('Moss on the hill', () => {
  it('is not on the roster and does not count against the cap in the early chapters', () => {
    const { world } = campaignWorld();
    const m = moss(world)!;
    expect(mossOnHill(world, m.id)).toBe(true);
    expect(rosterNubbins(world).some((n) => n.id === m.id)).toBe(false);
    expect(rosterNubbins(world)).toHaveLength(world.nubbins.length - 1);
  });

  it('stays at his seat instead of wandering the Grove', () => {
    const { world, events } = campaignWorld();
    const m = moss(world)!;
    m.pos = { x: 0, z: 0 };
    tick(world, events, 120);
    const seat = mossSeat(world);
    expect(Math.hypot(m.pos.x - seat.x, m.pos.z - seat.z)).toBeLessThan(1);
  });

  it('joins the roster once he has come down in chapter 7, when there is room', () => {
    const { world, events } = campaignWorld();
    const st = c(world);
    const m = moss(world)!;
    // A full roster: he waits on the hill.
    applyCommand(world, { kind: 'debugGive', what: 'egg', amount: EGG.maxRoster }, events);
    expect(rosterNubbins(world)).toHaveLength(rosterCap(world));
    st.seen.push('c7-stillness');
    tick(world, events, 2);
    expect(mossOnHill(world, m.id)).toBe(true);
    expect(rosterNubbins(world).length).toBeLessThanOrEqual(rosterCap(world));
    // Room again: he comes down and counts.
    world.nubbins = world.nubbins.filter((n) => n.id === m.id || n !== rosterNubbins(world)[0]);
    tick(world, events, 2);
    expect(mossOnHill(world, m.id)).toBe(false);
    expect(rosterNubbins(world).some((n) => n.id === m.id)).toBe(true);
    expect(rosterNubbins(world).length).toBeLessThanOrEqual(rosterCap(world));
    expect(hasRoom(world)).toBe(false);
  });

  it('is never traded away', () => {
    const { world, events } = campaignWorld();
    const m = moss(world)!;
    expect(tradeAway(world, m.id, events)).toBeNull();
    applyCommand(world, { kind: 'tradeAway', nubbinId: m.id }, events);
    expect(moss(world)).toBeDefined();
  });

  it('is not doubled when the campaign starts again', () => {
    const { world, events } = campaignWorld();
    applyCommand(world, { kind: 'campaignStart' }, events);
    expect(world.nubbins.filter((n) => n.name === 'Moss')).toHaveLength(1);
  });
});
