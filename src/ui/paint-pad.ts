/**
 * R0743: the free-play paint pad. Eight colours from the shared palette, three brush sizes,
 * stamps of the child's Nubbins, and a save to the collection book as a "drawing" (a small
 * PNG data URL in the save, capped by `PAINT.maxDrawings`). `open(onSaved)` also serves a
 * `draw` do-beat. Draws on a canvas; the only sim write is the `saveDrawing` command.
 */
import { PAINT_TEXT } from '../config/strings-paint';
import { PAINT } from '../config/tuning-more/kids-noticing';
import type { Game } from '../game';
import { PALETTE } from '../render/sprites/palette';
import { nubbinPortrait } from './battle-party-pick';
import { button, el, modal } from './dom';

const PAPER = PALETTE[31];

interface Pt {
  x: number;
  y: number;
}

export class PaintPad {
  private readonly dialog;
  private readonly canvas: HTMLCanvasElement;
  private readonly status: HTMLParagraphElement;
  private readonly stampRow = el('div', 'paint-stamps');
  private colour = 0;
  private brush = 1;
  private stamp: HTMLCanvasElement | null = null;
  private last: Pt | null = null;
  private onSaved: (() => void) | null = null;

  constructor(
    parent: HTMLElement,
    private readonly game: () => Game | null,
  ) {
    this.dialog = modal(parent, PAINT_TEXT.title, PAINT_TEXT.close);
    const body = this.dialog.body;
    body.appendChild(el('p', 'help', PAINT_TEXT.help));
    this.canvas = el('canvas', 'paint-canvas');
    this.canvas.width = PAINT.size;
    this.canvas.height = PAINT.size;
    this.canvas.style.cssText =
      'width:min(100%,320px);aspect-ratio:1;image-rendering:pixelated;touch-action:none;border:2px solid currentColor;border-radius:8px;display:block;margin:8px auto';
    this.status = el('p', 'help');
    this.status.setAttribute('role', 'status');
    this.canvas.addEventListener('pointerdown', (e) => {
      this.canvas.setPointerCapture(e.pointerId);
      const p = this.pt(e);
      if (this.stamp) {
        this.putStamp(p);
        return;
      }
      this.last = p;
      this.dot(p);
    });
    this.canvas.addEventListener('pointermove', (e) => {
      if (!this.last) return;
      const p = this.pt(e);
      this.line(this.last, p);
      this.last = p;
    });
    const end = () => {
      this.last = null;
    };
    this.canvas.addEventListener('pointerup', end);
    this.canvas.addEventListener('pointercancel', end);
    body.append(this.canvas, this.controls(), this.status);
  }

  open(onSaved?: () => void): void {
    this.onSaved = onSaved ?? null;
    this.status.textContent = '';
    this.clear();
    this.refreshStamps();
    this.dialog.show();
  }

  isOpen(): boolean {
    return this.dialog.isOpen();
  }

  private controls(): HTMLElement {
    const box = el('div', 'paint-controls');
    const colours = el('div', 'paint-colours');
    PAINT.palette.forEach((idx, i) => {
      const b = button('', () => this.pick(i), 'btn paint-swatch');
      b.style.cssText = `background:${PALETTE[idx]};min-width:44px;min-height:44px;border:3px solid currentColor`;
      b.setAttribute('aria-label', PAINT_TEXT.colour(i + 1));
      colours.appendChild(b);
    });
    const brushes = el('div', 'paint-brushes');
    PAINT.brushes.forEach((w, i) => {
      const b = button(
        '●',
        () => {
          this.brush = i;
          this.stamp = null;
        },
        'btn',
      );
      b.style.fontSize = `${14 + w * 3}px`;
      b.style.minWidth = '44px';
      b.style.minHeight = '44px';
      b.setAttribute('aria-label', PAINT_TEXT.brush[i] ?? '');
      brushes.appendChild(b);
    });
    const actions = el('div', 'paint-actions');
    actions.append(
      button(PAINT_TEXT.clear, () => this.clear(), 'btn'),
      button(PAINT_TEXT.save, () => this.save(), 'btn btn-primary'),
    );
    box.append(colours, brushes, this.stampRow, actions);
    return box;
  }

  private pick(i: number): void {
    this.colour = i;
    this.stamp = null;
  }

  private refreshStamps(): void {
    this.stampRow.textContent = '';
    const g = this.game();
    if (!g) return;
    for (const n of g.world.nubbins.slice(0, PAINT.maxStamps)) {
      const c = nubbinPortrait(g, n);
      const b = button('', () => (this.stamp = c), 'btn paint-stamp');
      b.style.cssText = 'min-width:44px;min-height:44px;padding:2px';
      b.setAttribute('aria-label', PAINT_TEXT.stamp(n.name));
      b.appendChild(c);
      this.stampRow.appendChild(b);
    }
  }

  private pt(e: PointerEvent): Pt {
    const r = this.canvas.getBoundingClientRect();
    return {
      x: Math.floor(((e.clientX - r.left) / r.width) * PAINT.size),
      y: Math.floor(((e.clientY - r.top) / r.height) * PAINT.size),
    };
  }

  private dot(p: Pt): void {
    const c = this.canvas.getContext('2d');
    if (!c) return;
    const w = PAINT.brushes[this.brush] ?? 3;
    c.fillStyle = PALETTE[PAINT.palette[this.colour] ?? 0] ?? '#000';
    c.fillRect(p.x - Math.floor(w / 2), p.y - Math.floor(w / 2), w, w);
  }

  private line(a: Pt, b: Pt): void {
    const steps = Math.max(Math.abs(b.x - a.x), Math.abs(b.y - a.y), 1);
    for (let i = 1; i <= steps; i++)
      this.dot({
        x: Math.round(a.x + ((b.x - a.x) * i) / steps),
        y: Math.round(a.y + ((b.y - a.y) * i) / steps),
      });
  }

  private putStamp(p: Pt): void {
    const c = this.canvas.getContext('2d');
    if (!c || !this.stamp || this.stamp.width === 0) return;
    c.imageSmoothingEnabled = false;
    c.drawImage(this.stamp, p.x - (this.stamp.width >> 1), p.y - (this.stamp.height >> 1));
  }

  private clear(): void {
    const c = this.canvas.getContext('2d');
    if (!c) return;
    c.fillStyle = PAPER;
    c.fillRect(0, 0, PAINT.size, PAINT.size);
  }

  private save(): void {
    const g = this.game();
    if (!g) return;
    let data: string;
    try {
      data = this.canvas.toDataURL('image/png');
    } catch {
      this.status.textContent = PAINT_TEXT.failed;
      return;
    }
    if (data.length > PAINT.maxChars) {
      this.status.textContent = PAINT_TEXT.tooBig;
      return;
    }
    g.send({ kind: 'saveDrawing', data });
    this.status.textContent = PAINT_TEXT.saved;
    this.onSaved?.();
  }
}
