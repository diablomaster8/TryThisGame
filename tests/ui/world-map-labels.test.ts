import { describe, expect, it } from 'vitest';
import { layoutChips, overlaps } from '../../src/ui/world-map';

/**
 * Phone pass (2026-11-06): the Map's place labels overlapped at 375 px. Labels never overlap
 * now: a minor one with no free spot near its pin is hidden, and required ones go first.
 */
describe('map label layout', () => {
  // A crowded 375 px map: twelve wide labels round one spot, three of them quest marks.
  const boxes = Array.from({ length: 12 }, (_, i) => ({
    ax: 180 + (i % 4) * 6,
    ay: 180 + Math.floor(i / 4) * 6,
    w: 150,
    h: 30,
    minor: i >= 3,
  }));

  it('never overlaps two shown labels on a narrow view', () => {
    const at = layoutChips(boxes, 375, 375);
    const shown = at.flatMap((p, i) => (p ? [{ ...p, w: boxes[i]!.w, h: boxes[i]!.h }] : []));
    for (let i = 0; i < shown.length; i++)
      for (let j = i + 1; j < shown.length; j++) expect(overlaps(shown[i]!, shown[j]!)).toBe(false);
  });

  it('always shows the required labels and hides only minor ones', () => {
    const at = layoutChips(boxes, 375, 375);
    for (let i = 0; i < 3; i++) expect(at[i]).not.toBeNull();
    expect(at.filter((p) => p === null).length).toBeGreaterThan(0);
  });

  it('shows every label when there is room', () => {
    const at = layoutChips(boxes, 1600, 1600);
    expect(at.every((p) => p !== null)).toBe(true);
  });
});
