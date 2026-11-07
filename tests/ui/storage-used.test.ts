import { afterEach, describe, expect, it, vi } from 'vitest';
import { groveStorageBytes, storageLine } from '../../src/ui/storage-used';

afterEach(() => vi.unstubAllGlobals());

describe('storage used row (R0497)', () => {
  it('counts only Grove keys, two bytes a character', () => {
    const data: Record<string, string> = { 'grove.slot': 'abcd', other: 'zzzzzzzz' };
    vi.stubGlobal('localStorage', {
      get length() {
        return Object.keys(data).length;
      },
      key: (i: number) => Object.keys(data)[i] ?? null,
      getItem: (k: string) => data[k] ?? null,
    });
    expect(groveStorageBytes()).toBe(('grove.slot'.length + 4) * 2);
  });

  it('is null when storage is blocked', () => {
    vi.stubGlobal('localStorage', {
      get length(): number {
        throw new Error('blocked');
      },
    });
    expect(groveStorageBytes()).toBeNull();
  });

  it('words it as kB of about 5 MB', () => {
    expect(storageLine(312 * 1024, 5 * 1024 * 1024)).toBe('Storage used: 312 kB of about 5 MB');
  });
});
