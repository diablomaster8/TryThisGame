import { describe, expect, it } from 'vitest';
import { HEBREW_COURSE } from '../../src/content/lang-hebrew';
import { applyCommand } from '../../src/sim/world';
import { wordsByBox } from '../../src/ui/lang-boxes';
import { campaignWorld } from '../sim/campaign-driver';

describe('R0718 words by box', () => {
  it('groups met words by their Leitner box, unreviewed under 0', () => {
    const { world, events } = campaignWorld();
    applyCommand(world, { kind: 'eduStart', age: 6, band: 'reader' }, events);
    const [a, b, c] = HEBREW_COURSE.vocab;
    world.edu!.words[a!.id] = { heard: 2, used: 0, box: 3 };
    world.edu!.words[b!.id] = { heard: 1, used: 0 };
    world.edu!.words[c!.id] = { heard: 1, used: 0, box: 3 };
    const by = wordsByBox(world, HEBREW_COURSE.vocab);
    expect(by.get(3)?.map((w) => w.id)).toEqual([a!.id, c!.id]);
    expect(by.get(0)?.map((w) => w.id)).toEqual([b!.id]);
  });
});
