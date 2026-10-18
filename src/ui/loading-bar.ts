import { UI_TEXT } from '../config/strings';
import { GROVE3D } from '../config/tuning';

/**
 * The longest the veil waits. Past it something has failed (a sculpt worker, a texture),
 * and the Grove is better shown with its warm stand-ins than hidden for good. Never a
 * shortcut: the veil otherwise lifts only when every figure stands as itself.
 */
export const LOAD_SAFETY_MS = GROVE3D.loadSafetyMs;

/**
 * The veil over the 3D Grove while its creatures are sculpted: a label and a bar that
 * follows the scene's `loadState`. It covers the stand-ins until every figure is built,
 * then fades and goes. The time it took is kept on `window.__groveLoadMs` (from page
 * start) for device passes.
 */
export class LoadingBar {
  private readonly veil: HTMLDivElement;
  private readonly fill: HTMLSpanElement;
  private finished = false;
  private readonly startMs = performance.now();

  constructor(parent: HTMLElement) {
    this.veil = document.createElement('div');
    this.veil.className = 'load-veil';
    this.veil.setAttribute('role', 'progressbar');
    this.veil.setAttribute('aria-label', UI_TEXT.loading3d);
    this.veil.setAttribute('aria-valuemin', '0');
    this.veil.setAttribute('aria-valuemax', '100');
    const label = document.createElement('div');
    label.textContent = UI_TEXT.loading3d;
    const bar = document.createElement('div');
    bar.className = 'load-bar';
    this.fill = document.createElement('span');
    bar.appendChild(this.fill);
    this.veil.append(label, bar);
    parent.appendChild(this.veil);
  }

  get done(): boolean {
    return this.finished;
  }

  /** Show progress (0..1); `done` lifts the veil. */
  update(progress: number, done: boolean): void {
    if (this.finished) return;
    const pct = Math.round(Math.min(1, Math.max(0, progress)) * 100);
    this.fill.style.width = `${pct}%`;
    this.veil.setAttribute('aria-valuenow', String(pct));
    if (!done && performance.now() - this.startMs < LOAD_SAFETY_MS) return;
    if (!done)
      console.warn(`[3d] veil lifted by its ${LOAD_SAFETY_MS / 1000} s safety; still building`);
    this.finished = true;
    const ms = Math.round(performance.now());
    (window as unknown as { __groveLoadMs?: number }).__groveLoadMs = ms;
    console.info(`[3d] Grove ready ${ms} ms after page start`);
    this.fill.style.width = '100%';
    this.veil.classList.add('is-done');
    setTimeout(() => this.veil.remove(), 450);
  }
}
