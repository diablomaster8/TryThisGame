import { BufferAttribute, BufferGeometry } from 'three';
import { sculptSurface, speciesSurfaces } from '../samples/species';
import { specForKey } from './looks';
import type { SculptReply, SculptRequest } from './sculpt-worker';

/**
 * Marching cubes off the main thread. A look's surfaces (torso, head, each limb) are
 * independent, so they fan out across a few workers and come back as plain arrays; the
 * result is cached by look key, so the second Nubbin with a look builds without marching
 * at all. Where workers are unavailable (or one fails) the surfaces march on the main
 * thread instead, one per task, so a frame never waits on more than one.
 */
interface Job {
  req: SculptRequest;
  resolve: (g: BufferGeometry) => void;
  reject: (e: Error) => void;
}

const toGeometry = (attrs: SculptReply['attrs']): BufferGeometry => {
  const geo = new BufferGeometry();
  for (const a of attrs) geo.setAttribute(a.name, new BufferAttribute(a.array, a.itemSize));
  return geo;
};

export class SculptFarm {
  private readonly idle: Worker[] = [];
  private readonly all: Worker[] = [];
  private readonly queue: Job[] = [];
  private readonly running = new Map<number, { job: Job; worker: Worker }>();
  private readonly cache = new Map<string, Promise<BufferGeometry[]>>();
  private nextJob = 1;
  private workers = true;

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
        this.idle.push(w);
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

  /**
   * The marched surfaces of a look, in `speciesSurfaces` order. Cached by key: callers
   * that mutate a geometry (`buildSpecies` translates them) must clone it first.
   */
  surfaces(key: string): Promise<BufferGeometry[]> {
    let p = this.cache.get(key);
    if (!p) {
      const count = speciesSurfaces(specForKey(key)).length;
      const parts: Array<Promise<BufferGeometry>> = [];
      for (let index = 0; index < count; index++) parts.push(this.run(key, index));
      p = Promise.all(parts);
      this.cache.set(key, p);
      // A failed look can be asked for again rather than staying broken.
      p.catch(() => this.cache.delete(key));
    }
    return p;
  }

  dispose(): void {
    for (const w of this.all) w.terminate();
    this.all.length = 0;
    this.idle.length = 0;
  }

  private run(key: string, index: number): Promise<BufferGeometry> {
    return new Promise((resolve, reject) => {
      this.queue.push({ req: { job: this.nextJob++, key, index }, resolve, reject });
      this.pump();
    });
  }

  private pump(): void {
    if (!this.workers) {
      this.pumpMain();
      return;
    }
    while (this.idle.length && this.queue.length) {
      const worker = this.idle.pop()!;
      const job = this.queue.shift()!;
      this.running.set(job.req.job, { job, worker });
      worker.postMessage(job.req);
    }
  }

  private mainBusy = false;

  /** The fallback: march one surface per task on the main thread. */
  private pumpMain(): void {
    if (this.mainBusy || !this.queue.length) return;
    this.mainBusy = true;
    setTimeout(() => {
      const job = this.queue.shift();
      if (job) {
        try {
          const spec = specForKey(job.req.key);
          job.resolve(sculptSurface(spec, speciesSurfaces(spec)[job.req.index]!));
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
    this.idle.push(worker);
    if (r) {
      if (reply.error) r.job.reject(new Error(reply.error));
      else r.job.resolve(toGeometry(reply.attrs));
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
