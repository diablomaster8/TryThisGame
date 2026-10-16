/**
 * The language fonts (CV3), self-hosted from Fontsource at pinned versions: Noto Sans
 * Hebrew (niqqud placed by the font), Noto Sans JP (split by unicode range, so a page
 * fetches only the glyphs it shows) and Klee One, a textbook-style face whose strokes
 * match handwriting, for tracing. They load the first time a Hebrew or Japanese word is
 * shown, so the main game never downloads them.
 */
let loading: Promise<unknown> | null = null;

export function loadLangFonts(): Promise<unknown> {
  loading ??= Promise.all([
    import('@fontsource/noto-sans-hebrew/hebrew-400.css'),
    import('@fontsource/noto-sans-hebrew/hebrew-700.css'),
    import('@fontsource/noto-sans-jp/400.css'),
    import('@fontsource/noto-sans-jp/700.css'),
    import('@fontsource/klee-one/japanese-400.css'),
    import('@fontsource/klee-one/japanese-600.css'),
  ]).catch(() => undefined);
  return loading;
}
