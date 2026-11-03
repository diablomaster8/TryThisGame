import { EDU_SHOP_PRICES, EDU_SPELL_TIERS, patternErrors } from '../../config/edu-reader';
import { EDU_READER_RHYMES, EDU_READER_WORDS, wordClip } from '../../config/edu';
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

/** R0716: place value, telling the time, money in Shells and simple fractions. */
export function readerMathsRound(rng: Rng): EduRound {
  const kind = rng.int(0, 3);
  if (kind === 0) {
    const digits = [rng.int(1, 9), rng.int(0, 9), rng.int(1, 9)];
    const at = rng.int(0, 2);
    const mult = [100, 10, 1][at]!;
    const place = ['hundreds', 'tens', 'ones'][at]!;
    const n = digits[0]! * 100 + digits[1]! * 10 + digits[2]!;
    const d = digits[at]! || 1;
    if (digits[at] === 0) digits[at] = 1;
    const num = digits[0]! * 100 + digits[1]! * 10 + digits[2]!;
    void n;
    return {
      game: 'counting',
      prompt: `In ${num}, what is the value of the ${d} in the ${place} place?`,
      cue: null,
      ...valueOptions(rng, d * mult),
      teach: `The ${d} is in the ${place} place, so it is worth ${d * mult}.`,
    };
  }
  if (kind === 1) {
    const h = rng.int(1, 12);
    const m = rng.pick([0, 15, 30, 45] as const);
    const say = (hh: number, mm: number): string =>
      mm === 0
        ? `${hh} o'clock`
        : mm === 15
          ? `quarter past ${hh}`
          : mm === 30
            ? `half past ${hh}`
            : `quarter to ${(hh % 12) + 1}`;
    const right = say(h, m);
    const wrong = pickDistinct(
      rng,
      [0, 15, 30, 45].flatMap((mm) => [say(h, mm), say((h % 12) + 1, mm)]).filter((t) => t !== right),
      3,
    );
    const { options, answer } = shuffleWithAnswer(rng, mkW(right), wrong.map(mkW));
    return {
      game: 'counting',
      prompt: 'What time does the clock show?',
      cue: { kind: 'clock', h, m },
      options,
      answer,
      teach: `The short hand points to ${m === 45 ? (h % 12) + 1 : h}, the long hand to ${m / 5}: ${right}.`,
    };
  }
  if (kind === 2) {
    const [thing, price] = rng.pick(EDU_SHOP_PRICES);
    const tens = Math.floor(price / 10) * 10;
    return {
      game: 'counting',
      prompt: `${cap2(thing)} costs ${price} 🐚. You pay ${tens} 🐚 and then ? more.`,
      cue: null,
      ...numberOptions(rng, price - tens),
      teach: `${tens} + ${price - tens} = ${price} Shells.`,
    };
  }
  const whole = rng.pick([8, 12, 16, 20, 24, 40] as const);
  const [name, div] = rng.pick([
    ['half', 2],
    ['a quarter', 4],
  ] as const);
  return {
    game: 'counting',
    prompt: `What is ${name} of ${whole}?`,
    cue: null,
    ...numberOptions(rng, whole / div),
    teach: `Share ${whole} into ${div} equal groups: each group has ${whole / div}.`,
  };
}

const cap2 = (s: string): string => s.charAt(0).toUpperCase() + s.slice(1);

/** Place-value options: the answer and values of the same digit in other places. */
function valueOptions(rng: Rng, right: number): { options: EduOption[]; answer: number } {
  const d = Number(String(right).replace(/0+$/, ''));
  const pool = [1, 10, 100, 1000].map((m) => d * m).filter((n) => n !== right);
  return shuffleWithAnswer(rng, mkN(right), pickDistinct(rng, pool, 3).map(mkN));
}

export function readerSumRound(rng: Rng): EduRound {
  if (rng.chance(0.3)) return readerMathsRound(rng);
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
  const table = rng.int(2, 12);
  const n = rng.int(2, 12);
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

/** R0716: a word from one of the four tiers, with errors a child might really make. */
function tieredSpellingRound(rng: Rng): EduRound {
  const word = rng.pick(rng.pick(EDU_SPELL_TIERS)).toLowerCase();
  const wrong = pickDistinct(rng, patternErrors(word), 3);
  const { options, answer } = shuffleWithAnswer(rng, mkW(word), wrong.map(mkW));
  return {
    game: 'letters',
    prompt: 'Which is the right spelling?',
    cue: null,
    options,
    answer,
    teach: `${word}: look at it, then cover it and say the letters.`,
    cueClip: wordClip(word),
  };
}

export function readerSpellingRound(rng: Rng): EduRound {
  if (rng.chance(0.85)) return tieredSpellingRound(rng);
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
      cueClip: wordClip(w.word),
      cueAuto: true,
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
    cueClip: wordClip(target),
    cueAuto: true,
  };
}
