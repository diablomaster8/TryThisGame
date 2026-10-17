/**
 * The Learning Grove's language switch, assembled. For a band, `eduSceneFor(band, id)` returns
 * the educational version of main-mode scene `id` (or undefined). The sim plays its lines,
 * choices and lessons in place of the original, and still applies the ORIGINAL scene's `set`
 * flags and any choice flags (EduScene has no scene-level `set`). See EDU-STYLE.md.
 */
import type { EduBand, EduCampaign, EduQuest, EduScene, GlossaryEntry, Lesson } from './types';
import { EDU_CAMPAIGN_1_SPROUT } from './edu-campaign-1-sprout';
import { EDU_CAMPAIGN_1_READER } from './edu-campaign-1-reader';
import { EDU_CAMPAIGN_2_SPROUT } from './edu-campaign-2-sprout';
import { EDU_CAMPAIGN_2_READER } from './edu-campaign-2-reader';
import { EDU_CAMPAIGN_3_SPROUT } from './edu-campaign-3-sprout';
import { EDU_CAMPAIGN_3A_READER } from './edu-campaign-3a-reader';
import { EDU_CAMPAIGN_3B_READER } from './edu-campaign-3b-reader';
import { EDU_SIDE_1_SPROUT, EDU_SIDE_1_SPROUT_VARIANTS } from './edu-side-1-sprout';
import { EDU_SIDE_1_READER, EDU_SIDE_1_READER_VARIANTS } from './edu-side-1-reader';
import { EDU_SIDE_2_READER, EDU_SIDE_2_READER_VARIANTS } from './edu-side-2-reader';
import { EDU_SIDE_NEW_A_SPROUT } from './edu-side-new-a-sprout';
import { EDU_SIDE_NEW_B_SPROUT, EDU_SIDE_NEW_B_SPROUT_VARIANTS } from './edu-side-new-b-sprout';
import { EDU_SIDE_NEW_1_READER } from './edu-side-new-1-reader';
import { EDU_SIDE_NEW_2_READER } from './edu-side-new-2-reader';
import { EDU_SIDE_NEW_3_READER, EDU_SIDE_NEW_3_READER_VARIANTS } from './edu-side-new-3-reader';
import { EDU_SIDE_NEW_4_READER } from './edu-side-new-4-reader';
import { EDU_PYTHON_SPROUT, EDU_BEAN_SPROUT } from './edu-fun-python-bean-sprout';
import { EDU_PYTHON_1_READER } from './edu-fun-python-1-reader';
import { EDU_PYTHON_2_READER } from './edu-fun-python-2-reader';
import { EDU_BEAN_READER } from './edu-fun-bean-reader';
import { EDU_AVATAR_SPROUT } from './edu-fun-avatar-sprout';
import { EDU_AVATAR_1_READER } from './edu-fun-avatar-1-reader';
import { EDU_AVATAR_2_READER } from './edu-fun-avatar-2-reader';
import { EDU_LANG_HEBREW_SPROUT } from './edu-lang-hebrew-sprout';
import { EDU_LANG_HEBREW_READER } from './edu-lang-hebrew-reader';
import { EDU_LANG_JAPANESE_SPROUT } from './edu-lang-japanese-sprout';
import { EDU_LANG_JAPANESE_READER } from './edu-lang-japanese-reader';
import { EDU_S24_SPROUT, EDU_S24_SPROUT_VARIANTS } from './edu-s24-sprout';
import { EDU_S24_READER, EDU_S24_READER_VARIANTS } from './edu-s24-reader';
import { EDU_S25_SPROUT, EDU_S25_SPROUT_VARIANTS } from './edu-s25-sprout';
import { EDU_S25_READER, EDU_S25_READER_VARIANTS } from './edu-s25-reader';
import { EDU_S26_SPROUT, EDU_S26_SPROUT_VARIANTS } from './edu-s26-sprout';
import { EDU_S26_READER, EDU_S26_READER_VARIANTS } from './edu-s26-reader';
import { EDU_S27_SPROUT, EDU_S27_SPROUT_VARIANTS } from './edu-s27-sprout';
import { EDU_S27_READER, EDU_S27_READER_VARIANTS } from './edu-s27-reader';
import { EDU_S28_SPROUT, EDU_S28_SPROUT_VARIANTS } from './edu-s28-sprout';
import { EDU_S28_READER, EDU_S28_READER_VARIANTS } from './edu-s28-reader';
import { EDU_S29_SPROUT, EDU_S29_SPROUT_VARIANTS } from './edu-s29-sprout';
import { EDU_S29_READER, EDU_S29_READER_VARIANTS } from './edu-s29-reader';
import { EDU_S30_SPROUT, EDU_S30_SPROUT_VARIANTS } from './edu-s30-sprout';
import { EDU_S30_READER, EDU_S30_READER_VARIANTS } from './edu-s30-reader';
import { EDU_S31_SPROUT, EDU_S31_SPROUT_VARIANTS } from './edu-s31-sprout';
import { EDU_S31_READER, EDU_S31_READER_VARIANTS } from './edu-s31-reader';
import { EDU_A02_SPROUT, EDU_A02_SPROUT_VARIANTS } from './edu-a02-sprout';
import { EDU_A02_READER, EDU_A02_READER_VARIANTS } from './edu-a02-reader';
import { EDU_A05_SPROUT, EDU_A05_SPROUT_VARIANTS } from './edu-a05-sprout';
import { EDU_A05_READER, EDU_A05_READER_VARIANTS } from './edu-a05-reader';
import { EDU_A06_SPROUT, EDU_A06_SPROUT_VARIANTS } from './edu-a06-sprout';
import { EDU_A06_READER, EDU_A06_READER_VARIANTS } from './edu-a06-reader';
import { EDU_A07_SPROUT, EDU_A07_SPROUT_VARIANTS } from './edu-a07-sprout';
import { EDU_A07_READER, EDU_A07_READER_VARIANTS } from './edu-a07-reader';
import { EDU_A08_SPROUT, EDU_A08_SPROUT_VARIANTS } from './edu-a08-sprout';
import { EDU_A08_READER, EDU_A08_READER_VARIANTS } from './edu-a08-reader';
import { EDU_A09_SPROUT, EDU_A09_SPROUT_VARIANTS } from './edu-a09-sprout';
import { EDU_A09_READER, EDU_A09_READER_VARIANTS } from './edu-a09-reader';
import { EDU_A10_SPROUT, EDU_A10_SPROUT_VARIANTS } from './edu-a10-sprout';
import { EDU_A10_READER, EDU_A10_READER_VARIANTS } from './edu-a10-reader';
import { EDU_A11_SPROUT, EDU_A11_SPROUT_VARIANTS } from './edu-a11-sprout';
import { EDU_A11_READER, EDU_A11_READER_VARIANTS } from './edu-a11-reader';
import { EDU_A12_SPROUT, EDU_A12_SPROUT_VARIANTS } from './edu-a12-sprout';
import { EDU_A12_READER, EDU_A12_READER_VARIANTS } from './edu-a12-reader';
import { EDU_A13_SPROUT, EDU_A13_SPROUT_VARIANTS } from './edu-a13-sprout';
import { EDU_A13_READER, EDU_A13_READER_VARIANTS } from './edu-a13-reader';
import { EDU_A14_SPROUT, EDU_A14_SPROUT_VARIANTS } from './edu-a14-sprout';
import { EDU_A14_READER, EDU_A14_READER_VARIANTS } from './edu-a14-reader';
import { EDU_A15_SPROUT, EDU_A15_SPROUT_VARIANTS } from './edu-a15-sprout';
import { EDU_A15_READER, EDU_A15_READER_VARIANTS } from './edu-a15-reader';
import { EDU_A16_READER, EDU_A16_READER_VARIANTS } from './edu-a16-reader';
import { EDU_A17_SPROUT, EDU_A17_SPROUT_VARIANTS } from './edu-a17-sprout';
import { EDU_A17_READER, EDU_A17_READER_VARIANTS } from './edu-a17-reader';
import { EDU_A18_SPROUT, EDU_A18_SPROUT_VARIANTS } from './edu-a18-sprout';
import { EDU_A18_READER, EDU_A18_READER_VARIANTS } from './edu-a18-reader';
import { EDU_A19_SPROUT, EDU_A19_SPROUT_VARIANTS } from './edu-a19-sprout';
import { EDU_A19_READER, EDU_A19_READER_VARIANTS } from './edu-a19-reader';
import { EDU_A20_SPROUT, EDU_A20_SPROUT_VARIANTS } from './edu-a20-sprout';
import { EDU_A20_READER, EDU_A20_READER_VARIANTS } from './edu-a20-reader';
import { EDU_A22_SPROUT, EDU_A22_SPROUT_VARIANTS } from './edu-a22-sprout';
import { EDU_A22_READER, EDU_A22_READER_VARIANTS } from './edu-a22-reader';
import { EDU_A23_SPROUT, EDU_A23_SPROUT_VARIANTS } from './edu-a23-sprout';
import { EDU_A23_READER, EDU_A23_READER_VARIANTS } from './edu-a23-reader';
import { EDU_A24_SPROUT, EDU_A24_SPROUT_VARIANTS } from './edu-a24-sprout';
import { EDU_A24_READER, EDU_A24_READER_VARIANTS } from './edu-a24-reader';
import { EDU_A25_READER, EDU_A25_READER_VARIANTS } from './edu-a25-reader';
import { EDU_A26_SPROUT, EDU_A26_SPROUT_VARIANTS } from './edu-a26-sprout';
import { EDU_A26_READER, EDU_A26_READER_VARIANTS } from './edu-a26-reader';
import { EDU_A27_SPROUT, EDU_A27_SPROUT_VARIANTS } from './edu-a27-sprout';
import { EDU_A27_READER, EDU_A27_READER_VARIANTS } from './edu-a27-reader';
import { EDU_A28_SPROUT, EDU_A28_SPROUT_VARIANTS } from './edu-a28-sprout';
import { EDU_A28_READER, EDU_A28_READER_VARIANTS } from './edu-a28-reader';
import { EDU_A29_READER, EDU_A29_READER_VARIANTS } from './edu-a29-reader';
import { EDU_A30_SPROUT, EDU_A30_SPROUT_VARIANTS } from './edu-a30-sprout';
import { EDU_A30_READER, EDU_A30_READER_VARIANTS } from './edu-a30-reader';
import { EDU_A31_SPROUT, EDU_A31_SPROUT_VARIANTS } from './edu-a31-sprout';
import { EDU_A31_READER, EDU_A31_READER_VARIANTS } from './edu-a31-reader';
import { HEBREW_COURSE, LANG_HEBREW } from './lang-hebrew';
import { JAPANESE_COURSE, LANG_JAPANESE } from './lang-japanese';
import { LINE_LB_EDU, LINE_LB_EDU_VARIANTS } from './lines-lb';
import { LINE_LK_EDU, LINE_LK_EDU_VARIANTS } from './lines-lk';

/** The language questlines' base scripts and courses (CV3), carried by this chunk only. */
export const EDU_LANG_QUESTS = [...LANG_HEBREW, ...LANG_JAPANESE];
export const EDU_LANG_COURSES = [HEBREW_COURSE, JAPANESE_COURSE];

export const EDU_BANDS: readonly EduBand[] = ['sprout', 'reader'];
export const EDU_BAND_INFO: Record<EduBand, { label: string; ages: string; readAloud: boolean }> = {
  sprout: { label: 'Little Sprouts', ages: '3–6', readAloud: true },
  reader: { label: 'Grove Readers', ages: '7–10', readAloud: false },
};

export const EDU_CAMPAIGN: Record<EduBand, EduCampaign[]> = {
  sprout: [EDU_CAMPAIGN_1_SPROUT, EDU_CAMPAIGN_2_SPROUT, EDU_CAMPAIGN_3_SPROUT],
  reader: [
    EDU_CAMPAIGN_1_READER,
    EDU_CAMPAIGN_2_READER,
    EDU_CAMPAIGN_3A_READER,
    EDU_CAMPAIGN_3B_READER,
  ],
};

/**
 * Side stories S1–S22 and S24–S31, Atlas A02, A05–A20 and A22–A31 (A16, A25 and A29 reader only), the fun quests (Python, Bean, Avatar; Sunny is adults-only: none) and the
 * Learning Grove-only language questlines (Hebrew LH1–LH6, Japanese LJ1–LJ6) and the Learning
 * Grove lines LB (Play) and LK (Mouse-Deer).
 */
export const EDU_QUESTS: Record<EduBand, EduQuest[]> = {
  sprout: [
    ...EDU_SIDE_1_SPROUT,
    ...EDU_SIDE_NEW_A_SPROUT,
    ...EDU_SIDE_NEW_B_SPROUT,
    ...EDU_PYTHON_SPROUT,
    ...EDU_BEAN_SPROUT,
    ...EDU_AVATAR_SPROUT,
    ...EDU_LANG_HEBREW_SPROUT,
    ...EDU_LANG_JAPANESE_SPROUT,
    ...EDU_S24_SPROUT,
    ...EDU_S25_SPROUT,
    ...EDU_S26_SPROUT,
    ...EDU_S27_SPROUT,
    ...EDU_S28_SPROUT,
    ...EDU_S29_SPROUT,
    ...EDU_S30_SPROUT,
    ...EDU_S31_SPROUT,
    ...EDU_A02_SPROUT,
    ...EDU_A05_SPROUT,
    ...EDU_A06_SPROUT,
    ...EDU_A07_SPROUT,
    ...EDU_A08_SPROUT,
    ...EDU_A09_SPROUT,
    ...EDU_A10_SPROUT,
    ...EDU_A11_SPROUT,
    ...EDU_A12_SPROUT,
    ...EDU_A13_SPROUT,
    ...EDU_A14_SPROUT,
    ...EDU_A15_SPROUT,
    ...EDU_A17_SPROUT,
    ...EDU_A18_SPROUT,
    ...EDU_A19_SPROUT,
    ...EDU_A20_SPROUT,
    ...EDU_A22_SPROUT,
    ...EDU_A23_SPROUT,
    ...EDU_A24_SPROUT,
    ...EDU_A26_SPROUT,
    ...EDU_A27_SPROUT,
    ...EDU_A28_SPROUT,
    ...EDU_A30_SPROUT,
    ...EDU_A31_SPROUT,
    ...LINE_LB_EDU.sprout,
    ...LINE_LK_EDU.sprout,
  ],
  reader: [
    ...EDU_SIDE_1_READER,
    ...EDU_SIDE_2_READER,
    ...EDU_SIDE_NEW_1_READER,
    ...EDU_SIDE_NEW_2_READER,
    ...EDU_SIDE_NEW_3_READER,
    ...EDU_SIDE_NEW_4_READER,
    ...EDU_PYTHON_1_READER,
    ...EDU_PYTHON_2_READER,
    ...EDU_BEAN_READER,
    ...EDU_AVATAR_1_READER,
    ...EDU_AVATAR_2_READER,
    ...EDU_LANG_HEBREW_READER,
    ...EDU_LANG_JAPANESE_READER,
    ...EDU_S24_READER,
    ...EDU_S25_READER,
    ...EDU_S26_READER,
    ...EDU_S27_READER,
    ...EDU_S28_READER,
    ...EDU_S29_READER,
    ...EDU_S30_READER,
    ...EDU_S31_READER,
    ...EDU_A02_READER,
    ...EDU_A05_READER,
    ...EDU_A06_READER,
    ...EDU_A07_READER,
    ...EDU_A08_READER,
    ...EDU_A09_READER,
    ...EDU_A10_READER,
    ...EDU_A11_READER,
    ...EDU_A12_READER,
    ...EDU_A13_READER,
    ...EDU_A14_READER,
    ...EDU_A15_READER,
    ...EDU_A16_READER,
    ...EDU_A17_READER,
    ...EDU_A18_READER,
    ...EDU_A19_READER,
    ...EDU_A20_READER,
    ...EDU_A22_READER,
    ...EDU_A23_READER,
    ...EDU_A24_READER,
    ...EDU_A25_READER,
    ...EDU_A26_READER,
    ...EDU_A27_READER,
    ...EDU_A28_READER,
    ...EDU_A29_READER,
    ...EDU_A30_READER,
    ...EDU_A31_READER,
    ...LINE_LB_EDU.reader,
    ...LINE_LK_EDU.reader,
  ],
};

/** Variant scenes (S2, S9, S10, S13, S19 branches; LB and LK). */
export const EDU_VARIANTS: Record<EduBand, EduScene[]> = {
  sprout: [
    ...EDU_SIDE_1_SPROUT_VARIANTS,
    ...EDU_SIDE_NEW_B_SPROUT_VARIANTS,
    ...EDU_S24_SPROUT_VARIANTS,
    ...EDU_S25_SPROUT_VARIANTS,
    ...EDU_S26_SPROUT_VARIANTS,
    ...EDU_S27_SPROUT_VARIANTS,
    ...EDU_S28_SPROUT_VARIANTS,
    ...EDU_S29_SPROUT_VARIANTS,
    ...EDU_S30_SPROUT_VARIANTS,
    ...EDU_S31_SPROUT_VARIANTS,
    ...EDU_A02_SPROUT_VARIANTS,
    ...EDU_A05_SPROUT_VARIANTS,
    ...EDU_A06_SPROUT_VARIANTS,
    ...EDU_A07_SPROUT_VARIANTS,
    ...EDU_A08_SPROUT_VARIANTS,
    ...EDU_A09_SPROUT_VARIANTS,
    ...EDU_A10_SPROUT_VARIANTS,
    ...EDU_A11_SPROUT_VARIANTS,
    ...EDU_A12_SPROUT_VARIANTS,
    ...EDU_A13_SPROUT_VARIANTS,
    ...EDU_A14_SPROUT_VARIANTS,
    ...EDU_A15_SPROUT_VARIANTS,
    ...EDU_A17_SPROUT_VARIANTS,
    ...EDU_A18_SPROUT_VARIANTS,
    ...EDU_A19_SPROUT_VARIANTS,
    ...EDU_A20_SPROUT_VARIANTS,
    ...EDU_A22_SPROUT_VARIANTS,
    ...EDU_A23_SPROUT_VARIANTS,
    ...EDU_A24_SPROUT_VARIANTS,
    ...EDU_A26_SPROUT_VARIANTS,
    ...EDU_A27_SPROUT_VARIANTS,
    ...EDU_A28_SPROUT_VARIANTS,
    ...EDU_A30_SPROUT_VARIANTS,
    ...EDU_A31_SPROUT_VARIANTS,
    ...LINE_LB_EDU_VARIANTS.sprout,
    ...LINE_LK_EDU_VARIANTS.sprout,
  ],
  reader: [
    ...EDU_SIDE_1_READER_VARIANTS,
    ...EDU_SIDE_2_READER_VARIANTS,
    ...EDU_SIDE_NEW_3_READER_VARIANTS,
    ...EDU_S24_READER_VARIANTS,
    ...EDU_S25_READER_VARIANTS,
    ...EDU_S26_READER_VARIANTS,
    ...EDU_S27_READER_VARIANTS,
    ...EDU_S28_READER_VARIANTS,
    ...EDU_S29_READER_VARIANTS,
    ...EDU_S30_READER_VARIANTS,
    ...EDU_S31_READER_VARIANTS,
    ...EDU_A02_READER_VARIANTS,
    ...EDU_A05_READER_VARIANTS,
    ...EDU_A06_READER_VARIANTS,
    ...EDU_A07_READER_VARIANTS,
    ...EDU_A08_READER_VARIANTS,
    ...EDU_A09_READER_VARIANTS,
    ...EDU_A10_READER_VARIANTS,
    ...EDU_A11_READER_VARIANTS,
    ...EDU_A12_READER_VARIANTS,
    ...EDU_A13_READER_VARIANTS,
    ...EDU_A14_READER_VARIANTS,
    ...EDU_A15_READER_VARIANTS,
    ...EDU_A16_READER_VARIANTS,
    ...EDU_A17_READER_VARIANTS,
    ...EDU_A18_READER_VARIANTS,
    ...EDU_A19_READER_VARIANTS,
    ...EDU_A20_READER_VARIANTS,
    ...EDU_A22_READER_VARIANTS,
    ...EDU_A23_READER_VARIANTS,
    ...EDU_A24_READER_VARIANTS,
    ...EDU_A25_READER_VARIANTS,
    ...EDU_A26_READER_VARIANTS,
    ...EDU_A27_READER_VARIANTS,
    ...EDU_A28_READER_VARIANTS,
    ...EDU_A29_READER_VARIANTS,
    ...EDU_A30_READER_VARIANTS,
    ...EDU_A31_READER_VARIANTS,
    ...LINE_LB_EDU_VARIANTS.reader,
    ...LINE_LK_EDU_VARIANTS.reader,
  ],
};

/** Every educational scene of a band, keyed by the ORIGINAL scene id. */
export function eduScenes(band: EduBand): Map<string, EduScene> {
  const m = new Map<string, EduScene>();
  for (const c of EDU_CAMPAIGN[band]) for (const s of c.scenes) m.set(s.of, s);
  for (const q of EDU_QUESTS[band]) for (const s of q.scenes) m.set(s.of, s);
  for (const s of EDU_VARIANTS[band]) m.set(s.of, s);
  return m;
}

const cache = new Map<EduBand, Map<string, EduScene>>();
export function eduSceneFor(band: EduBand, originalId: string): EduScene | undefined {
  let m = cache.get(band);
  if (!m) cache.set(band, (m = eduScenes(band)));
  return m.get(originalId);
}

/**
 * The band's reader glossary for one scene: lower-case word → meaning. A word is underlined
 * in the scene that introduces it (its entry's `scene`), not every time it comes up.
 */
export function eduGlossary(band: EduBand, sceneId: string): Map<string, string> {
  let byScene = glossaryCache.get(band);
  if (!byScene) {
    byScene = new Map();
    glossaryCache.set(band, byScene);
    const add = (g: GlossaryEntry[] | undefined) => {
      for (const e of g ?? []) {
        // Entries name their scene either by the original id or as `<band>:<id>`.
        const scene = e.scene.replace(/^(sprout|reader):/, '');
        let m = byScene!.get(scene);
        if (!m) byScene!.set(scene, (m = new Map()));
        if (!m.has(e.word.toLowerCase())) m.set(e.word.toLowerCase(), e.meaning);
      }
    };
    for (const c of EDU_CAMPAIGN[band]) add(c.glossary);
    for (const q of EDU_QUESTS[band]) add(q.glossary);
  }
  return byScene.get(sceneId) ?? NO_WORDS;
}
const glossaryCache = new Map<EduBand, Map<string, Map<string, string>>>();
const NO_WORDS = new Map<string, string>();

/** The band's journal text for a campaign chapter, if a slice covers it. */
export function eduChapterText(
  band: EduBand,
  n: number,
): { title?: string; goalText: string; hint: string } | undefined {
  for (const c of EDU_CAMPAIGN[band]) if (c.chapters[n]) return c.chapters[n];
  return undefined;
}

/** The band's journal goal for a quest step (by original quest id and step id). */
export function eduGoal(
  band: EduBand,
  questId: string,
  stepId: string,
): { goal: string; hint: string } | undefined {
  return EDU_QUESTS[band].find((q) => q.of === questId)?.goals[stepId];
}

/** The band's title for a quest, when it has its own. */
export function eduQuestTitle(band: EduBand, questId: string): string | undefined {
  return EDU_QUESTS[band].find((q) => q.of === questId)?.title;
}

const lessonCache = new Map<string, Lesson>();
/** A lesson by id, in either band, for the grown-up progress view. */
export function eduLesson(id: string): Lesson | undefined {
  if (lessonCache.size === 0)
    for (const band of EDU_BANDS)
      for (const s of eduScenes(band).values()) for (const l of s.lessons) lessonCache.set(l.id, l);
  return lessonCache.get(id);
}
