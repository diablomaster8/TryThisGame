/**
 * Lane E r10, R0700 (KIDS-32): which small interaction a lesson's `do` beat opens, read from
 * its check string (`edu:<verb>:<thing>:<detail>`, `lang:<he|ja>:<verb>:…`). Pure, with no
 * DOM, so content-check can report the checks no beat covers and the tests can drive it.
 *
 * Six beats are real interactions (`ui/do-beats.ts`): count, sort (and order), paint, draw,
 * find and say. "We did it!" stays only for the truly physical beats (clap, breathe, wave…),
 * where the child's own body is the task.
 */

export type DoLang = 'he' | 'ja' | null;

export type DoBeat =
  | { kind: 'count'; thing: string; n: number; lang: DoLang }
  | { kind: 'sort'; thing: string; groups: string[] }
  | { kind: 'order'; items: string[] }
  | { kind: 'paint'; colour: string }
  | { kind: 'draw'; thing: string }
  | { kind: 'find'; targets: string[]; colour: boolean }
  | { kind: 'say'; thing: string }
  | { kind: 'body'; verb: string };

type BeatKind = DoBeat['kind'];

/** Every do verb in the scripts, by the beat it opens. A new verb goes here (content-check warns). */
export const DO_VERBS: Readonly<Record<string, BeatKind>> = {
  // Counting: tap each thing; it lights and is counted aloud.
  count: 'count',
  'count-on': 'count',
  tally: 'count',
  add: 'count',
  subtract: 'count',
  multiply: 'count',
  measure: 'count',
  calculate: 'count',
  // Sorting into baskets (drag, or tap then tap the basket).
  sort: 'sort',
  match: 'sort',
  place: 'sort',
  pack: 'sort',
  label: 'sort',
  compare: 'sort',
  list: 'sort',
  fit: 'sort',
  // Putting things in their order.
  order: 'order',
  // Painting planks with a named colour.
  paint: 'paint',
  colour: 'paint',
  fill: 'paint',
  cover: 'paint',
  shine: 'paint',
  print: 'paint',
  water: 'paint',
  // A free drawing, then showing it to the Nubbin.
  draw: 'draw',
  trace: 'draw',
  write: 'draw',
  make: 'draw',
  chart: 'draw',
  copy: 'draw',
  build: 'draw',
  fold: 'draw',
  weave: 'draw',
  cut: 'draw',
  shadow: 'draw',
  // Finding the named thing in a picture.
  find: 'find',
  tap: 'find',
  point: 'find',
  look: 'find',
  pick: 'find',
  touch: 'find',
  press: 'find',
  knock: 'find',
  check: 'find',
  focus: 'find',
  name: 'find',
  // A "your turn" pause to say, sing or listen, with no microphone.
  say: 'say',
  sing: 'say',
  chant: 'say',
  hum: 'say',
  tell: 'say',
  read: 'say',
  listen: 'say',
  recite: 'say',
  review: 'say',
  quiz: 'say',
  whisper: 'say',
  voice: 'say',
  rhyme: 'say',
  ring: 'say',
  hush: 'say',
  play: 'say',
  test: 'say',
  // The body is the task: "We did it!" stays.
  clap: 'body',
  breathe: 'body',
  act: 'body',
  show: 'body',
  hold: 'body',
  share: 'body',
  wait: 'body',
  sit: 'body',
  feel: 'body',
  blow: 'body',
  wave: 'body',
  stand: 'body',
  turn: 'body',
  tiptoe: 'body',
  rub: 'body',
  pluck: 'body',
  hop: 'body',
  follow: 'body',
  drop: 'body',
  dance: 'body',
  carry: 'body',
  balance: 'body',
  wiggle: 'body',
  trot: 'body',
  time: 'body',
  tie: 'body',
  'throw-catch': 'body',
  stretch: 'body',
  step: 'body',
  squeeze: 'body',
  slide: 'body',
  pull: 'body',
  pet: 'body',
  march: 'body',
  lift: 'body',
  keep: 'body',
  freeze: 'body',
  move: 'body',
  bow: 'body',
};

/** Colour words a beat can draw, as CSS. Each is always shown with its name too. */
export const DO_COLOURS: Readonly<Record<string, string>> = {
  red: '#e05a4f',
  orange: '#ef9a3c',
  yellow: '#e8c840',
  gold: '#d9a521',
  green: '#5bb36a',
  blue: '#4f8fe0',
  purple: '#9a6ad6',
  pink: '#ec8fb4',
  brown: '#8a5a36',
  grey: '#8c8f94',
  white: '#f4f1e8',
  black: '#2b2b33',
  dark: '#3c3a4a',
  light: '#ece7d6',
  pale: '#f1e6c4',
  warm: '#ef8a4a',
  cool: '#5aa6c8',
};

/** Parts of a detail that say how to sort or order, not what. */
const NOT_ITEMS = new Set([
  'or',
  'and',
  'of',
  'first',
  'oldest',
  'newest',
  'size',
  'song',
  'kind',
  'colour',
  'both',
  'match',
  'each',
  'one',
]);

const DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

/** Pure: the verb of a check, or null when it isn't a lesson check. */
export function doVerb(check: string): string | null {
  const p = check.split(':');
  if (p[0] === 'edu') return p[1] ?? null;
  if (p[0] === 'lang') return p[2] ?? null;
  return null;
}

/** Pure: the beat a check opens. Unknown verbs fall back to the honour button. */
export function doBeatFor(check: string): DoBeat {
  const p = check.split(':');
  const lang: DoLang = p.includes('he') ? 'he' : p.includes('ja') ? 'ja' : null;
  const verb = doVerb(check) ?? '';
  const rest = p.slice(p[0] === 'lang' ? 3 : 2).filter((s) => s !== 'he' && s !== 'ja');
  const thing = rest[0] ?? '';
  const detail = rest.length > 1 ? rest[rest.length - 1]! : '';
  const kind = DO_VERBS[verb];
  const words = (s: string): string[] => s.split('-').filter((w) => w && !NOT_ITEMS.has(w));
  switch (kind) {
    case 'count': {
      const nums = rest.map(Number).filter((x) => Number.isInteger(x) && x > 0);
      const n = Math.min(20, nums[nums.length - 1] ?? 5);
      return { kind: 'count', thing, n, lang };
    }
    case 'sort': {
      const g = words(detail).slice(0, 3);
      if (g.length >= 2) return { kind: 'sort', thing, groups: g };
      if (detail === 'size' || thing === 'size')
        return { kind: 'sort', thing, groups: ['big', 'small'] };
      return { kind: 'sort', thing, groups: ['red', 'blue'] };
    }
    case 'order': {
      if (thing === 'days-of-week') return { kind: 'order', items: DAYS.slice(0, 4) };
      const n = Number(detail);
      if (Number.isInteger(n) && n >= 2)
        return {
          kind: 'order',
          items: Array.from({ length: Math.min(n, 6) }, (_, i) => String(i + 1)),
        };
      const items = words(detail);
      if (items.length >= 2) return { kind: 'order', items: items.slice(0, 5) };
      return { kind: 'order', items: ['1', '2', '3'] };
    }
    case 'paint': {
      const c = [...rest]
        .reverse()
        .flatMap(words)
        .find((w) => DO_COLOURS[w]);
      return { kind: 'paint', colour: c ?? 'yellow' };
    }
    case 'draw':
      return { kind: 'draw', thing };
    case 'find': {
      const t = words(detail || thing);
      const colour = t.length > 0 && t.every((w) => DO_COLOURS[w] !== undefined);
      return { kind: 'find', targets: (t.length ? t : [thing]).slice(0, 4), colour };
    }
    case 'say':
      return { kind: 'say', thing };
    default:
      return { kind: 'body', verb };
  }
}

/** Pure: a check whose verb has no beat (content-check reports these). */
export function doUnmapped(check: string): boolean {
  const v = doVerb(check);
  return v !== null && DO_VERBS[v] === undefined;
}

/** Pure: a script word ("bike-wheels") as the words a child hears ("bike wheels"). */
export function doWords(s: string): string {
  return s.replace(/-/g, ' ');
}
