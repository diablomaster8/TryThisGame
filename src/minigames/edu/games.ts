import {
  EDU_ANIMALS,
  EDU_COLOURS,
  EDU_COUNT_MAX,
  EDU_LADDER,
  EDU_LETTERS,
  EDU_SHAPE_SIDES,
  EDU_SHAPES,
  EDU_WORDS,
  type EduAge,
  type EduGameId,
  type RoundSpec,
} from '../../config/edu';
import type { EduBand } from '../../content/types';
import type { Rng } from '../../sim/rng';
import { readerRhymeRound, readerSpellingRound, readerSumRound } from './reader-games';
import { firstSound } from '../../config/edu';

/**
 * Round generators for the six games. Pure and seeded, so they are testable; the
 * screen only draws them. Each round is a prompt, a few options (3 at age 3, 4 above)
 * and the index of the right one. Options render as a colour swatch, a shape, a big
 * letter, a count of icons, or an emoji with a word.
 */
export type EduOption =
  | { kind: 'colour'; colour: string; label: string }
  | { kind: 'shape'; shape: string; label: string }
  | { kind: 'letter'; letter: string }
  | { kind: 'count'; icon: string; n: number; label: string }
  | { kind: 'number'; n: number }
  /** R0684: a little sum shown as two groups with a plus between, never the total. */
  | { kind: 'sum'; icon: string; a: number; b: number }
  | { kind: 'picture'; icon: string; label: string }
  /** A whole word to read, for the reader band. */
  | { kind: 'word'; word: string };

export interface EduRound {
  game: EduGameId;
  /** Spoken-style prompt for the screen and for the grown-up to read aloud. */
  prompt: string;
  /** A large visual hint shown with the prompt (a letter, a shape, icons). */
  cue: EduOption | null;
  options: EduOption[];
  answer: number;
  /** Shown after the answer, to teach rather than just mark. */
  teach: string;
  /** R0683: what the round asked about, like `letter:G`, for per-item mastery. */
  item?: string;
}

/** R0683: an item's weight for the target pick (weaker items higher); absent = even odds. */
export type Weigh = (item: string) => number;

/**
 * R0683: the round's target. Without a weigher this is a plain pick (the same rng draw as
 * before), so unweighted rounds are unchanged; with one, weaker items come up more often.
 */
export function pickTarget<T>(
  rng: Rng,
  pool: readonly T[],
  id: (t: T) => string,
  weigh?: Weigh,
): T {
  if (!weigh) return rng.pick(pool);
  const ws = pool.map((t) => Math.max(0.01, weigh(id(t))));
  let r = rng.next() * ws.reduce((a, b) => a + b, 0);
  for (let i = 0; i < pool.length; i++) {
    r -= ws[i]!;
    if (r < 0) return pool[i]!;
  }
  return pool[pool.length - 1]!;
}

function optionCount(age: EduAge): number {
  return age <= 3 ? 3 : 4;
}

export function pickDistinct<T>(
  rng: Rng,
  pool: readonly T[],
  n: number,
  not?: (t: T) => boolean,
): T[] {
  const items = pool.filter((t) => !not?.(t));
  const out: T[] = [];
  const used = new Set<number>();
  let guard = 0;
  while (out.length < Math.min(n, items.length) && guard++ < 200) {
    const i = rng.int(0, items.length - 1);
    if (used.has(i)) continue;
    used.add(i);
    out.push(items[i]!);
  }
  return out;
}

export function shuffleWithAnswer<T>(
  rng: Rng,
  right: T,
  others: T[],
): { options: T[]; answer: number } {
  const options = [...others];
  const at = rng.int(0, options.length);
  options.splice(at, 0, right);
  return { options, answer: at };
}

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

export function colourRound(age: EduAge, rng: Rng, weigh?: Weigh): EduRound {
  const colours = EDU_COLOURS[age];
  const right = pickTarget(rng, colours, (c) => `colour:${c}`, weigh);
  const others = pickDistinct(rng, colours, optionCount(age) - 1, (c) => c === right);
  const mk = (c: string): EduOption => ({ kind: 'colour', colour: c, label: cap(c) });
  if (age >= 5 && rng.chance(0.4)) {
    // Sort: which fruit is NOT this colour.
    const { options, answer } = shuffleWithAnswer(
      rng,
      mk(others[0]!),
      [right, right, right].map(mk),
    );
    return {
      game: 'colours',
      prompt: `Which one is not ${right}?`,
      cue: null,
      options,
      answer,
      teach: `That one is ${others[0]}. The others are ${right}.`,
      item: `colour:${right}`,
    };
  }
  const { options, answer } = shuffleWithAnswer(rng, mk(right), others.map(mk));
  return {
    game: 'colours',
    prompt: `Tap the ${right} one.`,
    cue: null,
    options,
    answer,
    teach: `This is ${right}.`,
    item: `colour:${right}`,
  };
}

export function shapeRound(age: EduAge, rng: Rng, weigh?: Weigh): EduRound {
  const shapes = EDU_SHAPES[age];
  const right = pickTarget(rng, shapes, (x) => `shape:${x}`, weigh);
  const others = pickDistinct(rng, shapes, optionCount(age) - 1, (s) => s === right);
  const mk = (s: string): EduOption => ({ kind: 'shape', shape: s, label: cap(s) });
  if (age >= 6 && rng.chance(0.5)) {
    const sides = EDU_SHAPE_SIDES[right] ?? 0;
    if (sides > 0 && sides <= 4) {
      const wrong = pickDistinct(
        rng,
        shapes,
        optionCount(age) - 1,
        (s) => (EDU_SHAPE_SIDES[s] ?? 0) === sides,
      );
      const { options, answer } = shuffleWithAnswer(rng, mk(right), wrong.map(mk));
      return {
        game: 'shapes',
        prompt: `Which shape has ${sides} sides?`,
        cue: null,
        options,
        answer,
        teach: `A ${right} has ${sides} sides.`,
        item: `shape:${right}`,
      };
    }
  }
  const { options, answer } = shuffleWithAnswer(rng, mk(right), others.map(mk));
  return {
    game: 'shapes',
    prompt: `Tap the ${right}.`,
    cue: null,
    options,
    answer,
    teach: `This is a ${right}.`,
    item: `shape:${right}`,
  };
}

const COUNT_ICONS = ['🍎', '⭐', '🐚', '🌼', '🍄', '🥚'];

export function countingRound(age: EduAge, rng: Rng, weigh?: Weigh): EduRound {
  const max = EDU_COUNT_MAX[age];
  const icon = rng.pick(COUNT_ICONS);
  if (age >= 6 && rng.chance(0.5)) {
    // A little sum up to ten.
    const a = rng.int(1, 5);
    const b = rng.int(1, Math.min(5, 10 - a));
    const right = a + b;
    const wrong = pickDistinct(rng, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 3, (n) => n === right);
    const mk = (n: number): EduOption => ({ kind: 'number', n });
    const { options, answer } = shuffleWithAnswer(rng, mk(right), wrong.map(mk));
    return {
      game: 'counting',
      prompt: `${a} ${icon} and ${b} more ${icon}. How many altogether?`,
      cue: { kind: 'sum', icon, a, b },
      options,
      answer,
      teach: `${a} and ${b} make ${right}.`,
      item: `sum:${right}`,
    };
  }
  if (age >= 5 && rng.chance(0.35)) {
    // More or fewer.
    const a = rng.int(1, max);
    let b = rng.int(1, max);
    if (b === a) b = a === max ? a - 1 : a + 1;
    const more = rng.chance(0.5);
    const right = more ? Math.max(a, b) : Math.min(a, b);
    const mk = (n: number): EduOption => ({ kind: 'count', icon, n, label: String(n) });
    const { options, answer } = shuffleWithAnswer(rng, mk(right), [
      mk(more ? Math.min(a, b) : Math.max(a, b)),
    ]);
    return {
      game: 'counting',
      prompt: more ? 'Which has more?' : 'Which has fewer?',
      cue: null,
      options,
      answer,
      teach: `${right} is ${more ? 'more' : 'fewer'}.`,
    };
  }
  const pool = Array.from({ length: max }, (_, i) => i + 1);
  const right = weigh ? pickTarget(rng, pool, (n) => `count:${n}`, weigh) : rng.int(1, max);
  const wrong = pickDistinct(rng, pool, optionCount(age) - 1, (n) => n === right);
  const mk = (n: number): EduOption => ({ kind: 'number', n });
  const { options, answer } = shuffleWithAnswer(rng, mk(right), wrong.map(mk));
  return {
    game: 'counting',
    prompt: `How many ${icon}?`,
    cue: { kind: 'count', icon, n: right, label: '' },
    options,
    answer,
    teach: `${countPhrase(right)}. Count them: ${pool.slice(0, right).join(', ')}.`,
    item: `count:${right}`,
  };
}

/**
 * R0682 (KIDS-14): a counting round for one rung of the ladder: count to 3, 5 or 10, more or
 * fewer, or sums to 5 or 10. The child's age still sets how many options show. A rung past
 * plain counting mixes in a count-to-ten round now and then, for review.
 */
export function countingRung(spec: RoundSpec, age: EduAge, rng: Rng, weigh?: Weigh): EduRound {
  const max = spec.max ?? EDU_COUNT_MAX[age];
  const icon = rng.pick(COUNT_ICONS);
  const mode = spec.mode !== 'count' && rng.chance(0.25) ? 'count' : (spec.mode ?? 'count');
  const top = mode === spec.mode ? max : 10;
  const pool = Array.from({ length: top }, (_, i) => i + 1);
  const mkN = (n: number): EduOption => ({ kind: 'number', n });
  if (mode === 'sum') {
    const right = pickTarget(rng, pool.slice(1), (n) => `sum:${n}`, weigh);
    const a = rng.int(Math.max(1, right - 5), Math.min(5, right - 1));
    const b = right - a;
    const wrong = pickDistinct(rng, pool, optionCount(age) - 1, (n) => n === right);
    const { options, answer } = shuffleWithAnswer(rng, mkN(right), wrong.map(mkN));
    return {
      game: 'counting',
      prompt: `${a} ${icon} and ${b} more ${icon}. How many altogether?`,
      cue: { kind: 'sum', icon, a, b },
      options,
      answer,
      teach: `${a} and ${b} make ${right}.`,
      item: `sum:${right}`,
    };
  }
  if (mode === 'moreFewer') {
    const a = rng.int(1, top);
    let b = rng.int(1, top);
    if (b === a) b = a === top ? a - 1 : a + 1;
    const more = rng.chance(0.5);
    const right = more ? Math.max(a, b) : Math.min(a, b);
    const mk = (n: number): EduOption => ({ kind: 'count', icon, n, label: String(n) });
    const { options, answer } = shuffleWithAnswer(rng, mk(right), [
      mk(more ? Math.min(a, b) : Math.max(a, b)),
    ]);
    return {
      game: 'counting',
      prompt: more ? 'Which has more?' : 'Which has fewer?',
      cue: null,
      options,
      answer,
      teach: `${right} is ${more ? 'more' : 'fewer'}.`,
    };
  }
  const right = pickTarget(rng, pool, (n) => `count:${n}`, weigh);
  const wrong = pickDistinct(rng, pool, optionCount(age) - 1, (n) => n === right);
  const { options, answer } = shuffleWithAnswer(rng, mkN(right), wrong.map(mkN));
  return {
    game: 'counting',
    prompt: `How many ${icon}?`,
    cue: { kind: 'count', icon, n: right, label: '' },
    options,
    answer,
    teach: `${countPhrase(right)}. Count them: ${pool.slice(0, right).join(', ')}.`,
    item: `count:${right}`,
  };
}

export function letterRound(age: EduAge, rng: Rng, ownName?: string, weigh?: Weigh): EduRound {
  const letters = EDU_LETTERS[age];
  const mkL = (l: string): EduOption => ({ kind: 'letter', letter: l });
  // The child's own name first: its first letter comes up often.
  const nameLetter = ownName?.trim().charAt(0).toUpperCase();
  const right =
    nameLetter && /[A-Z]/.test(nameLetter) && rng.chance(0.3)
      ? nameLetter
      : pickTarget(rng, letters, (l) => `letter:${l}`, weigh);
  if (age >= 5 && rng.chance(0.5)) {
    // First letter of a picture word.
    const words = EDU_WORDS.filter((w) => w.word.charAt(0).toUpperCase() === right);
    const w = words.length > 0 ? rng.pick(words) : undefined;
    if (w) {
      const others = pickDistinct(
        rng,
        EDU_WORDS,
        optionCount(age) - 1,
        (x) => x.word.charAt(0).toUpperCase() === right,
      );
      const mk = (x: (typeof EDU_WORDS)[number]): EduOption => ({
        kind: 'picture',
        icon: x.icon,
        label: x.word,
      });
      const { options, answer } = shuffleWithAnswer(rng, mk(w), others.map(mk));
      return {
        game: 'letters',
        prompt: `Which one starts with ${right}?`,
        cue: mkL(right),
        options,
        answer,
        teach: `${cap(w.word)} starts with ${right}.`,
        item: `letter:${right}`,
      };
    }
  }
  if (age >= 6 && rng.chance(0.4)) {
    // Match the small letter to the big one.
    const wrong = pickDistinct(rng, letters, optionCount(age) - 1, (l) => l === right);
    const { options, answer } = shuffleWithAnswer(
      rng,
      mkL(right.toLowerCase()),
      wrong.map((l) => mkL(l.toLowerCase())),
    );
    return {
      game: 'letters',
      prompt: `Which small letter is ${right}?`,
      cue: mkL(right),
      options,
      answer,
      teach: `Big ${right}, small ${right.toLowerCase()}.`,
      item: `letter:${right}`,
    };
  }
  const wrong = pickDistinct(rng, letters, optionCount(age) - 1, (l) => l === right);
  const { options, answer } = shuffleWithAnswer(rng, mkL(right), wrong.map(mkL));
  const word = EDU_WORDS.find((w) => w.word.charAt(0).toUpperCase() === right);
  return {
    game: 'letters',
    prompt: `Tap the letter ${right}.`,
    cue: word ? { kind: 'picture', icon: word.icon, label: `${right} is for ${word.word}` } : null,
    options,
    answer,
    teach: word ? `${right} is for ${word.word}.` : `This is ${right}.`,
    item: `letter:${right}`,
  };
}

export function soundRound(age: EduAge, rng: Rng, weigh?: Weigh): EduRound {
  const mk = (x: (typeof EDU_WORDS)[number]): EduOption => ({
    kind: 'picture',
    icon: x.icon,
    label: x.word,
  });
  if (age <= 3) {
    // Which animal makes this sound.
    const a = pickTarget(rng, EDU_ANIMALS, (x) => `animal:${x.name}`, weigh);
    const others = pickDistinct(rng, EDU_ANIMALS, 2, (x) => x.sound === a.sound);
    const mkA = (x: (typeof EDU_ANIMALS)[number]): EduOption => ({
      kind: 'picture',
      icon: x.icon,
      label: x.name,
    });
    const { options, answer } = shuffleWithAnswer(rng, mkA(a), others.map(mkA));
    return {
      game: 'sounds',
      prompt: `Who says "${a.sound}"?`,
      cue: null,
      options,
      answer,
      teach: `The ${a.name} says ${a.sound}.`,
      item: `animal:${a.name}`,
    };
  }
  if (age === 4 || (age >= 5 && rng.chance(0.4))) {
    // Same first sound.
    const w = pickTarget(rng, EDU_WORDS, (x) => `word:${x.word}`, weigh);
    const first = firstSound(w.word);
    const matches = EDU_WORDS.filter((x) => x !== w && firstSound(x.word) === first);
    const right = matches.length > 0 ? rng.pick(matches) : undefined;
    if (right) {
      const others = pickDistinct(
        rng,
        EDU_WORDS,
        optionCount(age) - 1,
        (x) => firstSound(x.word) === first,
      );
      const { options, answer } = shuffleWithAnswer(rng, mk(right), others.map(mk));
      return {
        game: 'sounds',
        prompt: `Which one starts like "${w.word}"?`,
        cue: mk(w),
        options,
        answer,
        teach: `${cap(w.word)} and ${right.word} both start with the "${first}" sound.`,
        item: `word:${w.word}`,
      };
    }
  }
  if (age === 6 && rng.chance(0.4)) {
    // Clap the syllables.
    const w = rng.pick(EDU_WORDS.filter((x) => x.word.length >= 3));
    const syll = countSyllables(w.word);
    const mkN = (n: number): EduOption => ({ kind: 'number', n });
    const wrong = pickDistinct(rng, [1, 2, 3], 2, (n) => n === syll);
    const { options, answer } = shuffleWithAnswer(rng, mkN(syll), wrong.map(mkN));
    return {
      game: 'sounds',
      prompt: `Clap "${w.word}". How many claps?`,
      cue: mk(w),
      options,
      answer,
      teach: `${cap(w.word)} has ${syll} ${syll === 1 ? 'clap' : 'claps'}.`,
      item: `word:${w.word}`,
    };
  }
  // Rhymes.
  const withPair = EDU_WORDS.filter((w) => EDU_WORDS.some((x) => x !== w && x.rhyme === w.rhyme));
  const w = pickTarget(rng, withPair, (x) => `word:${x.word}`, weigh);
  const right = rng.pick(EDU_WORDS.filter((x) => x !== w && x.rhyme === w.rhyme));
  const others = pickDistinct(rng, EDU_WORDS, optionCount(age) - 1, (x) => x.rhyme === w.rhyme);
  const { options, answer } = shuffleWithAnswer(rng, mk(right), others.map(mk));
  return {
    game: 'sounds',
    prompt: `Which one rhymes with "${w.word}"?`,
    cue: mk(w),
    options,
    answer,
    teach: `${cap(w.word)} rhymes with ${right.word}.`,
    item: `word:${w.word}`,
  };
}

export function countSyllables(word: string): number {
  const w = word.toLowerCase();
  let n = w.match(/[aeiouy]+/g)?.length ?? 1;
  // A final silent e (cake, whale) does not count; a consonant + "le" (apple) does.
  if (n > 1 && /e$/.test(w) && !/ee$/.test(w) && !/[^aeiouy]le$/.test(w)) n -= 1;
  return Math.max(1, n);
}

export function animalRound(age: EduAge, rng: Rng, weigh?: Weigh): EduRound {
  const a = pickTarget(rng, EDU_ANIMALS, (x) => `animal:${x.name}`, weigh);
  const mk = (x: (typeof EDU_ANIMALS)[number]): EduOption => ({
    kind: 'picture',
    icon: x.icon,
    label: x.name,
  });
  const n = optionCount(age) - 1;
  if (age === 4 || (age >= 5 && rng.chance(0.3))) {
    const others = pickDistinct(rng, EDU_ANIMALS, n, (x) => x.sound === a.sound);
    const { options, answer } = shuffleWithAnswer(rng, mk(a), others.map(mk));
    return {
      game: 'animals',
      prompt: `Which one says "${a.sound}"?`,
      cue: null,
      options,
      answer,
      teach: `The ${a.name} says ${a.sound}.`,
      item: `animal:${a.name}`,
    };
  }
  if (age === 5 || (age === 6 && rng.chance(0.4))) {
    const where = {
      water: 'in the water',
      sky: 'in the sky',
      land: 'on the land',
      farm: 'on a farm',
    }[a.home];
    const others = pickDistinct(rng, EDU_ANIMALS, n, (x) => x.home === a.home);
    const { options, answer } = shuffleWithAnswer(rng, mk(a), others.map(mk));
    return {
      game: 'animals',
      prompt: `Which one lives ${where}?`,
      cue: null,
      options,
      answer,
      teach: `The ${a.name} lives ${where}.`,
      item: `animal:${a.name}`,
    };
  }
  if (age === 6) {
    const others = pickDistinct(rng, EDU_ANIMALS, n, (x) => x.baby === a.baby);
    const { options, answer } = shuffleWithAnswer(rng, mk(a), others.map(mk));
    return {
      game: 'animals',
      prompt: `A ${a.baby} grows up to be a…`,
      cue: null,
      options,
      answer,
      teach: `A baby ${a.name} is a ${a.baby}.`,
      item: `animal:${a.name}`,
    };
  }
  const others = pickDistinct(rng, EDU_ANIMALS, n, (x) => x.name === a.name);
  const { options, answer } = shuffleWithAnswer(rng, mk(a), others.map(mk));
  return {
    game: 'animals',
    prompt: `Tap the ${a.name}.`,
    cue: null,
    options,
    answer,
    teach: `This is a ${a.name}. It says ${a.sound}.`,
    item: `animal:${a.name}`,
  };
}

/**
 * R0684: a round's target, so a session can avoid asking the same thing twice (the prompt and
 * the right option together: "Which is the right spelling?" differs only by its answer).
 */
export function roundKey(r: EduRound): string {
  return `${r.prompt}|${JSON.stringify(r.options[r.answer] ?? null)}`;
}

/**
 * A round, retried a few times when `avoid` already holds its target. A small pool (counting
 * to three) may still repeat once every target has been asked.
 */
export function makeRound(
  game: EduGameId,
  age: EduAge,
  rng: Rng,
  ownName?: string,
  band: EduBand = 'sprout',
  avoid?: Set<string>,
  ladder?: LadderOpts,
): EduRound {
  let r = makeOne(game, age, rng, ownName, band, ladder);
  for (let k = 0; avoid?.has(roundKey(r)) && k < 12; k++)
    r = makeOne(game, age, rng, ownName, band, ladder);
  avoid?.add(roundKey(r));
  return r;
}

/**
 * R0682 / R0683: the rung a sprout's game is on (from `eduRung`) and the item weigher (from
 * `eduWeigher`). Without them a round is made by age alone, as before.
 */
export interface LadderOpts {
  rung?: number;
  weigh?: Weigh;
}

function makeOne(
  game: EduGameId,
  age: EduAge,
  rng: Rng,
  ownName: string | undefined,
  band: EduBand,
  ladder?: LadderOpts,
): EduRound {
  // Readers (7–10) get reader-level rounds in the three games they are offered.
  if (band === 'reader') {
    if (game === 'counting') return readerSumRound(rng);
    if (game === 'letters') return readerSpellingRound(rng);
    if (game === 'sounds') return readerRhymeRound(rng);
  }
  const weigh = ladder?.weigh;
  const rungs = EDU_LADDER[game];
  const spec =
    ladder?.rung === undefined
      ? undefined
      : rungs[Math.max(0, Math.min(rungs.length - 1, ladder.rung))];
  if (spec && game === 'counting') return countingRung(spec, age, rng, weigh);
  const at = spec?.age ?? age;
  switch (game) {
    case 'colours':
      return colourRound(at, rng, weigh);
    case 'shapes':
      return shapeRound(at, rng, weigh);
    case 'counting':
      return countingRound(at, rng, weigh);
    case 'letters':
      return letterRound(at, rng, ownName, weigh);
    case 'sounds':
      return soundRound(at, rng, weigh);
    case 'animals':
      return animalRound(at, rng, weigh);
  }
}

/** R0684: "There is 1", "There are 3". */
export function countPhrase(n: number): string {
  return n === 1 ? 'There is 1' : `There are ${n}`;
}

/** Stars for a round: 3 on the first try, 2 on the second, 1 after that. */
export function starsFor(tries: number): number {
  return tries <= 1 ? 3 : tries === 2 ? 2 : 1;
}
