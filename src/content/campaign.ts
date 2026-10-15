/**
 * The campaign, "Hazel's Grove" (v2), assembled from its three books. Canon lives in
 * STORY-BIBLE.md in this folder. These exports replace CHAPTERS, SCENES and
 * ENDINGS in src/config/story.ts; NOTES say when each extra or variant scene plays.
 */
import type { Chapter, Scene } from '../config/story';
import { BOOK1_CHAPTERS, BOOK1_SCENES, BOOK1_FLAGS, BOOK1_NOTES } from './campaign-book1';
import { BOOK2_CHAPTERS, BOOK2_SCENES, BOOK2_FLAGS, BOOK2_NOTES } from './campaign-book2';
import {
  BOOK3_CHAPTERS,
  BOOK3_SCENES,
  BOOK3_FLAGS,
  BOOK3_NOTES,
  BOOK3_ENDINGS,
  BOOK3_SPEAKERS,
} from './campaign-book3';

export const CAMPAIGN_CHAPTERS: Chapter[] = [...BOOK1_CHAPTERS, ...BOOK2_CHAPTERS, ...BOOK3_CHAPTERS];
export const CAMPAIGN_SCENES: Scene[] = [...BOOK1_SCENES, ...BOOK2_SCENES, ...BOOK3_SCENES];
export const CAMPAIGN_ENDINGS = BOOK3_ENDINGS;
/** Extra speakers the campaign adds to SPEAKERS (Wisp). */
export const CAMPAIGN_SPEAKERS = BOOK3_SPEAKERS;
export const CAMPAIGN_FLAGS: string[] = [...new Set([...BOOK1_FLAGS, ...BOOK2_FLAGS, ...BOOK3_FLAGS])];
export const CAMPAIGN_NOTES: Record<string, string> = { ...BOOK1_NOTES, ...BOOK2_NOTES, ...BOOK3_NOTES };
/** The three books, for the journal and the script book. */
export const BOOKS = [
  { n: 1, title: 'The Letter', chapters: [1, 2, 3, 4] },
  { n: 2, title: 'The Cold', chapters: [5, 6, 7, 8] },
  { n: 3, title: 'The Long Night', chapters: [9, 10, 11, 12] },
] as const;
