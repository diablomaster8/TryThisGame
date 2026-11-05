import type { StorylineChapter } from './types';

/**
 * R0650 (CAMP-58): where a line's chapters happen, for the map's region pages. A chapter with no
 * entry has no single place (it is told "anywhere" on the page). Area ids are the line's own
 * (`STORYLINE_TEXT.areas`); the content checker rejects an id the line does not have.
 */
export function placeChapters(
  chapters: StorylineChapter[],
  areas: Readonly<Record<number, string>>,
): StorylineChapter[] {
  return chapters.map((c) => (areas[c.n] ? { ...c, area: areas[c.n]! } : c));
}

/** The Hundred Days: the meadow is home, the later chapters travel. */
export const HUNDRED_CHAPTER_AREAS: Readonly<Record<number, string>> = {
  1: 'meadow',
  2: 'meadow',
  3: 'meadow',
  4: 'shore',
  5: 'cave',
  6: 'meadow',
  7: 'mire',
  8: 'mill',
  9: 'mountain',
  10: 'meadow',
};

/** Logged In: the day server, with the night one in chapter 4. */
export const LOGGED_CHAPTER_AREAS: Readonly<Record<number, string>> = {
  1: 'day',
  2: 'day',
  3: 'day',
  4: 'night',
  5: 'day',
  7: 'day',
  8: 'day',
};
