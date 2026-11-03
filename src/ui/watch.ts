/**
 * R0550 (SOUL-32), lane A round 11: edge chips and the Watch camera. A Nubbin that has
 * drifted off screen gets a small portrait chip at the screen edge pointing its way (at most
 * four, the nearest first, each a 44 px tap target); tapping one glides the camera there.
 * Holding a portrait in the roster starts Watch: the camera follows that Nubbin and a caption
 * chip names what it is doing, re-read every 400 ms; tapping the caption stops it. Reads the
 * sim only; the camera moves through `Game.panTo` and `Game.watch`.
 */
import { ACTIVITY_CAPTIONS, WATCH_TEXT } from '../config/strings-soul-r11b';
import { WATCH } from '../config/tuning-soul-r11b';
import type { Game } from '../game';
import { nubbinHere } from '../sim/nubbin-home';
import type { Nubbin } from '../sim/types';
import { nubbinPortrait } from './battle-party-pick';
import { el } from './dom';
import './watch.css';

/** "Pip is chasing a butterfly": by `state:itemId`, then `state`, then a plain wander. */
export function activityCaption(n: Pick<Nubbin, 'name' | 'behavior'>): string {
  const b = n.behavior;
  const text =
    (b.itemId ? ACTIVITY_CAPTIONS[`${b.state}:${b.itemId}`] : undefined) ??
    ACTIVITY_CAPTIONS[b.state] ??
    ACTIVITY_CAPTIONS.wander!;
  return text.replace('{n}', n.name);
}

export interface EdgePoint {
  x: number;
  y: number;
  /** Rotation of the arrow in degrees (0 = up). */
  angle: number;
}

/** Whether a screen point (px) is outside the view by more than the margin. */
export function isOffScreen(x: number, y: number, w: number, h: number, margin: number): boolean {
  return x < -margin || x > w + margin || y < -margin || y > h + margin;
}

/** Where on the screen edge a chip for an off-screen point sits, inset by `inset` px. */
export function edgePoint(x: number, y: number, w: number, h: number, inset: number): EdgePoint {
  const cx = w / 2;
  const cy = h / 2;
  const dx = x - cx;
  const dy = y - cy;
  const hx = Math.max(1, cx - inset);
  const hy = Math.max(1, cy - inset);
  const k = Math.max(Math.abs(dx) / hx, Math.abs(dy) / hy, 1e-6);
  return {
    x: cx + dx / k,
    y: cy + dy / k,
    angle: (Math.atan2(dx, -dy) * 180) / Math.PI,
  };
}

/** Run `fn` when `target` is held for `ms` (and swallow the click that follows). */
export function onLongPress(target: HTMLElement, ms: number, fn: () => void): void {
  let timer: ReturnType<typeof setTimeout> | null = null;
  let fired = false;
  const clear = (): void => {
    if (timer) clearTimeout(timer);
    timer = null;
  };
  target.addEventListener('pointerdown', () => {
    fired = false;
    clear();
    timer = setTimeout(() => {
      fired = true;
      fn();
    }, ms);
  });
  for (const t of ['pointerup', 'pointercancel', 'pointerleave']) target.addEventListener(t, clear);
  target.addEventListener(
    'click',
    (e) => {
      if (fired) {
        e.stopImmediatePropagation();
        e.preventDefault();
        fired = false;
      }
    },
    true,
  );
}

export function mountWatch(parent: HTMLElement, game: () => Game | null): void {
  const layer = el('div', 'watch-layer');
  const caption = el('button', 'watch-caption') as HTMLButtonElement;
  caption.type = 'button';
  caption.hidden = true;
  caption.addEventListener('click', () => {
    game()?.watch(null);
    caption.hidden = true;
  });
  layer.appendChild(caption);
  parent.appendChild(layer);
  const chips = new Map<string, HTMLButtonElement>();
  const glyphs = new Map<string, HTMLElement>();
  let lastCaption = 0;

  const chipFor = (g: Game, n: Nubbin): HTMLButtonElement => {
    let c = chips.get(n.id);
    if (c) return c;
    c = el('button', 'watch-chip') as HTMLButtonElement;
    c.type = 'button';
    c.setAttribute('aria-label', WATCH_TEXT.chipLabel(n.name));
    c.append(el('span', 'watch-arrow'), nubbinPortrait(g, n));
    const glyph = el('span', 'watch-glyph');
    c.appendChild(glyph);
    glyphs.set(n.id, glyph);
    c.addEventListener('click', () => game()?.panTo(n.id));
    layer.appendChild(c);
    chips.set(n.id, c);
    return c;
  };

  const tick = (): void => {
    const g = game();
    const now = performance.now();
    if (!g || document.hidden) return;
    const w = window.innerWidth;
    const h = window.innerHeight;
    const watching = g.watching;
    const wanted = new Map<string, { n: Nubbin; at: EdgePoint; d: number }>();
    if (!watching && g.world.location === 'grove') {
      for (const n of g.world.nubbins) {
        if (n.stage === 'egg' || !nubbinHere(g.world, n)) continue;
        const p = g.ndcOf(n.pos.x, 0.5, n.pos.z);
        if (!p || p.behind) continue;
        const px = ((p.x + 1) / 2) * w;
        const py = ((1 - p.y) / 2) * h;
        if (!isOffScreen(px, py, w, h, WATCH.margin)) continue;
        wanted.set(n.id, {
          n,
          at: edgePoint(px, py, w, h, WATCH.chipPx / 2 + WATCH.edgePad),
          d: Math.hypot(p.x, p.y),
        });
      }
    }
    const shown = [...wanted.values()].sort((a, b) => a.d - b.d).slice(0, WATCH.maxChips);
    const keep = new Set(shown.map((s) => s.n.id));
    for (const [id, c] of chips) c.hidden = !keep.has(id);
    for (const s of shown) {
      const c = chipFor(g, s.n);
      c.hidden = false;
      c.style.left = `${Math.round(s.at.x)}px`;
      c.style.top = `${Math.round(s.at.y)}px`;
      const arrow = c.firstElementChild as HTMLElement;
      // The arrow rides the chip's rim, on the side the Nubbin is.
      const r = (s.at.angle * Math.PI) / 180;
      arrow.style.transform = `translate(-50%, -50%) translate(${Math.sin(r) * 26}px, ${
        -Math.cos(r) * 26
      }px) rotate(${s.at.angle}deg)`;
      const glyph = glyphs.get(s.n.id);
      if (glyph) glyph.textContent = WATCH_TEXT.glyph[s.n.behavior.state] ?? '';
    }
    if (watching) {
      if (now - lastCaption >= WATCH.captionEveryMs || caption.hidden) {
        lastCaption = now;
        const n = g.world.nubbins.find((x) => x.id === watching);
        if (n) {
          caption.textContent = activityCaption(n);
          caption.title = WATCH_TEXT.stop;
          caption.setAttribute('aria-label', `${caption.textContent}. ${WATCH_TEXT.stop}`);
          caption.hidden = false;
        }
      }
    } else caption.hidden = true;
  };
  setInterval(tick, 150);
}
