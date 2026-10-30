/**
 * R0341 (FUN-52): small English helpers for templated strings, so a vowel gets "an", a
 * count other than one gets its plural, and 21 is "21st". Pure, no imports.
 */

/** Words that start with a vowel letter but a consonant sound, and the reverse. */
const AN_EXCEPT = /^(uni|use|usu|eu|one|once|ur)/i;
const AN_SILENT_H = /^(hour|honest|honou?r|heir)/i;

/** "a" or "an" before `word` (by its sound, as near as spelling allows). */
export function article(word: string): 'a' | 'an' {
  const w = word.trim();
  if (AN_SILENT_H.test(w)) return 'an';
  if (AN_EXCEPT.test(w)) return 'a';
  return /^[aeiou]/i.test(w) ? 'an' : 'a';
}

/** `word` with its article: "an Emberbud", "a Nubbin". */
export function aOrAn(word: string): string {
  return `${article(word)} ${word.trim()}`;
}

/** `n` with the right form: plural(1, 'race') "1 race", plural(0, 'race') "0 races". */
export function plural(n: number, one: string, other = `${one}s`): string {
  return `${n} ${n === 1 ? one : other}`;
}

/** 1st, 2nd, 3rd, 4th … 11th, 12th, 13th … 21st, 22nd. */
export function ordinal(n: number): string {
  const tens = n % 100;
  if (tens >= 11 && tens <= 13) return `${n}th`;
  const s = ['th', 'st', 'nd', 'rd'][n % 10] ?? 'th';
  return `${n}${n % 10 > 3 ? 'th' : s}`;
}
