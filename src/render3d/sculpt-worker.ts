import {
  sculptData,
  toArrays,
  transferables,
  type SculptData,
  type SurfaceArrays,
} from '../samples/sculpt-spec';
import { BUILDER_RULES } from '../samples/species';
import { readSurfaces } from './sculpt-cache';
// The species modules register the named sculpt rules (stripes, spots, Fennel's fur...)
// as they load; the worker needs the same registry the page has.
import './looks';

/**
 * The sculpt worker: one surface per request, off the main thread. The page posts the
 * surface as plain data (`SculptData`: primitives, box, resolution, shades and colour and
 * fur rules by name) with its cache key. The worker answers from IndexedDB when it holds
 * that key at that version; otherwise it rebuilds the hooks from the rule registry,
 * marches and posts the position, normal, colour, glow and fur arrays
 * and the index back, transferred rather than copied. Reading the cache here means the
 * page never waits on storage while it builds the scene; the page writes what was marched
 * in one batch later (`SculptFarm.saveSoon`), so no write holds these reads up.
 */
export interface SculptRequest {
  job: number;
  data: SculptData;
  /** Where the surface is filed in the cache, and the version it must carry. */
  cache: { key: string; version: string } | null;
}

export interface SculptReply {
  job: number;
  surface: SurfaceArrays | null;
  /** True when the surface came from the cache rather than the marching. */
  cached: boolean;
  error?: string;
}

// Touch the builder's own rules so they register here (see `BUILDER_RULES`).
if (!BUILDER_RULES.every(Boolean)) throw new Error('sculpt rules missing');

/** Requests run one at a time, in order, so a worker's queue is the order it was given. */
let chain: Promise<void> = Promise.resolve();

self.onmessage = (e: MessageEvent<SculptRequest>) => {
  chain = chain.then(() => handle(e.data));
};

async function handle({ job, data, cache }: SculptRequest): Promise<void> {
  try {
    const stored = cache ? (await readSurfaces([cache]))[0] : null;
    const surface = stored ?? toArrays(sculptData(data));
    const reply: SculptReply = { job, surface, cached: !!stored };
    self.postMessage(reply, { transfer: transferables(surface) });
  } catch (err) {
    const reply: SculptReply = { job, surface: null, cached: false, error: String(err) };
    self.postMessage(reply);
  }
}
