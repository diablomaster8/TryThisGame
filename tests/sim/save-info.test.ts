/** R0659 (CAMP-67): the Saves panel's wording of a save's age and size (ui/save-info.ts). */
import { describe, expect, it } from 'vitest';
import {
  formatBytes,
  formatSavedAgo,
  saveInfoLines,
  savedAtOfJson,
  storedBytes,
} from '../../src/ui/save-info';

describe('save info (R0659)', () => {
  it('sizes: bytes, then KB with a decimal under 10 KB', () => {
    expect(formatBytes(512)).toBe('512 bytes');
    expect(formatBytes(1536)).toBe('1.5 KB');
    expect(formatBytes(204_800)).toBe('200 KB');
  });

  it('ages: just now, seconds, minutes, hours, days, and never', () => {
    const now = 1_000_000_000;
    expect(formatSavedAgo(now, 0)).toBe('Not saved yet');
    expect(formatSavedAgo(now, now - 2000)).toBe('Saved just now');
    expect(formatSavedAgo(now, now - 12_000)).toBe('Saved 12 seconds ago');
    expect(formatSavedAgo(now, now - 60_000)).toBe('Saved 1 minute ago');
    expect(formatSavedAgo(now, now - 3 * 3_600_000)).toBe('Saved 3 hours ago');
    expect(formatSavedAgo(now, now - 2 * 86_400_000)).toBe('Saved 2 days ago');
  });

  it('the size shown matches the stored length; a broken save reads as unstamped', () => {
    const json = JSON.stringify({ savedAtWallMs: 5000, world: { x: 'é'.repeat(600) } });
    expect(storedBytes(json)).toBe(json.length * 2);
    expect(savedAtOfJson(json)).toBe(5000);
    expect(savedAtOfJson('{nope')).toBe(0);
    expect(savedAtOfJson(null)).toBe(0);
  });

  it('lines: current slot, the second copy once it answers, and unreadable copies', () => {
    const json = JSON.stringify({ savedAtWallMs: 90_000, world: {} });
    const now = 100_000;
    const size = formatBytes(json.length * 2);
    expect(saveInfoLines({ nowMs: now, current: json, mirror: undefined, unreadable: 0 })).toEqual([
      `Saved 10 seconds ago · ${size}`,
    ]);
    const all = saveInfoLines({ nowMs: now, current: json, mirror: null, unreadable: 2 });
    expect(all).toHaveLength(3);
    expect(all[1]).toMatch(/No second copy/);
    expect(all[2]).toMatch(/^2 unreadable saves/);
    const mirrored = saveInfoLines({ nowMs: now, current: null, mirror: json, unreadable: 0 });
    expect(mirrored[0]).toBe('Not saved yet');
    expect(mirrored[1]).toMatch(/^Second copy in this browser: Saved 10 seconds ago/);
  });
});
