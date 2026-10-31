/**
 * The tracing game (CV3), opened from the journal for a step whose check is a tracing
 * check (`TRACE_TARGETS`). Kana and the taught Hebrew letters show numbered stroke guides
 * and are traced in stroke order over the glyph; Hebrew words come right to left, each
 * letter starting on its right side. A glyph with no guides is traced until enough of its
 * ink is covered. Finishing sends `langTraced`; the
 * sim meets the step. Stopping early changes nothing. Draws on a canvas; no sim writes.
 */
import { LANG_TEXT } from '../config/strings';
import { LANG } from '../config/tuning';
import type { Game } from '../game';
import type { TraceTarget } from '../sim/lang';
import { button, dialogFocus, el } from './dom';
import { HEBREW_STROKES } from './hebrew-strokes';
import { KANA_STROKES } from './kana-strokes';
import { loadLangFonts } from './lang-fonts';
import {
  afterMiss,
  inkCovered,
  resample,
  rightStart,
  strokeMet,
  traceRadius,
  type Pt,
} from './trace-check';
import { EDU_TRACE } from '../config/tuning-kids';
import { TRACE_KID_TEXT } from '../config/strings';
import { speakLine } from './lesson';

/** Stroke guides by glyph, kana and Hebrew alike. A glyph without guides is judged by ink. */
const STROKES: Readonly<Record<string, Pt[][]>> = { ...KANA_STROKES, ...HEBREW_STROKES };

const FONT = { he: '"Noto Sans Hebrew", sans-serif', ja: '"Klee One", "Noto Sans JP", sans-serif' };

export class TraceGame {
  private readonly root: HTMLDivElement;
  private readonly focus: ReturnType<typeof dialogFocus>;
  private readonly canvas: HTMLCanvasElement;
  private readonly word: HTMLDivElement;
  private readonly help: HTMLParagraphElement;
  private target: TraceTarget | null = null;
  private quest = '';
  private glyph = 0;
  private stroke = 0;
  private drags: Pt[][] = [];
  private drag: Pt[] | null = null;
  private ink: Pt[] = [];
  private done: (() => void) | null = null;
  /** R0703: misses on the current stroke, the last rejected drag, and the ghost finger. */
  private misses = 0;
  private rejected: { pts: Pt[]; at: number } | null = null;
  private demo: { at: number; stroke: number } | null = null;
  private raf = 0;

  constructor(
    parent: HTMLElement,
    private readonly game: () => Game | null,
  ) {
    this.root = el('div', 'modal trace');
    this.root.hidden = true;
    const card = el('div', 'modal-card trace-card');
    const head = el('div', 'modal-head');
    const heading = el('h2', undefined, LANG_TEXT.traceTitle);
    head.appendChild(heading);
    this.focus = dialogFocus(this.root, card, heading, () => this.close());
    head.appendChild(button(LANG_TEXT.traceClose, () => this.close(), 'btn btn-close'));
    this.word = el('div', 'trace-word');
    this.help = el('p', 'help');
    this.canvas = el('canvas', 'trace-board');
    this.canvas.width = 320;
    this.canvas.height = 320;
    card.append(head, this.word, this.canvas, this.help);
    this.root.appendChild(card);
    parent.appendChild(this.root);
    this.canvas.addEventListener('pointerdown', (e) => {
      this.canvas.setPointerCapture(e.pointerId);
      this.drag = [this.pt(e)];
    });
    this.canvas.addEventListener('pointermove', (e) => {
      if (!this.drag) return;
      this.drag.push(this.pt(e));
      this.draw();
    });
    const end = () => {
      if (!this.drag) return;
      const d = this.drag;
      this.drag = null;
      this.judge(d);
    };
    this.canvas.addEventListener('pointerup', end);
    this.canvas.addEventListener('pointercancel', end);
  }

  isOpen(): boolean {
    return !this.root.hidden;
  }

  open(quest: string, target: TraceTarget, onDone: () => void): void {
    this.quest = quest;
    this.target = target;
    this.done = onDone;
    this.fits.clear();
    this.glyph = 0;
    this.root.hidden = false;
    this.focus.opened();
    this.help.textContent = target.lang === 'he' ? LANG_TEXT.traceHelpHe : LANG_TEXT.traceHelpJa;
    this.renderWord();
    // The glyph needs its font before its ink can be measured.
    void loadLangFonts()
      .then(() => document.fonts?.load(`200px ${FONT[target.lang]}`, target.glyphs.join('')))
      .catch(() => undefined)
      .finally(() => {
        this.startGlyph();
        // R0703: the ghost finger shows the first stroke, and the start dot is named.
        if (STROKES[this.current()]) {
          this.playDemo();
          this.say(TRACE_KID_TEXT.start);
        }
      });
  }

  /** R0703: speak to a child who has read-aloud on. */
  private say(text: string): void {
    const e = this.game()?.world.edu;
    if (e && (e.readAloud || e.readToMe)) speakLine(text);
  }

  /** R0703: run the ghost finger along the current stroke. */
  private playDemo(): void {
    this.demo = { at: performance.now(), stroke: this.stroke };
    this.tick();
  }

  /** R0703: redraw while a miss fades or the ghost finger moves. */
  private tick(): void {
    window.cancelAnimationFrame(this.raf);
    const now = performance.now();
    const fading =
      this.rejected && now - this.rejected.at < EDU_TRACE.missShowMs + EDU_TRACE.fadeMs;
    const demoing = this.demo && now - this.demo.at < EDU_TRACE.demoMs;
    if (!fading) this.rejected = null;
    if (!demoing) this.demo = null;
    this.draw();
    if ((fading || demoing) && !this.root.hidden)
      this.raf = window.requestAnimationFrame(() => this.tick());
  }

  close(): void {
    if (!this.root.hidden) {
      this.root.hidden = true;
      this.focus.closed();
    }
    this.target = null;
    window.cancelAnimationFrame(this.raf);
    this.rejected = null;
    this.demo = null;
  }

  /** The whole word above the board, in writing order, the current glyph marked. */
  private renderWord(): void {
    const t = this.target;
    if (!t) return;
    this.word.textContent = '';
    this.word.dir = t.lang === 'he' ? 'rtl' : 'ltr';
    this.word.lang = t.lang;
    this.word.classList.toggle('lang-he', t.lang === 'he');
    this.word.classList.toggle('lang-ja', t.lang === 'ja');
    t.glyphs.forEach((g, i) =>
      this.word.appendChild(
        el('span', i < this.glyph ? 'done' : i === this.glyph ? 'now' : undefined, g),
      ),
    );
  }

  private startGlyph(): void {
    this.stroke = 0;
    this.misses = 0;
    this.drags = [];
    this.ink = STROKES[this.current()] ? [] : this.measureInk();
    this.renderWord();
    this.draw();
  }

  private current(): string {
    return this.target?.glyphs[this.glyph] ?? '';
  }

  /** The letter's ink as board points, from an offscreen render of the glyph. */
  private measureInk(): Pt[] {
    const size = 100;
    const c = document.createElement('canvas');
    c.width = size;
    c.height = size;
    const x = c.getContext('2d');
    if (!x) return [];
    this.glyphAt(x, size, '#000');
    const data = x.getImageData(0, 0, size, size).data;
    const out: Pt[] = [];
    for (let y = 0; y < size; y += 3)
      for (let i = 0; i < size; i += 3)
        if (data[(y * size + i) * 4 + 3]! > 128) out.push({ x: i, y });
    return out;
  }

  private glyphAt(x: CanvasRenderingContext2D, size: number, colour: string, fit = true): void {
    x.save();
    // A kana is stretched so its ink fills the box its stroke guides span: the guides are
    // the school shape, and a font's own metrics (or a fallback face) left them off the
    // glyph, worst on き (review 2026-10-21, bug 31).
    const f = fit ? this.fitFor(this.current()) : null;
    if (f) {
      x.scale(size / 100, size / 100);
      x.translate(f.dx, f.dy);
      x.scale(f.sx, f.sy);
      x.scale(100 / size, 100 / size);
    }
    x.fillStyle = colour;
    x.textAlign = 'center';
    x.textBaseline = 'middle';
    x.font = `${Math.round(size * 0.94)}px ${FONT[this.target?.lang ?? 'ja']}`;
    x.fillText(this.current(), size / 2, size * 0.48);
    x.restore();
  }

  /** Per glyph: the scale and offset that lay its ink over its stroke guides' box. */
  private readonly fits = new Map<string, { sx: number; sy: number; dx: number; dy: number }>();
  private fitFor(glyph: string): { sx: number; sy: number; dx: number; dy: number } | null {
    const strokes = STROKES[glyph];
    if (!strokes) return null;
    const known = this.fits.get(glyph);
    if (known) return known;
    const c = document.createElement('canvas');
    c.width = 100;
    c.height = 100;
    const x = c.getContext('2d');
    if (!x) return null;
    this.glyphAt(x, 100, '#000', false);
    const data = x.getImageData(0, 0, 100, 100).data;
    let ix0 = 100;
    let iy0 = 100;
    let ix1 = -1;
    let iy1 = -1;
    for (let y = 0; y < 100; y++)
      for (let i = 0; i < 100; i++)
        if (data[(y * 100 + i) * 4 + 3]! > 128) {
          ix0 = Math.min(ix0, i);
          ix1 = Math.max(ix1, i);
          iy0 = Math.min(iy0, y);
          iy1 = Math.max(iy1, y);
        }
    if (ix1 <= ix0 || iy1 <= iy0) return null;
    const pts = strokes.flat();
    // The guides run down the middle of the ink, which is a few units thick either side.
    const pad = 3;
    const gx0 = Math.min(...pts.map((p) => p.x)) - pad;
    const gx1 = Math.max(...pts.map((p) => p.x)) + pad;
    const gy0 = Math.min(...pts.map((p) => p.y)) - pad;
    const gy1 = Math.max(...pts.map((p) => p.y)) + pad;
    const sx = (gx1 - gx0) / (ix1 + 1 - ix0);
    const sy = (gy1 - gy0) / (iy1 + 1 - iy0);
    const fit = { sx, sy, dx: gx0 - ix0 * sx, dy: gy0 - iy0 * sy };
    this.fits.set(glyph, fit);
    return fit;
  }

  private pt(e: PointerEvent): Pt {
    const r = this.canvas.getBoundingClientRect();
    return { x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 };
  }

  private judge(d: Pt[]): void {
    const t = this.target;
    if (!t) return;
    const strokes = STROKES[this.current()];
    if (strokes) {
      const s = strokes[this.stroke];
      if (s && strokeMet(s, d, this.radius(), LANG.strokeCover)) {
        // R0703: a little buzz where the device has one.
        if (typeof navigator.vibrate === 'function') navigator.vibrate(EDU_TRACE.vibrateMs);
        return this.acceptStroke(d, strokes.length);
      }
      // R0703: the miss stays in grey a moment; then the ghost finger, then a helping hand.
      this.misses += 1;
      this.rejected = { pts: d, at: performance.now() };
      const next = afterMiss(this.misses, EDU_TRACE.demoAfterMisses, EDU_TRACE.completeAfterMisses);
      this.help.textContent = LANG_TEXT.traceAgain;
      if (next === 'complete' && s) {
        this.say(TRACE_KID_TEXT.helped);
        this.playDemo();
        return this.acceptStroke(resample(s, 3), strokes.length);
      }
      if (next === 'demo') {
        this.say(TRACE_KID_TEXT.watch);
        this.playDemo();
      }
      this.tick();
      return;
    } else {
      this.drags.push(d);
      if (inkCovered(this.ink, this.drags, this.radius() / 2) >= LANG.inkCover)
        return this.nextGlyph();
      this.help.textContent = LANG_TEXT.traceMore;
    }
    this.draw();
  }

  /** A stroke done (traced, or finished with the ghost finger): on to the next one. */
  private acceptStroke(d: Pt[], count: number): void {
    const t = this.target;
    if (!t) return;
    this.drags.push(d);
    this.stroke += 1;
    this.misses = 0;
    if (this.stroke >= count) return this.nextGlyph();
    this.help.textContent = t.lang === 'he' ? LANG_TEXT.traceHelpHe : LANG_TEXT.traceHelpJa;
    this.draw();
  }

  /** R0703: tolerance by age (wider for small hands); the main game keeps its own. */
  private radius(): number {
    return traceRadius(this.game()?.world.edu, EDU_TRACE.radius, LANG.traceRadius);
  }

  private nextGlyph(): void {
    const t = this.target;
    if (!t) return;
    this.glyph += 1;
    if (this.glyph < t.glyphs.length) {
      this.startGlyph();
      return;
    }
    this.help.textContent = LANG_TEXT.traceDone;
    this.say(TRACE_KID_TEXT.done);
    this.renderWord();
    this.game()?.send({ kind: 'langTraced', quest: this.quest });
    const done = this.done;
    window.setTimeout(() => {
      this.close();
      done?.();
    }, 900);
  }

  private draw(): void {
    const x = this.canvas.getContext('2d');
    const t = this.target;
    if (!x || !t) return;
    const W = this.canvas.width;
    const k = W / 100;
    x.clearRect(0, 0, W, W);
    x.save();
    x.scale(k, k);
    this.glyphAt(x, 100, 'rgba(120,110,100,0.28)');
    x.lineCap = 'round';
    x.lineJoin = 'round';
    const path = (pts: readonly Pt[]) => {
      x.beginPath();
      pts.forEach((p, i) => (i ? x.lineTo(p.x, p.y) : x.moveTo(p.x, p.y)));
      x.stroke();
    };
    const guides = STROKES[this.current()];
    if (guides) {
      guides.forEach((s, i) => {
        if (i < this.stroke) return;
        x.setLineDash(i === this.stroke ? [3, 3] : [1, 4]);
        x.strokeStyle = i === this.stroke ? '#d9822b' : 'rgba(217,130,43,0.35)';
        x.lineWidth = 2;
        path(s);
        x.setLineDash([]);
        const p = s[0]!;
        // R0703: the stroke to do now starts at a green dot ("Start at the green dot").
        x.fillStyle = i === this.stroke ? '#3fae4a' : 'rgba(217,130,43,0.5)';
        x.beginPath();
        x.arc(p.x, p.y, 4, 0, Math.PI * 2);
        x.fill();
        x.fillStyle = '#fff';
        x.font = 'bold 5px sans-serif';
        x.textAlign = 'center';
        x.textBaseline = 'middle';
        x.fillText(String(i + 1), p.x, p.y + 0.3);
      });
    } else {
      // Right to left: a dot on the letter's right side shows where to begin.
      const s = rightStart(this.ink);
      if (s && this.drags.length === 0) {
        x.fillStyle = '#d9822b';
        x.beginPath();
        x.arc(s.x, s.y, 4, 0, Math.PI * 2);
        x.fill();
      }
    }
    x.strokeStyle = '#3c7dd9';
    x.lineWidth = 6;
    for (const d of this.drags) path(d);
    if (this.drag) path(this.drag);
    // R0703: the last miss in grey, fading after a moment.
    const now = performance.now();
    if (this.rejected) {
      const age = now - this.rejected.at - EDU_TRACE.missShowMs;
      x.globalAlpha = age <= 0 ? 0.8 : Math.max(0, 0.8 * (1 - age / EDU_TRACE.fadeMs));
      x.strokeStyle = '#8a8a8a';
      path(this.rejected.pts);
      x.globalAlpha = 1;
    }
    // R0703: the ghost finger along the stroke (the whole stroke lit under reduced motion).
    const demoStroke = this.demo && guides?.[this.demo.stroke];
    if (this.demo && demoStroke) {
      const calm = document.documentElement.classList.contains('reduce-motion');
      const along = resample(demoStroke, 2);
      const f = Math.min(1, (now - this.demo.at) / EDU_TRACE.demoMs);
      x.strokeStyle = 'rgba(63,174,74,0.55)';
      x.lineWidth = 5;
      path(calm ? along : along.slice(0, Math.max(2, Math.ceil(f * along.length))));
      if (!calm) {
        const p = along[Math.min(along.length - 1, Math.floor(f * (along.length - 1)))]!;
        x.fillStyle = 'rgba(255,255,255,0.9)';
        x.beginPath();
        x.arc(p.x, p.y, 5, 0, Math.PI * 2);
        x.fill();
        x.font = '9px sans-serif';
        x.textAlign = 'center';
        x.textBaseline = 'middle';
        x.fillText('👆', p.x + 2, p.y + 6);
      }
    }
    x.restore();
  }
}
