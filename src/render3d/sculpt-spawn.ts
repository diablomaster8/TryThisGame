/**
 * Start the sculpt workers early: while the title is up, when Full 3D is the chosen
 * renderer. Measured at 4x CPU on a first visit, the page runs a 6-9 s task and then a 4-5 s
 * one between the 3D chunk's arrival and the first frame. A worker made inside them could not
 * start until they ended, and even a worker already running got nothing posted to it: the
 * page hands a new worker its messages only once it has had a free moment to see the worker
 * start. So the Keeper's surfaces, posted while the scene was built, reached the workers
 * 10 s or more late, and the veil waited on them. Made at the title, the workers are running
 * and known to be by the time a slot is picked, every surface reaches them the moment it is
 * posted, and they march while the page builds. `SculptFarm` adopts them. Kept tiny on
 * purpose: `main.ts` and the title import it, so it must not pull three.js or the species
 * into the first chunk.
 */

let started = false;
let spawned: Worker[] | null = null;
/** Workers whose script failed to load before the farm took them. */
const broken = new WeakSet<Worker>();

/** One worker per spare core, at most four: a phone keeps a core for the page. */
export function sculptWorkerCount(): number {
  const cores = typeof navigator !== 'undefined' ? navigator.hardwareConcurrency || 4 : 4;
  return Math.max(1, Math.min(4, cores - 1));
}

/** A new sculpt worker (throws where workers cannot be made). */
export function openSculptWorker(): Worker {
  return new Worker(new URL('./sculpt-worker.ts', import.meta.url), { type: 'module' });
}

/**
 * Start the workers (once; quietly does nothing without workers, and the farm makes its
 * own). Cheap to call more than once: the title calls it whenever Full 3D is picked.
 */
export function spawnSculptWorkers(): void {
  if (started || typeof Worker === 'undefined') return;
  started = true;
  const out: Worker[] = [];
  try {
    for (let i = 0; i < sculptWorkerCount(); i++) {
      const w = openSculptWorker();
      // Until the farm takes it: remember a failed load, so the farm never waits on it.
      w.onerror = (e) => {
        e.preventDefault();
        broken.add(w);
      };
      out.push(w);
    }
    spawned = out;
  } catch {
    for (const w of out) w.terminate();
  }
}

/** Let the early workers go (Pixel picked on the title after all); a later spawn starts afresh. */
export function dropSculptWorkers(): void {
  for (const w of spawned ?? []) w.terminate();
  spawned = null;
  started = false;
}

/** The early workers that loaded (handed over once), or an empty list. */
export function takeSculptWorkers(): Worker[] {
  const all = spawned ?? [];
  spawned = null;
  for (const w of all) if (broken.has(w)) w.terminate();
  return all.filter((w) => !broken.has(w));
}
