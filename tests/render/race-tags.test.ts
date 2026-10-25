/**
 * The pixel race's name tags never sit on one another (review 2026-10-24): a full field
 * bunched up, as at the start, still gets readable tags, the player's always.
 */
import { describe, expect, it } from 'vitest';
import { placeTags } from '../../src/minigames/race/pixel-view';
import { FONT_H, measureText } from '../../src/render/sprites/font';

describe('race name tags', () => {
  it('keeps every placed tag clear of the others and always places the player', () => {
    const names = ['PIP', 'CLOVER', 'BRAMBLE', 'MOCHI', 'DOT', 'TANSY', 'FLICK', 'SORREL'];
    // Eight runners side by side, lanes only 14 px apart: the worst case.
    const tags = names.map((text, i) => ({
      text,
      x: 60 + (i % 2) * 3,
      y: 100 + i * 7,
      sx: 40,
      player: i === 5,
    }));
    const out = placeTags(tags, 260);
    expect(out.some((t) => t.player)).toBe(true);
    expect(out.length).toBeGreaterThanOrEqual(6);
    for (const a of out)
      for (const b of out) {
        if (a === b) continue;
        const overlapX = a.x < b.x + measureText(b.text) && a.x + measureText(a.text) > b.x;
        const overlapY = a.y < b.y + FONT_H && a.y + FONT_H > b.y;
        expect(overlapX && overlapY, `${a.text} on ${b.text}`).toBe(false);
      }
  });
});
