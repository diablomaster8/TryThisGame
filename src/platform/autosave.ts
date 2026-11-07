/**
 * hot/perf-leaks E4: the periodic autosave, taken off the animation frame.
 *
 * The 30 s autosave used to serialise and write inside the frame that noticed it was due (and,
 * every 2 minutes, draw the whole scene a second time for the slot picture). Now the frame only
 * asks; the write runs in the next idle slice long enough for it (`requestIdleCallback`, with a
 * deadline so it always happens; a plain task where the browser has no idle callbacks).
 *
 * The write is one synchronous unit, so it can never see half a sim step: render and UI never
 * change the world and commands apply at sim steps, which run inside frames, never inside this
 * task. A step that lands between the request and the write is simply in the save. Saves that
 * must not wait (tab hidden, page hide, slot switch, import, the Settings button) stay
 * synchronous through `Game.save`, which first drops a waiting request: the save it writes is
 * the newer one.
 */
import { serialize } from '../sim/save';
import type { World } from '../sim/types';
import { writeSave } from './storage';

/** Serialise `world` and write it to the slot in play: the one write every save path takes. */
export function writeWorld(world: World, savedAtWallMs: number): boolean {
  return writeSave(serialize(world, savedAtWallMs), { savedAtWallMs, world });
}

/** The parts of `IdleDeadline` the queue reads. */
export interface IdleSlice {
  readonly didTimeout: boolean;
  timeRemaining(): number;
}

export interface AutosaveHost {
  /** Run `cb` in idle time, `timeoutMs` at the latest; answers a function that cancels it. */
  idle(cb: (slice: IdleSlice) => void, timeoutMs: number): () => void;
  /** Milliseconds, monotonic. */
  now(): number;
}

/** How long a waiting autosave may wait for a long-enough idle slice before it runs anyway. */
export const AUTOSAVE_MAX_WAIT_MS = 2000;

/** The browser's idle callbacks, or a plain task right after the frame where there are none. */
export function browserIdle(cb: (slice: IdleSlice) => void, timeoutMs: number): () => void {
  if (typeof requestIdleCallback === 'function') {
    const id = requestIdleCallback(cb, { timeout: timeoutMs });
    return () => cancelIdleCallback(id);
  }
  const id = setTimeout(() => cb({ didTimeout: true, timeRemaining: () => 0 }), 0);
  return () => clearTimeout(id);
}

export class AutosaveQueue {
  private cancel: (() => void) | null = null;
  private job: (() => void) | null = null;
  private deadline = 0;
  /** What the last write cost (ms), so a slice shorter than that waits for a longer one. */
  costMs = 1;

  constructor(private readonly host: AutosaveHost) {}

  /** An autosave is waiting for its idle slice. */
  get pending(): boolean {
    return this.job !== null;
  }

  /** Run `write` in the next idle slice that fits it. A request already waiting is kept. */
  request(write: () => void): void {
    if (this.job) return;
    this.job = write;
    this.deadline = this.host.now() + AUTOSAVE_MAX_WAIT_MS;
    this.schedule(AUTOSAVE_MAX_WAIT_MS);
  }

  /** Forget a waiting request (a synchronous save is about to write the newer state). */
  drop(): void {
    this.cancel?.();
    this.cancel = null;
    this.job = null;
  }

  private schedule(timeoutMs: number): void {
    this.cancel = this.host.idle((slice) => this.onSlice(slice), Math.max(1, timeoutMs));
  }

  private onSlice(slice: IdleSlice): void {
    this.cancel = null;
    const job = this.job;
    if (!job) return;
    const left = this.deadline - this.host.now();
    if (!slice.didTimeout && left > 0 && slice.timeRemaining() < this.costMs) {
      this.schedule(left);
      return;
    }
    this.job = null;
    const t = this.host.now();
    job();
    // An idle slice is at most 50 ms: never wait for one longer than that can be.
    this.costMs = Math.min(40, Math.max(0.5, this.host.now() - t));
  }
}
