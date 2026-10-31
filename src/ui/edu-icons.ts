/**
 * Lane E r10, R0715 (KIDS-47): the Learning Grove games show their pictures as pixel art
 * (`edu-icons-art.ts`), never as system emoji where a picture exists. Each picture is drawn
 * once onto a 12×12 master canvas, then copied (a plain 2D draw, no texture upload) for every
 * place it appears; CSS scales it up with nearest-neighbour. An emoji with no picture yet
 * still shows as text, so a new word never vanishes.
 */
import '../kids-r10.css';
import { color } from '../render/sprites/palette';
import { EDU_ICON_ART, EDU_ICON_FOR_EMOJI, EDU_ICON_INK } from './edu-icons-art';
import { el } from './dom';

const SIZE = 12;
const masters = new Map<string, HTMLCanvasElement | null>();

/** Pure: the picture name for an emoji (variation selectors ignored), or null. */
export function eduIconId(emoji: string): string | null {
  return EDU_ICON_FOR_EMOJI[emoji.replace(/️/g, '')] ?? null;
}

function master(id: string): HTMLCanvasElement | null {
  const hit = masters.get(id);
  if (hit !== undefined) return hit;
  let c: HTMLCanvasElement | null = null;
  const rows = EDU_ICON_ART[id];
  try {
    if (rows) {
      c = document.createElement('canvas');
      c.width = SIZE;
      c.height = SIZE;
      const ctx = c.getContext('2d');
      if (!ctx) c = null;
      else
        rows.forEach((row, y) => {
          for (let x = 0; x < row.length; x++) {
            const ink = EDU_ICON_INK[row[x]!];
            if (ink === undefined) continue;
            ctx.fillStyle = color(ink);
            ctx.fillRect(x, y, 1, 1);
          }
        });
    }
  } catch {
    c = null;
  }
  masters.set(id, c);
  return c;
}

/**
 * The picture for `emoji` as a canvas (class `edu-px` plus `cls`), or the emoji as text in a
 * span when there is no picture. Either way it is hidden from screen readers when `label` is
 * empty, and named by it otherwise.
 */
export function eduIcon(emoji: string, cls = '', label = ''): HTMLElement {
  const id = eduIconId(emoji);
  const m = id ? master(id) : null;
  let out: HTMLElement;
  if (m) {
    const c = el('canvas', `edu-px ${cls}`.trim());
    c.width = SIZE;
    c.height = SIZE;
    c.getContext('2d')?.drawImage(m, 0, 0);
    c.dataset.icon = id!;
    out = c;
  } else out = el('span', cls || undefined, emoji);
  if (label) {
    out.setAttribute('role', 'img');
    out.setAttribute('aria-label', label);
  } else out.setAttribute('aria-hidden', 'true');
  return out;
}

/** Every emoji in the pictures table, longest first, for splitting prompt text. */
const EMOJI_RE = new RegExp(
  `(${Object.keys(EDU_ICON_FOR_EMOJI)
    .sort((a, b) => b.length - a.length)
    .join('|')})\\uFE0F?`,
  'gu',
);

/** Text with its picture emoji drawn inline as pixel art (the rest stays text). */
export function appendWithIcons(parent: HTMLElement, text: string): void {
  let at = 0;
  for (const m of text.matchAll(EMOJI_RE)) {
    const i = m.index ?? 0;
    if (i > at) parent.appendChild(document.createTextNode(text.slice(at, i)));
    parent.appendChild(eduIcon(m[1]!, 'edu-px-inline', eduIconId(m[1]!) ?? ''));
    at = i + m[0].length;
  }
  if (at < text.length) parent.appendChild(document.createTextNode(text.slice(at)));
}

/** The picture inside a span, for the rows whose counting light picks out `> span`. */
export function eduIconSpan(emoji: string): HTMLElement {
  const s = el('span', 'edu-px-wrap');
  s.appendChild(eduIcon(emoji));
  return s;
}
