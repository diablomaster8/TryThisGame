/**
 * The Learning Grove's sprout versions of the Atlas pages and Pixel's Arcade, as their own
 * chunk. No Learning Grove screen opens the Atlas or the Arcade yet, so the game loads this
 * only when a lookup asks for one of their scenes (sim/story-scenes.ts).
 */
import type { EduBandSet } from './edu-kit';
import { EDU_A02_SPROUT, EDU_A02_SPROUT_VARIANTS } from './edu-a02-sprout';
import { EDU_A05_SPROUT, EDU_A05_SPROUT_VARIANTS } from './edu-a05-sprout';
import { EDU_A06_SPROUT, EDU_A06_SPROUT_VARIANTS } from './edu-a06-sprout';
import { EDU_A07_SPROUT, EDU_A07_SPROUT_VARIANTS } from './edu-a07-sprout';
import { EDU_A08_SPROUT, EDU_A08_SPROUT_VARIANTS } from './edu-a08-sprout';
import { EDU_A09_SPROUT, EDU_A09_SPROUT_VARIANTS } from './edu-a09-sprout';
import { EDU_A10_SPROUT, EDU_A10_SPROUT_VARIANTS } from './edu-a10-sprout';
import { EDU_A11_SPROUT, EDU_A11_SPROUT_VARIANTS } from './edu-a11-sprout';
import { EDU_A12_SPROUT, EDU_A12_SPROUT_VARIANTS } from './edu-a12-sprout';
import { EDU_A13_SPROUT, EDU_A13_SPROUT_VARIANTS } from './edu-a13-sprout';
import { EDU_A14_SPROUT, EDU_A14_SPROUT_VARIANTS } from './edu-a14-sprout';
import { EDU_A15_SPROUT, EDU_A15_SPROUT_VARIANTS } from './edu-a15-sprout';
import { EDU_A17_SPROUT, EDU_A17_SPROUT_VARIANTS } from './edu-a17-sprout';
import { EDU_A18_SPROUT, EDU_A18_SPROUT_VARIANTS } from './edu-a18-sprout';
import { EDU_A19_SPROUT, EDU_A19_SPROUT_VARIANTS } from './edu-a19-sprout';
import { EDU_A20_SPROUT, EDU_A20_SPROUT_VARIANTS } from './edu-a20-sprout';
import { EDU_A22_SPROUT, EDU_A22_SPROUT_VARIANTS } from './edu-a22-sprout';
import { EDU_A23_SPROUT, EDU_A23_SPROUT_VARIANTS } from './edu-a23-sprout';
import { EDU_A24_SPROUT, EDU_A24_SPROUT_VARIANTS } from './edu-a24-sprout';
import { EDU_A26_SPROUT, EDU_A26_SPROUT_VARIANTS } from './edu-a26-sprout';
import { EDU_A27_SPROUT, EDU_A27_SPROUT_VARIANTS } from './edu-a27-sprout';
import { EDU_A28_SPROUT, EDU_A28_SPROUT_VARIANTS } from './edu-a28-sprout';
import { EDU_A30_SPROUT, EDU_A30_SPROUT_VARIANTS } from './edu-a30-sprout';
import { EDU_A31_SPROUT, EDU_A31_SPROUT_VARIANTS } from './edu-a31-sprout';
import { EDU_PA1_SPROUT, EDU_PA1_SPROUT_VARIANTS } from './edu-pa1-sprout';

export const EDU_SPROUT_WORLDS: EduBandSet = {
  campaign: [],
  quests: [
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
    ...EDU_PA1_SPROUT,
  ],
  variants: [
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
    ...EDU_PA1_SPROUT_VARIANTS,
  ],
};
