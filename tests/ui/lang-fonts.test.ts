import { describe, expect, it } from 'vitest';
import { loadLangFonts } from '../../src/ui/lang-fonts';

// R0490: each language loads only its own font stylesheets, once.
describe('language fonts', () => {
  it('loads Hebrew and Japanese separately, each once', async () => {
    const he = loadLangFonts('he');
    expect(loadLangFonts('he')).toBe(he);
    const ja = loadLangFonts('ja');
    expect(ja).not.toBe(he);
    await Promise.all([he, ja]);
    expect(loadLangFonts('ja')).toBe(ja);
  });
});
