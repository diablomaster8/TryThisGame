/**
 * TECH-16: the shake meter. The carry chip is not shown while an egg is lifted by a drag (the
 * Keeper is not carrying it), so the meter floats over the field on its own: "Shake! ●●○○",
 * one dot per swing the gesture has counted, full for a moment when a shake lands. It reads
 * the input's `ShakeDetector` and the world; it sends nothing.
 */
import { SHAKE_METER_TEXT } from '../config/strings-r8d';
import { INPUT } from '../config/tuning';
import { SHAKE_METER } from '../config/tuning-r8d';
import type { Nubbin, World } from '../sim/types';

/** The egg a drag is holding and shaking, if any (a ready egg needs no more shaking). */
export function shakingEgg(world: World): Nubbin | null {
  return (
    world.nubbins.find(
      (n) => n.behavior.state === 'held' && n.stage === 'egg' && n.hatchRemainingMs > 0,
    ) ?? null
  );
}

/** Dots to fill: the swings so far, or all of them just after a shake landed. */
export function meterDots(progress: number, flashing: boolean): number {
  const of = INPUT.shakeReversalsPerSecond;
  return flashing ? of : Math.min(of, progress);
}

export class ShakeMeter {
  readonly root: HTMLDivElement;
  private shakes = -1;
  private eggId: string | null = null;
  private flashUntil = 0;
  private shown = '';

  constructor(parent: HTMLElement) {
    this.root = document.createElement('div');
    this.root.className = 'shake-meter';
    this.root.hidden = true;
    parent.appendChild(this.root);
  }

  /** Each frame: `progress` is the detector's swings in its window. */
  update(world: World, progress: number, now: number): void {
    const egg = shakingEgg(world);
    if (!egg) {
      if (!this.root.hidden) this.root.hidden = true;
      this.eggId = null;
      return;
    }
    const count = egg.eggShakes ?? 0;
    if (egg.id === this.eggId && count > this.shakes) this.flashUntil = now + SHAKE_METER.flashMs;
    this.eggId = egg.id;
    this.shakes = count;
    const dots = meterDots(progress, now < this.flashUntil);
    const of = INPUT.shakeReversalsPerSecond;
    const text = SHAKE_METER_TEXT.meter(dots, of);
    if (text !== this.shown) {
      this.shown = text;
      this.root.textContent = text;
      this.root.setAttribute('aria-label', SHAKE_METER_TEXT.aria(dots, of));
      this.root.classList.toggle('full', dots >= of);
    }
    if (this.root.hidden) this.root.hidden = false;
  }
}
