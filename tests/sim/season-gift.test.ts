import { describe, expect, it } from 'vitest';
import { seasonHat } from '../../src/config/cosmetics';
import { stepSeasons } from '../../src/sim/seasons';
import { createWorld } from '../../src/sim/world';
import type { SimEvent } from '../../src/sim/types';

describe('seasonal hat gift (R0438)', () => {
  it('the first visit of a season gives its hat once and keeps it', () => {
    const world = createWorld(1, Date.UTC(2026, 6, 1));
    world.season = 'autumn';
    world.festivalSeen = null as never;
    const hat = seasonHat('autumn')!;
    world.inventory.hats = world.inventory.hats.filter((h) => h !== hat);
    const ev: SimEvent[] = [];
    stepSeasons(world, ev);
    expect(world.inventory.hats).toContain(hat);
    expect(ev[0]).toMatchObject({ kind: 'festival', giftHat: hat });
    stepSeasons(world, ev);
    expect(ev).toHaveLength(1);
    world.season = 'spring';
    expect(world.inventory.hats).toContain(hat);
  });
});
