import type { BufferGeometry } from 'three';
import { speciesSurfaces, surfaceData } from '../samples/species';
import {
  fromArrays,
  sculptCacheKey,
  sculptData,
  toArrays,
  type SculptData,
  type SurfaceArrays,
} from '../samples/sculpt-spec';
import { specForKey } from './looks';
import { readSurfaces, writeSurfaces } from './sculpt-cache';
import type { SculptReply, SculptRequest } from './sculpt-worker';

/**
 * Marching cubes off the main thread. A look's surfaces (torso, head, each limb) are
 * independent, so each goes out as plain data (`surfaceData`) and they fan out across a
 * few workers and come back as arrays. Each goes with its cache key (look, index,
 * resolution, spec hash): the worker answers from IndexedDB when it can and stores what it
 * marches (`sculpt-cache.ts`), so the page never waits on storage. In memory the result is kept by look and quality, so the
 * second Nubbin with a look builds without marching at all. Where workers are
 * unavailable (or one fails) the surfaces march on the main thread instead, one per
 * task, so a frame never waits on more than one.
 */
interface Job {
  req: SculptRequest;
  resolve: (r: { surface: SurfaceArrays; cached: boolean }) => void;
  reject: (e: Error) => void;
}

export class SculptFarm {
  /** Estimated work queued on each worker (see `cost`). */
  private readonly load = new Map<Worker, number>();
  private readonly all: Worker[] = [];
  private readonly queue: Job[] = [];
  private readonly running = new Map<number, { job: Job; worker: Worker; cost: number }>();
  private readonly cache = new Map<string, Promise<BufferGeometry[]>>();
  private nextJob = 1;
  private workers = true;
  /** Surfaces served from the IndexedDB cache and surfaces marched, since load. */
  readonly stats = { cached: 0, marched: 0 };
  /** Called as each surface lands (from the cache or a worker), for the loading bar. */
  onSurface: (() => void) | null = null;
  /**
   * Hold cache writes while true: a write transaction stalls every cache read behind its
   * commit, so the pool keeps this on until the opening Grove is built.
   */
  holdWrites = true;
  private readonly unsaved: Parameters<typeof writeSurfaces>[0] = [];
  private saveTimer: ReturnType<typeof setTimeout> | null = null;

  constructor(count = SculptFarm.defaultCount()) {
    if (typeof Worker === 'undefined') {
      this.workers = false;
      return;
    }
    try {
      for (let i = 0; i < count; i++) {
        const w = new Worker(new URL('./sculpt-worker.ts', import.meta.url), { type: 'module' });
        w.onmessage = (e: MessageEvent<SculptReply>) => this.done(w, e.data);
        w.onerror = (e) => this.fail(w, e);
        this.all.push(w);
        this.load.set(w, 0);
      }
    } catch {
      this.fallBack();
    }
  }

  /** One worker per spare core, at most four: a phone keeps a core for the page. */
  static defaultCount(): number {
    const cores = typeof navigator !== 'undefined' ? navigator.hardwareConcurrency || 4 : 4;
    return Math.max(1, Math.min(4, cores - 1));
  }

  /** Whether surfaces march in workers (false: on the main thread, one per task). */
  get threaded(): boolean {
    return this.workers;
  }

  /** How many surfaces a look has, for the loading bar's total. */
  surfaceCount(key: string): number {
    return speciesSurfaces(specForKey(key)).length;
  }

  /**
   * The marched surfaces of a look at a grid quality (1 = the authored resolution), in
   * `speciesSurfaces` order. Cached by key and quality: callers that mutate a geometry
   * (`buildSpecies` translates them) must clone it first.
   */
  surfaces(key: string, quality = 1): Promise<BufferGeometry[]> {
    const memo = `${key}@${quality}`;
    let p = this.cache.get(memo);
    if (!p) {
      p = this.build(key, quality);
      this.cache.set(memo, p);
      // A failed look can be asked for again rather than staying broken.
      p.catch(() => this.cache.delete(memo));
    }
    return p;
  }

  /** Drop a look's surfaces from memory; the next ask reads them back from IndexedDB. */
  forget(key: string, quality = 1): void {
    this.cache.delete(`${key}@${quality}`);
  }

  /** Write the surfaces marched since the last write, in one batch, a moment from now. */
  saveSoon(): void {
    if (this.holdWrites || this.saveTimer || !this.unsaved.length) return;
    this.saveTimer = setTimeout(() => {
      this.saveTimer = null;
      void writeSurfaces(this.unsaved.splice(0));
    }, 1000);
  }

  dispose(): void {
    for (const w of this.all) w.terminate();
    this.all.length = 0;
    this.load.clear();
  }

  private build(key: string, quality: number): Promise<BufferGeometry[]> {
    const spec = specForKey(key);
    const datas = speciesSurfaces(spec).map((s) => surfaceData(spec, s, quality));
    // Every surface is queued now, synchronously, so the workers start at once.
    return Promise.all(
      datas.map(async (d, i) => {
        const id = sculptCacheKey(key, i, d);
        const { surface, cached } = await this.run(d, id);
        if (cached) this.stats.cached++;
        else {
          this.stats.marched++;
          this.unsaved.push({ ...id, surface });
          this.saveSoon();
        }
        this.onSurface?.();
        return fromArrays(surface);
      }),
    );
  }

  private run(
    data: SculptData,
    cache: SculptRequest['cache'],
  ): Promise<{ surface: SurfaceArrays; cached: boolean }> {
    return new Promise((resolve, reject) => {
      this.queue.push({ req: { job: this.nextJob++, data, cache }, resolve, reject });
      this.pump();
    });
  }

  private pump(): void {
    if (!this.workers) {
      this.pumpMain();
      return;
    }
    // Everything goes out at once, to the least-loaded worker: each works through its own
    // queue without waiting on the page, which is busy building the scene meanwhile.
    while (this.queue.length && this.all.length) {
      const job = this.queue.shift()!;
      let worker = this.all[0]!;
      for (const w of this.all) if (this.load.get(w)! < this.load.get(worker)!) worker = w;
      const cost = SculptFarm.cost(job.req.data);
      this.load.set(worker, this.load.get(worker)! + cost);
      this.running.set(job.req.job, { job, worker, cost });
      worker.postMessage(job.req);
    }
  }

  /** Rough marching cost of a surface: the grid's voxels, weighted by its primitives. */
  static cost(d: SculptData): number {
    return d.res ** 3 * (2 + d.prims.length);
  }

  private mainBusy = false;

  /** The fallback: march one surface per task on the main thread. */
  private pumpMain(): void {
    if (this.mainBusy || !this.queue.length) return;
    this.mainBusy = true;
    setTimeout(async () => {
      const job = this.queue.shift();
      if (job) {
        try {
          const c = job.req.cache;
          const stored = c ? (await readSurfaces([c]))[0] : null;
          const surface = stored ?? toArrays(sculptData(job.req.data));
          job.resolve({ surface, cached: !!stored });
        } catch (e) {
          job.reject(e as Error);
        }
      }
      this.mainBusy = false;
      this.pumpMain();
    }, 0);
  }

  private done(worker: Worker, reply: SculptReply): void {
    const r = this.running.get(reply.job);
    this.running.delete(reply.job);
    if (r) this.load.set(worker, (this.load.get(worker) ?? 0) - r.cost);
    if (r && reply.surface) r.job.resolve({ surface: reply.surface, cached: reply.cached });
    else if (r) {
      // The worker could not march it (a rule its bundle lacks, say): the page can.
      console.warn(`[3d] sculpt worker: ${reply.error}; marching on the page`);
      try {
        r.job.resolve({ surface: toArrays(sculptData(r.job.req.data)), cached: false });
      } catch (e) {
        r.job.reject(e as Error);
      }
    }
    this.pump();
  }

  /** A worker that cannot load or crashes: every job goes back to the main thread. */
  private fail(worker: Worker, e: ErrorEvent): void {
    if (import.meta.env.DEV) console.warn('[3d] sculpt worker failed; marching on the page', e);
    e.preventDefault();
    for (const [id, r] of this.running) {
      if (r.worker !== worker) continue;
      this.running.delete(id);
      this.queue.unshift(r.job);
    }
    this.fallBack();
  }

  private fallBack(): void {
    for (const r of this.running.values()) this.queue.unshift(r.job);
    this.running.clear();
    this.dispose();
    this.workers = false;
    this.pump();
  }
}
