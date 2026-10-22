import { describe, expect, it, vi } from 'vitest';

// A lazy chunk that fails once (offline, or a deploy removed it) must not stay failed:
// the loaders forget the rejected promise so the next call fetches again (review
// 2026-10-18, Bug 2). Each Learning Grove band is its own chunk (review 2026-10-21).
describe('lazy story chunks', () => {
  it('a failed edu band chunk load is retried on the next call', async () => {
    vi.resetModules();
    vi.doMock('../../src/content/edu-sprout', () => {
      throw new Error('chunk gone');
    });
    const first = await import('../../src/sim/story-scenes');
    await expect(first.loadEduScripts(['sprout'])).rejects.toThrow();
    expect(first.eduContent()).toBeNull();
    vi.doUnmock('../../src/content/edu-sprout');
    vi.resetModules();
    // Same module instance as before: only the rejected promise was dropped.
    await expect(first.loadEduScripts(['sprout'])).resolves.toBeUndefined();
    expect(first.eduContent()).not.toBeNull();
    expect(first.eduBandLoaded('sprout')).toBe(true);
  }, 30_000); // the edu chunk is large and transforms slowly on a cold cache
});
