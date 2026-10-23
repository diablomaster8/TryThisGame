/**
 * S24 with the kept stone: in every band, each of the five scenes swaps exactly one line,
 * the band's own running-Nubbin line, for a still one in that band's words. The bands
 * rewrite these lines, so a swap by position would hit the wrong line or leave main's words.
 */
import { describe, expect, it } from 'vitest';
import * as EDU from '../../src/content/edu';
import { registerEduContent, registerSideStories, sceneFor } from '../../src/sim/story-scenes';
import { SIDE_STORY_CONTENT } from '../../src/sim/side-story-content';
import { c, campaignWorld } from './campaign-driver';

registerSideStories(SIDE_STORY_CONTENT);
registerEduContent(EDU);

const SCENES = ['s24-tea', 's24-pack', 's24-falls-top', 's24-rock', 's24-whistle'];
const CAP = { main: 160, sprout: 14, reader: 30 } as const;

describe('S24 kept-stone Nubbin lines', () => {
  for (const band of ['main', 'sprout', 'reader'] as const) {
    it(`swaps one line per scene in the ${band} band`, () => {
      const { world } = campaignWorld();
      for (const id of SCENES) {
        const plain = sceneFor(world, id, band)!.lines.map((l) => l.text);
        c(world).flags.keptStone = true;
        const still = sceneFor(world, id, band)!.lines.map((l) => l.text);
        delete c(world).flags.keptStone;
        const changed = still.filter((t, i) => t !== plain[i]);
        expect(changed, `${band} ${id}`).toHaveLength(1);
        const words = changed[0]!.split(/\s+/).length;
        if (band === 'main') expect(changed[0]!.length).toBeLessThanOrEqual(CAP.main);
        else expect(words, `${band} ${id}: ${changed[0]}`).toBeLessThanOrEqual(CAP[band]);
      }
    });
  }
});
