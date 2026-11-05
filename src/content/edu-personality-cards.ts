/**
 * R0591 (SOUL-74): the Learning Grove's personality card, reader band (ages 7-10), audience
 * `all`. It shows once per personality, on the evolution card, the first time a Nubbin of
 * that personality grows up. It is a story beat, not a quiz: it says the personality is
 * fine as it is (CASEL: Self-awareness, Social awareness) and names three kinds of care that
 * Nubbin likes, which double as practical hints. Names are filled in by `{n}`.
 * Checked by `personalityCardProblems`, which tests/tools/content-check.ts runs.
 */
import type { Personality } from '../sim/types';

export interface PersonalityCard {
  /** Two short lines on what this personality is like. No quiz voice, no question. */
  lines: [string, string];
  /** The three kinds of care it likes, each one short and doable in the Grove. */
  likes: [string, string, string];
  /** The approved standard this card serves. */
  standard: 'CASEL: Self-awareness' | 'CASEL: Social awareness';
  /** The grown-up's note. */
  parentNote: string;
}

export const PERSONALITY_CARDS: Record<Personality, PersonalityCard> = {
  shy: {
    lines: [
      '{n} is shy. It watches first and joins in later.',
      'That is not a problem. Quiet friends often notice the most.',
    ],
    likes: ['Sitting beside it, saying nothing', 'Slow, gentle pets', 'Letting it come to you'],
    standard: 'CASEL: Social awareness',
    parentNote:
      'Shy is a temperament, not a fault. Waiting for a friend to feel ready is kindness.',
  },
  cheerful: {
    lines: [
      '{n} is cheerful. It says hello to everything.',
      'Cheerful friends like company, and they like to share it around.',
    ],
    likes: ['Pets and tickles', 'High fives', 'Trips out to the races'],
    standard: 'CASEL: Self-awareness',
    parentNote: 'Talk about how it feels to be around someone who is always glad to see you.',
  },
  mischievous: {
    lines: [
      '{n} is mischievous. It loves a surprise and a bit of mess.',
      'A cheeky friend still needs rules and kindness, just like everyone.',
    ],
    likes: ['New toys to try', 'Games with a twist', 'Looking at new critters'],
    standard: 'CASEL: Self-awareness',
    parentNote:
      'Playfulness and rule-bending are different. Notice when a joke stops being fun for others.',
  },
  lazy: {
    lines: [
      '{n} is lazy. It loves a snack and a good long rest.',
      'Resting is not wasted time. Everyone needs a slow day sometimes.',
    ],
    likes: ['Regular meals', 'An early night, tucked in', 'A warm spot to snooze'],
    standard: 'CASEL: Self-awareness',
    parentNote:
      'Rest is part of looking after yourself. A good place to talk about sleep and energy.',
  },
  curious: {
    lines: [
      '{n} is curious. It pokes its nose into everything.',
      'Curious friends ask lots of questions. That is how they learn.',
    ],
    likes: ['New places to explore', 'Critters to look at', 'Things to sniff and poke'],
    standard: 'CASEL: Self-awareness',
    parentNote: 'Curiosity needs safe limits. Ask what the child likes to wonder about.',
  },
  gentle: {
    lines: [
      '{n} is gentle. It moves softly and takes its time.',
      'Gentle friends make others feel safe. That is a real strength.',
    ],
    likes: ['Soft pets', 'Quiet time together', 'Kind words'],
    standard: 'CASEL: Social awareness',
    parentNote: 'Gentleness is strength. Ask how the child can tell when a friend feels safe.',
  },
  bold: {
    lines: [
      '{n} is bold. It leaps in first and thinks after.',
      'Brave friends are great. The bravest ones also stop and check on others.',
    ],
    likes: ['Races and games', 'Big climbs and jumps', 'Cheering it on'],
    standard: 'CASEL: Social awareness',
    parentNote:
      'Bold is not the same as careless. Talk about when it is wise to wait for a friend.',
  },
  dreamy: {
    lines: [
      '{n} is dreamy. It stares at clouds and forgets what it was doing.',
      'Daydreamers imagine lots of things. Many good ideas start that way.',
    ],
    likes: ['Watching the sky together', 'Soft music', 'Time with no hurry'],
    standard: 'CASEL: Self-awareness',
    parentNote:
      'Daydreaming is imagination at work. Ask what the child imagines when they stare off.',
  },
};

/** The card as the evolution card shows it: two lines, then the likes, with the name filled in. */
export function personalityCardLines(p: Personality, name: string): string[] {
  const c = PERSONALITY_CARDS[p];
  return [
    ...c.lines.map((l) => l.replaceAll('{n}', name)),
    `${name} likes: ${c.likes.join(' · ')}.`,
  ];
}

const words = (s: string): number => s.split(/\s+/).filter(Boolean).length;

/** Problems with the cards, for content-check: line caps, quiz tone, three likes, one per id. */
export function personalityCardProblems(personalities: readonly string[]): string[] {
  const out: string[] = [];
  for (const p of personalities) {
    const c = (PERSONALITY_CARDS as Record<string, PersonalityCard | undefined>)[p];
    if (!c) {
      out.push(`personality-card ${p}: missing`);
      continue;
    }
    for (const line of [...c.lines, ...c.likes]) {
      if (line.length > 160 || words(line) > 30)
        out.push(`personality-card ${p}: too long: ${line}`);
      if (/\?|quiz|test yourself|correct answer/i.test(line))
        out.push(`personality-card ${p}: quiz tone: ${line}`);
    }
    if (!c.lines[0].includes('{n}')) out.push(`personality-card ${p}: first line must name {n}`);
    if (new Set(c.likes).size !== 3) out.push(`personality-card ${p}: needs three distinct likes`);
    if (/\b(never|always|stupid|silly|bad)\b/i.test([...c.lines, ...c.likes].join(' ')))
      out.push(`personality-card ${p}: judging word`);
  }
  return out;
}
