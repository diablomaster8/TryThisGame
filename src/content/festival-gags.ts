/**
 * Festival gags (R0359, FUN-70): one short vignette per season, played once per save the first
 * time the Keeper is in the Grove during that season's festival (`sim/festival-gags.ts`).
 * Four narrator lines each, light register, nothing assumed about any story being played,
 * no flags set. The main game only: the Learning Grove keeps its own festival toasts.
 */
import type { Scene } from '../config/story';
import type { Season } from '../sim/types';

export const FESTIVAL_GAGS: Record<Season, Scene> = {
  spring: {
    id: 'festival-gag-spring',
    lines: [
      { who: 'narrator', text: 'The spring fair! Somebody has hidden painted eggs all over the Grove.' },
      { who: 'narrator', text: 'You find nine eggs, one sock, and a basket that is quietly breathing.' },
      { who: 'narrator', text: 'Inside sits a Nubbin among the eggs, very still, trying hard to look like one.' },
      { who: 'narrator', text: 'It is not a convincing egg. You count it anyway.', mood: 'happy' },
    ],
  },
  summer: {
    id: 'festival-gag-summer',
    lines: [
      { who: 'narrator', text: 'The summer fête! A lemonade stand has appeared by the path, run by a Nubbin.' },
      { who: 'narrator', text: 'The sign says LEMONADE, 1 SHELL. You hand over a Shell.' },
      { who: 'narrator', text: 'The Nubbin drinks the last cup, slowly, holding your eye the whole time.' },
      { who: 'narrator', text: 'The sign now says SOLD OUT. Business has never been better.', mood: 'happy' },
    ],
  },
  autumn: {
    id: 'festival-gag-autumn',
    lines: [
      { who: 'narrator', text: 'Harvest time! The Nubbins have raked the leaves into three tall piles.' },
      { who: 'narrator', text: 'Then they jump into them. Every pile, every Nubbin, again and again.' },
      { who: 'narrator', text: 'One pile has two small feet sticking straight up out of the top.' },
      { who: 'narrator', text: 'You pull. Out comes a Nubbin, upside down, leafy and completely delighted.', mood: 'happy' },
    ],
  },
  winter: {
    id: 'festival-gag-winter',
    lines: [
      { who: 'narrator', text: 'Winter lanterns! Somebody has built a snow-Nubbin by the cottage, with a pebble smile.' },
      { who: 'narrator', text: 'A real Nubbin waddles up and pats it politely, the way you greet a new friend.' },
      { who: 'narrator', text: 'The snow-Nubbin does not pat back. The real one tries a hug, then a bow, then a song.' },
      { who: 'narrator', text: 'By dusk the snowman has been given a whole fruit. The friendship is going well, apparently.', mood: 'happy' },
    ],
  },
};

/** Festival gags set no flags. */
export const FESTIVAL_GAGS_FLAGS: string[] = [];

/** Festival gags ask nothing of the sim beyond their one-time record. */
export const FESTIVAL_GAGS_CHECKS: string[] = [];
