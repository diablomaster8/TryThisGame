import { afterEach, describe, expect, it } from 'vitest';
import { sideStory } from '../../src/sim/story-scenes';
import { seen } from '../../src/sim/story-state';
import { c } from './campaign-driver';
import { runUntil, status } from './side-driver';

// Review 2026-10-21, Risks: side stories were not filtered by the Mature content setting.
// None is rated 'teen' today, so S21 is re-rated for the test to stand in for a future one.
describe('side stories follow the Mature content setting', () => {
  const quest = sideStory('s21')!;
  const original = quest.audience;
  afterEach(() => {
    quest.audience = original;
  });

  it('a teen side story stays shut with Mature content off and opens at 13+', () => {
    quest.audience = 'teen';
    const r = runUntil((w) => seen(c(w), 'c3-open'));
    expect(r.world.settings.matureContent).toBe('off');
    runUntil((w) => status(r, 's21') !== undefined || c(w).chapter >= 4, [], {}, r);
    expect(status(r, 's21')).toBeUndefined();
    r.world.settings.matureContent = 'teen';
    runUntil((w) => status(r, 's21') !== undefined || c(w).chapter >= 6, [], {}, r);
    expect(status(r, 's21')).toBeDefined();
  });
});
