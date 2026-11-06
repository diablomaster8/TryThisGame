import { describe, expect, it } from 'vitest';
import { HEBREW_COURSE } from '../../src/content/lang-hebrew';
import { JAPANESE_COURSE } from '../../src/content/lang-japanese';
import { metGlyphs } from '../../src/ui/trace-book';

describe('R0707 tracing book', () => {
  it('lists each traceable glyph of the met words once, in order', () => {
    const shalom = HEBREW_COURSE.vocab.find((w) => w.id === 'he-shalom')!;
    const g = metGlyphs([shalom, shalom]);
    expect(new Set(g.map((x) => x.glyph)).size).toBe(g.length);
    expect(g.length).toBeGreaterThan(0);
    expect(g.every((x) => x.lang === 'he')).toBe(true);
  });
  it('is empty when no word is met, and covers kana for Japanese words', () => {
    expect(metGlyphs([])).toEqual([]);
    const ja = metGlyphs(JAPANESE_COURSE.vocab.slice(0, 5));
    expect(ja.every((x) => x.lang === 'ja')).toBe(true);
  });
});
