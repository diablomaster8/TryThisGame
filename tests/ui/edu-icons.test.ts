import { describe, expect, it } from 'vitest';
import { EDU_ANIMALS, EDU_WORDS } from '../../src/config/edu';
import { COUNT_ICONS } from '../../src/minigames/edu/games';
import { EDU_ICON_ART, EDU_ICON_INK } from '../../src/ui/edu-icons-art';
import { eduIconId } from '../../src/ui/edu-icons';

/** Lane E r10, R0715 (KIDS-47): every game picture is pixel art on the shared palette. */
describe('Learning Grove pixel pictures', () => {
  const emoji = [
    ...EDU_WORDS.map((w) => w.icon),
    ...EDU_ANIMALS.map((a) => a.icon),
    ...COUNT_ICONS,
  ];

  it('covers all 63 words, animals and counting things', () => {
    expect(emoji.length).toBe(63);
    for (const e of emoji) {
      const id = eduIconId(e);
      expect(id, e).not.toBeNull();
      expect(EDU_ICON_ART[id!], e).toBeDefined();
    }
  });

  it('draws each on a 12×12 grid in palette letters only', () => {
    for (const [id, rows] of Object.entries(EDU_ICON_ART)) {
      expect(rows.length, id).toBe(12);
      for (const r of rows) {
        expect(r.length, `${id}: ${r}`).toBe(12);
        for (const ch of r)
          expect(ch === '.' || EDU_ICON_INK[ch] !== undefined, `${id} ${ch}`).toBe(true);
      }
    }
  });

  it('keeps the pictures as drawn (visual snapshot)', () => {
    expect(EDU_ICON_ART).toMatchSnapshot();
  });
});
