import { describe, expect, it } from 'vitest';
import { swimClip, swimStyle } from '../../src/render/swim-style';
import type { Nubbin } from '../../src/sim/types';

const at = (level: number) =>
  ({ stats: { swim: { points: level * 100 } } }) as unknown as Nubbin;

describe('swim styles (LOOK-23)', () => {
  it('picks paddle, breaststroke and crawl by Swim level', () => {
    expect(swimStyle(at(5))).toBe('paddle');
    expect(swimStyle(at(40))).toBe('breast');
    expect(swimStyle(at(80))).toBe('crawl');
    expect([swimClip(at(5)), swimClip(at(40)), swimClip(at(80))]).toEqual([
      'paddle',
      'swim',
      'crawl',
    ]);
  });
});
