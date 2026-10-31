/**
 * The language fonts (CV3), self-hosted from Fontsource at pinned versions: Noto Sans
 * Hebrew (niqqud placed by the font), Noto Sans JP (split by unicode range, so a page
 * fetches only the glyphs it shows) and Klee One, a textbook-style face whose strokes
 * match handwriting, for tracing. They load the first time a Hebrew or Japanese word is
 * shown, so the main game never downloads them.
 */
const SHEETS: Record<'he' | 'ja', () => Promise<unknown>[]> = {
  he: () => [
    import('@fontsource/noto-sans-hebrew/hebrew-400.css'),
    import('@fontsource/noto-sans-hebrew/hebrew-700.css'),
  ],
  ja: () => [
    import('@fontsource/noto-sans-jp/400.css'),
    import('@fontsource/noto-sans-jp/700.css'),
    import('@fontsource/klee-one/japanese-400.css'),
    import('@fontsource/klee-one/japanese-600.css'),
  ],
};
const loading: Partial<Record<'he' | 'ja', Promise<unknown>>> = {};

/**
 * Load one language's fonts (R0490: a Hebrew word no longer pulls in the Japanese
 * stylesheets, nor the other way round). Each stylesheet's unicode ranges still mean only
 * the glyph files a page shows are fetched.
 */
export function loadLangFonts(lang: 'he' | 'ja'): Promise<unknown> {
  const p = (loading[lang] ??= Promise.all(SHEETS[lang]()).catch(() => {
    // A failed fetch (offline, a flaky phone connection) is tried again next time a word in
    // that language is shown, not remembered as done for the session (review C, 27).
    delete loading[lang];
  }));
  return p;
}
