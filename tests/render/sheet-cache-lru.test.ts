/**
 * The sprite-sheet cache drops its least recently used sheets past its limit, disposing
 * them, but never one drawn recently, so a busy frame cannot thrash.
 */
import { describe, expect, it } from 'vitest';
import type { SpriteSheet } from '../../src/render/sprites/atlas';
import { SheetCache } from '../../src/render/sprites/sheets';

function fake(disposed: string[], key: string): SpriteSheet {
  return { dispose: () => disposed.push(key) } as unknown as SpriteSheet;
}

describe('SheetCache eviction', () => {
  it('evicts the stalest sheets once over the limit, and rebuilds them on demand', () => {
    let now = 0;
    const disposed: string[] = [];
    const cache = new SheetCache(() => now, { maxSheets: 3, idleMs: 1000 });
    for (const k of ['a', 'b', 'c']) {
      cache.get(k, () => fake(disposed, k));
      now += 2000;
    }
    cache.get('a', () => fake(disposed, 'a2')); // a is fresh again
    now += 2000;
    cache.get('d', () => fake(disposed, 'd'));
    expect(cache.size).toBe(3);
    expect(disposed).toEqual(['b']);
    let rebuilt = false;
    cache.get('b', () => {
      rebuilt = true;
      return fake(disposed, 'b');
    });
    expect(rebuilt).toBe(true);
  });

  it('keeps sheets drawn within the idle window even past the limit', () => {
    let now = 0;
    const disposed: string[] = [];
    const cache = new SheetCache(() => now, { maxSheets: 2, idleMs: 1000 });
    for (const k of ['a', 'b', 'c', 'd']) cache.get(k, () => fake(disposed, k));
    expect(cache.size).toBe(4);
    expect(disposed).toEqual([]);
    now = 5000;
    cache.get('e', () => fake(disposed, 'e'));
    expect(cache.size).toBe(2);
    expect(disposed).toEqual(['a', 'b', 'c']);
  });
});
