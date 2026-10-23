import { STORY_U4_TEXT } from '../config/strings';

/**
 * The boards' faces drawn from strings.ts (K29, campaign graphics 4): Logged In's message
 * board with a card for each open request, and the Beetle Road's guard house notices. The
 * lines are text in a canvas, never painted shapes, so a close shot (or the item card, 3x)
 * can read them. Both renderers use these canvases: pixel as a sprite sheet frame, 3D as a
 * texture. Drawn once per scene; nothing here runs in the frame loop.
 */
const WOOD = '#6a4a2e';
const DARK = '#3a2818';
const CORK = '#c9a46a';
const CREAM = '#f3ead2';
const INK = '#4a3a28';
const RED = '#c84a3a';

function canvas(w: number, h: number): [HTMLCanvasElement, CanvasRenderingContext2D] | null {
  if (typeof document === 'undefined') return null;
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  const ctx = c.getContext('2d');
  return ctx ? [c, ctx] : null;
}

/** Centred text, shrunk to fit `max` pixels wide. */
function fit(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  max: number,
  size: number,
  weight = 'bold',
): void {
  let s = size;
  ctx.font = `${weight} ${s}px monospace`;
  while (ctx.measureText(text).width > max && s > 5) {
    s -= 1;
    ctx.font = `${weight} ${s}px monospace`;
  }
  ctx.fillText(text, x, y);
}

/**
 * The message board's face, `w` x `h`: a header bar and a 3 x 2 grid of cork-pinned cards,
 * `n` of them filled (0 shows the empty line). Card text is three short lines.
 */
export function boardFace(w: number, h: number, n: number): HTMLCanvasElement | null {
  const made = canvas(w, h);
  if (!made) return null;
  const [c, ctx] = made;
  ctx.fillStyle = DARK;
  ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = WOOD;
  ctx.fillRect(2, 2, w - 4, h - 4);
  ctx.fillStyle = CORK;
  const pad = Math.round(w * 0.035);
  const head = Math.round(h * 0.15);
  ctx.fillRect(pad, head + pad, w - pad * 2, h - head - pad * 2);
  ctx.fillStyle = CREAM;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  fit(ctx, STORY_U4_TEXT.board.title, w / 2, head / 2 + 2, w * 0.8, Math.round(head * 0.62));
  const cols = 3;
  const rows = 2;
  const gx = pad * 1.6;
  const gy = head + pad * 1.6;
  const cw = (w - gx * 2) / cols;
  const ch = (h - gy - pad * 1.6) / rows;
  const cards = STORY_U4_TEXT.board.cards;
  for (let i = 0; i < Math.min(n, cols * rows); i++) {
    const x = gx + (i % cols) * cw + cw * 0.06;
    const y = gy + Math.floor(i / cols) * ch + ch * 0.06;
    const iw = cw * 0.88;
    const ih = ch * 0.88;
    ctx.save();
    ctx.translate(x + iw / 2, y + ih / 2);
    ctx.rotate((((i * 37) % 11) / 100 - 0.05) * 0.8);
    ctx.fillStyle = 'rgba(40,24,8,0.35)';
    ctx.fillRect(-iw / 2 + 1.5, -ih / 2 + 1.5, iw, ih);
    ctx.fillStyle = CREAM;
    ctx.fillRect(-iw / 2, -ih / 2, iw, ih);
    ctx.fillStyle = RED;
    ctx.beginPath();
    ctx.arc(0, -ih / 2 + ih * 0.1, Math.max(1.5, iw * 0.05), 0, Math.PI * 2);
    ctx.fill();
    const [kind, what, who] = cards[i % cards.length]!;
    ctx.fillStyle = RED;
    fit(ctx, kind, 0, -ih * 0.2, iw * 0.86, Math.round(ih * 0.17));
    ctx.fillStyle = INK;
    fit(ctx, what, 0, ih * 0.08, iw * 0.88, Math.round(ih * 0.15), 'normal');
    fit(ctx, who, 0, ih * 0.3, iw * 0.88, Math.round(ih * 0.14), 'normal');
    ctx.restore();
  }
  if (n <= 0) {
    ctx.fillStyle = INK;
    fit(ctx, STORY_U4_TEXT.board.empty, w / 2, h * 0.58, w * 0.8, Math.round(h * 0.09), 'normal');
  }
  return c;
}

/** The guard house notices: a pinned sheet with a title and a few ruled lines. */
export function noticeSheet(w: number, h: number): HTMLCanvasElement | null {
  const made = canvas(w, h);
  if (!made) return null;
  const [c, ctx] = made;
  const N = STORY_U4_TEXT.board.notices;
  ctx.fillStyle = DARK;
  ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = CREAM;
  ctx.fillRect(2, 2, w - 4, h - 4);
  ctx.fillStyle = RED;
  ctx.beginPath();
  ctx.arc(w / 2, h * 0.09, Math.max(2, w * 0.025), 0, Math.PI * 2);
  ctx.fill();
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = RED;
  fit(ctx, N.title, w / 2, h * 0.2, w * 0.8, Math.round(h * 0.13));
  ctx.fillStyle = INK;
  N.lines.forEach((line, i) => {
    const y = h * (0.4 + i * 0.2);
    fit(ctx, line, w / 2, y, w * 0.86, Math.round(h * 0.1), 'normal');
    ctx.fillStyle = 'rgba(74,58,40,0.25)';
    ctx.fillRect(w * 0.08, y + h * 0.07, w * 0.84, 1);
    ctx.fillStyle = INK;
  });
  return c;
}

/** The item card's picture of the board (the 3x path in pixel, a clean canvas in 3D). */
export function boardItem(kind: string): HTMLCanvasElement | null {
  if (kind !== 'board') return null;
  const c = boardFace(176, 128, 6);
  if (c) c.dataset.px = '176';
  return c;
}
