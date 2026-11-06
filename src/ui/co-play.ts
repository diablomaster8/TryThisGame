/**
 * R0697 (KIDS-29): the sprout story's bracketed prompts, for a child playing alone. In
 * `alone` mode each bracket becomes a spoken child line (the line's own `childSay` for it, else
 * the bracket as written without its parentheses) and a "your turn" badge; in `together` it
 * stays a silent tip chip for a grown-up. Pure string work, tested in node.
 */
import type { EduState } from '../sim/types';
import { lineParts } from './line-parts';

export type CoPlayMode = 'together' | 'alone';

/** The grown-up's choice, else alone for ages 3 and 4 and together above. */
export function coPlayMode(edu: Pick<EduState, 'coPlay' | 'age'> | undefined | null): CoPlayMode {
  if (!edu) return 'together';
  if (edu.coPlay) return edu.coPlay;
  return edu.age <= 4 ? 'alone' : 'together';
}

/** The child prompts of a line, in order: `childSay[i]` or the bracket's own words. */
export function childPrompts(text: string, childSay?: readonly string[]): string[] {
  const out: string[] = [];
  let i = 0;
  for (const p of lineParts(text, true)) {
    if (p.kind !== 'prompt') continue;
    const say = childSay?.[i]?.trim();
    out.push(say ? say : p.text);
    i += 1;
  }
  return out;
}

/**
 * The line as it is spoken. Together: unchanged (the speaker drops the brackets). Alone: each
 * prompt's bracket is replaced by its child text, with a full stop if it has none.
 */
export function spokenLine(text: string, mode: CoPlayMode, childSay?: readonly string[]): string {
  if (mode === 'together') return text;
  const said = childPrompts(text, childSay);
  let i = 0;
  const parts = lineParts(text, true).map((p) => {
    if (p.kind === 'text') return p.text;
    if (p.kind === 'gloss') return `${p.native} (${p.roman}${p.meaning ? `, “${p.meaning}”` : ''})`;
    const t = said[i++] ?? p.text;
    return ` ${/[.!?…]$/.test(t) ? t : `${t}.`} `;
  });
  return parts.join('').replace(/\s+/g, ' ').trim();
}

/** Words that talk to the grown-up or about the child, which sound wrong said to a child alone. */
const READS_BADLY_ALONE =
  /\b(your child|the child|a grown-?up|the grown-?up|parents?|your teacher|ask them)\b/i;

/**
 * R0697: why a line's bracketed prompt reads badly when spoken to a child alone, or null. A
 * prompt with its own `childSay` is fine; one without is flagged if it addresses the grown-up,
 * or runs past the sprout cap of 14 words.
 */
export function aloneWarning(text: string, childSay?: readonly string[]): string | null {
  let i = 0;
  for (const p of lineParts(text, true)) {
    if (p.kind !== 'prompt') continue;
    const own = childSay?.[i]?.trim();
    i += 1;
    if (own) continue;
    if (READS_BADLY_ALONE.test(p.text)) return `addresses the grown-up: "${p.text}"`;
    if (p.text.split(/\s+/).length > 14) return `too long to say alone: "${p.text}"`;
  }
  return null;
}
