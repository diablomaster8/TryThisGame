import { createEgg } from './nubbin';
import { setPartner } from './partners';
import { registerStorylineRule } from './storyline-rules';
import { counter } from './storyline-checks';
import { queueScene } from './story-state';
import { rollEggSpecies, trainerOf } from './trainers';
import type { CampaignState } from './types';
import { newId, uniqueName, withRng } from './world';

/**
 * SL2 "Logged In" (content/storyline-logged.ts): three starter eggs as the party, the two
 * servers as the Sun and Moon recolours, the bout button at a tier that rises with the
 * chapter, and an ending from the root-node choice and whether the party came through.
 */
export const LOGGED_AREAS = ['day', 'night'] as const;

/** The ending the flags add up to: Root's word or the company's, and whether all three came through. */
function loggedEnding(c: CampaignState): string {
  if (c.flags['l-root'] === 'spare') return 'quiet-exit';
  return counter(c, 'departed') > 0 ? 'one-short' : 'everyone-wakes';
}

/** The party's ids, from the comma-joined flag. */
export function partyIds(c: CampaignState): string[] {
  return typeof c.flags.party === 'string' && c.flags.party ? c.flags.party.split(',') : [];
}

/** The bout tier for the chapter: 1 in the lobby, up to 3 for the final bouts. */
export function boutTier(c: CampaignState): number {
  return c.chapter <= 3 ? 1 : c.chapter <= 6 ? 2 : 3;
}

registerStorylineRule({
  id: 'logged',
  areas: [...LOGGED_AREAS],
  setup: (world, c) => {
    withRng(world, (rng) => {
      const trainer = trainerOf(world.trainer);
      const eggs = [0, 1, 2].map((i) => {
        const egg = createEgg(
          newId(world, 'nub'),
          { x: -2 + i * 2, z: 2 },
          rng,
          'plain',
          rollEggSpecies(trainer, rng),
        );
        egg.name = uniqueName(world, egg.name, rng);
        return egg;
      });
      // The party joins the roster; the player's Nubbins stay (it may run past the cap).
      world.nubbins.push(...eggs);
      c.flags.cast = eggs.map((e) => e.id).join(',');
      c.flags.party = eggs.map((e) => e.id).join(',');
      setPartner(world, 0, eggs[0]!.id);
      setPartner(world, 1, eggs[1]!.id);
    });
    // Both servers exist from the start; the story opens the night one at rank two.
    world.unlocks.sunGrove = true;
    world.unlocks.moonGrove = true;
    world.grove = 'sun';
    c.flags.area = 'day';
  },
  onArea: (world, c, area) => {
    // The Night Grove opens with chapter 4; until then the switch is refused.
    if (area === 'night' && c.chapter < 4) {
      c.flags.area = 'day';
      return;
    }
    world.grove = area === 'night' ? 'moon' : 'sun';
  },
  // The last choice (l-juno) is answered inside the ending: its body plays as
  // `l-end-<ending>-<stayed|left>` straight after l-c8-close, ahead of the title card
  // (`end-logged-<ending>`), and the ending is fixed then so the two always agree.
  onScene: (_world, c, scene) => {
    if (scene !== 'l-c8-close') return;
    const ending = loggedEnding(c);
    c.flags['l-end'] = ending;
    queueScene(c, `l-end-${ending}-${c.flags['l-juno'] === 'stayed' ? 'stayed' : 'left'}`);
  },
  endingFor: (_world, c) => {
    const fixed = c.flags['l-end'];
    return typeof fixed === 'string' ? fixed : loggedEnding(c);
  },
  actions: (world, c) => [
    {
      id: 'bout',
      ui: 'partyBout',
      command: { kind: 'select', id: null },
      enabled:
        c.chapter <= 8 &&
        partyIds(c).some((id) => world.nubbins.some((n) => n.id === id && n.stage !== 'egg')),
    },
  ],
});

/** The party's ids, for the HUD's bout opener. */
export const loggedPartyIds = partyIds;
