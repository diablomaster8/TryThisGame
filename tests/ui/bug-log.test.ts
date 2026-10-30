import { afterEach, describe, expect, it, vi } from 'vitest';
import { bugReport, noteError, noteEventKinds } from '../../src/platform/bug-log';

describe('TECH-33: the local bug report', () => {
  afterEach(() => vi.unstubAllGlobals());

  it('carries a thrown error and recent events, and stays under 100 kB', () => {
    const store = new Map<string, string>();
    vi.stubGlobal('sessionStorage', {
      getItem: (k: string) => store.get(k) ?? null,
      setItem: (k: string, v: string) => void store.set(k, v),
    });
    vi.stubGlobal('document', {
      querySelector: () => ({ src: 'http://x/assets/index-AbC123xy.js' }),
    });
    for (let i = 0; i < 40; i++) noteError('an uncaught error.', new Error(`boom ${i}`));
    noteEventKinds([{ kind: 'hatched' }, { kind: 'ate' }]);
    const small = JSON.parse(bugReport({ renderer: 'pixel', settings: {}, save: '{"v":1}' }));
    expect(small.build).toBe('index-AbC123xy.js');
    expect(small.errors).toHaveLength(30);
    expect(small.errors.at(-1).message).toBe('Error: boom 39');
    expect(small.events.slice(-2)).toEqual(['hatched', 'ate']);
    expect(small.save).toBe('{"v":1}');
    const big = bugReport({ renderer: '3d', settings: {}, save: 'x'.repeat(200_000) });
    expect(big.length).toBeLessThan(100_000);
  });
});
