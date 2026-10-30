/** Lane C round 8 (R0648): a Hazel's Grove slot card names its lines and its stories done. */
import { describe, expect, it } from 'vitest';
import { summarize } from '../../src/platform/storage';
import { slotStories } from '../../src/ui/title';

describe('slot cards and the story book', () => {
  it('shows the Hundred Days ended and Logged In running, and the stories done', () => {
    const world = {
      nubbins: [],
      timeMs: 1,
      lines: { hundred: { ending: 'harvest' }, logged: { ending: null } },
      campaign: {
        chapter: 6,
        storyline: null,
        ending: null,
        side: { s1: { status: 'done' }, s2: { status: 'open' } },
        fun: { q01: { status: 'done' }, q02: { status: 'closed' } },
      },
    };
    const s = summarize(JSON.stringify({ version: 13, savedAtWallMs: 0, world }))!;
    expect(s.lines).toEqual({ hundred: 'done', logged: 'active' });
    expect(s.questsDone).toBe(2);
    expect(slotStories(s)).toEqual(['🌾✓ ⌨', '2 stories done']);
  });

  it('an older save with no lines shows nothing new', () => {
    const s = summarize(JSON.stringify({ version: 12, world: { nubbins: [], campaign: {} } }))!;
    expect(slotStories(s)).toEqual([]);
  });
});
