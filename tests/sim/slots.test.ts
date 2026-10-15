import { describe, expect, it } from 'vitest';
import { SLOTS_PER_MODE, slotKey, summarize } from '../../src/platform/storage';
import { hatch } from '../../src/sim/lifecycle';
import { serialize } from '../../src/sim/save';
import type { SimEvent } from '../../src/sim/types';
import { createWorld } from '../../src/sim/world';

describe('save slots', () => {
  it('keeps the old keys for slot 1 so nobody loses a Grove, and separates the rest', () => {
    expect(slotKey({ mode: 'free', index: 1 })).toBe('grove.save.v1');
    expect(slotKey({ mode: 'campaign', index: 1 })).toBe('grove.save.campaign');
    expect(slotKey({ mode: 'edu', index: 1 })).toBe('grove.save.edu');
    const keys = new Set<string>();
    for (const mode of ['free', 'campaign', 'edu'] as const)
      for (let i = 1; i <= SLOTS_PER_MODE; i++) keys.add(slotKey({ mode, index: i }));
    expect(keys.size).toBe(3 * SLOTS_PER_MODE);
    // Out-of-range indexes clamp instead of inventing keys.
    expect(slotKey({ mode: 'free', index: 0 })).toBe('grove.save.v1');
    expect(slotKey({ mode: 'free', index: 99 })).toBe(slotKey({ mode: 'free', index: 3 }));
  });

  it('summarises a save without loading it', () => {
    const w = createWorld(4, 1_000);
    const events: SimEvent[] = [];
    for (const n of w.nubbins) hatch(n, events, 0);
    w.timeMs = 5_000;
    const s = summarize(serialize(w, 123_456));
    expect(s).not.toBeNull();
    expect(s!.savedAtWallMs).toBe(123_456);
    expect(s!.nubbins).toBe(w.nubbins.length);
    expect(s!.names.length).toBeGreaterThan(0);
    expect(s!.trainer).toBe(w.trainer);
    expect(s!.chapter).toBeNull();
    expect(s!.eduAge).toBeNull();
    expect(s!.playMs).toBe(5_000);
    expect(summarize('not json')).toBeNull();
    expect(summarize('{"version":2}')).toBeNull();
  });
});
