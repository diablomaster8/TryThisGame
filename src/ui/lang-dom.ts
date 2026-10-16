/**
 * Hebrew and Japanese inside story text (CV3). A line stays left to right (`dir="ltr"`,
 * never `auto`, since many lines start with a Hebrew word); each Hebrew run is isolated
 * in a right-to-left `<bdi lang="he">` so the punctuation after it lands on the right
 * side; each Japanese word is a `lang="ja"` span that never breaks across lines, so kanji
 * get Japanese glyph shapes. A run holding a course word is tappable: it plays the word.
 */
import { hasScript, japaneseWords, scriptRuns } from '../sim/lang-text';
import { langWordsIn } from '../sim/lang';
import { el } from './dom';
import { loadLangFonts } from './lang-fonts';

/** Append `text` to `box`, isolating its Hebrew and Japanese runs. */
export function appendScriptText(
  box: HTMLElement,
  text: string,
  onWord?: (ids: string[]) => void,
): void {
  if (!hasScript(text)) {
    box.appendChild(document.createTextNode(text));
    return;
  }
  loadLangFonts();
  for (const run of scriptRuns(text)) {
    if (run.kind === 'latin') {
      box.appendChild(document.createTextNode(run.text));
      continue;
    }
    const ids = langWordsIn(run.text);
    const tappable = onWord !== undefined && ids.length > 0;
    let node: HTMLElement;
    if (run.kind === 'he') {
      node = el('bdi', 'lang-he');
      node.dir = 'rtl';
      node.lang = 'he';
      node.textContent = run.text;
    } else {
      node = el('span', 'lang-ja');
      node.lang = 'ja';
      for (const w of japaneseWords(run.text))
        node.appendChild(w.trim() ? el('span', 'ja-word', w) : document.createTextNode(w));
    }
    if (tappable) {
      node.classList.add('lang-word');
      node.setAttribute('role', 'button');
      node.tabIndex = 0;
      const fire = (e: Event) => {
        e.stopPropagation();
        onWord(ids);
      };
      node.addEventListener('click', fire);
      node.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') fire(e);
      });
    }
    box.appendChild(node);
  }
}

/** A line's text as shown everywhere outside the dialogue (journal goals and hints). */
export function scriptParagraph(
  className: string | undefined,
  text: string,
  onWord?: (ids: string[]) => void,
): HTMLParagraphElement {
  const p = el('p', className);
  p.dir = 'ltr';
  appendScriptText(p, text, onWord);
  return p;
}

/** Strip Hebrew and Japanese runs from text a synthetic voice will read: never voice them. */
export function withoutScript(text: string): string {
  if (!hasScript(text)) return text;
  return scriptRuns(text)
    .filter((r) => r.kind === 'latin')
    .map((r) => r.text)
    .join(' ');
}
