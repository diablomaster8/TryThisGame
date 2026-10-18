import { EDU_READER_RHYMES, EDU_READER_WORDS } from '../../config/edu';
import type { Rng } from '../../sim/rng';
import { pickDistinct, shuffleWithAnswer, type EduOption, type EduRound } from './games';

/**
 * Rounds for the reader band (ages 7–10), so older children are not offered letter names
 * and little sums (review C, item 18). Three games keep their ids and progress: counting
 * becomes sums and take-aways to twenty with the 2, 5 and 10 times tables; letters becomes
 * spelling (pick the right spelling of a picture word); sounds becomes rhymes and syllables
 * read as words. Pure and seeded like the sprout rounds.
 */

const mkN = (n: number): EduOption => ({ kind: 'number', n });
const mkW = (word: string): EduOption => ({ kind: 'word', word });

/** Four number options around the answer, all different and none below zero. */
function numberOptions(rng: Rng, right: number): { options: EduOption[]; answer: number } {
  const near = [-3, -2, -1, 1, 2, 3, 10, -10].map((d) => right + d).filter((n) => n >= 0);
  const wrong = pickDistinct(rng, near, 3);
  return shuffleWithAnswer(rng, mkN(right), wrong.map(mkN));
}

export function readerSumRound(rng: Rng): EduRound {
  const kind = rng.int(0, 3);
  if (kind === 0) {
    const a = rng.int(6, 14);
    const b = rng.int(2, 20 - a);
    return {
      game: 'counting',
      prompt: `What is ${a} + ${b}?`,
      cue: null,
      ...numberOptions(rng, a + b),
      teach: `${a} + ${b} = ${a + b}. Start at ${a} and count on ${b}.`,
    };
  }
  if (kind === 1) {
    const a = rng.int(11, 20);
    const b = rng.int(2, 9);
    return {
      game: 'counting',
      prompt: `What is ${a} − ${b}?`,
      cue: null,
      ...numberOptions(rng, a - b),
      teach: `${a} − ${b} = ${a - b}. Count back ${b} from ${a}.`,
    };
  }
  if (kind === 2) {
    const total = rng.int(10, 20);
    const a = rng.int(3, total - 2);
    return {
      game: 'counting',
      prompt: `${a} + ? = ${total}`,
      cue: null,
      ...numberOptions(rng, total - a),
      teach: `${a} + ${total - a} = ${total}. Count on from ${a} to ${total}.`,
    };
  }
  const table = rng.pick([2, 5, 10] as const);
  const n = rng.int(2, 10);
  return {
    game: 'counting',
    prompt: `What is ${n} × ${table}?`,
    cue: null,
    ...numberOptions(rng, n * table),
    teach: `${n} lots of ${table} make ${n * table}. Count in ${table}s.`,
  };
}

/** Plausible wrong spellings: a doubled or undoubled letter, a swapped pair, a changed vowel. */
export function misspellings(word: string): string[] {
  const out = new Set<string>();
  for (let i = 1; i < word.length; i++) {
    if (word[i] === word[i - 1]) out.add(word.slice(0, i) + word.slice(i + 1));
  }
  for (let i = 1; i < word.length - 1; i++) {
    const c = word[i]!;
    if (!'aeiou'.includes(c) && word[i + 1] !== c && word[i - 1] !== c)
      out.add(word.slice(0, i + 1) + c + word.slice(i + 1));
  }
  for (let i = 1; i < word.length - 2; i++) {
    if (word[i] !== word[i + 1])
      out.add(word.slice(0, i) + word[i + 1] + word[i] + word.slice(i + 2));
  }
  const swap: Record<string, string> = { a: 'e', e: 'i', i: 'e', o: 'u', u: 'o' };
  for (let i = 1; i < word.length; i++) {
    const v = swap[word[i]!];
    if (v) out.add(word.slice(0, i) + v + word.slice(i + 1));
  }
  out.delete(word);
  return [...out];
}

export function readerSpellingRound(rng: Rng): EduRound {
  const w = rng.pick(EDU_READER_WORDS);
  const wrong = pickDistinct(rng, misspellings(w.word), 3);
  const { options, answer } = shuffleWithAnswer(rng, mkW(w.word), wrong.map(mkW));
  return {
    game: 'letters',
    prompt: 'Which is the right spelling?',
    cue: { kind: 'picture', icon: w.icon, label: '' },
    options,
    answer,
    teach: `${w.word}: ${w.hint}`,
  };
}

/** Syllables in a reader word, from its marked split (`gar-den`). */
const syllables = (split: string): number => split.split('-').length;

export function readerRhymeRound(rng: Rng): EduRound {
  if (rng.chance(0.35)) {
    const w = rng.pick(EDU_READER_WORDS);
    const n = syllables(w.split);
    const wrong = [1, 2, 3, 4].filter((x) => x !== n).slice(0, 3);
    const { options, answer } = shuffleWithAnswer(rng, mkN(n), wrong.map(mkN));
    return {
      game: 'sounds',
      prompt: `How many syllables in "${w.word}"?`,
      cue: mkW(w.word),
      options,
      answer,
      teach: `${w.split}: ${n} beat${n === 1 ? '' : 's'}.`,
    };
  }
  const group = rng.pick(EDU_READER_RHYMES);
  const [target, right] = pickDistinct(rng, group, 2) as [string, string];
  const others = pickDistinct(rng, EDU_READER_RHYMES.filter((g) => g !== group).flat(), 3);
  const { options, answer } = shuffleWithAnswer(rng, mkW(right), others.map(mkW));
  return {
    game: 'sounds',
    prompt: `Which word rhymes with "${target}"?`,
    cue: mkW(target),
    options,
    answer,
    teach: `${target} and ${right} end with the same sound.`,
  };
}
