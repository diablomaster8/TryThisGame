/**
 * The Learning Grove's sprout band, as its own chunk: the campaign slices, side stories, fun
 * quests, language questlines and the LB and LK lines in sprout words. A sprout save loads this
 * and nothing of the other band (sim/story-scenes.ts, `loadEduScripts`). Its Atlas and
 * Arcade versions are a further chunk, `edu-sprout-worlds.ts`. `edu.ts` joins every band
 * for tests and tools; tests/sim/edu-chunks.test.ts checks the two agree.
 */
import type { EduBandSet } from './edu-kit';
import { EDU_CAMPAIGN_1_SPROUT } from './edu-campaign-1-sprout';
import { EDU_CAMPAIGN_2_SPROUT } from './edu-campaign-2-sprout';
import { EDU_CAMPAIGN_3_SPROUT } from './edu-campaign-3-sprout';
import { EDU_SIDE_1_SPROUT, EDU_SIDE_1_SPROUT_VARIANTS } from './edu-side-1-sprout';
import { EDU_SIDE_NEW_A_SPROUT } from './edu-side-new-a-sprout';
import { EDU_SIDE_NEW_B_SPROUT, EDU_SIDE_NEW_B_SPROUT_VARIANTS } from './edu-side-new-b-sprout';
import {
  EDU_PYTHON_SPROUT,
  EDU_BEAN_SPROUT,
  EDU_PYTHON_SPROUT_VARIANTS,
  EDU_BEAN_SPROUT_VARIANTS,
} from './edu-fun-python-bean-sprout';
import { EDU_AVATAR_SPROUT } from './edu-fun-avatar-sprout';
import { EDU_LANG_HEBREW_SPROUT } from './edu-lang-hebrew-sprout';
import { EDU_LANG_JAPANESE_SPROUT } from './edu-lang-japanese-sprout';
import { EDU_S24_SPROUT, EDU_S24_SPROUT_VARIANTS } from './edu-s24-sprout';
import { EDU_S25_SPROUT, EDU_S25_SPROUT_VARIANTS } from './edu-s25-sprout';
import { EDU_S26_SPROUT, EDU_S26_SPROUT_VARIANTS } from './edu-s26-sprout';
import { EDU_S27_SPROUT, EDU_S27_SPROUT_VARIANTS } from './edu-s27-sprout';
import { EDU_S28_SPROUT, EDU_S28_SPROUT_VARIANTS } from './edu-s28-sprout';
import { EDU_S29_SPROUT, EDU_S29_SPROUT_VARIANTS } from './edu-s29-sprout';
import { EDU_S30_SPROUT, EDU_S30_SPROUT_VARIANTS } from './edu-s30-sprout';
import { EDU_S31_SPROUT, EDU_S31_SPROUT_VARIANTS } from './edu-s31-sprout';
import { EDU_BATTLE_SPROUT_VARIANTS } from './edu-battle-sprout';
import { LINE_LB_EDU, LINE_LB_EDU_VARIANTS } from './lines-lb';
import { LINE_LK_EDU, LINE_LK_EDU_VARIANTS } from './lines-lk';

export { EDU_LANG_COURSES, EDU_LANG_QUESTS } from './edu-lang';

export const EDU_SPROUT: EduBandSet = {
  campaign: [EDU_CAMPAIGN_1_SPROUT, EDU_CAMPAIGN_2_SPROUT, EDU_CAMPAIGN_3_SPROUT],
  quests: [
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
    ...LINE_LB_EDU.sprout,
    ...LINE_LK_EDU.sprout,
  ],
  variants: [
    ...EDU_SIDE_1_SPROUT_VARIANTS,
    ...EDU_SIDE_NEW_B_SPROUT_VARIANTS,
    ...EDU_PYTHON_SPROUT_VARIANTS,
    ...EDU_BEAN_SPROUT_VARIANTS,
    ...EDU_S24_SPROUT_VARIANTS,
    ...EDU_S25_SPROUT_VARIANTS,
    ...EDU_S26_SPROUT_VARIANTS,
    ...EDU_S27_SPROUT_VARIANTS,
    ...EDU_S28_SPROUT_VARIANTS,
    ...EDU_S29_SPROUT_VARIANTS,
    ...EDU_S30_SPROUT_VARIANTS,
    ...EDU_S31_SPROUT_VARIANTS,
    ...EDU_BATTLE_SPROUT_VARIANTS,
    ...LINE_LB_EDU_VARIANTS.sprout,
    ...LINE_LK_EDU_VARIANTS.sprout,
  ],
};
