/**
 * The Learning Grove's language switch, assembled. For a band, `eduSceneFor(band, id)` returns
 * the educational version of main-mode scene `id` (or undefined). The sim plays its lines,
 * choices and lessons in place of the original, and still applies the ORIGINAL scene's `set`
 * flags and any choice flags (EduScene has no scene-level `set`). See EDU-STYLE.md.
 *
 * This module joins every band for tests and tools. The game never loads it: each band is
 * its own chunk (`edu-sprout.ts`, `edu-reader.ts`, and their `-worlds` Atlas and Arcade
 * parts), loaded by `loadEduScripts` in sim/story-scenes.ts.
 */
import type { EduBand, EduCampaign, EduQuest, EduScene } from './types';
import { eduApi, joinBandSets, type EduBandSet } from './edu-kit';
import { EDU_SPROUT } from './edu-sprout';
import { EDU_SPROUT_WORLDS } from './edu-sprout-worlds';
import { EDU_READER } from './edu-reader';
import { EDU_READER_WORLDS } from './edu-reader-worlds';

export { EDU_BANDS } from './edu-kit';
/** The language questlines' base scripts and courses (CV3), carried by the edu chunks only. */
export { EDU_LANG_COURSES, EDU_LANG_QUESTS } from './edu-lang';

export const EDU_BAND_INFO: Record<EduBand, { label: string; ages: string; readAloud: boolean }> = {
  sprout: { label: 'Little Sprouts', ages: '3–6', readAloud: true },
  reader: { label: 'Grove Readers', ages: '7–10', readAloud: false },
};

/**
 * Every band in full: side stories S1–S22 and S24–S31, Atlas A02, A05–A20 and A22–A31 (A16,
 * A25 and A29 reader only), Pixel’s Arcade PA1, the fun quests (Python, Bean, Avatar; Sunny
 * is adults-only: none), the Learning Grove-only language questlines (Hebrew LH1–LH6,
 * Japanese LJ1–LJ6) and the Learning Grove lines LB (Play) and LK (Mouse-Deer).
 */
const SETS: Record<EduBand, EduBandSet> = {
  sprout: joinBandSets(EDU_SPROUT, EDU_SPROUT_WORLDS),
  reader: joinBandSets(EDU_READER, EDU_READER_WORLDS),
};

export const EDU_CAMPAIGN: Record<EduBand, EduCampaign[]> = {
  sprout: SETS.sprout.campaign,
  reader: SETS.reader.campaign,
};

export const EDU_QUESTS: Record<EduBand, EduQuest[]> = {
  sprout: SETS.sprout.quests,
  reader: SETS.reader.quests,
};

/** Variant scenes (S2, S9, S10, S13, S19 branches; PA1; LB and LK). */
export const EDU_VARIANTS: Record<EduBand, EduScene[]> = {
  sprout: SETS.sprout.variants,
  reader: SETS.reader.variants,
};

export const {
  eduScenes,
  eduSceneFor,
  eduGlossary,
  eduChapterText,
  eduGoal,
  eduQuestTitle,
  eduLesson,
} = eduApi(SETS);
