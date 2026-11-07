import type { GroundJob, GroundResult } from './ground.worker';

/**
 * HOT (load time): the Grove's quick stand-in ground (the 4-a-unit painting of the bare
 * field the scene shows until its full painting lands) is painted in a worker while the
 * title is up, so picking a slot never waits on it. Kept tiny on purpose: the title
 * imports it, and it must not pull the scene or three.js into the first chunk.
 */
let standIn: GroundResult | null = null;
let started = false;

/** Start painting the stand-in off the main thread (once; quietly does nothing without workers). */
export function prepaintGround(): void {
  if (started || typeof Worker === 'undefined') return;
  started = true;
  try {
    const worker = new Worker(new URL('./ground.worker.ts', import.meta.url), { type: 'module' });
    worker.onmessage = (e: MessageEvent<GroundResult>) => {
      standIn = e.data;
      worker.terminate();
    };
    worker.onerror = () => worker.terminate();
    worker.postMessage({ id: 0, seed: 7, tiles: {}, ppu: 4 } satisfies GroundJob);
  } catch {
    // The scene paints its own stand-in.
  }
}

/** The stand-in painting, once it has landed (it is handed over once). */
export function takeGroundStandIn(): GroundResult | null {
  const p = standIn;
  standIn = null;
  return p;
}
