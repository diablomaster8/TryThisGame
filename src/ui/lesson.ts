/**
 * The Learning Grove's pieces of the dialogue box (CV2): a finished line's text with the
 * reader glossary underlined and the sprout's bracketed grown-up prompts set apart, the
 * read-aloud voice, and the lesson controls (ask options, the do card). The dialogue owns
 * the order of things; these only build DOM and call back. Nothing here touches the world.
 */
import { EDU_STORY_TEXT } from '../config/strings';
import type { Lesson, LessonOption } from '../content/types';
import { isAudioUnlocked, isSoundEnabled } from '../platform/audio';
import { button, el } from './dom';
import { appendScriptText, withoutScript } from './lang-dom';

const PROMPT = /\([^)]*\)/g;

/**
 * Fill `box` with a finished line: bracketed prompts (sprout) in their own style, and each
 * glossary word (reader) underlined and tappable. `onWord` shows its meaning. Hebrew and
 * Japanese runs are isolated (ui/lang-dom.ts); `onLangWord` gets the course words tapped.
 */
export function renderLineText(
  box: HTMLElement,
  text: string,
  glossary: Map<string, string> | null,
  showPrompts: boolean,
  onWord: (word: string, meaning: string) => void,
  onLangWord?: (ids: string[]) => void,
): void {
  box.textContent = '';
  const plain = (t: string) => appendScriptText(box, t, onLangWord);
  const parts = showPrompts ? splitPrompts(text) : [{ text, prompt: false }];
  const words = glossary && glossary.size > 0 ? glossaryPattern(glossary) : null;
  for (const p of parts) {
    if (p.prompt) {
      box.appendChild(el('span', 'edu-aside', p.text));
      continue;
    }
    if (!words || !glossary) {
      plain(p.text);
      continue;
    }
    let last = 0;
    for (const m of p.text.matchAll(words)) {
      const at = m.index ?? 0;
      if (at > last) plain(p.text.slice(last, at));
      const meaning = glossary.get(m[0].toLowerCase()) ?? '';
      const w = el('button', 'edu-gloss', m[0]);
      w.type = 'button';
      w.addEventListener('click', (e) => {
        e.stopPropagation();
        onWord(m[0], meaning);
      });
      box.appendChild(w);
      last = at + m[0].length;
    }
    if (last < p.text.length) plain(p.text.slice(last));
  }
}

function splitPrompts(text: string): { text: string; prompt: boolean }[] {
  const out: { text: string; prompt: boolean }[] = [];
  let last = 0;
  for (const m of text.matchAll(PROMPT)) {
    const at = m.index ?? 0;
    if (at > last) out.push({ text: text.slice(last, at), prompt: false });
    out.push({ text: m[0], prompt: true });
    last = at + m[0].length;
  }
  if (last < text.length) out.push({ text: text.slice(last), prompt: false });
  return out;
}

const patterns = new WeakMap<Map<string, string>, RegExp>();
function glossaryPattern(glossary: Map<string, string>): RegExp {
  let re = patterns.get(glossary);
  if (!re) {
    // Longest first, so "water cycle" wins over "water".
    const words = [...glossary.keys()]
      .sort((a, b) => b.length - a.length)
      .map((w) => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
    re = new RegExp(`\\b(?:${words.join('|')})\\b`, 'gi');
    patterns.set(glossary, re);
  }
  return re;
}

/**
 * Speak a sprout line with the device's voice, once sound is on. The bracketed prompts are
 * for the grown-up, so they are left out, and so are Hebrew and Japanese words: those are
 * only ever heard from native-speaker clips (tap the word). Silently does nothing without
 * speech support.
 */
export function speakLine(text: string): void {
  try {
    const synth = window.speechSynthesis;
    if (!synth || !isAudioUnlocked() || !isSoundEnabled()) return;
    const said = withoutScript(text.replace(PROMPT, ' ')).replace(/\s+/g, ' ').trim();
    synth.cancel();
    if (!said) return;
    const u = new SpeechSynthesisUtterance(said);
    u.lang = 'en-GB';
    u.rate = 0.9;
    synth.speak(u);
  } catch {
    // No voice on this device: the grown-up reads it.
  }
}

export function stopSpeaking(): void {
  try {
    window.speechSynthesis?.cancel();
  } catch {
    // Nothing to stop.
  }
}

/**
 * An ask beat's options as big buttons. Every option continues; once one is picked the
 * best one gets its star, and `onPick` plays that option's reply.
 */
export function renderOptions(
  box: HTMLElement,
  lesson: Lesson,
  onPick: (option: LessonOption, best: boolean | null) => void,
): void {
  box.innerHTML = '';
  const options = lesson.options ?? [];
  const hasBest = options.some((o) => o.best);
  const buttons: HTMLButtonElement[] = [];
  for (const o of options) {
    const b = button(
      o.label,
      () => {
        if (box.dataset.picked) return;
        box.dataset.picked = '1';
        buttons.forEach((x, i) => {
          x.disabled = true;
          if (options[i]?.best) x.textContent = `${EDU_STORY_TEXT.bestStar} ${options[i]!.label}`;
        });
        b.classList.add('picked');
        // A beat to see the star, then the reply.
        window.setTimeout(
          () => {
            box.innerHTML = '';
            delete box.dataset.picked;
            onPick(o, hasBest ? o.best === true : null);
          },
          hasBest ? 700 : 0,
        );
      },
      'btn btn-choice edu-option',
    );
    buttons.push(b);
    box.appendChild(b);
  }
}

/**
 * A do beat's card. `edu:count:<thing>:<n>` counts taps up to n; every other check is one
 * big "We did it!" button. The real Grove actions behind the check strings come later.
 */
export function renderDo(box: HTMLElement, lesson: Lesson, onDone: () => void): void {
  box.innerHTML = '';
  const parts = (lesson.check ?? '').split(':');
  const target = parts[1] === 'count' ? Number(parts[3]) : NaN;
  if (Number.isInteger(target) && target > 0 && target <= 20) {
    let n = 0;
    const b = button(
      EDU_STORY_TEXT.countTap(0, target),
      () => {
        if (n >= target) return;
        n += 1;
        b.textContent = EDU_STORY_TEXT.countTap(n, target);
        if (n === target) {
          b.disabled = true;
          box.appendChild(done());
        }
      },
      'btn btn-choice edu-option edu-count',
    );
    box.appendChild(b);
  } else box.appendChild(done());

  function done(): HTMLButtonElement {
    return button(
      EDU_STORY_TEXT.weDidIt,
      () => {
        box.innerHTML = '';
        onDone();
      },
      'btn btn-primary edu-option',
    );
  }
}
