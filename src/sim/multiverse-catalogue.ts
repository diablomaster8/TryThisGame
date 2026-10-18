/**
 * The Multiverse's lines and its six endgames, gathered for the runner. Imported only
 * through `loadMultiverse()` so the scripts stay in their own lazy chunk, which loads only
 * once the rift has opened behind the 18+ setting. Every line keeps its progress in the
 * Multiverse save; the endgames read the other lines through `lineContext`.
 */
import { ATLAS_TEXT } from '../config/strings';
import { MV_CAP, MV_CAP_VARIANTS } from '../content/mv-cap';
import {
  MV_DOOM,
  MV_DOOM_VARIANTS,
  MV_ULTRON,
  MV_ULTRON_VARIANTS,
} from '../content/mv-doom-ultron';
import { MV_DRAGONBALL, MV_DRAGONBALL_VARIANTS } from '../content/mv-dragonball';
import { MV_ENDGAMES, MV_ENDGAMES_VARIANTS } from '../content/mv-endgames';
import { MV_IRONMAN, MV_IRONMAN_VARIANTS } from '../content/mv-ironman';
import {
  MV_MOONKNIGHT,
  MV_MOONKNIGHT_VARIANTS,
  MV_SPAWN,
  MV_SPAWN_VARIANTS,
} from '../content/mv-moonknight-spawn';
import { MV_TOYSTORY, MV_TOYSTORY_VARIANTS } from '../content/mv-toystory';
import type { StoryLine } from './atlas';
import { multiverseChoiceLive, multiverseStepLive } from './multiverse-rules';

const mvLine = (
  id: string,
  quests: StoryLine['quests'],
  variants: StoryLine['variants'],
): StoryLine => ({
  id,
  title: ATLAS_TEXT.mvLines[id] ?? id,
  quests,
  variants,
  stepLive: multiverseStepLive,
  choiceLive: multiverseChoiceLive,
});

export const MULTIVERSE_LINES: StoryLine[] = [
  mvLine('IM', MV_IRONMAN, MV_IRONMAN_VARIANTS),
  mvLine('CA', MV_CAP, MV_CAP_VARIANTS),
  mvLine('FF', MV_DOOM, MV_DOOM_VARIANTS),
  mvLine('UL', MV_ULTRON, MV_ULTRON_VARIANTS),
  mvLine('MK', MV_MOONKNIGHT, MV_MOONKNIGHT_VARIANTS),
  mvLine('SP', MV_SPAWN, MV_SPAWN_VARIANTS),
  mvLine('DB', MV_DRAGONBALL, MV_DRAGONBALL_VARIANTS),
  mvLine('TS', MV_TOYSTORY, MV_TOYSTORY_VARIANTS),
  mvLine('E', MV_ENDGAMES, MV_ENDGAMES_VARIANTS),
];
