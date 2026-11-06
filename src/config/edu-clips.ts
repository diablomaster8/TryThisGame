/**
 * R0699 (KIDS-31): the fixed child-facing lines of the Learning Grove that a voice actor
 * records once (`public/audio/edu/ui/<id>.mp3`): the picker question, praise, retry and break
 * lines, the numbers 0 to 20, colours, shapes and letters, and the fragments that game prompts
 * are built from ("Tap the" + "red" + "one."). `clipsForText` turns a line the game is about
 * to speak into the clip ids that would say it; the player (`platform/edu-audio.ts`) uses a
 * recording only when every id in the list is recorded, and speech synthesis stays the
 * fallback. The list of what to record is generated from here (`docs/edu-clips-to-record.md`,
 * by `tests/tools/edu-clip-list.ts`). No recordings are made or faked in code.
 */
import { EDU_COLOURS, EDU_SHAPES } from './edu';
import { EDU_PICKER_TEXT, EDU_SAY_TEXT, EDU_WRONG_TEXT } from './strings-kids';
import { EDU_TEXT } from './strings';
import { EDU_OFFLINE_TEXT } from './strings-listen';

/** Every clip id, with the exact words a recording says. */
export const EDU_UI_TEXT: Readonly<Record<string, string>> = (() => {
  const t: Record<string, string> = {
    'picker-say': EDU_PICKER_TEXT.say,
    'break-say': EDU_TEXT.breakSay,
    'try-again': EDU_TEXT.tryAgain,
    almost: EDU_TEXT.almost,
    'show-answer': EDU_TEXT.showAnswer,
    'wrong-first': EDU_WRONG_TEXT.first,
    'stars-saved': EDU_WRONG_TEXT.saved,
    'postcard-say': EDU_OFFLINE_TEXT.postcardSay,
    // Fragments of the templated prompts.
    'part-tap-the': 'Tap the',
    'part-one': 'one.',
    'part-which-one-is-not': 'Which one is not',
    'part-find-a': 'Find a',
    'part-in-the-grove': 'in the Grove!',
    'part-tap-the-letter': 'Tap the letter',
    'part-which-has-more': 'Which has more?',
    'part-which-has-fewer': 'Which has fewer?',
  };
  EDU_TEXT.wellDone.forEach((s, i) => (t[`well-done-${i + 1}`] = s));
  EDU_SAY_TEXT.numbers.forEach((w, n) => (t[`num-${n}`] = w));
  for (const c of new Set(Object.values(EDU_COLOURS).flat())) t[`colour-${c}`] = c;
  for (const s of new Set(Object.values(EDU_SHAPES).flat())) t[`shape-${s}`] = s;
  for (const l of 'ABCDEFGHIJKLMNOPQRSTUVWXYZ') t[`letter-${l}`] = l;
  return t;
})();

/** All the clip ids, in a stable order. */
export const EDU_CLIP_IDS: readonly string[] = Object.keys(EDU_UI_TEXT);

/** Where a recording of this id lives under `public/`. */
export const uiClipFile = (id: string): string => `audio/edu/ui/${id}.mp3`;

const norm = (s: string): string => s.replace(/\s+/g, ' ').trim();

const colour = (c: string): string | null => (`colour-${c}` in EDU_UI_TEXT ? `colour-${c}` : null);
const shape = (s: string): string | null => (`shape-${s}` in EDU_UI_TEXT ? `shape-${s}` : null);
const letter = (l: string): string | null => (`letter-${l}` in EDU_UI_TEXT ? `letter-${l}` : null);

/** Prompt templates: a regex with one slot, and the clips that say it. */
const TEMPLATES: ReadonlyArray<{ re: RegExp; ids: (slot: string) => (string | null)[] }> = [
  { re: /^Tap the (\w+) one\.$/, ids: (s) => ['part-tap-the', colour(s), 'part-one'] },
  { re: /^Which one is not (\w+)\?$/, ids: (s) => ['part-which-one-is-not', colour(s)] },
  {
    re: /^Find a (\w+) in the Grove!$/,
    ids: (s) => ['part-find-a', shape(s), 'part-in-the-grove'],
  },
  { re: /^Tap the letter (\w)\.$/, ids: (s) => ['part-tap-the-letter', letter(s)] },
  { re: /^Tap the (\w+)\.$/, ids: (s) => ['part-tap-the', shape(s)] },
];

const FIXED = new Map<string, string>();
for (const [id, text] of Object.entries(EDU_UI_TEXT))
  if (!id.startsWith('part-') || id.startsWith('part-which-has')) FIXED.set(norm(text), id);
// A bare "A" is a letter, not the word "a"; the games say "the letter A" for it.
for (const l of 'ABCDEFGHIJKLMNOPQRSTUVWXYZ') {
  FIXED.delete(l);
  FIXED.set(EDU_SAY_TEXT.letter(l), `letter-${l}`);
}
// Colours and shapes said alone are matched in lower case.
const ALONE = new Map<string, string>();
for (const id of Object.keys(EDU_UI_TEXT))
  if (/^(colour|shape|num)-/.test(id)) ALONE.set(EDU_UI_TEXT[id]!.toLowerCase(), id);

/** The clip ids that say `text`, or null when it is not one of the fixed lines. */
export function clipsForText(text: string): string[] | null {
  const t = norm(text);
  const fixed = FIXED.get(t) ?? ALONE.get(t.toLowerCase());
  if (fixed && fixed in EDU_UI_TEXT) return [fixed];
  for (const { re, ids } of TEMPLATES) {
    const m = re.exec(t);
    if (!m) continue;
    const out = ids(m[1]!);
    if (out.every((x): x is string => x !== null)) return out;
  }
  return null;
}

/** The ids to play for `text` only when every one is recorded; else null (speak it instead). */
export function planUiClips(text: string, recorded: ReadonlySet<string>): string[] | null {
  const ids = clipsForText(text);
  return ids && ids.every((id) => recorded.has(id)) ? ids : null;
}
