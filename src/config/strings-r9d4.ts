/**
 * Lane D round 9: the world hints (R0127), the Grove's secret (R0111) and the debug season
 * control (R0118). Narrator lines: second person, present tense, under 100 characters.
 */
import type { HintId } from './tuning-r9d4';

export const WORLD_HINT_TEXT: Record<Exclude<HintId, 'clue'> | 'nook', string> = {
  shake: 'Fruit trees rattle when shaken. Tap a trunk and see what drops.',
  wade: 'The stream runs shallow here. Anyone can wade across, boots and all.',
  swim: 'The pond drops away past the reeds. A Swim-trained friend could tow you over.',
  hop: 'Big rocks are solid underfoot. Hop up on one for a better view.',
  glide: 'The air lifts up here. Hold jump as you fall and you drift down like a leaf.',
  ride: 'Open grass, room to run. A grown Nubbin who trusts you might carry you across.',
  cave: 'Cool air breathes out of the hollow. It will keep until you are ready.',
  nook: 'Behind the spray, a stone Nubbin sleeps on a plinth. The plinth has a keyhole.',
};

/** R0111: the Grove's secret, found with the Old Key. */
export const SECRET_TEXT = {
  grove: [
    'Behind the spray, the moss grows thick round a little stone Nubbin, fast asleep.',
    'The Old Key fits its plinth. One stone eye opens, winks, and shuts again.',
    'Tucked behind it: a small statue of your own, and a few Shells.',
  ],
} as const;

/** R0118: the debug panel's season row. */
export const DEBUG_SEASON_TEXT = {
  label: 'Season',
  calendar: 'Calendar',
  names: { spring: 'Spring', summer: 'Summer', autumn: 'Autumn', winter: 'Winter' },
} as const;
