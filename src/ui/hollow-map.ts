import { HOLLOW_MAP_TEXT as T } from '../config/strings';
import { GROVE3D } from '../config/tuning';
import { isGameKey } from '../input/keys';
import { cellOf, exploredMask, exploredRooms, floorOfRun, WALL, WATER } from '../sim/dungeon';
import type { World } from '../sim/types';
import { button, el } from './dom';

/**
 * The Hollow minimap (item 40): the cells the Keeper has seen, drawn from the sim's explored
 * mask. Seen rooms glow faintly, unseen ground stays dark. The Keeper, the stairs (once
 * seen) and the chest (once seen) are drawn as different shapes and named in a legend, so
 * colour is never the only signal. It reads sim state only, so it works in both renderers.
 * The panel sits under the floor bar at the top left, collapses with its button (or the M
 * key), closes on Escape, and stays clear of the Run button at the bottom. It redraws only
 * when the mask, the floor or the Keeper's cell changes, and has no animation of its own.
 */
export class HollowMap {
  /** The toggle, to sit in the floor bar. */
  readonly toggle: HTMLButtonElement;
  readonly panel: HTMLDivElement;
  private readonly canvas = el('canvas', 'hollow-map-canvas');
  private readonly g = this.canvas.getContext('2d');
  private open = false;
  private key = '';
  private underground = false;

  constructor(parent: HTMLElement) {
    this.toggle = button('🗺', () => this.set(!this.open), 'btn btn-small hollow-map-btn');
    this.toggle.setAttribute('aria-label', T.open);
    this.toggle.title = `${T.open} (M)`;
    this.toggle.setAttribute('aria-expanded', 'false');
    this.panel = el('div', 'hollow-map');
    this.panel.hidden = true;
    this.panel.setAttribute('role', 'region');
    this.panel.setAttribute('aria-label', T.open);
    const legend = el('div', 'hollow-map-legend');
    for (const [icon, label] of [
      ['●', T.you],
      ['▼', T.down],
      ['▲', T.up],
      ['■', T.chest],
    ] as const)
      legend.appendChild(el('span', undefined, `${icon} ${label}`));
    this.panel.append(this.canvas, legend);
    parent.appendChild(this.panel);
    // Collapsed by default on a phone-sized screen, where the cave matters more.
    this.open = window.innerWidth >= 700 && window.innerHeight >= 500;
    window.addEventListener('keydown', (e) => {
      if (!this.underground) return;
      if (e.key === 'Escape' && this.open) this.set(false);
      else if ((e.key === 'm' || e.key === 'M') && isGameKey(e) && !e.repeat) this.set(!this.open);
    });
  }

  private set(on: boolean): void {
    this.open = on;
    this.key = '';
    this.toggle.setAttribute('aria-expanded', String(on));
    this.panel.hidden = !on || !this.underground;
  }

  /** Called every frame by the floor bar. */
  refresh(world: World): void {
    const run = world.location === 'dungeon' ? world.dungeon : null;
    this.underground = !!run;
    this.toggle.hidden = !run;
    this.panel.hidden = !run || !this.open;
    if (!run || !this.open || !this.g) return;
    const f = floorOfRun(run);
    const kc = cellOf(f, world.keeper.pos);
    const key = `${run.seed}:${run.depth}:${run.explored}:${kc.x},${kc.y}:${run.chestOpen}`;
    if (key === this.key) return;
    this.key = key;
    const { maxPx } = GROVE3D.cave.read.map;
    const s = Math.max(2, Math.floor(maxPx / Math.max(f.cols, f.rows)));
    const w = f.cols * s;
    const h = f.rows * s;
    if (this.canvas.width !== w || this.canvas.height !== h) {
      this.canvas.width = w;
      this.canvas.height = h;
    }
    this.canvas.style.width = `${w}px`;
    this.canvas.style.height = `${h}px`;
    this.canvas.setAttribute('role', 'img');
    this.canvas.setAttribute('aria-label', T.label(run.depth));
    const g = this.g;
    g.clearRect(0, 0, w, h);
    g.fillStyle = '#0d0918';
    g.fillRect(0, 0, w, h);
    const mask = exploredMask(run, f);
    const seen = (x: number, y: number) =>
      x >= 0 && y >= 0 && x < f.cols && y < f.rows && mask[y * f.cols + x] === 1;
    const inRoom = new Uint8Array(f.cells.length);
    const lit = exploredRooms(run, f);
    f.rooms.forEach((r, i) => {
      if (!lit[i]) return;
      for (let y = r.y; y < r.y + r.h; y++)
        for (let x = r.x; x < r.x + r.w; x++) inRoom[y * f.cols + x] = 1;
    });
    const near = [
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1],
    ] as const;
    for (let y = 0; y < f.rows; y++)
      for (let x = 0; x < f.cols; x++) {
        if (!seen(x, y)) continue;
        const i = y * f.cols + x;
        const c = f.cells[i];
        if (c === WALL) {
          // Only the rock that borders open ground, so the outline reads and the rest stays dark.
          const edge = near.some(
            ([dx, dy]) => (f.cells[(y + dy) * f.cols + x + dx] ?? WALL) !== WALL,
          );
          if (!edge) continue;
          g.fillStyle = '#3a3258';
        } else if (c === WATER) g.fillStyle = inRoom[i] ? '#3d86ad' : '#2f6a8a';
        else g.fillStyle = inRoom[i] ? '#7a6bc0' : '#4a4378';
        g.fillRect(x * s, y * s, s, s);
      }
    const at = (c: { x: number; y: number }) => ({ x: (c.x + 0.5) * s, y: (c.y + 0.5) * s });
    const big = Math.max(5, s * 1.6);
    const mark = (c: { x: number; y: number }, draw: (x: number, y: number) => void) => {
      if (!seen(c.x, c.y)) return;
      const p = at(c);
      g.lineWidth = 2;
      g.strokeStyle = '#0d0918';
      draw(p.x, p.y);
    };
    const tri = (x: number, y: number, dir: 1 | -1) => {
      g.beginPath();
      g.moveTo(x - big, y - big * 0.8 * dir);
      g.lineTo(x + big, y - big * 0.8 * dir);
      g.lineTo(x, y + big * 0.9 * dir);
      g.closePath();
      g.stroke();
      g.fill();
    };
    mark(f.stairsUp, (x, y) => {
      g.fillStyle = '#9ad8ff';
      tri(x, y, -1);
    });
    if (f.stairsDown)
      mark(f.stairsDown, (x, y) => {
        g.fillStyle = '#ffd870';
        tri(x, y, 1);
      });
    mark(f.chest, (x, y) => {
      g.fillStyle = run.chestOpen ? '#a8a0b8' : '#ffb347';
      g.strokeRect(x - big * 0.8, y - big * 0.6, big * 1.6, big * 1.2);
      g.fillRect(x - big * 0.8, y - big * 0.6, big * 1.6, big * 1.2);
    });
    // The Keeper last: a ringed dot, always shown.
    const k = at(kc);
    g.beginPath();
    g.arc(k.x, k.y, big * 0.95, 0, Math.PI * 2);
    g.strokeStyle = '#0d0918';
    g.lineWidth = 3;
    g.stroke();
    g.fillStyle = '#ff6fa8';
    g.fill();
    g.strokeStyle = '#ffffff';
    g.lineWidth = 1.5;
    g.stroke();
  }
}
