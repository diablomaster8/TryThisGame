import { SIM } from '../config/tuning';

export type TimeScale = (typeof SIM.timeScales)[number];

/**
 * The one clock. Real time goes in, fixed sim steps come out. The time scale
 * multiplies real time before it is split into steps, so ×1000 means a thousand
 * sim seconds per real second.
 */
export class Clock {
  private scale: number = 1;
  private accumulatorMs = 0;

  constructor(readonly stepMs: number = SIM.stepMs) {}

  get timeScale(): number {
    return this.scale;
  }

  setTimeScale(scale: number): void {
    if (!(scale > 0) || !Number.isFinite(scale)) throw new Error(`Bad time scale ${scale}`);
    this.scale = scale;
  }

  /**
   * Feed real elapsed time. Returns how many whole steps are due, capped at `maxSteps`;
   * the overflow stays in the accumulator (callers may drain it with `takeOverflowMs`).
   */
  advance(realDeltaMs: number, maxSteps: number = SIM.maxStepsPerFrame): number {
    if (realDeltaMs > 0) this.accumulatorMs += realDeltaMs * this.scale;
    const due = Math.floor(this.accumulatorMs / this.stepMs);
    const steps = Math.min(due, maxSteps);
    this.accumulatorMs -= steps * this.stepMs;
    return steps;
  }

  /**
   * TECH-54: steps `advance` handed out that the frame had no time to run go back in the
   * accumulator, so they run on a later frame through this same path and no sim time is lost.
   */
  giveBack(steps: number): void {
    if (steps > 0) this.accumulatorMs += steps * this.stepMs;
  }

  /** Fraction of the way to the next step, for render interpolation. */
  get alpha(): number {
    return Math.min(1, this.accumulatorMs / this.stepMs);
  }

  /**
   * Remove and return the sim ms still waiting in whole multiples of `unitMs` (one step by
   * default), for coarse catch-up when far behind. Anything under a unit stays for later
   * frames, so no time is lost at high scales.
   */
  takeOverflowMs(unitMs: number = this.stepMs): number {
    const whole = Math.floor(this.accumulatorMs / unitMs) * unitMs;
    this.accumulatorMs -= whole;
    return whole;
  }

  /** Drop whatever sim time is waiting past `maxMs`, when the steps cannot keep up. */
  capBacklog(maxMs: number): void {
    this.accumulatorMs = Math.min(this.accumulatorMs, Math.max(0, maxMs));
  }

  reset(): void {
    this.accumulatorMs = 0;
  }
}

/** Split a long span into coarse and fine steps. Pure, for tests and offline catch-up. */
export function splitSpan(
  totalMs: number,
  coarseStepMs: number = SIM.coarseStepMs,
  fineStepMs: number = SIM.stepMs,
  coarseAfterMs: number = SIM.coarseAfterMs,
): { coarseSteps: number; fineSteps: number } {
  if (totalMs <= 0) return { coarseSteps: 0, fineSteps: 0 };
  if (totalMs <= coarseAfterMs) {
    return { coarseSteps: 0, fineSteps: Math.floor(totalMs / fineStepMs) };
  }
  const coarseSteps = Math.floor(totalMs / coarseStepMs);
  const remainder = totalMs - coarseSteps * coarseStepMs;
  return { coarseSteps, fineSteps: Math.floor(remainder / fineStepMs) };
}
