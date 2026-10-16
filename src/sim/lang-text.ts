/**
 * Script runs in a story line (CV3): which stretches are Hebrew, which are Japanese, and
 * which are everything else, so the dialogue can isolate Hebrew right to left inside a
 * left-to-right line, keep Japanese words whole, and find the course words a line uses.
 * Pure string work: no DOM.
 */

export type ScriptKind = 'latin' | 'he' | 'ja';

export interface ScriptRun {
  kind: ScriptKind;
  text: string;
}

/** Hebrew letters, niqqud and cantillation, geresh/gershayim, maqaf, presentation forms. */
const HE = '\\u0591-\\u05F4\\uFB1D-\\uFB4F';
/** Hiragana, katakana, the long-vowel mark, CJK ideographs, 々, Japanese punctuation. */
const JA = '\\u3005\\u3040-\\u30FF\\u4E00-\\u9FFF\\uFF66-\\uFF9F\\u3001\\u3002\\u300C-\\u300F';

/**
 * A Hebrew run: Hebrew words joined by spaces or commas, and the "?", "!" or "…" right
 * after the last word (it belongs to the Hebrew, so it sits at the run's left end).
 */
const HE_RUN = new RegExp(`[${HE}]+(?:[ ,]+[${HE}]+)*[?!…]*`, 'gu');
/** A Japanese run: Japanese words joined by single learner spaces, and a trailing "!" or "?". */
const JA_RUN = new RegExp(`[${JA}]+(?: [${JA}]+)*[!?！？…]*`, 'gu');
const ANY_SCRIPT = new RegExp(`[${HE}${JA}]`, 'u');

/** Whether a line has any Hebrew or Japanese in it. */
export function hasScript(text: string): boolean {
  return ANY_SCRIPT.test(text);
}

/** Split a line into runs, in order. Joining every run's text gives the line back. */
export function scriptRuns(text: string): ScriptRun[] {
  const found: { at: number; end: number; kind: ScriptKind }[] = [];
  for (const [re, kind] of [
    [HE_RUN, 'he'],
    [JA_RUN, 'ja'],
  ] as const) {
    for (const m of text.matchAll(re)) {
      const at = m.index ?? 0;
      found.push({ at, end: at + m[0].length, kind });
    }
  }
  found.sort((a, b) => a.at - b.at);
  const out: ScriptRun[] = [];
  let last = 0;
  for (const f of found) {
    if (f.at < last) continue;
    if (f.at > last) out.push({ kind: 'latin', text: text.slice(last, f.at) });
    out.push({ kind: f.kind, text: text.slice(f.at, f.end) });
    last = f.end;
  }
  if (last < text.length) out.push({ kind: 'latin', text: text.slice(last) });
  return out;
}

/** The words of a Japanese run, split at the learner spaces, each kept whole on a line. */
export function japaneseWords(run: string): string[] {
  return run.split(/( +)/).filter((w) => w.length > 0);
}

/** Punctuation that is not part of a word for matching. */
const PUNCT = /[?!…,.、。「」『』！？]/gu;

/** A word or phrase reduced for matching: no punctuation, single spaces. */
export function bare(text: string): string {
  return text.replace(PUNCT, ' ').replace(/\s+/g, ' ').trim();
}

/**
 * The course words a line uses: each `native` form that appears in a Hebrew or Japanese
 * run as whole words (so き never matches inside あき). `natives` maps bare native forms
 * to word ids; a phrase of up to four words is matched as a phrase.
 */
export function wordsInLine(text: string, natives: ReadonlyMap<string, string>): string[] {
  const ids = new Set<string>();
  for (const run of scriptRuns(text)) {
    if (run.kind === 'latin') continue;
    const tokens = bare(run.text).split(' ').filter(Boolean);
    for (let i = 0; i < tokens.length; i++) {
      for (let k = 1; k <= 4 && i + k <= tokens.length; k++) {
        const id = natives.get(tokens.slice(i, i + k).join(' '));
        if (id) ids.add(id);
      }
    }
  }
  return [...ids];
}
