/**
 * R0718 (KIDS-33): the grown-up report's words by Leitner box. One fold per box, each with
 * the words in it, and the words met but not yet reviewed. UI only; reads `world.edu.words`.
 */
import { BOXES_TEXT } from '../config/strings-boxes';
import { LANG } from '../config/tuning';
import type { VocabItem } from '../content/types';
import type { World } from '../sim/types';
import { el } from './dom';

/** The met words grouped by box (0 is met but never reviewed). */
export function wordsByBox(world: World, vocab: readonly VocabItem[]): Map<number, VocabItem[]> {
  const out = new Map<number, VocabItem[]>();
  const words = world.edu?.words ?? {};
  for (const w of vocab) {
    const s = words[w.id];
    if (!s) continue;
    const box = Math.max(0, Math.min(LANG.srs.maxBox, s.box ?? 0));
    out.set(box, [...(out.get(box) ?? []), w]);
  }
  return out;
}

export function boxesView(body: HTMLElement, world: World, vocab: readonly VocabItem[]): void {
  body.appendChild(el('h4', undefined, BOXES_TEXT.heading));
  body.appendChild(el('p', 'help', BOXES_TEXT.help));
  const by = wordsByBox(world, vocab);
  if (by.size === 0) {
    body.appendChild(el('p', 'help', BOXES_TEXT.none));
    return;
  }
  for (let box = 1; box <= LANG.srs.maxBox; box++) {
    const list = by.get(box);
    if (list) body.appendChild(fold(BOXES_TEXT.box(box, list.length), list));
  }
  const unseen = by.get(0);
  if (unseen) body.appendChild(fold(BOXES_TEXT.unseen(unseen.length), unseen));
}

function fold(title: string, words: readonly VocabItem[]): HTMLElement {
  const d = el('details', 'lang-topic');
  d.appendChild(el('summary', undefined, title));
  const list = el('div', 'lang-box-words');
  for (const w of words) {
    const s = el('span', 'lang-box-word', w.native);
    s.lang = w.lang;
    s.title = w.english;
    list.append(s, document.createTextNode(' '));
  }
  d.appendChild(list);
  return d;
}
