import { describe, expect, it, vi } from 'vitest';

// A lazy chunk that fails once (offline, or a deploy removed it) must not stay failed:
// the loaders forget the rejected promise so the next call fetches again (review
// 2026-10-18, Bug 2).
//
// The second load gets a tiny stand-in for the edu chunk rather than the real one: the
// real chunk is megabytes of script and took over 30 s to transform under the full
// parallel run (review 2026-10-21, Bug 47). What is tested here is the retry, and the
// stand-in proves the loader really imported again. The real chunk's contents are
// covered by the Learning Grove tests.
describe('lazy story chunks', () => {
  it('a failed edu chunk load is retried on the next call', async () => {
    vi.resetModules();
    vi.doMock('../../src/content/edu', () => {
      throw new Error('chunk gone');
    });
    const first = await import('../../src/sim/story-scenes');
    await expect(first.loadEduScripts()).rejects.toThrow();
    expect(first.eduContent()).toBeNull();
    const stub = { eduSceneFor: () => undefined, EDU_LANG_QUESTS: [], EDU_LANG_COURSES: [] };
    vi.doMock('../../src/content/edu', () => stub);
    // Same module instance as before: only the rejected promise was dropped.
    await expect(first.loadEduScripts()).resolves.toBeUndefined();
    expect(first.eduContent()?.eduSceneFor).toBe(stub.eduSceneFor);
    vi.doUnmock('../../src/content/edu');
  }, 30_000);
});
