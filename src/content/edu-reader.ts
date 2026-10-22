/**
 * The Learning Grove's reader band, as its own chunk: the campaign slices, side stories, fun
 * quests, language questlines and the LB and LK lines in reader words. A reader save loads this
 * and nothing of the other band (sim/story-scenes.ts, `loadEduScripts`). Its Atlas and
 * Arcade versions are a further chunk, `edu-reader-worlds.ts`. `edu.ts` joins every band
 * for tests and tools; tests/sim/edu-chunks.test.ts checks the two agree.
 */
import type { EduBandSet } from './edu-kit';
import { EDU_CAMPAIGN_1_READER } from './edu-campaign-1-reader';
import { EDU_CAMPAIGN_2_READER } from './edu-campaign-2-reader';
import { EDU_CAMPAIGN_3A_READER } from './edu-campaign-3a-reader';
import { EDU_CAMPAIGN_3B_READER } from './edu-campaign-3b-reader';
import { EDU_SIDE_1_READER, EDU_SIDE_1_READER_VARIANTS } from './edu-side-1-reader';
import { EDU_SIDE_2_READER, EDU_SIDE_2_READER_VARIANTS } from './edu-side-2-reader';
import { EDU_SIDE_NEW_1_READER } from './edu-side-new-1-reader';
import { EDU_SIDE_NEW_2_READER } from './edu-side-new-2-reader';
import { EDU_SIDE_NEW_3_READER, EDU_SIDE_NEW_3_READER_VARIANTS } from './edu-side-new-3-reader';
import { EDU_SIDE_NEW_4_READER } from './edu-side-new-4-reader';
import { EDU_PYTHON_1_READER } from './edu-fun-python-1-reader';
import { EDU_PYTHON_2_READER } from './edu-fun-python-2-reader';
import { EDU_BEAN_READER } from './edu-fun-bean-reader';
import { EDU_AVATAR_1_READER } from './edu-fun-avatar-1-reader';
import { EDU_AVATAR_2_READER } from './edu-fun-avatar-2-reader';
import { EDU_LANG_HEBREW_READER } from './edu-lang-hebrew-reader';
import { EDU_LANG_JAPANESE_READER } from './edu-lang-japanese-reader';
import { EDU_S24_READER, EDU_S24_READER_VARIANTS } from './edu-s24-reader';
import { EDU_S25_READER, EDU_S25_READER_VARIANTS } from './edu-s25-reader';
import { EDU_S26_READER, EDU_S26_READER_VARIANTS } from './edu-s26-reader';
import { EDU_S27_READER, EDU_S27_READER_VARIANTS } from './edu-s27-reader';
import { EDU_S28_READER, EDU_S28_READER_VARIANTS } from './edu-s28-reader';
import { EDU_S29_READER, EDU_S29_READER_VARIANTS } from './edu-s29-reader';
import { EDU_S30_READER, EDU_S30_READER_VARIANTS } from './edu-s30-reader';
import { EDU_S31_READER, EDU_S31_READER_VARIANTS } from './edu-s31-reader';
import { LINE_LB_EDU, LINE_LB_EDU_VARIANTS } from './lines-lb';
import { LINE_LK_EDU, LINE_LK_EDU_VARIANTS } from './lines-lk';

export { EDU_LANG_COURSES, EDU_LANG_QUESTS } from './edu-lang';

export const EDU_READER: EduBandSet = {
  campaign: [
    EDU_CAMPAIGN_1_READER,
    EDU_CAMPAIGN_2_READER,
    EDU_CAMPAIGN_3A_READER,
    EDU_CAMPAIGN_3B_READER,
  ],
  quests: [
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
    ...LINE_LB_EDU.reader,
    ...LINE_LK_EDU.reader,
  ],
  variants: [
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
    ...LINE_LB_EDU_VARIANTS.reader,
    ...LINE_LK_EDU_VARIANTS.reader,
  ],
};
