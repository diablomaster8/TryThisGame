import { UI_TEXT } from '../config/strings';
import { UI } from '../config/tuning';

/** Tiny frame counter overlay, updated once a second. */
export class FpsCounter {
  readonly element: HTMLDivElement;
  private frames = 0;
  private windowStart = 0;

  constructor(parent: HTMLElement) {
    this.element = document.createElement('div');
    this.element.className = 'fps';
    this.element.setAttribute('aria-live', 'off');
    this.element.textContent = UI_TEXT.fps(0);
    parent.appendChild(this.element);
  }

  tick(nowMs: number): void {
    if (this.windowStart === 0) this.windowStart = nowMs;
    this.frames += 1;
    const elapsed = nowMs - this.windowStart;
    if (elapsed >= UI.fpsUpdateMs) {
      const fps = Math.round((this.frames * 1000) / elapsed);
      this.element.textContent = UI_TEXT.fps(fps);
      this.frames = 0;
      this.windowStart = nowMs;
    }
  }

  /** Reset the window after a pause so the first visible second is not skewed. */
  reset(): void {
    this.frames = 0;
    this.windowStart = 0;
  }
}
