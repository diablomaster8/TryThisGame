import { EDU_SHOP_PRICES, EDU_SPELL_TIERS, patternErrors } from '../../config/edu-reader';
import {
  EDU_FLOATERS,
  EDU_HABITAT_ANIMALS,
  EDU_HABITATS,
  EDU_LIVING,
  EDU_READING,
  EDU_WATER_STATE_TEACH,
  EDU_WATER_STATES,
} from '../../config/edu-reader-r13';
import { EDU_READER_RHYMES, EDU_READER_WORDS, wordClip, type EduGameId } from '../../config/edu';
import type { Rng } from '../../sim/rng';
import { pickDistinct, shuffleWithAnswer, type EduOption, type EduRound } from './games';

/**
 * Rounds for the reader band (ages 7–10), so older children are not offered letter names
 * and little sums (review C, item 18). R0716 gives readers eight games: counting becomes sums
 * and take-aways; letters becomes spelling; sounds becomes rhymes and syllables; and five new
 * games (times tables, clock and Shells, place value and fractions, reading, nature sorting)
 * each have their own id, ladder entry and standards. Pure and seeded like the sprout rounds.
 */

const mkN = (n: number): EduOption => ({ kind: 'number', n });
const mkW = (word: string): EduOption => ({ kind: 'word', word });
const cap2 = (s: string): string => s.charAt(0).toUpperCase() + s.slice(1);
/** "a rock", "an apple": the article for a noun phrase. */
const art = (name: string): string => (/^[aeiou]/i.test(name) ? `an ${name}` : `a ${name}`);

/** Four number options around the answer, all different and none below zero. */
function numberOptions(rng: Rng, right: number): { options: EduOption[]; answer: number } {
  const near = [-3, -2, -1, 1, 2, 3, 10, -10].map((d) => right + d).filter((n) => n >= 0);
  const wrong = pickDistinct(rng, near, 3);
  return shuffleWithAnswer(rng, mkN(right), wrong.map(mkN));
}

/** Place-value options: the answer and values of the same digit in other places. */
function valueOptions(
  rng: Rng,
  right: number,
  digit: number,
): { options: EduOption[]; answer: number } {
  const pool = [1, 10, 100, 1000].map((m) => digit * m).filter((n) => n !== right);
  return shuffleWithAnswer(rng, mkN(right), pickDistinct(rng, pool, 3).map(mkN));
}

/** Place value: what a digit is worth in its place, in a two- or three-digit number. */
export function readerPlaceValueRound(rng: Rng): EduRound {
  const len = rng.chance(0.4) ? 2 : 3;
  const digits = Array.from({ length: len }, (_, i) => (i === 0 ? rng.int(1, 9) : rng.int(0, 9)));
  const nonZero = digits.map((d, i) => (d === 0 ? -1 : i)).filter((i) => i >= 0);
  const at = rng.pick(nonZero);
  const d = digits[at]!;
  const names = len === 2 ? ['tens', 'ones'] : ['hundreds', 'tens', 'ones'];
  const mult = 10 ** (len - 1 - at);
  const num = Number(digits.join(''));
  return {
    game: 'numbers',
    prompt: `In ${num}, what is the value of the ${d} in the ${names[at]} place?`,
    cue: null,
    ...valueOptions(rng, d * mult, d),
    teach: `The ${d} is in the ${names[at]} place, so it is worth ${d * mult}.`,
  };
}

/** Halves, quarters and thirds of a whole number of things. */
export function readerFractionRound(rng: Rng): EduRound {
  const kinds = [
    { name: 'half', div: 2, wholes: [6, 8, 10, 12, 14, 16, 18, 20, 24, 30, 40] },
    { name: 'a quarter', div: 4, wholes: [8, 12, 16, 20, 24, 28, 32, 40] },
    { name: 'a third', div: 3, wholes: [6, 9, 12, 15, 18, 21, 24, 30] },
  ] as const;
  const k = rng.pick(kinds);
  const whole = rng.pick(k.wholes);
  const share = whole / k.div;
  return {
    game: 'numbers',
    prompt: `What is ${k.name} of ${whole}?`,
    cue: null,
    ...numberOptions(rng, share),
    teach: `Share ${whole} into ${k.div} equal groups: each group has ${share}.`,
  };
}

/** The "number sense" game: place value or a fraction of a number. */
export function readerNumbersRound(rng: Rng): EduRound {
  return rng.chance(0.6) ? readerPlaceValueRound(rng) : readerFractionRound(rng);
}

/** Telling the time on a clock face, to the quarter hour. */
export function readerClockRound(rng: Rng): EduRound {
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
    game: 'timeMoney',
    prompt: 'What time does the clock show?',
    cue: { kind: 'clock', h, m },
    options,
    answer,
    teach: `The short hand points to ${m === 45 ? (h % 12) + 1 : h}, the long hand to ${m / 5}: ${right}.`,
  };
}

/** Money with Shells: make a price, or work out the change. */
export function readerMoneyRound(rng: Rng): EduRound {
  const [thing] = rng.pick(EDU_SHOP_PRICES);
  const price = rng.int(11, 49);
  if (price % 10 !== 0 && rng.chance(0.5)) {
    const tens = Math.floor(price / 10) * 10;
    return {
      game: 'timeMoney',
      prompt: `${cap2(thing)} costs ${price} 🐚. You pay ${tens} 🐚 and then ? more.`,
      cue: null,
      ...numberOptions(rng, price - tens),
      teach: `${tens} + ${price - tens} = ${price} Shells.`,
    };
  }
  const paid = price < 30 ? 50 : 100;
  return {
    game: 'timeMoney',
    prompt: `${cap2(thing)} costs ${price} 🐚. You pay ${paid} 🐚. How much change?`,
    cue: null,
    ...numberOptions(rng, paid - price),
    teach: `${paid} − ${price} = ${paid - price}. Count up from ${price} to ${paid}.`,
  };
}

/** The "clock and Shells" game. */
export function readerTimeMoneyRound(rng: Rng): EduRound {
  return rng.chance(0.5) ? readerClockRound(rng) : readerMoneyRound(rng);
}

/** R0716: place value, telling the time, money in Shells and simple fractions, mixed. */
export function readerMathsRound(rng: Rng): EduRound {
  const kind = rng.int(0, 3);
  if (kind === 0) return readerPlaceValueRound(rng);
  if (kind === 1) return readerClockRound(rng);
  if (kind === 2) return readerMoneyRound(rng);
  return readerFractionRound(rng);
}

/** Times tables 2 to 12, as a product or as the missing factor. */
export function readerTimesRound(rng: Rng): EduRound {
  const table = rng.int(2, 12);
  const n = rng.int(2, 12);
  if (rng.chance(0.25)) {
    return {
      game: 'times',
      prompt: `${table} × ? = ${n * table}`,
      cue: null,
      ...numberOptions(rng, n),
      teach: `${table} × ${n} = ${n * table}. Count in ${table}s until you reach ${n * table}.`,
    };
  }
  return {
    game: 'times',
    prompt: `What is ${n} × ${table}?`,
    cue: null,
    ...numberOptions(rng, n * table),
    teach: `${n} lots of ${table} make ${n * table}. Count in ${table}s.`,
  };
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
  // Two-digit adding and taking away, to 100.
  const a = rng.int(21, 79);
  const b = rng.int(11, 99 - a);
  if (rng.chance(0.5)) {
    return {
      game: 'counting',
      prompt: `What is ${a} + ${b}?`,
      cue: null,
      ...numberOptions(rng, a + b),
      teach: `${a} + ${b} = ${a + b}. Add the tens, then the ones.`,
    };
  }
  return {
    game: 'counting',
    prompt: `What is ${a + b} − ${b}?`,
    cue: null,
    ...numberOptions(rng, a),
    teach: `${a + b} − ${b} = ${a}. Take away the tens, then the ones.`,
  };
}

/**
 * R0716: a short original passage with a picture, then a who, what or why question about it.
 * The passage rides in the cue (a picture with its text); the question is the prompt.
 */
export function readerReadingRound(rng: Rng): EduRound {
  const p = rng.pick(EDU_READING);
  const q = rng.pick(p.qs);
  const { options, answer } = shuffleWithAnswer(rng, mkW(q.right), q.wrong.map(mkW));
  return {
    game: 'reading',
    prompt: q.q,
    cue: { kind: 'picture', icon: p.icon, label: p.text },
    options,
    answer,
    teach: `Look back at the passage. The answer is: ${q.right}.`,
  };
}

/** Two-way word options: the right one and the other, in a seeded order. */
function pairOptions(rng: Rng, right: string, other: string) {
  return shuffleWithAnswer(rng, mkW(right), [mkW(other)]);
}

/**
 * R0716: sorting from the Learning Grove's science lessons: living or not living, float or
 * sink, the states of water, and where an animal lives. Every item is equally likely.
 */
export function readerScienceRound(rng: Rng): EduRound {
  const nL = EDU_LIVING.length;
  const nF = EDU_FLOATERS.length;
  const nW = EDU_WATER_STATES.length;
  const nH = EDU_HABITAT_ANIMALS.length;
  const k = rng.int(0, nL + nF + nW + nH - 1);
  if (k < nL) {
    const t = EDU_LIVING[k]!;
    return {
      game: 'science',
      prompt: `Is ${art(t.name)} living or not living?`,
      cue: { kind: 'picture', icon: t.icon, label: t.name },
      ...pairOptions(rng, t.living ? 'living' : 'not living', t.living ? 'not living' : 'living'),
      teach: `${cap2(t.name)}: ${t.why}`,
    };
  }
  if (k < nL + nF) {
    const t = EDU_FLOATERS[k - nL]!;
    return {
      game: 'science',
      prompt: `Will ${art(t.name)} float or sink in water?`,
      cue: { kind: 'picture', icon: t.icon, label: t.name },
      ...pairOptions(rng, t.floats ? 'float' : 'sink', t.floats ? 'sink' : 'float'),
      teach: `${cap2(t.name)}: ${t.why}`,
    };
  }
  if (k < nL + nF + nW) {
    const t = EDU_WATER_STATES[k - nL - nF]!;
    const wrong = (['solid', 'liquid', 'gas'] as const).filter((s) => s !== t.state);
    return {
      game: 'science',
      prompt: `Is ${t.thing} a solid, a liquid or a gas?`,
      cue: { kind: 'picture', icon: t.icon, label: t.thing },
      ...shuffleWithAnswer(rng, mkW(t.state), wrong.map(mkW)),
      teach: EDU_WATER_STATE_TEACH[t.state],
    };
  }
  const t = EDU_HABITAT_ANIMALS[k - nL - nF - nW]!;
  const others = pickDistinct(rng, EDU_HABITATS, 3, (h) => h === t.home);
  return {
    game: 'science',
    prompt: `Where does ${art(t.name)} live?`,
    cue: { kind: 'picture', icon: t.icon, label: t.name },
    ...shuffleWithAnswer(rng, mkW(t.home), others.map(mkW)),
    teach: `${cap2(art(t.name))} lives in ${t.home === 'icy land' ? t.home : `the ${t.home}`}, where it finds what it needs.`,
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

/** R0716: each reader game's round maker, by game id (registered in `games.ts`). */
export const READER_ROUNDS: Partial<Record<EduGameId, (rng: Rng) => EduRound>> = {
  counting: readerSumRound,
  times: readerTimesRound,
  timeMoney: readerTimeMoneyRound,
  numbers: readerNumbersRound,
  letters: readerSpellingRound,
  reading: readerReadingRound,
  sounds: readerRhymeRound,
  science: readerScienceRound,
};
