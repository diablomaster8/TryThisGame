/**
 * Lane E r9 (R0734 KIDS-66, R0736 KIDS-68): a story line cut into the pieces the dialogue
 * box draws. A Hebrew or Japanese run followed by a bracketed gloss ("שָׁלוֹם (shalom,
 * “hello”)") becomes one stacked word: the native script on top, the romanisation beneath,
 * the meaning kept for a tap bubble, so the sentence reads on unbroken. Any other bracket
 * is a co-play prompt for the grown-up, drawn as its own chip under the line. Pure string
 * work, no DOM, so it is tested in node.
 */
import { scriptRuns } from '../sim/lang-text';

export type LinePart =
  | { kind: 'text'; text: string }
  | { kind: 'gloss'; native: string; roman: string; meaning: string }
  | { kind: 'prompt'; text: string };

/** "(shalom, “hello”)" → roman "shalom", meaning "hello"; "(ma shlomkha?)" → roman only. */
export function parseGloss(inner: string): { roman: string; meaning: string } {
  const comma = inner.indexOf(',');
  const roman = (comma < 0 ? inner : inner.slice(0, comma)).trim();
  const meaning =
    comma < 0
      ? ''
      : inner
          .slice(comma + 1)
          .trim()
          .replace(/^[“"'‘]+|[”"'’]+$/g, '')
          .trim();
  return { roman, meaning };
}

const GLOSS_AFTER = /^([?!.,…]?)\s*\(([^)]*)\)/;
const PROMPT = /\([^)]*\)/g;

/** Plain text, with its brackets set apart as prompts when `prompts` is on. */
function textParts(text: string, prompts: boolean, out: LinePart[]): void {
  if (!text) return;
  if (!prompts) {
    pushText(out, text);
    return;
  }
  let last = 0;
  for (const m of text.matchAll(PROMPT)) {
    const at = m.index ?? 0;
    if (at > last) pushText(out, text.slice(last, at));
    out.push({ kind: 'prompt', text: m[0].slice(1, -1).trim() });
    last = at + m[0].length;
  }
  if (last < text.length) pushText(out, text.slice(last));
}

function pushText(out: LinePart[], text: string): void {
  const prev = out[out.length - 1];
  if (prev?.kind === 'text') prev.text += text;
  else out.push({ kind: 'text', text });
}

/**
 * The line's parts in order. Glosses are found in every band; prompts only when `prompts`
 * is on (the sprout band), as before. Text parts may still hold script runs: the DOM side
 * isolates those as it always has.
 */
export function lineParts(text: string, prompts: boolean): LinePart[] {
  const out: LinePart[] = [];
  const runs = scriptRuns(text);
  let carry = '';
  for (let i = 0; i < runs.length; i++) {
    const run = runs[i]!;
    if (run.kind === 'latin') {
      carry += run.text;
      continue;
    }
    const after = runs[i + 1];
    const m = after?.kind === 'latin' ? GLOSS_AFTER.exec(after.text) : null;
    if (!m || !after) {
      carry += run.text;
      continue;
    }
    textParts(carry, prompts, out);
    carry = '';
    const { roman, meaning } = parseGloss(m[2] ?? '');
    out.push({ kind: 'gloss', native: run.text + (m[1] ?? ''), roman, meaning });
    // The rest of the following run goes on as ordinary text.
    runs[i + 1] = { kind: 'latin', text: after.text.slice(m[0].length) };
  }
  textParts(carry, prompts, out);
  return out;
}
