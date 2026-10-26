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
import { ARCADE_PA4, ARCADE_PA4_LINE_NEEDS, ARCADE_PA4_VARIANTS } from '../content/arcade-pa4';
import { ARCADE_PA5, PA5_VARIANTS } from '../content/arcade-pa5';
import type { LineFlags, StoryLine } from './atlas';

const cart = (id: string, quests: StoryLine['quests'], variants: StoryLine['variants']) => ({
  id,
  title: ATLAS_TEXT.carts[id] ?? id,
  quests,
  variants,
});

/** PA4's friends: each friend's line plays only for the answer it was written for (first when unset). */
function pa4LineLive(_scene: string, line: { text: string }, flags: LineFlags): boolean {
  const need = ARCADE_PA4_LINE_NEEDS[line.text];
  if (!need) return true;
  const [flag, value, whenUnset] = need;
  const v = flags[flag];
  return v === value || (whenUnset && (v === undefined || v === false));
}

export const ARCADE_CARTS: StoryLine[] = [
  cart('PA1', ARCADE_PA1, PA1_VARIANTS),
  cart('PA2', ARCADE_PA2, ARCADE_PA2_VARIANTS),
  cart('PA3', ARCADE_PA3, PA3_VARIANTS),
  { ...cart('PA4', ARCADE_PA4, ARCADE_PA4_VARIANTS), lineLive: pa4LineLive },
  cart('PA5', ARCADE_PA5, PA5_VARIANTS),
];
