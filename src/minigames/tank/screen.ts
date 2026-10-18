import { TEN_TEXT, UI_TEXT } from '../../config/strings';
import { TANK } from '../../config/tuning';
import { createTank, steer, stepTank, type TankState, type TankThing } from '../../sim/tank';
import { button, el } from '../../ui/dom';

/**
 * The Beetle Run on a canvas: a side-on cave with three lanes stacked in depth, the
 * cart on the left, hazards and loot scrolling in from the right. Up/down keys or a
 * tap above or below the cart change lane. The sim is pure; this draws it.
 */
const VIEW_W = 360;
const VIEW_H = 200;
const SCALE = 3;

const COLORS: Record<TankThing, string> = {
  spore: '#b56bd6',
  rock: '#8a8294',
  acid: '#8fe05a',
  shell: '#f2d34c',
  wood: '#b07c34',
  stone: '#c2c2cc',
};

export class TankScreen {
  private readonly root: HTMLDivElement;
  private readonly canvas: HTMLCanvasElement;
  private readonly ctx: CanvasRenderingContext2D;
  private readonly hud: HTMLDivElement;
  private readonly results: HTMLDivElement;
  private readonly resultsBody: HTMLDivElement;
  private state: TankState | null = null;
  private rafId = 0;
  private lastMs = 0;
  private accMs = 0;
  private flashMs = 0;
  private onDone: ((s: TankState) => void) | null = null;

  constructor(parent: HTMLElement) {
    this.root = el('div', 'expedition tank');
    this.root.hidden = true;
    this.canvas = document.createElement('canvas');
    this.canvas.className = 'expedition-canvas';
    this.canvas.width = VIEW_W * SCALE;
    this.canvas.height = VIEW_H * SCALE;
    const ctx = this.canvas.getContext('2d');
    if (!ctx) throw new Error('2D canvas context unavailable');
    this.ctx = ctx;
    this.hud = el('div', 'expedition-hud');
    const quit = button(UI_TEXT.quitMinigame, () => this.finish(), 'btn btn-icon quit');
    this.results = el('div', 'expedition-results');
    this.results.hidden = true;
    this.resultsBody = el('div');
    this.results.append(
      el('h2', undefined, TEN_TEXT.tank),
      this.resultsBody,
      button(UI_TEXT.close, () => this.closeResults(), 'btn btn-primary'),
    );
    this.root.append(this.canvas, this.hud, quit, this.results);
    parent.appendChild(this.root);
    this.canvas.addEventListener('pointerdown', (e) => {
      if (!this.state) return;
      const rect = this.canvas.getBoundingClientRect();
      const y = (e.clientY - rect.top) / rect.height;
      const laneY = this.laneY(this.state.lane, this.state) / VIEW_H;
      steer(this.state, y < laneY ? -1 : 1);
    });
    window.addEventListener('keydown', (e) => {
      if (!this.state || this.root.hidden) return;
      // Escape leaves the run (keeping the cargo, like ✕), then closes the results.
      if (e.key === 'Escape' && !e.repeat) {
        if (this.results.hidden) this.finish();
        else this.closeResults();
        return;
      }
      if (e.key === 'ArrowUp' || e.key === 'w') steer(this.state, -1);
      if (e.key === 'ArrowDown' || e.key === 's') steer(this.state, 1);
    });
  }

  get isOpen(): boolean {
    return !this.root.hidden;
  }

  start(seed: number, onDone: (s: TankState) => void): void {
    this.state = createTank(seed);
    this.onDone = onDone;
    this.results.hidden = true;
    this.root.hidden = false;
    this.lastMs = performance.now();
    this.accMs = 0;
    cancelAnimationFrame(this.rafId);
    this.rafId = requestAnimationFrame(this.frame);
  }

  private laneY(lane: number, s: TankState): number {
    // The cart tweens between lanes.
    const from = 96 + s.laneFrom * 34;
    const to = 96 + lane * 34;
    return from + (to - from) * s.laneT;
  }

  private readonly frame = (now: number): void => {
    const s = this.state;
    if (!s) return;
    const dt = Math.min(100, now - this.lastMs);
    this.lastMs = now;
    this.accMs += dt;
    while (this.accMs >= 16) {
      const hits = stepTank(s, 16);
      for (const h of hits) if (h.hit) this.flashMs = 200;
      this.accMs -= 16;
    }
    this.flashMs = Math.max(0, this.flashMs - dt);
    this.draw(s);
    this.hud.textContent = `${TEN_TEXT.tankCargo(s.cargoCount, TANK.cargo)} · ${TEN_TEXT.tankHits(s.hits)} · ${Math.round((s.distance / TANK.lengthUnits) * 100)}%`;
    if (s.finished) {
      this.showResults(s);
      return;
    }
    this.rafId = requestAnimationFrame(this.frame);
  };

  private draw(s: TankState): void {
    const c = this.ctx;
    c.setTransform(SCALE, 0, 0, SCALE, 0, 0);
    c.imageSmoothingEnabled = false;
    // Cave: dark rock above and below, three floor lanes in the middle.
    c.fillStyle = '#120e1a';
    c.fillRect(0, 0, VIEW_W, VIEW_H);
    const grad = c.createLinearGradient(0, 60, 0, 190);
    grad.addColorStop(0, '#3a3148');
    grad.addColorStop(1, '#241d33');
    c.fillStyle = grad;
    c.fillRect(0, 70, VIEW_W, 110);
    // Stalactites that scroll slowly.
    c.fillStyle = '#2a2336';
    for (let i = 0; i < 12; i++) {
      const x = ((i * 37 - s.distance * 6) % (VIEW_W + 40)) - 20;
      const h = 20 + ((i * 13) % 25);
      c.beginPath();
      c.moveTo(x, 0);
      c.lineTo(x + 10, 0);
      c.lineTo(x + 5, h);
      c.closePath();
      c.fill();
    }
    for (let lane = 0; lane < TANK.lanes; lane++) {
      const y = 96 + lane * 34;
      c.fillStyle = lane % 2 ? '#4a3f5a' : '#55496a';
      c.fillRect(0, y + 10, VIEW_W, 24);
      c.fillStyle = '#2f2740';
      for (let x = ((-s.distance * 12) % 24) - 24; x < VIEW_W; x += 24)
        c.fillRect(x, y + 32, 12, 2);
    }
    // Torches on the far wall.
    for (let i = 0; i < 6; i++) {
      const x = ((i * 80 - s.distance * 10) % (VIEW_W + 80)) - 40;
      c.fillStyle = '#ff9a2a';
      c.fillRect(x, 60, 3, 6);
      c.fillStyle = 'rgba(255,170,60,0.12)';
      c.beginPath();
      c.arc(x + 1, 62, 26, 0, Math.PI * 2);
      c.fill();
    }
    // Entities within view: the cart sits at x = 60; things ahead scroll in from the right.
    const px = 60;
    const ppu = 12;
    for (const e of s.entities) {
      if (e.taken) continue;
      const x = px + (e.at - s.distance) * ppu;
      if (x < -20 || x > VIEW_W + 20) continue;
      const y = 96 + e.lane * 34 + 20;
      c.fillStyle = COLORS[e.kind];
      if (e.kind === 'spore') {
        c.beginPath();
        c.arc(x, y - 4, 6, 0, Math.PI * 2);
        c.fill();
        c.fillStyle = '#e0b0f0';
        c.fillRect(x - 2, y - 7, 2, 2);
      } else if (e.kind === 'rock') {
        c.beginPath();
        c.moveTo(x - 8, y + 2);
        c.lineTo(x - 4, y - 8);
        c.lineTo(x + 5, y - 6);
        c.lineTo(x + 8, y + 2);
        c.closePath();
        c.fill();
      } else if (e.kind === 'acid') {
        c.fillRect(x - 9, y - 2, 18, 4);
        c.fillStyle = '#d8ff9a';
        c.fillRect(x - 6, y - 3, 3, 1);
      } else if (e.kind === 'shell') {
        c.beginPath();
        c.arc(x, y - 4, 4, 0, Math.PI * 2);
        c.fill();
        c.fillStyle = '#fff6c0';
        c.fillRect(x - 1, y - 6, 2, 2);
      } else if (e.kind === 'wood') {
        c.fillRect(x - 7, y - 6, 14, 6);
        c.fillStyle = '#d9a76a';
        c.fillRect(x - 7, y - 6, 14, 1);
      } else {
        c.beginPath();
        c.arc(x, y - 3, 5, 0, Math.PI * 2);
        c.fill();
      }
    }
    // The boss door at the end.
    const doorX = px + (TANK.lengthUnits - s.distance) * ppu;
    if (doorX < VIEW_W + 30) {
      c.fillStyle = '#5a4a2a';
      c.fillRect(doorX, 70, 22, 110);
      c.fillStyle = '#e0b84a';
      c.fillRect(doorX + 8, 120, 5, 8);
    }
    // The cart.
    const cy = this.laneY(s.lane, s) + 20;
    const stunned = s.stunMs > 0 && Math.floor(s.timeMs / 60) % 2 === 0;
    c.fillStyle = stunned ? '#ff6b5a' : '#8a5a32';
    c.fillRect(px - 14, cy - 10, 28, 10);
    c.fillStyle = stunned ? '#ff9a8a' : '#b07c34';
    c.fillRect(px - 12, cy - 16, 24, 6);
    c.fillStyle = '#2a2030';
    c.beginPath();
    c.arc(px - 8, cy + 1, 4, 0, Math.PI * 2);
    c.arc(px + 8, cy + 1, 4, 0, Math.PI * 2);
    c.fill();
    // Cargo pile grows with the haul.
    for (let i = 0; i < s.cargoCount; i++) {
      c.fillStyle = ['#f2d34c', '#b07c34', '#c2c2cc'][i % 3]!;
      c.fillRect(px - 10 + (i % 4) * 5, cy - 20 - Math.floor(i / 4) * 4, 4, 3);
    }
    // A lamp on the cart lights the way.
    c.fillStyle = 'rgba(255,220,140,0.10)';
    c.beginPath();
    c.moveTo(px + 14, cy - 12);
    c.lineTo(px + 120, cy - 60);
    c.lineTo(px + 120, cy + 30);
    c.closePath();
    c.fill();
    if (this.flashMs > 0) {
      c.fillStyle = `rgba(255,80,80,${(this.flashMs / 200) * 0.3})`;
      c.fillRect(0, 0, VIEW_W, VIEW_H);
    }
  }

  private showResults(s: TankState): void {
    cancelAnimationFrame(this.rafId);
    this.resultsBody.textContent = s.won
      ? TEN_TEXT.tankWon(s.cargo.shells, s.cargo.wood, s.cargo.stone)
      : TEN_TEXT.tankLost(s.cargo.shells);
    this.results.hidden = false;
  }

  private closeResults(): void {
    const s = this.state;
    this.results.hidden = true;
    this.root.hidden = true;
    this.state = null;
    const done = this.onDone;
    this.onDone = null;
    if (s) done?.(s);
  }

  /** Leaving early keeps what was gathered so far. */
  private finish(): void {
    const s = this.state;
    if (!s) return;
    s.finished = true;
    this.showResults(s);
  }
}
