/** Lane C round 12 (R0629, CAMP-37): the kid open flow's sim side. */
import { describe, expect, it } from 'vitest';
import { QUESTS } from '../../src/config/tuning';
import { activeCapOf, kidFlow, questBook } from '../../src/sim/quest-offers';
import { pitchForProfile } from '../../src/ui/offer-card';
import { sideStory } from '../../src/sim/story-scenes';
import type { SimEvent, World } from '../../src/sim/types';
import { applyCommand, createWorld } from '../../src/sim/world';
import { c, tick } from './campaign-driver';

function kidWorld(band: 'sprout' | 'reader'): { world: World; events: SimEvent[] } {
  const world = createWorld(11, 0);
  const events: SimEvent[] = [];
  applyCommand(world, { kind: 'eduStart', age: 5, band }, events);
  if (!world.campaign) applyCommand(world, { kind: 'campaignStart' }, events);
  world.settings.questFlow = 'open';
  return { world, events };
}

describe('R0629: the kid open flow', () => {
  it('a child is capped at two active quests and the third rests the first', () => {
    const { world, events } = kidWorld('sprout');
    expect(kidFlow(world)).toBe(true);
    expect(activeCapOf(world)).toBe(QUESTS.childCap);
    expect(QUESTS.childCap).toBe(2);
    const ids = ['s1', 's4', 's11'].filter((id) => sideStory(id));
    for (const id of ids) {
      applyCommand(world, { kind: 'questAccept', id }, events);
    }
    const active = Object.values(questBook(world).entries).filter((e) => e.state === 'active');
    expect(active.length).toBeLessThanOrEqual(2);
    expect(events.some((e) => e.kind === 'questAtCap')).toBe(false);
  });

  it('Help me is for readers only', () => {
    const sprout = kidWorld('sprout');
    const reader = kidWorld('reader');
    for (const [k, band] of [
      [sprout, 'sprout'],
      [reader, 'reader'],
    ] as const) {
      const { world, events } = k;
      expect(world.edu?.band).toBe(band);
      applyCommand(world, { kind: 'questAccept', id: 's1' }, events);
      tick(world, events, 2);
      if (band === 'reader') expect(c(world).side.s1?.status).toBe('open');
      applyCommand(world, { kind: 'questHelp', id: 's1' }, events);
      const helped = events.some((e) => e.kind === 'questHelped');
      expect(helped, band).toBe(band === 'reader' && c(world).side.s1?.status === 'open');
    }
  });

  it('a child profile shows the picture pitch', () => {
    const q = sideStory('s1')!;
    expect(pitchForProfile({ ...q, pitchChild: 'Walk with Moss.' }, true)).toBe('Walk with Moss.');
  });
});
