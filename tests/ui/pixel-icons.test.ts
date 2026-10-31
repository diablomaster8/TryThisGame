import { describe, expect, it } from 'vitest';
import { iconGridProblems, pixelIcon } from '../../src/ui/pixel-icons';

/** R0502 (TECH-61): every pixel icon is a full 12 x 12 grid in palette letters. */
describe('pixel icons', () => {
  it('are well formed', () => {
    expect(iconGridProblems()).toEqual([]);
  });
  it('fall back to the emoji without a DOM or for an unknown glyph', () => {
    expect(pixelIcon('🦄')).toBeNull();
  });
});
