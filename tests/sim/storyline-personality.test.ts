import { describe, expect, it } from 'vitest';
import { checkMet } from '../../src/sim/storyline-checks';
import { hatch } from '../../src/sim/lifecycle';
import type { CampaignState, SimEvent } from '../../src/sim/types';
import { createWorld } from '../../src/sim/world';

/** R0584 (lane A r11): story checks read personality, trait, friends and rivals, read-only. */
describe('story checks read the Nubbin that was raised (R0584)', () => {
  const setup = () => {
    const world = createWorld(7, 0);
    const events: SimEvent[] = [];
    const [a, b] = world.nubbins as [(typeof world.nubbins)[0], (typeof world.nubbins)[0]];
    hatch(a, events, 0);
    hatch(b, events, 0);
    world.partners[0] = a.id;
    const c = { flags: {}, seen: [] } as unknown as CampaignState;
    return { world, a, b, c };
  };

  it('plays a personality:shy variant for a shy partner only', () => {
    const { world, a, c } = setup();
    a.personality = 'shy';
    expect(checkMet(world, c, 'personality:shy')).toBe(true);
    expect(checkMet(world, c, 'partner:personality:shy')).toBe(true);
    expect(checkMet(world, c, 'personality:bold')).toBe(false);
    a.personality = 'cheerful';
    expect(checkMet(world, c, 'personality:shy')).toBe(false);
  });

  it('reads best friends and rivals without writing anything', () => {
    const { world, a, b, c } = setup();
    expect(checkMet(world, c, 'bestFriend:any')).toBe(false);
    a.friends = { [b.id]: 100 };
    expect(checkMet(world, c, 'bestFriend:any')).toBe(true);
    expect(checkMet(world, c, 'rival:any')).toBe(false);
    a.rivals = { [b.id]: 100 };
    expect(checkMet(world, c, 'rival:any')).toBe(true);
    expect(a.friends).toEqual({ [b.id]: 100 });
  });

  it('never matches without a partner', () => {
    const { world, c } = setup();
    world.partners[0] = null;
    expect(checkMet(world, c, 'personality:shy')).toBe(false);
  });
});
