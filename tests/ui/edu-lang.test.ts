import { describe, expect, it } from 'vitest';
import { EDU_TEXT } from '../../src/config/strings';
import { CHILDREN_TEXT } from '../../src/config/strings-children';
import { EDU_TEXT_ES } from '../../src/config/strings-edu-es';
import { EDU_TEXT_HE } from '../../src/config/strings-edu-he';
import { EDU_TEXT_JA } from '../../src/config/strings-edu-ja';
import {
  applyEduUiLanguage,
  EDU_UI_LANGUAGES,
  isEduUiLanguage,
  markEduDialog,
  uiDir,
} from '../../src/ui/edu-lang';

/** Every key path in a table (objects recurse, arrays and functions are leaves). */
function paths(t: Record<string, unknown>, prefix = ''): string[] {
  return Object.entries(t).flatMap(([k, v]) =>
    v && typeof v === 'object' && !Array.isArray(v)
      ? paths(v as Record<string, unknown>, `${prefix}${k}.`)
      : [`${prefix}${k}`],
  );
}
function strings(v: unknown): string[] {
  if (typeof v === 'string') return [v];
  if (Array.isArray(v)) return v.flatMap(strings);
  if (typeof v === 'function') return [(v as (...a: number[]) => string)(2, 5)];
  if (v && typeof v === 'object') return Object.values(v).flatMap(strings);
  return [];
}
const get = (t: Record<string, unknown>, path: string): unknown =>
  path.split('.').reduce<unknown>((o, k) => (o as Record<string, unknown> | undefined)?.[k], t);

describe('R0739 Learning Grove interface language', () => {
  it('lays Hebrew over the child-facing text, right to left, and restores English', () => {
    const en = EDU_TEXT.play;
    const enReady = EDU_TEXT.recommended(5);
    applyEduUiLanguage('he');
    expect(EDU_TEXT.play).toBe(EDU_TEXT_HE.play);
    expect(EDU_TEXT.gameNames.colours).toBe(EDU_TEXT_HE.gameNames.colours);
    expect(EDU_TEXT.roundOf(2, 5)).toContain('2');
    expect(uiDir('he')).toBe('rtl');
    expect(EDU_TEXT.recommended(5)).toBe(enReady);
    applyEduUiLanguage('en');
    expect(EDU_TEXT.play).toBe(en);
    expect(EDU_TEXT.gameNames.colours).toBe('Colours');
    expect(uiDir('en')).toBe('ltr');
  });
  it('has Hebrew for every game the picker names, with no Latin letters', () => {
    for (const v of Object.values(EDU_TEXT_HE.gameNames)) expect(v).not.toMatch(/[A-Za-z]/);
    expect(Object.keys(EDU_TEXT_HE.gameNames)).toEqual(
      Object.keys(EDU_TEXT.gameNames).filter((k) => k in EDU_TEXT_HE.gameNames),
    );
  });

  const heTable = EDU_TEXT_HE as unknown as Record<string, unknown>;
  for (const [code, table] of [
    ['es', EDU_TEXT_ES],
    ['ja', EDU_TEXT_JA],
  ] as const) {
    describe(code, () => {
      const t = table as unknown as Record<string, unknown>;
      it('has every key the Hebrew table has, and every game the picker names', () => {
        const have = new Set(paths(t));
        for (const p of paths(heTable)) expect(have, p).toContain(p);
        for (const g of Object.keys(EDU_TEXT.gameNames)) {
          expect(have, `gameNames.${g}`).toContain(`gameNames.${g}`);
          expect(have, `gameBlurbs.${g}`).toContain(`gameBlurbs.${g}`);
        }
        for (const g of Object.keys(EDU_TEXT.readerGameNames))
          expect(have, `readerGameNames.${g}`).toContain(`readerGameNames.${g}`);
      });
      it('keeps the shape of the Hebrew entries (strings, lists, functions)', () => {
        for (const p of paths(heTable)) {
          const a = get(heTable, p);
          const b = get(t, p);
          expect(typeof b, p).toBe(typeof a);
          if (Array.isArray(a)) expect((b as unknown[]).length, p).toBe(a.length);
          if (typeof a === 'function') expect((b as () => unknown).length, p).toBe(a.length);
        }
      });
      it('overlays on the shared text and restores English afterwards', () => {
        applyEduUiLanguage(code);
        expect(EDU_TEXT.play).toBe((t as { play: string }).play);
        expect(EDU_TEXT.play).not.toBe('Play & learn');
        expect(EDU_TEXT.roundOf(2, 5)).toContain('2');
        expect(EDU_TEXT.gameNames.colours).toBe(
          (t as { gameNames: { colours: string } }).gameNames.colours,
        );
        expect(uiDir(code)).toBe('ltr');
        applyEduUiLanguage('en');
        expect(EDU_TEXT.play).toBe('Play & learn');
        expect(EDU_TEXT.readerGameNames.counting).toBe('Sums');
      });
      it('has no English left in the covered screens', () => {
        for (const p of paths(t)) {
          const a = get(heTable, p);
          // Anything the Hebrew table covers (and the reader names) must be translated.
          if (a === undefined && !p.startsWith('readerGame')) continue;
          const vals = strings(get(t, p));
          const eng = strings(get(EDU_TEXT as unknown as Record<string, unknown>, p));
          if (code === 'ja') for (const v of vals) expect(v, p).not.toMatch(/[A-Za-z]/);
          if (vals.length === eng.length) vals.forEach((v, i) => expect(v, p).not.toBe(eng[i]));
        }
      });
    });
  }

  it('switching straight between languages leaves nothing of the last one behind', () => {
    applyEduUiLanguage('es');
    applyEduUiLanguage('ja');
    expect(EDU_TEXT.readerGameNames.counting).toBe(EDU_TEXT_JA.readerGameNames.counting);
    applyEduUiLanguage('he');
    expect(EDU_TEXT.readerGameNames.counting).toBe('Sums');
    expect(EDU_TEXT.play).toBe(EDU_TEXT_HE.play);
    applyEduUiLanguage('en');
    expect(EDU_TEXT.gameBlurbs.colours).toBe('Find the colour, then sort by colour.');
  });

  it('the grown-up picker lists all three languages beside English', () => {
    expect(Object.keys(CHILDREN_TEXT.uiLanguages)).toEqual(['en', 'he', 'es', 'ja']);
    expect([...EDU_UI_LANGUAGES]).toEqual(Object.keys(CHILDREN_TEXT.uiLanguages));
    for (const id of EDU_UI_LANGUAGES) expect(isEduUiLanguage(id)).toBe(true);
    expect(isEduUiLanguage('fr')).toBe(false);
  });

  it('marks a dialog with its language, and only Hebrew runs right to left', () => {
    const root = { lang: '', dir: '' } as HTMLElement;
    for (const [lang, dir] of [
      ['he', 'rtl'],
      ['es', 'ltr'],
      ['ja', 'ltr'],
      ['en', 'ltr'],
    ] as const) {
      markEduDialog(root, lang);
      expect(root.lang).toBe(lang);
      expect(root.dir).toBe(dir);
    }
  });
});
