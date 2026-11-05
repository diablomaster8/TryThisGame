/** Lane C round 13 (R0629, CAMP-37): the kid open flow's remaining pieces. */
import { describe, expect, it } from 'vitest';
import { QUESTS } from '../../src/config/tuning';
import { questMarkers } from '../../src/render/quest-markers';
import { kidFlow } from '../../src/sim/quest-offers';
import { sideStory } from '../../src/sim/story-scenes';
import type { SimEvent } from '../../src/sim/types';
import { applyCommand, createWorld } from '../../src/sim/world';
import { pitchForProfile } from '../../src/ui/offer-card';

describe('R0629: kid open flow, round 13', () => {
  it('a child pitch without a written one is the first goal, kept to 14 words', () => {
    const q = sideStory('s1')!;
    const long = {
      ...q,
      pitchChild: undefined,
      steps: [
        {
          ...q.steps[0]!,
          goal: 'one two three four five six seven eight nine ten eleven twelve thirteen fourteen fifteen sixteen',
        },
      ],
    };
    const out = pitchForProfile(long, true).replace('…', '').trim().split(/\s+/);
    expect(out.length).toBeLessThanOrEqual(QUESTS.maxPitchWords);
  });

  it('markers are drawn for a child profile on the open flow, and flagged big', () => {
    const world = createWorld(11, 0);
    const events: SimEvent[] = [];
    applyCommand(world, { kind: 'eduStart', age: 5, band: 'sprout' }, events);
    if (!world.campaign) applyCommand(world, { kind: 'campaignStart' }, events);
    // Guided: no markers for a child.
    expect(questMarkers(world)).toEqual([]);
    world.settings.questFlow = 'open';
    expect(kidFlow(world)).toBe(true);
    for (const m of questMarkers(world)) expect(m.big).toBe(true);
  });
});
