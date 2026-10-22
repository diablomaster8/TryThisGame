/**
 * The Learning Grove's reader versions of the Atlas pages and Pixel's Arcade, as their own
 * chunk. No Learning Grove screen opens the Atlas or the Arcade yet, so the game loads this
 * only when a lookup asks for one of their scenes (sim/story-scenes.ts).
 */
import type { EduBandSet } from './edu-kit';
import { EDU_A02_READER, EDU_A02_READER_VARIANTS } from './edu-a02-reader';
import { EDU_A05_READER, EDU_A05_READER_VARIANTS } from './edu-a05-reader';
import { EDU_A06_READER, EDU_A06_READER_VARIANTS } from './edu-a06-reader';
import { EDU_A07_READER, EDU_A07_READER_VARIANTS } from './edu-a07-reader';
import { EDU_A08_READER, EDU_A08_READER_VARIANTS } from './edu-a08-reader';
import { EDU_A09_READER, EDU_A09_READER_VARIANTS } from './edu-a09-reader';
import { EDU_A10_READER, EDU_A10_READER_VARIANTS } from './edu-a10-reader';
import { EDU_A11_READER, EDU_A11_READER_VARIANTS } from './edu-a11-reader';
import { EDU_A12_READER, EDU_A12_READER_VARIANTS } from './edu-a12-reader';
import { EDU_A13_READER, EDU_A13_READER_VARIANTS } from './edu-a13-reader';
import { EDU_A14_READER, EDU_A14_READER_VARIANTS } from './edu-a14-reader';
import { EDU_A15_READER, EDU_A15_READER_VARIANTS } from './edu-a15-reader';
import { EDU_A16_READER, EDU_A16_READER_VARIANTS } from './edu-a16-reader';
import { EDU_A17_READER, EDU_A17_READER_VARIANTS } from './edu-a17-reader';
import { EDU_A18_READER, EDU_A18_READER_VARIANTS } from './edu-a18-reader';
import { EDU_A19_READER, EDU_A19_READER_VARIANTS } from './edu-a19-reader';
import { EDU_A20_READER, EDU_A20_READER_VARIANTS } from './edu-a20-reader';
import { EDU_A22_READER, EDU_A22_READER_VARIANTS } from './edu-a22-reader';
import { EDU_A23_READER, EDU_A23_READER_VARIANTS } from './edu-a23-reader';
import { EDU_A24_READER, EDU_A24_READER_VARIANTS } from './edu-a24-reader';
import { EDU_A25_READER, EDU_A25_READER_VARIANTS } from './edu-a25-reader';
import { EDU_A26_READER, EDU_A26_READER_VARIANTS } from './edu-a26-reader';
import { EDU_A27_READER, EDU_A27_READER_VARIANTS } from './edu-a27-reader';
import { EDU_A28_READER, EDU_A28_READER_VARIANTS } from './edu-a28-reader';
import { EDU_A29_READER, EDU_A29_READER_VARIANTS } from './edu-a29-reader';
import { EDU_A30_READER, EDU_A30_READER_VARIANTS } from './edu-a30-reader';
import { EDU_A31_READER, EDU_A31_READER_VARIANTS } from './edu-a31-reader';
import { EDU_PA1_READER, EDU_PA1_READER_VARIANTS } from './edu-pa1-reader';

export const EDU_READER_WORLDS: EduBandSet = {
  campaign: [],
  quests: [
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
    ...EDU_PA1_READER,
  ],
  variants: [
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
    ...EDU_PA1_READER_VARIANTS,
  ],
};
