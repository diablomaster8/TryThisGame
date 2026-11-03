/**
 * R0716 (KIDS-48): the reader band's bigger content. Spelling words in four tiers (the error
 * patterns are found from the word itself: doubled letters, -tion/-sion, silent letters, ie/ei),
 * plus the lists the new maths rounds draw on. Kept out of `edu.ts` to stay under the line cap.
 */

/** Four tiers, easiest first. Each string is space-separated words. */
export const EDU_SPELL_TIERS: readonly (readonly string[])[] = [
  // Tier 1: short everyday words with a doubled letter or a vowel pair.
  (
    'happy puppy funny sunny bunny berry cherry dinner supper summer winter letter butter ' +
    'ladder mammal pillow yellow hammer rabbit kitten button follow common carrot wallet ' +
    'appear dollar tunnel bottle middle puzzle apple'
  ).split(' '),
  // Tier 2: silent letters and ie/ei.
  (
    'knee knife knock knot know knit wrist write wrong wrap wreck gnome gnat sign design ' +
    'climb thumb crumb lamb comb numb plumb light night right bright fight eight weigh ' +
    'neighbour thought through enough tough ought daughter laugh friend field piece ' +
    'believe chief thief receive ceiling'
  ).split(' '),
  // Tier 3: -tion, -sion and longer words.
  (
    'action nation station fiction question section mention position collection direction ' +
    'invention education attention addition subtraction vacation reaction decision ' +
    'television division confusion explosion invasion conclusion occasion adventure ' +
    'creature picture furniture treasure measure pleasure nature capture mixture temperature'
  ).split(' '),
  // Tier 4: trickier words children meet in stories and science.
  (
    'necessary separate different interesting favourite surprise beautiful dangerous ' +
    'exercise experiment February Wednesday library separate calendar business ' +
    'environment government immediately particular remember special popular ' +
    'quarter occasionally accident accommodate address embarrass community ' +
    'disappear disappoint recommend straight strength length breathe machine'
  )
    .split(' ')
    .filter((w, i, a) => a.indexOf(w) === i),
];

/** Every spelling word of all tiers (lower case), for the clip list and the tests. */
export const EDU_SPELL_WORDS: readonly string[] = [
  ...new Set(EDU_SPELL_TIERS.flat().map((w) => w.toLowerCase())),
];

/**
 * Plausible wrong spellings from the error pattern a word contains, so a distractor looks like
 * something a child might actually write.
 */
export function patternErrors(word: string): string[] {
  const out = new Set<string>();
  const w = word.toLowerCase();
  // Doubling: drop one of a double, or double a single consonant.
  for (let i = 1; i < w.length; i++) {
    if (w[i] === w[i - 1] && !'aeiou'.includes(w[i]!)) out.add(w.slice(0, i) + w.slice(i + 1));
  }
  for (let i = 1; i < w.length - 1; i++) {
    const c = w[i]!;
    if (!'aeiouy'.includes(c) && w[i - 1] !== c && w[i + 1] !== c)
      out.add(w.slice(0, i + 1) + c + w.slice(i + 1));
  }
  // -tion / -sion.
  for (const [from, tos] of [
    ['tion', ['shun', 'sion', 'cion']],
    ['sion', ['tion', 'zhun', 'shion']],
  ] as const) {
    if (w.endsWith(from)) for (const t of tos) out.add(w.slice(0, -4) + t);
  }
  // Silent letters.
  for (const [from, to] of [
    ['kn', 'n'],
    ['wr', 'r'],
    ['gn', 'n'],
    ['mb', 'm'],
    ['gh', ''],
    ['ough', 'ow'],
    ['ough', 'uff'],
  ] as const) {
    const at = w.indexOf(from);
    if (at >= 0) out.add(w.slice(0, at) + to + w.slice(at + from.length));
  }
  // ie / ei.
  if (w.includes('ie')) out.add(w.replace('ie', 'ei'));
  if (w.includes('ei')) out.add(w.replace('ei', 'ie'));
  // A swapped pair and a changed vowel, as a last resort.
  for (let i = 1; i < w.length - 2; i++) {
    if (w[i] !== w[i + 1]) out.add(w.slice(0, i) + w[i + 1] + w[i] + w.slice(i + 2));
  }
  const swap: Record<string, string> = { a: 'e', e: 'a', i: 'y', o: 'u', u: 'o' };
  for (let i = 1; i < w.length; i++) {
    const v = swap[w[i]!];
    if (v) out.add(w.slice(0, i) + v + w.slice(i + 1));
  }
  out.delete(w);
  return [...out];
}

/** Things Shells can buy in the money rounds (name, price in Shells). */
export const EDU_SHOP_PRICES: ReadonlyArray<readonly [string, number]> = [
  ['a bun', 7],
  ['an apple', 12],
  ['a toy boat', 23],
  ['a kite', 18],
  ['a hat', 35],
  ['a ball', 14],
];
