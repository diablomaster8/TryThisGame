import {
  EDU_ANIMALS,
  EDU_COLOURS,
  EDU_COUNT_MAX,
  EDU_LETTERS,
  EDU_SHAPE_SIDES,
  EDU_SHAPES,
  EDU_WORDS,
  type EduAge,
  type EduGameId,
} from '../../config/edu';
import type { EduBand } from '../../content/types';
import type { Rng } from '../../sim/rng';
import { readerRhymeRound, readerSpellingRound, readerSumRound } from './reader-games';

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

export function colourRound(age: EduAge, rng: Rng): EduRound {
  const colours = EDU_COLOURS[age];
  const right = rng.pick(colours);
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
  };
}

export function shapeRound(age: EduAge, rng: Rng): EduRound {
  const shapes = EDU_SHAPES[age];
  const right = rng.pick(shapes);
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
  };
}

const COUNT_ICONS = ['🍎', '⭐', '🐚', '🌼', '🍄', '🥚'];

export function countingRound(age: EduAge, rng: Rng): EduRound {
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
      cue: { kind: 'count', icon, n: right, label: '' },
      options,
      answer,
      teach: `${a} and ${b} make ${right}.`,
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
  const right = rng.int(1, max);
  const pool = Array.from({ length: max }, (_, i) => i + 1);
  const wrong = pickDistinct(rng, pool, optionCount(age) - 1, (n) => n === right);
  const mk = (n: number): EduOption => ({ kind: 'number', n });
  const { options, answer } = shuffleWithAnswer(rng, mk(right), wrong.map(mk));
  return {
    game: 'counting',
    prompt: `How many ${icon}?`,
    cue: { kind: 'count', icon, n: right, label: '' },
    options,
    answer,
    teach: `There are ${right}. Count them: ${pool.slice(0, right).join(', ')}.`,
  };
}

export function letterRound(age: EduAge, rng: Rng, ownName?: string): EduRound {
  const letters = EDU_LETTERS[age];
  const mkL = (l: string): EduOption => ({ kind: 'letter', letter: l });
  // The child's own name first: its first letter comes up often.
  const nameLetter = ownName?.trim().charAt(0).toUpperCase();
  const right =
    nameLetter && /[A-Z]/.test(nameLetter) && rng.chance(0.3) ? nameLetter : rng.pick(letters);
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
  };
}

export function soundRound(age: EduAge, rng: Rng): EduRound {
  const mk = (x: (typeof EDU_WORDS)[number]): EduOption => ({
    kind: 'picture',
    icon: x.icon,
    label: x.word,
  });
  if (age <= 3) {
    // Which animal makes this sound.
    const a = rng.pick(EDU_ANIMALS);
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
    };
  }
  if (age === 4 || (age >= 5 && rng.chance(0.4))) {
    // Same first sound.
    const w = rng.pick(EDU_WORDS);
    const first = w.word.charAt(0);
    const matches = EDU_WORDS.filter((x) => x !== w && x.word.charAt(0) === first);
    const right = matches.length > 0 ? rng.pick(matches) : undefined;
    if (right) {
      const others = pickDistinct(
        rng,
        EDU_WORDS,
        optionCount(age) - 1,
        (x) => x.word.charAt(0) === first,
      );
      const { options, answer } = shuffleWithAnswer(rng, mk(right), others.map(mk));
      return {
        game: 'sounds',
        prompt: `Which one starts like "${w.word}"?`,
        cue: mk(w),
        options,
        answer,
        teach: `${cap(w.word)} and ${right.word} both start with the "${first}" sound.`,
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
    };
  }
  // Rhymes.
  const withPair = EDU_WORDS.filter((w) => EDU_WORDS.some((x) => x !== w && x.rhyme === w.rhyme));
  const w = rng.pick(withPair);
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
  };
}

export function countSyllables(word: string): number {
  const w = word.toLowerCase();
  let n = w.match(/[aeiouy]+/g)?.length ?? 1;
  // A final silent e (cake, whale) does not count; a consonant + "le" (apple) does.
  if (n > 1 && /e$/.test(w) && !/ee$/.test(w) && !/[^aeiouy]le$/.test(w)) n -= 1;
  return Math.max(1, n);
}

export function animalRound(age: EduAge, rng: Rng): EduRound {
  const a = rng.pick(EDU_ANIMALS);
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
  };
}

export function makeRound(
  game: EduGameId,
  age: EduAge,
  rng: Rng,
  ownName?: string,
  band: EduBand = 'sprout',
): EduRound {
  // Readers (7–10) get reader-level rounds in the three games they are offered.
  if (band === 'reader') {
    if (game === 'counting') return readerSumRound(rng);
    if (game === 'letters') return readerSpellingRound(rng);
    if (game === 'sounds') return readerRhymeRound(rng);
  }
  switch (game) {
    case 'colours':
      return colourRound(age, rng);
    case 'shapes':
      return shapeRound(age, rng);
    case 'counting':
      return countingRound(age, rng);
    case 'letters':
      return letterRound(age, rng, ownName);
    case 'sounds':
      return soundRound(age, rng);
    case 'animals':
      return animalRound(age, rng);
  }
}

/** Stars for a round: 3 on the first try, 2 on the second, 1 after that. */
export function starsFor(tries: number): number {
  return tries <= 1 ? 3 : tries === 2 ? 2 : 1;
}
