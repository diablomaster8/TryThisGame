import { describe, expect, it } from 'vitest';
import { newerCopy, savedAtOf } from '../../src/platform/save-mirror';

const save = (at: number): string => JSON.stringify({ savedAtWallMs: at, world: {} });

describe('save mirror choice', () => {
  it('reads savedAtWallMs, 0 when missing or broken', () => {
    expect(savedAtOf(save(5))).toBe(5);
    expect(savedAtOf('nope')).toBe(0);
    expect(savedAtOf(null)).toBe(0);
  });
  it('restores a mirror when localStorage lost the slot', () => {
    expect(newerCopy(null, save(1))).toBe('mirror');
  });
  it('keeps local when there is no mirror, on a tie, or when local is newer', () => {
    expect(newerCopy(save(1), null)).toBe('local');
    expect(newerCopy(save(2), save(2))).toBe('local');
    expect(newerCopy(save(3), save(2))).toBe('local');
  });
  it('takes the mirror when it is newer', () => {
    expect(newerCopy(save(2), save(3))).toBe('mirror');
  });
});
