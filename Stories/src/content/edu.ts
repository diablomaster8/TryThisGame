/**
 * The Learning Grove's language switch, assembled. For a band, `eduSceneFor(band, id)` returns
 * the educational version of main-mode scene `id` (or undefined). The sim plays its lines,
 * choices and lessons in place of the original, and still applies the ORIGINAL scene's `set`
 * flags and any choice flags (EduScene has no scene-level `set`). See EDU-STYLE.md.
 */
import type { EduBand, EduCampaign, EduQuest, EduScene } from './types';
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

export const EDU_BANDS: readonly EduBand[] = ['sprout', 'reader'];
export const EDU_BAND_INFO: Record<EduBand, { label: string; ages: string; readAloud: boolean }> = {
  sprout: { label: 'Little Sprouts', ages: '3–6', readAloud: true },
  reader: { label: 'Grove Readers', ages: '7–10', readAloud: false },
};

export const EDU_CAMPAIGN: Record<EduBand, EduCampaign[]> = {
  sprout: [EDU_CAMPAIGN_1_SPROUT, EDU_CAMPAIGN_2_SPROUT, EDU_CAMPAIGN_3_SPROUT],
  reader: [EDU_CAMPAIGN_1_READER, EDU_CAMPAIGN_2_READER, EDU_CAMPAIGN_3A_READER, EDU_CAMPAIGN_3B_READER],
};

/**
 * Side stories S1–S22, the fun quests (Python, Bean, Avatar; Sunny is adults-only: none) and the
 * Learning Grove-only language questlines (Hebrew LH1–LH6, Japanese LJ1–LJ6).
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
  ],
};

/** Side-story variant scenes (S2, S9, S10, S13, S19 branches). */
export const EDU_VARIANTS: Record<EduBand, EduScene[]> = {
  sprout: [...EDU_SIDE_1_SPROUT_VARIANTS, ...EDU_SIDE_NEW_B_SPROUT_VARIANTS],
  reader: [...EDU_SIDE_1_READER_VARIANTS, ...EDU_SIDE_2_READER_VARIANTS, ...EDU_SIDE_NEW_3_READER_VARIANTS],
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
