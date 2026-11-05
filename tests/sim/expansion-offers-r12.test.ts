/** Lane C round 12 (R0657, CAMP-65): after the ending E1 to E3 are offers, not forced scenes. */
import { describe, expect, it } from 'vitest';
import { REGIONS } from '../../src/config/regions';
import { QUEST_OFFERS, STORY } from '../../src/config/tuning';
import { declineRule, questAreaKey, questBook } from '../../src/sim/quest-offers';
import { sideStory } from '../../src/sim/story-scenes';
import type { SimEvent } from '../../src/sim/types';
import { applyCommand } from '../../src/sim/world';
import { c, moss, runCampaign, sable, tick } from './campaign-driver';

describe('E1 to E3 as offers (R0657)', () => {
  it('decline free, and E1 waits for an offer in the Open flow after the ending', () => {
    for (const id of ['e1', 'e2', 'e3']) expect(declineRule(id)).toBe('free');
    const { world, events } = runCampaign(
      { 'c2-corvin': 'refuse', 'c3-open': 'slow', 'c9-open': 'confront', 'c12-open': 'free' },
      {
        7: (w) => {
          sable(w)!.trust = 80;
          sable(w)!.bond = true;
        },
        9: (w) => (moss(w)!.needs.affection = 80),
      },
    );
    expect(c(world).ending).toBe('hazels-grove');
    world.settings.questFlow = 'open';
    tick(world, events, STORY.dayMs / 1000 + 2);
    // Not forced: it has not opened on its own.
    expect(c(world).side.e1).toBeUndefined();
    const key = questAreaKey(sideStory('e1')!) ?? QUEST_OFFERS.hubArea;
    const [region, poi] = key.split('/');
    expect(region).toBe('grove');
    expect(poi).toBeTruthy();
    expect(poi).not.toBe('*');
    {
      const out: SimEvent[] = [];
      world.keeper.pos = { x: 0, z: -40 };
      tick(world, out, 2);
      world.keeper.pos = poiAt(poi!);
      world.keeper.moveTarget = null;
      tick(world, out, 2);
      expect(questBook(world).entries.e1?.state).toBe('offered');
      expect(c(world).side.e1).toBeUndefined();
      applyCommand(world, { kind: 'questDecline', id: 'e1' }, out);
    }
  });
});

function poiAt(id: string): { x: number; z: number } {
  const p = REGIONS.grove.pois.find((q) => q.id === id)!;
  return { x: p.x, z: p.z };
}
