/**
 * Pixel's cartridges PA1–PA5, gathered for the runner. Imported only through
 * `loadArcade()` so the scripts stay in their own lazy chunk. Each cartridge is one line
 * with its progress in the Arcade save (canon 29); a cartridge reads the Grove and never
 * writes it.
 */
import { ATLAS_TEXT } from '../config/strings';
import { ARCADE_PA1, PA1_VARIANTS } from '../content/arcade-pa1';
import { ARCADE_PA2, ARCADE_PA2_VARIANTS } from '../content/arcade-pa2';
import { ARCADE_PA3, PA3_VARIANTS } from '../content/arcade-pa3';
import { ARCADE_PA4, ARCADE_PA4_VARIANTS } from '../content/arcade-pa4';
import { ARCADE_PA5, PA5_VARIANTS } from '../content/arcade-pa5';
import type { StoryLine } from './atlas';

const cart = (id: string, quests: StoryLine['quests'], variants: StoryLine['variants']) => ({
  id,
  title: ATLAS_TEXT.carts[id] ?? id,
  quests,
  variants,
});

export const ARCADE_CARTS: StoryLine[] = [
  cart('PA1', ARCADE_PA1, PA1_VARIANTS),
  cart('PA2', ARCADE_PA2, ARCADE_PA2_VARIANTS),
  cart('PA3', ARCADE_PA3, PA3_VARIANTS),
  cart('PA4', ARCADE_PA4, ARCADE_PA4_VARIANTS),
  cart('PA5', ARCADE_PA5, PA5_VARIANTS),
];
