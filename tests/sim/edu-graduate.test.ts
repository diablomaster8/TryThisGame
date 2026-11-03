import { describe, expect, it } from 'vitest';
import { CERTIFICATE_KEEPSAKE, eduToCampaign } from '../../src/sim/edu-graduate';
import { deserialize, serialize } from '../../src/sim/save';
import { applyCommand } from '../../src/sim/world';
import { campaignWorld, tick } from './campaign-driver';

describe('R0727 graduation', () => {
  it('turns a reader save into a campaign save with the same Nubbins and edu null', () => {
    const { world, events } = campaignWorld();
    applyCommand(world, { kind: 'eduStart', age: 6, band: 'reader' }, events);
    tick(world, events, 400);
    const names = world.nubbins.map((n) => n.id);
    const out = eduToCampaign(serialize(world, 1), 2);
    expect(out).not.toBeNull();
    const grown = deserialize(out!).world;
    expect(grown.edu).toBeNull();
    expect(grown.nubbins.map((n) => n.id)).toEqual(names);
    expect(grown.settings.matureContent).toBe('off');
    expect(grown.inventory.keepsakes).toContain(CERTIFICATE_KEEPSAKE);
  });
  it('leaves a save that is not a Learning Grove alone', () => {
    const { world } = campaignWorld();
    expect(eduToCampaign(serialize(world, 1), 2)).toBeNull();
  });
});
