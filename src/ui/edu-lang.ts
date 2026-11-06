/**
 * R0739 (KIDS-71), first slice: the Learning Grove's interface language. `applyEduUiLanguage`
 * lays a language's child-facing strings over `EDU_TEXT` (and restores English from a snapshot
 * taken the first time), and marks the Learning Grove's dialogs `lang` and `dir` so Hebrew
 * runs right to left. Only the dialogs are flipped, never the Grove's HUD. Strings a module
 * captured at load keep their language until reload; everything read at use time follows.
 */
import { EDU_TEXT } from '../config/strings';
import { EDU_TEXT_HE } from '../config/strings-edu-he';

export type EduUiLanguage = 'en' | 'he';

type Table = Record<string, unknown>;

let english: Table | null = null;

const TABLES: Record<EduUiLanguage, Table | null> = { en: null, he: EDU_TEXT_HE as Table };

export function uiDir(lang: EduUiLanguage): 'ltr' | 'rtl' {
  return lang === 'he' ? 'rtl' : 'ltr';
}

/** Overlay `lang` on the shared text table; `en` restores the original. */
export function applyEduUiLanguage(lang: EduUiLanguage): void {
  const live = EDU_TEXT as unknown as Table;
  english ??= {
    ...live,
    gameNames: { ...EDU_TEXT.gameNames },
    gameBlurbs: { ...EDU_TEXT.gameBlurbs },
  };
  const table = TABLES[lang];
  const base = english;
  for (const key of Object.keys(table ?? EDU_TEXT_HE)) live[key] = base[key];
  if (!table) return;
  for (const [key, value] of Object.entries(table)) {
    const was = base[key];
    live[key] =
      value && typeof value === 'object' && !Array.isArray(value)
        ? { ...(was as object), ...(value as object) }
        : value;
  }
}

/** Mark a dialog root with the language and its writing direction. */
export function markEduDialog(root: HTMLElement, lang: EduUiLanguage): void {
  root.lang = lang;
  root.dir = uiDir(lang);
}
