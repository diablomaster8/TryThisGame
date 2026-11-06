import { describe, expect, it } from 'vitest';
import { HEBREW_STROKES } from '../../src/ui/hebrew-strokes';
import { KANA_STROKES } from '../../src/ui/kana-strokes';

describe('R0707 full tracing sets', () => {
  it('covers the whole alef-bet with finals and the 46 basic hiragana', () => {
    expect(Object.keys(HEBREW_STROKES).length).toBeGreaterThanOrEqual(27);
    expect(Object.keys(KANA_STROKES).length).toBeGreaterThanOrEqual(46);
    for (const g of 'אבגדהוזחטיכךלמםנןסעפףצץקרשת') expect(HEBREW_STROKES[g], g).toBeDefined();
    const hira =
      'あいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめもやゆよらりるれろわをん';
    for (const g of hira) expect(KANA_STROKES[g], g).toBeDefined();
  });
  it('every guide stays on the 0-100 board', () => {
    for (const set of [HEBREW_STROKES, KANA_STROKES])
      for (const [g, strokes] of Object.entries(set))
        for (const p of strokes.flat())
          expect(p.x >= 0 && p.x <= 100 && p.y >= 0 && p.y <= 100, g).toBe(true);
  });
});
