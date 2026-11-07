/**
 * R0739 (KIDS-71): the Learning Grove's interface language. `applyEduUiLanguage` lays a
 * language's child-facing strings over `EDU_TEXT` (and restores English from a snapshot
 * taken the first time), and marks the Learning Grove's dialogs `lang` and `dir` so Hebrew
 * runs right to left. Only the dialogs are flipped, never the Grove's HUD. Strings a module
 * captured at load keep their language until reload; everything read at use time follows.
 * Hebrew, Spanish and Japanese are covered; round prompts, the grown-up area and the story
 * stay English.
 */
import { EDU_TEXT } from '../config/strings';
import { EDU_TEXT_ES } from '../config/strings-edu-es';
import { EDU_TEXT_HE } from '../config/strings-edu-he';
import { EDU_TEXT_JA } from '../config/strings-edu-ja';
import './edu-rtl.css';

export type EduUiLanguage = 'en' | 'he' | 'es' | 'ja';

/** Every language the grown-up chooser offers, English first. */
export const EDU_UI_LANGUAGES: readonly EduUiLanguage[] = ['en', 'he', 'es', 'ja'];

export function isEduUiLanguage(v: unknown): v is EduUiLanguage {
  return typeof v === 'string' && (EDU_UI_LANGUAGES as readonly string[]).includes(v);
}

type Table = Record<string, unknown>;

let english: Table | null = null;

const TABLES: Record<EduUiLanguage, Table | null> = {
  en: null,
  he: EDU_TEXT_HE as Table,
  es: EDU_TEXT_ES as Table,
  ja: EDU_TEXT_JA as Table,
};

/** Every key any language overlays, so switching language restores what the last one set. */
const OVERLAID_KEYS: string[] = [
  ...new Set(Object.values(TABLES).flatMap((t) => (t ? Object.keys(t) : []))),
];

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
    readerGameNames: { ...EDU_TEXT.readerGameNames },
    readerGameBlurbs: { ...EDU_TEXT.readerGameBlurbs },
  };
  const base = english;
  for (const key of OVERLAID_KEYS) live[key] = base[key];
  // The break screen is its own root, so it follows the language through the body.
  if (typeof document !== 'undefined' && document.body) document.body.dataset.eduLang = lang;
  const table = TABLES[lang];
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
