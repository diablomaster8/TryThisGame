/**
 * R0702: the English tracing game's content. A sitting is a few glyphs, picked by age
 * (capitals at 4, lowercase from 5, a number each time), then the child's own name, letter
 * by letter. The picks are pure and seeded; `TraceGame` does the drawing.
 */
import type { EduAge } from '../config/edu';
import type { Rng } from '../sim/rng';
import type { TraceTarget } from '../sim/lang';
import { LATIN_CAPITALS, LATIN_DIGITS, LATIN_LOWER, LATIN_STROKES } from './latin-strokes';

/** The `edu.items` id a traced glyph feeds: letters as the Letters game names them. */
export function tracedItem(glyph: string): string {
  return /\d/.test(glyph) ? `count:${glyph}` : `letter:${glyph.toUpperCase()}`;
}

/** The child's name as glyphs with guides: a capital first, the rest as typed, at most 8. */
export function nameGlyphs(name: string): string[] {
  const out = [...name.trim()].filter((c) => LATIN_STROKES[c]).slice(0, 8);
  if (out.length > 0) out[0] = out[0]!.toUpperCase();
  return out;
}

/** A sitting's glyphs: two letters and a number, then the name when one is set. */
export function tracingTarget(age: EduAge, name: string, rng: Rng): TraceTarget {
  const pool = age >= 5 ? [...LATIN_CAPITALS, ...LATIN_LOWER] : LATIN_CAPITALS;
  const glyphs: string[] = [];
  while (glyphs.length < 2) {
    const g = rng.pick(pool);
    if (!glyphs.includes(g)) glyphs.push(g);
  }
  // The numbers 0 to 10; ten is a one and a nought.
  glyphs.push(...rng.pick([...LATIN_DIGITS, '10']));
  glyphs.push(...nameGlyphs(name));
  return { lang: 'en', glyphs };
}
