/**
 * R0455 (TECH-13): the clock the race and Expedition screens run on.
 *
 * Normally it is the browser's frame time. On an `?e2e&still` load (main.ts calls `useStillTime`)
 * it steps exactly 1/60 s per frame from the first frame of each screen, so a run's framing
 * (camera, positions, count-in, bursts) comes out the same however slow the machine is, the way
 * the Grove's `frameClock` does for the garden.
 */
const STILL_STEP_MS = 1000 / 60;

let still = false;
let current = 0;

/** Switch the minigame screens to the fixed 1/60 s clock (an `?e2e&still` load only). */
export function useStillTime(on = true): void {
  still = on;
  current = 0;
}

/** Each screen calls this once per frame with the raw rAF time and uses the result throughout. */
export function minigameFrameMs(rawMs: number): number {
  if (!still) {
    current = rawMs;
    return rawMs;
  }
  current += STILL_STEP_MS;
  return current;
}

/** The time of the frame being drawn, for code that runs between frames (taps, event bursts). */
export function minigameNowMs(): number {
  return still ? current : performance.now();
}

/** A screen opening restarts the still clock so its first frame is the same every run. */
export function resetMinigameTime(): void {
  if (still) current = 0;
}
