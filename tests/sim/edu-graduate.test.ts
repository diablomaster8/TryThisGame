import { describe, expect, it } from 'vitest';
import { keepsakeLook } from '../../src/config/keepsake-looks';
import { CERTIFICATE_KEEPSAKE, eduToCampaign } from '../../src/sim/edu-graduate';
import { graduateOfferDue } from '../../src/ui/graduate';
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
  it('gives the certificate a look so the cottage shelf can show it', () => {
    expect(keepsakeLook(CERTIFICATE_KEEPSAKE)).toMatchObject({ shape: 'letter' });
  });
  it('offers Continue as a Keeper only once a reader story has ended', () => {
    const { world, events } = campaignWorld();
    expect(graduateOfferDue(world)).toBe(false);
    applyCommand(world, { kind: 'eduStart', age: 6, band: 'reader' }, events);
    expect(graduateOfferDue(world)).toBe(false);
    world.campaign!.ending = 'open';
    expect(graduateOfferDue(world)).toBe(true);
    world.edu!.band = 'sprout';
    expect(graduateOfferDue(world)).toBe(false);
  });
});
