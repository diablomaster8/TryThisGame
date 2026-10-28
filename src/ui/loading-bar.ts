import { UI_TEXT } from '../config/strings';
import { GROVE3D } from '../config/tuning';

/**
 * The longest the veil waits. Past it something has failed (a sculpt worker, a texture),
 * and the Grove is better shown with its warm stand-ins than hidden for good. Never a
 * shortcut: the veil otherwise lifts only when every figure stands as itself.
 */
export const LOAD_SAFETY_MS = GROVE3D.loadSafetyMs;

/**
 * The veil from the moment a slot is picked until the Grove is interactive, in both modes:
 * while the boot's chunks download it creeps along on `step`, then in Full 3D it follows
 * the scene's `loadState` (covering the stand-ins until every figure is built), and in
 * Pixel it lifts on the first drawn frame. The time it took is kept on
 * `window.__groveLoadMs` (from page start) for device passes.
 */
export class LoadingBar {
  private readonly veil: HTMLDivElement;
  private readonly fill: HTMLSpanElement;
  private readonly label: HTMLDivElement;
  private finished = false;
  private startMs = performance.now();
  private shown = 0;

  constructor(parent: HTMLElement) {
    this.veil = document.createElement('div');
    this.veil.className = 'load-veil';
    this.veil.setAttribute('role', 'progressbar');
    this.veil.setAttribute('aria-label', UI_TEXT.loading3d);
    this.veil.setAttribute('aria-valuemin', '0');
    this.veil.setAttribute('aria-valuemax', '100');
    const label = document.createElement('div');
    label.textContent = UI_TEXT.loading3d;
    this.label = label;
    const bar = document.createElement('div');
    bar.className = 'load-bar';
    this.fill = document.createElement('span');
    bar.appendChild(this.fill);
    this.veil.append(label, bar);
    parent.appendChild(this.veil);
  }

  /** Say what is loading: a save that opens underground is not "Shaping the Grove" (R0142). */
  setLabel(text: string): void {
    this.label.textContent = text;
    this.veil.setAttribute('aria-label', text);
  }

  get done(): boolean {
    return this.finished;
  }

  /** Boot progress before the scene exists: never backwards, never past `progress`. */
  step(progress: number): void {
    if (this.finished || progress <= this.shown) return;
    this.setFill(progress);
  }

  /** The scene starts building now: the safety window counts from here, not from the downloads. */
  restartClock(): void {
    this.startMs = performance.now();
  }

  /** The boot failed: take the veil down at once so the error card is not hidden behind it. */
  remove(): void {
    this.finished = true;
    this.veil.remove();
  }

  private setFill(progress: number): number {
    const pct = Math.round(Math.min(1, Math.max(0, progress)) * 100);
    this.shown = Math.max(this.shown, pct / 100);
    this.fill.style.width = `${pct}%`;
    this.veil.setAttribute('aria-valuenow', String(pct));
    return pct;
  }

  /** Show progress (0..1); `done` lifts the veil. */
  update(progress: number, done: boolean): void {
    if (this.finished) return;
    this.setFill(Math.max(progress, this.shown));
    if (!done && performance.now() - this.startMs < LOAD_SAFETY_MS) return;
    if (!done)
      console.warn(`[3d] veil lifted by its ${LOAD_SAFETY_MS / 1000} s safety; still building`);
    this.finished = true;
    const ms = Math.round(performance.now());
    (window as unknown as { __groveLoadMs?: number }).__groveLoadMs = ms;
    console.info(`[boot] Grove ready ${ms} ms after page start`);
    this.fill.style.width = '100%';
    this.veil.classList.add('is-done');
    setTimeout(() => this.veil.remove(), 450);
  }
}
