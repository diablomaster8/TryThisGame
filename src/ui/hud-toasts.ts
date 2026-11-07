/**
 * Action-bar labels and the toast queue (TECH-24: split out of hud.ts).
 */
import { UI } from '../config/tuning';
import { TOASTS } from '../config/tuning-ui';
import { FIRST_MINUTE } from '../config/tuning-more/ui-first-loop';
import { setIconGlyph } from './pixel-icons';

/**
 * WCAG 2.5.3: a button's accessible name must contain the word it shows ("Explore", "My
 * Nubbins"), so a voice-control user can say what they see. The name is the button's title
 * when that already holds the word, else the word first and then the title.
 */
export function syncActionName(b: HTMLElement, label: string): void {
  const base = b.title;
  const holds = ` ${base.toLowerCase()} `.includes(` ${label.toLowerCase()} `);
  const name = !base ? label : holds ? base : `${label}. ${base}`;
  if (b.getAttribute('aria-label') !== name) b.setAttribute('aria-label', name);
}

/**
 * The action-bar buttons: an icon over a short word. The word shows on phones (style.css,
 * `.act-label`), where the bar sits at the bottom; wide screens keep the icon alone.
 */
export function labelActions(list: Array<[HTMLButtonElement, string, string]>): void {
  for (const [b, glyph, label] of list) {
    b.textContent = '';
    const g = document.createElement('span');
    g.className = 'act-glyph';
    g.setAttribute('aria-hidden', 'true');
    setIconGlyph(g, glyph); // R0502: pixel-art icon where there is one
    const l = document.createElement('span');
    l.className = 'act-label';
    l.setAttribute('aria-hidden', 'true');
    l.textContent = label;
    b.append(g, l);
    b.classList.add('act-btn');
    syncActionName(b, label);
  }
}

/**
 * Toasts without the pile-up (review 2026-10-24): the same text again within a short while
 * is dropped, at most a few show at once, and a burst comes in one at a time.
 */
export function makeToaster(host: HTMLElement): (text: string, ms?: number) => void {
  const lastShown = new Map<string, number>();
  const queue: Array<{ text: string; ms: number }> = [];
  let visible = 0;
  let nextAt = 0;
  let timer = 0;
  const pump = (): void => {
    timer = 0;
    while (queue.length > 0 && visible < FIRST_MINUTE.maxVisibleToasts) {
      const now = performance.now();
      if (now < nextAt) {
        timer = window.setTimeout(pump, nextAt - now);
        return;
      }
      const { text, ms } = queue.shift()!;
      const t = document.createElement('div');
      t.className = 'toast';
      t.textContent = text;
      host.appendChild(t);
      visible++;
      nextAt = now + TOASTS.staggerMs;
      window.setTimeout(() => {
        t.remove();
        visible--;
        if (!timer) pump();
      }, ms);
    }
  };
  return (text: string, ms: number = UI.toastMs): void => {
    const now = performance.now();
    const last = lastShown.get(text);
    if (last !== undefined && now - last < TOASTS.repeatMs) return;
    lastShown.set(text, now);
    queue.push({ text, ms });
    while (queue.length > TOASTS.maxQueued) queue.shift();
    if (!timer) pump();
  };
}
