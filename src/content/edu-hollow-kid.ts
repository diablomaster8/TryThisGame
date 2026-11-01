/**
 * Kid mode in the Hollow (R0188, DUNG-45, lane B r10): the captions read aloud for shrines
 * and finds, the counting berries and the act boss's game of tag. Sprout band (ages 3–6):
 * every line is at most 14 words, present tense, plain and warm, and the counting grows out
 * of play (the berries lie on the way down; nobody is quizzed). The lesson is the one beat a
 * grown-up sees in the progress view. `ui/hollow-kid-voice.ts` shows and speaks these lines;
 * the sim (`sim/dungeon-kid-play.ts`) never reads text.
 */
import type { Lesson } from './types';

export interface HollowKidText {
  /** Said as a shrine glows, by shrine kind (`dungeon-shrines.ts`). */
  shrine: Record<string, string>;
  /** Said for a find, by loot kind, plus the chest and a new thing to wear. */
  find: Record<string, string>;
  /** The berry count, one line per berry (the fifth says the whole count). */
  berries: readonly string[];
  /** Said when the boss's game of tag starts, after each tag, and as it runs home. */
  tag: { start: string; tags: readonly string[]; home: string };
}

export const HOLLOW_KID: HollowKidText = {
  shrine: {
    sunny: 'A sunny shrine glows. Your shells will shine!',
    bouncy: 'A bouncy shrine! Boing, boing. Your feet feel springy.',
    snuggly: 'A snuggly shrine. Everyone feels happy and cosy.',
    lucky: 'A lucky clover! Good things are coming.',
    picnic: 'A picnic shrine. Munch, munch! Now everyone is full.',
    glowy: 'A glowy shrine. Now you can see far away.',
    gem: 'A gem shrine. Your charm sparkles brighter.',
    secret: 'A secret shrine! Now the whole map shows.',
  },
  find: {
    shells: 'Shells! Clink, clink, into your bag.',
    stone: 'A smooth stone. It is round and cool.',
    seed: 'A seed! Plant it, and it can grow.',
    essence: 'A glowing crystal. It hums a tiny hum.',
    critter: 'A little critter! It wants to come home with you.',
    egg: 'An egg! Something small is sleeping inside.',
    chest: 'A treasure chest! Creak goes the lid.',
    gear: 'Something new to wear! You look so smart.',
  },
  berries: [
    'Look, a berry! That is one.',
    'Another berry! One, two. Two berries.',
    'One, two, three. Three berries!',
    'One, two, three, four. Four berries!',
    'One, two, three, four, five! Five berries. Yum!',
  ],
  tag: {
    start: 'The big one wants to play tag! Run and touch it.',
    tags: ['Tag! That is one.', 'Tag again! That is two.', 'Tag! Three! You win!'],
    home: 'It giggles and runs home. What a fun game!',
  },
};

/** The counting beat, for the grown-up progress view (sprout band). */
export const HOLLOW_KID_LESSON: Lesson = {
  id: 'sprout:hollow-berries-l1',
  domain: 'maths',
  skill: 'count to 5',
  standard: 'K.CC.B.5',
  kind: 'do',
  after: 0,
  check: 'edu:count:berries:5',
  lines: [
    { who: 'narrator', text: 'Berries lie along the path. Pick them up and count!' },
    { who: 'narrator', text: '(Count each berry together on your fingers.)' },
  ],
  parentNote: 'Counted five berries one by one on the way through a Hollow level.',
};

/** The check the sim answers when the fifth berry is picked. */
export const EDU_HOLLOW_KID_CHECKS: string[] = ['edu:count:berries:5'];

/** Kid mode sets no story flags. */
export const EDU_HOLLOW_KID_FLAGS: string[] = [];
